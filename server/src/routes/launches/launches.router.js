const express = require("express");
const { getLaunches } = require("./launches.controller");

const launchesRouter = express.Router();

launchesRouter.get("/", getLaunches);

module.exports = launchesRouter;
