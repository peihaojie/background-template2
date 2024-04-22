# DynamicTable

表格组件的封装，从外部使用 `fetchData` 方法获取数据，该方法会缓存参数，用于翻页时调用。

## Attributes

| 参数          | 说明                           | 类型                                        | 必填  | 默认值           |
| ------------- | ------------------------------ | ------------------------------------------- | ----- | ---------------- |
| defaultSort   | 默认排序字段                   | Object                                      | false | -                |
| columns       | 表格列数据                     | [DynamicTableColumns](#dynamictablecolumns) | true  | -                |
| pagination    | 分页配置                       | Boolean                                     | false | true             |
| showIndex     | 是否显示序号                   | Boolean                                     | false | true             |
| showSelection | 是否显示选框                   | Boolean                                     | false | false            |
| pageSizes     | 分页大小                       | Array                                       | false | [10, 20, 30, 50] |
| url           | table 数据请求的接口(get 方法) | String                                      | true  | -                |
| showOperate   | 是否需要操作列                 | Boolean                                     | false | true             |

**_操作列有专门封装组件，详见：[OperateButton](./OperateButton.md)_**

### DynamicTableColumns

| 参数       | 说明                                                      | 类型                                        | 必填  | 默认值 |
| ---------- | --------------------------------------------------------- | ------------------------------------------- | ----- | ------ |
| prop       | 列渲染的字段                                              | String                                      | true  | -      |
| label      | 列的 label                                                | String                                      | true  | -      |
| width      | 列的宽度                                                  | Number                                      | false | -      |
| align      | 列的对齐方式                                              | String                                      | false | left   |
| headerSlot | 表头的插槽                                                | String                                      | false | -      |
| slot       | 插槽的名字                                                | String                                      | false | -      |
| options    | 用于回显的 list，prop 会对应的 value，将 label 展示出来   | Array                                       | false | -      |
| child      | 用于多级表头的显示，数据格式和 columns 相同，支持无限嵌套 | [DynamicTableColumns](#dynamictablecolumns) | false | -      |

## Events

| 事件名          | 说明             | 参数 | 返回值 |
| --------------- | ---------------- | ---- | ------ |
| selectionChange | 选中的数据 Array | -    | Array  |

## Methods

| 事件名        | 说明                                         | 参数             | 返回值 |
| ------------- | -------------------------------------------- | ---------------- | ------ |
| fetchData     | 触发搜索方法（会对方法进行缓存，翻页时使用） | Filter 中的 form | -      |
| updateColumns | 更新 columns，覆盖之前的 prop                | columns 对象     | -      |
| getTable      | 获取 table 实例                              | -                | table  |

## 使用示例

```html
<template>
  <DynamicTable
    ref="dynamicTable"
    url="/pre/onlineActivity/list"
    :columns="columns"
  >
    <!-- 使用插槽自定义表格 -->
    <template #headerActivityInfluence>
      <el-popover placement="bottom-end" width="200" trigger="hover">
        <span>
          活动影响力用1-10进行表示，默认值是
          10，当值越大时，表示节假日对模型的影响越大;当值越小时，表示节假日对模型的效果越小。用户可以根据实际情况进行调整。
        </span>
        <span slot="reference">
          活动影响力
          <i class="el-icon-question"></i>
        </span>
      </el-popover>
    </template>
    <!-- 使用插槽渲染操作栏 -->
    <template #operate="{ row }">
      <OperateButton
        @callMethod="callMethod"
        :row="row"
        :buttons="operateButtons"
      />
    </template>
  </DynamicTable>
</template>
```

```js
import { mixin } from "background-template2";
import * as DATA from "./data.js";

export default {
  mixins: [mixin],
  data() {
    return {
      columns: DATA.columns,
      operateButtons: DATA.operateButtons,
      statusList: [],
    };
  },
  created() {
    this.getStatus();
  },
  methods: {
    async getStatus() {
      const options = await API.getStatus();
      this.$refs.dynamicTable.updateColumns({
        label: "当前状态",
        prop: "status",
        width: "200",
        options,
      });
    },
    /**
     * search 方法由 filter 组件触发
     */
    search(params) {
      this.filterParams = params;
      this.$refs.dynamicTable.fetchData(params);
    },
    async handleEdit(row) {
      const data = await API.getDetails(row);
      this.$refs.dialogForm.initDialog("修改", data);
    },
    handleDel(row) {
      return API.delOnlineActivity(row).then(() => {
        this.$message.success("删除成功");
        this.$refs.dynamicTable.fetchData();
      });
    },
  },
};
```

```js
/**
 * data.js
 */
export const columns = [
  {
    label: "活动名称",
    prop: "activityName",
  },
  {
    label: "活动开始时间",
    prop: "activityStartTime",
  },
  {
    label: "活动结束时间",
    prop: "activityEndTime",
  },
  {
    label: "活动影响力",
    prop: "activityInfluence",
    headerSlot: "headerActivityInfluence",
  },
  {
    label: "当前状态",
    prop: "status",
    width: "200",
  },
];

export const operateButtons = [
  {
    text: "编辑",
    auth: ["system:role:export"],
    handler: "handleEdit",
  },
  {
    text: "删除",
    confirm: true,
    auth: ["system:role:export"],
    handler: "handleDel",
  },
];
```
