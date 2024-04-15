/**
 * @Author: HaoJie
 * @Date: 2024-03-15 10:15:18
 * @LastEditTime: 2024-04-03 11:30:22
 * @LastEditors: HaoJie
 * @FilePath: \spms-ui\src\components\Filters\defaultParams.js
 */
export const INPUT = {
  props: {
    clearable: true,
  },
};

export const SELECT = {
  optionLabel: "label",
  optionValue: "value",
  props: {
    clearable: true,
  },
};

export const CASCADER = {
  props: {
    filterable: true,
    clearable: true,
  },
};

export const DATE_PICKER = {
  props: {
    format: "yyyy-MM-dd",
    rangeSeparator: "至",
    startPlaceholder: "开始日期",
    endPlaceholder: "结束日期",
  },
};
