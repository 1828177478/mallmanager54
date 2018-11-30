<template>
<el-card class="box-card">
    <!-- //面包屑 -->
    <el-breadcrumb separator="/">

        <el-breadcrumb-item>首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框 -->
    <el-row>
        <div style="margin-top: 15px;">
            <el-input @clear="resetusers()" clearable placeholder="请输入内容" v-model="query" class="input-with-select">
                <el-button @click="searchUser()" slot="append" icon="el-icon-search"></el-button>
            </el-input>
            <el-button type="success" @click="showUserAdd()">添加用户</el-button>
        </div>
    </el-row>

    <!-- 表格 -->
    <template>
        <el-table :data="userList" style="width: 100%">
            <el-table-column type='index' label="#" width="80">
            </el-table-column>
            <el-table-column prop="username" label="姓名" width="180">
            </el-table-column>
            <el-table-column prop="email" label="邮箱">
            </el-table-column>
            <el-table-column prop="mobile" label="电话">
            </el-table-column>
            <el-table-column prop="create_time" label="创建日期">
                <template slot-scope='scope'>
                    {{scope.row.create_time |fmtdate}}
                </template>
            </el-table-column>
            <el-table-column label="用户状态">
                <template slot-scope="scope">
                    <el-switch @change="changestatus(scope.row)" v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949">
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-row>
                        <el-button @click="edituser(scope.row)" size="mini" plain type="primary" icon="el-icon-edit" circle></el-button>
                        <el-button @click="userdelete(scope.row.id)" size="mini" plain type="danger" icon="el-icon-delete" circle></el-button>
                        <el-button @click="userplay(scope.row)" size="mini" plain type="success" icon="el-icon-check" circle></el-button>
                    </el-row>

                </template>
            </el-table-column>
        </el-table>
    </template>

    <!-- 分页 -->
    <el-pagination class="fenye" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagenum" :page-sizes="[2, 4, 6, 8]" :page-size="2" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>

    <!--// 点击添加按钮时，弹出添加框 -->
    <el-dialog title="添加" :visible.sync="dialogFormVisibleAdd">
        <el-form :model="form">
            <el-form-item label="用户名" label-width="100px">
                <el-input v-model="form.username" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="密码" label-width="100px">
                <el-input v-model="form.password" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" label-width="100px">
                <el-input v-model="form.email" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="电话" label-width="100px">
                <el-input v-model="form.mobile" autocomplete="off"></el-input>
            </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
            <el-button type="primary" @click="adduser()">确 定</el-button>
        </div>
    </el-dialog>
    <!--// 点击编辑按钮时，弹出编辑框 -->
    <el-dialog title="编辑" :visible.sync="dialogFormVisibleEdit">
        <el-form :model="form">
            <el-form-item label="用户名" label-width="100px">
                <el-input disabled v-model="form.username" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" label-width="100px">
                <el-input v-model="form.email" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="电话" label-width="100px">
                <el-input v-model="form.mobile" autocomplete="off"></el-input>
            </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
            <el-button type="primary" @click='sureEdit()'>确 定</el-button>
        </div>
    </el-dialog>
    <!--// 点击对号按钮时，弹出对话框 -->
    <el-dialog title="收货地址" :visible.sync="dialogFormVisiblePlay">
  <el-form :model="form">
    <el-form-item label="活动名称" label-width="100px">
     {{currentUser}}
    </el-form-item>
    <el-form-item label="活动区域" label-width="100px">
      <el-select v-model="modelid">
        <el-option label="请选择" :value="-1"></el-option>
        <el-option v-for = "(item,i) in clos" :label = "item.roleName" :value = "item.id" :key="i"></el-option>
      </el-select>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisiblePlay = false">取 消</el-button>
    <el-button type="primary" @click="fixrols()">确 定</el-button>
  </div>
</el-dialog>
</el-card>
</template>

<script>
export default {
  data () {
    return {
      query: '',
      userList: [{
        create_time: '',
        email: '',
        id: '',
        mg_state: '',
        mobile: '',
        role_name: '',
        username: ''
      }],
      //   获取用户列表的数据
      pagenum: 1,
      pagesize: 2,
      total: -1,
      // 添加弹出层数据
      dialogFormVisibleAdd: false,
      // 编辑弹出层数据
      dialogFormVisibleEdit: false,
      // 对号按钮
      dialogFormVisiblePlay: false,

      form: {
        username: '',
        password: '',
        email: '',
        mobile: ''

      },
      // 当点击对号按钮时弹出框所需数据
      currentUser: '',
      modelid: -1,
      clos: [],
      currentUserId: ''

    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    // 当点击对号按钮时，弹出对话框
    async userplay (user) {
      this.currentUserId = user.id
      // 获取所有角色
      this.currentUser = user.username
      const res = await this.$http.get(`roles`)
      this.clos = res.data.data
      console.log(res)
      // 获取角色的id
      const res2 = await this.$http.get(`users/${user.id}`)
      console.log(res2)
      this.modelid = res2.data.data.rid
      this.dialogFormVisiblePlay = true
    },
    // 点击确认按钮时，修改用户的角色
    fixrols () {
      this.$http.put(`users/${this.currentUserId}/role`, {
        rid: this.modelid
      })
      // 关闭弹出框
      this.dialogFormVisiblePlay = false
    },
    // 改变用户状态
    changestatus (row) {
      this.$http.put(`users/${row.id}/state/${row.mg_state}`)
      // console.log(row)
    },
    // 编辑
    edituser (Editdata) {
      this.dialogFormVisibleEdit = true,
      this.form = Editdata
    },
    // 编辑弹出层确定按钮
    sureEdit () {
      this.$http.put(`users/${this.form.id}`, this.form)
      // 提示信息
      // 关闭弹出层
      this.dialogFormVisibleEdit = false
      // 刷新页面
      this.getUserList()
    },
    // 删除当前点击的用户
    userdelete (ID) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // 发送请求，删除数据
        const res = await this.$http.delete(`users/${ID}`)
        // console.log(res);
        const {
          meta: {
            msg,
            status
          },
          data
        } = res.data

        // 更新用户列表
        this.pagenum = 1
        this.getUserList()

        // 弹出提示信息
        // this.$message.success(msg)
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 添加确定，发送请求
    async adduser () {
      const res = await this.$http.post('users', this.form)
      // console.log(res)
      const {
        meta: {
          status,
          msg
        },
        data
      } = res.data
      if (status === 201) {
        // 关闭弹出层
        this.form = {}
        this.dialogFormVisibleAdd = false
        // 添加提示框
        this.$message.success(msg)
        // 更新列表
        this.getUserList()
      } else {
        this.$message.warning(msg)
      }
    },
    // 弹出层添加按钮
    showUserAdd () {
      this.dialogFormVisibleAdd = true
      // 当点击编辑按钮，将数据显示到编辑弹出框时，添加弹出框此时应为空
      this.form = {}
    },
    // 搜索框删除按钮
    resetusers () {
      this.getUserList()
    },
    // 搜索框
    searchUser () {
      this.pagenum = 1
      this.getUserList()
    },
    // 分页方法
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`)
      this.pagesize = val
      //   this.pagenum = 1
      this.getUserList()
    },
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      this.pagenum = val
      this.getUserList()
    },

    async getUserList () {
      // 设置请求头
      const AUTH_TOKEN = localStorage.getItem('token')
      this.$http.defaults.headers.common['Authorization'] = AUTH_TOKEN

      const res = await this.$http.get(`users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`)
      console.log(res)
      const {
        meta: {
          msg,
          status
        },
        data: {
          total,
          users
        }
      } = res.data
      if (status === 200) {
        this.total = total
        this.userList = users
        this.$message.success(msg)
      } else {
        this.$message.warning(msg)
      }
    }
  }
}
</script>

<style>
.box-card {
    height: 100%;
}
.fenye {
  margin-top: 20px;
}

.input-with-select {
    width: 400px;
}
</style>
