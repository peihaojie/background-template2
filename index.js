/**
 * @Author: HaoJie
 * @Date: 2024-03-20 13:58:10
 * @LastEditTime: 2024-04-11 16:49:28
 * @LastEditors: HaoJie
 * @FilePath: \spms-ui\lib\index.js
 */
import Filters from "./components/Filters";
import DynamicTable from "./components/DynamicTable";
import OperateButton from "./components/DynamicTable/components/OperateButton";
import ButtonGroup from "./components/ButtonGroup";
import FormDialog from "./components/FormDialog";

export default {
  components: {
    Filters,
    DynamicTable,
    ButtonGroup,
    OperateButton,
    FormDialog,
  },
  data() {
    return {
      showSearch: true,
      filterParams: {},
      selection: [],
    };
  },
  methods: {
    // 刷新 table
    queryTable() {
      this.search(this.filterParams);
    },
    async callMethod(button, row) {
      /**
       * 只有 button 的 _from 属性为 ButtonGroup 才需要 loading
       */
      const needLoading = button._from === "ButtonGroup";
      needLoading && (button.props.loading = true);
      try {
        await this[button.handler](row);
      } catch (error) {
        console.log(error);
      } finally {
        needLoading && (button.props.loading = false);
      }
    },
    handleSelectionChange(selection) {
      this.selection = selection;
    },
  },
};
