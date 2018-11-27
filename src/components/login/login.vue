<template>
    <div class="login-wrap">

            <el-form class="login-form" :label-position="labelPosition" label-width="80px" :model="formLabelAlign">
            <h2>用户登录</h2>
            <el-form-item label="用户名">
                <el-input v-model="formLabelAlign.username"></el-input>
            </el-form-item>
            <el-form-item label="密码">
                <el-input v-model="formLabelAlign.password"></el-input>
            </el-form-item>
             <el-button type="primary" class="login-btn" @click.prevent = "handelogin()">登录</el-button>
            </el-form>
    </div>
</template>

<script>
export default {
  data () {
    return {
      labelPosition: 'top',
      formLabelAlign: {
        username: '',
        password: '',
        type: ''
      }
    }
  },
  methods: {
    // 方法一
    // handelogin () {
    //   this.$http.post('login', this.formLabelAlign)
    //     .then((res) => {
    //       console.log(res)
    //       const {meta: {msg, status}, data} = res.data
    //       if (status === 200) {
    //         this.$router.push({name: 'home'})
    //         this.$message.success('恭喜你，这是一条成功消息')
    //       } else {
    //         this.$message.error('错了哦，这是一条错误消息')
    //       }
    //     })
    // }
    // 方法二
    async handelogin () {
      const res = await this.$http.post('login', this.formLabelAlign)

      console.log(res)
      const {meta: {msg, status}, data} = res.data
      if (status === 200) {
        // 判断用户是否登录，存储token值
        const token = localStorage.setItem('token', data.token)
        // 登录成功后的弹出提示
        this.$router.push({name: 'home'})
        this.$message.success(msg)
      } else {
        this.$message.error(msg)
      }
    }
  }
}
</script>

<style>
    .login-wrap {
        background-color: #324152;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;

    }
    .login-form {
        background-color: #fff;
        width: 400px;
        border-radius: 5px;
        padding: 30px;
    }
    .login-btn {
        width: 100%;
    }
</style>
