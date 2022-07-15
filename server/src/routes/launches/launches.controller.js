const {
  getAllLaunches,
  scheduleNewLaunch,
  exists,
  abortLaunchById,
} = require("../../models/launches.model");

const { getPagination } = require("../../services/query");

async function getLaunches(req, res) {
  const { skip, limit } = getPagination(req.query); // extract query params from req
  const launches = await getAllLaunches(skip, limit);
  return res.status(200).json(launches); // returns an array from an iterable
}

async function addLaunch(req, res) {
  const launch = req.body;

  // validate request body against missing properties
  if (
    !launch.mission ||
    !launch.rocket ||
    !launch.launchDate ||
    !launch.target
  ) {
    return res.status(400).json({
      error: "Missing required launch properties",
    });
  }

  launch.launchDate = new Date(launch.launchDate);
  /*
     validate date value
     isNaN calls valueOf() on a date returning numeric timestamp in case of a valid date value
    */
  if (isNaN(launch.launchDate)) {
    return res.status(400).json({
      error: "Invalid launch date",
    });
  }

  await scheduleNewLaunch(launch);
  return res.status(201).json(launch);
}

async function abortLaunch(req, res) {
  const launchId = Number(req.params.id);

  const existsLaunch = await exists(launchId);
  // if launch doesn't exist
  if (!existsLaunch) {
    return res.status(404).json({
      error: "Launch not found",
    });
  }

  const aborted = await abortLaunchById(launchId);
  if (!aborted) {
    return res.status(400).json({
      error: "Launch not aborted",
    });
  }

  return res.status(200).json({
    ok: true,
  });
}

module.exports = {
  getLaunches,
  addLaunch,
  abortLaunch,
};
