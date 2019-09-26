/*
* author: wancheng
* date: 11/5/18
* desc:
*/


import app from './modules/app';
import tagsView from './modules/tagsView';
import getters from './getters';

let store = {
  modules: {
    app:app(),
    tagsView:tagsView()
  },
  getters
};
//
export default store;
