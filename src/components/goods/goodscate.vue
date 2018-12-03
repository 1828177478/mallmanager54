<template>
<el-card>
    <my-bread level1="商品管理" level2="商品分类"></my-bread>
    <el-button type="success" class="btn" @click="addCates()">添加分类</el-button>
    <!-- //表格 -->
    <el-table :data="tableData" stripe style="width: 100%">
        <!-- <el-table-column prop="cat_name" label="分类名称" width="180">
        </el-table-column> -->
        <el-tree-grid prop="cat_name" label="分类名称" treeKey="cat_id" parentKey="cat_pid" levelKey="cat_level" childKey="children"></el-tree-grid>

        <el-table-column prop="cat_level" label="级别" width="180">
            <template slot-scope="scope">
                <span v-if="scope.row.cat_level===0">一级</span>
                <span v-else-if="scope.row.cat_level===1">二级</span>
                <span v-else-if="scope.row.cat_level===2">三级</span>
            </template>
        </el-table-column>
        <el-table-column prop="cat_deleted" label="是否有效">
            <template slot-scope="scope">
                <span v-if="scope.row.cat_deleted===false">有效</span>
                <span v-else-if="scope.row.cat_deleted===true">无效</span>
            </template>
        </el-table-column>
        <el-table-column label="操作">
            <template slot-scope="scope">
                <el-row>
                    <el-button size="mini" plain type="primary" icon="el-icon-edit" circle></el-button>
                    <el-button size="mini" plain type="danger" icon="el-icon-delete" circle></el-button>
                </el-row>
            </template>
        </el-table-column>
    </el-table>

    <!-- 添加分类的对话框 -->
    <el-dialog title="添加分类" :visible.sync="dialogFormVisibleAdd">
        <el-form :model="form">
            <el-form-item label="分类名称" :label-width="formLabelWidth">
                <el-input v-model="form.cat_name" autocomplete="off"></el-input>
            </el-form-item>
            <!-- 级联选择器 (表单元素) -->
            <el-form-item label="分类" :label-width="formLabelWidth">
                {{selectedOptions}}
                <el-cascader expand-trigger="hover" change-on-select clearable :options="caslist" v-model="selectedOptions" :props="defaultProp"></el-cascader>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
            <el-button type="primary" @click="addCate()">确 定</el-button>
        </div>
    </el-dialog>

</el-card>
</template>

<script>
var ElTreeGrid = require('element-tree-grid');
export default {
    components: {
        ElTreeGrid
    },
    data() {
        return {
            tableData: [],
            pagenum: 1,
            pagesize: 10,
            dialogFormVisibleAdd: false,

            form: {
                cat_pid: -1,
                cat_name: "",
                cat_level: -1
            },
            formLabelWidth: "140px",
            //  级联选择器要用的数据
            caslist: [],
            //  级联选择器选中的数据
            selectedOptions: [],
            defaultProp: {
                value: "cat_id",
                label: "cat_name",
                children: "children"
            }
        }
    },
    created() {
        this.getlist()
    },
    methods: {
        //点击弹出层确定按钮时，添加数据
        async addCate(){
            if (this.selectedOptions.length === 0) {
        this.form.cat_level = 0;
        this.form.cat_pid = 0;
      } else if (this.selectedOptions.length === 1) {
        this.form.cat_level = 1;
        this.form.cat_pid = this.selectedOptions[0];
      } else if (this.selectedOptions.length === 2) {
        this.form.cat_level = 2;
        this.form.cat_pid = this.selectedOptions[1];
      }
      // cat_pid	分类父 ID	不能为空
      // cat_name	分类名称	不能为空
      // cat_level	分类层级	不能为空
      const res = await this.$http.post(`categories`, this.form);
      // console.log(res);
      // 关闭对话框
      this.dialogFormVisibleAdd = false;
      this.form = {};
      // 更新视图
      this.getlist();
        },
        //添加分类
        async addCates() {
            // 弹出层的级联选择器的数据
             const res = await this.$http.get(`categories?type=2`);
            this.caslist = res.data.data;

            this.dialogFormVisibleAdd = true
        },
        //得到参数列表
        async getlist() {
            const res = await this.$http.get(
                `categories?type=3&pagenum=${this.pagenum}&pagesize=${this.pagesize}`
            );
            console.log(res)
            this.tableData = res.data.data.result
        }
    }

}
</script>

<style>
.btn {
    margin-top: 20px;
}
</style>
