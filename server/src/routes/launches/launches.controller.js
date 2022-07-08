const { getAllLaunches, addNewLaunch } = require("../../models/launches.model");

function getLaunches(req, res) {
    return res.status(200).json(getAllLaunches()); // returns an array from an iterable
}

function addLaunch(req, res) {
    const launch = req.body;

    // validate request body against missing properties
    if(!launch.mission || !launch.rocket || !launch.launchDate || !launch.target) {
        return res.status(400).json({
            error: "Missing required launch properties"
        });
    }

    launch.launchDate = new Date(launch.launchDate);
    /*
     validate date value
     isNaN calls valueOf() on a date returning numeric timestamp in case of a valid date value
    */ 
    if(isNaN(launch.launchDate)) {
        return res.status(400).json({
            error: "Invalid launch date"
        });
    } 

    addNewLaunch(launch);
    return res.status(201).json(launch);
}

module.exports = {
    getLaunches,
    addLaunch,
}