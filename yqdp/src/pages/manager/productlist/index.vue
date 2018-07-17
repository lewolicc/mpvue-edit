<template>
  <div class="container">
    <ul>
      <li class="list-item" v-for="(item, index) in todoList" :key="index">
        <div class="detail">
          <div class="detail-user"  @click="onDetail(item.id)">
          <img :src="item.faceUrl" alt="" :onerror="errorImg">
          </div>
          <span class="title"  @click="onDetail(item.id)">{{item.nameStr}}</span>
          <div class="change-btn">
            <div class="botton" @click="onDelete(item.id)">删除</div>
            <div class="botton-black" @click="editChange(item.id)">修改</div>
          </div>
          <div class="change-btn">
             <div class="botton" @click="changeTop(index)">向上移</div>
             <div class="botton-black" @click="changeBottom(index)">向下移</div>
          </div>
        </div>
      </li>
    </ul>
    <button @click="updateOrder">上传当前列表顺序</button>
  </div>
</template>

<script>
  import {showToast} from '../../../utils/index.js'
  export default {
    onLoad () {
      this.getdata()
    },
    data () {
      return {
        startX: 0,
        endX: 0,
        errorImg: '../../../../static/images/icon_img.png',
        parmas: {
          appId: ''
        },
        todoList: []
        // sortGoods: {
        //   sortNo: 0,
        //   goodsId: ''
        // }
      }
    },
    // onReachBottom () {
    //   this.loadmore()
    // },
    onPullDownRefresh () {
      this.refresh()
    },
    methods: {
      onAllSubmit () {
        console.log(123)
      },
      onDetail (id) {
        wx.navigateTo({
          url: '../productChange/main?id=' + id
        })
      },
      editChange (id) {
        wx.redirectTo({
          url: '../addproduct/main?id=' + id
        })
      },
      changeTop (index) {
        var mylist = []
        if (index > 0) {
          var top = this.todoList[index]
          var bottom = this.todoList[index - 1]
          mylist = this.todoList
          mylist[index - 1] = top
          mylist[index] = bottom
          this.todoList = []
          this.todoList = mylist
        }
      },
      changeBottom (index) {
        var mylist = []
        if (this.todoList.length > index + 1) {
          var top = this.todoList[index]
          var bottom = this.todoList[index + 1]
          mylist = this.todoList
          mylist[index + 1] = top
          mylist[index] = bottom
          this.todoList = []
          this.todoList = mylist
        }
      },
      async refresh () {
        this.getdata()
        wx.stopPullDownRefresh()
      },
      async onDelete (id) {
        var that = this
        var token = wx.getStorageSync('token')
        wx.showModal({
          title: '是否删除？',
          confirmText: '删除',
          cancelText: '取消',
          success: function (res) {
            if (res.confirm) {
              wx.request({
                url: 'https://xiaochengxu.nibaspace.com/commodity/deleteGoods',
                method: 'POST',
                data: id,
                header: {
                  'content-type': 'application/json', // 默认值
                  'Authorization': token
                },
                success: function (res) {
                  console.log(res.data)
                  if (res.data.result) {
                    showToast('删除成功')
                    that.refresh()
                  } else {
                  }
                }
              })
            }
          }
        })
      },
      updateOrder () {
        var token = wx.getStorageSync('token')
        var sortList = []
        var index = 1
        this.todoList.forEach(item => {
          var sortGoods = {
            sortNo: 0,
            goodsId: ''
          }
          sortGoods.goodsId = item.id
          sortGoods.sortNo = index
          sortList.push(sortGoods)
          index++
        })
        console.log(sortList)
        wx.request({
          url: 'https://xiaochengxu.nibaspace.com/commodity/sortGoods',
          method: 'POST',
          data: {
            sortGoodsList: sortList
          },
          header: {
            'content-type': 'application/json', // 默认值
            'Authorization': token
          },
          success: function (res) {
            console.log(res.data)
            if (res.data.result) {
              console.log('排序成功')
              showToast('排序成功')
            } else {
            }
          }
        })
      },
      getdata () {
        var that = this
        var token = wx.getStorageSync('token')
        var appId = wx.getStorageSync('appId')
        wx.request({
          url: 'https://xiaochengxu.nibaspace.com/commodity/listGoods',
          method: 'POST',
          data: appId,
          header: {
            'content-type': 'application/json', // 默认值
            'Authorization': token
          },
          success: function (res) {
            console.log(res.data)
            if (res.data.result) {
              that.todoList = res.data.data
            } else {
            }
          }
        })
      }
    }
  }
</script>

<style scoped>

button {
    background: #FFCC00;
    width: 100%;
    height: 45px;
    font-size: 16px;
    margin-top: 40px;
    bottom: 0;
    line-height: 45px

  }
ul{
  height: 100%;
  width: 100%;
}
li {
  height: 85px;
  width: 100%;
  border-bottom: 1px solid #f5f5f5;
}
.title{
  text-overflow: ellipsis
}
span{
  flex: 1;
  position: relative;
  text-align: center;
  color: #393939;
  height: 85px;
  line-height: 85px;
  overflow: hidden; 
  text-overflow: ellipsis; 
  -o-text-overflow: ellipsis;
  white-space:nowrap;
  display:block;
}
.detail {
      height: 85px;
      width: 100%;
      display: flex;
}
.detail-user {
  width: 80px;
  height: 80px;
  overflow: hidden;
}
img {
  width: 50px;
  height: 50px;
  margin-top: 15px;
  float: right;
  border-radius: 50%
}
.detail-btn {
  width: 60px;
  height: 100%;
  overflow: hidden;
  margin-right: 30px;
  align-items: center;
  display: flex;
  align-items: center;
}
.btn {
    width: 60px;
    height: 24px;
    line-height: 24px;
    text-align: center;
    font-size: 13px;
    border: 1px solid #FFCC00;
    color: black;
  }
  .change-btn{
    width: 60px;
    height: 100%;
    margin-right: 30px;

  }
  .botton {
    width: 60px;
    height: 24px;
    line-height: 24px;
    margin-top: 15px;
    text-align: center;
    font-size: 13px;
    background: #FFCC00;
    color: black;
  }
  .botton-black {
    width: 60px;
    height: 24px;
    line-height: 24px;
    margin-top: 15px;
    text-align: center;
    font-size: 13px;
    background: white;
    border: 1px solid #FFCC00;
    color: black;
  }
  .container {
    height: 100%;
    width: 100%;
    /* .ul {
      .li {
        height: 55px;
        width: 100%;
        border-bottom: 1px solid #f5f5f5;
        .detail {
          height: 55px;
          width: 100%;
          display: flex;
          .detail-user {
            width: 65px;
            height: 50px;
            overflow: hidden;
            img {
              width: 50px;
              height: 50px;
            }
          }
          span {
            flex: 1;
            position: relative;
            text-align: center;
            color: #393939;
            height: 55px;
            line-height: 55px;
          }

          .detail-btn {
            width: 60px;
            height: 100%;
            overflow: hidden;
            margin-right: 30px;
            align-items: center;
            display: flex;
            align-items: center;
            .btn {
              width: 60px;
              height: 24px;
              line-height: 24px;
              border-radius: 5px;
              text-align: center;
              font-size: 13px;
              border: 1px solid red;
              color: red;
            }

          }
        }
      } */
    /* } */
  }
</style>
