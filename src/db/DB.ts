import fs from "fs/promises";
import path from "path";
import os from "os";

export type Priority = "low" | "medium" | "high";

export interface Task {
    name: string;
    priority: Priority;
    id: string;
}

export type Tasks = Task[];

const PATH = path.join(os.homedir(), ".local", "share", "todo", "list.json");

async function openDb(): Promise<Tasks> {
    const json = await fs.readFile(PATH, "utf-8");
    return JSON.parse(json) as Tasks;
}

async function saveDb(data: Tasks): Promise<void> {
    return await fs.writeFile(PATH, JSON.stringify(data, null, 4));
}

function createId(): string {
    const random = (n: number) => Math.floor(Math.random() * n);
    let date: string = `${Date.now()}`;

    const rNum: string = `${random(10000)}`;

    for (let i = 0; i < rNum.length; ++i) {
        const toSlice: number = random(date.length);
        const L: string = date.slice(0, toSlice);
        const R: string = date.slice(toSlice);
        date = L + rNum[i] + R;
    }

    return date;
}

export default {
    openDb,
    saveDb,
    createId,
    PATH,
};
