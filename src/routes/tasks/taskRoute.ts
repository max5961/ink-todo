import express from "express";
import Ctlr from "./taskController.js";

const tasksRouter = express.Router();

tasksRouter
    .route("/")
    .get(Ctlr.getTasks)
    .post(Ctlr.postTask)
    .put(Ctlr.putTask)
    .delete(Ctlr.deleteTask);

tasksRouter.route("/:id").get(Ctlr.getTaskById);

export default tasksRouter;
