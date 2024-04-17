<template>
  <el-row :gutter="20" v-show="showSearch">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      label-width="80px"
    >
      <template>
        <el-form-item
          v-for="(filter, index) in filtersArray"
          :key="index"
          :label="filter.label"
          :prop="filter.prop"
        >
          <!-- 动态渲染表单组件 -->
          <component
            :is="filter.type"
            v-model="queryParams[filter.prop]"
            :placeholder="filter | getPlaceholder"
            style="width: 240px"
            v-bind="filter.props"
            @change="handleFilterChange(filter, $event)"
            @keyup.enter.native="handleQuery"
            v-on="filter.eventHandlers"
          >
            <!-- 渲染选项数据 -->
            <template v-if="filter.options && filter.options.length">
              <template v-if="filter.type === 'elSelect'">
                <el-option
                  v-for="option in filter.options"
                  :key="option.value"
                  :label="option[filter.optionLabel]"
                  :value="option[filter.optionValue]"
                />
              </template>
            </template>
          </component>
        </el-form-item>
      </template>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
        >
          搜索
        </el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">
          重置
        </el-button>
      </el-form-item>
    </el-form>
  </el-row>
</template>

<script>
import { merge, cloneDeep } from "lodash";
import * as DEFAULT_PARAMS from "./defaultParams";

export default {
  props: {
    /**
     * @description: 渲染表单的原始数据
     * @param {String} label 表单的 label
     * @param {String} prop 表单的 prop
     * @param {String} type 渲染的组件 elInput, elSelect, elCascader, elDatePicker 等
     * @param {String} placeholder 表单的 placeholder
     * @param {String} defaultValue 表单的 defaultValue
     * @param {Object} props 使用 v-bind 绑定的属性
     * @param {Array} options el-select 的 options
     * @param {String} optionLabel el-select 绑定 label 的字段（默认 label ）
     * @param {String} optionValue el-select 绑定 value 的字段（默认 value ）
     * @param {Function} fetchOptionsFunction 请求接口，获取 el-select、el-cascader 的 options
     * @param {Array} timeParams el-date-picker 的参数，['startTime', 'endTime'] 传入的话不会返回 prop，而是返回 timeParams 传入的参数。只有在需要起始和结束时间的地方用
     */
    filtersArray: {
      type: Array,
      required: true,
    },
    showSearch: {
      type: Boolean,
      default: true,
    },
    /**
     * @description: 是否在加载完成后触发 search 方法
     */
    loadSearch: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      queryParams: {},
    };
  },
  filters: {
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
  },
  created() {
    this.initQueryParams();
    this.fetchOptions();
  },
  mounted() {
    if (this.loadSearch) {
      this.handleQuery();
    }
  },
  methods: {
    async fetchOptions() {
      for (let i = 0; i < this.filtersArray.length; i++) {
        const filter = this.filtersArray[i];
        if (filter.fetchOptionsFunction) {
          try {
            const options = await filter.fetchOptionsFunction();
            if (options) {
              this.$set(this.filtersArray, i, { ...filter, options });
            }
          } catch (error) {
            console.error("获取选项数据失败:", error);
          }
        }
      }
    },
    getQuery() {
      const result = {};
      // 过滤掉空值
      for (const key in this.queryParams) {
        const val = this.queryParams[key];
        if (val === 0 || val) {
          result[key] = cloneDeep(val);
        }
      }
      this.filtersArray.forEach((filter) => {
        // 如果传参 timeParams，删除 prop
        if (filter.timeParams) {
          delete result[filter.prop];
        }
      });
      return result;
    },
    handleQuery() {
      const result = this.getQuery();
      this.$emit("search", result);
    },
    resetQuery() {
      this.initQueryParams();
      this.handleQuery();
    },
    handleFilterChange(filter, value) {
      const { timeParams } = filter;
      // 对时间参数进行特殊处理
      if (timeParams) {
        const [startTimeKey, endTimeKey] = timeParams;
        if (
          typeof startTimeKey !== "string" ||
          typeof endTimeKey !== "string"
        ) {
          throw new Error("时间参数格式错误, 请参考 ['startTime', 'endTime']");
        }
        const [startTime, endTime] = cloneDeep(value || []);
        this.queryParams[startTimeKey] = startTime;
        this.queryParams[endTimeKey] = endTime;
      }
      this.emit(filter.prop, "change", value);
      // input 由 enter 键盘事件触发，不由 change 事件触发
      if (filter.type === "elInput") {
        return;
      }

      if (filter.changeSearch === false) {
        return;
      }

      this.handleQuery();
    },
    initQueryParams() {
      // 初始化查询参数
      this.queryParams = {};
      this.filtersArray.forEach(this.initItem);
    },
    initItem(filter, index) {
      let defaultParams = {};
      switch (filter.type) {
        case "elInput":
          defaultParams = cloneDeep(DEFAULT_PARAMS.INPUT);
          break;
        case "elSelect":
          defaultParams = cloneDeep(DEFAULT_PARAMS.SELECT);
          break;
        case "elDatePicker":
          defaultParams = cloneDeep(DEFAULT_PARAMS.DATE_PICKER);
          break;
        case "elCascader":
          defaultParams = cloneDeep(DEFAULT_PARAMS.CASCADER);
          break;

        default:
          break;
      }
      // 处理 filter eventHandlers 事件，抛出 emit
      Object.keys(filter.eventHandlers || {}).forEach((key) => {
        if (key === "change") {
          throw new Error("change 事件默认会抛出，请勿入参");
        }
        const hasKeys = filter.eventHandlers[key];
        if (hasKeys) {
          filter.eventHandlers[key] = (...args) => {
            this.emit(filter.prop, key, ...args);
          };
        }
      });
      // 默认参数赋值
      this.$set(this.filtersArray, index, merge(defaultParams, filter));
      // v-model 绑定默认数据
      this.$set(
        this.queryParams,
        filter.prop,
        filter.defaultValue !== undefined ? filter.defaultValue : ""
      );
    },
    updateFilter(filter) {
      const index = this.filtersArray.findIndex(
        (item) => item.prop === filter.prop
      );
      this.initItem(filter, index);
    },
    emit(prop, key, ...args) {
      const emitName = prop + key.charAt(0).toUpperCase() + key.slice(1);
      this.$emit(emitName, ...args);
    },
    changeProp(prop, val) {
      this.queryParams[prop] = val;
    }
  },
};
</script>

<style></style>
