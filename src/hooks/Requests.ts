import fetch from "node-fetch";
import { Task, Tasks } from "../db/DB.js";

async function putTask(newTask: Task): Promise<Tasks | void> {
    const response = await fetch("http://localhost:5050/api/tasks", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ task: newTask }),
    });

    if (!response.ok) {
        return console.error(response.status);
    }

    return (await response.json()) as Tasks;
}

export default {};
