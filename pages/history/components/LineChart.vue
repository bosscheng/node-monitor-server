<template>
  <div :id="chartId" style="height: 250px;width: 100%"></div>
</template>

<script>
  import {uuid} from '@/utils';
  import echarts from 'echarts';
  import {HISTORY_CHART_TYPE} from "@/constants";

  const getChartOptions = (xList, seriesList, yTitle) => {
    return {
      tooltip: {
        trigger: 'axis',
      },

      xAxis: {
        type: 'category',
        data: xList,
        name: '时间'
      },

      yAxis: {
        type: 'value',
        name: yTitle
      },
      series: seriesList
    };
  };

  export default {
    name: "LineChart",
    props: {
      dataList: {
        type: Array,
        default: []
      },
      xList: {
        type: Array,
        default: []
      },
      type: {
        type: String,
      }
    },
    //
    chart: null,
    //
    data() {
      return {};
    },
    //
    watch: {
      dataList: function (val) {
        this.init();
      }
    },
    computed: {
      yTitle: function () {
        let result = '';
        switch (this.type) {
          case HISTORY_CHART_TYPE.cpu:
            result = '百分比';
            break;
          case HISTORY_CHART_TYPE.memory:
            result = 'MB';
            break;
          case HISTORY_CHART_TYPE.network:
            result = 'B';
        }
        return result;
      },
      //
      chartId: function () {
        return uuid() + this.type;
      }
    },

    mounted() {
      this.init();
    },
    //
    methods: {
      init() {
        if (this.dataList.length > 0 && this.xList.length > 0) {
          let options = getChartOptions(this.xList, this.dataList, this.yTitle);
          this.initChart(options);
        }
      },

      initChart(options) {
        //
        let $chart = document.getElementById(this.chartId);

        if ($chart) {

          let _chart = echarts.init($chart, null);

          let _chartOptions = options;

          _chart.setOption(_chartOptions);

          this.$options.chart = _chart;
        }

      }
    },

    destroyed() {
      if (this.$options.chart) {
        this.$options.chart.clear && this.$options.chart.clear();
        this.$options.chart = null;
      }
    }

  };
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
