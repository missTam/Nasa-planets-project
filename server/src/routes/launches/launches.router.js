const express = require("express");
const { getLaunches, addLaunch, abortLaunch } = require("./launches.controller");

const launchesRouter = express.Router();

launchesRouter.get("/", getLaunches);
launchesRouter.post("/", addLaunch);
launchesRouter.delete("/:id", abortLaunch);

module.exports = launchesRouter;
