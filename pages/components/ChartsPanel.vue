<template>
  <div>
    <div class="wrap-item" v-if="hasInited">
      <el-row :gutter="10">
        <!-- line -->
        <el-col :span="12">
          <div class="card-border card-item">
            <div class="chart-item">
              <div :id="chartMemOneId" style="height: 300px;width: 100%"></div>
            </div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="card-border card-item">
            <div class="chart-item">
              <div :id="chartMemTwoId" style="height: 300px;width: 100%"></div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="wrap-item" v-if="hasInited">
      <el-row :gutter="10">
        <!-- cpu-->
        <el-col :span="8">
          <div class="card-border card-item">
            <p>系统CPU 使用情况</p>
            <el-progress type="circle" :percentage="osCpu" :width="200"></el-progress>
          </div>
        </el-col>
        <el-col :span="16">
          <div class="card-border card-item">
            <div class="chart-item">
              <div :id="chartNetworkId" style="height: 300px;width: 100%"></div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="wrap-item" v-if="hasInited">
      <el-row :gutter="10">
        <el-col :span="8">
          <div class="card-border card-item">
            <p>程序CPU使用情况</p>
            <el-progress type="circle" :percentage="programCpu" :width="200"></el-progress>
          </div>
        </el-col>
        <el-col :span="16">
          <div class="card-border card-item">
            <div class="chart-item">
              <div :id="chartProgramMemId" style="height: 300px;width: 100%"></div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>

  import echarts from 'echarts';

  import {find, getRandom, getEmptyList} from '@/utils/index';
  import {SYNC_TYPE, CHART_TYPE} from "@/constants";


  const MEMORY_LIST = ['used', 'free', 'buffer', 'cache'];


  export default {
    name: "ChartsPanel",
    props: {
      tempItem: {
        type: Object,
        default: {}
      },
      currentTab: {
        type: String,
      },
      ip: {
        type: String,
      },
      currentTabIndex: {
        type: String
      }
    },

    chartMemOne: null,
    chartMemTwo: null,
    chartNetwork: null,
    chartProgramMem: null,

    data() {
      return {
        hasInited: false,
        osCpu: 0,
        programCpu: 0
      };
    },
    computed: {
      chartProgramMemId: function () {
        return CHART_TYPE.programMem + this.currentTabIndex;
      },
      chartNetworkId: function () {
        return CHART_TYPE.network + this.currentTabIndex;
      },
      chartMemTwoId: function () {
        return CHART_TYPE.memTwo + this.currentTabIndex;
      },
      chartMemOneId: function () {
        return CHART_TYPE.memOne + this.currentTabIndex;
      },
    },

    watch: {

      currentTab: function (val, oldValue) {
        if (this.ip === val) {
          if (!this.hasInited) {
            this.hasInited = true;
            this.$nextTick(() => {
              this.init();
            });
          }
        }
      },

      'tempItem.cpu': function (val) {
        if(this.hasInited){
          this.osCpu = val;
        }
      },

      'tempItem.program': function (val) {
        if (this.hasInited) {
          this.programCpu = val.cpu;
          this.updateChartProgramMemory();
        }

      },
      'tempItem.memory': function (val) {
        if (this.hasInited) {
          this.updateChartMemOne();
          this.updateChartMemTwo();
        }

      },
      'tempItem.networkDownloadList': function () {
        if (this.hasInited) {
          this.updateChartNetwork();
        }

      },
      'tempItem.networkUploadList': function () {
        if (this.hasInited) {
          this.updateChartNetwork();
        }
      }


    },

    mounted() {

    },

    methods: {
      init() {
        // 初始化echarts
        this.initChartMemOne();
        this.initChartMemTwo();
        this.initChartNetwork();
        this.initChartProgramMemory();
      },

      getChartItemDom(type) {
        // 根据数组的index来的。
        let chartId = type + this.currentTabIndex;
        let $chart = document.getElementById(chartId);

        return $chart;
      },

      initChartMemOne() {
        let $chart = this.getChartItemDom(CHART_TYPE.memOne);

        if (!$chart) {
          return;
        }

        //
        let _chart = echarts.init($chart);

        //
        let _chartOptions = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          title: {
            text: '系统内存消耗情况',
            x: 'center'
          },

          xAxis: {
            type: 'value'
          },

          yAxis: {
            type: 'category',
            data: ['used', 'free', 'buffer', 'cache']
          },

          series: [
            {
              type: 'bar',
              data: [0, 0, 0, 0],
              label: {
                formatter: "{b} : {c} ({d}%)"
              },
            }
          ]
        };

        _chart.setOption(_chartOptions);

        this.$options.chartMemOne = _chart;
      },

      initChartMemTwo() {
        let $chart = this.getChartItemDom(CHART_TYPE.memTwo);

        if (!$chart) {
          return;
        }

        //
        let _chart = echarts.init($chart, null);

        let showData = MEMORY_LIST.map((tip) => {
          return {
            name: tip,
            value: 0
          };
        });

        let _chartOptions = {
          title: {
            text: '系统内存消耗占比',
            x: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          series: [
            {
              name: 'Memory',
              type: 'pie',
              radius: '55%',
              center: ['40%', '50%'],
              data: showData,
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
        this.$options.chartMemTwo = _chart;
      },

      initChartNetwork() {
        let $chart = this.getChartItemDom(CHART_TYPE.network);

        if (!$chart) {
          return;
        }

        //
        let _chart = echarts.init($chart);

        let xAxisArray = getEmptyList(50);

        let _chartOptions = {
          title: {
            text: '系统网络上传和下载情况',
            x: 'center'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              animation: false
            }
          },
          axisPointer: {
            link: {xAxisIndex: 'all'}
          },
          grid: [{
            left: 50,
            right: 50,
            height: '35%'
          }, {
            left: 50,
            right: 50,
            top: '55%',
            height: '35%'
          }],
          xAxis: [
            {
              type: 'category',
              boundaryGap: false,
              axisLine: {onZero: true},
              data: xAxisArray,

            },
            {
              gridIndex: 1,
              type: 'category',
              boundaryGap: false,
              axisLine: {onZero: true},
              data: xAxisArray,
              position: 'top',
            }
          ],
          yAxis: [
            {
              name: '上传(单位KB)',
              type: 'value',
            },
            {
              name: "下载(单位KB)",
              gridIndex: 1,
              type: 'value',
              inverse: true
            }
          ],
          series: [
            {
              name: '上传(单位KB)',
              type: 'line',
              symbolSize: 8,
              hoverAnimation: false,
              areaStyle: {},
              data: []
            },
            {
              name: '下载(单位KB)',
              type: 'line',
              xAxisIndex: 1,
              yAxisIndex: 1,
              symbolSize: 8,
              hoverAnimation: false,
              areaStyle: {},
              data: []
            }
          ]
        };

        _chart.setOption(_chartOptions);
        this.$options.chartNetwork = _chart;
      },

      initChartProgramMemory() {
        let $chart = this.getChartItemDom(CHART_TYPE.programMem);

        if (!$chart) {
          return;
        }

        let xAxisArray = getEmptyList(50);

        let _chartOptions = {
          tooltip: {
            trigger: 'axis',
          },
          title: {
            text: '程序内存使用情况',
            x: 'center'
          },

          xAxis: {
            type: 'category',
            data: xAxisArray,
            // 不显示轴线
            splitLine: {
              show: false
            }
          },

          yAxis: {
            type: 'value',
            boundaryGap: false,
            splitLine: {
              show: false
            }
          },
          series: [
            {
              type: 'line',
              showSymbol: false,
              hoverAnimation: false,
              areaStyle: {normal: {}},
              data: []
            }
          ]
        };

        let _chart = echarts.init($chart);


        _chart.setOption(_chartOptions);

        this.$options.chartProgramMem = _chart;
      },

      updateChartItem() {
        this.updateChartMemTwo();
        this.updateChartMemOne();
        this.updateChartNetwork();
        this.updateChartProgramMemory();
      },

      updateChartMemOne() {
        let _chart = this.$options.chartMemOne;
        if (_chart) {
          let obj = this.tempItem.memory;
          let showData = [obj.used || 0, obj.free || 0, obj.buffer || 0, obj.cache || 0];

          _chart.setOption({
            series: {
              data: showData
            }
          });
        }
      },
      updateChartMemTwo() {
        let _chart = this.$options.chartMemTwo;

        if (_chart) {
          let obj = this.tempItem.memory;
          let showData = MEMORY_LIST.map((tip) => {
            return {
              name: tip,
              value: obj[tip] || 0
            };
          });

          _chart.setOption({
            series: {
              data: showData
            }
          });
        }
      },
      updateChartNetwork() {
        let _chart = this.$options.chartNetwork;
        if (_chart) {
          _chart.setOption({
            series: [
              {data: this.tempItem.networkUploadList},
              {data: this.tempItem.networkDownloadList}
            ]
          });
        }
      },
      updateChartProgramMemory() {
        let _chart = this.$options.chartProgramMem;

        if (_chart) {
          _chart.setOption({
            series: {data: this.tempItem.programMemList}
          });
        }

      },
    },

    destroyed() {
      if (this.$options.chartMemOne) {
        this.$options.chartMemOne.clear && this.$options.chartMemOne.clear();
      }
      if (this.$options.chartMemTwo) {
        this.$options.chartMemTwo.clear && this.$options.chartMemTwo.clear();
      }
      if (this.$options.chartNetwork) {
        this.$options.chartNetwork.clear && this.$options.chartNetwork.clear();
      }
      if (this.$options.chartProgramMem) {
        this.$options.chartProgramMem.clear && this.$options.chartProgramMem.clear();
      }
    }
  };
</script>

<style lang="scss">

  .empty-item {
    line-height: 300px;

    p {
      text-align: center;
      font-size: 28px;
    }
  }

  .panel-title {
    text-align: center;
    font-size: 22px;
  }

  .card-item {
    height: 320px;

    p {
      text-align: center;
    }

    text-align: center;
  }

  .chart-item {
    height: 300px;
    width: 100%;
    position: relative;
  }

  .panel-group {
    text-align: center;
  }

  .card-title {
    text-align: center;
  }

  .wrap-item {
    margin-bottom: 10px;
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
      margin: 10px 20px;

      .internel {
        margin: 10px;
        border-left: 4px solid #cfd8dc;
        padding-left: 15px;
      }
    }

  }
</style>
