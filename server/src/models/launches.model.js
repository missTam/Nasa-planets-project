const launchesDatabase = require("./launches.mongo");
const planets = require("./planets.mongo"); // call planets.mongo instead of planets.model (always go level down to keep clean structure)
const axios = require("axios"); // Promise based HTTP client for the browser and node.js

const DEFAULT_FLIGHT_NUMBER = 100;

async function exists(launchId) {
  return await findLaunch({
    flightNumber: launchId,
  });
}

async function getLatestFlightNumber() {
  const latestLaunch = await launchesDatabase.findOne({}).sort("-flightNumber"); // sorts doc by flightNumber in descending order
  if (!latestLaunch) {
    return DEFAULT_FLIGHT_NUMBER;
  }
  return latestLaunch.flightNumber;
}

async function abortLaunchById(launchId) {
  const aborted = await launchesDatabase.updateOne(
    {
      // update if exists; no action in case of unexistent entry
      flightNumber: launchId,
    },
    {
      upcoming: false,
      success: false,
    }
  );

  return aborted.acknowledged === true && aborted.modifiedCount === 1;
}

async function getAllLaunches(skip, limit) {
  return await launchesDatabase
  .find({}, { _id: 0, __v: 0, })
  .sort({ flightNumber: 1 }) // sort docs based on flight number (1 for ascending, -1 descending)
  .skip(skip) // skips over first x documents
  .limit(limit); // limit the number of docs returned - pagination
}

async function saveLaunch(launch) {
  // 'findOneAndUpdate' only returns properties we set in update, no $setOnInsert
  await launchesDatabase.findOneAndUpdate(
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
  // check that there is a valid planet for the designated target before scheduling a launch
  const planet = await planets.findOne({
    keplerName: launch.target,
  });

  if (!planet) {
    throw new Error(
      `No matching planet was found for the given launch target: ${launch.target}`
    );
  }

  const newFlightNumber = (await getLatestFlightNumber()) + 1;

  const newLaunch = Object.assign(launch, {
    success: true,
    upcoming: true,
    customers: ["Zero to Mastery", "NASA"],
    flightNumber: newFlightNumber,
  });

  await saveLaunch(newLaunch);
}

const SPACEX_API_URL = "https://api.spacexdata.com/v4/launches/query";

/*
  Load data from an external SpaceX api into our server
  POST req with AXIOS: 1st param is the url, 2nd is the payload
  POST req by sending a Query as payload to fecth data - not very 'restful'
*/
async function populateLaunches() {
  console.log("Downloading launch data from spaceX api...");
  const response = await axios.post(SPACEX_API_URL, {
    query: {},
    options: {
      pagination: false, // get all space x launches
      populate: [
        {
          path: "rocket",
          select: {
            name: 1,
          },
        },
        {
          path: "payloads",
          select: {
            customers: 1,
          },
        },
      ],
    },
  });

  if (response.status !== 200) {
    console.log("Problem downloading launch data");
    throw new Error("Launch data download failed");
  }

  const launchDocs = response.data.docs; // axios puts body of a server response in 'data'

  for (const launchDoc of launchDocs) {
    const payloads = launchDoc.payloads;
    const customers = payloads.flatMap((payload) => {
      return payload.customers;
    });

    const launch = {
      flightNumber: launchDoc.flight_number,
      mission: launchDoc.name,
      rocket: launchDoc.rocket.name,
      launchDate: launchDoc.date_local,
      upcoming: launchDoc.upcoming,
      success: launchDoc.success,
      customers,
    };

    console.log(`${launch.flightNumber} ${launch.mission}`);

    await saveLaunch(launch);
  }
}

// load launches only if no entries already in the db
async function loadLaunchesData() {
  const firstLaunch = await findLaunch({
    // check if 1st launch exists in db
    flightNumber: 1,
    rocket: "Falcon 1",
    mission: "FalconSat",
  });

  if (firstLaunch) {
    console.log("Launch data already loaded!");
    return;
  } else {
    await populateLaunches();
  }
}

async function findLaunch(filter) {
  return await launchesDatabase.findOne(filter);
}

module.exports = {
  exists,
  abortLaunchById,
  getAllLaunches,
  scheduleNewLaunch,
  loadLaunchesData,
};
