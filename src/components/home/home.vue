<template>
<div>
    <el-container class="continer">
        <el-header class="header">
            <el-row>
                <el-col :span="4">
                    <div class="grid-content bg-purple">
                        <img src="../../assets/logo.png" alt=""></div>
                </el-col>
                <el-col :span="19" class="middle-log">
                    <div class="grid-content bg-purple-light">
                        <h2>电商后台管理系统</h2>
                    </div>
                </el-col>
                <el-col :span="1">
                    <div class="grid-content bg-purple">
                        <a href="#" class="loginout" @click.prevent = 'loginout()'>退出</a></div>
                </el-col>
            </el-row>
        </el-header>
        <el-container>
            <!-- 侧边栏 -->
            <el-aside width="200px" class="aside">
                <el-row class="tac">
                    <el-menu :router='true' :unique-opened='true' default-active="2" class="el-menu-vertical-demo">
                        <el-submenu :index="''+item1.order" v-for="(item1,i) in menu" :key="i">
                            <template slot="title">
                                <i class="el-icon-location"></i>
                                <span>{{item1.authName}}</span>
                            </template>
                            <template >
                                <el-menu-item-group v-for="(items2,i) in item1.children" :key="i">
                                    <el-menu-item :index = "''+items2.path">{{items2.authName}}</el-menu-item>
                                </el-menu-item-group>
                            </template>

                        </el-submenu>
                        <!-- <el-submenu index="2">
                            <template slot="title">
                                <i class="el-icon-location"></i>
                                <span>权限管理</span>
                            </template>
                            <el-menu-item-group>
                                <el-menu-item index="role">角色列表</el-menu-item>
                                <el-menu-item index="rights">权限列表</el-menu-item>
                            </el-menu-item-group>
                        </el-submenu>
                        <el-submenu index="3">
                            <template slot="title">
                                <i class="el-icon-location"></i>
                                <span>商品管理</span>
                            </template>
                            <el-menu-item-group>
                                <el-menu-item index="1-1">商品列表</el-menu-item>
                                <el-menu-item index="1-2">分类参数</el-menu-item>
                                <el-menu-item index="1-2">商品分类</el-menu-item>
                            </el-menu-item-group>
                        </el-submenu>
                        <el-submenu index="4">
                            <template slot="title">
                                <i class="el-icon-location"></i>
                                <span>订单管理</span>
                            </template>
                            <el-menu-item-group>
                                <el-menu-item index="1-1">订单列表</el-menu-item>
                            </el-menu-item-group>
                        </el-submenu>
                        <el-submenu index="5">
                            <template slot="title">
                                <i class="el-icon-location"></i>
                                <span>数据统计</span>
                            </template>
                            <el-menu-item-group>
                                <el-menu-item index="1-1">数据报表</el-menu-item>
                            </el-menu-item-group>
                        </el-submenu> -->

                    </el-menu>
                </el-row>
            </el-aside>
            <!-- //主体部分 -->
            <el-main class="min">
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</div>
</template>

<script>
export default {
    data() {
        return {
            menu: []
        }
    },
    beforeCreate() {
        // // 获取token值
        // const token = localStorage.getItem('token')
        // // 如果token值不存在，证明用户未登录，跳回登录页面
        // if (!token) {
        //     this.$router.push({
        //         name: 'login'
        //     })
        // }
    },
    created() {
        this.getMenus()
    },
    methods: {
        //获取侧边栏的数据
        async getMenus() {
            const res = await this.$http.get(`menus`)
            console.log(res)
            this.menu = res.data.data
        },

        // 验证用户是否登录

        loginout() {
            // 提示
            this.$message.success('退出成功')
            // 清除
            localStorage.clear()
            // 回到login组件
            this.$router.push({
                name: 'login'
            })
        }
    }
}
</script>

<style>
.continer {
    height: 100%;
}

.header {
    background-color: #b3c0d1;
}

.aside {
    background-color: #d3dce6;
}

.min {
    background-color: #e9eef3;
    height: 100%;
}

/* //头部样式调整 */
.middle-log {
    text-align: center;
}

.loginout {
    text-decoration: none;
    line-height: 60px;
}
</style>
