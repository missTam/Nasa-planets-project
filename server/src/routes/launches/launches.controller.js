const { getAllLaunches } = require("../../models/launches.model");

function getLaunches(req, res) {
    return res.status(200).json(getAllLaunches()); // returns an array from an iterable
}

module.exports = {
    getLaunches,
}