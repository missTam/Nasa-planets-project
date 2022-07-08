const launches = new Map();

const launch = {
    flightNumber: 99,
    mission: "Kepler Exploration",
    rocket: "Explorer IM1D",
    launchDate: new Date("January 25, 2035"),
    target: "Kepler-332 c",
    customer: ["NASA", "ZTM"],
    upcoming: true,
    success: true
};

launches.set(launch.flightNumber, launch);

let latestFlightNumber = Array.from(launches.keys()).pop();

function exists(launchId) {
    return launches.has(launchId);
}

function abortLaunchById(launchId) {
    const aborted = launches.get(launchId);
    aborted.upcoming = false;
    aborted.success = false;
    return aborted;
}

function getAllLaunches() {
    return Array.from(launches.values());
}

function addNewLaunch(launch) {
    launch.flightNumber = ++latestFlightNumber;
    launches.set(launch.flightNumber, Object.assign(launch,
        {
            customers: ["Zero to Mastery", "NASA"],
            upcoming: true,
            success: true
        })
    );
}

module.exports = {
    getAllLaunches,
    addNewLaunch,
    exists,
    abortLaunchById,
};