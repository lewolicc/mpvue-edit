<template>
  <div> 
      <mp-uploader-base
        @onSelect="onSelectBanner"
        :file-list="files"
        title="点击添加详情图片"
        :max="max"
        />
        <div class="input">
          <input type="text" placeholder="请输入详情信息" v-model="content">
        </div>  
        <button @click="submit">确认修改</button>
  </div>
</template>
<script>
  import Dialog from 'mp-weui/packages/dialog'
  import MpUploaderBase from 'mp-weui/packages/uploader-base'
  import MpField from 'mp-weui/packages/field'
  export default {
    data () {
      return {
        id: '',
        bizId: '',
        aboutId: '',
        max: 1,
        content: '',
        details: [],
        files: [],
        imagePath: [],
        albumList: []
      }
    },
    onLoad: function (options) {
      this.albumList = options.id.split(',')
      this.id = this.albumList[0]
      this.bizId = this.albumList[1]
    },
    mounted () {
    },
    components: {
      MpUploaderBase,
      MpField,
      Dialog
    },
    methods: {
      onSelectBanner () {
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
      submit () {
        if (this.content === '' || this.content === null) {
          Dialog.alert('请输入详情信息')
          return
        }
        if (this.imagePath[0] === '' || this.imagePath[0] === null) {
          Dialog.alert('请选择图片')
          return
        }
        var that = this
        // var token = wx.getStorageSync('token')
        wx.request({
          url: 'https://xiaochengxu.nibaspace.com/commodity/updateDetail',
          method: 'POST',
          data: {
            id: this.id,
            bizUrl: this.imagePath[0],
            bizDesc: this.content
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {
            console.log(res)
            if (res.data.result) {
              that.onLoding('更新成功')
              that.content = ''
              that.files = []
              // wx.navigateBack({ changed: true })
              wx.navigateTo({
                url: '../bannerChange/main?id=' + that.bizId
              })
            } else {
              that.onLoding('更新失败')
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
 p {
    margin-top: 25px;
}

button {
    margin-top: 10px;
    background: #FFCC00
  }


</style>
