/**
 * @Author: HaoJie
 * @Date: 2024-04-12 10:32:51
 * @LastEditTime: 2024-04-15 14:20:50
 * @LastEditors: HaoJie
 * @FilePath: \spms-ui\packages\backTemplate\.eslintrc.js
 */
module.exports = {
  root: true,
  parserOptions: {
    parser: "babel-eslint",
    sourceType: "module",
  },
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  extends: ["plugin:vue/recommended", "eslint:recommended"],
  rules: {
    semi: ["error", "always"], // 多余的分号
    quotes: ["error", "double"], // 字符串必须使用双引号
    "comma-dangle": ["off"], // 多余的逗号
    "vue/attributes-order": "off",
    "vue/max-attributes-per-line": "off",
    "vue/html-self-closing": "off",
    "vue/v-slot-style": "off",
    "vue/order-in-components": "off",
    "no-unused-vars": "off",
  },
};
