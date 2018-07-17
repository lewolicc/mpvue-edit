<template>
  <div class="container">
    <div class="mydiv" @click="toPage('../manager/behave/main')">
      <img src="../../../static/images/icon_edit.png" alt="">
      <p class="text">修改店铺基本信息</p>
    </div>
     <div class="mydiv" @click="toPage('../manager/addproduct/main')">
      <img src="../../../static/images/icon_goos.png" alt="">
      <p class="text">添加商品</p>
    </div>
     <div class="mydiv" @click="toPage('../manager/banner/main')">
      <img src="../../../static/images/icon_manager.png" alt="">
      <p  class="text">轮播图管理</p>
    </div>
     <div class="mydiv" @click="toPage('../manager/productlist/main')">
      <img src="../../../static/images/icon_my.png" alt="">
      <p class="text">我的商品</p>
    </div>
  
    <!-- <a href="/pages/manager/behave/main" class="btn">修改店铺基本信息</a>
    <a href="/pages/manager/addproduct/main" class="btn">添加商品</a>
    <a href="/pages/manager/banner/main" class="btn">轮播图管理</a>
    <a href="/pages/manager/productlist/main" class="btn">我的商品</a> -->
  </div>
</template>

<script>
  export default {
    data () {
      return {
        userName: '',
        passWord: '',
        userInfo: {}
      }
    },
    methods: {
      toPage (path) {
        console.log('sdsd')
        wx.navigateTo({
          url: path
        })
      },
      gotoProductList () {
        console.log(123)
        const url = '/productlist/main'
        wx.navigateTo({ url })
      }
    }
  }
</script>

<style scoped>
 .mydiv{
   height: 100px;
   width: 80%;
   background: white;
   display: flex;
   margin-top: 15px;
   align-items: center;
   border-radius: 5px
   
 }
 img{
   width: 45px;
   height: 45px;
   padding: 10px;
   margin-left: 10px

 }
 p{
   background: white;
   font-size: 16px;
   color: black;
   margin: 15px;
   
 }
  .container{
    width: 100%;
    height: 100%;
    background: #F7F5F6 
  }
  .btn {
    width: 90%;
    margin-top: 30rpx;
    background-color: rgb(90, 77, 24);
    color: #FFF;
    padding: 10px;
    align-items: center;
  }
</style>
