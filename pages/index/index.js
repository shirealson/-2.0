//index.js
//获取应用实例
var WxSearch = require('../../wxSearch/wxSearch.js')
var app = getApp()
Page({
    data: {
        url: "",//请求地址
        group: [
            { id: 0, name: "xxx", full_name: "xxx" },
            { id: 1, name: "xxx", full_name: "xxx" },
            { id: 2, name: "xxx", full_name: "xxx" },
            { id: 3, name: "xxx", full_name: "xxx" },
            { id: 4, name: "xxx", full_name: "xxx" },
            { id: 5, name: "xxx", full_name: "xxx" },
            { id: 6, name: "xxx", full_name: "xxx" },
            { id: 7, name: "xxx", full_name: "xxx" },
            { id: 8, name: "xxx", full_name: "xxx" },
            { id: 9, name: "xxx", full_name: "xxx" }
        ],
        imgarray: [
        ],
        noImage_notice: false,//是否提示无图片
        current_group: { id: 0, name: "xxx" },
        leftHeight: 0,
        rightHeight: 0,
        length: 10,
        pageNo: 1,
        descHeight: 30, //图片文字描述的高度
        pageStatus: true,
        text: '',
        aibox: false
        // wxSearchData:{
        //   view:{
        //     isShow: true
        //   }
        // }
    },
    onLoad: function () {
        this.setData({
            url: app.globalData.url
        });
        wx.showLoading({
            title: "登录中"
        });
        console.log('onLoad')
        var that = this
        wx.login({
            success: function (res) {
                console.log(res.code)
                //发送请求
                wx.request({
                    url: app.globalData.url + '/getopenid', //接口地址
                    data: { 'code': res.code },
                    header: {
                        'content-type': 'application/x-www-form-urlencoded' //默认值
                    },
                    method: "POST",
                    success: function (res) {
                        console.log(res.data)
                        getApp().globalData.openid = res.data.openid;
                        console.log(getApp().globalData.openid);
                        wx.hideLoading();//关闭提示
                    }
                })
            }
        })
        //初始化的时候渲染wxSearchdata
        WxSearch.init(that, 43, ['tatan', '金馆长', '脆皮鹦鹉', '可达鸭', '汪蛋']);
        WxSearch.initMindKeys(['666', '微信小程序开发', '微信开发', '微信小程序']);
        //获取groupid
        that.getRandom(function(){
            var id = that.data.group[0].id;
            var name = that.data.group[0].full_name;;
            that.setData({
                'current_group.id': id,
                'current_group.name': name,
                aibox: false

            });
            wx.showLoading({
                title: "加载分组中"
            });
            wx.request
                ({
                    url: app.globalData.url + '/getgroup', //接口地址
                    data: {
                        'template_id': id,
                        'openid': getApp().globalData.openid
                    },
                    header: {
                        'content-type': 'application/x-www-form-urlencoded' //默认值
                    },
                    method: "POST",
                    success: function (res) {
                        that.setData({
                            imgarray: res.data.group
                        });

                        for (var i = 0; i < that.data.imgarray.length; i++) {//更新sentence，如果没有sentence,用template_name顶替
                            if (that.data.imgarray[i].sentence == null) {
                                var string = "imgarray[" + i + "].sentence";
                                that.setData({
                                    [string]: that.data.current_group.name
                                });
                            }
                        }
                        wx.hideLoading();//关闭提示
                    }
                })
        });
        //加载第一个分组图片
        



    },
    getRandom: function (callback=null) {//可以接收一个回调函数
        wx.showLoading({
            title: '加载中',
        })
        var that = this;
        that.setData({
            aibox: false
        });
        wx.request({
            url: app.globalData.url + "/getrandom",
            method: 'GET',
            header: {
                'content-type': 'application/x-www-form-urlencoded' //默认值
            },
            success: function (res) {
                for (var i = 0; i < 10; i++) {
                    var string1 = "group[" + i + "].id";
                    var string2 = "group[" + i + "].name";
                    var string3 = "group[" + i + "].full_name";
                    
                    if (res.data.data[i].template_name.length > 4) {
                        that.setData({
                            [string1]: res.data.data[i].template_id,
                            [string2]: res.data.data[i].template_name.substring(0, 4) + "...",
                            [string3]: res.data.data[i].template_name
                        });
                        
                    }//自动省略
                    else{
                        that.setData({
                            [string1]: res.data.data[i].template_id,
                            [string2]: res.data.data[i].template_name,
                            [string3]: res.data.data[i].template_name
                        });
                    }
                    
                    
                }
                wx.hideLoading();//关闭提示
                if(callback != null)
                    callback();
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
        if(text != "" && text != null){//防止为空
            wx.request
                ({
                    url: app.globalData.url + '/search', //接口地址
                    data: {
                        'openid': getApp().globalData.openid,
                        'sentence': text
                    },
                    header: {
                        'content-type': 'application/x-www-form-urlencoded' //默认值
                    },
                    method: "POST",
                    success: function (res) {
                        console.log(res.data)

                        if (res.data.data.length == 0) {
                            that.setData({
                                imgarray: res.data.data,
                                noImage_notice: true//显示无图提示
                            });
                        }
                        else {
                            that.setData({
                                imgarray: res.data.data,
                                noImage_notice: false//关闭无图提示
                            });
                            for (var i = 0; i < that.data.imgarray.length; i++) {//更新sentence，如果没有sentence,用template_name顶替

                                if (that.data.imgarray[i].sentence == null) {
                                    var string = "imgarray[" + i + "].sentence";
                                    that.setData({
                                        [string]: that.data.imgarray[i].template_name
                                    });
                                }


                            }

                        }
                    }
                });
        }
        else{
            wx.showToast({
                title: '请输入搜索词',
                mask:true
            });
        }
        
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

    change_group: function (event) {

        wx.showLoading({
            title: '加载中',
        })
        var that = this;
        var id = event.currentTarget.dataset.gid;
        var name = event.currentTarget.dataset.name;
        that.setData({
            'current_group.id': id,
            'current_group.name': name,
            aibox: false,
            noImage_notice:false

        });

        wx.request
            ({
                url: app.globalData.url + '/getgroup', //接口地址
                data: {
                    'template_id': id,
                    'openid': getApp().globalData.openid
                },
                header: {
                    'content-type': 'application/x-www-form-urlencoded' //默认值
                },
                method: "POST",
                success: function (res) {
                    that.setData({
                        imgarray: res.data.group
                    });
                    for (var i = 0; i < that.data.imgarray.length; i++) {//更新sentence，如果没有sentence,用template_name顶替
                        if (that.data.imgarray[i].sentence == null) {
                            var string = "imgarray[" + i + "].sentence";
                            that.setData({
                                [string]: that.data.current_group.name
                            });
                        }
                    }
                    wx.hideLoading();//关闭提示
                }
            })
    },
    

    like: function (event) {
        wx.showLoading({
            title: '加载中',
        })
        var that = this
        var imgid = event.currentTarget.dataset.imgid;
        var flag = event.currentTarget.dataset.num;

        var flag1 = "imgarray[" + flag + "].like";
        //console.log("flag" + flag);
        //console.log("flag" + imgid);
        wx.request
            ({
                url: app.globalData.url + '/like', //接口地址
                data: {
                    'imageid': imgid,
                    'openid': getApp().globalData.openid
                },
                header: {
                    'content-type': 'application/x-www-form-urlencoded' //默认值
                },
                method: "POST",
                success: function (res) {
                    that.setData({
                        [flag1]: true,

                    });
                    wx.hideLoading();//关闭提示
                }
            })
    },
    unlike: function (event) {
        var that = this
        var imgid = event.currentTarget.dataset.imgid;
        var flag = event.currentTarget.dataset.num;

        var flag1 = "imgarray[" + flag + "].like";
        console.log("flag" + flag);
        wx.request
            ({
                url: app.globalData.url + '/unlike', //接口地址
                data: {
                    'imageid': imgid,
                    'openid': getApp().globalData.openid
                },
                header: {
                    'content-type': 'application/x-www-form-urlencoded' //默认值
                },
                method: "POST",
                success: function (res) {
                    that.setData({
                        [flag1]: false,

                    });

                }
            })
    },
    previewImg: function (e) {
        var current = e.target.dataset.src;
        wx.previewImage({
            urls: [current],
        })
    }

})
