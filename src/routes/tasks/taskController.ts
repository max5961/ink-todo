import express from "express";
import DB, { Task } from "../../db/DB.js";

type Req = express.Request;
type Res = express.Response;

/* Respond with all tasks */
function getTasks(req: Req, res: Res): void {
    DB.openDb()
        .then((tasks) => {
            res.status(200).json(tasks);
        })
        .catch((err) => {
            res.status(404).json({ msg: err.message });
        });
}

/* Respond with a single task with a given id */
function getTaskById(req: Req, res: Res): void {
    const id: string = req.params.id;

    DB.openDb()
        .then((tasks) => {
            for (const task of tasks) {
                if (task.id === id) {
                    return task;
                }
            }
            throw new Error(`No task with id of ${id} found`);
        })
        .then((task) => {
            res.status(200).json(task);
        })
        .catch((err) => {
            res.status(404).json({ msg: `${err.message}` });
        });
}

/* Update a task and Respond with all tasks */
function putTask(req: Req, res: Res): void {
    const updatedTask = req.body.task as Task | undefined;

    if (!updatedTask) {
        res.send(404).json({ msg: "req.body.task missing" });
        return;
    }

    DB.openDb()
        .then((tasks) => {
            let updated = false;

            for (let i = 0; i < tasks.length; ++i) {
                if (updatedTask.id === tasks[i].id) {
                    updated = true;
                    tasks[i] = updatedTask;
                }
            }

            if (!updated) {
                throw new Error("Could not not task with id");
            } else {
                return tasks;
            }
        })
        .then((tasks) => {
            res.status(200).send(tasks);
            return tasks;
        })
        .then((tasks) => {
            DB.saveDb(tasks);
        })
        .catch((err) => {
            res.status(404).json({ msg: err.message });
        });
}

/* Add a task and Respond will all tasks including the added task */
function postTask(req: Req, res: Res): void {
    const newTask = req.body.task as Task | undefined;

    if (!newTask) {
        res.send(404).json({ msg: "req.body.task missing" });
        return;
    }

    DB.openDb()
        .then((tasks) => {
            tasks.push(newTask);
            return tasks;
        })
        .then((tasks) => {
            DB.saveDb(tasks).then(() => {
                res.status(200).json(tasks);
            });
        })
        .catch((err) => {
            res.status(404).json({ msg: err.message });
        });
}

/* Delete a task and respond with all tasks (excluding deleted) */
function deleteTask(req: Req, res: Res): void {
    const id: string = req.params.id;

    DB.openDb()
        .then((tasks) => {
            return tasks.filter((task) => task.id !== id);
        })
        .then((tasks) => {
            DB.saveDb(tasks).then(() => {
                res.status(200).json(tasks);
            });
        })
        .catch((err) => {
            res.status(404).json({ msg: err.message });
        });
}

export default {
    getTasks,
    getTaskById,
    putTask,
    deleteTask,
    postTask,
};
