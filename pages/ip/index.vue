<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input class="filter-item" style="width: 400px" placeholder="请输入ip，格式 xx.xx.xx.xx" clearable
                v-model="tempName"></el-input>
      <el-button style="margin-left: 10px" class="filter-item" type="primary" @click="handleCreate">添加</el-button>
    </div>
    <div>
      <el-table
        :data="dataList" v-loading="listLoading" highlight-current-row element-loading-text="加载中..."
        style="width: 100%" border fit>
        <el-table-column label="地址">
          <template slot-scope="scope">
            <span>{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间">
          <template slot-scope="scope">
            <span>{{scope.row.createdAt | parseTime}}</span>
          </template>
        </el-table-column>
        <el-table-column label="编辑">
          <template slot-scope="scope">
            <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>

  const _name = 'ip';
  export default {
    name: _name,

    data() {
      return {
        dataList: [],
        tempName: '',
        listLoading: true
      };
    },

    created() {

    },

    mounted() {
      this.listLoading = true;
      this.getList();
    },

    methods: {
      async getList() {

        let {data} = await this.$axios.$get('/ip');
        this.listLoading = false;
        this.dataList = data || [];
      },

      async handleCreate() {
        if (!this.tempName) {
          return;
        }
        let {code} = await this.$axios.$post('/ip', {name: this.tempName});
        this.tempName = '';
        if (code === 0) {
          this.$message({
            type: 'success',
            message: '创建成功'
          });
        }
        this.getList();
      },


      handleDelete(item) {
        let id = item._id;
        this.$confirm('是否删除该节点？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this._doDeleteItem(id)
        })
      },

      async _doDeleteItem(id) {
        let {code} = await this.$axios.$delete(`/ip/${id}`);

        if (code === 0) {
          this.$message({
            type: 'success',
            message: '删除成功'
          });
        }
        this.getList();
      }
    }
  };
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
