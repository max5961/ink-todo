import { Task } from "../db/DB.js";

export function usePriority(task: Task) {
    const priorityMap = {
        low: "green",
        medium: "yellow",
        high: "red",
    } as const;

    const priorityColor = priorityMap[task.priority];
    const priorityDesc = task.priority[0].toUpperCase();

    return { priorityColor, priorityDesc };
}
