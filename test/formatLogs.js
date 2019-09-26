/*
* date: 2019-06-21
* desc:
*/

const formatLogs = require('../server/utils/formatLogs');

const log = `
2019-04-16 14:05:32|debug| xxxxxxx,fdafdafdaf
2019-04-16 14:05:32|debug| Uncaught TypeError: Cannot read property 'bind' of undefined
    at Object.<anonymous> (<anonymous>:1:957)
    at Object.r (<anonymous>:1:375)
    at Object.emit (<anonymous>:1:694)
    at Object.onInit (build.js:sourcemap:15)
    at build.js:sourcemap:15
    at Array.forEach (<anonymous>)
    at r.value (build.js:sourcemap:15)
    at new r (build.js:sourcemap:15)
    at Object.<anonymous> (build.js:sourcemap:1)
    at e (build.js:sourcemap:1)
2019-04-16 14:05:32|debug| xxxxxxx,fdafdafdaf
2019-04-16 14:05:32|debug| xxxxxxx,fdafdafdaf
2019-04-16 14:05:32|debug| xxxxxxx,fdafdafdaf
2019-04-16 14:05:32|debug| Uncaught TypeError: Cannot read property 'bind' of undefined
    at Object.<anonymous> (<anonymous>:1:957)
    at Object.r (<anonymous>:1:375)
    at Object.emit (<anonymous>:1:694)
    at Object.onInit (build.js:sourcemap:15)
    at build.js:sourcemap:15
    at Array.forEach (<anonymous>)
    at r.value (build.js:sourcemap:15)
    at new r (build.js:sourcemap:15)
    at Object.<anonymous> (build.js:sourcemap:1)
    at e (build.js:sourcemap:1)
2019-04-16 14:05:32|debug| xxxxxxx,fdafdafdaf

`;

console.log(formatLogs([log]));
