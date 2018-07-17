<template>
   <div>
    <h2>修改信息</h2>
    <mp-uploader-base
      @onSelect="onSelect"
      :file-list="files"
      title="添加分享封面图(建议图长宽比5:4)"
      :max="max"
    />
    <mp-cell-group>
      <mp-field
        @change="discountChange"
        placeholder="请输入折扣信息"
        maxlength="100"
        type="textarea"/>
 
      <mp-field
        @change="phoneChange"
        placeholder="请输入手机号"
        maxlength="11"
        type="number"/>
     
       <mp-field
         @change="introductionChange"
         placeholder="请输入店铺简介"
         maxlength="100"
         type="textarea"/>
      <mp-field
        @change="videoChange"
        placeholder="请添加腾讯视频（可选填）"
        type="text"/>
        <mp-field
         @change="shareChange"
         placeholder="请输入首页转发文字"
         maxlength="100"
         type="textarea"/>
         <mp-field
         @change="shareChangeTwo"
         placeholder="请输入二级页面转发文字"
         maxlength="100"
         type="textarea"/>
     </mp-cell-group>
      <button class="btn" @click="onAllSubmit">确认修改</button>
  </div>
</template>

<script>
  import {request} from '../../../api/request'
  import {showToast} from '../../../utils/index'
  import MpField from 'mp-weui/packages/field'
  import MpUploaderBase from 'mp-weui/packages/uploader-base'
  export default {
    data () {
      return {
        userInfo: {},
        files: [],
        imagePath: [],
        max: 1,
        parma: {
          discount: '',
          phone: '',
          introduction: '',
          address: '',
          id: '',
          cover: '',
          videoPath: '',
          shareFirstTitle: '',
          shareSecondTitle: ''
        }
      }
    },
    components: {
      MpField,
      MpUploaderBase
    },
    methods: {
      onSelect () {
        var that = this
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
      videoChange (value) {
        this.parma.videoPath = value
      },
      discountChange (value) {
        this.parma.discount = value
      },
      phoneChange (value) {
        this.parma.phone = value
      },
      introductionChange (value) {
        this.parma.introduction = value
      },
      shareChange (value) {
        this.parma.shareFirstTitle = value
      },
      shareChangeTwo (value) {
        this.parma.shareSecondTitle = value
      },
      onLoding (s) {
        wx.showLoading({
          title: s
        })
        setTimeout(function () {
          wx.hideLoading()
        }, 1000)
      },
      async onAllSubmit () {
        this.parma.cover = this.imagePath[0]
        this.parma.id = wx.getStorageSync('appId')
        if (this.parma.phone !== '') {
          var reg = 11 && /^((13|14|15|17|18)[0-9]{1}\d{8})$/
          if (!reg.test(this.parma.phone)) {
            showToast('请输入正确的手机号')
            return
          }
        }
        const res = await request('/commodity/editApp', 'POST', this.parma)
        if (res.result) {
          showToast('修改成功')
          wx.navigateTo({
            url: '../../manager/main'
          })
        }
      }
    }
  }
</script>

<style scoped>
  .input{
    height: 100px;
    width: 100%;
    margin-top: 10px;
  }
  mp-field{
     border: 1px solid #FFCC00;
  }

  h2{
    height: 40px;
    width: 100%;
    line-height: 50px;
    text-align: center;
    background: white;
  }
  .behave-input {
    width: 100%;
    height: 50px;
    margin: 20px;
    margin-top: 40px
  }
 .myinput{
    margin-top: 40px
  }
  .btn {
    margin-top: 50px;
    background: #FFCC00
  }
</style>
