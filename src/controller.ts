import express from "express";
import DB from "./db/DB.js";

type Req = express.Request;
type Res = express.Response;

function get(req: Req, res: Res): void {
    DB.openDb()
        .then((tasks) => {
            res.status(200).json(tasks);
        })
        .catch((err) => {
            res.status(404).json({ msg: err.message });
        });
}
