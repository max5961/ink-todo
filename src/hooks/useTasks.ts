import { useState } from "react";
import { useInput, useApp } from "ink";
import DB, { Task, Tasks } from "../db/DB.js";
import Util from "../common/Util.js";
import Fetch from "./Fetch.js";

interface AppState {
    tasks: Task[];
    normal: boolean;
    addText: string;
    editText: string;
    idx: number;
    order: "NONE" | "INC_AO" | "DEC_AO" | "PRIORITY_LH" | "PRIORITY_HL";
}

export function useTasks(tasks: Tasks) {
    const initialState: AppState = {
        tasks,
        idx: 0,
        normal: true,
        addText: "",
        editText: "",
        order: "NONE",
    };

    const [state, setState] = useState(initialState);
    const { exit } = useApp();

    useInput((input, key) => {
        if (state.normal && input === "q") {
            Util.exit(exit);
        }

        if ((!state.normal && key.escape) || key.return) {
            handleEnterNormal();
        }

        if (state.normal) {
            if (input === "i" || input === "e") {
                enterInsert();
            }

            // navigation
            if (state.idx > 0) {
                if (key.upArrow || input === "k") {
                    setState({ ...state, idx: --state.idx });
                }
            }

            // navigation
            if (state.idx < state.tasks.length) {
                if (key.downArrow || input === "j") {
                    setState({ ...state, idx: ++state.idx });
                }
            }

            // Modify tasks
            if (state.idx > state.tasks.length - 1 || state.idx < 0) return;

            if (input === "D") {
                deleteTask();
            }

            if (input === "L") {
                changePriority("inc");
            }

            if (input === "H") {
                changePriority("dec");
            }
        }
    });

    function setText(newText: string, type: "EDIT" | "ADD"): void {
        const newState = { ...state };

        if (type === "EDIT") {
            newState.editText = newText;
        }

        if (type === "ADD") {
            newState.addText = newText;
        }

        setState(newState);
    }

    function setAddText(newText: string): void {
        setText(newText, "ADD");
    }

    function setEditText(newText: string): void {
        setText(newText, "EDIT");
    }

    function handleEnterNormal(): void {
        // Last index is the add button, anything previos is task
        if (state.idx === state.tasks.length) {
            addTask();
        } else {
            editTask();
        }
    }

    function enterInsert(): void {
        if (!state.normal) return;
        setState({ ...state, normal: false });
    }

    function enterNormal(): void {
        if (state.normal) return;
        setState({ ...state, normal: true });
    }

    async function changePriority(direction: "inc" | "dec"): Promise<void> {
        if (state.idx >= state.tasks.length) return;

        const task = { ...state.tasks[state.idx] };

        if (direction === "inc" && task.priority !== "high") {
            task.priority = task.priority === "low" ? "medium" : "high";
        }

        if (direction === "dec" && task.priority !== "low") {
            task.priority = task.priority === "high" ? "medium" : "low";
        }

        const newTasks = await Fetch.sendReq("PUT", task);

        if (newTasks) {
            setState({ ...state, tasks: newTasks });
        }
    }

    async function deleteTask(): Promise<void> {
        const toDelete = { ...state.tasks[state.idx] } as Task;

        const newTasks = await Fetch.sendReq("DELETE", toDelete);

        if (newTasks) {
            setState({ ...state, tasks: newTasks });
        }
    }

    async function editTask(): Promise<void> {
        if (state.editText === "") return enterNormal();

        const prev: Task = state.tasks[state.idx];

        const task: Task = {
            id: prev.id,
            priority: prev.priority,
            name: state.editText,
        };

        const newTasks = await Fetch.sendReq("PUT", task);

        if (!newTasks) return;

        setState({
            ...state,
            tasks: newTasks,
            normal: true,
            editText: "",
        });
    }

    async function addTask(): Promise<void> {
        if (state.addText === "") return enterNormal();

        const newTask: Task = {
            id: undefined,
            name: state.addText,
            priority: "low",
        };

        const newTasks = await Fetch.sendReq("POST", newTask);

        if (!newTasks) return;

        setState({
            ...state,
            normal: true,
            addText: "",
            tasks: newTasks,
        });
    }

    return { state, setAddText, setEditText };
}
