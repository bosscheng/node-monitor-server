/*
* date: 2019-06-01
* desc:
*/
const FmsModel = require('../models/fms.model');


const getList = async () => {
  return await FmsModel.find();
};

const createItem = async (dbData) => {
  let result = {
    code: 0,
    msg: ''
  };
  let name = dbData.name;
  let tempItem = await FmsModel.findOne({name: name});
  if (tempItem) {
    result.code = -1;
    result.msg = 'fms already exist';
  } else {
    const ipModel = new FmsModel(dbData);
    await ipModel.save();
  }

  return result;
};

const deleteItem = async (id) => {
  return await FmsModel.findByIdAndDelete(id);
};

module.exports = {
  getList,
  createItem,
  deleteItem
};
