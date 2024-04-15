<!--
 * @Author: HaoJie
 * @Date: 2024-03-22 15:06:11
 * @LastEditTime: 2024-03-22 15:06:28
 * @LastEditors: HaoJie
 * @FilePath: \spms-ui\src\docs\OperateButton.md
-->
# OperateButton

这是一个操作栏的按钮组件，使用插槽的方式在操作栏中渲染按钮。

## Attributes

| 参数    | 说明         | 类型                              | 必填 | 默认值 |
| ------- | ------------ | --------------------------------- | ---- | ------ |
| row     | 操作的行数据 | Object                            | true | -      |
| buttons | 操作栏的按钮 | [OperateButtons](#operatebuttons) | true | -      |

### OperateButtons

| 参数           | 说明                           | 类型    | 必填  | 默认值 |
| -------------- | ------------------------------ | ------- | ----- | ------ |
| text           | 按钮的文字                     | String  | true  | -      |
| auth           | 权限标识                       | Array   | true  | -      |
| confirm        | 是否需要确认弹窗               | Boolean | false | false  |
| confirmMessage | 确认弹窗的文字                 | String  | false | -      |
| props          | 通过 bind 传给 elButton 的属性 | Object  | false | -      |
| handler        | 按钮点击事件                   | String  | true  | -      |

> 说明：`handler` 同名的方法需要在 `vue` 文件中声明，这样才能调用到。
> `handler` 方法中会传入 `row` 参数
> 如果需要使用 `loading` 的话，方法中返回 `Promise` 对象

***[使用示例](./DynamicTable.md)***
