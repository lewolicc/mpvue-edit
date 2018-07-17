<template>
  <div> 
    <div>
       <div>
            <button @click="addDeatail">添加轮播详情</button>
        </div>
        <ul>
        <li class="list-item" v-for="(item, index) in details" :key="index">
            <div class="content">
              <img :src="item.bizUrl" alt="">
              <div class="detail-text">
                  <p>{{item.bizDesc}}</p>
              </div>
              <div class="detail-btn">
               <div class="btn" @click="change(item.id)">修改</div>
            </div>
            </div>
        </li>
        </ul>
    </div>
  </div>
</template>
<script>
  import Dialog from 'mp-weui/packages/dialog'
  export default {
    data () {
      return {
        id: '',
        content: '',
        details: []
      }
    },
    onLoad: function (option) {
      this.id = option.id
    },
    mounted () {
      this.getdata()
    },
    components: {
      Dialog
    },
    methods: {
      addDeatail () {
        wx.navigateTo({
          url: '../bannerDetail/main?id=' + this.id
        })
      },
      change (id) {
        var myId = id + ',' + this.id
        console.log(myId)
        wx.navigateTo({
          url: '../updateGoodsDetail/main?id=' + myId
        })
      },
      getdata () {
        var that = this
        var token = wx.getStorageSync('token')
        wx.request({
          url: 'https://xiaochengxu.nibaspace.com/commodity/queryDetailList',
          method: 'POST',
          data: this.id,
          header: {
            'content-type': 'application/json', // 默认值
            'Authorization': token// 默认值
          },
          success: function (res) {
            console.log(res)
            if (res.data.result) {
              that.details = res.data.data
            } else {
            }
          }
        })
      },
      onLoding (s) {
        wx.showLoading({
          title: s
        })
        setTimeout(function () {
          wx.hideLoading()
        }, 1000)
      }
    }
  }
</script>

<style scoped>
button {
    margin-top: 10px;
    background: #FFCC00
  }

li {
  height: 105px;
  width: 100%;
  border-bottom: 1px solid #f5f5f5;
}

.content {
      height: 120px;
      width: 100%;
      display: flex;
}

input{
    height: 100px;
    width: 100%;
    margin-top: 10px;
  }
img{
  height: 65px;
  width: 120px;
  margin-top: 20px;
  margin-left: 20px;
  border-radius: 6px;
}
.detail-btn {
  width: 82px;
  height: 100%;
  overflow: hidden;
  margin-right: 30px;
  align-items: center;
  display: flex;
  align-items: center;
}
/* .btn {
    width: 60px;
    height: 24px;
    line-height: 24px;
    border-radius: 5px;
    text-align: center;
    font-size: 13px;
    border: 1px solid red;
    color: red;
  } */
  .btn {
    width: 82px;
    height: 32px;
    line-height: 32px;
    text-align: center;
    text-align: center;
    font-size: 13px;
    background: #FFCC00;
    color: black
}

.detail-text {
  width: 60px;
  height: 100%;
  flex: 1;
  overflow: hidden;
  margin-right: 15px;
  display: block;
  right: 15px;
  margin-left: 15px;
  align-items: center;
  display: block
}
 p {
    margin-top: 25px;
}

</style>
