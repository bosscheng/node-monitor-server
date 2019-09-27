<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select clearable style="width: 150px" size="small" v-model="query.ip" placeholder="选择IP"
                 @change="handleIpChange" filterable>
        <el-option-group
          v-for="group in allList"
          :key="group.value"
          :label="group.label">
          <el-option
            v-for="item in group.list"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-option-group>
      </el-select>
      <template v-if="query.ip">
        <el-date-picker
          v-model="query.times"
          type="daterange"
          size="small"
          :clearable="false"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="timestamp"
          @change="handleChangeDate"
          :picker-options="picker.options">
        </el-date-picker>
        <template v-if="query.times[0] === query.times[1]">
          <el-time-select
            placeholder="起始时间"
            size="small"
            v-model="query.minuteStartTime"
            @change="handleChangeMinute"
            :clearable="false"
            :picker-options="{
            start: '00:00',
            step: '00:10',
            end: '23:59'
          }">
          </el-time-select>
          <el-time-select
            placeholder="结束时间"
            size="small"
            v-model="query.minuteEndTime"
            :clearable="false"
            :picker-options="{
            start: '00:00',
            step: '00:10',
            end: '23:59',
            minTime: query.minuteStartTime
          }">
          </el-time-select>
        </template>
        <el-button type="primary" size="small" icon="el-icon-search" @click="handleQuery">搜索</el-button>
      </template>
    </div>
    <div class="body-wrap" v-loading="loading" element-loading-text="拼命加载中">
      <div class="wrap-item">
        <p></p>
        <el-row :gutter="30">
          <el-col :span="12">
            <div class="card-border card-item">
              <p>系统内存使用情况</p>
              <template v-if="osMemoryList.length > 0">
                <line-chart :dataList="osMemoryList" :xList="xList" :type="chartTypeConstant.memory"></line-chart>
              </template>
              <template v-else>
                <p class="no-data">on data</p>
              </template>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="card-border card-item">
              <p>系统CPU使用情况</p>
              <template v-if="osCpuList.length > 0">
                <line-chart :dataList="osCpuList" :xList="xList" :type="chartTypeConstant.cpu"></line-chart>
              </template>
              <template v-else>
                <p class="no-data">on data</p>
              </template>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="wrap-item">
        <el-row :gutter="30">
          <el-col :span="12">
            <div class="card-border card-item">
              <p>网络上传历史记录</p>
              <template v-if="osNetworkUploadList.length > 0">
                <line-chart :dataList="osNetworkUploadList" :xList="xList"
                            :type="chartTypeConstant.network"></line-chart>
              </template>
              <template v-else>
                <p class="no-data">on data</p>
              </template>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="card-border card-item">
              <p>网络下载历史记录</p>

              <template v-if="osNetworkDownloadList.length > 0">
                <line-chart :dataList="osNetworkDownloadList" :xList="xList"
                            :type="chartTypeConstant.network"></line-chart>
              </template>
              <template v-else>
                <p class="no-data">on data</p>
              </template>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="wrap-item">
        <el-row :gutter="30">
          <el-col :span="12">
            <div class="card-border card-item">
              <p>程序内存使用记录</p>
              <template v-if="programMemoryList.length > 0">
                <line-chart :dataList="programMemoryList" :xList="xList" :type="chartTypeConstant.memory"></line-chart>
              </template>
              <template v-else>
                <p class="no-data">on data</p>
              </template>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="card-border card-item">
              <p>程序CPU使用记录</p>
              <template v-if="programCpuList.length > 0">
                <line-chart :dataList="programCpuList" :xList="xList" :type="chartTypeConstant.cpu"></line-chart>
              </template>
              <template v-else>
                <p class="no-data">on data</p>
              </template>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>

  import LineChart from './components/LineChart';
  import {parseTime, getTimeRange, getMinuteRange, getOneTimeRange} from '@/utils';
  import {HISTORY_CHART_TYPE} from '@/constants';
  import _ from 'lodash';

  const _oneDay = 3600 * 1000 * 24;
  const _name = 'history';
  const _now = (new Date()).getTime();
  const _pre = _now - (_oneDay * 7);

  const TYPE = {
    day: 'day',
    hour: 'hour',
    minute10: 'minute10',
    minute: 'minute'
  };

  export default {

    name: _name,

    data() {
      return {
        query: {
          ip: '',
          times: [_pre, _now],
          minuteStartTime: '00:00',
          minuteEndTime: '23:50'
        },
        picker: {
          options: {
            disabledDate(time) {
              return time.getTime() > Date.now();
            },
            shortcuts: [{
              text: '最近一周',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit('pick', [start, end]);
              }
            }, {
              text: '最近二周',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 14);
                picker.$emit('pick', [start, end]);
              }
            }, {
              text: '最近三周',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 21);
                picker.$emit('pick', [start, end]);
              }
            }, {
              text: '最近一个月',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                picker.$emit('pick', [start, end]);
              }
            }]
          },
        },
        loading: true,
        ipList: [],
        allList: [],
        osNetworkUploadList: [],
        osNetworkDownloadList: [],
        osCpuList: [],
        osMemoryList: [],
        programCpuList: [],
        programMemoryList: [],
        xList: [],
        chartTypeConstant: HISTORY_CHART_TYPE
      };
    },

    mounted() {
      this.init();
    },

    components: {LineChart},

    watch: {
      '$route': function (to, from) {
        if (to.name != _name) {
          this.$destroy();
        }
      }
    },

    methods: {
      init() {
        this.getIpList();
      },

      async getIpList() {
        let {data} = await this.$axios.$get('/ip');
        this.ipList = (data || []).map((item) => {
          return {
            value: item.name,
            label: item.name
          };
        });

        this.allList = [
          {
            label: '节点',
            list: this.ipList
          }
        ];

        if (this.ipList.length > 0) {
          this.query.ip = this.ipList[0].value;
          this.getHistoryData();
        } else {
          this.loading = false;
        }
      },

      // 需要判断
      getHistoryData() {
        let query = this.query;
        let startDay = query.times[0];
        let endDay = query.times[1];
        if (!query.ip) {
          this.$message({
            type: 'error',
            message: '请选选择IP!'
          });
          this.loading = false;
          return;
        }

        if (endDay - startDay > (30 * _oneDay)) {
          startDay = endDay - (30 * _oneDay);
        }

        // update times
        query.times = [startDay, endDay];


        let params = {};
        this.loading = true;
        //
        if (startDay === endDay) {
          let minuteStart = query.minuteStartTime;
          let minuteEnd = query.minuteEndTime;
          // 从minu表里面查询
          let minuteStartArray = minuteStart.split(':');
          let minuteEndArray = minuteEnd.split(':');
          let startHour = minuteStartArray[0];
          let startMin = minuteStartArray[1];
          let endHour = minuteEndArray[0];
          let endMin = minuteEndArray[1];
          // 直接搜索一天内的。
          if (minuteStart === '00:00' && minuteEnd === '23:50') {
            params = {
              ip: this.query.ip,
              start: new Date(startDay).getTime(),
              end: new Date(endDay).getTime()
            };
            this.doGetHistoryData(params, TYPE.hour);
          } else {
            params = {
              ip: this.query.ip,
              start: new Date(startDay).getTime(),
              minuteStartHour: parseInt(startHour, 10),
              minuteStartMin: parseInt(startMin, 10),
              minuteEndHour: parseInt(endHour, 10),
              minuteEndMin: parseInt(endMin, 10)
            };

            // 三小时以内。
            if (endHour - startHour > 2) {
              this.doGetHistoryData(params, TYPE.minute10);
            } else {
              this.doGetHistoryData(params, TYPE.minute);
            }
          }
        } else {
          params = {
            ip: this.query.ip,
            start: new Date(startDay).getTime(),
            end: new Date(endDay).getTime()
          };
          this.doGetHistoryData(params, TYPE.day);
        }
      },

      async doGetHistoryData(query, type) {
        let result = [];
        let start = '';
        let end = '';
        if (type === TYPE.minute || type === TYPE.minute10) {
          let options = {
            startHour: query.minuteStartHour,
            startMin: query.minuteStartMin,
            endHour: query.minuteEndHour,
            endMin: query.minuteEndMin
          };
          let timeRange = getOneTimeRange(query.start, options);
          start = timeRange.start;
          end = timeRange.end;
        } else {
          let startRange = getOneTimeRange(query.start);
          let endRange = getOneTimeRange(query.end);
          start = startRange.start;
          end = endRange.end;
        }

        let _query = {
          ip: query.ip,
          start: start,
          end: end
        };

        let response;
        switch (type) {
          case TYPE.minute:
            response = await this.$axios.$request({
              url: '/history/minute',
              method: "get",
              params: _query
            });
            result = response.data;
            break;
          case TYPE.minute10:
            response = await this.$axios.$request({
              url: '/history/10minute',
              method: "get",
              params: _query
            });
            result = response.data;
            break;
          case TYPE.hour:
            response = await this.$axios.$request({
              url: '/history/hour',
              method: 'get',
              params: _query
            });
            result = response.data;
            break;
          case TYPE.day:
            response = await this.$axios.$request({
              url: '/history/day',
              method: 'get',
              params: _query
            });
            result = response.data;
            break;
        }
        // 暂停loading
        this.loading = false;

        this.updateCharts(result, type);
      },

      // 更新 charts
      updateCharts(date, type) {
        date = date || [];
        let tempXList = [];
        let tempCupList = [];
        let tempOsMemoryBufferList = [];
        let tempOsMemoryCacheList = [];
        let tempOsMemoryFreeList = [];
        let tempOsMemoryUsedList = [];
        let tempOsNetworkUploadList = [];
        let tempOsNetworkDownloadList = [];
        let tempProgramMemoryList = [];
        let tempProgramCpuList = [];


        tempXList = this.getXList(type);

        tempXList.forEach((time) => {
          let tempItem = _.find(date, (item) => {
            return this._formatTime(item.fireTime, type) === time;
          });

          if (tempItem) {
            _updateItem(tempItem);
          } else {
            _updateItem();
          }
        });

        function _updateItem(item) {
          item = item || {};
          let memory = item.memory || {};
          let network = item.network || {};
          let program = item.program || {};
          tempCupList.push(item.cpu || 0);
          tempOsMemoryBufferList.push(memory.buffer || 0);
          tempOsMemoryCacheList.push(memory.cache || 0);
          tempOsMemoryFreeList.push(memory.free || 0);
          tempOsMemoryUsedList.push(memory.used || 0);
          tempOsNetworkDownloadList.push(network.down || 0);
          tempOsNetworkUploadList.push(network.up || 0);
          tempProgramCpuList.push(program.cpu || 0);
          tempProgramMemoryList.push(program.memory || 0);
        }

        this.osCpuList = [{
          data: tempCupList,
          name: 'cpu',
          type: 'line',
        }];

        this.osMemoryList = [
          {
            data: tempOsMemoryBufferList,
            name: 'buffer',
            type: 'line',
          },
          {
            data: tempOsMemoryCacheList,
            name: 'cache',
            type: 'line',
          },
          {
            data: tempOsMemoryFreeList,
            name: 'free',
            type: 'line',
          },
          {
            data: tempOsMemoryUsedList,
            name: 'used',
            type: 'line',
          }
        ];

        this.osNetworkDownloadList = [
          {
            data: tempOsNetworkDownloadList,
            name: 'download',
            type: 'line',
          }
        ];

        this.osNetworkUploadList = [
          {
            data: tempOsNetworkUploadList,
            name: 'upload',
            type: 'line',
          }
        ];

        this.programCpuList = [
          {
            data: tempProgramCpuList,
            name: 'cpu',
            type: 'line',
          }
        ];

        this.programMemoryList = [
          {
            data: tempProgramMemoryList,
            name: 'cpu',
            type: 'line',
          }
        ];

        this.xList = tempXList;
      },

      getXList(type) {
        let result = [];

        // 如果是以天为单位的话
        if (type === TYPE.day) {
          result = getTimeRange(this.query.times[0], this.query.times[1]);
          result = result.map((item) => {
            return parseTime(item, "{y}-{m}-{d}");
          });
        } else if (type === TYPE.hour) {
          for (let i = 0; i < 24; i++) {
            result.push(i);
          }
        } else if (type === TYPE.minute10) {
          result = getMinuteRange(this.query.minuteStartTime, this.query.minuteEndTime, '00:10');
        } else if (type === TYPE.minute) {
          result = getMinuteRange(this.query.minuteStartTime, this.query.minuteEndTime, '00:01');
        }
        return result;
      },

      _formatTime(time, t) {
        time = parseInt(time, 10);
        let result = '';
        if (t === TYPE.day) {
          result = parseTime(time, '{y}-{m}-{d}');
        } else if (t === TYPE.hour) {
          result = parseInt(parseTime(time, '{h}'), 10);
        } else {
          result = parseTime(time, '{h}:{i}');
        }
        return result;
      },


      //
      handleIpChange() {

      },

      handleChangeDate() {

      },

      handleChangeMinute() {

      },

      handleQuery() {
        this.getHistoryData();
      }
    },

    destroyed() {

    }
  };
</script>

<style lang="scss" scoped>
  .wrap-item {
    margin-bottom: 10px;
  }

  .card-item {
    height: 300px;
  }

  .no-data {
    line-height: 200px;
    font-size: 25px;
    color: #ccc;
  }

  p {
    text-align: center;
  }

  .body-wrap {
    position: relative;
  }

</style>
