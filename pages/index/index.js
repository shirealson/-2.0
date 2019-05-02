//index.js
//获取应用实例
var WxSearch = require('../../wxSearch/wxSearch.js')
var app = getApp()
Page({
  data: {
    group1: { id: 0, name: "一" },
    group2: { id: 0, name: "一" },
    group3: { id: 0, name: "一" },
    group4: { id: 0, name: "一" },
    group5: { id: 0, name: "一" },
    group6: { id: 0, name: "一" },
    group7: { id: 0, name: "一" },
    group8: { id: 0, name: "一" },
    leftHeight: 0,
    rightHeight: 0,
    length: 10,
    pageNo: 1,
    descHeight: 30, //图片文字描述的高度
    pageStatus: true,
    text: '',
    // wxSearchData:{
    //   view:{
    //     isShow: true
    //   }
    // }
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this
    //初始化的时候渲染wxSearchdata
    WxSearch.init(that,43,['tatan','金馆长','脆皮鹦鹉','可达鸭','汪蛋']);
    WxSearch.initMindKeys(['666','微信小程序开发','微信开发','微信小程序']);
//获取groupid
    wx.request({
      url: "https://",
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded' //默认值
      },
      success: function (res) {

        group1.id=res.data.group1.id;
        group1.name=res.data.group1.name;
        group2.id = res.data.group2.id;
        group2.name = res.data.group2.name;
        group3.id = res.data.group3.id;
        group3.name = res.data.group3.name;
        group4.id = res.data.group4.id;
        group4.name = res.data.group4.name;
        group5.id = res.data.group5.id;
        group5.name = res.data.group5.name;
        group6.id = res.data.group6.id;
        group6.name = res.data.group6.name;
        group7.id = res.data.group7.id;
        group7.name = res.data.group7.name;
        group8.id = res.data.group8.id;
        group8.name = res.data.group8.name;
      } 
    })
  },
  getRandom:function(){
    wx.request({
      url: "https://",
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded' //默认值
      },
      success: function (res) {

        group1.id = res.data.group1.id;
        group1.name = res.data.group1.name;
        group2.id = res.data.group2.id;
        group2.name = res.data.group2.name;
        group3.id = res.data.group3.id;
        group3.name = res.data.group3.name;
        group4.id = res.data.group4.id;
        group4.name = res.data.group4.name;
        group5.id = res.data.group5.id;
        group5.name = res.data.group5.name;
        group6.id = res.data.group6.id;
        group6.name = res.data.group6.name;
        group7.id = res.data.group7.id;
        group7.name = res.data.group7.name;
        group8.id = res.data.group8.id;
        group8.name = res.data.group8.name;
      }
    })
 },
  onShareAppMessage: function () {
    return{
      title: "斗图大师",
      desc: "斗图大师",
     // path: '/pages/home/home?id=' + this.data.pageId,
      imageUrl: '../../images/2.jpg'
    }
  },
  onShow: function () {
    this.setData({
      list2: this.data.list
    });
  },
  loadImage: function (e) {
    var vm = this;
    var windowWidth = wx.getSystemInfoSync().windowWidth;
    var index = e.currentTarget.dataset.index;
    vm.data.list[index].height = windowWidth / 2 / e.detail.width * e.detail.height;
    var count = 0;
    for (var i = (vm.data.pageNo - 1) * vm.data.length; i < vm.data.list.length; i++) {
      if (vm.data.list[i].height) {
        count++;
      }
    }
    if (count == vm.data.length) {
      for (var i = (vm.data.pageNo - 1) * vm.data.length; i < vm.data.list.length; i++) {
        if (vm.data.leftHeight <= vm.data.rightHeight) {
          vm.data.list[i].top = vm.data.leftHeight;
          vm.data.list[i].left = windowWidth * 0.005;
          vm.setData({
            leftHeight: vm.data.leftHeight + vm.data.list[i].height + vm.data.descHeight
          });
        } else {
          vm.data.list[i].top = vm.data.rightHeight;
          vm.data.list[i].left = windowWidth / 2 - windowWidth * 0.005;
          vm.setData({
            rightHeight: vm.data.rightHeight + vm.data.list[i].height + vm.data.descHeight
          });
        }
      }
      vm.setData({
        list: vm.data.list
      });
    }
  },
  onReachBottom: function () {
    var vm = this;
    vm.setData({
      pageStatus: true
    });
    setTimeout(function () {
      vm.setData({
        pageNo: vm.data.pageNo + 1,
        list: vm.data.list.concat(vm.data.list2),
        pageStatus: false
      });
    }, 2000);
  },
  wxSearchFn: function(e){
    var that = this
    WxSearch.wxSearchAddHisKey(that);
    console.log(wxSearchData.value);

    wx.request
      ({
        url: 'https:', //接口地址
        data: { text },
        header: {
          'content-type': 'application/x-www-form-urlencoded' //默认值
        },
        method: "POST",
        success: function (res) {
          console.log(res.data)
              wx.redirectTo({
                url: '../searchResult/searchResult'
              })
        }
      })
  },
  wxSearchInput: function(e){
    var that = this
    WxSearch.wxSearchInput(e,that);
    that.setData({
      text:e.detail.value
    })
  },
  wxSerchFocus: function(e){
    var that = this
    WxSearch.wxSearchFocus(e,that);
  },
  wxSearchBlur: function(e){
    var that = this
    WxSearch.wxSearchBlur(e,that);
  },
  wxSearchKeyTap:function(e){
    var that = this
    WxSearch.wxSearchKeyTap(e,that);
  },
  wxSearchDeleteKey: function(e){
    var that = this
    WxSearch.wxSearchDeleteKey(e,that);
  },
  wxSearchDeleteAll: function(e){
    var that = this;
    WxSearch.wxSearchDeleteAll(that);
  },
  wxSearchTap: function(e){
    var that = this
    WxSearch.wxSearchHiddenPancel(that);
  },
  // 获取滚动条当前位置
  onPageScroll: function (e) {
    console.log(e)
    if (e.scrollTop > 100) {
      this.setData({
        floorstatus: true
      });
    } else {
      this.setData({
        floorstatus: false
      });
    }
  },

  //回到顶部
  goTop: function (e) {  // 一键回到顶部
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 0
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },

})
