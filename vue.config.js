/**
 * @Author: HaoJie
 * @Date: 2024-04-11 17:38:04
 * @LastEditTime: 2024-04-15 14:05:43
 * @LastEditors: HaoJie
 * @FilePath: \spms-ui\packages\backTemplate\vue.config.js
 */
module.exports = {
  outputDir: "dist", // 打包输出目录
  productionSourceMap: false, // 关闭生产环境的 source map
  css: {
    extract: false, // 将 CSS 打包到 JS 中而不是单独生成 CSS 文件
  },
  configureWebpack: {
    output: {
      library: "background-template2",
      libraryExport: "default", // 导出默认对象
      libraryTarget: "umd", // 打包格式为 UMD
      umdNamedDefine: true, // 使用命名 AMD 模块
    },
    externals: {
      vue: "Vue", // 避免打包 Vue
      "element-ui": "ELEMENT", // 避免打包 Element UI
    },
  },
};
