import fetch from "node-fetch";
import { Task, Tasks } from "../db/DB.js";

// async function putTask(task: Task): Promise<Tasks | void> {
//     const response = await fetch("http://localhost:5050/api/tasks", {
//         method: "PUT",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ task: task }),
//     });
//
//     if (!response.ok) {
//         return console.error(response.status);
//     }
//
//     return (await response.json()) as Tasks;
// }
//
// async function postTask(task: Task): Promise<Tasks | void> {
//     const response = await fetch("http://localhost:5050/api/tasks", {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ task: task }),
//     });
//
//     /* Need to make sure server handles creating the id!
//      * and need to make sure server handles validating a task that is sent to it*/
// }

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
