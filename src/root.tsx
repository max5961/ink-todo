import React from "react";
import DB, { Tasks } from "./db/DB.js";
import { render } from "ink";
import App from "./App.js";
import fs from "fs/promises";
import path from "path";

async function preCheck(): Promise<void> {
    const files: string[] = await fs.readdir(path.join(DB.PATH, "../"));
    if (!files.includes(path.basename(DB.PATH))) {
        DB.saveDb([]);
    }
}

async function entry(): Promise<void> {
    await preCheck();
    const tasks = (await DB.openDb()) as Tasks;

    render(<App tasks={tasks} />);
}

entry();
