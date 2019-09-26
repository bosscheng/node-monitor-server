<template>
  <div class="card-border card-panel">
    <p>系统基本信息</p>
    <div class="panel-group">
      <div class="panel-item">
        <div class="internel">
          <small>当前时间</small>
          <br>
          <strong>{{currentTime}}</strong>
        </div>
      </div>
      <div class="panel-item">
        <div class="internel">
          <small>系统运行时间</small>
          <br>
          <strong>{{runningTime}}</strong>
        </div>
      </div>
      <div class="panel-item">
        <div class="internel">
          <small>系统登录用户个数</small>
          <br>
          <strong>{{users || 0}}</strong>
        </div>
      </div>
      <div class="panel-item">
        <div class="internel">
          <small>系统平均负载</small>
          <br>
          <strong>最近1分钟：{{loadAverages[0]|| 0}}，最近5分钟：{{loadAverages[1]|| 0}}，最近15分钟:{{loadAverages[2]|| 0}}</strong>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "SystemPanel",
    props: {
      system: {
        type: Object,
        default: {}
      }
    },
    data() {
      return {
        currentTime: '----',
        runningTime: '----',
        users: 0,
        loadAverages: []
      };
    },
    watch: {
      system: function (val, oldValue) {
        this.currentTime = val.currentTime;
        this.runningTime = val.runningTime;
        this.users = val.users;
        this.loadAverages = val.loadAverages;
      }
    }
  };
</script>

<style lang="scss" >
  .panel-group {
    text-align: center;
  }

  .card-panel {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: center;


    p {
      text-align: center;
    }

    div {
      flex-direction: row;
      justify-content: left;
    }

    .panel-item {
      display: inline-flex;
      text-align: left;
      border: 1px solid #cfd8dc;
      /*width: 170px;*/
      margin: 10px 10px;

      .internel {
        margin: 10px;
        border-left: 4px solid #cfd8dc;
        padding-left: 15px;
      }
    }

  }
</style>
