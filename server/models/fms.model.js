const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const monitorDb = require('../db').getDbMonitor();

// Schema
const FmsSchema = new Schema({
  name: {type: String, trim: true, maxlength: 100, require: true},
  createdAt: {type: Date, default: Date.now},
});


// model
module.exports = monitorDb.model('Fms', FmsSchema);
