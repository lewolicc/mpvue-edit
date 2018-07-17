<template>
  <div >
    <mp-uploader-base
      @onSelect="onSelect"
      :file-list="files"
      title="点击添加商品图片"
      :max="max"
    />
    <mp-cell-group title="商品">
      <mp-field
        @change="producthange"
        placeholder="请输入商品名称"
        type="text"
        label="商品名称"
      />
      <mp-field
        @change="contentChange"
        placeholder="请输入商品简介"
        label="简介"
        type="text"
      />
      <mp-field
        @change="originalChange"
        placeholder="请输入原价"
        label="原价"
        type="digit"
      />
      <mp-field
        @change="nowPriceChange"
        placeholder="请输入现价"
        label="现价"
        type="digit"
      />
    </mp-cell-group>

    <button class="btn" @click="onAllSubmit"  :disabled="isDisable">确认上传</button>
  </div>
</template>

<script>
  // import fly from '@/utils/fly'
  import MpUploaderBase from 'mp-weui/packages/uploader-base'
  import MpField from 'mp-weui/packages/field'
  import Dialog from 'mp-weui/packages/dialog'
  export default {
    data () {
      return {
        files: [],
        id: '',
        max: 1,
        productIntroduction: '',
        productName: '',
        originalPrice: 0,
        isDisable: false,
        nowPrice: 0,
        imagePath: []
      }
    },
    onLoad: function (option) {
      this.id = option.id
    },
    methods: {
      producthange (value) {
        this.productName = value
      },
      contentChange (value) {
        this.productIntroduction = value
      },
      originalChange (value) {
        this.originalPrice = value
      },
      nowPriceChange (value) {
        this.nowPrice = value
      },
      onSelect () {
        var that = this
        var tempfle = []
        var temPpath = []
        // var token = wx.getStorageSync('token')
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
            wx.uploadFile({
              url: 'https://xiaochengxu.nibaspace.com/commodity/uploadImage',
              filePath: tempfle[0],
              name: 'file',
              header: {
                'content-type': 'application/json' // 默认值
              },
              success: function (res) {
                console.log(res)
                if (res.statusCode === 200) {
                  var obj = JSON.parse(res.data)
                  console.log(res)
                  if (obj.result) {
                    that.onLoding('图片上传成功')
                    that.imagePath[0] = obj.data
                    that.files = temPpath
                  } else {
                    that.onLoding('图片上传失败请重试')
                  }
                } else {
                  that.onLoding('图片上传失败请重试')
                }
              },
              fail: function (res) {
                that.onLoding('图片上传失败请重试')
              }
            })
          }
        })
      },
      onAllSubmit () {
        var that = this
        if (this.imagePath.length === 0) {
          Dialog.alert('请选择商品图片')
          return
        }
        if (this.productName === '') {
          Dialog.alert('请输入商品名称')
          return
        }
        if (this.productIntroduction === '') {
          Dialog.alert('请输入商品介绍')
          return
        }
        if (this.originalPrice <= 0) {
          Dialog.alert('请输入商品原价')
          return
        }
        if (this.nowPrice <= 0) {
          Dialog.alert('请输入商品现价')
          return
        }
        this.isDisable = true
        setTimeout(() => {
          this.isDisable = false
        }, 1000)
        var token = wx.getStorageSync('token')
        var appId = wx.getStorageSync('appId')
        console.log(this.id)
        if (this.id === '' || this.id === undefined) {
          wx.request({
            url: 'https://xiaochengxu.nibaspace.com/commodity/addGoods',
            method: 'POST',
            data: {
              appId: appId,
              faceUrl: this.imagePath[0],
              nameStr: this.productName,
              oldPrice: this.originalPrice,
              newPrice: this.nowPrice,
              content: this.productIntroduction
            },
            header: {
              'content-type': 'application/json',
              'Authorization': token// 默认值
            },
            success: function (res) {
              if (res.data.result) {
                that.onLoding('添加商品成功')
                that.files = []
                that.productIntroduction = ''
                that.productName = ''
                that.originalPrice = 0
                that.nowPrice = 0
                that.imagePath = []
                wx.navigateTo({
                  url: '../../manager/main'
                })
              }
            }
          })
        } else {
          wx.request({
            url: 'https://xiaochengxu.nibaspace.com/commodity/updateGoods',
            method: 'POST',
            data: {
              id: this.id,
              faceUrl: this.imagePath[0],
              nameStr: this.productName,
              oldPrice: this.originalPrice,
              newPrice: this.nowPrice,
              content: this.productIntroduction
            },
            header: {
              'content-type': 'application/json',
              'Authorization': token// 默认值
            },
            success: function (res) {
              if (res.data.result) {
                that.onLoding('添加商品成功')
                that.files = []
                that.productIntroduction = ''
                that.productName = ''
                that.originalPrice = 0
                that.nowPrice = 0
                that.imagePath = []
                wx.redirectTo({
                  url: '../productlist/main'
                })
              }
            }
          })
        }
      },
      onLoding (s) {
        wx.showLoading({
          title: s
        })
        setTimeout(function () {
          wx.hideLoading()
        }, 1000)
      }
    },
    components: {
      MpUploaderBase,
      MpField,
      Dialog
    }
  }
</script>

<style scoped>
  .wrap{
    display: flex;
    flex-wrap: nowrap;
  }
  .btn {
    width: 90%;
    margin-top: 30rpx;
    background-color: #FFCC00;
    color: #FFF;
  }
</style>
