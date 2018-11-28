<template>
<el-card>
    <!-- //面包屑 -->
    <!-- <el-breadcrumb separator="/">
        <el-breadcrumb-item>首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb> -->
    <my-bread level1="权限管理" level2="权限列表"></my-bread>
    <!-- //表格 -->
    <el-table height="450px" class="table" :data="tableData" border style="width: 100%">
        <el-table-column type="index" label="#" width="80">
        </el-table-column>
        <el-table-column prop="authName" label="权限名称" width="180">
        </el-table-column>
        <el-table-column prop="path" label="路径" width="300">
        </el-table-column>
        <el-table-column prop="level" label="层级">
            <template slot-scope="scope">
                <span v-if="scope.row.level==='0'">一级</span>
                <span v-if="scope.row.level==='1'">二级</span>
                <span v-if="scope.row.level==='2'">三级</span>
            </template>
        </el-table-column>
    </el-table>

</el-card>
</template>

<script>
export default {
    data() {
        return {
            tableData: [{
                authName: '',
                path: '',
                level: ''
            }]
        }
    },
    created() {
        this.getList()
    },
    methods: {
        async getList() {
            // 设置请求头
            // const AUTH_TOKEN = localStorage.getItem('token')
            // this.$http.defaults.headers.common['Authorization'] = AUTH_TOKEN
            const res = await this.$http.get(`rights/list`)
            console.log(res)
            this.tableData = res.data.data
        }
    }

}
</script>

<style>
.table {
    margin-top: 20px;
}
</style>
