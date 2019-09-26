/*
* date: 2019-08-05
* desc:
*/
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const rtmpDb = require('../db').getGoRtmp();

const BroadcastSchema = new Schema({
  path: {type: String},
  subscriber: {type: Array},
  publiser: {type: Number},
  publisheraddr: {type: String}
});

module.exports = rtmpDb.model('Broadcast', BroadcastSchema);
