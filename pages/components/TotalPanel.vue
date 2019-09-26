<template>
  <div class="total-panel">
    <el-row :gutter="10">
      <el-col :span="12">
        <div class="card-border item-border">
          <p class="item-title"><strong>CDN节点</strong></p>
          <el-row :gutter="40" class="panel-group-wrap">
            <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
              <div class="card-panel-item">
                <div class="card-panel-description">
                  <div class="card-panel-text">配置节点个数</div>
                  <count-to :start-val="0" :end-val="ipList.length" :duration="1000" class="card-panel-num"/>
                </div>
              </div>
            </el-col>
            <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
              <div class="card-panel-item">
                <div class="card-panel-description">
                  <div class="card-panel-text">连接节点个数</div>
                  <count-to :start-val="0" :end-val="connectIpList.length" :duration="1000" class="card-panel-num"/>
                </div>
              </div>
            </el-col>
            <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
              <div class="card-panel-item">
                <div class="card-panel-description">
                  <div class="card-panel-text">未连接节点个数</div>
                  <count-to :start-val="0" :end-val="loseIpList.length" :duration="1000" class="card-panel-num"/>
                </div>
              </div>
            </el-col>
            <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
              <div class="card-panel-item">
                <div class="card-panel-description">
                  <div class="card-panel-text">系统健康情况</div>
                  <template v-if="ipHealthLevel === 0">
                    <el-tag type="success">健康</el-tag>
                  </template>
                  <template v-else>
                    <el-tag type="danger">危险</el-tag>
                  </template>

                </div>
              </div>
            </el-col>
          </el-row>

          <el-row :gutter="40" class="list-group-panel">
            <el-col :span="12">
              <div class="card-border">
                <el-table :data="ipList" style="width: 100%" height="300"
                          :default-sort="{prop: 'status', order: 'descending'}">
                  <el-table-column label="IP" align="center">
                    <template slot-scope="scope">
                      {{scope.row.ip}}
                    </template>
                  </el-table-column>

                  <el-table-column label="状态" align="center" width="100" sortable prop="status"
                                   :sort-orders="['ascending','descending']">
                    <template slot-scope="scope">
                      <el-tag type="success" v-if="scope.row.status">已连接</el-tag>
                      <el-tag type="danger" v-else>未连接</el-tag>
                    </template>
                  </el-table-column>
                </el-table>
              </div>

            </el-col>
            <el-col :span="12">
              <div class="card-border">
                <div id="totalChartPieId" style="height: 300px;width: 100%"></div>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="card-border item-border">
          <p class="item-title"><strong>FMS节点</strong></p>
          <el-row :gutter="40" class="panel-group-wrap">
            <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
              <div class="card-panel-item">
                <div class="card-panel-description">
                  <div class="card-panel-text">配置节点个数</div>
                  <count-to :start-val="0" :end-val="fmsList.length" :duration="1000" class="card-panel-num"/>
                </div>
              </div>
            </el-col>
            <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
              <div class="card-panel-item">
                <div class="card-panel-description">
                  <div class="card-panel-text">连接节点个数</div>
                  <count-to :start-val="0" :end-val="connectFmsList.length" :duration="1000" class="card-panel-num"/>
                </div>
              </div>
            </el-col>
            <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
              <div class="card-panel-item">
                <div class="card-panel-description">
                  <div class="card-panel-text">未连接节点个数</div>
                  <count-to :start-val="0" :end-val="loseFmsList.length" :duration="1000" class="card-panel-num"/>
                </div>
              </div>
            </el-col>
            <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
              <div class="card-panel-item">
                <div class="card-panel-description">
                  <div class="card-panel-text">系统健康情况</div>
                  <template v-if="fmsHealthLevel === 0">
                    <el-tag type="success">健康</el-tag>
                  </template>
                  <template v-else>
                    <el-tag type="danger">危险</el-tag>
                  </template>

                </div>
              </div>
            </el-col>
          </el-row>

          <el-row :gutter="40" class="list-group-panel">
            <el-col :span="12">
              <div class="card-border">
                <el-table :data="fmsList" style="width: 100%" height="300"
                          :default-sort="{prop: 'status', order: 'descending'}">
                  <el-table-column label="IP" align="center">
                    <template slot-scope="scope">
                      {{scope.row.ip}}
                    </template>
                  </el-table-column>

                  <el-table-column label="状态" align="center" width="100" sortable prop="status"
                                   :sort-orders="['ascending','descending']">
                    <template slot-scope="scope">
                      <el-tag type="success" v-if="scope.row.status">已连接</el-tag>
                      <el-tag type="danger" v-else>未连接</el-tag>
                    </template>
                  </el-table-column>
                </el-table>
              </div>

            </el-col>
            <el-col :span="12">
              <div class="card-border">
                <div id="totalChartPieId2" style="height: 300px;width: 100%"></div>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>

  </div>
</template>

<script>
  import echarts from 'echarts';
  import CountTo from '@/components/CountTo';
  import {IP_TYPE} from "@/constants";

  // 总面板
  export default {
    name: "TotalPanel",
    props: {
      dataList: {
        type: Array,
        default: function () {
          return [];
        }
      },
      currentTab: {
        type: String
      }
    },
    totalChartPie: null,
    totalChartPie2: null,
    data() {
      return {
        name: 'total',
        hasInited: false,
        ipList: [],
        fmsList: [],
      };

    },
    components: {CountTo},

    mounted() {
      if (this.name === this.currentTab) {
        this.init();
        this.hasInited = true;
      }

    },
    computed: {
      loseIpList: function () {
        let result = [];
        this.ipList.forEach((item) => {
          let hasLose = true;
          for (let i = 0, len = this.dataList.length; i < len; i++) {
            let tempItem = this.dataList[i];
            if (tempItem.ip === item.ip) {
              hasLose = false;
              break;
            }
          }
          if (hasLose) {
            result.push(item);
          }
        });
        return result;
      },

      connectIpList: function () {
        let result = [];
        this.ipList.forEach((item) => {
          let hasConnect = false;
          for (let i = 0, len = this.dataList.length; i < len; i++) {
            let tempItem = this.dataList[i];
            if (tempItem.ip === item.ip) {
              hasConnect = true;
              break;
            }
          }
          if (hasConnect) {
            result.push(item);
          }
        });
        return result;
      },


      loseFmsList: function () {
        let result = [];
        this.fmsList.forEach((item) => {
          let hasLose = true;
          for (let i = 0, len = this.dataList.length; i < len; i++) {
            let tempItem = this.dataList[i];
            if (tempItem.ip === item.ip) {
              hasLose = false;
            }
          }
          if (hasLose) {
            result.push(item);
          }
        });

        return result;
      },

      connectFmsList: function () {
        let result = [];
        this.fmsList.forEach((item) => {
          let hasConnect = false;
          for (let i = 0, len = this.dataList.length; i < len; i++) {
            let tempItem = this.dataList[i];
            if (tempItem.ip === item.ip) {
              hasConnect = true;
              break;
            }
          }
          if (hasConnect) {
            result.push(item);
          }
        });
        return result;
      },

      //
      ipHealthLevel: function () {
        let result = 1;
        let liveNum = 0;
        //
        this.ipList.forEach((ipItem) => {
          if (ipItem.status) {
            liveNum += 1;
          }
        });

        //
        if (liveNum === this.ipList.length) {
          result = 0;
        }

        return result;
      },

      fmsHealthLevel: function () {
        let result = 1;
        let liveNum = 0;
        //
        this.fmsList.forEach((ipItem) => {
          if (ipItem.status) {
            liveNum += 1;
          }
        });

        //
        if (liveNum === this.fmsList.length) {
          result = 0;
        }

        return result;
      }
    },

    watch: {
      dataList: function (list) {
        this.updateIpListStatus();
        list.forEach((item) => {
          this.updateIpList(item.ip);
          this.updateFmsList(item.ip);
        });
        this.updateTotalChartPie();
        this.updateTotalChartPie2();
      }
    },

    methods: {
      init() {
        this.initTotalChartPie();
        this.initTotalChartPie2();
        this.getIpList();
        this.getFmsList();
      },

      async getIpList() {
        let {data} = await this.$axios.$get('/ip');
        this.ipList = (data || []).map((item) => {
          return {
            ip: item.name,
            status: 0
          };
        });
        this.updateTotalChartPie();
      },

      async getFmsList() {
        let {data} = await this.$axios.$get('/fms');
        this.fmsList = (data || []).map((item) => {
          return {
            ip: item.name,
            status: 0
          };
        });
        this.updateTotalChartPie2();
      },

      initTotalChartPie2() {
        let $chart = document.getElementById('totalChartPieId2');

        if (!$chart) {
          return;
        }

        let _chart = echarts.init($chart);

        let _chartOptions = {
          title: {
            text: '节点连接统计',
            x: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: "{b} : {c} ({d}%)"
          },
          legend: {
            type: 'scroll',
            orient: 'vertical',
            right: 10,
            top: 20,
            bottom: 20,
            data: ['已连接', '未连接'],
          },
          series: [
            {
              type: 'pie',
              radius: '55%',
              center: ['40%', '50%'],
              data: [],

              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              },
              label: {
                formatter: "{b} : {c} ({d}%)"
              },
            }
          ]
        };

        _chart.setOption(_chartOptions);

        this.$options.totalChartPie2 = _chart;

      },

      initTotalChartPie() {
        let $chart = document.getElementById('totalChartPieId');

        if (!$chart) {
          return;
        }

        let _chart = echarts.init($chart);

        let _chartOptions = {
          title: {
            text: '节点连接统计',
            x: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: "{b} : {c} ({d}%)"
          },
          legend: {
            type: 'scroll',
            orient: 'vertical',
            right: 10,
            top: 20,
            bottom: 20,
            data: ['已连接', '未连接'],
          },
          series: [
            {
              type: 'pie',
              radius: '55%',
              center: ['40%', '50%'],
              data: [],

              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              },
              label: {
                formatter: "{b} : {c} ({d}%)"
              },
            }
          ]
        };

        _chart.setOption(_chartOptions);

        this.$options.totalChartPie = _chart;

      },

      //
      updateIpListStatus() {
        this.ipList.forEach((item) => {
          item.status = 0;
        });
      },

      updateIpList(ip) {
        this.ipList.forEach((item) => {
          if (item.ip === ip) {
            item.status = 1;
            this.$emit('updateType', {ip, type: IP_TYPE.cdn});
          }
        });
      },

      updateFmsList(ip) {
        this.fmsList.forEach((item) => {
          if (item.ip === ip) {
            item.status = 1;
            this.$emit('updateType', {ip, type: IP_TYPE.fms});
          }
        });
      },


      updateTotalChartPie() {
        let _chart = this.$options.totalChartPie;

        if (_chart) {
          let showData = [
            {
              name: '已连接',
              value: this.connectIpList.length
            },
            {
              name: '未连接',
              value: this.loseIpList.length
            }
          ];

          _chart.setOption({
            series: {
              data: showData
            }
          });
        }
      },

      updateTotalChartPie2() {
        let _chart = this.$options.totalChartPie2;

        if (_chart) {
          let showData = [
            {
              name: '已连接',
              value: this.connectFmsList.length
            },
            {
              name: '未连接',
              value: this.loseFmsList.length
            }
          ];

          _chart.setOption({
            series: {
              data: showData
            }
          });
        }
      }
    },

    destroyed() {
      if (this.$options.totalChartPie) {
        this.$options.totalChartPie.clear && this.$options.totalChartPie.clear();
      }

      if (this.$options.totalChartPie2) {
        this.$options.totalChartPie2.clear && this.$options.totalChartPie2.clear();
      }
    }
  };
</script>

<style lang="scss" scoped>
  .panel-group-wrap {
    margin-top: 18px;

    .card-panel-col {
      margin-bottom: 32px;
    }

    .card-panel-item {
      height: 108px;
      cursor: pointer;
      font-size: 12px;
      position: relative;
      overflow: hidden;
      color: #666;
      background: #fff;
      box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
      border-color: rgba(0, 0, 0, .05);
      text-align: center;
    }


    .card-panel-description {
      font-weight: bold;
      margin: 26px;
      text-align: center;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }

  }


  .list-group-panel {
    height: 350px;
  }

  .total-panel {
    min-height: -webkit-calc(100vh - 200px);

    .item-title {
      text-align: center;
    }

    .item-border {
      padding: 5px 10px;
    }
  }

</style>
