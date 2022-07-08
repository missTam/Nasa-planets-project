const express = require("express");
const { getLaunches, addLaunch } = require("./launches.controller");

const launchesRouter = express.Router();

launchesRouter.get("/", getLaunches);
launchesRouter.post("/", addLaunch);

module.exports = launchesRouter;
