/*
* date: 2019-06-01
* desc:
*/
const IpModel = require('../models/ip.model');


const getList = async () => {
  return await IpModel.find();
};

const createItem = async (dbData) => {
  let result = {
    code: 0,
    msg: ''
  };
  let name = dbData.name;
  let tempItem = await IpModel.findOne({name: name});
  if (tempItem) {
    result.code = -1;
    result.msg = 'ip already exist';
  } else {
    const ipModel = new IpModel(dbData);
    await ipModel.save();
  }

  return result;
};

const deleteItem = async (id) => {
  return await IpModel.findByIdAndDelete(id);

};

module.exports = {
  getList,
  createItem,
  deleteItem
};
