/*
* date: 2019-06-21
* desc:
*/
module.exports = (strA) => {
  // 格式化字符串。
  let result = [];
  let tempStr = '';

  strA.forEach((str) => {
    let strArray = str.split('\n');
    strArray.forEach((item, index) => {
      item = item || '';

      if (!item) {
        return;
      }

      let nextItem = strArray[++index] || '';
      if (item.startsWith('20')) {
        // 下一行也是 20 打头的。表示数字
        if (nextItem.startsWith('20')) {
          result.push(item);
        } else {
          if (!tempStr) {
            tempStr = item;
          } else {
            console.error(`tempStr:${tempStr}`);
          }
        }
      } else {
        // 如果下一行是新的
        if (nextItem && nextItem.startsWith('20')) {
          result.push(tempStr);
          tempStr = '';
        } else {
          if (tempStr) {
            tempStr = tempStr + '\n' + item;
          } else {
            console.error(`tempStr is empty`);
          }

          // 最后一行
          if (!nextItem) {
            result.push(tempStr);
          }
        }
      }
    });
  });

  return result;
};
