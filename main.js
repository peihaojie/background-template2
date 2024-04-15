/**
 * @Author: HaoJie
 * @Date: 2024-04-11 17:56:42
 * @LastEditTime: 2024-04-12 16:59:59
 * @LastEditors: HaoJie
 * @FilePath: \spms-ui\packages\backTemplate\main.js
 */

/**
 * 1. 与 ruoyi 强相关的 v-hasPermi 怎么处理
 */
import { default as mixin } from "./index.js";
import upperFirst from "lodash/upperFirst";
import camelCase from "lodash/camelCase";

// 导入 components 文件夹中的所有组件
const requireComponent = require.context(
  "./components",
  true,
  /[A-Z]\w+\.(vue|js)$/
);

/**
 * 初始化参数
 * @param {*} Vue
 * @param {*} params request 用于 table 中请求
 * @param {*} params pageConfig：{ pageSize: "pageSize", pageNum: "pageNum" } 用于 table 中请求
 */
function initBackTemplate(Vue, params) {
  const { request, pageConfig = { pageSize: "pageSize", pageNum: "pageNum" } } =
    params;

  if (!request || !(request instanceof Function)) {
    throw new Error("request is required and must be a function.");
  }

  if (typeof pageConfig !== "object") {
    throw new Error("pageConfig is required and must be an object.");
  }

  if (!pageConfig.pageSize || !pageConfig.pageNum) {
    throw new Error("pageSize and pageNum are required.");
  }
  // 将参数挂载到 Vue 的原型链上
  Vue.prototype.$backTemplateParams = { request, pageConfig };
}

// 自动注册组件
export default {
  install(Vue) {
    requireComponent.keys().forEach((fileName) => {
      const componentConfig = requireComponent(fileName);
      const componentName = upperFirst(
        camelCase(fileName.replace(/^\.\/(.*)\.\w+$/, "$1"))
      );

      Vue.component(componentName, componentConfig.default || componentConfig);
    });
  },
  initBackTemplate,
  mixin,
};
