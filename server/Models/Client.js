const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Client = new Schema({
    macAddress: String,
    osType: String,
    totalMemory: Number,
    usedMemory: Number,
    cpuModel: String,
    cpuClockSpeed: Number,
    cpuLoad: Number,
    cpuCores: Number
});

module.exports = mongoose.model('Client', Client);

