<template>
  <div class="app-container">
    <el-tabs type="border-card" v-model="tabName" @tab-click="handleTabsChange">
      <el-tab-pane key="0.0.0.0" label="总览" name="total">
        <total-panel :dataList.sync="dataList" :currentTab="tabName" v-on:updateType="handleUpdateType"></total-panel>
      </el-tab-pane>

      <el-tab-pane v-for="(item,index) in dataList" :key="item.ip"
                   :label="item.type ? item.ip +'('+item.type +')' :item.ip" :name="item.ip">
        <div>
          <p class="panel-title"><strong>IP:{{item.type ? item.ip +'('+item.type +')' :item.ip}}</strong></p>
          <el-row :gutter="10">
            <el-col :span="12">
              <div class="wrap-item" v-if="item.system">
                <system-panel :system.sync="item.system"></system-panel>
              </div>

            </el-col>
            <el-col :span="12">
              <div class="wrap-item" v-if="item.memory">
                <memory-panel :memory.sync="item.memory"></memory-panel>
              </div>
            </el-col>
          </el-row>
          <charts-panel :currentTabIndex="index + ''" :currentTab="tabName" :tempItem="item"
                        :ip="item.ip"></charts-panel>

          <div class="wrap-item">
            <div class="card-border card-item log-list" ref="logList">
              <template v-if="item.programLogList.length >0">
                <div>
                  <pre style="text-align: left" v-for="logItem in item.programLogList">{{logItem}}</pre>
                </div>
              </template>
              <template v-else>
                <p class="">暂无日志信息</p>
              </template>
            </div>
          </div>
          <div class="wrap-item" v-if="item.type === 'FMS'">
            <div class="broadcast-list card-border" ref="broadcastList">
              <p style="text-align: center">broadcast 信息</p>
              <el-tabs type="border-card" v-model="tabBroadcastName" @tab-click="handleBroadcastTabsChange"
                       v-if="broadcastList.length > 0">
                <el-tab-pane v-for="broadcast in broadcastList" :key="broadcast.path" :label="broadcast.path"
                             :name="broadcast.path">
                  <el-row :gutter="40" class="panel-group-wrap">
                    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
                      <div class="card-panel-item">
                        <div class="card-panel-description">
                          <div class="card-panel-text">路径</div>
                          <div>{{broadcast.path}}</div>
                        </div>
                      </div>
                    </el-col>
                    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
                      <div class="card-panel-item">
                        <div class="card-panel-description">
                          <div class="card-panel-text">推流地址</div>
                          <div>{{broadcast.publisheraddr}}</div>
                        </div>
                      </div>
                    </el-col>
                    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
                      <div class="card-panel-item">
                        <div class="card-panel-description">
                          <div class="card-panel-text">推流状态</div>
                          <div v-if="broadcast.publiser == 1">
                            <el-tag type="success">有推流</el-tag>
                          </div>
                          <div v-else>
                            <el-tag type="danger">无推流</el-tag>
                          </div>
                        </div>
                      </div>
                    </el-col>
                    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
                      <div class="card-panel-item">
                        <div class="card-panel-description">
                          <div class="card-panel-text">录制视频</div>
                          <div v-if="broadcast.recordtype">
                            <el-tag type="success">录制中...</el-tag>
                          </div>
                          <div v-else>
                            <el-button-group>
                              <el-button :loading="item.recordVideoLoading" type="primary"
                                         @click="handleRecordVideo(item,broadcast.path,'record')">覆盖录制
                              </el-button>
                              <el-button :loading="item.recordVideoLoading" type="primary"
                                         @click="handleRecordVideo(item,broadcast.path,'append')">追加录制
                              </el-button>
                            </el-button-group>
                          </div>
                        </div>
                      </div>
                    </el-col>
                  </el-row>
                  <el-table
                    :data="item.subscriber || []"
                    style="width: 100%">
                    <el-table-column align="center" label="访客IP">
                      <template slot-scope="scope">
                        <span>{{scope.row}}</span>
                      </template>
                    </el-table-column>
                  </el-table>

                </el-tab-pane>
              </el-tabs>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import io from 'socket.io-client';
  import CountTo from '@/components/CountTo';
  import TotalPanel from './components/TotalPanel';
  import SystemPanel from './components/SystemPanel';
  import MemoryPanel from './components/MemoryPanel';
  import ChartsPanel from './components/ChartsPanel';
  import {find, getRandom, getEmptyList} from '@/utils/index';
  import {SYNC_TYPE, CHART_TYPE, IP_TYPE} from "@/constants";

  //
  export default {
    data() {
      return {
        dataList: [],
        tabName: 'total',
        broadcastList: [],
        tabBroadcastName: '',

      };
    },
    components: {CountTo, TotalPanel, SystemPanel, MemoryPanel, ChartsPanel},
    // 自定义属性
    socket: null,
    timeInterval: null,
    timeInterval2: null,
    mounted() {
      this.initSocket();
      this.healthCheck();
      this.getBroadCastList();
    },

    methods: {
      //
      initSocket() {
        this.$options.socket = io();
        this.$options.socket.on('sync-web-systemInfo', (data) => {
          this.handleSocketMsg(data, SYNC_TYPE.systemInfo);
        });

        this.$options.socket.on('sync-web-cpuInfo', (data) => {
          this.handleSocketMsg(data, SYNC_TYPE.cpuInfo);
        });

        this.$options.socket.on('sync-web-memoryInfo', (data) => {
          this.handleSocketMsg(data, SYNC_TYPE.memoryInfo);
        });

        this.$options.socket.on('sync-web-networkUploadInfo', (data) => {
          this.handleSocketMsg(data, SYNC_TYPE.networkUploadInfo);
        });

        this.$options.socket.on('sync-web-networkDownloadInfo', (data) => {
          this.handleSocketMsg(data, SYNC_TYPE.networkDownloadInfo);
        });

        this.$options.socket.on('sync-web-programInfo', (data) => {
          this.handleSocketMsg(data, SYNC_TYPE.programInfo);
        });

        this.$options.socket.on('sync-web-programLog', (data) => {
          this.handleSocketMsg(data, SYNC_TYPE.programLog);
        });
      },

      //
      handleTabsChange() {

      },

      handleBroadcastTabsChange() {

      },

      //
      handleSocketMsg(data, type) {
        let ip = data.ip;
        //
        let tempItem = find(this.dataList, (item) => {
          return item.ip === ip;
        });

        // 如果item 存在的话，更新数据
        if (tempItem) {
          this.updateDataItem(tempItem, data, type);
        } else {
          this.initDataItem(data, type);
        }
      },
      //
      initDataItem(data, type) {
        let tempItem = {};
        let ip = data.ip;
        tempItem.ip = ip;
        tempItem.networkDownloadList = getEmptyList(50);
        tempItem.networkUploadList = getEmptyList(50);
        tempItem.programMemList = getEmptyList(50);
        tempItem.lastTime = (new Date()).getTime();
        tempItem.programLogList = [];
        tempItem.broadcastList = [];
        tempItem.type = IP_TYPE.unknown;

        if (type === SYNC_TYPE.networkDownloadInfo) {
          tempItem.networkDownloadList.shift();
          tempItem.networkDownloadList.push(data.data);
        } else if (type === SYNC_TYPE.networkUploadInfo) {
          tempItem.networkUploadList.shift();
          tempItem.networkUploadList.push(data.data);
        } else if (type === SYNC_TYPE.programInfo) {
          tempItem[type] = data.data;
          tempItem.programMemList.shift();
          tempItem.programMemList.push(data.data.memory);
        } else {
          tempItem[type] = data.data;
        }
        // 新增
        this.dataList.push(tempItem);
      },

      //
      updateDataItem(tempItem, data, type) {
        if (type === SYNC_TYPE.networkDownloadInfo) {
          tempItem.networkDownloadList.shift();
          tempItem.networkDownloadList.push(parseInt(data.data));
        } else if (type === SYNC_TYPE.networkUploadInfo) {
          tempItem.networkUploadList.shift();
          tempItem.networkUploadList.push(parseInt(data.data));
        } else if (type === SYNC_TYPE.programInfo) {
          // this.$set(tempItem, type, data.data);
          tempItem.programMemList.shift();
          tempItem.programMemList.push(data.data.memory);
        } else if (type === SYNC_TYPE.programLog) {
          let logList = data.data;
          // max 200
          if (tempItem.programLogList.length > 200) {
            // splice
            tempItem.programLogList.splice(0, logList.length);
          }
          // concat
          tempItem.programLogList = tempItem.programLogList.concat(logList);

          // scrollTop
          this.$nextTick(() => {
            this.$refs.logList[0].scrollTop = this.$refs.logList[0].scrollHeight - this.$refs.logList[0].clientHeight;
          });
        } else {
          this.$set(tempItem, type, data.data);
        }
        // 更新 lastTime;
        tempItem.lastTime = (new Date()).getTime();
      },

      // 健康检查
      healthCheck() {
        // 30s
        this.$options.timeInterval = setInterval(() => {
          let _nowTime = (new Date()).getTime();
          let _list = [];

          this.dataList.forEach((item) => {
            let timestamp = item.lastTime - _nowTime;

            if (timestamp >= 30 * 1000) {
              _list.push(item);
            }
          });

          if (_list.length > 0) {
            this.removeItemList(_list);
          }

        }, 30 * 1000);
      },

      //
      getBroadCastList() {
        this.$options.timeInterval2 = setInterval(() => {
          this._getBroadCastList();
        }, 5 * 1000);
      },
      async _getBroadCastList() {
        let url = '/broadcast?t=' + new Date().getTime();
        let {data} = await this.$axios.$get(url);
        console.log(data);
        this.broadcastList = (data || []).filter((item) => {
          return item.path && item.publisheraddr;
        });

        if (!this.tabBroadcastName && this.broadcastList.length > 0) {
          this.tabBroadcastName = this.broadcastList[0].path;
        }
      },
      removeItemList(list) {
        // 通过函数的形式，删除掉。
        list.forEach((item) => {
          let tempIndex = -1;

          for (let i = 0, len = this.dataList.length; i < len; i++) {
            let tempItem = this.dataList[i];
            if (tempItem.id === item.id) {
              tempIndex = i;
              break;
            }
          }

          if (tempIndex !== -1) {
            this.dataList.splice(tempIndex, 1);
          }
        });
      },

      //
      handleUpdateType({ip, type}) {
        let tempItem = find(this.dataList, (item) => {
          return item.ip === ip;
        });
        if (tempItem && type) {
          tempItem.type = type;
        }
      },

      //
      handleRecordVideo(item, path, type) {
        let _path = '/command/' + type + '/' + path;
        let href = 'http://' + item.ip + _path;

        if (item.recordVideoLoading) {
          return;
        }

        this.$set(item, 'recordVideoLoading', true);
        this.$axios.$get(href).then((data) => {
          console.log(data);
          this.$set(item, 'recordVideoLoading', false);
        }).catch((e) => {
          console.error(e);
          this.$set(item, 'recordVideoLoading', false);
        });
      }

    },

    destroyed() {

      // socket
      this.$options.socket.disconnect && this.$options.socket.disconnect();
      this.$options.socket = null;

      // timeInterval2
      this.$options.timeInterval && clearInterval(this.$options.timeInterval);
      this.$options.timeInterval = null;

      // timeInterval
      this.$options.timeInterval2 && clearInterval(this.$options.timeInterval2);
      this.$options.timeInterval2 = null;
    }
  };
</script>

<style lang="scss">

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

  .log-list {
    overflow: auto;
    position: relative;
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

  pre {
    margin: 0;
  }

  .broadcast-list {
    min-height: 300px;
  }

</style>
