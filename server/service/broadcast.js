/*
* date: 2019-08-05
* desc:
*/

const BroadcastModel = require('../models/broadcast.model');

const getList = async () => {
  return await BroadcastModel.find();
};

module.exports = {
  getList
};
