/*
* author: wancheng
* date: 2019-05-08
* desc:
*/

const ipService = require('./service/ip');
const historyService = require('./service/history');
const logService = require('./service/log');
const fmsService = require('./service/fms');
const broadcastService = require('./service/broadcast');

async function getBroadcastList() {
  let ipList = [];
  let result = getResult();
  try {
    ipList = await broadcastService.getList();
    result.data = ipList;
  } catch (e) {
    result.code = -1;
    result.msg = 'sql error';
  }

  return result;
}

async function getIpList() {
  let ipList = [];
  let result = getResult();
  try {
    ipList = await ipService.getList();
    result.data = ipList;
  } catch (e) {
    result.code = -1;
    result.msg = 'sql error';
  }

  return result;
}

async function getFmsList() {
  let fmsList = [];
  let result = getResult();
  try {
    fmsList = await fmsService.getList();
    result.data = fmsList;
  } catch (e) {
    result.code = -1;
    result.msg = 'sql error';
  }

  return result;
}


async function createIpItem({request}) {
  let body = request.body || {};
  let name = body.name;
  let result = getResult();
  if (!name) {
    result.code = -1;
    result.msg = 'ip is empty';
    return result;
  } else {
    let dbData = {
      name: name
    };

    //
    try {
      result = await ipService.createItem(dbData);
    } catch (e) {
      console.error(e);
      result.code = -1;
      result.msg = 'create error';
    }
    return result;
  }
}


async function createFmsItem({request}) {
  let body = request.body || {};
  let name = body.name;
  let result = getResult();
  if (!name) {
    result.code = -1;
    result.msg = 'fms is empty';
    return result;
  } else {
    let dbData = {
      name: name
    };

    try {
      result = await fmsService.createItem(dbData);
    } catch (e) {
      console.error(e);
      result.code = -1;
      result.msg = 'create error';
    }
    return result;
  }
}

async function deleteIpItem({params}) {
  params = params || {};
  let id = params.id;
  let result = getResult();
  if (!id) {
    result.code = -1;
    result.msg = "item id is empty";
  } else {
    try {
      await ipService.deleteItem(id);
    } catch (e) {
      result.code = -1;
      result.msg = "delete error";
    }
  }

  return result;
}

//
async function deleteFmsItem({params}) {
  params = params || {};
  let id = params.id;
  let result = getResult();
  if (!id) {
    result.code = -1;
    result.msg = "item id is empty";
  } else {
    try {
      await fmsService.deleteItem(id);
    } catch (e) {
      result.code = -1;
      result.msg = "delete error";
    }
  }
  return result;
}


// day
async function getHistoryDay({query}) {
  let result = getResult();
  try {
    let data = await historyService.queryHistoryDay(query);
    if (data) {
      result.data = data;
    }
  } catch (e) {
    console.error(e);
    result.code = -1;
    result.msg = "网络异常";
  }

  return result;
}

async function getHistoryMinute({query}) {
  let result = getResult();
  try {
    let data = await historyService.queryHistoryMinute(query);
    if (data) {
      result.data = data;
    }
  } catch (e) {
    result.code = -1;
    result.msg = "网络异常";
  }

  return result;
}

async function getHistory10Minute({query}) {
  let result = getResult();
  try {
    let data = await historyService.queryHistory10Minute(query);
    if (data) {
      result.data = data;
    }
  } catch (e) {
    result.code = -1;
    result.msg = "网络异常";
  }

  return result;
}

async function getHistoryHour({query}) {
  let result = getResult();
  try {
    let data = await historyService.queryHistoryHour(query);
    if (data) {
      result.data = data;
    }
  } catch (e) {
    result.code = -1;
    result.msg = "网络异常";
  }

  return result;
}

async function getLogList({query}) {
  let result = getResult();

  try {
    let data = await logService.queryLogLost(query);
    if (data) {
      result.data = data;
    }
  } catch (e) {
    console.error(e);
    result.code = -1;
    result.msg = "网络异常";
  }

  return result;
}

let getResult = (code, msg) => {
  return {
    code: code || 0,
    msg: msg || ''
  };
};


//
module.exports = {
  'get': {
    "/ip": getIpList,
    "/fms": getFmsList,
    "/history/day": getHistoryDay,
    "/history/minute": getHistoryMinute,
    "/history/10minute": getHistory10Minute,
    "/history/hour": getHistoryHour,
    "/log": getLogList,
    "/broadcast": getBroadcastList
  },

  'post': {
    "/ip": createIpItem,
    "/fms": createFmsItem
  },

  'delete': {
    "/ip/:id": deleteIpItem,
    "/fms/:id": deleteFmsItem
  }
};
