/**
 * 禁止滑动
 */
const proHibit = {
    //禁止滑动
    hidden(thisTop) {
        // var scrollTop = window.pageYOffset
        //     || document.documentElement.scrollTop
        //     || document.body.scrollTop
        //     || 0;
        // document.body.style.top = "-" + thisTop + "px";
        // document.body.style.position = 'fixed';
    },
    //解除禁止滚动
    show(thisTop) {
        // document.body.style.overflow='';
        // document.body.style.position=null;
        // document.body.style.top=null;
        // window.scrollTo(0,thisTop);
    }
}





/**
 * 右边菜单
 */

const btNmenu = {
    props: {
        datas: []
    },
    template: `<div>
                <div class="btnmenu" @click="btnErr" v-show="btnmenu">
                    <a href="javascript:;"><img src="../../assets-wiki/images/shop/copy.png" /></a>
                </div>
                <div class="menulist" :class="{add:initAdd}" @click.stop>
                    <div>
                        <h3>目录</h3>
                        <ul class="brand_list">
                            <!--<li v-for="(item, index) in datas" :class="item.class" @click="btnList(index)"><a :href="'#'+item.id">{{item.name}}</a></li>-->
                            <li v-for="(item, index) in datas" :class="item.class" @click="btnList(index, '#'+item.id)"><a href="JavaScript:;">{{item.name}}</a></li>
                        </ul>
                    </div>

                </div>
                <div class="cory" :class="{crr:initCrr}" @click="btnErr"></div>
               </div>`,
    data:function () {
        return {
            //样式状态
            initAdd: false,
            initCrr: false,
            //菜单按钮状态
            btnmenu: false,
            //记录禁止滚动前的高度   禁止滚动时使用
            hiddenTop: 0,
            //重新赋值的高度   解除禁止滚动使用
            showTop: 0
        }
    },
    methods:{
        //点击遮盖层
        btnErr(){
            this.initAdd=!this.initAdd;
            this.initCrr=!this.initCrr;
            if(this.initAdd == true){
                //移除监听scroll滚动事件
                window.removeEventListener('scroll',this.handleScroll,false);
                //将禁止滚动前的高度hiddenTop赋值给showTop   避免禁止滚动后hiddenTop = 0  提前在赋予给别的变量
                this.showTop = this.hiddenTop;
                proHibit.hidden(this.hiddenTop);
            }else{
                //绑定监听scroll滚动事件
                window.addEventListener('scroll',this.handleScroll)
                proHibit.show(this.showTop);
            }
        },
        //滚动事件
        handleScroll(){
            var top = $(window).scrollTop();
            this.hiddenTop = top;
            if(top > window.innerHeight){
                this.btnmenu = true;
            }else{
                this.btnmenu = false;
            }
        },
        //点击当前的内容
        btnList(index, dom){
            this.initAdd=!this.initAdd;
            this.initCrr=!this.initCrr;
            //绑定监听scroll滚动事件
            window.addEventListener('scroll',this.handleScroll)
            //解除禁止滚动
            proHibit.show(this.showTop);
            // $(dom).offset().top
            $('html,body').animate({scrollTop: $(dom).offset().top - 120}, 300);
        }
    },
    mounted(){
        var _this = this;
        window.addEventListener('scroll',this.handleScroll);
        $(".menulist").on("click","li",function () {
            $(this).addClass("active").siblings().removeClass("active");
        })
    }
}


/**
 * 返回顶部 return dii.png
 * @type {{template: string}}
 */

var returnBas = {
    template : `<div class="btnmenu return" @click="btnErr" v-show="btnmenu">
                    <a href="javascript:;">
                        <img src="../../assets-wiki/images/shop/return_dii.png" />
                    </a>
                </div>`,
    data:function () {
        return {
            //返回按钮状态
            btnmenu: false,
            //记录禁止滚动前的高度   禁止滚动时使用
            hiddenTop: 0,
            //重新赋值的高度   解除禁止滚动使用
            showTop: 0
        }
    },
    mounted(){
        window.addEventListener('scroll',this.handleScroll);
    },
    methods: {

        //点击遮盖层
        btnErr() {
            $('html,body').animate({ scrollTop: 0 }, 200);
        },
        //滚动事件
        handleScroll() {
            var top = $(window).scrollTop();
            if (top > window.innerHeight) {
                this.btnmenu = true;
            } else {
                this.btnmenu = false;
            }
        }
    }
}

/**
 * 无网络状态导航
 */
const noWatchHead = {
    template: `<div class="master_return">
                  <div>
                    <a href="index.html" @click="btnReturn"><img src="../../assets-wiki/images/header/header-icon-back@2x.png"></a>
                  </div>
                </div>`,
    methods: {
        //返回上一级清除缓存
        btnReturn(){
            removeLost();
        }
    }
};




/**
 * 返回上一级
 * 按钮
 */
const ReDatails = {
    props: {
        datas: {}
    },
    template: `<div class="master_return" :class="{active: iv_white}">
                  <div class="abs-l"><a href="index.html" @click="btnReturn" class="icon back"></a></div>
                  <div class="abs-r"><a href="javascript:;" @click="btnShare" class="icon share"></a></div>
                  <div class="btn_share active" v-if="share" @click="btnShare">
                      <div class="modal-share">
                        <img src="../../assets-wiki/images/modal/icon-modal-share@2x.png" alt="">
                      </div>
                  </div>
                </div>`,
    data: function(){
        return {
            iv_white: false,  //是否显示白色底部
            //提示分享状态
            share: false,
            //记录禁止滚动前的高度   禁止滚动时使用
            hiddenTop: 0,
            //重新赋值的高度   解除禁止滚动使用
            showTop: 0
        }
    },
    methods:{

        //分享
        btnShare(){
            var _this = this;
            var iosAnd = upiosAnd();

            callApp(function () {
                //ios Android 传入分享数据
                var obj = _this.datas;
                // console.log('--->',obj);
                shareCordova(obj);
            },function () {
                //H5
                _this.share = !_this.share;
                if(_this.share == true){
                    //移除监听scroll滚动事件
                    window.removeEventListener('scroll',_this.handleScroll,false);
                    //将禁止滚动前的高度hiddenTop赋值给showTop   避免禁止滚动后hiddenTop = 0  提前在赋予给别的变量
                    _this.showTop = _this.hiddenTop;
                    proHibit.hidden(_this.hiddenTop);
                }else{
                    //绑定监听scroll滚动事件
                    window.addEventListener('scroll',_this.handleScroll)
                    proHibit.show(_this.showTop);
                }
            })
        },
        //滚动事件
        handleScroll(){
            var top = $(window).scrollTop();
            this.hiddenTop = top;
            if (top > window.innerHeight) {
                this.iv_white = true;
                this.img_url = [
                    "../../assets-wiki/images/header/header-icon-back@2x.png",
                    "../../assets-wiki/images/header/header-icon-share@2x.png"
                ];
            } else {
                this.iv_white = false;
                this.img_url = [
                    "../../assets-wiki/images/shop/return.png",
                    "../../assets-wiki/images/shop/fenxiang.png"
                ];
            }
        },
        //返回上一级清除缓存
        btnReturn(){
            removeLost();
        }
    },
    mounted(){
        window.addEventListener('scroll',this.handleScroll);
        // window.addEventListener('touchmove',this.handleScroll);

    }
}



/**
 * 左右按钮
 */
const BtnDatails = {
    props: {
        leri: "",
        num: ""
    },
    template:`<div class="leri_btn" v-if="leri">
                  <a href="javascript:;" class="master_btn_left" @click="btn_left(--num)"><img :src="img_btn_url[0]" alt=""></a>
                  <a href="javascript:;" class=master_btn_right @click="btn_right(++num)"><img :src="img_btn_url[1]" alt=""></a>
              </div>`,
    data: function(){
        return {
            img_btn_url: [
                "../../assets-wiki/images/shop/Group@2x.png",
                "../../assets-wiki/images/shop/r.png"
            ]
        }
    },
    methods:{
        btn_left(num){
            //清除客户端缓存滚动高度 和 默认频道
            removeLost();
            this.$emit('btn-left',num);
            location.reload();
        },
        btn_right(num){
            removeLost();
            this.$emit('btn-right',num);
            location.reload();
        },

    }
}

/**
 * banner题图
 */
const BanDatails = {
    props: {
        dowm: "",
        datas: ""
    },
    template: `<div class="banner">
                    <div :style="{height: iv_height}"><img class="lazy" :data-original="datas.url" alt=""></div>
                    <div class="banner_title">
                      <h3>{{datas.title}}</h3>
                      <i @click="scrollBtn" v-if="dowm"></i>
                    </div>
                </div>`,
    data: function () {
      return {
          iv_height: window.innerHeight + 'px'
        }
    },
    methods: {
        scrollBtn: function(){
            var clientHeight = document.documentElement.clientHeight + "px";
            $('html,body').animate({scrollTop:clientHeight},500);
        }
    }
}

/**
 * 频道分类
 * @ name:     频道名字
 * @ class:    默认选中状态
 * @ code_id:  id
 */
const PicsList = {
    props: {
        datas: [],
        update: ""
    },
    template: `<div class="pics" id="pics">
                 <div class="swiper-container_end">
                     <div class="swiper-wrapper">
                         <div class="swiper-slide" v-for="(item,index) in datas">
                             <a href="javascript:;" :class="{active: item.ivmsg}" @click="btnCodeId(item.code_id)">{{item.name}}</a>
                         </div>
                     </div>
                 </div>
               </div>`,
    methods:{
        btnCodeId: function(id){
            this.$emit('code-id',id);
        }
    },
    mounted: function () {
        var _this = this

        setTimeout(function () {
            if(_this.update == 1){
                _this.$nextTick(function () {
                    var mySwiper = new Swiper('.swiper-container_end', {
                        freeMode: true,
                        slidesPerView: 5
                        //slidesPerGroup : 3
                    })
                })
            }else{
                _this.$nextTick(function () {
                    var mySwiper = new Swiper('.swiper-container_end', {
                        freeMode: true,
                        slidesPerView: 5
                        //slidesPerGroup : 3
                    })
                })
            }
        },1000)


    }
}






/**
 * 官方认证
 */
const TerDatails = {
    template: `<em class="icon_enter">
                 <img src="../../assets-wiki/images/shop/copy_icon.png" alt="">
               </em>`
}

/**
 * 基本信息
 */
const InfoDatails = {
    props: {
        datas: {}
    },
    template: `<div class="infor" :id="datas.id" v-if="datas.len > 0">
                 <h3 class="init_title">基本信息</h3>
                 <p class="info_text" v-for="(item, index) in datas.infotext" v-if="item.text">
                   <span>{{item.title}}</span>
                   <span>{{item.text}}</span>
                 </p>
               </div>`
}

/**
 * 视频  图片   内容
 * @ title:    标题
 * @ text:     副文本
 * @ type:     文件类型  1:图片  2:视频
 * @ url:      文件链接地址
 * @ basImg:   视频封面图
 * @ h_text:   副标题
 * @ content:  文本内容
 */
const BasDatails = {
    props: {
        datas: []
    },
    template: `<div class="">
                <div class="basic_con"  v-for="val in datas" v-if="val.title" :id="val.id">
                   <h3 class="init_title" v-if="val.title">{{val.title}}</h3>
                   <!--图文混排占位-->
                   <div v-if="!val.title" class="divSeat"></div>
                   <!-- 主内容 -->
                   <p class="For_content" v-if="val.content" v-html="val.content"></p>
                   <!-- 图片/视频 -->
                   <div class="basic_num" v-if="val.reset.url">
                     <div class="basic_slider">

                        <!-- 图片 -->
                        <div class="swiper-slide" v-if="val.reset.type == 0">
                             <img class="lazy" :data-original="val.reset.url"/>
                        </div>

                         <!-- 视频 -->
                         <div class="swiper-slide" v-if="val.reset.type == 1">
                              <div class="viDeo2">

                                <video preload="preload" width="100%"  controls="controls" loop="loop" :poster="val.reset.basImg" x5-playsinline="" playsinline="" webkit-playsinline="">
                                    <source :src="val.reset.url" type="video/mp4" />
                                </video>

                              </div>
                          </div>



                     </div>
                     <!-- 展示数量 -->
                     <div class="show_num" v-if="val.reset.len > 1">
                        <span class="numBerStr">{{val.reset.len}}</span>
                        <img src="../../assets-wiki/images/shop/Group 11.png"/>
                     </div>


                     <!--您点击的是这里-->
                     <div class="works_click" @click="btn_area(val.id)"></div>

                   </div>
                   <!-- 副标题 -->
                   <p class="For_h" v-if="val.h_text">{{val.h_text}}</p>

                 </div>
               </div>`,
    methods:{
        //子组件向父组件传值
        btn_area: function(id){
            this.$emit('show-area',true);
            this.$emit('show-id',id);
        }
    }
}


/**
 * 展示图集
 * @ area:      默认显示的状态  false隐藏   true显示
 * @ urlset{
 *      reset:[]   集合
 * }
 * @ content    文本内容
 * @ type       文件类型   1: 图片   2: 视频
 * @ url        文件链接地址
 * @ basImg     视频封面图
 */
const atlArea = {
    props: {
        urlset: [],   //数据
        area:""       //状态
    },
    template:  `<div class="area" id="area" v-if="area">
                    <div class="swiper-container">
                          <div class="area_header">
                              <a href="javascript:;" @click="btn_area">
                                <img src="../../assets-wiki/images/shop/return.png" />
                              </a>
                          </div>
                          <div class="swiper-wrapper">


                            <div class="swiper-slide" v-for="item in urlset" v-if="item.type == 0" :type="item.type">

                              <div>
                                <img class="lazy" :data-original="item.newUrl" alt="">
                              </div>

                              <!--简介 -->
                                  <div class="area_content" v-if="item.name">
                                    <p class="p1">{{item.name}}</p>
                                  </div>
                            </div>

                            <div class="swiper-slide" v-for="item in urlset" v-if="item.type == 1" :type="item.type">
                              <div>

                                <video  controls="controls" loop="loop" :poster="item.basImg" x5-playsinline="" playsinline="" webkit-playsinline="">
                                    <source :src="item.newUrl" type="video/mp4" />
                                </video>

                                  <!--简介 -->
                                  <div class="area_content" v-if="item.name">
                                    <p class="p1">{{item.name}}</p>
                                  </div>

                              </div>
                            </div>





                          </div>
                          <!-- 按钮 -->
                          <div class="swiper-button-prev" v-if="urlset && urlset.length >1"></div>
                          <div class="swiper-button-next" v-if="urlset && urlset.length >1"></div>
                          <!--分页-->
                          <div class="swiper-pagination" v-if="urlset && urlset.length > 1"></div>
                      </div>
                  </div>`,
    methods:{
        //子组件向父组件传值
        btn_area: function(){
            this.$emit('child-say',false);
            this.$emit('child-null',"");
            $(".area .swiper-slide").find("video").trigger("pause");
        }
    },
    mounted: function () { }
}


/**
 * 教学、体验馆
 * @ id:       教学、体验馆详情页id
 * @ code_id:  推荐图标是否存在
 * @ imgurl:   图片地址
 * @ title:    标题
 * @ content:  文本
 */
var teacHing = {
    props: {
        //接收教学、体验馆数据
        reset:[]
    },
    template:`<ul class="teach_list">
                    <li v-for="item in reset">
                        <a :href="item.id">
                            <div>
                                <img v-if="item.imgurl"  class="lazy" :data-original="item.imgurl" alt="">
                                <!--<img v-if="!item.imgurl" src="http://resource.efeiyi.com/image/uploads/head.png" alt="">-->
                            </div>
                            <div>
                                <i v-if="item.code_id">
                                    <img src="../../assets-wiki/images/shop/activity-icon-recommend@2x.png" alt="">
                                </i>
                                <h3 v-if="item.title">{{item.title}}</h3>
                                <p v-if="item.content">{{item.content}}</p>
                                <p v-if="item.address">地址:   {{item.address}}</p>
                            </div>
                        </a>
                    </li>
                </ul>`
}


/**
 * 标题人物
 * @ title:   标题
 * @ type:    类别
 * @ region:  地域
 */
var muTitle = {
    props: {
        //接收标题数据
        musetitle:{}
    },
    template:`<div class="muser_Title" v-if="musetitle">
                <h3 class="init_title">{{musetitle.name}}</h3>
                <p v-if="musetitle.text">
                  <span>类别</span>
                  <span>{{musetitle.text}}</span>
                </p>
                <p v-if="musetitle.copy">
                  <span>地域</span>
                  <span>{{musetitle.copy}}</span>
                </p>
              </div>`,
}


/**
 * 代表性传承人
 * @ title:     标题
 * @ imgUrl:    图片地址
 * @ name:      传承人名字
 * @ type:      所属分类
 * @ id:        传承人详情页id
 */
var inHerit = {
    props: {
        //接收标题数据
        inherit:{}
    },
    template:`<div class="inherit" v-if="inherit.inher.length > 0">
                <h3 class="init_title">代表性传承人</h3>
                <ul>
                    <li v-for="item in inherit.inher">
                        <a href="javascript:;">
                            <i>
                                <img  class="lazy" :data-original="item.imgUrl"/>
                            </i>
                            <div class="inher_text">
                                <strong>{{item.name}}</strong>
                                <p>{{item.type}}</p>
                            </div>
                        </a>
                    </li>
                </ul>
                <p class="Load_btn" id="Load_la" v-if="inherit.inher.length > 2">
                    <img src="../../assets-wiki/images/shop/Path 93 Copy 1.png" v-if="show2" @click="btnButtom"/>
                    <img src="../../assets-wiki/images/shop/Path 93 Copy 2.png" v-if="show1" @click="btnButtom"/>
                </p>
              </div>`,
    data: function () {
        return {
            //显示隐藏
            show1: false,
            show2: true,
            init: true
        }
    },
    methods:{
        btnButtom(){
            this.show1 = !this.show1;
            this.show2 = !this.show2;
            if(this.init == true){
                $(".inherit").css({
                    "max-height":"none"
                });
                this.init = false;
            }else{
                $(".inherit").css({
                    "max-height":"calc(380rem/75)"
                });
                this.init = true;
            }
        }
    }
}

/**
 * 非遗在中国
 * @ level:     级别
 * @ id:        ID
 */

var efeiChina = {
    props: {
        //接收标题数据
        China:{}
    },
    template:`<div class="efei_China" v-if="China">
                  <h3 class="init_title">非遗在中国<i><img src="../../assets-wiki/images/shop/Group 4.png" alt=""></i></h3>
                  <div class="inher_text" v-if="China.level">
                    <p>级别</p>
                    <strong>{{China.level}}</strong>
                  </div>
                  <div class="inher_text" v-if="China.id">
                    <p>ID</p>
                    <strong>{{China.id}}</strong>
                  </div>
              </div>`

}

/**
 * 传承项目
 * @ level:     级别
 * @ id:        ID
 */

var efeiProject = {
    props: {
        //接收标题数据
        project:{}
    },
    template:`<div class="efei_China" v-if="project">
                  <h3 class="init_title">传承项目</h3>
                  <div class="inher_text" v-if="project.name">
                    <p>名称</p>
                    <strong>{{project.name}}</strong>
                  </div>
                  <div class="inher_text" v-if="project.level">
                    <p>类别</p>
                    <strong>{{project.level}}</strong>
                  </div>
                  <div class="inher_text" v-if="project.id">
                    <p>ID</p>
                    <strong>{{project.id}}</strong>
                  </div>
              </div>`

}

/**
 * 传承人
 * @ level:     级别
 * @ id:        ID
 */

var efeiMaster = {
    props: {
        //接收标题数据
        master:{}
    },
    template:`<div class="efei_China" v-if="master">
                  <h3 class="init_title">传承人</h3>
                  <div class="inher_text" v-if="master.name">
                    <p>名称</p>
                    <strong>{{master.name}}</strong>
                  </div>
                  <div class="inher_text" v-if="master.level">
                    <p>类别</p>
                    <strong>{{master.level}}</strong>
                  </div>
                  <div class="inher_text" v-if="master.id">
                    <p>ID</p>
                    <strong>{{master.id}}</strong>
                  </div>
              </div>`

}


/**
 * 作品
 * @ rest:     图片、视频 集合
 * @ type:     文件类型   1: 图片  2: 视频
 * @ name:     作品名字
 * @ content:  作品内容
 */
var woRksdeta = {
    props: {
        //接收标题数据
        wodata: [],
        title: ""
    },
    template:`<ul class="works_uli">
                <h3 v-if="title" class="init_title">{{title}}</h3>
                <li v-for="item in wodata">
                    <div v-if="item.rest">
                        <div v-if="item.rest.length == 0">
                            <b><img :src="urlDefa" alt=""></b>
                        </div>
                        <div v-if="item.rest.length != 0">
                            <b v-if="item.rest[0].type == 0"><img class="lazy" :data-original="item.rest[0].url" alt=""></b>
                            <b v-if="item.rest[0].type == 1">
                                <video  controls="controls" loop="loop" :poster="item.rest[0].basImg" x5-playsinline="" playsinline="" webkit-playsinline="">
                                    <source :src="item.rest[0].url" type="video/mp4" />
                                </video>
                            </b>
                        </div>
                        <!--<div v-if="item.rest.length >= 3" class="active">-->
                            <!--<b v-for="val in item.rest" v-if="val.type == 0"><img class="lazy" :data-original="val.url" alt=""></b>-->
                            <!--<b v-for="val in item.rest" v-if="val.type == 1">-->
                                <!--<video  controls="controls" loop="loop" :poster="val.basImg" x5-playsinline="" playsinline="" webkit-playsinline="">-->
                                    <!--<source :src="val.url" type="video/mp4" />-->
                                <!--</video>-->
                            <!--</b>-->
                        <!--</div>-->

                        <!-- @ <=3 数量显示 -->

                        <!--<p class="works_num" v-if="item.rest.length == 2">-->
                            <!--<i><img src="../../assets-wiki/images/shop/Group 111.png" alt=""></i>-->
                            <!--<span>{{item.rest.length}}</span>-->
                        <!--</p>-->

                        <!-- @ >=3 数量的显示 -->
                        <!--<div class="works_active_num" v-if="item.rest.length > 3">-->
                            <!--<p>共<span>{{item.rest.length}}</span>张</p>-->
                        <!--</div>-->

                        <!-- 您点击的是这里  -->
                        <div class="works_click" @click="btnWorks(item.urlId)"></div>
                    </div>
                    <div>
                        <h2 v-if="item.name">{{item.name}}</h2>
                        <p v-if="item.content">{{item.content}}</p>
                    </div>
                </li>
            </ul>`,
    data: function () {
      return {
          urlDefa: ossDefault.list_374
      }
    },
    methods:{
        //子组件向父组件传值
        btnWorks: function(id){
            // this.$emit('btn-init',true);
            // this.$emit('work-id',id)
            window.location.href = hrefUrl.pages + hrefUrl.encydetails + id + '&type=2';
        }
    }
}






/**
 * 列表正在加载
 * @type {{}}
 */
var listLoad = {
    props:{
        state:""
    },
    template:`<div class="load_list" v-if="state">
                <img src="../../assets-wiki/images/shop/load-list.gif" alt="">
              </div>`
}


/**
 * 轮播图
 * @type swiper 数据
 * @type imgUrl 图片地址
 */
var ndSwiper = {
    props: {
        swiper: []
    },
    template: `<div class="swiper-container">
                    <div class="swiper-wrapper">
                        <div class="swiper-slide" v-for="item in swiper" v-if="item.imgUrl">
                            <a :href="item.url + '?id=' + item.id" v-if="item.id">
                                <template v-if="!item.type">
                                    <img class="lazy" :data-original="item.imgUrl" alt="">
                                </template>
                                <template v-if="item.type==1">
                                    <img class="lazy" :data-original="item.imgUrl"  alt="">
                                </template>
                                <template v-if="item.type==2">
                                    <img class="lazy" :data-original="item.imgUrl"  alt="">
                                </template>
                            </a >
                            <!--<a href="javascript:;" v-if="!item.id">-->
                                <!--<template v-if="!item.type">-->
                                    <!--<img :src="item.imgUrl" alt="">-->
                                <!--</template>-->
                                <!--<template v-if="item.type==1">-->
                                    <!--<img :src="item.imgUrl" alt="">-->
                                <!--</template>-->
                                <!--<template v-if="item.type==2">-->
                                    <!--<img :src="item.imgUrl" alt="">-->
                                <!--</template>-->
                            <!--</a >-->
                        </div>
                    </div>
                    <div class="swiper-pagination"></div>
                </div>`
};




//懒加载
function onloding(dom) {
    app.$nextTick(function() {
        dom.lazyload({
            placeholder: "../../assets-wiki/images/default/default.png"
        });
    })
}
//删除本地存储
function removeLost() {
    localStorage.removeItem("default-channel");  //频道
    localStorage.removeItem("handleScroll");  //浏览高度
    localStorage.removeItem("diaSpage");   //百科/综述分页数
    localStorage.removeItem("updata");   //列表数据、列表分页、
}

//存储分页、当前浏览数据
function _setUpdata(objData) {
    var obj = JSON.stringify(objData);
    localStorage.setItem("updata", obj);
}
//拿取分页、当前浏览数据
function _getUpdata() {
    var objData = JSON.parse(localStorage.getItem("updata"));
    return objData;
}

//判断是否是分享后的页面
function _htmlShear() {

    var status = "";

    callApp(null, function () {
        //H5
        if(getHttpParam('share')){
            //分享后的页面
            status = true;
        }else{
            //原页面
            status = false;
        }
    })
    return status;
}
