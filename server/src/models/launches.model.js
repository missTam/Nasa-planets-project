const launches = new Map();

const launch = {
    flightNumber: 99,
    mission: "Kepler Exploration",
    rocket: "Explorer IM1D",
    launchDate: new Date("January 25, 2035"),
    destination: "Kepler-332 c",
    customer: ["NASA", "ZTM"],
    upcoming: true,
    success: true
};

launches.set(launch.flightNumber, launch);

function getAllLaunches() {
    return Array.from(launches.values());
}

module.exports = {
    getAllLaunches,
};