import fetch from "node-fetch";
import { Task, Tasks } from "../db/DB.js";

type Method = "GET" | "POST" | "PUT" | "DELETE";
async function sendReq(method: Method, task: Task) {
    const response = await fetch("http://localhost:5050/api/tasks", {
        method: method,
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ task: task }),
    });

    if (!response.ok) {
        return console.error(response.status);
    }

    return (await response.json()) as Tasks;
}

export default {
    sendReq,
};
