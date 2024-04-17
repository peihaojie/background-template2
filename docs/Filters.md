# Filters

筛选器，封装 element ui 的 form 组件。

## Attributes

| 参数         | 说明                                          | 类型                          | 必填  | 默认值 |
| ------------ | --------------------------------------------- | ----------------------------- | ----- | ------ |
| filtersArray | 筛选器的数据源                                | [FiltersArray](#filtersarray) | true  | -      |
| showSearch   | 是否显示搜索框(可与 ButtonGroup 中的组件联动) | Boolean                       | false | true   |
| showReset    | 是否显示重置按钮                              | Boolean                       | false | true   |
| loadSearch   | 加载完成后触发 search 方法                    | Boolean                       | false | true   |

### FiltersArray

| 参数                 | 说明                                                                  | 类型    | 必填  | 默认值                |
| -------------------- | --------------------------------------------------------------------- | ------- | ----- | --------------------- |
| label                | 表单的 label                                                          | String  | true  | -                     |
| prop                 | 绑定的字段                                                            | String  | true  | -                     |
| type                 | 渲染的组件 elInput, elSelect, elCascader, elDatePicker 等             | String  | true  | -                     |
| placeholder          | 表单的 placeholder                                                    | String  | false | 默认会根据 label 生成 |
| defaultValue         | 表单的 defaultValue                                                   | String  | false | -                     |
| changeSearch         | chang 事件是否立即触发搜索，默认除了 input 组件都是立即搜索           | Boolean | false | -                     |
| props                | 传给组件的其他属性                                                    | Object  | false | -                     |
| options              | elSelect 的 option                                                    | Array   | false | -                     |
| optionLabel          | elSelect 中使用的 label 字段                                          | String  | false | label                 |
| optionValue          | elSelect 中使用的 value 字段                                          | String  | false | value                 |
| fetchOptionsFunction | elSelect、elCascader 获取 options 的方法                              | String  | false | -                     |
| timeParams           | elDatePicker 的参数，['startTime', 'endTime']                         | Array   | false | -                     |
| eventHandlers        | 组件需要抛出的事件，change 会默认抛出，不用写。 例子：{ clear: true } | Object  | false | -                     |

## Methods

| 事件名       | 说明                           | 参数                | 返回值                 |
| ------------ | ------------------------------ | ------------------- | ---------------------- |
| getQuery     | 获取参数                       | -                   | filtersArray 中的 prop |
| updateFilter | 更新 filter，覆盖之前的 prop   | Filters 对象        | -                      |
| changeProp   | 主动更新 prop 对应组件的 value | prop: string, value | -                      |

## Events

| 事件名             | 说明                                               | 参数 | 返回值                 |
| ------------------ | -------------------------------------------------- | ---- | ---------------------- |
| search             | 触发搜索事件并传递参数                             | -    | filtersArray 中的 prop |
| [prop]EventHandler | FiltersArray 中的 prop 加首字母大写的 eventHandler | -    | 事件的参数             |

> 例子：
> 加入 prop 为 status，则 change 为 statusChange
> 加入 prop 为 status，则 clear 为 statusClear

## 使用示例

```html
<template>
  <Filters
    ref="filters"
    :showSearch="showSearch"
    :filtersArray="filtersArray"
    @search="search"
  />
</template>
```

```js
import { mixin } from "background-template2";
import * as DATA from "./data.js";

export default {
  mixins: [mixin],
  data() {
    return {
      filtersArray: DATA.filtersArray,
      statusList: [],
    };
  },
  created() {
    this.getStatus();
  },
  methods: {
    async getStatus() {
      const options = await API.getStatus();
      this.$refs.filters.updateFilter({
        label: "活动状态",
        prop: "status",
        type: "elSelect",
        options,
      });
    },
    search(params) {
      this.filterParams = params;
      this.$refs.dynamicTable.fetchData(params);
    },
  },
};
```

```js
/**
 * data.js
 */
export const filtersArray = [
  {
    label: "活动名称",
    prop: "activityName",
    type: "elInput",
  },
  {
    label: "活动状态",
    prop: "status",
    type: "elSelect",
  },
  {
    label: "活动时间",
    prop: "time",
    type: "elDatePicker",
    timeParams: ["activityStartTime", "activityEndTime"],
    props: {
      type: "daterange",
      valueFormat: "yyyy-MM-dd",
    },
  },
];
```
