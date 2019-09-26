/*
* date: 2019-06-14
* desc:
*/
const LogModel = require('../models/log.model');
const formatLogs = require('../utils/formatLogs');


//
const _getLogList = async (query) => {
  let level = query.level;
  let ip = query.ip;
  let startTime = query.start;
  let endTime = query.end;
  let content = query.content || '';
  let size = parseInt(query.size, 10) || 10;
  let page = query.page || 1;

  let timeConditions = {
    $gte: startTime,
    $lte: endTime
  };

  let conditions = {
    time: timeConditions
  };

  if (ip) {
    conditions.ip = ip;
  }

  if (level) {
    conditions.level = level;
  }

  if (content) {
    conditions.content = {
      $regex: content
    };
  }

  // 满足条件的个数。
  let count = await LogModel.count(conditions);
  let data = [];
  // 页面信息
  let pager = {
    total: count,
    page: page
  };

  if (count > 0) {
    let options = {
      sort: {'time': -1}, // 根据时间排序
      skip: '', //
      limit: size
    };

    options.skip = (page - 1) * size;
    data = await LogModel.find(conditions, null, options);
  }


  let result = {
    data,
    pager
  };

  return result;
};

// create log item
const _createLogItem = (item) => {
  let logModel = new LogModel(item);
  logModel.save();
};


//
const _doSaveLogList = (data) => {
  data = data || {};
  let list = formatLogs(data.data);
  let tempItem = {
    ip: data.ip,
    time: '',
    level: '',
    content: ''
  };

  list.forEach((item) => {
    // console.log(item);
    // 进行分割存储。
    let tempArray = item.split('|');
    if (tempArray.length === 3) {
      try {
        tempItem.time = new Date((tempArray[0]).trim()).getTime();
        tempItem.level = (tempArray[1]).trim();
        tempItem.content = (tempArray[2]).trim();
        try {
          _createLogItem(tempItem);
        } catch (e) {
          console.error(e);
        }
      } catch (e) {
        console.log(tempArray);
        console.error(e);
      }

    } else {
      console.error('has error data', item);
    }
  });
};

module.exports = {
  saveLogList: async (data) => {
    _doSaveLogList(data);
  },

  queryLogLost: async (query) => {
    return await _getLogList(query);
  }
};
