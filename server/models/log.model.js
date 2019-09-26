/*
* date: 2019-06-14
* desc:
*/

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const monitorDb = require('../db').getDbMonitor();


//
// 对日志进行分字段存储。
// 根据 ip 进行搜索。
// 时间 级别 内容
const LogSchema = new Schema({
  ip: {type: String, trim: true, maxlength: 100, require: true},
  time: {type: String, require: true},
  level: {type: String, require: true},
  content: {type: String, require: true},
  createdAt: {type: Date, default: Date.now},
});

module.exports = monitorDb.model('Log', LogSchema);
