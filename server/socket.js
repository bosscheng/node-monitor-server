const {saveHistoryDay, saveHistoryHour, saveHistoryMinute, saveHistory10Minute} = require('./service/history');
const {saveLogList} = require('./service/log');

module.exports = function (server, context) {

  const io = require('socket.io')(server);

  let lruCache = context.lruCache;
  //
  io.on('connection', (socket) => {

    console.log('socket connection');

    //
    socket.on('sync-systemInfo', (msg) => {
      socket.broadcast.emit('sync-web-systemInfo', msg);
    });

    socket.on('sync-cpuInfo', (msg) => {
      socket.broadcast.emit('sync-web-cpuInfo', msg);
    });

    socket.on('sync-memoryInfo', (msg) => {
      socket.broadcast.emit('sync-web-memoryInfo', msg);
    });

    socket.on('sync-networkUploadInfo', (msg) => {
      socket.broadcast.emit('sync-web-networkUploadInfo', msg);
    });

    socket.on('sync-networkDownloadInfo', (msg) => {
      socket.broadcast.emit('sync-web-networkDownloadInfo', msg);
    });

    socket.on('sync-programInfo', (msg) => {
      socket.broadcast.emit('sync-web-programInfo', msg);
    });

    socket.on('sync-programLog', (msg) => {
      // 存储在数据库中。
      socket.broadcast.emit('sync-web-programLog', msg);
      try {
        saveLogList(msg);
      } catch (e) {
        console.log(e);
      }

    });

    // 按照分钟统计
    socket.on('sync-history-minutes', (msg) => {
      // 存储在数据库中。
      saveHistoryMinute(msg);
    });

    socket.on('sync-history-10minutes', (msg) => {
      // 存储在数据库中。
      saveHistory10Minute(msg);
    });

    // 按照小时统计
    socket.on('sync-history-hour', (msg) => {
      // 存储在数据库中。
      saveHistoryHour(msg);
    });

    // 按按照天统计
    socket.on('sync-history-day', (msg) => {
      // 存储在数据库中。
      saveHistoryDay(msg);
    });


  });
};
