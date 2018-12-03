<template>
<el-card>
    <!-- 面包屑 -->
    <my-bread level1="商品管理" level2="商品列表"></my-bread>
    <!-- alert提示框 -->
    <el-alert title="添加商品信息" type="success" center show-icon class="elalert">
    </el-alert>
    <!-- 步骤条 -->
    <el-steps :active="active-0" finish-status="success" simple style="margin-top: 20px">
        <el-step title="步骤 1"></el-step>
        <el-step title="步骤 2"></el-step>
        <el-step title="步骤 3"></el-step>
        <el-step title="步骤 4"></el-step>
        <el-step title="步骤 5"></el-step>
    </el-steps>

    <el-form label-position="top" label-width="80px" :model="form" style="height:350px;overflow:auto">
        <el-tabs tab-position="left" v-model="active" @tab-click="tabchange()">
            <el-tab-pane label="基本信息" name="1">

                <el-form-item label="商品名称">
                    <el-input v-model="form.goods_name"></el-input>
                </el-form-item>
                <el-form-item label="商品价格">
                    <el-input v-model="form.goods_price"></el-input>
                </el-form-item>
                <el-form-item label="商品重量">
                    <el-input v-model="form.goods_weight"></el-input>
                </el-form-item>
                <el-form-item label="商品数量">
                    <el-input v-model="form.goods_number"></el-input>
                </el-form-item>
                <el-form-item label="商品分类">
                    <el-cascader expand-trigger="hover" :options="options" :props="propsdata" v-model="selectedOptions2" @change="handleChange">
                    </el-cascader>
                </el-form-item>

            </el-tab-pane>
            <el-tab-pane label="商品参数" name="2">
                <el-form-item :label="item1.attr_name" v-for="(item1,i) in arrs" :key="i">
                    <el-checkbox-group v-model="item1.attr_vals">
                        <el-checkbox border :label="item2" v-for="(item2,i) in item1.attr_vals" :key="i"></el-checkbox>
                    </el-checkbox-group>
                </el-form-item>

            </el-tab-pane>
            <el-tab-pane label="商品属性" name="3">
                <el-form-item :label="item.attr_name" v-for="(item,i) in arrs2" :key="i">
                    <el-input v-model="item.attr_vals"></el-input>
                </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="商品图片" name="4">
                <el-upload class="upload-demo" action="http://localhost:8888/api/private/v1/upload" :headers="headers" :on-preview="handlePreview" :on-remove="handleRemove" :on-success="handleSuccess" list-type="picture">
                    <el-button size="small" type="primary">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                </el-upload>
            </el-tab-pane>
            <el-tab-pane label="商品内容" name="5">
                <el-form-item>
                    <el-button type="primary" @click="addGoods()">添加商品</el-button>
                    <!-- //富文本编辑器 -->
                    <quill-editor v-model="form.goods_introduce"></quill-editor>
                </el-form-item>
            </el-tab-pane>
        </el-tabs>
    </el-form>
</el-card>
</template>

<script>
//富文本编辑器
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import {
    quillEditor
} from 'vue-quill-editor'
export default {
    //富文本编辑器
    components: {
        quillEditor
    },
    data() {
        return {
            active: "1",
            form: {
                goods_name: '',
                goods_price: '',
                goods_number: "",
                goods_weight: "",
                goods_introduce: '',

                goods_cat: "",
                pics: [],
                attrs: '',

            },
            headers: {
                Authorization: localStorage.getItem('token')
            },

            options: [],
            selectedOptions2: [],
            propsdata: {
                value: "cat_id",
                label: "cat_name",
                children: "children",

            },
            // 第二个
            checkList: [],
            //  动态数据
            arrs: [],
            //  静态数据
            arrs2: [],

        }
    },
    created() {
        this.getGoodsCateList()
    },
    methods: {
        async addGoods() {
            //在未发送添加商品之前需要处理下提交的数据
            //  goods_cat: "",
            //     pics: "",
            //     attrs: '',
            // 1、goods_cat:以为','分割的分类列表
            this.form.goods_cat = this.selectedOptions2.join(',')
            //2,pics上传的图片临时路径（对象）在handleSuccess，handleRemove方法中分别添加和删除临时路径
            // 3,attrs商品的参数（数组）

            //         "attrs":[
            // {
            //   "attr_id":15,
            //   "attr_value":"ddd"
            // },
            // this.form.attrs 这个[]
            //"attrs":[{"attr_id":15,"attr_value":"ddd"}]
            // attrs数组中的每个对象里attr_id和attr_value值来源于动态/静态参数数组
            // 动态参数
            // console.log(this.arrDyparams);
            // 1. 取出数组中的每个对象key和value
            // 2. 返回一个新数组
            let arr1 = this.arrs.map(item => {
                // item.attr_id和item.attr_vals
                return {
                    attr_id: item.attr_id,
                    attr_value: item.attr_vals
                };
            });
            // console.log(arr1);
            // 静态参数
            let arr2 = this.arrs2.map(item => {
                // item.attr_id和item.attr_vals
                return {
                    attr_id: item.attr_id,
                    attr_value: item.attr_vals
                };
            });
            // console.log(arr2);

            let attrs = [...arr1, ...arr2];
            this.form.attrs = attrs;
            const res = await this.$http.post(`goods`, this.form)
            console.log(res)
            //调回到商品列表页
             this.$router.push({ name: "goods" });
        },
        //第四个图片上传
        handleRemove(file, fileList) {

            let Index = this.form.pics.findIndex((item) => {
                return item.pic === file.response.data.tmp_path
            })
            //   console.log(Index) 移除图片的临时路径
            this.form.pics.splice(Index, 1)

            console.log(file, fileList);
        },
        handlePreview(file) {
            console.log(file);
        },
        handleSuccess(file) {
            this.form.pics.push({
                pic: file.data.tmp_path
            })
            console.log(file);
        },
        //第二个数据

        async tabchange() {
            if (this.selectedOptions2.length !== 3) {
                this.$message.warning('请先选择三级联动')
                return
            }
            if (this.active === '2') {
                const res = await this.$http.get(`categories/${this.selectedOptions2[2]}/attributes?sel=many`)
                console.log(res)
                this.arrs = res.data.data
                this.arrs.forEach(item => {
                    item.attr_vals = item.attr_vals.trim().length === 0 ? [] : item.attr_vals.trim().split(',')
                })
            } else if (this.active === '3') {
                const res = await this.$http.get(`categories/${this.selectedOptions2[2]}/attributes?sel=only`)
                console.log(res)
                this.arrs2 = res.data.data
            }

        },
        handleChange(value) {
            console.log(value);
        },

        //获取数据
        //  async getGoodsCateList(){
        //       const res = await this.$http.get(`categories?type=3`)
        //       console.log(res)
        //       this.options = this.data.data
        //   }

        async getGoodsCateList() {
            const res = await this.$http.get(`categories?type=3`)
            console.log(res)
            this.options = res.data.data

        }
    }
}
</script>

<style>
.elalert {
    margin-top: 20px;
}

.ql-editor {
    min-height: 200px;
}
</style>
