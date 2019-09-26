/*
* date: 2019-05-11
* desc: 这个是 page 专用的，
*/

export const find = (array, fn) => {
  array = array || []
  var result = null
  for (var i = 0, len = array.length; i < len; i++) {
    var item = array[i]
    if (fn(item)) {
      result = item
      break
    }
  }
  return result
}

// 获取 max - min
export const getRandom = (min = 0, max = 100) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export const clone = (obj = {}) => {
  let result = '';
  //
  if (typeof obj === 'object') {
    result = JSON.stringify(obj)
    result = JSON.parse(result)
  } else {
    result = obj
  }

  return result
}

//
export const getEmptyList = (len = 100) => {
  let xAxisArray = []
  for (let i = 0; i < len; i++) {
    xAxisArray.push('')
  }
  return xAxisArray
}


export const parseTime = (time, cFormat) => {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else if (typeof time === 'string') {
    date = new Date(time);
  } else {
    if (('' + time).length === 10) time = parseInt(time) * 1000;
    time = +time; // 转成int 型
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}


export const uuid = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

// 对于分钟级别的step
// 入参形式 00::00;
// 支持
export const getMinuteRange = (startTime, endTime, step) => {
  let result = [];

  const _compareTime = function (time1, time2) {
    const value1 = _parseTime(time1);
    const value2 = _parseTime(time2);

    const minutes1 = value1.minutes + value1.hours * 60;
    const minutes2 = value2.minutes + value2.hours * 60;

    if (minutes1 === minutes2) {
      return 0;
    }

    return minutes1 > minutes2 ? 1 : -1;
  };

  const _parseTime = function (time) {
    const values = (time || '').split(':');
    if (values.length >= 2) {
      const hours = parseInt(values[0], 10);
      const minutes = parseInt(values[1], 10);

      return {
        hours,
        minutes
      };
    }
    /* istanbul ignore next */
    return null;
  };

  const _formatTime = function (time) {
    return (time.hours < 10 ? '0' + time.hours : time.hours) + ':' + (time.minutes < 10 ? '0' + time.minutes : time.minutes);
  };

  const _nextTime = function (time, step) {
    const timeValue = _parseTime(time);
    const stepValue = _parseTime(step);

    const next = {
      hours: timeValue.hours,
      minutes: timeValue.minutes
    };

    next.minutes += stepValue.minutes;
    next.hours += stepValue.hours;

    next.hours += Math.floor(next.minutes / 60);
    next.minutes = next.minutes % 60;

    return _formatTime(next);
  };

  if (startTime && endTime && step) {
    let current = startTime;
    while (_compareTime(current, endTime) <= 0) {
      result.push(current);
      current = _nextTime(current, step);
    }
  }

  return result;
};


// 根据不同间隔的时间，来划分时间区间。
export const getTimeRange = (startTime, endTime) => {
  let result = [];
  let oneDay = 3600 * 1000 * 24;
  // 转换成当天的 00:00:00 时间
  let _startTime = new Date(startTime).setHours(0, 0, 0, 0);
  let _endTime = new Date(endTime).setHours(0, 0, 0, 0);

  if (_endTime > _startTime) {
    let subResult = _endTime - _startTime;
    let dayNum = subResult / oneDay;

    result.push(_startTime);
    //
    for (let i = 1; i < dayNum; i++) {
      let tempDay = _startTime + (i * oneDay);
      result.push(tempDay);
    }
    result.push(_endTime);
  }
  return result;
};


// 默认： 获取时间的 0点 24点时间。

export const getOneTimeRange = (time, options) => {
  options = options || {};
  if (time) {
    time = parseInt(time, 10);
  } else {
    time = new Date();
  }

  let result = {
    start: 0,
    end: 0
  };

  let _startTime = new Date(time).setHours(options.startHour || 0, options.startMin || 0, 0, 0);
  let _endTime = new Date(time).setHours(options.endHour || 23, options.endMin || 59, 59, 0);
  result.start = new Date(_startTime).getTime();
  result.end = new Date(_endTime).getTime();

  return result;
};





