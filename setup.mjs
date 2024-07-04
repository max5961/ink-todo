#!/usr/bin/env node

import fs from "fs/promises";
import path from "path";
import { exec } from "child_process";
import inquirer from "inquirer";

const prompt = inquirer.createPromptModule();
prompt([
    {
        type: "input",
        name: "executable",
        message: "Enter name for executable (leave blank for 'todo'):",
    },
])
    .then((answers) => {
        if (answers.executable === "") return "todo";
        return answers.executable;
    })
    .then((executable) => {
        return updatePackageJson(executable);
    })
    .then(() => {
        const commands = [
            "npm install",
            "npm run build",
            "sudo npm install -g",
        ];
        execShellCommands(commands);
    })
    .catch((err) => {
        console.error(err);
        console.error(
            "\nMake sure you are in the root directory of the project before running this script.",
        );
    });

const packageFile = path.join(process.env.PWD, "package.json");
async function updatePackageJson(executableName) {
    // get package.json contents
    const packageJson = JSON.parse(await fs.readFile(packageFile, "utf-8"));

    // replace bin field with executable name
    let binCommand;
    for (const key in packageJson.bin) {
        binCommand = packageJson.bin[key];
        delete packageJson.bin[key];
    }
    packageJson.bin[executableName] = binCommand;

    // write new file
    await fs.writeFile(
        packageFile,
        JSON.stringify(packageJson, null, 4),
        "utf-8",
    );
}

function execShellCommands(commands) {
    if (commands.length === 0) return;

    exec(commands[0], (err, stdout, stderr) => {
        console.log(commands[0]);
        if (err) {
            console.error(err);
            return;
        }

        console.log(stdout);

        execShellCommands(commands.slice(1));
    });
}
