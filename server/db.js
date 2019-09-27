const mongoose = require('mongoose');
const config = require('../config');
const env = require('./utils/env');
const dbUrl = config.db[env];
const dbLogin = config.dbLogin[env];


let dbMonitor = mongoose.createConnection(dbUrl, dbLogin);

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
    return promiseMonitor;
  },
  getDbMonitor: function () {
    return dbMonitor;
  }
}
