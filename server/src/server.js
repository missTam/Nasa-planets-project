const http = require("http");
const app = require("./app");
const { loadPlanetsData } = require("./models/planets.model");

// check if port is specified in package.json as env var, if not default to 8000
const PORT = process.env.PORT || 8000;

// create a local http server and pass the express app to handle incoming http requests and responses
const server = http.createServer(app);

// Populate server with data on startup; wait for the promise(s) to resolve before listening for requests
loadPlanetsData()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Listening on port ${PORT}..`);
    });
  })
  .catch((error) => console.log(error));
