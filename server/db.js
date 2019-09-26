const mongoose = require('mongoose');
const config = require('../config');
const env = require('./utils/env');
const dbUrl = config.db[env];
const dbLogin = config.dbLogin[env];
const dbLogin2 = config.dbLogin2[env];


let dbMonitor = mongoose.createConnection(dbUrl, dbLogin);

let dbGoRtmp = mongoose.createConnection(dbUrl, dbLogin2);

module.exports = {
  connect: function () {
    let promiseMonitor = new Promise((resolve, reject) => {

      dbMonitor.on('connected', function () {
        console.log('mongoose monitor connection open to ' + dbUrl);
        resolve()
      });

      dbMonitor.on('error', function (err) {
        console.error('mongoose monitor connection error:', err);
        reject()
      });

      dbMonitor.on('disconnected', function () {
        console.error('mongoose monitor connection disconnected');
        reject()
      })
    });

    let promiseGoRtmp = new Promise((resolve, reject) => {


      dbGoRtmp.on('connected', function () {
        console.log('mongoose rtmp connection open to ' + dbUrl);
        resolve()
      });

      dbGoRtmp.on('error', function (err) {
        console.error('mongoose rtmp connection error:', err);
        reject()
      });

      dbGoRtmp.on('disconnected', function () {
        console.error('mongoose rtmp connection disconnected');
        reject()
      })
    });
    return Promise.all([promiseMonitor, promiseGoRtmp]);
  },
  getDbMonitor: function () {
    return dbMonitor;
  },
  getGoRtmp: function () {
    return dbGoRtmp;
  }
}
