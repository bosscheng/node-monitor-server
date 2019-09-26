<template>
  <div class="card-border card-panel" style="margin-bottom: 10px">
    <p>系统内存使用情况</p>
    <div class="panel-group">
      <div class="panel-item">
        <div class="internel">
          <small>系统总内存(total)</small>
          <br>
          <strong>{{total}} <span>MB</span></strong>
        </div>
      </div>
      <div class="panel-item">
        <div class="internel">
          <small>已使用内存(used)</small>
          <br>
          <strong>{{used}} <span>MB</span></strong>
        </div>
      </div>
      <div class="panel-item">
        <div class="internel">
          <small> 空闲内存(Free)</small>
          <br>
          <strong>{{free}} <span>MB</span></strong>
        </div>
      </div>
      <div class="panel-item">
        <div class="internel">
          <small>Buffer 内存(Buffer)</small>
          <br>
          <strong>{{buffer}} <span>MB</span></strong>
        </div>
      </div>
      <div class="panel-item">
        <div class="internel">
          <small>Cache 内存(Cache)</small>
          <br>
          <strong>{{cache}} <span>MB</span></strong>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "MemoryPanel",

    props: {
      memory: {
        type: Object,
        default: {}
      }
    },
    data() {
      return {
        total: '----',
        used: '----',
        free: '----',
        buffer: '----',
        cache: '----'
      };
    },

    watch: {
      memory: function (val, oldValue) {
        this.total = val.total;
        this.used = val.used;
        this.free = val.free;
        this.buffer = val.buffer;
        this.cache = val.cache;
      }
    }

  };
</script>

<style rel="stylesheet/scss" lang="scss">

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
