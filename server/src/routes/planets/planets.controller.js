const { planets } = require("../../models/planets.model")

// use 'return' to make sure that route handler functions only ever set the response status once
// if we try to set res multiple times in multiple middleware, express will yield an error
function getPlanets(req, res) {
    return res.status(200).json(planets);
}

module.exports = {
    getPlanets,
}