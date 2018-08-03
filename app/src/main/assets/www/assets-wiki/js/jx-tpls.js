/**
 * 轮播图
 * @type swiper 数据
 * @type imgUrl 图片地址
 */
const wkSwiper = {
    props: {
        swiper: []
    },
    template: `<div class="swiper-container">
                    <div class="swiper-wrapper">
                        <div class="swiper-slide" v-for="item in swiper">
                            <a :href="item.href">
                                <img :src="item.imgUrl" alt="11">
                            </a>
                        </div>
                    </div>
                    <div class="swiper-pagination"></div>
                </div>`
}

/**
 * 子导航
 * @type
 */
var menuBar = {
    props: {
        data: Array
    },
    data: function () {
        return {
            selectedIndex: 0
        }
    },
    template: `<div class="menu-bar">
                    <div class="swiper-wrapper">
                        <div class="swiper-slide" v-for="item in data">
                            <!--<a :class="{active:selectedIndex == item.id}" @click="selectedMenu(item.id)">{{item.name}}</a>-->
                            <a :class="{active:selectedIndex == item.id}" @click="selectedMenu(item.id,item.href)">{{item.name}}</a>
                        </div>
                    </div>
                  </div>`,
    mounted: function () {
        this.selectedIndex = getHttpParam('channelId')
    },
    methods: {
        selectedMenu: function (id, href) {
            this.selectedIndex = id
            this.$emit('send', id)
            sessionStorage.removeItem('newsData')
            window.location.href = href
        }
    }
}


const toolTip = {
    props: ['data'],
    template: `<div class="tool-tip" v-if="data">
                <a class="link" @click="onShowModalLogin">登录</a>后可享受更多精彩<em class="close" @click="onCloseToolTip"></em>
               </div>`,
    mounted: function () {
    },
    methods: {
        onShowModalLogin: function () {
            window.location.href =  rootName + '/pages/login/login.html?returnUrl=' + window.location.href
        },
        //关闭提示条
        onCloseToolTip: function () {
            this.data = false
            myLocalStorage.setter('__closeTip__', true);
            this.$emit('send', true)
        }
    }
}


/**
 * 资讯 登录弹出框
 * @type
 */
const modalLogin = {
    template: `<div class="modal">
                  <div class="box login">
                    <div class="content">
                        <div class="main">
                            <div class="title">请选择登录方式</div>
                            <div class="items">
                                <dl class="item" @click="onByPhoneLogin"><dt class="icon phone"></dt><dd>手机登录</dd></dl>
                                <dl class="item" @click="onByWechatLogin"><dt class="icon wechat"></dt> <dd>微信登录</dd></dl>
                                <dl class="item" @click="onByQQLogin"><dt class="icon qq"></dt><dd>QQ登录</dd></dl>
                            </div>
                        </div>
                    </div>
                    <div class="mask" @click="onClose"></div>
                  </div>
                </div>`,
    methods: {
        //关闭
        onClose: function () {
            this.$emit('send', false)
        },
        //手机登录
        onByPhoneLogin: function () {
            window.location.href =  rootName + '/pages/login/login.html'
        },
        //微信登录
        onByWechatLogin: function () {
            alert('微信登录')
        },
        //qq登录
        onByQQLogin: function () {
            alert('qq登录')
        },
    }
}

//活动列表
const activityItem = {
    props: {
        data: Array
    },
    template: `<div class="activity-item">
                <ul>
                    <li class="item" v-for="item in data">
                        <a :href="item.href">
                            <p class="pic">
                                <img class="lazy" :data-original="item.imgUrls[0] ? item.imgUrls[0] + '?x-oss-process=style/head-recommend-informationlist' :'/assets-wiki/images/default/head694_320.png'" alt="">
                                <!--<img :src="item.imgUrls[0] + '?x-oss-process=style/head-recommend-informationlist'" alt="">-->
                            </p>
                            <p class="txt">{{item.title}}</p>
                            <p class="info0">
                                <span v-if="item.address">地点：{{item.address}}</span>
                                <span>{{item.time}}</span>
                            </p>
                        </a>
                    </li>
                </ul>
            </div>`
}

/**
 * 提交后显示的成功或失败
 * @type
 */
const confirmMsg = {
    props: {
        data: {}
    },
    template: `<transition name="fade"><div class="modal-confirm">
                  <div class="confirm">
                    <div class="tip">
                        <i class="icon" :class="{'true':data.type==0, 'false': data.type==1}"></i>
                    </div>
                    <div class="name">{{data.name}}</div>
                    <div class="info">{{data.content}}</div>
                </div>
              </div></transition>`,
}


/**
 * 内容报错
 * @type {art-id:文章id}
 * @type {textarea.status：文本输入框是否显示}
 * @type {list：提供选择的数据}
 * @type {result：提交的数据}
 */
const modalReportError = {
    props: ['art-id'],
    data: function () {
        return {
            isShowTextarea: false,
            isShowConfirm: false,
            textareaContent: "",
            list: [
                {id: 0, name: '低俗色情', checked: false},
                {id: 1, name: '广告软文', checked: false},
                {id: 2, name: '内容不实', checked: false},
                {id: 3, name: '有错字', checked: false},
                {id: 4, name: '重复内容', checked: false},
                {id: 5, name: '标题党', checked: false},
                {id: 6, name: '排版错误', checked: false},
                {id: 7, name: '侵权', checked: false},
                {id: 8, name: '其他', checked: false}
            ],
            store: [],
            // isClick: false,
            receive: {
                show: false,
                name: '',
                content: '',
                type: 1
            },
            modal: true
        }
    },
    template: `<div class="modal">
                    <div class="box report-error" v-show="modal">
                        <div v-show="!isShowConfirm" class="content">
                            <div class="title">内容报错<a class="post" :class="{disable:!isClick}" @click="onsubmit">提交</a></div>
                            <div class="main">
                                <ul class="checkbox">
                                    <li v-for="item in list" @click="onSelected(item.id, item.name)"><i class="icon-radio" :class="{selected:item.checked}"></i>{{item.name}}</li>
                                </ul>
                                <div class="text" v-show="isShowTextarea">
                                    <textarea name="" id="" cols="30" rows="10" placeholder="请具体说明问题，我们将尽快处理" v-model="textareaContent"></textarea>
                                </div>
                            </div>
                        </div>
                        <div class="mask" @click="onClose" @touchmove.prevent></div>
                    </div>
                    <confirm-msg v-show="receive.show" :data="receive"></confirm-msg>
                </div>`,
    components: {
        confirmMsg: confirmMsg
    },
    mounted: function () {
        this.resetList()
    },
    computed: {
        isClick: function () {
            // console.log('store',this.store)
            // console.log('length',this.store.length)
            if (this.store.length == 3) {
                //console.log('textarea', this.textareaContent.length)
                if (this.store.indexOf('其他') > -1) {
                    if(this.textareaContent.length > 0){
                        return true
                    }
                    return false
                }

            }
            if (this.store.length > 1) {
                return true
            }
        }
    },
    methods: {
        //关闭报错模态框
        onClose: function () {
            this.$emit('status', false);
        },
        //选择报错内容
        onSelected: function (index, name) {
            var len = this.list.length
            var _list = this.list[index]
            this.store = []  //存储选中信息
            //console.log('2')
            //1.选中
            _list.checked = !_list.checked

            //2.存储选中信息
            for (let i = 0; i < len; i++) {
                if (this.list[i].checked) {
                    this.store.push(this.list[i].name)
                }
            }

            //判断提交按钮是否可点击
            // if (this.store.length == 1) {
            //     if (this.store.indexOf('其他') > -1) {
            //         this.isClick = false
            //     }
            // }
            // if (this.store.length > 1) {
            //     this.isClick = true
            // }

            //3.选中其他
            if (index == len - 1) {
                this.isShowTextarea = !this.isShowTextarea
            }
            // console.log(this.store)
            this.store = this.store.toString().replace(/,/g, ";").replace("其他", "其他：") + this.textareaContent
        },
        //显示成功失败提示框  0是成功  1是失败  2是提交数据不能为空
        showConfirmMsg: function (flag) {
            var result = {}
            switch (flag) {
                case 0:
                    result = {
                        name: '提交成功',
                        content: '感谢您的反馈，我们会尽快处理',
                        type: 0
                    }
                    break;
                case 1:
                    result = {
                        name: '提交失败',
                        content: '当前网络不稳定，请稍后再试',
                        type: 1
                    }
                    break;
                case 2:
                    result = {
                        name: '提交失败',
                        content: '提交数据不能为空',
                        type: 1
                    }
                    break;
            }
            this.receive.show = true
            this.receive.name = result.name
            this.receive.content = result.content
            this.receive.type = result.type
            this.modal = false
            setTimeout(() => {
                this.receive.show = false
                this.$emit('status', false)
                this.modal = true
            }, 1000)
        },
        //提交数据
        onsubmit: function (flag) {
            var _this = this
            //获取登录用户手机号
            var userPhone = myLocalStorage.getter('__user__') ? myLocalStorage.getter('__user__').phone : ''
            var result = {
                "phoneModel": "",//手机型号
                "phone": userPhone,//手机号
                "mail": "",//邮箱
                "content": this.store,
                "feedbackType": 2,  // 1 反馈 2 报错
                "targetId": getHttpParam("id"),//报错文章id
                "dataStatus": "a" //插入标记 必传 a添加 d 删除 其他修改
            };
            //提交为空的情况
            if (!this.isClick) {
                // this.showConfirmMsg(2);
                return
            }

            var _params = {
                url: apiFeedback,
                data: {params: JSON.stringify(result)},
                sCallback: function (res) {
                    if (res.code == 0) {//成功
                        _this.showConfirmMsg(0)
                        _this.store = []
                        _this.resetList()
                    } else {
                        _this.showConfirmMsg(1)
                    }
                },
                eCallback: function () {
                    this.showConfirmMsg(1);
                }
            }
            httpRequest(_params)
        },
        resetList: function () {
            for (var i = 0; i < this.list.length; i++) {
                this.list[i].checked = false
            }
            this.isShowTextarea = false
            this.textareaContent = ''
            // this.isClick = false
        }
    }
}

//项目 作品 轮播
const swiperLevel = {
    props: {
        data: []
    },
    template: `<div class="swiper-container">
                    <div class="swiper-wrapper">
                        <div class="swiper-slide" v-for="item,index in data">
                           <a :href="item.href">
                            <div class="img">
                                <i class="flag" v-if="item.flagName == '传承人'"><img src="../../assets-wiki/images/icon_chuanchengren@2x.png" alt=""></i>
                                <i class="flag" v-if="item.flagName == '项目'"><img src="../../assets-wiki/images/icon_xiangmu@2x.png" alt=""></i>
                                <i class="flag" v-if="item.flagName == '作品'"><img src="../../assets-wiki/images/icon_zuopin@2x.png" alt=""></i>
                                <!--<img v-if="item.imgUrls" :src="item.imgUrls + '?x-oss-process=style/head-recommend'" alt="">-->
                                <img :src="item.imgUrls ? item.imgUrls + '?x-oss-process=style/head-recommend' :'../../assets-wiki/images/default/head498_268.png'" alt="">
                            </div>
                            <div class="desc">
                                <h3>{{item.title}}</h3>
                                <h4 :class="{white: item.projectName==0}" v-html="item.projectName"></h4>
                                <div class="info">{{item.info}}</div>
                            </div>
</a>
                        </div>
                    </div>
                </div>`
}