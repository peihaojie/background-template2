<!--
 * @Author: HaoJie
 * @Date: 2024-04-12 17:02:32
 * @LastEditTime: 2024-04-15 14:28:35
 * @LastEditors: HaoJie
 * @FilePath: \spms-ui\packages\backTemplate\README.md
-->

# background-template2

**_组件只能在 ruoyi 后台中使用，因为使用 v-hasPermi 做按钮权限控制_**
**_需要全局挂载 `Element UI` 组件，因为 `form` 组件中会使用_**

由于项目后台页面较多，所以这里对一些常用的组件进行封装，方便使用。
从库中导出 `mixin` 后，只需要在 `vue` 文件中使用 `mixins` 即可。

```js
// 在 main.js 中初始化组件
import backTemplate from "background-template2";
Vue.use(backTemplate);

backTemplate.initBackTemplate(Vue, {
  // 封装好的 axios 请求方法，因为 DynamicTable 组件会发起请求
  request,
  // 下面的是默认值，用于配置列表接口请求时的分页字段
  // pageConfig: { pageSize: "pageSize", pageNum: "pageNum" }
});
```

使用的例子请查看组件的文档。

[筛选器](./docs/Filters.md)
[按钮栏](./docs/ButtonGroup.md)
[表格](./docs/DynamicTable.md)
[表格操作栏](./docs/OperateButton.md)
[弹窗](./docs/FormDialog.md)
