<template>
<el-card>
    <my-bread level1="商品管理" level2="分类参数"></my-bread>
    <el-alert title="只允许为第三级分类设置参数" type="error" class="alets">
    </el-alert>
    <!-- //级联选择器 -->
    <el-form label-position="left" label-width="80px" :model="form" class="selects">
        <el-form-item label="商品名称">
            <el-cascader clearable :show-all-levels="false" expand-trigger="hover" :options="options" :props="propsdata" v-model="selectedOptions2" @change="handleChange">
            </el-cascader>
        </el-form-item>
    </el-form>
    <!-- //tabs表格 -->
    <template>
        <el-tabs v-model="active" @tab-click="handleClick">
            <el-tab-pane label="动态参数" name="1">
                <el-button type="danger">设置动态参数</el-button>
                <el-table :data="arrs" style="width: 100%">
                    <el-table-column type="expand" label="#">
                        <template slot-scope="scope">
                            <el-tag :key="tag" v-for="tag in scope.row.attr_vals" closable :disable-transitions="false" @close="handleClose(scope.row,tag)">
                                {{tag}}
                            </el-tag>
                            <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row.attr_vals)" @blur="handleInputConfirm(scope.row.attr_vals)">
                            </el-input>
                            <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>

                        </template>
                    </el-table-column>
                    <el-table-column label="商品属性" prop="attr_name">
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
            </el-tab-pane>
            <el-tab-pane label="静态参数" name="2">
                <el-button type="danger">设置动态参数</el-button>
                <!-- //表格 -->
                <el-table :data="arrs2" style="width: 100%">
                    <el-table-column type='index' label="#" width="180">
                    </el-table-column>
                    <el-table-column prop="attr_name" label="属性名称" width="180">
                    </el-table-column>
                    <el-table-column prop="attr_vals" label="属性值">
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
            </el-tab-pane>
        </el-tabs>
    </template>

</el-card>
</template>

<script>
export default {
    data() {
        return {
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
            options: [],
            selectedOptions2: [],
            propsdata: {
                value: "cat_id",
                label: "cat_name",
                children: "children",

            },
            active: '1',
            //  动态数据
            arrs: [],
            //  静态数据
            arrs2: [],
            //展开行
            //  dynamicTags: ['标签一', '标签二', '标签三'],
            inputVisible: false,
            inputValue: ''
        }
    },
    created() {
        this.getGoodsCateList()
    },
    methods: {
        //暂展开行
        async handleClose(attr, tag) {
            attr.attr_vals.splice(attr.attr_vals.indexOf(tag), 1);
            //点击展开行的关闭按钮时，发送请求
            const res = await this.$http.put(`categories/${this.selectedOptions2[2]}/attributes/${attr.attr_id}`)
            console.log(res)
        },

        showInput() {
            this.inputVisible = true;
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },

        handleInputConfirm(attr_vals) {
            let inputValue = this.inputValue;
            if (inputValue) {
                attr_vals.push(inputValue);
            }
            this.inputVisible = false;
            this.inputValue = '';
        },
        async handleChange(value) {

            //发送请求获取动态数据
            if (this.selectedOptions2.length === 3) {

                const res = await this.$http.get(`categories/${this.selectedOptions2[2]}/attributes?sel=many`)
                console.log(res)
                this.arrs = res.data.data
                this.arrs.forEach(item => {
                    item.attr_vals = item.attr_vals.trim().length === 0 ? [] : item.attr_vals.trim().split(',')
                })

            }
            console.log(value);
        },
        async getGoodsCateList() {
            const res = await this.$http.get(`categories?type=3`)
            console.log(res)
            this.options = res.data.data

        },
        // tabs切换
        async handleClick(tab, event) {
            // console.log(tab, event);
            if (this.active === '2') {
                if (this.selectedOptions2.length === 3) {
                    const res = await this.$http.get(`categories/${this.selectedOptions2[2]}/attributes?sel=only`)
                    console.log(res)
                    this.arrs2 = res.data.data
                }
            }
        }
    }
}
</script>

<style>
.alets {
    margin-top: 20px;
}

.selects {
    margin-top: 20px;
}

/* //展开行 */
.el-tag+.el-tag {
    margin-left: 10px;
}

.button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
}

.input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
}
</style>
