module.exports = {
  db: {
    development: 'mongodb://127.0.0.1:27017',
    production: 'mongodb://xxx'
  },
  dbLogin: {
    development: {
      dbName: 'monitor',
      keepAlive: 1,
      useNewUrlParser: true
    },
    production: {
      user: 'xx',
      pass: 'xx',
      dbName: 'monitor',
      keepAlive: 1,
      useNewUrlParser: true
    }
  },
};
