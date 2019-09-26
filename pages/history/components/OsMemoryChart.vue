<template>
  <div :id="chartId"></div>
</template>

<script>
  import {uuid} from '@/utils';
  import echarts from 'echarts';

  // 系统 memory
  export default {
    name: "OsMemoryChart",
    props: {
      dataList: {
        type: Array,
        default: []
      },
      chartId: {
        type: String,
        default: uuid()
      },
      xList: {
        type: Array,
        default: []
      }
    },
    methods: {
      init() {

      }
    }

  }
</script>

<style scoped>

</style>
