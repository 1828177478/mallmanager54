<template>
<el-card>
    <!-- //面包屑 -->
    <my-bread level1="商品管理" level2="列表管理"></my-bread>
    <!-- 输入框 -->
    <el-row>
        <div style="margin-top: 15px;">
            <el-input clearable placeholder="请输入内容" v-model="query" class="input-with-select">
                <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
            <el-button type="success" @click="$router.push({name:'goodsAdd'})">添加用户</el-button>
        </div>
    </el-row>
    <!-- 表格 -->
    <template>
        <el-table :data="goodsList" style="width: 100%">
            <el-table-column type='index' label="#" width="80">
            </el-table-column>
            <el-table-column prop="goods_name" label="商品名称" width="180">
            </el-table-column>
            <el-table-column prop="goods_price" label="商品价格">
            </el-table-column>
            <el-table-column prop="goods_weight" label="商品重量">
            </el-table-column>
            <el-table-column prop="add_time" label="创建日期">
                <template slot-scope='scope'>
                    {{scope.row.add_time |fmtdate}}
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
    </template>

</el-card>
</template>

<script>
export default {
    data() {
        return {
            query: "",
            goodsList: [{
                // "goods_id": 1,
                // "goods_name": "",
                // "goods_price": "",
                // "goods_number": "",
                // "goods_weight": "",
                // "goods_state": "",
                // "add_time": "",
                // "upd_time": "",
                // "hot_mumber": "",
                // "is_promote": ""
            }],
            pagenum: 1,
            pagesize: 10,
        }
    },
     created() {
            this.getGoodsLists()
        },
    methods: {

        // 添加按钮
        goodsAdd() {

        },
       
        //得到商品列表
        async getGoodsLists() {
            // this.loading = true
            const {
                data: resData
            } = await this.$http.get(
                `goods?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`
            )
            // this.total = resData.data.total
            this.goodsList = resData.data.goods
            // this.loading = false
        }
    }

}
</script>

<style>
.input-with-select {
    width: 400px;
}
</style>
