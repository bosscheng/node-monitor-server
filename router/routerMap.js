let array = [
  // {
  //   path: '/redirect',
  //   hidden: true,
  //   children: [
  //     {
  //       path: '/redirect/:path*',
  //       name:'redirect'
  //     }
  //   ]
  // },
  {path: '/404', hidden: true},
  // 首页`
  {
    path: '',
    redirect: 'index',
    children: [{
      path: '',
      name: 'index',
      meta: {title: '首页', icon: 'excel', noCache: true}
    }]
  },
  // ip
  {
    path:'/ip',
    children: [
      {
        path: '',
        name: 'ip',
        meta: {title: 'CND节点', icon: 'international', noCache: true}
      },
    ]
  },
  {
    path:'/fms',
    children: [
      {
        path: '',
        name: 'fms',
        meta: {title: 'FMS节点', icon: 'example', noCache: true}
      },
    ]
  },
  // history
  {
    path: '/history',
    children: [
      {
        path: '',
        name: 'history',
        meta: {title: '历史数据', icon: 'chart', noCache: true}
      },
      {
        path: 'show',
        hidden: true,
        name: 'historyShow',
        meta: {
          title: '查看',
          noCache: true
        }
      }
    ]
  },
  // log
  {
    path: '/log',
    children: [
      {
        path: '',
        name: 'log',
        meta: {title: '日志', icon: 'message', noCache: true}
      }
    ]
  }
];

export default array;
