<template>
  <div>
    <mp-uploader-base
      @onSelect="onUploadImg('1')"
      :file-list="filesLicense"
      title="点击添加营业执照"
      :max="max"
    />
    <mp-uploader-base
      @onSelect="onUploadImg('2')"
      :file-list="IdCardUp"
      title="点击添加身份证正面"
      :max="max"
    />
    <mp-uploader-base
      @onSelect="onUploadImg('3')"
      :file-list="IdCardDown"
      title="点击添加身份证反面"
      :max="max"
    />
    <mp-cell-group title="信息">
      <mp-field
        @change="nameTextChange"
        placeholder="请输入商品名称"
        type="text"
        label="小程序名称"
      />
      <mp-field
        @change="phoneTextChange"
        placeholder="请输入推荐人电话"
        label="推荐人电话"
        type="number"
      />
    </mp-cell-group>
    <button class="mybtn" @click="onAllSubmit">确认上传</button>
  </div>
</template>

<script>
  import MpUploaderBase from 'mp-weui/packages/uploader-base'
  import MpField from 'mp-weui/packages/field'
  import Dialog from 'mp-weui/packages/dialog'
  import {showToast} from '../../utils/index.js'
  export default {
    data () {
      return {
        max: 1,
        filesLicense: [],
        license: '',
        cardUp: '',
        cardDown: '',
        IdCardUp: [],
        IdCardDown: [],
        productName: '',
        phoneNumber: '',
        imagePath: []
      }
    },
    components: {
      MpUploaderBase,
      MpField
    },
    methods: {
      nameTextChange (value) {
        this.productName = value
      },
      phoneTextChange (value) {
        this.phoneNumber = value
      },
      onSelectLicense () {
        wx.chooseImage({
          sizeType: ['original', 'compressed'],
          sourceType: ['album', 'camera'],
          count: this.max,
          success: (res) => {
            this.filesLicense = res.tempFiles
          }
        })
      },
      onUploadImg (type) {
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
            wx.uploadFile({
              url: 'https://xiaochengxu.nibaspace.com/commodity/uploadImage',
              filePath: tempfle[0],
              name: 'file',
              success: function (res) {
                console.log(res)
                if (res.statusCode === 200) {
                  var obj = JSON.parse(res.data)
                  if (obj.result) {
                    console.log(2)
                    that.imagePath[1] = obj.data
                    if (type === '1') {
                      that.filesLicense = temPpath
                      that.license = obj.data
                    } else if (type === '2') {
                      that.IdCardUp = temPpath
                      that.cardUp = obj.data
                    } else if (type === '3') {
                      that.IdCardDown = temPpath
                      that.cardDown = obj.data
                    }
                    showToast('上传成功')
                  } else {
                    showToast('上传失败')
                  }
                }
              }
            })
          }
        })
      },
      onSelectIdCardDown () {
        wx.chooseImage({
          sizeType: ['original', 'compressed'],
          sourceType: ['album', 'camera'],
          count: this.max,
          success: (res) => {
            this.IdCardDown = res.tempFiles
          }
        })
      },
      onSelectIdCardUp () {
        wx.chooseImage({
          sizeType: ['original', 'compressed'],
          sourceType: ['album', 'camera'],
          count: this.max,
          success: (res) => {
            this.IdCardUp = res.tempFiles
          }
        })
      },
      onAllSubmit () {
        var that = this
        console.log(that.license)
        if (that.license === '') {
          Dialog.alert('请上传营业执照')
          return
        }
        if (that.cardUp === '') {
          Dialog.alert('请上传身份证正面')
          return
        }
        if (that.productName === '') {
          Dialog.alert('请上传小程序名称')
          return
        }
        if (that.phoneNumber === '') {
          Dialog.alert('请上传推荐人电话')
          return
        }
        wx.request({
          url: 'https://xiaochengxu.nibaspace.com/commodity/addApp',
          method: 'POST',
          data: {
            license: that.license,
            idCardUp: that.cardUp,
            idCardDown: that.cardDown,
            appName: that.productName,
            referPhone: that.phoneNumber
          },
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            console.log(res.data)
            if (res.data.result) {
              showToast('注册成功！！！')
              wx.navigateTo({
                url: '../index/main'
              })
            } else {
              Dialog.alert('注册失败！！！')
            }
          }
        })
      }
    }
  }
</script>

<style scoped>
.mybtn{
  display: inline-block;
    height: 45px;
    margin-top: 15px;
    text-align: center;
    width: 100%;
    color: black;
    background: #FFCC00;
    line-height: 45px;
    align-items: center;
    border: 1px solid #FFCC00;
    
}

</style>
