const HistoryDay = require('../models/historyDay.model');
const HistoryHour = require('../models/historyHour.model');
const HistoryMinute = require('../models/historyMinute.model');
const History10Minute = require('../models/history10Minute.model');

const TYPE = {
  day: 'day',
  hour: 'hour',
  minute10: 'minute10',
  minute: 'minute'
};

const _doSave = async (data, type) => {
  data = data || {};
  let tempItem = {
    ip: data.ip,
    system: data.systemInfo,
    network: {
      up: data.networkUploadInfo,
      down: data.networkDownloadInfo
    },
    fireTime: data.fireDate,
    cpu: data.cpuInfo,
    program: data.programInfo,
    memory: data.memoryInfo
  };
  let tempExistItem = null;
  try {
    switch (type) {
      case TYPE.minute:
        tempExistItem = await HistoryMinute.findOne({ip: tempItem.ip, fireTime: tempItem.fireTime});
        if (tempExistItem) {
          console.warn(`type:${type},ip:${tempItem.ip},fireTime:${tempItem.fireTime} exist`);
        }
        if (!tempExistItem) {
          const historyMinute = new HistoryMinute(tempItem);
          await historyMinute.save();
        }
        break;
      case TYPE.minute10:
        tempExistItem = await History10Minute.findOne({ip: tempItem.ip, fireTime: tempItem.fireTime});
        if (tempExistItem) {
          console.warn(`type:${type},ip:${tempItem.ip},fireTime:${tempItem.fireTime} exist`);
        }
        if (!tempExistItem) {
          const history10Minute = new History10Minute(tempItem);
          await history10Minute.save();
        }
        break;
      case TYPE.hour:
        tempExistItem = await HistoryHour.findOne({ip: tempItem.ip, fireTime: tempItem.fireTime});
        if (tempExistItem) {
          console.warn(`type:${type},ip:${tempItem.ip},fireTime:${tempItem.fireTime} exist`);
        }
        if (!tempExistItem) {
          const historyHour = new HistoryHour(tempItem);
          await historyHour.save();
        }
        break;
      case TYPE.day:
        tempExistItem = await HistoryDay.findOne({ip: tempItem.ip, fireTime: tempItem.fireTime});
        if (tempExistItem) {
          console.warn(`type:${type},ip:${tempItem.ip},fireTime:${tempItem.fireTime} exist`);
        }
        if (!tempExistItem) {
          const historyDay = new HistoryDay(tempItem);
          await historyDay.save();
        }
        break;
    }
  } catch (e) {
    console.error(e);
  }
};


// 请求，
// 技术难点，就是当前的数据，一定要返回当天0点到24点的数据。

// 如果是间断时间，则需要返回，当天时间的0点 到结束时间的24点。

const _doQuery = async (params, type) => {
  let result = [];
  let start = params.start;
  let end = params.end;

  let ip = params.ip;
  if (ip) {
    let queryLimit = {
      ip: ip,
      fireTime: {
        $gte: start,
        $lte: end
      }
    };
    try {
      switch (type) {
        case TYPE.day:
          result = await HistoryDay.find(queryLimit);
          break;
        case TYPE.hour:
          result = await HistoryHour.find(queryLimit);
          break;
        case TYPE.minute:
          result = await HistoryMinute.find(queryLimit);
          break;
        case TYPE.minute10:
          result = await History10Minute.find(queryLimit);
          break;
      }
    } catch (e) {
      console.error(e);
    }
  }
  return result;
};

module.exports = {
  //
  saveHistoryDay: async (data) => {
    await _doSave(data, TYPE.day);
  },

  //
  saveHistoryHour: async (data) => {
    await _doSave(data, TYPE.hour);
  },

  //
  saveHistoryMinute: async (data) => {
    await _doSave(data, TYPE.minute);
  },

  saveHistory10Minute: async (data) => {
    await _doSave(data, TYPE.minute10);
  },
  //
  queryHistoryDay: async (params) => {
    params = params || {};
    return _doQuery(params, TYPE.day);
  },

  //
  queryHistoryHour: async (params) => {
    params = params || {};
    return _doQuery(params, TYPE.hour);
  },

  //
  queryHistoryMinute: async (params) => {
    params = params || {};
    return _doQuery(params, TYPE.minute);
  },

  queryHistory10Minute: async (params) => {
    params = params || {};
    return _doQuery(params, TYPE.minute10);
  }
};

