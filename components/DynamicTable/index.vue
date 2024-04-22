<template>
  <div>
    <el-table
      ref="table"
      style="width: 100%"
      stripe
      border
      row-key="id"
      reserve-selection
      :data="tableData"
      :default-sort="defaultSort"
      v-loading="loading"
      :header-cell-style="{ background: '#f5f7fa', color: '#909399' }"
      @selection-change="handleSelectionChange"
      @row-click="handleRowClick"
    >
      <el-table-column v-if="showIndex" label="序号" width="60" align="center">
        <template slot-scope="{ $index }">
          <span>{{ indexMethod($index) }}</span>
        </template>
      </el-table-column>

      <el-table-column
        v-if="showSelection"
        type="selection"
        align="center"
        width="55"
      />

      <tableColumn
        v-for="(column, index) in columns"
        :key="index"
        :column="column"
      ></tableColumn>

      <!-- 操作 -->
      <el-table-column v-if="showOperate" label="操作" width="200">
        <template v-slot="{ row }">
          <slot name="operate" :row="row"></slot>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      v-if="pagination"
      :current-page.sync="pageNum"
      :page-sizes="pageSizes"
      :page-size="pageSize"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      layout="total, sizes, prev, pager, next, jumper"
    ></el-pagination>
  </div>
</template>

<script>
// import request from "@/utils/request";
import { cloneDeep } from "lodash";
import tableColumn from "./components/TableColumn/index.vue";

export default {
  name: "DynamicTable",
  props: {
    defaultSort: {
      type: Object,
      default: () => ({}),
    },
    columns: {
      type: Array,
      required: true,
    },
    pagination: {
      type: Boolean,
      default: true,
    },
    showIndex: {
      type: Boolean,
      default: true,
    },
    showSelection: {
      type: Boolean,
      default: false,
    },
    pageSizes: {
      type: Array,
      default: () => [10, 20, 30, 50],
    },
    url: {
      type: String,
      required: true,
    },
    showOperate: {
      type: Boolean,
      default: true,
    },
  },
  components: { tableColumn },
  data() {
    return {
      pageNum: 1,
      pageSize: 10,
      loading: false, // 默认 loading 状态为 false
      tableData: [], // 初始化 tableData 为空数组
      total: 0, // 初始化 total 为 0
      params: {},
    };
  },
  computed: {
    indexStart() {
      return (this.pageNum - 1) * this.pageSize + 1;
    },
  },
  methods: {
    indexMethod(index) {
      return this.indexStart + index;
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.fetchData();
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.fetchData();
    },
    async fetchData(params) {
      params && (this.params = params);
      this.loading = true;
      try {
        const params = cloneDeep(this.params);
        if (this.pagination) {
          params[this.$backTemplateParams.pageConfig.pageNum] = this.pageNum;
          params[this.$backTemplateParams.pageConfig.pageSize] = this.pageSize;
        }
        // const response = await request({
        const response = await this.$backTemplateParams.request({
          url: this.url,
          method: "get",
          params,
        });
        this.tableData = response.rows;
        this.total = response.total;
      } catch (error) {
        console.log(error);
      } finally {
        this.loading = false;
      }
    },
    updateColumns(column) {
      const index = this.columns.findIndex((a) => a.prop === column.prop);
      if (index < 0) {
        throw new Error("未找到该列");
      }
      this.$set(this.columns, index, column);
    },
    handleSelectionChange(row) {
      this.$emit("selectionChange", row);
    },
    handleRowClick(row, column, event) {
      if (this.showSelection) {
        this.$refs.table.toggleRowSelection(row);
      }
    },
    getTable() {
      return this.$refs.table;
    },
  },
};
</script>

<style lang="scss" scoped>
.el-pagination {
  text-align: right;
}
.el-table ::v-deep.el-table__body td div {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
