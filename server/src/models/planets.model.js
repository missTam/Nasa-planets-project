// kepler data reference: https://exoplanetarchive.ipac.caltech.edu/docs/data.html
const { parse } = require("csv-parse");
const fs = require("fs");
// to work with relative paths
const path = require('path');

const habitablePlanets = [];

function isHabitable(planet) {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    // how much solar radiation (insolation) a planet should get with ref. to earth to be considered habitable
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11 &&
    // planetary radius should not exceed that of earth's more than 1.6 times
    planet["koi_prad"] < 1.6
  );
}

// will return a promise which resolves when habitable planets've been found
function loadPlanetsData() {
  return new Promise((resolve, reject) => {
    fs.createReadStream(path.join(__dirname, "..", "..", "data", "kepler_objects.csv"))
    // pipe the csv-specific parsing with the file stream to get readable js objects as opposed to stream of bytes
    .pipe(
        parse({
        // treat lines starting with '#' as comments
        comment: "#",
        // return each row of as a js object rather than as an array of row values
        columns: true,
        })
    )
    .on("data", (data) => {
        if (isHabitable(data)) {
      habitablePlanets.push(data);
        }
    })
    .on("error", (err) => reject(`Something went wrong when reading planets' data: ${err}`))
    .on("end", () => {
        console.log("Done processing csv data");
        if (habitablePlanets !== null && habitablePlanets.length > 0) {
            resolve(habitablePlanets);
        }
    });
  });
}

/* 
  Streams are async code; node returns module exports before the async code has finished executing - it happens upon the module being required elsewhere
  Steps of execution:
  1. planets.model.js is required in the controller 
  2. stream code executes asynchronously
  3. planets are returned before the list is populated
  4. controller sends back an empty list to the client

  Solution: create a js promise for the loading code & 'await' for it to resolve before accepting any incoming requests in the controller
  */
module.exports = {
  loadPlanetsData, 
  planets: habitablePlanets,
};
