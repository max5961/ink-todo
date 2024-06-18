import { useState } from "react";
import { useInput, useApp } from "ink";
import { Task, Tasks } from "../db/DB.js";
import Util from "../common/Util.js";
import Fetch from "./Fetch.js";

export type OrderTasks =
    | "NONE"
    | "INC_AO"
    | "DEC_AO"
    | "PRIORITY_LH"
    | "PRIORITY_HL";

type OrderNode = { type: OrderTasks; next: null | OrderNode };
const orderNode = ((orderTypes: OrderTasks[]): OrderNode => {
    const first = { type: orderTypes[0], next: null } as OrderNode;

    let prev = first;

    for (let i = 1; i < orderTypes.length; ++i) {
        const next = { type: orderTypes[i], next: null };
        prev.next = next;
        prev = next;
    }

    prev.next = first;

    return first;
})(["NONE", "INC_AO", "DEC_AO", "PRIORITY_LH", "PRIORITY_HL"]);

interface AppState {
    tasks: Task[];
    normal: boolean;
    addText: string;
    editText: string;
    idx: number;
    order: OrderNode;
}

export function useTasks(tasks: Tasks) {
    const initialState: AppState = {
        tasks,
        idx: 0,
        normal: true,
        addText: "",
        editText: "",
        order: orderNode,
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

            if (input === "o") {
                cycleOrder();
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

    function cloneTasks(): Tasks {
        return [...state.tasks.map((t) => ({ ...t }))];
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

        let editText: string | null = null;
        if (state.idx < state.tasks.length) {
            editText = state.tasks[state.idx].name;
        }

        setState({
            ...state,
            normal: false,
            editText: editText ? editText : "",
        });
    }

    function enterNormal(): void {
        if (state.normal) return;

        setState({
            ...state,
            normal: true,
        });
    }

    function cycleOrder(): void {
        const next: OrderNode = state.order.next!;

        const newTasks = orderTasks(cloneTasks(), next.type);

        setState({ ...state, order: next, tasks: newTasks });
    }

    function orderTasks(tasks: Tasks, orderType: OrderTasks): Tasks {
        if (orderType === "INC_AO") {
            return tasks.sort((a, b) => {
                if (a.name < b.name) return -1;
                if (a.name > b.name) return 1;
                return 0;
            });
        }

        if (orderType === "DEC_AO") {
            return tasks.sort((a, b) => {
                if (a.name < b.name) return 1;
                if (a.name > b.name) return -1;
                return 0;
            });
        }

        const pMap = { low: 1, medium: 2, high: 3 } as const;
        if (orderType === "PRIORITY_LH") {
            return tasks.sort((a, b) => {
                if (pMap[a.priority] < pMap[b.priority]) return -1;
                if (pMap[a.priority] > pMap[b.priority]) return 1;
                return 0;
            });
        }

        if (orderType === "PRIORITY_HL") {
            return tasks.sort((a, b) => {
                if (pMap[a.priority] < pMap[b.priority]) return 1;
                if (pMap[a.priority] > pMap[b.priority]) return -1;
                return 0;
            });
        }

        // if orderType === "NONE"
        return tasks;
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

        const response = await Fetch.sendReq("PUT", task);

        if (!response) return;

        const newTasks = cloneTasks();
        newTasks[state.idx] = task;

        setState({
            ...state,
            tasks: newTasks,
        });
    }

    async function deleteTask(): Promise<void> {
        const toDelete = { ...state.tasks[state.idx] } as Task;

        const newTasks = await Fetch.sendReq("DELETE", toDelete);

        if (!newTasks) return;

        setState({
            ...state,
            tasks: orderTasks(newTasks, state.order.type),
        });
    }

    async function editTask(): Promise<void> {
        if (state.editText === "") return enterNormal();

        const prev: Task = state.tasks[state.idx];

        const newTask: Task = {
            id: prev.id,
            priority: prev.priority,
            name: state.editText,
        };

        const response = await Fetch.sendReq("PUT", newTask);

        if (!response) return;

        const newTasks = cloneTasks();
        newTasks[state.idx] = newTask;

        setState({
            ...state,
            normal: true,
            editText: "",
            tasks: newTasks,
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
            idx: ++state.idx, // keep focus on add button
            normal: true,
            addText: "",
            tasks: orderTasks(newTasks, state.order.type),
        });
    }

    return { state, setAddText, setEditText };
}
