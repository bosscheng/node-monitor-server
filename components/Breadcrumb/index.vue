<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item,index)  in levelList" :key="item.path" v-if='item.meta.title'>
        <span v-if='item.redirect==="noredirect"||index==levelList.length-1'
              class="no-redirect">{{item.meta.title}}</span>
        <nuxt-link v-else :to="item.redirect||item.path">{{item.meta.title}}</nuxt-link>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script>

  import routerPathMap from '@/router/routerPathMap';
  // 面包屑
  export default {
    created() {

    },
    data() {
      return {
        levelList: null
      }
    },
    mounted() {
      this.getBreadcrumb()
    },
    watch: {
      $route() {
        this.getBreadcrumb()
      }
    },
    methods: {
      getBreadcrumb() {
        let matched = this.$route.matched.filter(item => item.name);
        let result = [];
        matched.forEach((item) => {
          let itemArray = [];
          let parentPathObj = null;
          let pathObj = null;
          if (item.name.indexOf('-') !== -1) {
            let arg = item.name.split('-');
            let parent = arg[0];
            parentPathObj = routerPathMap[parent];
            pathObj = routerPathMap[arg[1]];
          } else {
            pathObj = routerPathMap[item.name];
          }

          if (parentPathObj) {
            itemArray.push(parentPathObj);
          }

          if (pathObj) {
            itemArray.push(pathObj);
          }

          if (itemArray.length > 0) {
            result = result.concat(itemArray);
          }
        });
        let first = matched[0];

        if (first.name !== 'index') {
          result = [routerPathMap['index']].concat(result);
        }

        //
        this.levelList = result;
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .app-breadcrumb.el-breadcrumb {
    display: inline-block;
    font-size: 14px;
    line-height: 50px;
    margin-left: 10px;

    .no-redirect {
      color: #97a8be;
      cursor: text;
    }
  }
</style>
