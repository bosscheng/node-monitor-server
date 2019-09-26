/*
* date: 2019-05-28
* desc:
*/
import Vue from 'vue';

import * as filters from '../filters/filters' // global filters

// 设置过滤器
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
});
