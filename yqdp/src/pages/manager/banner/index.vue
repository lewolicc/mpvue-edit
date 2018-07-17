<template>
  <div>
    <mp-uploader-base
      @onSelect="onSelectBanner"
      :file-list="filesBanner"
      title="点击添加轮播图"
      :max="max"
    />

    <ul>
      <li class="list-item" v-for="(item, index) in bannerList" :key="index">
        <div class="content">
          <img :src="item.url" alt="" :onerror="errorImg">
          <div class="detail-btn">
            <div class="btn" @click="deleteBanner(item.id)">删除</div>
             <div class="btn-black" @click="addDetail(item.id)">添加详情</div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
  import Dialog from 'mp-weui/packages/dialog'
  import MpUploaderBase from 'mp-weui/packages/uploader-base'
  export default {
    data () {
      return {
        max: 4,
        filesBanner: [],
        bannerList: []
      }
    },
    mounted () {
      this.getBannerList()
    },
    components: {
      MpUploaderBase,
      Dialog
    },
    methods: {
      addDetail (id) {
        wx.navigateTo({
          url: '../bannerChange/main?id=' + id
        })
      },
      onSelectBanner () {
        var tempfle = []
        var temPpath = []
        wx.chooseImage({
          sizeType: ['original', 'compressed'],
          sourceType: ['album', 'camera'],
          count: this.max,
          success: (res) => {
            tempfle = res.tempFilePaths
            temPpath = res.tempFiles
            wx.showLoading({
              title: '上传中...'
            })
            this.onUploadFile(tempfle, temPpath)
          }
        })
      },
      onUploadFile (tempfle, temPpath) {
        var token = wx.getStorageSync('token')
        var that = this
        wx.uploadFile({
          url: 'https://xiaochengxu.nibaspace.com/commodity/uploadImage',
          filePath: tempfle[0],
          name: 'file',
          header: {
            'content-type': 'application/json',
            'Authorization': token
          },
          success: function (res) {
            console.log(res)
            if (res.statusCode === 200) {
              var obj = JSON.parse(res.data)
              if (obj.result) {
                // that.onLoding('图片上传成功')
                // that.imagePath[0] = obj.data
                that.onUpBanner(temPpath, obj.data)
              } else {
                that.onLoding('图片上传失败')
              }
            } else {
              that.onLoding('图片上传失败请重试')
            }
          },
          fail: function (res) {
            this.onLoding('图片上传失败请重试')
          }
        })
      },
      onUpBanner (temPpath, url) {
        var that = this
        var appId = wx.getStorageSync('appId')
        var token = wx.getStorageSync('token')
        wx.request({
          url: 'https://xiaochengxu.nibaspace.com/commodity/addBanner',
          method: 'POST',
          data: {
            appId: appId,
            url: url
          },
          header: {
            'content-type': 'application/json',
            'Authorization': token
          },
          success: function (res) {
            console.log(res)
            if (res.data.result) {
              that.filesBanner = that.filesBanner.concat(temPpath)
              Dialog.alert('上传成功')
            }
            wx.hideLoading()
          }
        })
      },
      getBannerList () {
        var that = this
        var appId = wx.getStorageSync('appId')
        var token = wx.getStorageSync('token')
        wx.request({
          url: 'https://xiaochengxu.nibaspace.com/commodity/listBanner',
          method: 'POST',
          data: appId,
          header: {
            'content-type': 'application/json', // 默认值
            'Authorization': token// 默认值
          },
          success: function (res) {
            if (res.data.result) {
              console.log(res.data.data)
              that.bannerList = res.data.data
            }
            wx.hideLoading()
          }
        })
      },
      deleteBanner (id) {
        var that = this
        var token = wx.getStorageSync('token')
        wx.request({
          url: 'https://xiaochengxu.nibaspace.com/commodity/deleteBanner',
          method: 'POST',
          data: id,
          header: {
            'content-type': 'application/json', // 默认值
            'Authorization': token// 默认值
          },
          success: function (res) {
            if (res.data.result) {
              console.log('dele')
              that.onLoding('图片上传失败')
              that.getBannerList()
            }
            wx.hideLoading()
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

img{
  height: 65px;
  width: 120px;
  margin-top: 20px;
  margin-left: 20px;
  border-radius: 6px;
}

.detail-btn {
  width: 60px;
  height: 100%;
  flex: 1;
  overflow: hidden;
  margin-right: 30px;
  display: block;
  right: 15px;
  margin-left: 100px;
  align-items: center;
  display: block
}
.btn {
    margin-top: 14px;
    width: 82px;
    height: 32px;
    line-height: 32px;
    text-align: center;
    font-size: 13px;
    background: #FFCC00;
    color: black
}

.btn-black {
    margin-top: 14px;
    width: 80px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    font-size: 13px;
    background: white;
    color: black;
    border: 1px solid #FFCC00
}

</style>
