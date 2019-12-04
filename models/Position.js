const mongoose = require('mongoose');

const positionSchema = new mongoose.Schema({
    datahora: String,
    ordem: String,
    linha: Number,
    velocidade: Number,
    location: { coordinates: [Number] }
}, { collection: "positions" });

module.exports = mongoose.model('Position', positionSchema);