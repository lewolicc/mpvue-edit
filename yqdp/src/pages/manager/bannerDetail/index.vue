<template>
  <div> 
    <div v-show="isShowAdd">
       <div>
            <button @click="onAddDetail">添加一个条信息</button>
            <button @click="onSubmit">确认上传</button>
        </div>
        <ul>
        <li class="list-item" v-for="(item, index) in details" :key="index">
            <div class="content">
              <img :src="item.bizUrl" alt="">
              <div class="detail-btn">
                  <p>{{item.desc}}</p>
              </div>
            </div>
        </li>
        </ul>
    </div>
    <div v-show="!isShowAdd">
      <mp-uploader-base
        @onSelect="onSelectBanner"
        :file-list="files"
        title="点击添加详情图片"
        :max="max"
        />
        <div class="input">
          <input type="text" placeholder="请输入详情信息" v-model="content">
        </div>
        <div>
            <button @click="onAddList">添加</button>
            <button @click="onCancle">取消</button>
        </div>

    </div>
  </div>
</template>
<script>
  import Dialog from 'mp-weui/packages/dialog'
  import MpUploaderBase from 'mp-weui/packages/uploader-base'
  import {showToast} from '../../../utils/index'
  import MpField from 'mp-weui/packages/field'
  export default {
    data () {
      return {
        id: '',
        max: 1,
        content: '',
        details: [],
        files: [],
        isShowAdd: true,
        imagePath: []
      }
    },
    onLoad: function (option) {
      this.id = option.id
      this.details = []
    },
    mounted () {
    },
    components: {
      MpUploaderBase,
      MpField,
      Dialog
    },
    methods: {
      addDeatail () {
        wx.navigateTo({
          url: '../bannerDetail/main'
        })
      },
      // contentChange (value) {
      //   this.content = value
      // },
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
      onAddDetail () {
        this.isShowAdd = false
      },
      onAddList () {
        if (this.content === '' || this.content === null) {
          Dialog.alert('请输入详情信息')
          return
        }
        if (this.imagePath[0] === '' || this.imagePath[0] === null) {
          Dialog.alert('请选择图片')
          return
        }
        let detailItem = {
          bizUrl: this.imagePath[0],
          desc: this.content
        }
        this.details.push(detailItem)
        showToast('添加成功')
        this.isShowAdd = true
        this.imagePath = []
        this.files = []
        this.content = ''
        console.log(this.details)
      },
      onCancle () {
        showToast('取消添加添加')
        this.isShowAdd = true
      },
      onSubmit () {
        var that = this
        var token = wx.getStorageSync('token')
        wx.request({
          url: 'https://xiaochengxu.nibaspace.com/commodity/addBannerDetailList',
          method: 'POST',
          data: {
            bizId: this.id,
            details: this.details
          },
          header: {
            'content-type': 'application/json', // 默认值
            'Authorization': token// 默认值
          },
          success: function (res) {
            console.log(res)
            if (res.data.result) {
              that.details = []
              that.onLoding('上传成功')
              wx.navigateTo({
                url: '../bannerChange/main?id=' + that.id
              })
            } else {
              that.onLoding('上传失败')
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

</style>
