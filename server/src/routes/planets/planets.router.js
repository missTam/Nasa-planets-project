const express = require("express");
// destructure planetsController object that's returned from the module and import its function(s) directly
const { getPlanets } = require("./planets.controller")

// router is another middleware that groups together related routes
const planetsRouter = express.Router();

planetsRouter.get("/", getPlanets);

module.exports = planetsRouter;
