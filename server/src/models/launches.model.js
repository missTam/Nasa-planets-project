const launchesDatabase = require("./launches.mongo");
const planets = require("./planets.mongo"); // call planets.mongo instead of planets.model (always go level down to keep clean structure)

const DEFAULT_FLIGHT_NUMBER = 100;

const launch = {
  flightNumber: 99,
  mission: "Kepler Exploration",
  rocket: "Explorer IM1D",
  launchDate: new Date("January 25, 2035"),
  target: "Kepler-1652 b",
  customers: ["NASA", "ZTM"],
  upcoming: true,
  success: true,
};

saveLaunch(launch);

async function exists(launchId) {
  return await launchesDatabase.findOne({
    flightNumber: launchId
  });
}

async function getLatestFlightNumber() {
  const latestLaunch = await launchesDatabase.findOne({}).sort("-flightNumber"); // sorts doc by flightNumber in descending order
  if(!latestLaunch) {
    return DEFAULT_FLIGHT_NUMBER;
  }
  return latestLaunch.flightNumber;
}

async function abortLaunchById(launchId) {
  const aborted = await launchesDatabase.updateOne({ // update if exists; no action in case of unexistent entry
    flightNumber: launchId
  }, 
  {
    upcoming: false,
    success: false
  });

  return aborted.acknowledged === true && aborted.modifiedCount === 1;
}

async function getAllLaunches() {
  return await launchesDatabase.find(
    {},
    {
      _id: 0,
      __v: 0,
    }
  );
}

async function saveLaunch(launch) {
  // check that there is a valid planet for the designated target before saving a launch
  const planet = await planets.findOne({
    keplerName: launch.target,
  });

  if (!planet) {
    throw new Error(
      `No matching planet was found for the given launch target: ${launch.target}`
    );
  }

  await launchesDatabase.findOneAndUpdate( // only returns properties we set in update, no $setOnInsert
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    {
      upsert: true,
    }
  );
}

// add the correct flight number (latest incremented by 1) to a new launch, before persisting it to db
async function scheduleNewLaunch(launch) {

  const newFlightNumber = await getLatestFlightNumber() + 1;

  const newLaunch = Object.assign(launch, {
    success: true,
    upcoming: true,
    customers: ["Zero to Mastery", "NASA"],
    flightNumber: newFlightNumber,
  });

  await saveLaunch(newLaunch);
}

module.exports = {
  getAllLaunches,
  scheduleNewLaunch,
  exists,
  abortLaunchById,
};
