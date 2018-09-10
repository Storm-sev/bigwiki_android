// const domain = "http://123.57.174.187:8080/"; // 线上域名地址
//const rootName = "/info"; // 部署tomcat时候的目录名称

const domain = "http://test2.diich.com:8080"; // 测试名地址
//const domain = "http://www.diich.com"; // 正式名称地址

const androidRoute = "file:///android_asset/www"; // android绝对路径
const iosRoute = ""; // ios绝对路径
 const rootName = "../..";    //ios  android目录路径
 const setiing = "/.."        //ios  android设置目录路径
// const domain = "http://172.16.1.269:8080"; // 线上域名地址
// const domain = "http://172.16.1.269:8080"; // 线上域名地址


//const httpsUrl = 'http://123.57.173.1/info/pages/';  //分享后的域名地址
const httpsUrl = 'http://m.diich.com/info/pages/';  //分享后的域名地址

var overTime = 6000;    // 时间配置

/**
 * oss地址
 */
const oss = {
    picUrl: "http://resource.efeiyi.com/image/",  // 图片
    picVideo: "http://resource.efeiyi.com/video/", // 视频
    project: "project/", // 项目
    master: "master/", // 传承人
    works: "works/", // 作品
    organization: "organization/", // 机构
    information: "information/", // 咨询活动
    teaching: "teaching/", // 教学馆
    experienceHall: "experienceHall/", // 体验馆
    regionHall: "regionHall/", // 地方馆
    // oss 处理图片样式
    handle: {
        domain: "?x-oss-process=style/",
        homeBanner: "banner-head", // 首页banner
        encyBanner: "banner-background", // 百科banner
        encyList: "head-recommend-list", // 百科列表 改版前
        encyDetails: "img_details", // 详情
        pepoleList: "pepole-head-img", // 百科列表 改版后
        //活化馆
        ossBanner : "ndy_banner",        //活化馆首页banner
        ossShopBanner : "shop_banner",   //活化馆的题图
        ossHeadPortrait : "head_portrait",   //传承人馆头像
        ossImageTitle : "image_title",      //图文长文本图片、作品
        ossNewsImg : "news_img",      //资讯列表
        ossResetList : "reset_list",   //教学、体验馆列表
        ossInforMationlist : "head-recommend-informationlist",  //活动 列表
        ossRecommendList : "head-recommend-list",     //项目  传承人 列表
    },
    // default:{
    //     head: "uploads/head_portrait.png",   //默认传承人头像
    //     list: "http://resource.efeiyi.com/image/uploads/head.png"   //默认列表图
    // }
};

const api = {
    sendCode: domain + "/user/appGetVerifycode", // 注册发送验证码
    register: domain + "/user/appregister", // 注册
    login: domain + "/user/appLogin", // 登录
    getList: domain + "/items/getListByObjectId", // 获取集合
    // search: domain + "/searchH5",
    search: domain + "/searchH5",
    encySwiper: domain + "/navigationbar/getlist", // 百科轮播图
    projectDetails: domain + "/ichProject/get", // 项目详情
    masterDetails: domain + "/ichMaster/get", // 传承人详情
    // worksDetails: "http://192.168.1.105:80" + "/works/get", // 作品详情
    worksDetails: domain + "/works/get", // 作品详情
    targetId: domain + "/items/getByObjectIdAndTargetId", //活化馆-获取单页
    parentId: domain + "/items/getListByObjectIdAndParentId", //活化馆-获取子频道
    updataPhone: domain + "/user/updataphone", // 修改手机号码
    isPhome: domain + "/user/checkUserByPhone", // 手机号码是否已经注册
    forgetPassword : domain + "/user/forgetPassword", // 验证账号并发送验证码接口
    updataPassword : domain + "/user/updataPassword", // 更改密码接口并登陆
};

const hrefUrl = {
    pages: rootName + "/pages/",    //公共的pages文件夹下
    newdetails : "news/details.html?id=",       //资讯详情连接
    actidetails : "activity/details.html?id=",  //活动详情连接
    teacdetails : "details/teaching.html?id=",  //教学详情连接
    experience : "details/experience.html?id=", //体验馆详情连接
    encydetails : "ency/details.html?id=",      //项目、传承人详情连接
};

/**
 * 活化馆oss默认图
 */
var ossDefault = {
    head: "../../assets-wiki/images/default/head_portrait.png",
    list_138: "../../assets-wiki/images/default/head224_138.png",
    list_268: "../../assets-wiki/images/default/head498_268.png",
    list_320: "../../assets-wiki/images/default/head694_320.png",
    list_374: "../../assets-wiki/images/default/head694_374.png"
};

/**
 * params {}
 * url 请求地址
 * type 请求类型
 * data 请求类型： { phoneType 1 安卓 2 ios  3 H5  4 微信 }
 * sCallback 请求成功回调
 * @param params
 */
var httpRequest = function (params) {
    var edition;
    if (!params.type) {
        params.type = "POST";
        // params.data = null;
    }

    callApp(function (obj) {
        //ios/Andiold
        // console.log('---->',params);
        if (!params.data.appVersion) {
            params.data.appVersion = obj.appVers;
        }
        if (!params.data.phoneType) {
            params.data.phoneType = obj.type;
        }
        if (!params.data.resourceVersion) {
            params.data.resourceVersion = obj.H5vers;
        }
    });
    // console.log('params',params);
    $.ajax({
        url: params.url,
        type: params.type,
        data: params.data,
        dataType: "JSON",
        xhrFields: {
            withCredentials: true
        },
        // crossDomain: true,
        success: function (res) {
            if(res.code == -2){
                callApp(function () {

                    var objDate = {
                        code: res.code,
                        detailMsg: res.detailMsg
                    };
                    //app推送更新详细数据
                    pushTion(objDate);
                })
                return;
            }else{
                params.sCallback && params.sCallback(res);
            };

        },
        error: function (error) {
            ('error->', error)
            params.eCallback && params.eCallback(error);
        }
    })
}


/**
 * 获取轮播图数据
 */
var getSliderData = function (url, data, callback) {

    // 处理数据 参数：urlId图片路径  nameId名称  item当前对象
    function handleData(urlId, nameId, item) {
        var obj = {};
        // 背景图
        if(item.attributeId == urlId) {
            obj.imgUrl =  item.resourceList[0].uri
        } else {
            obj.imgUrl = '/assets-wiki/pics/ency.png';
        }
        // 名称
        if(item.attributeId == nameId) {
            obj.name =  item.content
        }
        return obj;
    }

    var params = {
        url: url,
        data: data,
        sCallback: function (data) {
            // console.log("data --- ", data)
            var _data = data.data;
            var result = [];
            //临时记录项目、传承人目录
            var typeUrl = null;
            //记录不同分类数据对应的轮播图 attributeId
            var id = null; 
            for (let i = 0; i < _data.length; i++) {
                var arr = _data[i].baseModel.contentFragmentList;
                for(let j = 0; j < arr.length; j++) {
                     _data[i].targetType == 0 && result.push(handleData("1", "4", arr[j])); //项目
                     _data[i].targetType == 1 && result.push(handleData("10", "13", arr[j])); // 传承人
                     _data[i].targetType == 2 && result.push(handleData("25", "28", arr[j])); // 作品
                     _data[i].targetType == 3 && result.push(handleData("132", "136", arr[j])); // 机构
                     _data[i].targetType == 5 && result.push(handleData("157", "159", arr[j])); // 咨询、活动
                     _data[i].targetType == 6 && result.push(handleData("160", "161", arr[j])); // 教学馆
                     _data[i].targetType == 7 && result.push(handleData("164", "165", arr[j])); // 体验馆
                     _data[i].targetType == 8 && result.push(handleData("177", "178", arr[j])); // 咨询、活动
                }

                // typeUrl = (_data[i].targetType == 0) ? api.picUrl + "project/" : api.picUrl + "master/";
                // result.push({
                //     "name": _data[i].baseModel.contentFragmentList[0].content,
                //     "imgUrl": typeUrl + _data[i].baseModel.contentFragmentList[1].resourceList[0].uri
                // })
            }
            callback && callback(result);
        }
    }

    httpRequest(params);
}

/**
 * 转换标准时间为时间戳
 * @params dateStr 数据库时间字符串 格式：2018/4/20
 */
var getDateTimeStamp = function getDateTimeStamp(dateStr) {
    return Date.parse(dateStr.replace(/-/gi, "/"));
}

/**
 * 时间格式化
 * @param  dateTimeStamp 时间戳
 *      0-5分钟展示 ‘刚刚’
 *      6-59分钟展示 ‘xx分钟前’
 *      1-23小时展示 ‘xx小时前’
 *      1-2天展示 ‘昨天/前天’
 *      3天以上展示 ‘xx天’
 *      7天以上展示 ‘xx周以前’
 *      1月以上展示 ‘xx月前’
 * 测试工具 http://tool.chinaz.com/Tools/unixtime.aspx
 */
var getDateDiff = function getDateDiff(dateTimeStamp) {
    var minute = 1000 * 60, hour = minute * 60, day = hour * 24, halfamonth = day * 15;
    month = day * 30, now = new Date().getTime(), diffValue = now - dateTimeStamp;
    // 当前时间减去参数时间为负数则不返回
    if (diffValue < 0) {
        return;
    }
    var monthC = diffValue / month, weekC = diffValue / (7 * day), dayC = diffValue / day,
        hourC = diffValue / hour, minC = diffValue / minute;

    if (monthC >= 1) {
        result = "" + parseInt(monthC) + "月前";
    }
    else if (weekC >= 1) {
        // result = "" + parseInt(weekC) + "周前";
        result = "" + parseInt(weekC*7) + "天前";
    }
    else if (dayC > 1) {
        if (day == 1) {
            result = "昨天";
        }
        else if (day == 2) {
            result = "前天";
        }
        else {
            result = "" + parseInt(dayC) + "天前";
        }
    }
    else if (hourC >= 1) {
        result = "" + parseInt(hourC) + "小时前";
    }
    else if (minC >= 6) {
        result = "" + parseInt(minC) + "分钟前";
    } else {
        result = "刚刚";
    }
    return result;
}

/**
 *   上拉加载  下拉刷新
 */
var initScroll = function initScroll($this, scrollId, pageSize, resCallback) {
    $this.mescroll = new MeScroll(scrollId, {
        up: {
            // offset: 80
            callback: function (page) {
                resCallback && resCallback(page);
            },
            // 回到顶部
            toTop: {
                src: "../../assets-wiki/images/mescroll-totop.png"
            },
            // use: true,
            // auto: true, // 是否在初始化完毕之后自动执行一次上拉加载的回调
            page: {
                size: pageSize
            },

            empty: { //配置列表无任何数据的提示
                warpId: "dataList",
                icon: "../../assets-wiki/images/mescroll-empty.png",
                tip: "亲,暂无相关数据哦~",
//                          btntext : "去逛逛 >" , 
//                          btnClick : function() {
//                              alert("点击了去逛逛按钮");
//                          } 
            }

        }
    })
}

//获取url参数
var getHttpParam = function (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}


/**
 * 获取登录状态
 * @returns false 未登录
 * @returns true 登录
 */
var loginStatus = function () {
    return !localStorage.getItem('__user__') ? false : true;
}


/**
 * 读取设置本地缓存
 * @type init 初始化本地缓存
 * @param getter 获取本地缓存
 *           key 关键词
 * @param setter 获取本地缓存
 *           key 关键词
 *         value 存入的数据
 */
var myLocalStorage = {
    init: function () {
        //不存在
        if (!this.getter('__user__') && !this.getter('__closeTip__')) {
            this.setter('__toolTip__', true)
        }
    },
    getter: function (key) {
        return JSON.parse(localStorage.getItem(key));
    },
    setter: function (key, value) {
        return localStorage.setItem(key, JSON.stringify(value));
    },
    remove: function (key) {
        localStorage.removeItem(key)
    }
}

/**
 * 读取设置本地缓存
 * @type init 初始化本地缓存
 * @param getter 获取本地缓存
 *           key 关键词
 * @param setter 获取本地缓存
 *           key 关键词
 *         value 存入的数据
 */
var mySessionStorage = {
    init: function () {
        //不存在
        if (!this.getter('__user__') && !this.getter('__closeTip__')) {
            this.setter('__toolTip__', true)
        }
    },
    getter: function (key) {
        return JSON.parse(sessionStorage.getItem(key));
    },
    setter: function (key, value) {
        return sessionStorage.setItem(key, JSON.stringify(value));
    }
}


//如果登录了在访问(注册、登录)
//直接访问登录或注册页面分两种情况
//1)已登录：直接跳转回首页
//2)未登录：登录返回数据
var loginRedirectIndex = function () {
    if (myLocalStorage.getter('__user__')) {
        window.location.href =  rootName + '/pages/index/'
    }
}

//判断是否登录
var isLogined = function (callback){
    var _this = this
    var params = {
        type: 'POST',
        data: {},
        url: domain + '/message/getMessageListByUserId',
        sCallback: function (res) {
            callback(res.code)
        }
    };
    httpRequest(params)
}


/**
 * 根据targetType获取类型名称
 * @param code targetType
 */
var getTypeName = function (code) {
    var str = "";
    switch (code) {
        case "0":
            str = "项目";
            break;
        case "1":
            str = "传承人";
            break;
        case "2":
            str = "作品";
            break;
        case "3":
            str = "机构";
            break;
        case "5":
            str = "活动/资讯";
            break;
        case "6":
            str = "教学馆";
            break;
        case "7":
            str = "体验馆";
            break;
        case "8":
            str = "地方馆";
            break;
        default:
            break;
    }
    return str;
}

/**
*   获取全部类型
*/
var getTypes = function() {
   return  [
        {
            name: '全部',
            code: ""
        },
        {
            name: "项目",
            code: "0"
        },
        {
            name: "传承人",
            code: "1"
        },
        {
            name: "作品",
            code: "2"
        },
        // {
        //     name: "机构",
        //     code: "3"
        // },
        // {
        //     name: "咨询/活动",
        //     code: "5"
        // },
        // {
        //     name: "教学馆",
        //     code: "6"
        // },
        // {
        //     name: "体验馆",
        //     code: "7"
        // },
        // {
        //     name: "地方馆",
        //     code: "8"
        // },
    ]
    
}

/**
   * 把带html除了<br/>之外的清除
   * 把\r\n转换成</br>
   */
function clearHtml ( html ) {
    if ( typeof html != 'string' ) {
      return '';
    }
    //替换所有的换行符
    html = html.replace(/\r\n/g,"<br>")
    html = html.replace(/\n/g,"<br>");
     
    //替换所有的空格（中文空格、英文空格都会被替换）
    html = html.replace(/\s/g,"&nbsp;");
     
    //输出转换后的字符串
    return html;
}

/**
 * 字典接口方法
 */
/**
 * 通过type和code获取字典文本
 * @param type 类型
 * @param code 字典编码
 * @param lang 语言，默认为中文（不传lang参数）
 * @returns {string}
 */
function getTextByTypeAndCode(type, code, lang) {
    if (typeof dic_arr == 'undefined') {
        // alert('请引入dictionary.js文件');
        return;
    }

    if (typeof lang == 'undefined') {
        lang = 'chi';
    }

    var text = '';

    if(type == 101 || type == 1011){

        var reg = new RegExp("[\\u4E00-\\u9FFF]+","g"); // 判断内容是否是汉字
　　     if(reg.test(code)){ 
            return code;
        }
        text =  getDicByCodeTypeAndLanguage(101,code,lang);
        return text != '' ? text : code;
    }

    for (var i = 0; i < dic_arr.length; i++) {
        var dic_obj = dic_arr[i];
        if (dic_obj.type == type && dic_obj.code == code
            && dic_obj.lang == lang) {
            text = dic_obj.name;
            if (dic_obj.parent_id == null) {
                break;
            } else {
                var parent_text = getDictionaryById(dic_obj.parent_id,type);
                text = parent_text + text;
            }
            break;
        }
    }

    if (text == '' && lang == 'eng') {
        for (var i = 0; i < dic_arr.length; i++) {
            var dic_obj = dic_arr[i];
            if (dic_obj.type == type && dic_obj.code == code
                && dic_obj.lang == 'chi') {
                text = dic_obj.name;
                break;
            }
        }
    }

    return text != '' ? text : code;
}
/**
 * 根据id查询字典表数据  (获取地区父类名称)
 * @param id
 * @returns {string}
 */
function getDictionaryById(id,type) {

    var text = '';

    if(type == 101){
        $.ajax({
            type: 'post',
            url: bdomain +'/dictionary/getParentNameById',
            data: {'parentId':id},
            dataType: 'json',
            async:false,
            beforeSend:function() {
            },
            success: function(data) {
                if(data.code==0){
                    text = data.data
                }
            },
            error: function () {
            },
            complete: function () {
            }
        });
    }else {
        for (var i = 0; i < dic_arr.length; i++) {
            var dic_obj = dic_arr[i];
            if (dic_obj.id != id) {
                continue;
            }

            text = dic_obj.name + text;

            if (dic_obj.parent_id == null) {
                break;
            } else {
                var parent_text = getDictionaryById(dic_obj.parent_id,type);
                text = parent_text + text;
            }
        }
    }

    return text;

    // return text;
}
/**
 * 获取同一类型的字典数据 (地区)
 * @param type 数据类型
 * @param lang 语言，默认为中文（不传lang参数）
 * @return {array}
 */
function getDictionaryArrayByType(type, lang) {
    if (typeof dic_arr == 'undefined') {
        alert('请引入dictionary.js文件');
        return;
    }

    if (typeof lang == 'undefined') {
        lang = 'chi';
    }

    var array = [];

    if(type == 101){
        $.ajax({
            type: 'post',
            url: domain+'/dictionary/getAllDis',
            data: {'type':type},
            dataType: 'json',
            async:false,
            beforeSend:function() {
            },
            success: function(data) {
                if(data.code==0){
                    array = data.data;
                }
            },
            error: function () {
            },
            complete: function () {
            }
        });

        return array;
    }

    for (var i = 0; i < dic_arr.length; i++) {
        var dic_obj = dic_arr[i];
        if (dic_obj.type == type && dic_obj.lang == lang) {
            array.push(dic_obj);
        }
    }

    return array;
}

/**
    获取地区
**/
function getDictionaryArrayByTypeAndParentID(type, parentId, lang) {
     if (typeof dic_arr == 'undefined') {
        alert('请引入dictionary.js文件');
        return;
    }

    if (typeof lang == 'undefined') {
        lang = 'chi';
    }

    var array = [];

    if(type== 101){
        $.ajax({
            type: 'post',
            // url: 'http://172.16.1.43/dictionary/getAreaListByParentId',
            url: domain + '/dictionary/getAreaListByParentId',
            data: {'type':type,'parentId':parentId,'lang':lang},
            dataType: 'json',
            async:false,
            xhrFields: {
                withCredentials: true
            },
            beforeSend:function() {
            },
            success: function(data) {
                if(data.code==0){
                    if($.type(data.data) == 'string') {
                        array = JSON.parse(data.data);
                    } else {
                        array = data.data;
                    }
                }
            },
            error: function () {
            },
            complete: function () {
            }
        });
    }else{
        for (var i = 0; i < dic_arr.length; i++) {
            var dic_obj = dic_arr[i];
            if (dic_obj.type == type && dic_obj.lang == lang) {
                array.push(dic_obj);
            }
        }
    }
    return array;
}


function getCategoryTextById(id) {
    if (typeof id == '' || id == null || id == '') {
        return '非遗项目';
    }

    var text = getCategoryById(id);
    text = text.substr(0, text.length - 3);

    if (text.length > 4) {
        text = text.substr(7, text.length - 1);
    }

    return text;
}

//获取分类 列表
function getCategoryList(type) {
    var temp = [];
    if (type == 0) {
        for (var i = 0; i < ich_category.length; i++) {
            var category = ich_category[i];
            if (category.parent_id == 0) {
                temp.push(category);
            }
        }
    }
    return temp;
}

// 获取子分类
function getChildrenList(parentId) {
    var temp = [];
    for (var i = 0; i < ich_category.length; i++) {
        var category = ich_category[i];
        if (category.parent_id == parentId) {
            temp.push(category);
        }
    }
    return temp;    
}

function getCategoryById(id) {
    var text = '';

    for (var i = 0; i < ich_category.length; i++) {
        var category = ich_category[i];
        if (category.id != id) {
            continue;
        }

        text = category.name + ' - ' + text;

        if (category.parent_id == null) {
            break;
        } else {
            var parent_text = getCategoryById(category.parent_id);
            text = parent_text + text;
        }
    }

    return text;
}

function getSingleCategoryText(_code, _data) {
    var _text = null;
    var lang = getCurrentLanguage();

    for (var i = 0; i < _data.length; i++) {
        if (_data[i].gbCategory == _code) {
            if (lang == 'en') {
                _text = _data[i].eNname;
            } else {
                _text = _data[i].name;
            }
            return _text;
        }

        if (_data[i].children != null) {
            _text = getSingleCategoryText(_code, _data[i].children);
        }

        if (_text != null) {
            break;
        }
    }

    return _text;
}

function getSingleCityText(_code, _data) {
    var _text = null;
    var lang = getCurrentLanguage();

    for (var i = 0; i < _data.length; i++) {
        if (_data[i].code == _code) {
            if (lang == 'en') {
                _text = _data[i].eNname;
            } else {
                _text = _data[i].name;
            }
            return _text;
        }

        if (_data[i].children != null) {
            _text = getSingleCityText(_code, _data[i].children);
        }

        if (_text != null) {
            break;
        }
    }

    return _text;
}

function uploadFile(uri) {
    $.ajaxFileUpload({
        url: uri,
        secureuri: false,
        fileElementId: 'file_upload',
        success: function (data) {

        },
        error: function (e) {
            alert(e.responseText);
        }
    });
}

function getTemplateUi(fileName, callback) {
    $.ajax({
        url: fileName,
        contentType: 'text/plain;charset=utf-8',
        dataType: 'text',
        success: function (data, status) {
            callback(data);
        }
    });
}
//error code message
function getMsgByCode(code, lang) {

    if (lang == 'zh-CN') {
        return error_message[code].msg;
    } else {
        return error_message[code].enMsg;
    }
}
/**
 *
 */
function  getDicData(parentId) {

    var data =[];
    $.ajax({
        type: 'post',
        url:domain+ '/dictionary/getChildenByParentId',
        data: {'parentId':parentId},
        dataType: 'json',
        async:false,
        beforeSend:function() {
        },
        success: function(data) {
            if(data.code==0){
                data = data.data
            }
        },
        error: function () {
        },
        complete: function () {
        }
    });
    return data;
}

function  getDicByCodeTypeAndLanguage(type,code,language) {

    var text ="";
    $.ajax({
        type: 'post',
        url: domain+'/dictionary/getTextByTypeAndCodeFromRedis',
        data: {type:type,code:code,language:language},
        dataType: 'json',
        async:false,
        beforeSend:function() {
        },
        success: function(data) {
            // console.log(data);
            if(data.code==0){
                text = data.data
            }
        },
        error: function () {
        },
        complete: function () {
        }
    });
    return text;
}




function generateMathRand(num) {
    var v = "";
    for (var i = 0; i < num; i++) {
        v += Math.floor(Math.random() * 10);
    }
    return v;
}

/**
 * 通用自定义请求
 * @param mode 请求方式
 * @param url 请求地址
 * @param params 参数
 * @returns {Promise}
 * @private
 */
function _onRequest(mode, url, params) {
    return new Promise(function (resolve, reject) {
        // 监听ajax请求成功后出发统一处理 ajax获取数据code != 0的自定义异常
        $(document).ajaxSuccess(function (e, x, o) {
            // o为ajax请求本身 x.responseJSON是返回结果
            //console.log("e --- >", e);
            //console.log("x --- >", x);
            //console.log("o --- >", o);

            if (x.responseJSON.code != 0) {
                console.log("登录");
            }
        });
        // jquery ajax
        $.ajax({
            async: true, // 异步请求
            dataType: "json", // 服务器返回的数据类型
            type: mode,
            url: url,
            data: params, // {params: JSON.stringify(params)}
            error: function (err) {
                reject(err)
            },
            success: function (res) {
                if (res.code == 0) {
                    resolve({res: res})
                }
            },
        });
    })
}

// 弹窗
var myDialog = {
    init: function () {
        this.create(el, url);
    },
    // code, wid, width, height, ifrId, url, title
    create: function (paramObj) {
        var code, wid, width, height, ifrId, url, title;

        if (!paramObj) {
            throw new Error('Parameter cannot be null!');
        } else {
            if (!paramObj.wid) {
                throw new Error('Parameter wid cannot be null!');
            }

            if (!paramObj.ifrId) {
                throw new Error('Parameter ifrId cannot be null!');
            }
            code = paramObj.code == 0 ? paramObj.code : 1; // 0固定弹窗  1自定义弹窗
            wid = paramObj.wid ? paramObj.wid : "project"; // 弹窗ID
            width = paramObj.width || paramObj.width;
            height = paramObj.height || paramObj.height;
            ifrId = paramObj.ifrId || paramObj.ifrId;
            url = paramObj.url || paramObj.url;
            title = paramObj.title ? paramObj.title : "提示";
        }

        if (code == 0) {
            var $ifrId = $('#' + ifrId);
            var wWidth = $(window).width() - 200;
            var wHeight = $(window).height() - 100;
            $ifrId.attr("width", wWidth);
            $ifrId.attr("height", wHeight);
            $ifrId.attr("src", url);
            var d = dialog({
                id: wid,
                width: wWidth,
                height: wHeight,
                fixed: true,
                hide: true,
                title: title,
                content: $('#' + ifrId),
                modal: true
            });
            d.show();
        } else {
            var d = dialog({
                id: wid,
                width: (width ? width : 800),
                height: (height ? height : 500),
                fixed: true,
                hide: true,
                title: title,
                content: $('#' + ifrId),
                modal: true
            });
            d.show();
        }
    },
    close: function (wid) {
        dialog.list[wid].close(); // 关闭窗口
    }

}

// 认领词条上传
var newUpload =  {
    // 模板
    tmp: '<div style="padding-top: 20%;">' +
    '<img src="../static/images/jia.png">' +
    '<p>上传照片</p>' +
    '</div>',

    // 创建上传
    create: function(id, url, params, callback) {
        var path = "";
        var objdata = {
            upfile_endpoint: "",//上传地址
            upfile_nametype:'random_name',//local_name random_name  上传文件的文件名类型
            upfile_defaltdir: url//上传路径 多层  格式  upload/floder1/floder2
        };
        // 获取oss 相关参数
        $.ajax({
            type : "post",
            url : domain + '/file/getPolicy',
            timeout : 10000,
            data : {},
            success : function(str) {
                //console.log("str -- >", str);
                if (str) {
                    try {
                        var re = JSON.parse(str);
                        // 构建上传oss参数
                        objdata.osssignature = {
                            'key' : url + re["filename"],//生成文件路径,
                            'policy': re["policy"],
                            'OSSAccessKeyId': re["accessid"],
                            'success_action_status' : '200', //让服务端返回200,不然，默认会返回204
                            'signature': re["signature"]
                        };
                        objdata.upfile_endpoint = re["host"];
                    } catch (e) {
                        alert("系统错误");
                    }
                } else {
                    alert("结果为空");
                }
            },
            error : function(XMLHttpRequest, textStatus, errorThrown) {
                alert("ajax error");
            },
            complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
                if(status == 'timeout'){
                    alert('请求超时，请稍后再试！');
                }
            },
            async : false
        });

        //console.log("objdata.osssignature -- >", objdata)
        // 初始化上传
        var uploader = WebUploader.create({

            // 选完文件后，是否自动上传。
            auto: true,

            // swf文件路径
            swf:  + '../require/webuploader/Uploader.swf',

            // 文件接收服务端。
            server: objdata.upfile_endpoint,

            // 选择文件的按钮。可选。
            // 内部根据当前运行是创建，可能是input元素，也可能是flash.
            pick: '#' + id,

            // 只允许选择图片文件。
            accept: {
                title: 'Images',
                extensions: 'gif,jpg,jpeg,bmp,png',
                //mimeTypes: 'image/*'
                mimeTypes: 'image/jpg,image/jpeg,image/png'
            }
        });

        // 当有文件添加进来的时候
        uploader.on( 'fileQueued', function( file ) {
            file["width"] = params["width"] ? params["width"] : "244px";
            file["height"] = params["height"] ? params["height"] : "172px";
            var mheight = $("#" + id).height();

            var $li = $(
                '<div id="' + file.id + '" class="webuploader-echo-div">' +
                '<img style="width: 100%; height:' + mheight + 'px">' +
                '<div class="webuploader-echo-mongolia" style="line-height:' + mheight + 'px;"><span id="delete-' + file.id + '" >删除</span></div>' +
                '</div>'
                ),
                $img = $li.find('img');

            $("#" + id).html($li);

            // 创建缩略图
            // 如果为非图片文件，可以不用调用此方法。
            // thumbnailWidth x thumbnailHeight 为 100 x 100
            uploader.makeThumb(file, function (error, src) {
                if (error) {
                    $img.replaceWith('<span>不能预览</span>');
                    return;
                }
                $img.attr('src', src);
            }, file.width.replace("px", ""), file.width.replace("px", ""));

            // 监听删除
            newUpload.delete(url, params, callback);

        })

        // 处理访问前参数
        uploader.on('uploadBeforeSend', function(obj, data, headers) {

            // 赋值参数
            data = $.extend(data, objdata.osssignature);
            data.key = data.key + "." + obj.file.ext;
            data.filepath = data.key;
            path =  data.key; // 记录用户上传的图片地址
            headers['Access-Control-Allow-Origin'] = "*"
            //console.log("data -- >", data)
        });

        // 上传成功
        uploader.on("uploadSuccess", function(file) {
            var res = {
                path: path,
                msg: "上传成功",
                code: "1"
            }
            callback(res);
        });

        // 上传失败
        uploader.on("uploadError", function(file) {
            var res = {
                path: path,
                msg: "上传失败",
                code: "0"
            }
            callback(res);
        });
    },

    // 删除插件
    delete: function(url, params, callback) {
        $("[id^='delete-']").off().on("click", function() {
            var thisID = $(this).attr("id");
            var id = $("#" + thisID).parent().parent().parent().attr("id")
            var cid = thisID.split("-").pop();

            //console.log(thisID)
            $("#" + cid).remove();
            $("#" + id).html(newUpload.tmp)
            newUpload.create(id, url, params, callback);
        })
    }
}

function getExtName(filename) {
    var d=/\.[^\.]+$/.exec(filename);
    return d;
}

function send_request() {
    var signituredata = {};

    $.ajax(domain + '/file/getPolicy', {
        type: "POST",
        data: {},
        dataType: 'json',
        async: false,
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success: function(data, status, xhr) {
            signituredata= JSON.parse(data);
        }
    });

    return signituredata;
}

(function($){
    $.getUri = function(url) {
        var strRegex = "/http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?(\/\w+)*.\w{3}$/";
        var reg = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?(\/\w+)*.\w{3}$/;

        var result = reg.exec(url); //result中存储分解下来的结果
        alert(RegExp.$1 + ',' + RegExp.$2 + ',' + RegExp.$3 + ',' + RegExp.$4+ ',' + RegExp.$5);
        // console.log(result);
        // var output = {}; //返回的结果
        // var item =["scheme","host","port","path","queries","q","p","hash"]; //由于得到的键值对需要单独处理，所以先赋值前四项
        // for(var i=1;i<5;i++){
        //     output[item[i-1]] = result[i];
        // }
        // console.log(output);
        // //分解键值对
        // var queries = result[5]; //queries存储得到的键值对
        // var keyValues = queries.split("&"); //keyValues存储进一步分解结果 ["q=234", "p=abc"]
        // var querySplit = {}; //存储得到的键和值对象 {q: "234", p:"abc"}
        // for(var j=0;j<keyValues.length;j++){
        //     querySplit[keyValues[j].split("=")[0]] = keyValues[j].split("=")[1];
        // }
        // output["queries"] = querySplit;//将id加到对象中
        // output["hash"] = result[6];
        // console.log(output);
    }
})(jQuery);

(function($){
    $.getUrlParam
        = function(name)
    {
        var reg
            = new RegExp("(^|&)"+
            name +"=([^&]*)(&|$)");
        var r
            = window.location.search.substr(1).match(reg);
        if (r!=null) return decodeURI(r[2]); return null;
    }
})(jQuery);

(function($){
    $.getRandomId
        = function() {
        return parseInt(Math.random() * Math.pow(10, 16));
    }
})(jQuery);


/**
 * 禁止横屏显示
 */

(function rotate(){
    var orientation=window.orientation;
    var pd = null;
    function createPd(){
        if(document.getElementById('preventTran') === null){
            var imgData = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAABaCAYAAADkUTU1AAAI9ElEQVR4Xu1cfXBcVRU/5+Z1N8GEj2AhFQvUIigfBetYaRVbBhADU2wHVoYk3bx3k8kMcSyFPxzUf8IfOjrqIHYUXbL3vW6mKXbtINapg1ColLEUnYIj9QPGOE0VdUjjlE3tdnffO87J7GY26yZ9H5tNst37X5tzzu/87rl777v3nnMR5rhFo9HLhBDrhRC3AMBqAFgBABfmYU8CwAgAHAGAVwDgJaXUO+Vc6u7uXhkOh0/GYrGxIC5jEOVZdLG3t7fdcZyHiOgORHSL4xDRfiHEE/F4fB8AEGNIKdcS0fMA8IxpmluC+OzWEdcY0Wh0jaZp2wFgjWulMoJE9CoRbRVCEHcCIp4PAOOpVOqSZDJp+7VdMcIbNmzQVqxYMYCIXwEA4dehEj2O+GlEfF/h/xFxfTwef9mv/YoQ7u/vb06n00kA+FypIxweAHgdAJ4DgF9nMpmj4+Pj77Jca2vr0nA4fC0ArAeAO4lotYvh/22l1JfnjXAkEmluaWn5JQB8ukx09hLRgGVZb7hxUNf1m4QQjxHRxlmI/0kpxZ3kqwWNMEopfwIAkRL0fwNAn1Lq51696ujouKKxsfEwAFw6k246nV45PDzMs7vnFoiwlPIRAPhuCeqbjuPcYVnWv7x609nZ+cFwOMzL0xVn0d2qlOKJ0XPzTZjXxYaGhqMAEC5C/aOmaetisRivr55aV1fXsiVLlhxExJVnU+QlyjTNz55NrtzffROWUj4DAJuKjI4j4up4PH7MjyOGYTyNiPe70SWiDCK+XymVciNfLOOLcDQaXaVpGk9EU/qO40Qtyxry6kBB3jCMpUQUEUJsIKIbEPEqANBmsseypmn+1CueL8JSyh8AQH8BjIiOmKb5ca/gs8l3dnae39jYeJfjODxjXw8APNSn1mMiUqZp9njF9EXYMIw3EfG6IsKbTNN81iu4F/mBgQExOjq6DgA2A8AnAeC3SqmHvdhgWb+E/4mIbXkwO5VKXZxMJj1PVF6drYS8X8IPI+K3AKCBiLabprmtEs5Uw4YvwuyYrusXnjlzRtu1a1eg7Vo1SAaepavtZCXxfEe4kk5U01adcDV7ez6w6hGej16vJmY9wtXs7fnAKhvhSCTS1NTUtFQIcZ5t2xUbBYjo+7TRbecIITKZTObk8PDwf8rpTCPT0dFxUTgc/ioA8Kdjg1uQhShHRG8T0bZTp069kEwmMwUfpwgbhnEtIv4GAC5YiAT8+sTEbdu+NZFI/GNqtxSJRFqbm5v/ioiFKxC/9heq3gki+qhpmu9ORrinp+cpIupdqN5WyK+fKaU2Y19f3wW5XO4Eb/XKGHYK9zteQIlIuDhQ92KyIrKO41yNhmF0IWLZsygi6jdN88mKoM2BEcMwHkTEH7o1TUSP8EH64wBQdgNfa4QBwCrcHHyhXC/VIOE9TJiPOu+tE+bZqsZ+wwBQj/C0kV2PsNv5v0pyXpel+pAuDUytDulfAMDd59KyVCdciPYiHdJj2Wx2zdDQ0N90Xf+wEILzRS7Kc5pch2spwg4iLo3H4+OFoEkpPwAAf8/flNYc4f1KqdtL5yMpJSfKfKqwLNVShA8rpW4uJdzT0/M6Ed1Uc4Q56w8RP6OU4ohOtu7u7tuEEM/nDyRqbkgzxywRDRLRbkTsRES9KDmmJgnP9mG7h494ONz/90NnrUW6LM1OWErJidd1wvUIV2nL5wXG7/awPqQX+bf0bIMkyd/S50yEiWi4Trh4PNTaOlyIMGfB3nMunHgQUYy/tL6RrzUqxzlJRFMf4l6WjErJIiJXajXPYG8NIm50izV5mabr+i1CCN+FT27BFoJcLpe7hi/EeeI6lE+6Xgh+zZUPu5VS909mAESj0as1TePqsfPmCm0+7RLRO7Ztr0okEiemklrypLlc7sr5dG4OsF8TQtwzODjIxWPTSwA4P6ulpYWrSh5DxE/MAXi1THKqBpcHfjOVSh0qrkadMelMStmSTqdbGxsbF1W+Vi6XOyOEOGFZVrpc71Ysy65aoQuKUycctAcXun49wgs9QkH9W5QR3rJly/VNTU0jsVjsv147YFERbm9vDy9btoxvA28koveI6POWZR3wQtoP4YLO5Bsb1Wy6rm8UQhSX2T+tlHrAiw+eCRuGsQcRbwOAo1xGK4T4VSaTeXFoaOiUF2A/slJKTpHkVMnJRkRPmqY5VdbrxqYfwuX2z1kA4Az0P/DzMgCwzzTN424c8CIjpdxd/MCC4zjbLMt6wosNz4R1Xb9ZCMHbydkaX+TxmzpcZ/xjpRSXzwdqfX19S3K5HG8ACrf5IIRYOzg4+KoXw54Jc+HysWPHuH74EpdA25VSW13Kziim6zqXy3OEC20slUq1eX2mxjNhRpNSmlxR64LEHk3THojFYjzkAzUp5e8AoLjs/kdKqQe9GvVLmNON+cGS2dpzjuNsmmnX4sVRXdc7hBA7i3R4hfiYUur3XuywrC/C/CBBOBzm93RC5QCJ6MWxsbGNe/fu9fxhUGovGo1e3tDQcAQRLy78jYieNU2z+EkN17x9Ec4P6xcAgJenaY2IDk5MTNyVTCYnXHsxgyB3bCgUehkRbywim7Ft+4ZEIvGWH/u+Ceu6/pAQ4ntlQF87ffr03UFL5Xt7ey+1bXsfP4ZSjOE4zqOWZfH7A76ab8JdXV1XhUKht2cY0qOO48gdO3bs9+OVYRh3AkAcES8r0edSHM7e5yMcX8034fyw/jMAXAMAXFNYehTETvFE83Wl1F/ceNfd3X2dEOJr+Sdqpj1CRkSHJyYmbg/6UwlE2DAMPuyLZLPZezVNiyFi6ZtazJOJ8+0F54Mdymazbx0/fnwyU2758uWtoVDoI7Ztr+WTRSJaW67eiSfBTCazeefOne+56bjZZAIRzhtmG8Q7mba2tu8AwBcrWKTFnfX4yMjIowcOHMgFJcv6lSA8zQ8p5a0AwJPZqiAOEtEb/AigZVkHg9gp1a04YQaIRCINzc3N9yHil4honYeIF4b/9/Pf374np5k6aU4IF4NJKT8EAO355E5+NelyACjcBvJ7WKMAwLusV3K53L5EIsH/nrP2PzAJNfmP9znfAAAAAElFTkSuQmCC';
            pd = document.createElement('div');
            pd.setAttribute('id','preventTran');
            pd.style.position = 'fixed';
            pd.style.left = '0';
            pd.style.top = '0';
            pd.style.width = '100%';
            pd.style.height = '100%';
            pd.style.overflow = 'hidden';
            pd.style.backgroundColor = '#2e2e2e';
            pd.style.textAlign = 'center';
            pd.style.zIndex = '99999';
            document.getElementsByTagName('body')[0].appendChild(pd);
            var img = document.createElement('img');
            img.src = imgData;
            pd.appendChild(img);
            img.style.margin = '60px auto 30rem/75px'
            var br = document.createElement('br');
            var p = document.createElement('p');
            p.style.width = '100%';
            p.style.height = 'auto';
            p.style.fontSize = '22rem/75px';
            p.style.color = '#626262';
            p.style.lineHeight = '34rem/75px';
            p.style.textAlign = 'center';
            p.innerHTML = '为了您的良好体验';
            p.appendChild(br);
            p.innerHTML += '请将手机/平板竖屏操作';
            pd.appendChild(p);
        }
    }
    if(orientation==90||orientation==-90){
        if(pd == null && document.getElementById('preventTran') === null) createPd();
        document.getElementById('preventTran').style.display = 'block';
    }
    window.onorientationchange=function(){
        if(pd == null && document.getElementById('preventTran') == null) createPd();
        document.getElementById('preventTran').style.display='none';
        rotate();
    };
})();


