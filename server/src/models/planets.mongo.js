const mongoose = require("mongoose");

// this schema only enforces that a property 'keplerName' is set and ignores other fields
const planetsSchema = new mongoose.Schema({
    keplerName: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model("Planet", planetsSchema);