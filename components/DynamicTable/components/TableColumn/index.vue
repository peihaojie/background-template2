<!--
 * @Author: HaoJie
 * @Date: 2024-04-22 11:26:42
 * @LastEditTime: 2024-04-22 13:35:18
 * @LastEditors: HaoJie
 * @FilePath: \backgorund-template2\components\DynamicTable\components\TableColumn\index.vue
-->
<template>
  <el-table-column
    :prop="column.prop"
    :label="column.label"
    :width="column.width"
    :align="column.align"
  >
    <!-- 表头 slot -->
    <template v-if="column.headerSlot" slot="header">
      <slot :name="column.headerSlot"></slot>
    </template>
    <!-- 多级表头 slot -->
    <template v-if="column.child && column.child.length">
      <TableColumn
        v-for="(column2, index2) in column.child"
        :key="index2"
        :column="column2"
      ></TableColumn>
    </template>
    <!-- slot -->
    <template v-if="column.slot" v-slot="{ row }">
      <slot :name="column.slot" :row="row"></slot>
    </template>
    <!-- select 用来回显的数据 -->
    <template v-else-if="column.options" v-slot="{ row }">
      <tooltip :text="getLabel(row[column.prop], column.options)"></tooltip>
    </template>
    <!-- 不使用 slot -->
    <template v-else v-slot="{ row }">
      <tooltip :text="row[column.prop]"></tooltip>
    </template>
  </el-table-column>
</template>

<script>
import tooltip from "../tooltip.vue";

export default {
  name: "TableColumn",
  props: {
    column: {
      type: Object,
      required: true,
    },
  },
  components: { tooltip },
  methods: {
    getLabel(val, list) {
      const temp = list.find((item) => item.value == val);
      return temp ? temp.label : "-";
    },
  },
};
</script>

<style></style>
