<template>
  <div class="container">
    <div class="userinfo">
      <img class="userinfo-avatar" v-if="userInfo.avatarUrl" :src="userInfo.avatarUrl" background-size="cover" />
    </div>
    <mp-cell-group title="表单">
      <mp-field
        @change="userTextChange"
        placeholder="请输入用户名"
        type="text"
        label="用户名"
      />
      <mp-field
        @change="passTextChange"
        placeholder="请输入密码"
        label="密码"
        type="password"
      />
    </mp-cell-group>
    <button class="login-button" @click="login">登录</button>
    <a href="/pages/regiest/main" class="counter">申请注册</a>

  </div>
</template>

<script>
  import card from '@/components/card'
  import MpSlider from 'mp-weui/packages/slider'
  import MpField from 'mp-weui/packages/field'
  import md5 from '@/utils/md5'
  import Dialog from 'mp-weui/packages/dialog'
  export default {
    data () {
      return {
        userName: '',
        passWord: '',
        userInfo: {}
      }
    },

    components: {
      card,
      MpSlider,
      MpField,
      Dialog
    },

    onShareAppMessage () {
      return {
        title: '柚群店铺助手',
        imageUrl: '/static/images/logo.png'
      }
    },

    methods: {
      userTextChange (value) {
        this.userName = value
      },
      passTextChange (value) {
        this.passWord = value
      },
      login () {
        var token = wx.getStorageSync('token')
        var appId = wx.getStorageSync('appId')
        console.log(appId)
        if (this.userName === null || this.userName === '') {
          Dialog.alert('请输入用户名')
          return
        }
        if (this.passWord === null || this.passWord === '') {
          Dialog.alert('请输入密码')
          return
        }
        var p = md5(this.passWord)
        wx.showLoading({
          title: '登陆中'
        })
        wx.request({
          url: 'https://xiaochengxu.nibaspace.com/commodity/doLogin',
          method: 'post',
          data: {
            userName: this.userName, // 这里是发送给服务器的参数（参数名：参数值）
            password: p
          },
          header: {
            'content-type': 'application/json',
            'Authorization': token// 默认值
          },
          success: function (res) {
            console.log(res)
            wx.hideLoading()
            if (res.statusCode === 200) {
              if (res.data.result) {
                wx.setStorageSync('token', res.data.data.accessToken)
                wx.setStorageSync('appId', res.data.data.appId)
                const url = '../manager/main'
                wx.navigateTo({ url })
              } else {
                Dialog.alert('登录失败')
              }
            } else {
              Dialog.alert('登录失败')
            }
          },
          fail: function () {
            wx.hideLoading()
          }
        })
      },
      clickHandle (msg, ev) {
        console.log('clickHandle:', msg, ev)
      }
    }

  }
</script>

<style scoped>
  .userinfo {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .userinfo-avatar {
    width: 128px;
    height: 128px;
    margin: 20px;
    border-radius: 50%;
  }
  .login-button{
    width: 80%;
    margin-top: 100px;
    background-color: #FFCC00;
    color: black;
    align-items: center;
  }
  .input-info {
    margin-top: 100px;
  }

  .form-control {
    display: block;
    padding: 0 12px;
    margin-bottom: 5px;
    border: 1px solid #ccc;
  }

  .counter {
    display: inline-block;
    height: 40px;
    margin-top: 15px;
    text-align: center;
    width: 80%;
    color: black;
    line-height: 40px;
    align-items: center;
    border: 1px solid #FFCC00;
    border-radius: 5px;
  }
</style>
