/*
* date: 2019-05-27
* desc:
*/

process.env.NODE_ENV = 'production';
const mongodb = require('../server/db');

mongodb().then(() => {
  console.log('success');
}).catch(() => {
  console.error('gg');
});
