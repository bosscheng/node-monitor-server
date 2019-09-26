// history hour day
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const monitorDb = require('../db').getDbMonitor();

// Schema
const HistoryHourSchema = new Schema({
  cpu: {type: String},
  network: {type: Object},
  memory: {type: Object},
  program: {type: Object},
  system: {type: Object},
  ip: {type: String, trim: true, maxlength: 100, require: true},
  fireTime: {type: String},
  createdAt: {type: Date, default: Date.now},
});

module.exports = monitorDb.model('HistoryHour', HistoryHourSchema);
