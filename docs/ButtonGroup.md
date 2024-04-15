<!--
 * @Author: HaoJie
 * @Date: 2024-03-22 15:01:15
 * @LastEditTime: 2024-03-22 15:16:35
 * @LastEditors: HaoJie
 * @FilePath: \spms-ui\src\docs\ButtonGroup.md
-->

# ButtonGroup

按钮栏，包含 `right-toolbar`

## Attributes

| 参数       | 说明           | 类型                                  | 必填 | 默认值 |
| ---------- | -------------- | ------------------------------------- | ---- | ------ |
| buttons    | 按钮组         | [ButtonGroupArray](#buttongrouparray) | true | -      |
| showSearch | 是否显示搜索框 | Boolean                               | true | -      |

### ButtonGroupArray

| 参数     | 说明                           | 类型    | 必填  | 默认值 |
| -------- | ------------------------------ | ------- | ----- | ------ |
| text     | 按钮的文字                     | String  | true  | -      |
| auth     | 权限标识                       | Array   | true  | -      |
| span     | 按钮的宽度                     | Number  | false | 1.5    |
| props    | 通过 bind 传给 elButton 的属性 | Object  | false | -      |
| handler  | 按钮点击事件                   | String  | true  | -      |
| file     | 是否为文件上传按钮             | Boolean | false | false  |
| fileType | 上传文件类型                   | String  | false | false  |

> 说明：`handler` 同名的方法需要在 `vue` 文件中声明，这样才能调用到。
> 如果需要使用 `loading` 的话，方法中返回 `Promise` 对象
> fileType 请参阅 [IANA MIME 类型](https://www.iana.org/assignments/media-types/media-types.xhtml)

这里有一些常用的文件类型：

```sh
后缀名       MIME名称
*.3gpp    audio/3gpp, video/3gpp
*.ac3    audio/ac3
*.asf       allpication/vnd.ms-asf
*.au           audio/basic
*.css           text/css
*.csv           text/csv
*.doc    application/msword
*.dot    application/msword
*.dtd    application/xml-dtd
*.dwg    image/vnd.dwg
*.dxf      image/vnd.dxf
*.gif            image/gif
*.htm    text/html
*.html    text/html
*.jp2            image/jp2
*.jpe       image/jpeg
*.jpeg    image/jpeg
*.jpg          image/jpeg
*.js       text/javascript, application/javascript
*.json    application/json
*.mp2    audio/mpeg, video/mpeg
*.mp3    audio/mpeg
*.mp4    audio/mp4, video/mp4
*.mpeg    video/mpeg
*.mpg    video/mpeg
*.mpp    application/vnd.ms-project
*.ogg    application/ogg, audio/ogg
*.pdf    application/pdf
*.png    image/png
*.pot    application/vnd.ms-powerpoint
*.pps    application/vnd.ms-powerpoint
*.ppt    application/vnd.ms-powerpoint
*.rtf            application/rtf, text/rtf
*.svf           image/vnd.svf
*.tif         image/tiff
*.tiff       image/tiff
*.txt           text/plain
*.wdb    application/vnd.ms-works
*.wps    application/vnd.ms-works
*.xhtml    application/xhtml+xml
*.xlc      application/vnd.ms-excel
*.xlm    application/vnd.ms-excel
*.xls           application/vnd.ms-excel
*.xlt      application/vnd.ms-excel
*.xlw      application/vnd.ms-excel
*.xml    text/xml, application/xml
*.zip            aplication/zip
*.xlsx     application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
```

## 使用示例

```html
<template>
  <ButtonGroup
    :buttons="buttons"
    :showSearch.sync="showSearch"
    @callMethod="callMethod"
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
      buttons: DATA.buttons,
    };
  },
  methods: {
    handleAdd() {
      this.$refs.dialogForm.initDialog("新增", DATA.formData);
    },
    async handleExportTemp() {
      const res = await API.getUpdateTemp();
      const blob = new Blob([res], { type: "application/vnd.ms-excel" });
      this.$download.saveAs(blob, "线上活动日历模板.xlsx");
      this.$message.success("模板导出成功");
      return true;
    },
    handleImport(file) {
      const formData = new FormData();
      formData.append("file", file);
      return API.importData(formData).then(() => {
        this.$message.success("数据导入成功");
        this.$refs.dynamicTable.fetchData();
      });
    },
    async handleExport() {
      const res = await API.exportExcel(this.filterParams);
      const blob = new Blob([res], { type: "application/vnd.ms-excel" });
      this.$download.saveAs(blob, "线上活动日历.xlsx");
      this.$message.success("导出成功");
      return true;
    },
  },
};
```

```js
/**
 * data.js
 */
export const buttons = [
  {
    text: "新增活动",
    auth: ["system:role:add"],
    handler: "handleAdd",
  },
  {
    text: "模板导出",
    auth: ["system:role:export"],
    handler: "handleExportTemp",
  },
  {
    text: "导入活动",
    auth: ["system:role:export"],
    handler: "handleImport",
    file: true,
    fileType:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  },
  {
    text: "导出活动",
    auth: ["system:role:export"],
    handler: "handleExport",
  },
];
```
