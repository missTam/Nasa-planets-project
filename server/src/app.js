const express = require("express");
const cors = require("cors");
const path = require("path");
const morgan = require("morgan");

const planetsRouter = require("./routes/planets/planets.router")
const launchesRouter = require("./routes/launches/launches.router")

// In the app.js we define all our server middleware

// express app is essentially middlware added on top of node's built-in http server
const app = express();

// configure cors middleware to loosen the same origin policy and only accept requests from trusted clients
app.use(cors({
    origin: "http://localhost:3000"
}));

// logging middleware; combined as logging format
app.use(morgan("combined"));

// built-in json parsing middleware which parses incoming requests with JSON data as JS object
app.use(express.json())

/* use express to serve all public files which are generated when react app is built
Both react (http://localhost:8000/index.html) and node app are now served under the same port: 8000
*/
app.use(express.static(path.join(__dirname, "..", "public")))

// add planets route to express app
app.use("/planets", planetsRouter)
app.use("/launches", launchesRouter)

// serve react app from the root of the url instead of specifying full path with 'index.html'
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "index.html"));
})

module.exports = app;