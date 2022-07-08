const { getAllLaunches, addNewLaunch, exists, abortLaunchById } = require("../../models/launches.model");

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

function abortLaunch(req, res) {
    const launchId = Number(req.params.id);

    // if launch doesn't exist
    if(!exists(launchId)) {
        return res.status(404).json({
            error: "Launch not found"
        });
    }

    return res.status(200).json(abortLaunchById(launchId));

}

module.exports = {
    getLaunches,
    addLaunch,
    abortLaunch,
}