#!/usr/bin/env node

import fs from "fs/promises";
import path from "path";
import { exec, execSync } from "child_process";
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
        return new Promise((res, rej) => {
            exec(command, (err, stdout, stderr) => {
                console.log(command);
                if (err) {
                    console.error(err);
                    rej(err);
                }

                console.log(stdout);
                res(stdout || stderr);
            });
        })
    })
    .catch((err) => {
        console.error(err);
        console.error(
            "\nMake sure you are in the root directory of the project before running this script.",
        );
    });

async function updatePackageJson(executableName) {
    const packageFile = path.join(process.env.PWD, "package.json");

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

