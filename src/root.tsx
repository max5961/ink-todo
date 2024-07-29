import React from "react";
import DB, { Tasks } from "./db/DB.js";
import { render } from "ink";
import App from "./App.js";
import fs from "fs/promises";
import path from "path";
import app from "./server.js";
import fetch from "node-fetch";

async function preCheck(): Promise<void> {
    const files: string[] = await fs.readdir(path.join(DB.PATH, "../"));
    if (!files.includes(path.basename(DB.PATH))) {
        DB.saveDb([]);
    }
}

async function entry(): Promise<void> {
    await preCheck();

    const response = await fetch(`http://localhost:${PORT}/api/tasks`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    const tasks = (await response.json()) as Tasks;

    render(<App tasks={tasks} />);
}

export const PORT = 5050;
export const toExit = app.listen(PORT, () => {
    // console.log(`Server running on port ${PORT}`);
});

entry();
