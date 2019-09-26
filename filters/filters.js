/*
* date: 2019-05-28
* desc:
*/
export {parseTime} from '~/utils';


// 省略字符串，如果字符串的长度超过指定长度，则省略展示。
export function ellipsisStr(str, length) {
  length = length || 100;

  let result = str;

  if (str.length > length) {
    result = str.slice(0, length) + '...';
  }

  return result;
}


export function broadcastStatus(status) {
  return status == 1 ? '有推流' : '无推流'
}
