<!--
 * @Author: HaoJie
 * @Date: 2024-03-20 15:19:43
 * @LastEditTime: 2024-03-22 13:51:58
 * @LastEditors: HaoJie
 * @FilePath: \spms-ui\src\components\ButtonGroup\index.vue
-->
<template>
  <el-row :gutter="10" class="mb8">
    <el-col v-for="(button, index) in buttons" :key="index" :span="button.span">
      <el-button
        v-bind="button.props"
        @click="handleClick(button, index)"
        v-hasPermi="button.auth"
      >
        {{ button.text }}
      </el-button>

      <input
        v-if="button.file"
        v-show="false"
        type="file"
        :accept="button.fileType"
        :id="`file${index}`"
        @change="uploadFile(button, $event)"
      />
    </el-col>

    <right-toolbar
      :showSearch.sync="localShowSearch"
      @queryTable="queryTable"
    />
  </el-row>
</template>

<script>
import { merge, cloneDeep } from "lodash";
import * as DEFAULT_PARAMS from "./defaultParams";

export default {
  name: "ButtonGroup",
  props: {
    buttons: {
      type: Array,
      required: true,
    },
    showSearch: {
      type: Boolean,
      required: true,
    },
  },
  created() {
    this.initQueryParams();
  },
  computed: {
    localShowSearch: {
      get() {
        return this.showSearch;
      },
      set(value) {
        // 通过触发事件向父组件传递修改后的值
        this.$emit("update:showSearch", value);
      },
    },
  },
  methods: {
    initQueryParams() {
      this.buttons.forEach((button, index) => {
        // 默认参数赋值
        this.$set(
          this.buttons,
          index,
          merge(cloneDeep(DEFAULT_PARAMS.BUTTON), button)
        );
      });
    },
    handleClick(button, index) {
      if (!button.handler) {
        throw new Error("按钮未绑定 handler");
      }
      if (button.file) {
        const file = document.getElementById(`file${index}`);
        file.value = "";
        file.click();
        return;
      }
      button._from = "ButtonGroup";
      this.$emit("callMethod", button);
    },
    uploadFile(button, e) {
      const file = e.target.files[0];
      button._from = "ButtonGroup";
      this.$emit("callMethod", button, file);
      e.target.value = "";
    },
    queryTable() {
      this.$emit("callMethod", { handler: "queryTable" });
    },
  },
};
</script>
