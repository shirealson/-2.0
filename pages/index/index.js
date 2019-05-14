//index.js
//获取应用实例
var WxSearch = require('../../wxSearch/wxSearch.js')
var app = getApp()
Page({
  data: {
    group: [
      {id : 0, name : "xxx"},
      { id: 1, name: "xxx" },
      { id: 2, name: "xxx" },
      { id: 3, name: "xxx" },
      { id: 4, name: "xxx" },
      { id: 5, name: "xxx" },
      { id: 6, name: "xxx" },
      { id: 7, name: "xxx" },
      { id: 8, name: "xxx" },
      { id: 9, name: "xxx" }
    ],
    imgarray: [
    ],
    current_group:{id:0,name: "xxx"},
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
    wx.login({
      success: function (res) {
        console.log(res.code)

        //发送请求
        wx.request({
          url: 'https://www.myworkroom.cn:5000/getopenid', //接口地址
          data: {'code' : res.code},
          header: {
            'content-type': 'application/x-www-form-urlencoded' //默认值
          },
          method: "POST",
          success: function (res) {
            console.log(res.data)
            getApp().globalData.openid = res.data.openid;
            console.log(getApp().globalData.openid);
          }
        })
      }
    })
    //初始化的时候渲染wxSearchdata
    WxSearch.init(that, 43, ['tatan', '金馆长', '脆皮鹦鹉', '可达鸭', '汪蛋']);
    WxSearch.initMindKeys(['666', '微信小程序开发', '微信开发', '微信小程序']);
    //获取groupid
    that.getRandom();
    
  },
  getRandom: function () {
    var that = this;
    wx.request({
      url: "https://www.myworkroom.cn:5000/getrandom",
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded' //默认值
      },
      success: function (res) {
        for(var i=0;i<10;i++){
          var string1 = "group[" + i + "].id";
          var string2 = "group[" + i + "].name";
          if (res.data.data[i].template_name.length > 4){
            res.data.data[i].template_name = res.data.data[i].template_name.substring(0, 4) + "...";
          }//自动省略
          that.setData({
            [string1]: res.data.data[i].template_id,
            [string2]: res.data.data[i].template_name
          });
        }
      }
    })
  },
  onShareAppMessage: function () {
    return {
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
  },
  wxSearchFn: function (e) {
    var that = this;
    
    var text = that.data.text;
    
    wx.request
      ({
        url: 'https://www.myworkroom.cn:5000/search', //接口地址
        data: {'openid' : '123456',
                'sentence' : text},
        header: {
          'content-type': 'application/x-www-form-urlencoded' //默认值
        },
        method: "POST",
        success: function (res) {
          console.log(res.data)

        }
      });
  },
  wxSearchInput: function (e) {
    var that = this
    WxSearch.wxSearchInput(e, that);
    that.setData({
      text: e.detail.value
    })
  },
  wxSerchFocus: function (e) {
    var that = this
    WxSearch.wxSearchFocus(e, that);
  },
  wxSearchBlur: function (e) {
    var that = this
    WxSearch.wxSearchBlur(e, that);
  },
  wxSearchKeyTap: function (e) {
    var that = this
    WxSearch.wxSearchKeyTap(e, that);
  },
  wxSearchDeleteKey: function (e) {
    var that = this
    WxSearch.wxSearchDeleteKey(e, that);
  },
  wxSearchDeleteAll: function (e) {
    var that = this;
    WxSearch.wxSearchDeleteAll(that);
  },
  wxSearchTap: function (e) {
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
  
  change_group : function(event){
    var that = this;
    var id=event.currentTarget.dataset.gid;
    var name = event.currentTarget.dataset.name;
    that.setData({
      'current_group.id' : id,
      'current_group.name' : name
    });

    wx.request
      ({
        url: 'https://www.myworkroom.cn:5000/getgroup', //接口地址
        data: { 'template_id': id,
                'openid' : '123456' },
        header: {
          'content-type': 'application/x-www-form-urlencoded' //默认值
        },
        method: "POST",
        success: function (res) {
          that.setData({
            imgarray : res.data.group
          });
        }
      })
  }

})
