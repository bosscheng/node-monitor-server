/*
* author: wancheng
* date: 11/5/18
* desc:
*/

const getter = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
};

export default getter;
