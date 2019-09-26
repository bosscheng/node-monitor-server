<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="filter-line">
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

        <el-select size="small" v-model="query.level" placeholder="placeholder">
          <el-option
            v-for="item in logLevelConstant" :key="item" :value="item">
          </el-option>
        </el-select>
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
            :picker-options="{
            start: '00:00',
            step: '00:10',
            end: '23:59',
            minTime: query.minuteStartTime
          }">
          </el-time-select>
        </template>
      </div>
      <div class="filter-line">
        <el-input class="search-input" v-model="query.content" placeholder="输入日志内容(支持RegExp)" size="small"></el-input>
        <el-button type="primary" size="small" icon="el-icon-search" @click="handleQuery">搜索</el-button>
      </div>
    </div>

    <div class="">
      <el-table default-expand-all border fit :data="dataList" v-loading="listLoading" element-loading-text="加载中..."
                style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <pre style="overflow-x: auto">
              {{props.row.content}}
            </pre>
          </template>
        </el-table-column>

        <el-table-column align="center" label="时间" width="180">
          <template slot-scope="scope">
            <span>{{scope.row.time| parseTime}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="级别" width="100">
          <template slot-scope="scope">
            <template v-if="scope.row.level=== logLevelConstant.error">
              <el-tag type="danger">{{scope.row.level}}</el-tag>
            </template>
            <template v-else-if="scope.row.level=== logLevelConstant.debug">
              <el-tag>{{scope.row.level}}</el-tag>
            </template>
            <template v-else-if="scope.row.level=== logLevelConstant.info">
              <el-tag type="info">{{scope.row.level}}</el-tag>
            </template>
          </template>
        </el-table-column>
        <el-table-column align="left" label="内容">
          <template slot-scope="scope">
            <span>{{scope.row.content |ellipsisStr}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="pageInfo.currentPage" :page-sizes="[10,20,30, 50]" :page-size="query.size"
                     layout="total, sizes, prev, pager, next, jumper" :total="pageInfo.totalSize">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import {LOG_LEVEL} from "@/constants";
  import {getOneTimeRange} from "@/utils";

  const _oneDay = 3600 * 1000 * 24;
  const _name = 'log';
  const _now = (new Date()).getTime();
  const _pre = _now - (_oneDay * 7);

  export default {
    name: _name,
    data() {
      return {
        query: {
          level: LOG_LEVEL.all,
          times: [_pre, _now],
          minuteStartTime: '00:00',
          minuteEndTime: '23:50',
          content: '',
          size: 10,
          ip: ''
        },

        pageInfo: {
          currentPage: 1,
          totalSize: 0
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
        listLoading: true,
        dataList: [],
        ipList: [],
        fmsList: [],
        allList: [],
        logLevelConstant: LOG_LEVEL
      };
    },
    mounted() {
      this.init();
    },
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

      handleIpChange() {

      },

      //
      async getIpList() {
        let {data} = await this.$axios.$get('/ip');
        this.ipList = (data || []).map((item) => {
          return {
            value: item.name,
            label: item.name
          };
        });
        await this.getFmsList();

        this.allList = [
          {
            label: 'ALL',
            list: [{
              value: '',
              label: 'all'
            }]
          },
          {
            label: 'CND节点',
            list: this.ipList
          }, {
            label: 'FMS节点',
            list: this.fmsList
          }
        ];

        if (this.ipList.length > 0) {
          this.query.ip = this.ipList[0].value;
          this.getLogList();
        } else if (this.fmsList.length > 0) {
          this.query.ip = this.fmsList[0].value;
          this.getLogList();
        } else {
          this.loading = false;
        }
      },

      async getFmsList() {
        let {data} = await this.$axios.$get('/fms');
        this.fmsList = (data || []).map((item) => {
          return {
            value: item.name,
            label: item.name
          };
        });
      },

      // 获取日志。
      async getLogList() {
        let _query = this.query;
        let query = {
          size: _query.size,
          page: this.pageInfo.currentPage
        };

        if (_query.ip) {
          query.ip = _query.ip;
        }

        if (_query.content) {
          query.content = _query.content;
        }

        if (_query.level !== LOG_LEVEL.all) {
          query.level = _query.level;
        }


        let startDay = _query.times[0];
        let endDay = _query.times[1];


        if (endDay - startDay > (30 * _oneDay)) {
          startDay = endDay - (30 * _oneDay);
        }

        // update times
        this.query.times = [startDay, endDay];

        this.listLoading = true;

        let _start = '';
        let _end = '';
        if (startDay === endDay) {
          let minuteStart = _query.minuteStartTime;
          let minuteEnd = _query.minuteEndTime;
          // 从minu表里面查询
          let minuteStartArray = minuteStart.split(':');
          let minuteEndArray = minuteEnd.split(':');
          let startHour = minuteStartArray[0];
          let startMin = minuteStartArray[1];
          let endHour = minuteEndArray[0];
          let endMin = minuteEndArray[1];
          if (minuteStart === '00:00' && minuteEnd === '23:50') {
            _start = new Date(startDay).getTime();
            let startRange = getOneTimeRange(_start);
            query.start = startRange.start;
            query.end = startRange.end;
          } else {
            _start = new Date(startDay).getTime();
            let options = {
              startHour: parseInt(startHour, 10),
              startMin: parseInt(startMin, 10),
              endHour: parseInt(endHour, 10),
              endMin: parseInt(endMin, 10)
            };

            let timeRange = getOneTimeRange(_start, options);
            query.start = timeRange.start;
            query.end = timeRange.end;
          }
        } else {
          _start = new Date(startDay).getTime();
          _end = new Date(endDay).getTime();
          let startRange = getOneTimeRange(_start);
          let endRange = getOneTimeRange(_end);
          query.start = startRange.start;
          query.end = endRange.end;
        }

        let response = await this.$axios.$request({
          url: '/log',
          method: 'get',
          params: query
        });

        this.listLoading = false;
        if (response.msg) {
          //    error
        } else {
          this.updateLogList(response.data || {});
        }
      },

      updateLogList(response) {
        let data = response.data;
        let pager = response.pager;

        this.pageInfo.currentPage = parseInt(pager.page, 10) || 1;
        this.pageInfo.totalSize = pager.total;

        this.dataList = data;
      },

      handleChangeDate() {
        //   null
      },

      handleQuery() {
        this.getLogList();
      },

      handleChangeMinute() {

      },

      handleSizeChange(size) {
        this.query.size = size;
        this.getLogList();
      },

      handleCurrentChange(page) {
        this.pageInfo.currentPage = page;
        this.getLogList();
      }
    }
  };
</script>

<style scoped>
  .filter-line {
    margin-bottom: 10px;
  }

  .search-input {
    width: 80%;
  }

</style>
