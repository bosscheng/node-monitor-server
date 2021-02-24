<template>
  <div id="app">
    <div class="app-wrapper" :class="classObj">
      <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside"></div>
      <sidebar class="sidebar-container"></sidebar>
      <div class="main-container">
        <!--        <div class="fixed-header">-->
        <!--          <navbar></navbar>-->
        <!--          <tags-view/>-->
        <!--        </div>-->
        <navbar></navbar>
        <app-main></app-main>
        <div class="app-footer">Copyright © 2019 <strong></strong> All Rights Reserved.</div>
      </div>
    </div>
  </div>

</template>
<script>
  import Navbar from './components/Navbar';
  import Sidebar from './components/Sidebar/index'
  import AppMain from './components/AppMain';
  import TagsView from './components/TagsView/index'
  import ResizeMixin from './mixin/ResizeHandler'

  export default {
    components: {
      Navbar,
      Sidebar,
      AppMain, //
    },
    mixins: [ResizeMixin],
    computed: {
      sidebar() {
        return this.$store.state.app.sidebar
      },
      device() {
        return this.$store.state.app.device
      },
      classObj() {
        return {
          hideSidebar: !this.sidebar.opened,
          withoutAnimation: this.sidebar.withoutAnimation,
          mobile: this.device === 'mobile'
        }
      }
    },
    methods: {
      handleClickOutside() {
        this.$store.dispatch('closeSideBar', {withoutAnimation: false})
      }
    }
  }
</script>

<style lang="scss">
  @import "~/assets/css/index.scss";
</style>

<style lang="scss">
  @import "~/assets/css/mixin.scss";

  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
  }

  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }

  .main-container {
    position: relative;
    padding-bottom: 30px;
  }


  .app-footer {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 30px;
    line-height: 30px;
    text-align: center;
    color: #ccc;
    font-size: 12px;

    a {
      font-weight: bold;
      color: #999;
    }
  }
</style>
