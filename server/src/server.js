const http = require("http");
const mongoose = require("mongoose");

const app = require("./app");
const { loadPlanetsData } = require("./models/planets.model");

// check if port is specified in package.json as env var, if not default to 8000
const PORT = process.env.PORT || 8000;

const MONGO_URL = "mongodb+srv://nasa-api:pw@nasacluster.a9uii.mongodb.net/nasa?retryWrites=true&w=majority";

// create a local http server and pass the express app to handle incoming http requests and responses
const server = http.createServer(app);

mongoose.connection.once("open", () => {
  console.log("MongoDB connection ready!");
});

mongoose.connection.on("error", err => {
  console.error(err)
});

// Populate server with data on startup; wait for the promise(s) to resolve before listening for requests
// to guarantee the order of async operations, start server needs to be async
// otherwise db connection may still be initializing and some planets wouldn't get written to it on start up
async function startServer() {
  try {
    await mongoose.connect(MONGO_URL);
    await loadPlanetsData();
  } catch(err) {
    console.log(err)
  }
  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}..`);
  });
}

startServer();
