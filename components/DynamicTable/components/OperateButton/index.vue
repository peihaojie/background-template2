<template>
  <div>
    <el-button
      v-for="button in buttons"
      :key="button.text"
      v-bind="button.props"
      type="text"
      @click.stop="handleClick(button)"
      v-hasPermi="button.auth"
    >
      {{ button.text }}
    </el-button>
  </div>
</template>

<script>
import { merge, cloneDeep } from "lodash";
import * as DEFAULT_PARAMS from "./defaultParams";

export default {
  name: "OperateButton",
  props: {
    row: {
      type: Object,
      required: true,
    },
    /**
     * 操作按钮数组
     *
     * text 展示文字
     * auth 权限控制
     * confirm 是否需要二次确认
     * confirmMessage 确认文字
     * props 传递给 elButton 的参数
     */
    buttons: {
      type: Array,
      required: true,
    },
  },
  created() {
    this.initQueryParams();
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
    handleClick(button) {
      if (button.confirm) {
        this.handleConfirmAction(button);
      } else {
        this.performAction(button);
      }
    },
    handleConfirmAction(button) {
      this.$confirm(
        button.confirmMessage || `确定要${button.text}吗？`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).then(() => {
        this.performAction(button);
      });
    },
    performAction(button) {
      button._from = "OperateButton";
      // 执行对应的操作
      this.$emit("callMethod", button, this.row);
    },
  },
};
</script>
