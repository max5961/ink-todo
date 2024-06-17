import { useState } from "react";
import { useInput, useApp } from "ink";
import DB, { Task, Tasks } from "../db/DB.js";

interface AppState {
    tasks: Task[];
    idx: number;
    normal: boolean;
    addText: string;
    editText: string;
}

export function useTasks(tasks: Tasks) {
    const initialState: AppState = {
        tasks,
        idx: 0,
        normal: true,
        addText: "",
        editText: "",
    };
    const [state, setState] = useState(initialState);
    const { exit } = useApp();

    useInput((input, key) => {
        if (state.normal && input === "q") {
            exit();
        }

        if ((!state.normal && key.escape) || key.return) {
            handleEnterNormal();
        }

        if (state.normal) {
            if (input === "i" || input === "e") {
                enterInsert();
            }

            if (state.idx > 0) {
                if (key.upArrow || input === "k") {
                    setState({ ...state, idx: --state.idx });
                }
            }

            if (state.idx < state.tasks.length) {
                if (key.downArrow || input === "j") {
                    setState({ ...state, idx: ++state.idx });
                }
            }

            if (state.idx > state.tasks.length - 1 || state.idx < 0) return;

            if (input === "D") {
                handleDeleteTask();
            }

            if (input === "L") {
                handleChangePriority("inc");
            }

            if (input === "H") {
                handleChangePriority("dec");
            }
        }
    });

    function cloneTasks(): Tasks {
        const copy: Tasks = [];

        for (let i = 0; i < state.tasks.length; ++i) {
            copy.push({ ...state.tasks[i] });
        }

        return copy;
    }

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
        if (state.idx === state.tasks.length) {
            handleAddTask();
        } else {
            handleEditTask();
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

    function handleChangePriority(direction: "inc" | "dec"): void {
        if (state.idx >= state.tasks.length) return;

        const copy: Tasks = cloneTasks();
        const currTask = copy[state.idx];

        if (direction === "inc" && currTask.priority !== "high") {
            currTask.priority = currTask.priority === "low" ? "medium" : "high";
        }

        if (direction === "dec" && currTask.priority !== "low") {
            currTask.priority = currTask.priority === "high" ? "medium" : "low";
        }

        setState({ ...state, tasks: copy });
        DB.saveDb(copy);
    }

    function handleDeleteTask(): void {
        const copy: Tasks = cloneTasks();
        copy.splice(state.idx, 1);

        setState({ ...state, tasks: copy });
        DB.saveDb(copy);
    }

    function handleEditTask(): void {
        if (state.editText === "") return enterNormal();

        const newTask: Task = {
            priority: state.tasks[state.idx].priority,
            name: state.editText,
        };

        const newTasks = cloneTasks();
        newTasks[state.idx] = newTask;

        setState({
            ...state,
            tasks: newTasks,
            normal: true,
            editText: "",
        });

        DB.saveDb(newTasks);
    }

    function handleAddTask(): void {
        if (state.addText === "") return enterNormal();

        const newTask: Task = {
            name: state.addText,
            priority: "low",
        };

        const newTasks = [...cloneTasks(), newTask];

        setState({
            ...state,
            normal: true,
            addText: "",
            tasks: newTasks,
        });

        DB.saveDb(newTasks);
    }

    return { state, setAddText, setEditText };
}
