<template>
<el-card>
    <my-bread level1="权限管理" level2="角色管理"></my-bread>
    <el-row class="btns">
        <el-button>添加角色</el-button>
    </el-row>
    <!-- //表格 -->
    <el-table height="450px" :data="rolelist" style="width: 100%">
        <el-table-column type="expand">
            <template slot-scope="scope">
                <el-row v-for="(item1,i) in scope.row.children" :key="i">
                    <el-col :span="4">
                        <el-tag closable @close="deleRight(scope.row,item1.id)">{{item1.authName}}</el-tag>
                        <i class="el-icon-arrow-right"></i>
                    </el-col>
                    <el-col :span="20">
                        <el-row v-for="(item2,i) in item1.children" :key="i">
                            <el-col :span="4">
                                <el-tag type="success" closable @close="deleRight(scope.row,item2.id)">{{item2.authName}}</el-tag>
                                <i class="el-icon-arrow-right"></i>
                            </el-col>
                            <el-col :span="20">
                                <el-tag @close="deleRight(scope.row,item3.id)" type="warning" closable v-for="(item3,i) in item2.children" :key="i">{{item3.authName}}</el-tag>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
                <el-row v-if="scope.row.children.length===0">
                    <span>未分配权限</span>
                </el-row>
            </template>

        </el-table-column>
        <el-table-column type='index' label="#" width="80">
        </el-table-column>
        <el-table-column prop="roleName" label="角色名称" width="180">
        </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述" width="180">
        </el-table-column>
        <el-table-column label="操作">
            <template slot-scope="scope">
                <el-row>
                    <el-button size="mini" plain type="primary" icon="el-icon-edit" circle></el-button>
                    <el-button size="mini" plain type="danger" icon="el-icon-delete" circle></el-button>
                    <el-button @click="treesd(scope.row)" size="mini" plain type="success" icon="el-icon-check" circle></el-button>
                </el-row>
            </template>
        </el-table-column>
    </el-table>
    <!-- //弹出的树状结构层 -->
    <el-dialog title="角色列表" :visible.sync="dialogFormVisible">
        <el-form :model="form">
            <el-tree ref="tree" :data="data2" show-checkbox node-key="id" default-expand-all :default-checked-keys="arrcheck" :props="defaultProps">
            </el-tree>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="setRoleRight()">确 定</el-button>
        </div>
    </el-dialog>
</el-card>
</template>

<script>
export default {
    data() {
        return {
            rolelist: [],
            // 树状弹出层数据
            dialogTableVisible: false,
            dialogFormVisible: false,
            form: {
                name: '',
                region: '',
                date1: '',
                date2: '',
                delivery: false,
                type: [],
                resource: '',
                desc: ''
            },
            formLabelWidth: '100px',
            // 树状弹出层数据
            data2: [],
            defaultProps: {
            children: 'children',
            label: 'authName'
            },
            arrcheck:[],
            currRoleId:-1
        }
    },

    created() {
        this.getRoleList()
    },
    methods: {
        //修改树状图结构
        async setRoleRight(){
            // console.log(this.currRoleId)
            let arr1 = this.$refs.tree.getCheckedKeys()
            let arr2 = this.$refs.tree.getHalfCheckedKeys()
            console.log(arr1)
            console.log(arr2)
            var arr = [...arr1,arr2]
            const res = await this.$http.post(`roles/${this.currRoleId}/rights`,{
                rids:arr.join(',')
            })
            // console.log(res);
            //关闭弹出层
            this.dialogFormVisible = false
            //更新页面
            this.getRoleList()

        },
        //点击check按钮。弹出对话框
        async treesd(row) {
            this.currRoleId = row.id
            //得到所有的树状数据
            const res = await this.$http.get(`rights/tree`)
            console.log(res)
            this.data2 = res.data.data
            //获取所有的数据id
            //获取所有的角色已经有的权限的id,赋值给arrcheck，显示选中已经有的权限状态
            let arr = []
            row.children.forEach(element1 => {
                // arr.push(element1.id)
                element1.children.forEach(element2=>{
                    //  arr.push(element2.id)
                      element2.children.forEach(element3=>{
                          arr.push(element3.id)
                      })
                })
            });
            this.arrcheck = arr

            this.dialogFormVisible = true
        },
        //关闭el-tag标签
        async deleRight(row, rightId) {
            const res = await this.$http.delete(`roles/${row.id}/rights/${rightId}`)
            //刷新展开的标签
            row.children = res.data.data
        },
        //请求数据列表页
        async getRoleList() {
            const res = await this.$http.get(`roles`)
            console.log(res)
            this.rolelist = res.data.data
        }
    }
}
</script>

<style>
.btns {
    margin-top: 20px;
}
</style>
