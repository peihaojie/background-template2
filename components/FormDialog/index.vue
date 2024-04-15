<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :title="dialogTitle"
    @close="handleClose"
    width="600px"
  >
    <el-form
      :model="formData"
      :rules="rules"
      ref="form"
      label-width="120px"
      :validate-on-rule-change="false"
    >
      <el-form-item
        v-for="(item, index) in formConfig"
        v-show="!item.hide"
        :key="index"
        :label="item.label"
        :prop="item.prop"
      >
        <component
          v-if="!item.slot"
          :is="item.type"
          v-model="formData[item.prop]"
          v-bind="item.props"
          :placeholder="getPlaceholder(item)"
          style="width: 100%"
        >
          <!-- 渲染选项数据 -->
          <template v-if="item.options && item.options.length">
            <template v-if="item.type === 'elSelect'">
              <el-option
                v-for="option in item.options"
                :key="option.value"
                :label="option[item.optionLabel]"
                :value="option[item.optionValue]"
              />
            </template>
          </template>
        </component>
        <!-- slot -->
        <template v-if="item.slot">
          <slot
            :name="item.slot"
            :value="formData[item.prop]"
            :setValue="(val) => setValue(val, item.prop)"
          ></slot>
        </template>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleSubmit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { merge, cloneDeep } from "lodash";
import * as DEFAULT_PARAMS from "./defaultParams";

export default {
  name: "FormDialog",
  props: {
    formConfig: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      dialogVisible: false,
      dialogTitle: "",
      formData: {},
      rules: {},
    };
  },
  methods: {
    getPlaceholder(filter) {
      const { placeholder, type, label } = filter;
      if (placeholder) {
        return placeholder;
      }
      switch (type) {
        case "elInput":
          return `请输入${label}`;
        case "elSelect":
        case "elCascader":
        case "elDatePicker":
          return `请选择${label}`;
        default:
          break;
      }
    },
    initDialog(dialogTitle, row) {
      if (!dialogTitle) {
        throw new Error("dialogTitle 不能为空");
      }
      if (!row) {
        throw new Error("row 不能为空");
      }
      this.dialogTitle = dialogTitle;
      this.formData = row;
      this.initDefaultParams(); // 初始化默认值
      this.generateRules(); // 在组件创建时生成表单验证规则
      this.dialogVisible = true;
    },
    handleClose() {
      this.$refs.form.resetFields();
      this.$nextTick(() => {
        this.$refs.form.clearValidate();
      });
    },
    async handleSubmit() {
      const valid = await this.$refs.form.validate();
      if (!valid) return;
      this.$emit("handleSubmit", this.formData);
      this.dialogVisible = false;
    },
    generateRules() {
      this.rules = {};
      this.formConfig.forEach((item) => {
        if (item.required) {
          this.$set(this.rules, item.prop, [
            {
              required: true,
              message: this.getPlaceholder(item),
              trigger: item.type === "elInput" ? "blur" : "change",
            },
          ]);
        }
        // 这里还没校验可用性
        if (item.rules && item.rules.length > 0) {
          this.rules[item.prop] = this.rules[item.prop] || []; // 初始化 rules[prop] 为数组
          this.rules[item.prop].push(...item.rules); // 添加自定义规则
        }
      });
    },
    initDefaultParams() {
      this.formConfig.forEach((item, index) => {
        let defaultParams = {};
        switch (item.type) {
          case "elInput":
            defaultParams = cloneDeep(DEFAULT_PARAMS.INPUT);
            break;
          case "elSelect":
            defaultParams = cloneDeep(DEFAULT_PARAMS.SELECT);
            break;
          case "elDatePicker":
            defaultParams = cloneDeep(DEFAULT_PARAMS.DATE_PICKER);
            break;

          default:
            break;
        }
        // 默认参数赋值
        this.$set(this.formConfig, index, merge(defaultParams, item));
      });
    },
    setValue(e, prop) {
      this.formData[prop] = e;
      this.$emit("update:value", e);
    },
  },
};
</script>

<style scoped>
.dialog-footer {
  text-align: center;
  padding: 10px 0;
}
</style>
