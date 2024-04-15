<!--
 * @Author: HaoJie
 * @Date: 2024-03-25 11:16:58
 * @LastEditTime: 2024-03-25 11:35:10
 * @LastEditors: HaoJie
 * @FilePath: \spms-ui\src\components\DynamicTable\components\tooltip.vue
-->
<template>
  <div class="tooltip-container" :title="text">
    {{ text }}
  </div>
</template>

<script>
export default {
  props: {
    text: {
      required: true,
    },
  },
};
</script>

<style scoped></style>
