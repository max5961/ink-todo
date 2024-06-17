import fs from "fs/promises";
import path from "path";
import os from "os";

export type Priority = "low" | "medium" | "high";

export interface Task {
    name: string;
    priority: Priority;
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

export default {
    openDb,
    saveDb,
    PATH,
};
