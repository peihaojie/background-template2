<!--
 * @Author: HaoJie
 * @Date: 2024-03-22 15:08:13
 * @LastEditTime: 2024-04-10 09:16:31
 * @LastEditors: HaoJie
 * @FilePath: \spms-ui\src\docs\FormDialog.md
-->

# FormDialog

封装 form 的 dialog 组件。使用 `initDialog` 方法初始化并打开弹窗。

## Attributes

| 参数       | 说明     | 类型  | 必填 | 默认值 |
| ---------- | -------- | ----- | ---- | ------ |
| formConfig | 表单配置 | Array | true | -      |

> 参数类似：[DynamicTableColumns](./DynamicTableColumns.md)
> required 表示必填
> rules 自定义规则
> hide 表示隐藏
> slot 使用插槽

## Methods

| 事件名     | 说明     | 参数             | 返回值 |
| ---------- | -------- | ---------------- | ------ |
| initDialog | 打开弹窗 | dialogTitle, row | -      |

## Events

| 事件名       | 说明              | 参数 | 返回值 |
| ------------ | ----------------- | ---- | ------ |
| handleSubmit | form 校验后的数据 | -    | -      |

## slot

| 属性     | 说明               |
| -------- | ------------------ |
| value    | 双向绑定的数据     |
| setValue | 修改数据调用的方法 |

## 使用示例

```html
<template>
  <FormDialog
    ref="dialogForm"
    :formConfig="formConfig"
    @handleSubmit="handleSubmit"
  >
    <template #commonFilters="{ value, setValue }">
      <el-input :value="value" @input="setValue"></el-input>
    </template>
  </FormDialog>
</template>
```

```js
import { mixin } from "background-template2";
import * as DATA from "./data.js";

export default {
  mixins: [mixin],
  data() {
    return {
      formConfig: DATA.formConfig,
    };
  },
  methods: {
    handleAdd() {
      this.$refs.dialogForm.initDialog("新增", DATA.formData);
    },
    async handleEdit(row) {
      const data = await API.getDetails(row);
      this.$refs.dialogForm.initDialog("修改", data);
    },
    async handleSubmit(row) {
      if (!row.id) {
        await API.add(row);
        this.$message.success("新增成功");
        this.$refs.dynamicTable.fetchData();
        return;
      }
      await API.update(row);
      this.$message.success("修改成功");
      this.$refs.dynamicTable.fetchData();
    },
  },
};
```

```js
/**
 * data.js
 */
export const formConfig = [
  {
    label: "活动名称",
    prop: "activityName",
    type: "elInput",
    required: true,
  },
  {
    label: "活动开始时间",
    prop: "activityStartTime",
    type: "elDatePicker",
    required: true,
    props: {
      valueFormat: "yyyy-MM-dd",
    },
  },
  {
    label: "活动结束时间",
    prop: "activityEndTime",
    type: "elDatePicker",
    required: true,
    props: {
      valueFormat: "yyyy-MM-dd",
    },
  },
  {
    label: "活动影响力",
    prop: "activityInfluence",
    type: "elInputNumber",
    required: true,
    props: {
      precision: 0,
      min: 1,
      max: 10,
    },
  },
  {
    label: "业务部门",
    prop: "commonFilters",
    slot: "commonFilters",
  },
];

export const formData = {
  activityName: null,
  activityStartTime: null,
  activityEndTime: null,
  activityInfluence: 1,
  commonFilters: "",
};
```
