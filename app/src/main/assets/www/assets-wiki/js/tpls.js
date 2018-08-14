/**
 * 头部导航
 * @type data 父组件需要传入一个对象
 * @type title 标题
 * @type isBack 返回上一页：(true显示) 不传值则不显示
 * @type backUrl 返回上一页的状态： 传值则跳转到相应的链接  不传值返回上一页
 * @type isShare 分享：传值则显示
 * @example
 * {title:"标题", isBack:true, isShare:true,backUrl:"可传链接也可不传值"}
 */
const wkHeader = {
    props: ['data', 'shareData'],
    template: `<div class="header" :class="{enter:isEnter}">
                    <header>
                      <div class="abs-l" @click.stop.prevent="onShow" v-if="!data.isBack"><span class="icon menu"></span></div>
                      <div class="abs-l" @click="onBack(data.backUrl)" v-if="data.isBack"><span class="icon back"></span></div>
                      <span>{{data.title}}</span>
                      <div class="abs-r" v-if="data.isShare" @click="onShare(shareData)"><span class="icon share"></span></div>
                  </header>
                  <aside class="drawer" :class="{enter:isEnter}">
                     <div class="content">
                            <div class="avatar">
                                <div class="img">
                                    <a :href="redirect"><img :src="avatar" alt=""></a>
                                </div>
                                <template v-if="!isShowLogin">
                                    <div class="link"><a :href="redirect">注册/登录</a></div>
                                    <div class="info">享受更多精彩</div>
                                </template>                               
                                <div v-if="isShowLogin" class="name"><a :href="baseUrl + '/pages/my/index.html'">{{user.name}}</a></div>
                            </div>
                            <div class="items">
                                <a @click="onMessages" class="item">消息中心</a>
                                <a :href="baseUrl + '/pages/my/opinion.html'" class="item">意见反馈</a>
                                <a :href="settingRedirect" class="item" @click="onBtnSetting()">设置</a>
                            </div>
                        </div>
                  </aside>
                  <div class="overlay" @click="onClose"></div>
                  <div class="modal-share" @touchmove.prevent v-show="share" @click="onCloseShare"><img :src="iconModalShare" alt=""></div>
                </div>`,
    data: function () {
        return {
            avatar: rootName + "/assets-wiki/images/login/icon-avatar-default@2x.png",
            isEnter: false,
            isLeave: false,
            isShowLogin: false, //是否登录  true已登录 false未登录
            redirect: "",
            messagesUrl: "", //
            opinionUrl: "",
            settingUrl: "",
            user: {
                name: ''
            },
            share: false,
            redirectMsg: '',
            baseUrl: rootName,
            iconModalShare: rootName + '/assets-wiki/images/modal/icon-modal-share@2x.png'
        }
    },
    mounted: function () {
        this.getLoginStatusToRedirect()
    },
    computed: {///pages/my/setting/index.html
        settingRedirect: function () {
            var returnUrl = window.location.href
            return this.baseUrl + '/pages/my/setting/index.html?returnUrl=' + returnUrl
        }
    },
    methods: {
        //点击设置ios Android 存储缓存
        onBtnSetting() {
            // 调用app
            callApp(function () {
                //ios Android获取缓存大小
                cacheData(function (num) {
                    localStorage.setItem('cacheData', num); // 缓存
                });
            })
        },
        //点击展开个人中心抽屉
        onShow: function () {
            this.isEnter = true
        },
        //关闭
        onClose: function () {
            this.isEnter = false;
        },
        onBack: function (url) {
            // 调用app
            callApp(function () {
                //ios Android获取缓存大小
                cacheData(function (num) {
                    localStorage.setItem('cacheData', num); // 重新获取缓存数据
                });
            })
            if (!url) {
                myLocalStorage.remove("updatePhone"); // 清楚是否可以修改密码
                window.history.back()
            } else {
                if (url == "ency") {
                    this.$emit('ency-list', false);
                } else {
                    window.location.href = url
                }

            }
        },
        //点击分享
        onShare: function (data) {
            callApp(
                () => {//app中
                    shareCordova(data)
                },
                () => {//H5中
                    this.share = true
                }
            )
        },
        //关闭分享弹出层
        onCloseShare: function () {
            this.share = false
            // this.onTouchMove(false)
        },
        //获取登录状态
        getLoginStatusToRedirect: function () {
            var _this = this
            isLogined(function (code) {
                var returnUrl = window.location.href
                //成功
                if (code == 0) {
                    if (myLocalStorage.getter('__user__')) {
                        _this.user = myLocalStorage.getter('__user__')
                    }

                    _this.isShowLogin = true
                    _this.redirect = rootName + "/pages/my/index.html"
                    _this.redirectMsg = rootName + "/pages/my/messages/index.html"
                }
                //session超时
                if (code == 3) {
                    _this.user = localStorage.removeItem('__user__')
                    _this.isShowLogin = false
                    _this.redirect = rootName + "/pages/login/login.html?returnUrl=" + encodeURI(returnUrl)
                    _this.redirectMsg = rootName + "/pages/login/login.html"
                }
            })
        },
        //读取和设置localStorage
        _localStorage: function (key, value) {
            //value true是设置 false 读取
            return !value ? localStorage.getItem(key) : localStorage.setItem(key, JSON.stringify(value))
        },
        onEncy: function () {
            this.$emit('ency-details', this.sex, this.height);
        },
        onMessages: function () {
            isLogined(function (code) {
                //成功
                if (code == 0) {
                    window.location.href = rootName + '/pages/my/messages/index.html'
                }
                //session超时
                if (code == 3) {
                    window.location.href = rootName + '/pages/login/login.html?returnUrl=' + window.location.href
                }
            })
        }
    }
}

const wkFooter = {
    props: {
        selected: 0
    },
    template: `<footer>
               <div class="content">
                    <a @click="redirect(item.link)" class="link" :class="{active:index==selected}" v-for="item,index in footData">
                        <i :class="item.icon"></i>
                        <i v-if="index==2" class="icon-midbg"></i>
                        <div class="txt">{{item.name}}</div>
                    </a>
                </div>
            </footer>`,
    data: function () {
        return {
            drawerData: [
                {name: "消息中心", link: rootName + "/pages/my/details.html"},
                {name: "意见反馈", link: rootName + "/pages/my/details.html"},
                {name: "设置", link: rootName + "/pages/my/setting.html"},
            ],
            footData: [
                {name: "首页", icon: "icon-home", link: rootName + "/pages/index/index.html"},
                {name: "资讯", icon: "icon-news", link: rootName + "/pages/news/index.html?channelId=0"},
                {name: "百科", icon: "icon-cyclopedia", link: rootName + "/pages/ency/index.html"},
                {name: "活动", icon: "icon-activity", link: rootName + "/pages/activity/index.html?channelId=1"},
                {name: "活化馆", icon: "icon-activate", link: rootName + "/pages/activate/index.html"}
            ]
        }
    },
    methods: {
        redirect(href) {
            sessionStorage.removeItem('indexData')
            sessionStorage.removeItem('newsData')
            sessionStorage.removeItem('activityData')
            sessionStorage.removeItem('homeListData')
            window.location.href = href
        }
    }
}

/**
 * 五个分类图标
 * @type
 */
const wkCategory = {
    template: `<section class="category-links">
                    <a class="item" v-for="item in links" @click="toList(item.link)">
                        <img :src="item.imgUrl" alt="">
                        <div class="txt" v-html="item.title"></div>
                    </a>
                </section>`,
    data: function () {
        return {
            links: [
                {
                    title: '口头传统和<br>表述，包括...',
                    link: rootName + '/pages/ency/list.html?gbCategory=A',
                    imgUrl: rootName + '/assets-wiki/images/index/category-icon-1.png'
                },
                {
                    title: '社会风俗、礼<br>仪、节庆活动',
                    link: rootName + '/pages/ency/list.html?gbCategory=C',
                    imgUrl: rootName + '/assets-wiki/images/index/category-icon-2.png'
                },
                {
                    title: '表演艺术',
                    link: rootName + '/pages/ency/list.html?gbCategory=B',
                    imgUrl: rootName + '/assets-wiki/images/index/category-icon-3.png'
                },
                {
                    title: '有关自然界<br>和宇宙的知识的知识的知识',
                    link: rootName + '/pages/ency/list.html?gbCategory=D',
                    imgUrl: rootName + '/assets-wiki/images/index/category-icon-4.png'
                },
                {
                    title: '传统手工艺',
                    link: rootName + '/pages/ency/list.html?gbCategory=E',
                    imgUrl: rootName + '/assets-wiki/images/index/category-icon-5.png'
                }
            ]
        }
    },
    methods: {
        toList: function (url) {
            var e = mySessionStorage.getter("encyListData");
            if (e) {
                mySessionStorage.setter("encyListData", null)
            }
            window.location.href = url;
        }
    }
}


/**
 * 搜索框
 * @type {{template: string, methods: {}}}
 */
const wkSearch = {
    template: `<section class="search"><a @click="onRedirect()" href="javascript:void(0)" class="input">请输入搜索关键词</a></section>`,
    methods: {
        onRedirect: function (index) {
            mySessionStorage.setter("searchListData", null);
            window.location.href = rootName + '/pages/search/index.html?page=index'
        }
    }
}

/**
 * 资讯列表
 * @type item.link 需要传入完整的详情链接地址  ***
 */
const newsItem = {
    props: {
        data: []
    },
    template: `<section class="news-item">
                    <a class="link"  :href="item.href" v-for="item in data">
                        <div class="desc">
                            <i class="icon-hot" v-if="item.flag"></i>
                            <h3>{{item.title}}</h3>
                            <div class="info">
                                <span class="source">{{item.source}}</span>
                                <span class="time">{{item.time}}</span>
                            </div>
                        </div>
                        <div class="img" :class="item.className">
                           <img v-for="img in item.imgUrls" class="lazy" :data-original="img">
                        </div>
                    </a>
                </section>`,
    methods: {}
}


/**
 * 活动列表
 * @type {{props: {activity: Array}, template: string}}
 */
const wkActivity = {
    props: {
        activity: []
    },
    template: `<section class="activity-item">
                    <a class="link" :href="item.href" v-for="item in activity">
                        <img class="lazy" style="height: 100%;" :data-original="item.imgUrls ? item.imgUrls :'../../assets-wiki/images/default/head694_320.png'" alt="">
                        <div class="desc">
                            <i class="icon-hot"></i>
                            <h3>{{item.title}}</h3>
                            <div class="info">
                                <span class="coord" v-show="item.address" v-html="item.address"></span>
                                <span class="time">{{item.time}}</span>
                            </div>
                        </div>
                    </a>
                </section>`,
}

/**
 * 百科列表
 * @type {{props: {datas: Array}, template: string}}
 * @param datas 迭代数据集合
 * @param recommend 是否显示推荐  true/false  默认false
 :src="ency.img ? ency.img :'../../assets-wiki/images/default/694*374.png'"
 <div class="label">
 <p>{{ency.typeName}}</p>
 </div>

 */
const wkEncy = {
    props: {
        datas: [],
        recommend: false
    },
    template: `<div class="contents" id="dataList" v-cloak>
                <div class="content" v-for="(ency, index) in datas" @click="toDetails(ency.id, ency.type)">
                    <div class="cover">
                        <img class="lazy" :data-original="ency.img ? ency.img :'../../assets-wiki/images/default/head694_374.png'">
                        <div class="myLabel" :data-type="ency.type">
                            <img v-if="ency.type == 0" src="../../assets-wiki/images/icon_xiangmu@2x.png"/>
                            <img v-if="ency.type == 1" src="../../assets-wiki/images/icon_chuanchengren@2x.png"/>
                            <img v-if="ency.type == 2" src="../../assets-wiki/images/icon_zuopin@2x.png"/>
                        </div>
                    </div>
                    <div class="des">
                        <div class="title">
                            <h4>{{ency.title}}</h4>
                            <p v-if="ency.marking" class="type">#{{ency.marking}}</p>
                            <p v-if="ency.info" class="info">{{ency.info}}</p>
                            <i v-show='recommend'></i>
                        </div>
                    </div>
                </div>
              </div>`,
    methods: {
        toDetails: function (id, type) {
            window.location.href = rootName + "/pages/ency/details.html?type=" + type + "&id=" + id; // 跳转详情
        }
    }
}


/*
 * 没有网络显示
 */
var noNetwork = {
    template: `<div class="page-loading">
                <div class="blank404 timeout">
                        <div class="content1">
                            <img class="pic" :src="imgSrc" alt="暂无网络">
                            <div class="name">暂无网络</div>
                            <div class="txt">当前网络不稳定，请稍后再试…</div>
                        </div>
                    </div>
                </div>`,
    data() {
        return {
            imgSrc: '../../assets-wiki/images/icon-no-network@2x.png'
        }
    }
};


/**
 * 正在加载
 * @type {{}}
 */
var pageLoading = {
    data: function () {
        return {
            noNetworkShow: false,
            hideLoad: false
        }
    },
    template: `<div class="page-loading">
                   <img class="loading" :src="rootName + '/assets-wiki/images/loading.gif'" alt="">
               </div>`,
    components: {
        noNetwork
    },
    mounted: function () {
        setTimeout(() => {
            if (this.show) {
                this.noNetworkShow = true
                this.hideLoad = true
                this.$emit('showLoad', false)
                console.log(this.show)
            }
        }, overTime)
    }
};




/*
* APP分享
*/
var appShareTip = {
    template: `<div class="app-tips">
                <span class="logo-share-tip"></span>
                <a href="javascript:;" @click="testApp('efeiyiwiki://bigwiki.com/?path=' + hrefUrl)" class="open" v-if="status.android">打开</a>
                <a :href="'efeiyiwiki://bigwiki.com/?path=' + hrefUrl" class="open" v-if="status.ios" @click="iosBtn()">打开</a>
                <a href="http://sj.qq.com/myapp/detail.htm?apkName=com.efeiyi.bigwiki" class="open" v-if="status.weixin">打开</a>
                <div v-show="showVa">
                    <p><a href="JavaScript:;" @click="showVa = false">取消</a></p>
                    <p><a href="http://sj.qq.com/myapp/detail.htm?apkName=com.efeiyi.bigwiki">确定</a></p>
                <div>
            </div>
            <div class="maskBox" v-show="showVa">
                <div class="promptBox">
                    <div class="content">
                        <p>如果没有安装,请前往下载</p>
                    </div>
                    <div class="options">
                        <div>
                            <p><a href="JavaScript:;" @click="showVa = false">取消</a></p>
                        </div>
                        <div>
                            <p><a href="http://sj.qq.com/myapp/detail.htm?apkName=com.efeiyi.bigwiki">确定</a></p>
                        </div>
                    </div>
                </div>
            </div>     
            `,
    data: function () {
        return {
            showVa: false,
            hrefUrl: "",
            status: {
                weixin: false,
                ios: false,
                android: false
            },
            browser: {
                versions: function () {
                    var u = navigator.userAgent, app = navigator.appVersion;
                    return {
                        trident: u.indexOf('Trident') > -1, //IE内核
                        presto: u.indexOf('Presto') > -1, //opera内核
                        webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
                        gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1,//火狐内核
                        mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
                        ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                        android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
                        iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
                        iPad: u.indexOf('iPad') > -1, //是否iPad
                        webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
                        weixin: u.indexOf('MicroMessenger') > -1, //是否微信 （2015-01-22新增）
                        qq: u.match(/\sQQ/i) == " qq" //是否QQ
                    };
                }(),
                language: (navigator.browserLanguage || navigator.language).toLowerCase()
            }
        }
    },
    mounted: function () {
        this.browOpen();
        var _url = window.location.href;
        _url = 'pages/' + _url.split('/pages/')[1].split('&share=true')[0];
        this.hrefUrl = _url;
    },
    methods: {
        browOpen: function () {
            if (this.browser.versions.weixin) {
                this.status.weixin = true;
                return false;
            }

            if (this.browser.versions.android) {
                this.status.android = true;
            }

            if (this.browser.versions.ios) {
                this.status.ios = true;

            }
        },
        iosBtn() {
            var _this = this;
            setTimeout(function () {
                _this.showVa = true;
            }, 2500)
        },
        testApp(url) {
            var timeout, t = 1000, hasApp = true;
            if (url) {
                location.href = url;
            }
            setTimeout(function () {
                if (!hasApp) {
                    //没有安装百科app
                    var r = confirm("如果没有安装,请前往下载");
                    if (r == true) {
                        location.href = "http://sj.qq.com/myapp/detail.htm?apkName=com.efeiyi.bigwiki"
                    }
                    // location.href = "http://sj.qq.com/myapp/detail.htm?apkName=com.efeiyi.bigwiki";
                } else {

                }
                document.body.removeChild(ifr);
            }, 2500);

            var t1 = Date.now();
            var ifr = document.createElement("iframe");
            ifr.setAttribute('src', url);
            ifr.setAttribute('style', 'display:none');
            document.body.appendChild(ifr);
            timeout = setTimeout(function () {
                var t2 = Date.now();

                // return (!t1 || t2 - t1 < t + 150);
                if (!t1 || t2 - t1 < t + 100) {
                    hasApp = false;
                } else {
                    hasApp = true;
                }
            }, t);
        }
    }
}

