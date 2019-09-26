import {Message} from 'element-ui';

export default function ({$axios}) {
  $axios.onRequest(config => {
    return config;
  });

  $axios.onResponse(response => {
    const res = response.data || {};

    if (res.code === 0) {
      return res;
    } else {
      Message({
        message: res.msg || '网络异常',
        type: 'error',
        duration: 5 * 1000
      });
      return Promise.reject('error');
    }
  });

  $axios.onError(error => {
    //   报网络异常错误
    Message({
      message: error.data || '网络异常',
      type: 'error',
      duration: 5 * 1000
    });
    return Promise.reject(error)
  })
}
