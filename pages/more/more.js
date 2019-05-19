// pages/more/more.js
var app = getApp();
var WxSearch = require('../../wxSearch/wxSearch.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        url: "", //请求地址
        openid: "more_openid",
        hasUserInfo: false,
        pic_num : 0,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        search_value: "",
        img_title: "",
        image_array: "",//存放图片数组
        noImage_notice: false,//是否提示无图片
        tempImgs: [{
            url:"",
            msg:""
        }],//临时图片地址数组
        picPaths: [],//网络路径
        tipSwitch:false,//非表情包提示框开关
        noMemeArray:[]//存放着非表情包的路径
        


    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this;
        that.setData({
            openid: app.globalData.openid,
            url: app.globalData.url
        });
        console.log("openid:" + that.data.openid);

        wx.showLoading({
            title: '加载个人信息中',
        });
        wx.request({
            url: app.globalData.url + '/likelst',
            data: {
                'openid': that.data.openid
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded' //默认值
            },
            method: "POST",
            success: function(res) {
                var result = res.data;
                console.log(res.data);
                if (result.success == 0) {
                    
                    that.setData({
                        noImage_notice: true, //显示无图信息
                        image_array:[],
                        pic_num: 0,
                    });
                } else {
                    that.setData({
                        image_array: result.data, 
                        pic_num : result.data.length,
                        noImage_notice: false//关闭无图显示
                    });
                    that.get_img_sentence();//写入sentence
                }
                wx.hideLoading();

            }
        });

        //----获取头像授权部分
        if (app.globalData.userInfo) {
            this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true
            })
        } else if (this.data.canIUse) {
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            app.userInfoReadyCallback = res => {
                this.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true
                })
            }
        } else {
            // 在没有 open-type=getUserInfo 版本的兼容处理
            wx.getUserInfo({
                success: res => {
                    app.globalData.userInfo = res.userInfo
                    this.setData({
                        userInfo: res.userInfo,
                        hasUserInfo: true
                    })
                }
            })
        }

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        this.refreshImage(); //刷新页面
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    },

    refreshImage: function() { //获取当前用户的图片数组，用于刷新个人空间
        var that = this;
        wx.showLoading({
            title: '加载个人信息中',
        });
        wx.request({
            url: app.globalData.url + '/likelst',
            data: {
                'openid': that.data.openid
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded' //默认值
            },
            method: "POST",
            success: function(res) {
                var result = res.data;
                console.log(res.data);
                if (result.success == 0) {
                    that.setData({
                        noImage_notice: true, //显示无图信息
                        image_array:[],
                        pic_num: 0,
                    });
                } else {

                    that.setData({
                        image_array: result.data, //关闭无图信息
                        pic_num: result.data.length,
                        noImage_notice : false
                    });
                    that.get_img_sentence();//写入sentence
                    
                }
                wx.hideLoading();

            }
        })

    },
    get_img_sentence(){//用来得到每张图片的sentence
        var that = this;
        for (var i = 0; i < that.data.image_array.length; i++) {//更新sentence，如果没有sentence,用template_name顶替

            if (that.data.image_array[i].sentence == null || that.data.image_array[i].sentence == "") {
                var string = "image_array[" + i + "].sentence";
                that.setData({
                    [string]: that.data.image_array[i].template_name
                });
            }


        }
    },

    wxSearchInput: function(e) {
        this.setData({
            search_value: e.detail.value
        });
        console.log(this.data.search_value);
    },

    wxSearchFn: function() {
        var that = this;
        if (that.data.search_value != null && that.data.search_value != ""){
            wx.showLoading({
                title: '搜索中',
            });
            wx.request({
                url: app.globalData.url + '/search', //接口地址
                data: {
                    'openid': that.data.openid,
                    'sentence': that.data.search_value
                },
                header: {
                    'content-type': 'application/x-www-form-urlencoded' //默认值
                },
                method: "POST",
                success: function (res) {
                    console.log(res.data);
                    var result = res.data.data;
                    if (result.length == 0) {
                        that.setData({
                            noImage_notice: true//如果搜索无结果，显示提示
                        });
                    }
                    else {
                        that.setData({
                            image_array: result
                        });
                        that.get_img_sentence();//写入sentence
                        var false_num = 0;
                        for (var i = 0; i < result.length; i++) {//另一种情况，统计结果中没有收藏的个数
                            if (result[i].like == false) {
                                false_num++;
                            }
                        }
                        if (false_num == result.length) {//如果都是不喜欢的，结果也是空

                            that.setData({
                                noImage_notice: true
                            });
                        }
                        else
                            that.setData({
                                noImage_notice: false
                            });
                    }

                    wx.hideLoading();

                }

            });
        }
        else{
            wx.showToast({
                title: '请输入搜索词',
                duration: 2000,
                mask:true
            })
        }
        
    },
    unlike: function(event) {
        var that = this
        var imgid = event.currentTarget.dataset.imgid;
        var flag = event.currentTarget.dataset.num;

        var flag1 = "imgarray[" + flag + "].like";
        console.log("flag" + flag);
        wx.showModal({
            title: "删除表情",
            content: "确定要删除这个表情吗？",
            confirmColor: "#FF0000",
            success: function(res) {
                if (res.confirm) { //用户点击确定
                    wx.request({
                        url: app.globalData.url + '/unlike', //接口地址
                        data: {
                            'imageid': imgid,
                            'openid': app.globalData.openid
                        },
                        header: {
                            'content-type': 'application/x-www-form-urlencoded' //默认值
                        },
                        method: "POST",
                        success: function(res) {
                            that.setData({
                                [flag1]: false,
                            });
                            that.refreshImage(); //刷新空间

                        }
                    })
                } else if (res.cancel) {
                    console.log("取消删除表情");
                }

            }
        })

    },
    //上传图片相关代码
    chooseImageTap: function () {
        var that = this;
        that.setData({
            tempImgs:[],
            picPaths:[],
            noMemeArray:[]
        });//上传前先清空所有临时变量
        wx.showActionSheet({
            itemList: ['从相册中选择', '拍照'],
            itemColor: "#00000",
            success: function (res) {
                if (!res.cancel) {
                    if (res.tapIndex == 0) {
                        that.chooseWxImage('album')
                    } else if (res.tapIndex == 1) {
                        that.chooseWxImage('camera')
                    }
                }
            }
        })
    },
    // 图片本地路径
    chooseWxImage: function (type) {
        var that = this;
        var imgsPaths = that.data.imgs;
        wx.chooseImage({
            sizeType: ['original', 'compressed'],
            sourceType: [type],
            success: function (res) {
                for (var i = 0; i < res.tempFilePaths.length;i++){
                    var string = 'tempImgs['+i+'].url';
                    var string2 = 'tempImgs[' + i + '].msg';
                    that.setData({
                        [string]: res.tempFilePaths[i],
                        [string2] : "访问服务器出错"
                    });
                }//地址赋值
                
                var successUp = 0; //成功
                var failUp = 0; //失败
                var length = res.tempFilePaths.length; //总数
                var count = 0; //第几张
                that.setData({
                    picPaths:[]//上传前清空picPaths
                });
                //调用上传方法
                that.upImgs(that.data.tempImgs, successUp, failUp, count, length, function (successUp, failUp){//回调函数
                    wx.hideLoading();//隐藏加载提示
                    console.log("成功" + successUp + "失败" + failUp);
                    that.setData({
                        noMemeArray:[]
                    });//清空数组
                    for (var i=0;i<that.data.tempImgs.length;i++){
                        if (that.data.tempImgs[i].msg === "图片不是表情包"){
                            that.data.noMemeArray.push(that.data.tempImgs[i].url);
                            //将非表情包图片路径加入数组中
                        }
                    }
                    that.setData({
                        noMemeArray : that.data.noMemeArray
                    });//弱智机制，必须这么写才能让修改生效
                    if(that.data.noMemeArray.length > 0){//如果非表情包数组大于0
                        that.setData({
                            tipSwitch:true
                        });//打开提示窗    
                    }
                    else{
                        wx.showToast({
                            title: '上传成功',
                            icon: 'success',
                            duration: 2000
                        });//提示成功
                        that.refreshImage();//刷新页面
                    }
                        
                }); 
                
                
                
            }
        })
    },
    //上传服务器
    upImgs: function (imgPaths, successUp, failUp, count, length,callback) {
        console.log("正在上传第" + (count + 1) + "张");
        var that = this;
        wx.showLoading({
            title: '正在上传第'+ (count + 1) + "/" + length + "张",
        })
        wx.uploadFile({
            url: that.data.url + '/upload_image',//
            filePath: imgPaths[count].url,
            name: 'file',
            header: {
                'content-type': 'multipart/form-data'
            },
            formData: { 'openid': that.data.openid },
            success: function (res) {
                successUp++;//自加
                console.log(res) //接口返回网络路径
                var data = JSON.parse(res.data);

                var string = 'tempImgs[' + count + '].msg';
                
                that.setData({
                    [string] : data.msg
                })
                
            },
            fail: function(e){
                failUp++;
                var string = 'tempImgs[' + count + '].msg';
                that.setData({
                    [string]: "访问服务器出错"
                })
            },
            complete(e){
                count++;
                console.log("完成上传第" + count + "张");
                if(count==length){//递归出口
                    //上传完成，调用回调函数
                    callback(successUp, failUp);
                }
                else{
                    that.upImgs(imgPaths, successUp, failUp, count, length, callback);//递归调用
                    
                }


            }
            
        })
    },
    closeTip:function(){
        this.setData({
            tipSwitch:false
        });//关闭窗口
        this.refreshImage();//刷新
    },

    getUserInfo: function (e) {//获取头像授权
        console.log(e)
        app.globalData.userInfo = e.detail.userInfo
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
        })
    },
    previewImg: function (e) {
        var current = e.target.dataset.src;
        wx.previewImage({
            urls: [current],
        })
    }

})