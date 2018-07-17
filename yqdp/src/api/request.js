import {showToast} from '../utils/index'

export function request (url, type, data) {
  console.log(data)
  return new Promise((resolve, reject) => {
    var token = wx.getStorageSync('token')
    wx.showLoading({title: '玩命加载中...'})
    console.log('https://xiaochengxu.nibaspace.com' + url)
    wx.request({
      url: 'https://xiaochengxu.nibaspace.com' + url,
      method: type,
      data: data,
      header: {'Content-Type': 'application/json', 'Authorization': token
      },
      success: function (res) {
        console.log(res.data)
        if (res.data.result) {
          resolve(res.data)
        } else {
          showToast('发生未知错误!')
          reject(res.data)
        }
      },
      fail: function () {
        showToast('获取数据失败!')
      },
      complete: function () {
        wx.hideLoading()
      }
    })
  })
}
