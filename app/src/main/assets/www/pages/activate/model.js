



//
// /**
//  * params {}
//  * url 请求地址
//  * type 请求类型
//  * data 请求类型
//  * sCallback 请求成功回调
//  * @param params
//  */
//
// var httpInfo = function (params) {
//     if (!params.type) {
//         params.type = "POST";
//     }
//
//     console.log(params);
//
//     // console.log('000-',params)
//     $.ajax({
//         type: params.type,
//         url: params.url,
//         data: params.data,
//         dataType: "JSON",
//         xhrFields: {
//             withCredentials: true
//         },
//         success: function (res) {
//             console.log('11->',res)
//             params.sCallback && params.sCallback(res);
//         },
//         error: function (error) {
//             // console.log('error->', error)
//         }
//     })
// };






/**
 * 活化馆首页banner
 * @param url
 * @param data
 * @param callback
 * @param atlasId
 */
var getBannerData = function (url, data, callback, atlasId) {
    var params = {
        url: url,
        data: data,
        sCallback: function (data) {
            // console.log(data);

            var _data = data.data;
            var result = {          //总数据集合
                banner: []        //banner数据

            };

            var typeUrl = null;  //临时记录项目、传承人图片路径
            for(var i = 0; i < _data.length; i++){
                var content = _data[i].baseModel.contentFragmentList;   //图片 视频
                var model = _data[i];   // id type

                /**
                 * _url_ :  文件name
                 * type :   项目、传承人、 地方
                 * id :     连接ID
                 */
                var _url_, type, id, back;

                //targetType 0 1 8  改变不同的图片连接地址
                switch (model.targetType){
                    case "0":                //项目   博物馆     project
                        type = oss.project;
                        id = model.baseModel.id;
                        srcUrl = "museum.html";
                        forAll(196);
                        break;
                    case "1":                //传承人    传承人馆    master
                        type = oss.master;
                        id = model.baseModel.id;
                        srcUrl = "master.html";
                        forAll(197);
                        break;
                    case "8":                //地方馆    regionHall
                        type = oss.regionHall;
                        id = model.baseModel.id;
                        srcUrl = "local.html";
                        forAll(202);
                        break;
                }



                function forAll(attrId) {
                    for(var j = 0; j < content.length; j++){
                        if(content[j].attributeId ==  attrId){

                            if(content[j].resourceList.length > 0){

                                if(content[j].resourceList[0].type == 0){   //图片indexOf("http://") < 0
                                    if(content[j].resourceList[0].uri != ""){
                                        _url_ = content[j].resourceList[0].uri.indexOf("http://") < 0 ? oss.picUrl + type + content[j].resourceList[0].uri + oss.handle.domain + oss.handle.ossBanner : content[j].resourceList[0].uri;
                                    }else{
                                        _url_ = "";
                                    }
                                }else{         //视频
                                    if(content[j].resourceList[0].uri != ""){
                                        _url_ = content[j].resourceList[0].uri.indexOf("http://") < 0 ? oss.picVideo + type + content[j].resourceList[0].uri + oss.handle.domain + oss.handle.ossBanner : content[j].resourceList[0].uri;
                                    }else{
                                        _url_ = "";
                                    }
                                    back = content[j].resourceList[0].thumbnailUri + oss.handle.domain + oss.handle.ossBanner;              //视频的封面图
                                }

                            }else{
                                _url_ = "";
                            }

                        }
                    }
                }





                // if(content[j].attributeId ==  197){
                //     if(content[j].resourceList[0].type == 0){   //图片indexOf("http://") < 0
                //         if(content[j].resourceList[0].uri != ""){
                //             _url_ = content[j].resourceList[0].uri.indexOf("http://") < 0 ? oss.picUrl + type + content[j].resourceList[0].uri + oss.handle.domain + oss.handle.ossBanner : content[j].resourceList[0].uri;
                //         }else{
                //             _url_ = ossDefault.list_320;
                //         }
                //     }else{         //视频
                //         if(content[j].resourceList[0].uri != ""){
                //             _url_ = content[j].resourceList[0].uri.indexOf("http://") < 0 ? oss.picVideo + type + content[j].resourceList[0].uri + oss.handle.domain + oss.handle.ossBanner : content[j].resourceList[0].uri;
                //         }else{
                //             _url_ = ossDefault.list_320;
                //         }
                //         back = content[j].resourceList[0].thumbnailUri + oss.handle.domain + oss.handle.ossBanner;              //视频的封面图
                //     }
                // }
                // if(content[j].attributeId ==  202){
                //     if(content[j].resourceList[0].type == 0){   //图片indexOf("http://") < 0
                //         if(content[j].resourceList[0].uri != ""){
                //             _url_ = content[j].resourceList[0].uri.indexOf("http://") < 0 ? oss.picUrl + type + content[j].resourceList[0].uri + oss.handle.domain + oss.handle.ossBanner : content[j].resourceList[0].uri;
                //         }else{
                //             _url_ = ossDefault.list_320;
                //         }
                //     }else{         //视频
                //         if(content[j].resourceList[0].uri != ""){
                //             _url_ = content[j].resourceList[0].uri.indexOf("http://") < 0 ? oss.picVideo + type + content[j].resourceList[0].uri + oss.handle.domain + oss.handle.ossBanner : content[j].resourceList[0].uri;
                //         }else{
                //             _url_ = ossDefault.list_320;
                //         }
                //         back = content[j].resourceList[0].thumbnailUri + oss.handle.domain + oss.handle.ossBanner;              //视频的封面图
                //     }
                // }

                //赋值数据
                result.banner.push({
                    url: srcUrl,
                    id: id,
                    imgUrl: _url_,
                    backImg: back
                })

            }
            callback && callback(result);
        }
    }

    httpRequest(params);
}




/**
 * 传承人馆  百科
 * @param url
 * @param data
 * @param callback
 */

var getMasterData = function (url, data, callback, atlasId, objmsg) {
    var params = {
        url: url,
        data: data,
        sCallback: function (data) {

            // console.log(data);

            var _data = data.data;
            var result = {          //总数据集合
                basModelId:"",      //记录当前传承人馆的id
                total:"",           //共有几条数据
                banner:{},          //banner题图
                area:{},            //头像
                info:{              //基本信息 || 短文本
                    id:"",
                    infotext:[]
                },
                basData:[],          //长文本  图文
                listmenu:[],         //右侧菜单
                urlset:[],            //图集
                shareId:""         //分享ID

            };

            result.total = data.total;

            var typeUrl = null;  //临时记录项目、传承人图片路径

            //固定的基本信息
            result.listmenu.push({
                name:"基本信息",
                id: 9527
            })

            // console.log('msg->', objmsg);

            if(objmsg == true){
                var content = _data[0].baseModel.contentFragmentList;
                result.basModelId = _data[0].id;
                //分享ID
                result.shareId = _data[0].baseModel.id;

                // console.log('1222222222222',_data[0].baseModel.id)
            }else{
                var content = _data.baseModel.contentFragmentList;
                result.basModelId = _data.id;   //当前馆的ID
                //分享ID
                result.shareId = _data.baseModel.id;
            }


            for(var j = 0; j < content.length; j++){

                // banner题图 attributeId == 13 为中文名
                if(content[j].attributeId == 13){
                    result.banner.title = content[j].content ? content[j].content : "";
                    //头像名字
                    result.area.title = content[j].content ? content[j].content : "";
                }

                // banner题图  attributeId == 10 为图片 uri
                if(content[j].attributeId == 189){
                    //如果resourceList为空   则显示默认图  否则  去第一个图片
                    if(content[j].resourceList.length > 0){
                        if(content[j].resourceList[0].uri != ""){                                                   //+ oss.handle.domain + oss.handle.ossShopBanner
                            result.banner.url = content[j].resourceList[0].uri.indexOf("http://") < 0 ? oss.picUrl + oss.master + content[j].resourceList[0].uri : content[j].resourceList[0].uri;
                        }else{
                            result.banner.url = ossDefault.list_320;
                        }
                    }else{
                        // 默认图
                        result.banner.url = ossDefault.list_320;
                    }
                }

                // attributeId == 113 为头像 uri
                if(content[j].attributeId == 113){
                    //头像图片
                    if(content[j].resourceList.length > 0){
                        if(content[j].resourceList[0].uri != ""){
                            result.area.portImg = content[j].resourceList[0].uri.indexOf("http://") < 0 ? oss.picUrl + oss.master + content[j].resourceList[0].uri + oss.handle.domain + oss.handle.ossHeadPortrait : content[j].resourceList[0].uri;
                        }else{
                            // 默认图
                            result.area.portImg = ossDefault.head + oss.handle.domain + oss.handle.ossHeadPortrait;
                        }
                    }else{
                        // 默认图
                        result.area.portImg = ossDefault.head + oss.handle.domain + oss.handle.ossHeadPortrait;
                    }
                }

                //头像地域
                if(content[j].attributeId == 55){
                    result.area.copy = content[j].content ? getTextByTypeAndCode(content[j].attribute.dataType, content[j].content) : "";
                }

                //头像级别
                if(content[j].attributeId == 111){
                    result.area.text = content[j].content ? getTextByTypeAndCode(content[j].attribute.dataType, content[j].content) : "";
                }


                //图文dataType "1" || "5"
                if(content[j].attribute.dataType == 1 || content[j].attribute.dataType == 5){
                    // console.log(content[j].content);
                    //菜单数据
                    result.listmenu.push({
                        name: content[j].attribute.cnName,
                        id: content[j].id
                    });


                    //图文数据
                    if(content[j].resourceList.length > 0){
                        var _url_, type, len, text, httpUrl;
                        type = content[j].resourceList[0].type ? content[j].resourceList[0].type : "";
                        len = content[j].resourceList.length;
                        text = content[j].resourceList[0].description ? content[j].resourceList[0].description : "";
                        httpUrl = content[j].resourceList[0].uri;    //判断uri中的值是否含有http// ? 直接取 ： 加oss前缀
                        if(content[j].resourceList[0].type == 0){
                            _url_ = httpUrl.indexOf("http://") < 0 ? oss.picUrl + oss.master + content[j].resourceList[0].uri + oss.handle.domain + oss.handle.ossImageTitle : content[j].resourceList[0].uri;
                        }else{
                            _url_ = httpUrl.indexOf("http://") < 0 ? oss.picVideo + oss.master + content[j].resourceList[0].uri : content[j].resourceList[0].uri;
                        }
                    }else{
                        type = "";
                        _url_ = "";
                        text = "";
                    }
                    result.basData.push({
                        title: content[j].attribute.cnName,
                        id: content[j].id,
                        reset:{
                            type: type,
                            url: _url_,
                            basImg: ossDefault.list_320,
                            len: len
                        },
                        h_text: text,
                        content: content[j].content ? clearHtml(content[j].content) : ""
                    })

                }else {

                    result.info.len = result.info.infotext.length;
                    //基本信息attributeId = "0" || "2" || "3" 直接放入页面中
                    if(content[j].attribute.dataType == 0 || content[j].attribute.dataType == 2 || content[j].attribute.dataType == 3){
                        if(content[j].content != null && content[j].content != ""){
                            result.info.id = 9527;
                            result.info.infotext.push({
                                title: content[j].attribute.cnName,
                                text: content[j].content
                            });
                        }
                    }

                    //attributeId > 100
                    if(content[j].attribute.dataType > 100){
                        // 内容为编码的  根据编码   去别的表里去查ajax
                        var valContent = getTextByTypeAndCode(content[j].attribute.dataType, content[j].content);
                        result.info.infotext.push({
                            title: content[j].attribute.cnName,
                            text: valContent
                        });
                    }
                }


                //图集展示获取数据
                if(content[j].id == atlasId){
                    var resList = content[j].resourceList;
                    for(var z = 0; z < resList.length; z++){
                        var videoImg = "";
                        if(resList[z].type == 0){
                            videoImg = oss.picUrl + oss.master + resList[z].uri;
                        }else{
                            videoImg = oss.picVideo + oss.master + resList[z].uri;
                        }
                        result.urlset.push({
                            name: resList[z].description,
                            type: resList[z].type,
                            newUrl: videoImg,
                            basImg: ossDefault.list_320                            //没有数据先填写一张默认图
                        })
                    }
                }
            }

            //判断是否含有attribute == 10  没有为undexfined
            if(result.banner.url == undefined || result.banner.url == null || result.banner.url == ""){
                result.banner.url = ossDefault.list_320;
            }
            //判断是否含有attribute == 113  头像  没有为undexfined
            if(result.area.portImg == undefined || result.area.portImg  == null || result.area.portImg == ""){
                result.area.portImg = ossDefault.head + oss.handle.domain + oss.handle.ossHeadPortrait;
            }


            callback && callback(result);
        }
    }

    httpRequest(params);
}




/**
 * 咨询列表
 * @param url
 * @param data
 * @param callback
 * @param atlasId
 */

var getConsulData = function (url, data, callback) {
    var params = {
        url: url,
        data: data,
        sCallback: function (data) {
            // console.log('资讯',data);

            var _data = data.data;
            var result = {          //总数据集合
                newsData:[],         //资讯
                status:"",        //是否有无数据

            };

            var typeUrl = null;  //临时记录项目、传承人图片路径

            if(_data.length >= 5){
                result.status = true;
            }else{
                result.status = false;
            }


            for(var i = 0; i < _data.length; i++){
                 var content = _data[i].baseModel.contentFragmentList;

                 var obj = {
                    href: hrefUrl.pages + hrefUrl.newdetails + _data[i].baseModel.id,
                    data: "",
                    time: "",
                    title: "",
                    imgUrls: [],
                    source: ""
                 }

                // var date, time, title, imgUrls = [], source;
                for(var j = 0; j < content.length; j++){
                    if(content[j].attributeId == 186){
                        obj.title = content[j].content;
                    }
                    var conList  = content[j].resourceList;
                    if(content[j].attributeId == 159){
                        for(var z = 0; z < conList.length; z++){
                            var imgUri = conList[z].uri;
                            if(imgUri != ""){
                                if(conList[z].type == 0){
                                    obj.imgUrls.push(
                                        imgUri.indexOf("http://") < 0 ? oss.picUrl + oss.information + imgUri + oss.handle.domain + oss.handle.ossNewsImg : imgUri
                                    )
                                }else{
                                    obj.imgUrls.push(
                                        imgUri.indexOf("http://") < 0 ? oss.picVideo + oss.information + imgUri : imgUri
                                    )
                                }
                            }
                        }
                    }
                }

                var pubDate = _data[i].baseModel.lastEditDate;
                var date = new Date(pubDate.replace(new RegExp(/-/gm), "/"));
                obj.time = getDateDiff(date.getTime());
                obj.source = _data[i].baseModel.source;

                // if(imgUrls.length == 0){
                //     // imgUrls.push(ossDefault.list_138);
                // }

                result.newsData.push(obj);


            }



            callback && callback(result);
        }
    }

    httpRequest(params);
}







/**
 * 作品列表
 * @param url
 * @param data
 * @param callback
 * @param atlasId
 */
var getWorksData = function (url, data, callback, atlasId) {
    var params = {
        url: url,
        data: data,
        sCallback: function (data) {
            // console.log('作品zzzzzzzzzz',data.data);




            var _data = data.data;
            var result = {          //总数据集合
                worksContent: [],   //作品
                urlset:[],          //图集
                status: ""        //是否有数据   true有数据  false无数据
            };


            if(data.data.length >= 5){
                result.status = true;
            }else{
                result.status = false;
            }


            var typeUrl = null;  //临时记录项目、传承人图片路径
            for(var i = 0; i < _data.length; i++){

                var obj = {
                    rest: [],    //作品图片集合
                    name: "",    //作品name名字
                    content: "",    //作品text简介
                    _url: "",    //作品/图集  _url图片/视频路径
                    _basImg: "", //图集_basImg视频的封面图
                    type: "",    //图集 type值
                    nameDes: "",  //图集简介
                    urlId: _data[i].targetId,    //跳转链接
                    id: _data[i].id
                };


                var content = _data[i].baseModel.contentFragmentList;
                // var restArr = [];     //作品图片集合
                // var name,    //作品name名字
                //     text;    //作品text简介
                // var _url,    //作品/图集  _url图片/视频路径
                //     _basImg; //图集_basImg视频的封面图
                // var type,    //图集 type值
                //     nameDes; //图集简介

                for(var j = 0; j < content.length; j++){
                    //背景图
                    if(content[j].attributeId == 25){
                        var resouList = content[j].resourceList;
                        for(var z = 0; z < resouList.length; z++){
                            if(resouList[z].type == 0){
                                if(resouList[z].uri != ""){
                                    obj._url = resouList[z].uri.indexOf("http://") < 0 ? oss.picUrl + oss.works + resouList[z].uri + oss.handle.domain + oss.handle.ossImageTitle : resouList[z].uri;
                                }else{
                                    obj._url = ossDefault.list_320;
                                }
                                obj._basImg = "";
                            }else{
                                if(resouList[z].uri != ""){
                                    obj._url = resouList[z].uri.indexOf("http://") < 0 ? oss.picVideo + oss.works + resouList[z].uri : resouList[z].uri;
                                }else{
                                    obj._url = ossDefault.list_320;
                                }
                                obj._basImg = resouList[z].thumbnailUri + oss.handle.domain + oss.handle.ossImageTitle;       //缺少封面图的字段   暂时显示默认图

                            }



                            obj.type = resouList[z].type;
                            obj.nameDes = resouList[z].description;

                            obj.rest.push({
                                id: _data[i].id,
                                type: obj.type,
                                url: obj._url,
                                basImg: obj._basImg,
                                newUrl: obj._url.split("?x-oss-process=style")[0],
                                name: obj.nameDes,
                                basImg: obj._basImg
                            })
                        }
                    }

                    //名字
                    if(content[j].attributeId == 28){
                        obj.name = content[j].content;
                    }
                    //简介
                    if(content[j].attributeId == 31){
                        obj.content = content[j].content;
                    }
                }
                //作品数据



                result.worksContent.push(obj)
            }
            callback && callback(result);
        }
    }

    httpRequest(params);
}








/**
 * 博物馆   百科
 * @param url
 * @param data
 * @param callback
 * @param atlasId
 */
var getMuseumData = function (url, data, callback, atlasId, objmsg) {
    var params = {
        url: url,
        data: data,
        sCallback: function (data) {

            // console.log(data);

            var _data = data.data;
            var result = {          //总数据集合
                basModelId:"",      //记录当前博物馆的id
                total:"",           //数量
                banner:{},          //banner题图
                area:[],            //推荐传承人
                muse:{},            //标题人物
                inherItor:[],       //代表性传承人
                china:{},           //非遗在中国


                info:{             //基本信息 || 短文本
                    id:"",
                    infotext:[]
                },
                basData:[],         //长文本  图文
                listmenu:[],         //右侧菜单
                urlset:[],           //图集
                shareId:""         //分享ID

            };

            result.total = data.total;

            var typeUrl = null;  //临时记录项目、传承人图片路径

            //固定的基本信息
            result.listmenu.push({
                name:"基本信息",
                id: 9527
            })



            if(objmsg == true){
                var content = _data[0].baseModel.contentFragmentList;
                result.basModelId = _data[0].id;
                //分享ID
                result.shareId = _data[0].baseModel.id;

                //推荐传承人/代表性传承人  itemses
                var item = _data[0].itemses;
                //标题级别
                if(_data[0].baseModel.ichCategory != null){
                    result.muse.text = _data[0].baseModel.ichCategory.id ? getCategoryTextById(_data[0].baseModel.ichCategory.id) : "";
                }else{
                    result.muse.text = "";
                }

            }else{
                var content = _data.baseModel.contentFragmentList;
                result.basModelId = _data.id;

                //分享ID
                result.shareId = _data.baseModel.id;

                //推荐传承人/代表性传承人  itemses
                var item = _data.itemses;
                //标题级别
                result.muse.text = _data.baseModel.ichCategory.id ? getCategoryTextById(_data.baseModel.ichCategory.id) : "";
            }



            for(var j = 0; j < content.length; j++){

                // banner题图 attributeId == 4 为中文名
                if(content[j].attributeId == 4){
                    result.banner.title = content[j].content ? content[j].content : "";
                    //标题名字
                    result.muse.name = content[j].content ? content[j].content : "";
                }

                // banner题图  attributeId == 1 为图片 uri
                if(content[j].attributeId == 188){
                    //如果resourceList为空   则显示默认图  否则  去第一个图片oss.handle.domain + oss.handle.ossShopBanner
                    if(content[j].resourceList.length > 0) {
                        if(content[j].resourceList[0].uri != ""){                                       //+ oss.handle.domain + oss.handle.ossShopBanner
                            result.banner.url = content[j].resourceList[0].uri.indexOf("http://") < 0 ? oss.picUrl + oss.project + content[j].resourceList[0].uri : content[j].resourceList[0].uri;
                        }else{
                            result.banner.url = ossDefault.list_320;
                        }

                    }else{
                        // 默认图
                        result.banner.url = ossDefault.list_320;
                    }
                }


                //标题地域 33
                if(content[j].attributeId == 33){
                    result.muse.copy = content[j].content ? getTextByTypeAndCode(content[j].attribute.dataType, content[j].content) : "";
                }

                //非遗在中国
                //级别
                if(content[j].attributeId == 41){
                    result.china.level = content[j].content ? getTextByTypeAndCode(content[j].attribute.dataType, content[j].content) : "";
                }

                //ID编码
                if(content[j].attributeId == 2){
                    result.china.id = content[j].content ? content[j].content : "";
                }







                //图文 "1" || "5"
                if(content[j].attribute.dataType == 1 || content[j].attribute.dataType == 5){
                    // console.log(content[j].content);
                    //菜单数据
                    result.listmenu.push({
                        name: content[j].attribute.cnName,
                        id: content[j].id
                    });
                    //图文数据



                    if(content[j].resourceList.length > 0){
                        var _url_, type, len, text;
                        type = content[j].resourceList[0].type ? content[j].resourceList[0].type : "";
                        len = content[j].resourceList.length;
                        text = content[j].resourceList[0].description ? content[j].resourceList[0].description : "";
                        //oss.handle.domain + oss.handle.ossImageTitle
                        if(content[j].resourceList[0].type == 0){
                            //图片
                            if(content[j].resourceList[0].uri != 0){
                                _url_ = content[j].resourceList[0].uri.indexOf("http://") < 0 ? oss.picUrl + oss.project + content[j].resourceList[0].uri + oss.handle.domain + oss.handle.ossImageTitle : content[j].resourceList[0].uri;
                            }else{
                                _url_ = ossDefault.list_320
                            }
                        }else{
                            //视频
                            if(content[j].resourceList[0].uri != 0){
                                _url_ = content[j].resourceList[0].uri.indexOf("http://") < 0 ? oss.picVideo + oss.project + content[j].resourceList[0].uri : content[j].resourceList[0].uri;
                            }else{
                                _url_ = ossDefault.list_320
                            }
                        }
                    }else{
                        type = "";
                        _url_ = "";
                        text = "";
                    }
                    result.basData.push({
                        title: content[j].attribute.cnName,
                        id: content[j].id,
                        reset:{
                            type: type,
                            url: _url_,
                            basImg: ossDefault.list_320,
                            len: len
                        },
                        h_text: text,
                        content: content[j].content ? clearHtml(content[j].content) : ""
                    })

                }else {

                    result.info.len = result.info.infotext.length;
                    //基本信息attributeId = "0" || "2" || "3" 直接放入页面中
                    if(content[j].attribute.dataType == 0 || content[j].attribute.dataType == 2 || content[j].attribute.dataType == 3){
                        if(content[j].content != null && content[j].content != ""){
                            result.info.id = 9527;
                            result.info.infotext.push({
                                title: content[j].attribute.cnName,
                                text: content[j].content
                            });

                        }
                    }
                    //attributeId > 100
                    if(content[j].attribute.dataType > 100){
                        // 内容问编码的  根据编码   去别的表里去查ajax

                        var valContent = getTextByTypeAndCode(content[j].attribute.dataType, content[j].content);

                        result.info.infotext.push({

                            title: content[j].attribute.cnName,
                            text: valContent
                        });
                    }

                }


                //图集展示获取数据
                if(content[j].id == atlasId){
                    var resList = content[j].resourceList;
                    for(var z = 0; z < resList.length; z++){
                        var videoImg = "";
                        if(resList[z].type == 0){
                            videoImg = oss.picUrl + oss.project + resList[z].uri;
                        }else{
                            videoImg = oss.picVideo + oss.project + resList[z].uri;
                        }
                        result.urlset.push({
                            name: resList[z].description,
                            type: resList[z].type,
                            newUrl: videoImg,
                            basImg: ossDefault.list_320                            //没有数据先填写一张默认图
                        })

                    }
                }

            }


            //推荐传承人/代表性传承人  itemses   oss.handle.domain + oss.handle.ossHeadPortrait
            for(var t = 0; t < item.length; t++){
                var tmp_title, tmp_uri, _type;
                var mentList = item[t].baseModel.contentFragmentList;
                for(var u = 0; u < mentList.length; u++){
                    //名字
                    if(mentList[u].attributeId == 13 ){
                        tmp_title = mentList[u].content ? mentList[u].content : "";
                    }
                    //头像
                    if(mentList[u].attributeId == 113){
                        if(mentList[u].resourceList.length > 0){
                            if(mentList[u].resourceList[0].uri != ""){
                                tmp_uri = mentList[u].resourceList[0].uri.indexOf("http://") < 0 ? oss.picUrl + oss.master + mentList[u].resourceList[0].uri + oss.handle.domain + oss.handle.ossHeadPortrait : mentList[u].resourceList[0].uri;
                            }else{
                                tmp_uri = ossDefault.list_320;
                            }
                        }else{
                            tmp_uri = ossDefault.list_320;
                        }
                    }
                    //非遗级别
                    if(mentList[u].attributeId == 111){
                        _type = mentList[u].content ? getCategoryTextById(mentList[u].attribute.dataType ,mentList[u].content) : "";
                    }
                }
                //推荐传承人
                result.area.push({
                    title: tmp_title,
                    imgUrl: tmp_uri,
                    id: hrefUrl.pages + hrefUrl.encydetails + item[t].baseModel.id + "&type=1"
                });

                //代表性传承人
                result.inherItor.push({
                    name: tmp_title,
                    imgUrl: tmp_uri,
                    id: hrefUrl.pages + hrefUrl.encydetails + item[t].baseModel.id,
                    type: _type
                })

            }






            if(result.banner.url == undefined || result.banner.url == null || result.banner.url == ""){
                result.banner.url = ossDefault.list_320;
            }


            callback && callback(result);
        }
    }

    httpRequest(params);
}


/**
 * 博物馆 教学
 * @param url
 * @param data
 * @param callback
 * @param atlasId
 */
var getResetData = function (url, data, callback, atlasId) {
    var params = {
        url: url,
        data: data,
        sCallback: function (data) {
            // console.log('教学馆',data);


            var _data = data.data;
            var result = {          //总数据集合
                reset:[],
                status:""     //是否有数据
            };
            var typeUrl = null;  //临时记录项目、传承人图片路径

            if(_data.length >= 5){
                result.status = true;
            }else{
                result.status = false;
            }
            var title, imgurl, text;

            for(var i = 0; i < _data.length; i++){
                var content = _data[i].baseModel.contentFragmentList;
                for(var j = 0; j < content.length; j++){
                    //名字
                    if(content[j].attributeId == 160){
                        title = content[j].content;
                    }
                    //背景图oss.handle.domain + oss.handle.ossResetList
                    if(content[j].attributeId == 161){

                        if(content[j].resourceList.length > 0){
                            if(content[j].resourceList[0].type == 0 ){
                                //图片
                                if(content[j].resourceList[0].uri != ""){
                                    imgurl = content[j].resourceList[0].uri.indexOf("http://") < 0 ? oss.picUrl + oss.teaching + content[j].resourceList[0].uri + oss.handle.domain + oss.handle.ossResetList : content[j].resourceList[0].uri;
                                }else{
                                    imgurl = ossDefault.list_320;
                                }

                            }else{
                                //视频
                                if(content[j].resourceList[0].uri != ""){
                                    imgurl = content[j].resourceList[0].uri.indexOf("http://") < 0 ? oss.picVideo + oss.teaching + content[j].resourceList[0].uri : content[j].resourceList[0].uri;
                                }else{
                                    imgurl = ossDefault.list_320;
                                }
                            }
                        }else{
                            imgurl = ossDefault.list_320;
                        }


                    }
                    //简介
                    if(content[j].attributeId == 162){
                        text = content[j].content;
                    }
                }
                result.reset.push({
                    id: hrefUrl.pages + hrefUrl.teacdetails +  _data[i].id,
                    imgurl: imgurl,
                    title: title,
                    content: text
                })

            }





            callback && callback(result);
        }
    }

    httpRequest(params);
}





/**
 * 博物馆  活动列表
 * @param url
 * @param data
 * @param callback
 * @param atlasId
 */

var getActivaData = function (url, data, callback) {
    var params = {
        url: url,
        data: data,
        sCallback: function (data) {
            // console.log('活动////////////',data);

            var _data = data.data;
            var result = {          //总数据集合
                actiladd:[],            //活动
                status:"",              //是否有无数据

            };

            var typeUrl = null;  //临时记录项目、传承人图片路径

            if(_data.length >= 5){
                result.status = true;
            }else{
                result.status = false;
            }


            for(var i = 0; i < _data.length; i++){
                var content = _data[i].baseModel.contentFragmentList;
                // console.log(_data[i].baseModel);

                var obj = {
                    href: hrefUrl.pages + hrefUrl.actidetails + _data[i].baseModel.id,
                    data: "",
                    time: "",
                    title: "",
                    imgUrls: "",
                    source: "",
                    address: ""
                }
                var place = "";
                // var date, time, title, imgUrls, source, place;
                for(var j = 0; j < content.length; j++){
                    //标题
                    if(content[j].attributeId == 186){
                        obj.title = content[j].content ? content[j].content : "";
                    }
                    var conList  = content[j].resourceList;
                    //背景图
                    if(content[j].attributeId == 159){
                        var imgUri = conList[0].uri;
                        if(conList[0].type == 0){
                            obj.imgUrls = imgUri.indexOf("http://") < 0 ? oss.picUrl + oss.information + imgUri + oss.handle.domain + oss.handle.ossInforMationlist : imgUri
                        }else{
                            obj.imgUrls = imgUri.indexOf("http://") < 0 ? oss.picVideo + oss.information + imgUri : imgUri
                        }
                    }
                    //地点
                    if(content[j].attributeId == 187){
                        place = content[j].content ? content[j].content: "";
                    }




                }


                // var date = new Date(_data[i].baseModel.publishDate);
                // time = getDateDiff(date.getTime());

                var startItem =  _data[i].baseModel.startDate;
                var endItem = _data[i].baseModel.endDate;

                // console.log(startItem, endItem);

                obj.time = differTime(startItem.replace(new RegExp(/-/gm), "/"), endItem.replace(new RegExp(/-/gm), "/"))

                obj.source = _data[i].baseModel.source;
                obj.address = "地点: " + place.substr(0,15) + '...';


                result.actiladd.push(obj);


            }



            callback && callback(result);
        }
    }

    httpRequest(params);
}





/**
 * 博物馆  体验馆
 * @param url
 * @param data
 * @param callback
 * @param atlasId
 */
var getExperData = function (url, data, callback, atlasId) {
    var params = {
        url: url,
        data: data,
        sCallback: function (data) {
            // console.log('体验馆',data);

            var _data = data.data;
            var result = {          //总数据集合
                reset:[],
                status:""     //是否有数据
            };
            var typeUrl = null;  //临时记录项目、传承人图片路径

            if(_data.length >= 5){
                result.status = true;
            }else{
                result.status = false;
            }
            // var title, imgurl, address;

            for(var i = 0; i < _data.length; i++){

                var content = _data[i].baseModel.contentFragmentList;
                var obj = {
                    id: hrefUrl.pages + hrefUrl.experience + _data[i].baseModel.id,
                    title: "",
                    imgurl: "",
                    address: ""
                }



                for(var j = 0; j < content.length; j++){
                    //名字
                    if(content[j].attributeId == 165){
                        obj.title = content[j].content;
                    }
                    //背景图
                    if(content[j].attributeId == 164){
                        // oss.handle.domain + oss.handle.ossResetList
                        if(content[j].resourceList.length > 0){
                            if(content[j].resourceList[0].type == 0 ){
                                if(content[j].resourceList[0].uri != ""){
                                    obj.imgurl = content[j].resourceList[0].uri.indexOf("http://") < 0 ? oss.picUrl + oss.experienceHall + content[j].resourceList[0].uri + oss.handle.domain + oss.handle.ossResetList : content[j].resourceList[0].uri;
                                }else{
                                    obj.imgurl = ossDefault.list_320;
                                }
                            }else{
                                if(content[j].resourceList[0].uri != ""){
                                    obj.imgurl = content[j].resourceList[0].uri.indexOf("http://") < 0 ? oss.picVideo + oss.experienceHall + content[j].resourceList[0].uri : content[j].resourceList[0].uri;
                                }else{
                                    obj.imgurl = ossDefault.list_320;
                                }
                            }
                        }else{
                            obj.imgurl = ossDefault.list_320
                        }

                    }

                    //地址
                    if(content[j].attributeId == 166){
                        obj.address = content[j].content;
                    }



                }


                result.reset.push(obj);

            }





            callback && callback(result);
        }
    }

    httpRequest(params);
}






/**
 * 博物馆  传承人列表
 * @param url
 * @param data
 * @param callback
 * @param atlasId
 */

var getHertorData = function (url, data, callback) {
    var params = {
        url: url,
        data: data,
        sCallback: function (data) {
            // console.log('传承人////////////',data);

            var _data = data.data;
            var result = {          //总数据集合
                hertor:[],            //活动
                status:"",              //是否有无数据

            };

            var typeUrl = null;  //临时记录项目、传承人图片路径

            if(_data.length >= 5){
                result.status = true;
            }else{
                result.status = false;
            }


            for(var i = 0; i < _data.length; i++){
                var content = _data[i].baseModel.contentFragmentList;
                // var title, imgUrls, martype, info;
                var imgUrls = "";
                var obj = {
                    id: _data[i].baseModel.id,
                    type: 1,       //0项目  1传承人
                    typeName: "传承人",
                    title: "",
                    img: "",
                    marking: "",
                    info: ""
                }


                if(_data[i].baseModel == null){    //外加判断baseModel == null
                    continue;
                }

                
                for(var j = 0; j < content.length; j++){
                    //名字
                    if(content[j].attributeId == 13){
                        obj.title = content[j].content ? content[j].content : "";
                    }
                    var conList  = content[j].resourceList;
                    //背景图
                    if(content[j].attributeId == 113){
                        if(conList.length > 0){
                            var imgUri = conList[0].uri;

                            if(conList[0].type == 0){
                                if(imgUri != ""){
                                    //图片
                                    imgUrls = imgUri.indexOf("http://") < 0 ? oss.picUrl + oss.master + imgUri + oss.handle.domain + oss.handle.ossRecommendList : imgUri
                                }else{
                                    imgUrls = ossDefault.list_374
                                }

                            }
                            // else{
                            //     //视频
                            //     imgUrls = imgUri.indexOf("http://") < 0 ? oss.picVideo + oss.master + imgUri : imgUri
                            // }
                        }else{
                            imgUrls = ossDefault.list_374
                        }
                    }

                    //级别
                    if(content[j].attributeId == 111){
                        obj.marking = content[j].content ? getTextByTypeAndCode(content[j].attribute.dataType, content[j].content): "";
                    }
                    //简介
                    if(content[j].attributeId == 24){
                        obj.info = content[j].content ? content[j].content: "";
                    }

                    obj.img = imgUrls == undefined ? ossDefault.list_374  : imgUrls


                }

                //replace(/<.*?>/ig,"")
                result.hertor.push(obj);


            }



            callback && callback(result);
        }
    }

    httpRequest(params);
}








/**
 * 地方馆  综述
 * @param url
 * @param data
 * @param callback
 * @param atlasId
 */
var getLocalData = function (url, data, callback, atlasId, objmsg) {
    var params = {
        url: url,
        data: data,
        sCallback: function (data) {

            // console.log(data);

            var _data = data.data;
            var result = {          //总数据集合
                basModelId:"",
                total:"",           //总数据数量
                banner:{},          //banner题图
                efeiData:{},        //非遗数据
                area:[],            //热门推荐
                basData:[],         //长文本  图文
                listmenu:[],        //右侧菜单
                urlset:[],           //图集
                shareId:""         //分享ID
            };

            result.total = data.total;
            var typeUrl = null;  //临时记录项目、传承人图片路径

            // for(var i = 0; i < _data.length; i++){



            if(objmsg == true){
                var content = _data[0].baseModel.contentFragmentList;
                result.basModelId = _data[0].id;
                //分享ID
                result.shareId = _data[0].baseModel.id;


                //热门推荐  itemses  itemses
                var item = _data[0].itemses;
                //热门推荐  itemses
            }else{
                var content = _data.baseModel.contentFragmentList;
                result.basModelId = _data.id;  //当前馆的ID
                //分享ID
                result.shareId = _data.baseModel.id;

                //热门推荐  itemses  itemses
                var item = _data.itemses;


            }


            //热门推荐  itemses
            if(item.length > 0){
                for(var t = 0; t < item.length; t++){
                    var tmp_title, tmp_id;
                    var mentList = item[t].baseModel.contentFragmentList;
                    for(var u = 0; u < mentList.length; u++){
                        if(mentList[u].attributeId == 186 ){
                            tmp_title = mentList[u].content ? mentList[u].content : "";
                        }
                    }


                    if(item[t].baseModel.type == 0){
                        tmp_id = hrefUrl.pages + hrefUrl.newdetails + item[t].baseModel.id;       //资讯详情
                    }else{
                        tmp_id = hrefUrl.pages + hrefUrl.actidetails + item[t].baseModel.id;       //活动详情
                    }


                    result.area.push({
                        title: tmp_title,
                        id: tmp_id,
                        type: item[t].baseModel.type

                    });
                }
            }else{
                result.area = "";
            }




                for(var j = 0; j < content.length; j++){

                    // banner题图 attributeId == 178 为地方馆名
                    if(content[j].attributeId == 178){
                        result.banner.title = content[j].content ? content[j].content : "";
                    };

                    // banner题图  attributeId == 177 为图片 uri   oss.handle.domain + oss.handle.ossShopBanner
                    if(content[j].attributeId == 177){
                        //如果resourceList为空   则显示默认图  否则  去第一个图片
                        if(content[j].resourceList.length > 0) {
                            if(content[j].resourceList[0].uri != ""){                                                             // + oss.handle.domain + oss.handle.ossShopBanner
                                result.banner.url = content[j].resourceList[0].uri.indexOf("http://") < 0 ? oss.picUrl + oss.regionHall + content[j].resourceList[0].uri : content[j].resourceList[0].uri;
                            }else{
                                // 默认图
                                result.banner.url = ossDefault.list_320;
                            }
                        }else{
                            // 默认图
                            result.banner.url = ossDefault.list_320;
                        }
                    };

                    //非遗数据
                    switch (content[j].attributeId){
                        case "172":              //项目
                            result.efeiData.projectData = content[j].content ? content[j].content : "";
                            break;
                        case "173":              //国家级
                            result.efeiData.natiData = content[j].content ? content[j].content : "";
                            break;
                        case "174":              //省级
                            result.efeiData.provData = content[j].content ? content[j].content : "";
                            break;
                        case "175":              //市级
                            result.efeiData.cityData = content[j].content ? content[j].content : "";
                            break;
                    }

                    //图文 "1" || "5" oss.handle.domain + oss.handle.ossImageTitle
                    if(content[j].attribute.dataType == 1 || content[j].attribute.dataType == 5){








                        //菜单数据
                        result.listmenu.push({
                            name: content[j].attribute.cnName,
                            id: content[j].id
                        });

                        if(content[j].resourceList.length > 0){
                            var _url_, type, len, text;
                            type = content[j].resourceList[0].type ? content[j].resourceList[0].type : "";
                            len = content[j].resourceList.length;
                            text = content[j].resourceList[0].description ? content[j].resourceList[0].description : "";

                            if(content[j].resourceList[0].type == 0){
                                if(content[j].resourceList[0].uri != ""){
                                    _url_ = content[j].resourceList[0].uri.indexOf("http://") < 0 ? oss.picUrl + oss.regionHall + content[j].resourceList[0].uri + oss.handle.domain + oss.handle.ossImageTitle: content[j].resourceList[0].uri;
                                }else{
                                    _url_ = "";
                                }
                            }else{
                                if(content[j].resourceList[0].uri != ""){
                                    _url_ = content[j].resourceList[0].uri.indexOf("http://") < 0 ? oss.picVideo + oss.regionHall + content[j].resourceList[0].uri : content[j].resourceList[0].uri;
                                }else{
                                    _url_ = "";
                                }
                            }
                        }else{
                            type = 0;
                            _url_ = "";
                            text = "";
                        }
                        result.basData.push({
                            title: content[j].attribute.cnName,
                            id: content[j].id,
                            reset:{
                                type: type,
                                url: _url_,
                                basImg: ossDefault.list_320,
                                len: len
                            },
                            h_text: text,
                            content: content[j].content ? clearHtml(content[j].content) : ""
                        })


                    }






                    //图集展示获取数据
                    // console.log('atlasId=======',atlasId);
                    if(content[j].id == atlasId){
                        var resList = content[j].resourceList;
                        for(var z = 0; z < resList.length; z++){
                            var videoImg = "";
                            if(resList[z].type == 0){
                                videoImg = oss.picUrl + oss.regionHall + resList[z].uri;
                            }else{
                                videoImg = oss.picVideo + oss.regionHall + resList[z].uri;
                            }
                            result.urlset.push({
                                name: resList[z].description,
                                type: resList[z].type,
                                newUrl: videoImg,
                                basImg:  resList[z].thumbnailUri == "" ?  ossDefault.list_320 : resList[z].thumbnailUri + oss.handle.domain + oss.handle.ossImageTitle                //没有数据先填写一张默认图
                            })
                        }
                    }


                }








            // }

            //bener题图外加处理    当为undefined null ""
            if(result.banner.url == undefined || result.banner.url == null || result.banner.url == ""){
                result.banner.url = ossDefault.list_320;
            }

            // console.log(result.efeiData);
            callback && callback(result);
        }
    }

    httpRequest(params);
}







/**
 * 项目列表
 * @param url
 * @param data
 * @param callback
 * @param atlasId
 */

var getProjectData = function (url, data, callback) {
    var params = {
        url: url,
        data: data,
        sCallback: function (data) {

            var _data = data.data;
            var result = {          //总数据集合
                project:[],            //活动
                status:"",              //是否有无数据

            };

            var typeUrl = null;  //临时记录项目、传承人图片路径

            if(_data.length >= 5){
                result.status = true;
            }else{
                result.status = false;
            }



            for(var i = 0; i < _data.length; i++){
                var obj = {
                    id: "",
                    typeName: "项目",
                    type: 0,       //0项目  1传承人
                    title: "",
                    img: "",
                    marking: "",
                    info: ""
                }
                var content = _data[i].baseModel.contentFragmentList;
                for(var j = 0; j < content.length; j++) {
                    //名字
                    if(content[j].attributeId == 4){
                        obj.title = content[j].content ? content[j].content : "";
                    }

                    if(content[j].attributeId == 1) {
                        var conList  = content[j].resourceList;

                        if(conList.length > 0) {
                            if(conList[0].type == 0){
                                if(conList[0].uri != ""){
                                    obj.img = conList[0].uri.indexOf("http://") < 0 ? oss.picUrl + oss.project + conList[0].uri + oss.handle.domain + oss.handle.ossRecommendList : conList[0].uri
                                }else{
                                    obj.img = ossDefault.list_374;
                                }
                            }
                        }else{
                            obj.img = ossDefault.list_374;
                        }
                    }

                    //级别
                    if(content[j].attributeId == 111){
                        obj.marking = content[j].content ? content[j].content: "";
                    }
                    //简介
                    if(content[j].attributeId == 9){
                        obj.info = content[j].content ? content[j].content.replace(/<.*?>/ig,""): "";
                    }

                }
                obj.id = _data[i].baseModel.id;
                result.project.push(obj);
            }

            // var title, imgUrls, martype, info;
            // for(var i = 0; i < _data.length; i++){
            //     var content = _data[i].baseModel.contentFragmentList;
            //
            //     for(var j = 0; j < content.length; j++){
            //         //名字
            //         if(content[j].attributeId == 4){
            //             title = content[j].content ? content[j].content : "";
            //         }
            //         var conList  = content[j].resourceList;
            //
            //         if(conList.length > 0){
            //             //背景图
            //             if(content[j].attributeId == 1){
            //                 var imgUri = conList[0].uri;
            //                 if(conList[0].type == 0){
            //                     if(imgUri != ""){
            //                         imgUrls = imgUri.indexOf("http://") < 0 ? oss.picUrl + oss.project + imgUri + oss.handle.domain + oss.handle.ossRecommendList : imgUri
            //                     }else{
            //                         imgUrls = ossDefault.list_374;
            //                     }
            //                 }
            //             }
            //         }else{
            //             imgUrls = ossDefault.list_374;
            //         }
            //
            //
            //
            //
            //
            //
            //         //级别
            //         if(content[j].attributeId == 111){
            //             martype = content[j].content ? content[j].content: "";
            //         }
            //         //简介
            //         if(content[j].attributeId == 9){
            //             info = content[j].content ? content[j].content: "";
            //         }
            //
            //
            //     }
            //
            //
            //     result.project.push({
            //         id: _data[i].baseModel.id,
            //         typeName: "项目",
            //         type: 0,       //0项目  1传承人
            //         title: title,
            //         img: imgUrls == undefined ? ossDefault.list_374: imgUrls,
            //         marking: martype,
            //         info: info.replace(/<.*?>/ig,"")
            //     })
            //
            //
            // }



            callback && callback(result);
        }
    }

    httpRequest(params);
}














function differTime(start, end) {
    var dis = 86400000  //2天
    var _start = new Date(start)
    var _end = new Date(end)
    var _dis = _end.getTime() - _start.getTime()
    var result = ""

    if (_dis >= dis) {//大于等于2天
        result = convertTime(_start) + ' (' + getWeek(_start) + ')' + ' - ' + convertTime(_end) + ' (' + getWeek(_end) + ')'
    } else {//不足2天
        result = convertTime(_start) + '  ' + '(' + getWeek(start) + ')'
    }

    //转化时间
    function convertTime(date) {
        var month = (date.getMonth() + 1) + '/'
        var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
        return month + day
    }

    //根据时间判断星期几
    function getWeek(date, name) {  //timedat参数格式： "2017-10-27"
        var time = new Date(date)
        var week = null
        var _name = null
        //星期几的名称
        _name = !name ? '周' : name
        switch (time.getDay()) {
            case 0:
                week = _name + "日"
                break;
            case 1:
                week = _name + "一"
                break;
            case 2:
                week = _name + "二"
                break;
            case 3:
                week = _name + "三"
                break;
            case 4:
                week = _name + "四"
                break;
            case 5:
                week = _name + "五"
                break;
            case 6:
                week = _name + "六"
                break;
        }
        return week
    }

    return result
}













//
//
// /**
//  * 3D馆   百科
//  * @param url
//  * @param data
//  * @param callback
//  * @param atlasId
//  */
// var get3dData = function (url, data, callback, atlasId, objmsg) {
//     var params = {
//         url: url,
//         data: data,
//         sCallback: function (data) {
//
//             console.log(data);
//
//             var _data = data.data;
//             var result = {          //总数据集合
//                 basModelId:"",      //记录当前博物馆的id
//                 total:"",           //数量
//                 banner:{},          //banner题图
//                 area:[],            //推荐传承人
//                 muse:{},            //标题人物
//                 inherItor:[],       //代表性传承人
//                 china:{},           //非遗在中国
//
//
//                 info:{             //基本信息 || 短文本
//                     id:"",
//                     infotext:[]
//                 },
//                 basData:[],         //长文本  图文
//                 listmenu:[],         //右侧菜单
//                 urlset:[]           //图集
//
//             };
//
//             result.total = data.total;
//
//             var typeUrl = null;  //临时记录项目、传承人图片路径
//
//             //固定的基本信息
//             result.listmenu.push({
//                 name:"基本信息",
//                 id: 9527
//             })
//
//
//
//             if(objmsg == true){
//                 var content = _data[0].baseModel.contentFragmentList;
//                 result.basModelId = _data[0].id;
//                 //推荐传承人/代表性传承人  itemses
//                 var item = _data[0].itemses;
//                 //标题级别
//                 result.muse.text = _data[0].baseModel.ichCategory.id ? getCategoryTextById(_data[0].baseModel.ichCategory.id) : "";
//             }else{
//                 var content = _data.baseModel.contentFragmentList;
//                 result.basModelId = _data.id;
//                 //推荐传承人/代表性传承人  itemses
//                 var item = _data.itemses;
//                 //标题级别
//                 result.muse.text = _data.baseModel.ichCategory.id ? getCategoryTextById(_data.baseModel.ichCategory.id) : "";
//             }
//
//
//
//             for(var j = 0; j < content.length; j++){
//
//                 // banner题图 attributeId == 4 为中文名
//                 if(content[j].attributeId == 4){
//                     result.banner.title = content[j].content ? content[j].content : "";
//                     //标题名字
//                     result.muse.name = content[j].content ? content[j].content : "";
//                 }
//
//                 // banner题图  attributeId == 1 为图片 uri
//                 if(content[j].attributeId == 1){
//                     //如果resourceList为空   则显示默认图  否则  去第一个图片oss.handle.domain + oss.handle.ossShopBanner
//                     if(content[j].resourceList.length > 0) {
//                         if(content[j].resourceList[0].uri != ""){
//                             result.banner.url = content[j].resourceList[0].uri.indexOf("http://") < 0 ? oss.picUrl + oss.project + content[j].resourceList[0].uri + oss.handle.domain + oss.handle.ossShopBanner : content[j].resourceList[0].uri;
//                         }else{
//                             result.banner.url = ossDefault.list_320 + oss.handle.domain + oss.handle.ossShopBanner;
//                         }
//
//                     }else{
//                         // 默认图
//                         result.banner.url = ossDefault.list_320 + oss.handle.domain + oss.handle.ossShopBanner;
//                     }
//                 }
//
//
//                 //标题地域 33
//                 if(content[j].attributeId == 33){
//                     result.muse.copy = content[j].content ? getTextByTypeAndCode(content[j].attribute.dataType, content[j].content) : "";
//                 }
//
//                 //非遗在中国
//                 //级别
//                 if(content[j].attributeId == 41){
//                     result.china.level = content[j].content ? getTextByTypeAndCode(content[j].attribute.dataType, content[j].content) : "";
//                 }
//
//                 //ID编码
//                 if(content[j].attributeId == 2){
//                     result.china.id = content[j].content ? content[j].content : "";
//                 }
//
//
//
//
//
//
//
//                 //图文 "1" || "5"
//                 if(content[j].attribute.dataType == 1 || content[j].attribute.dataType == 5){
//                     // console.log(content[j].content);
//                     //菜单数据
//                     result.listmenu.push({
//                         name: content[j].attribute.cnName,
//                         id: content[j].id
//                     });
//                     //图文数据
//
//
//
//                     if(content[j].resourceList.length > 0){
//                         var _url_, type, len, text;
//                         type = content[j].resourceList[0].type ? content[j].resourceList[0].type : "";
//                         len = content[j].resourceList.length;
//                         text = content[j].resourceList[0].description ? content[j].resourceList[0].description : "";
//                         //oss.handle.domain + oss.handle.ossImageTitle
//                         if(content[j].resourceList[0].type == 0){
//                             //图片
//                             if(content[j].resourceList[0].uri != 0){
//                                 _url_ = content[j].resourceList[0].uri.indexOf("http://") < 0 ? oss.picUrl + oss.project + content[j].resourceList[0].uri + oss.handle.domain + oss.handle.ossImageTitle : content[j].resourceList[0].uri;
//                             }else{
//                                 _url_ = ossDefault.list_320 + oss.handle.domain + oss.handle.ossImageTitle
//                             }
//                         }else{
//                             //视频
//                             if(content[j].resourceList[0].uri != 0){
//                                 _url_ = content[j].resourceList[0].uri.indexOf("http://") < 0 ? oss.picVideo + oss.project + content[j].resourceList[0].uri : content[j].resourceList[0].uri;
//                             }else{
//                                 _url_ = ossDefault.list_320 + oss.handle.domain + oss.handle.ossImageTitle
//                             }
//                         }
//                     }else{
//                         type = "";
//                         _url_ = "";
//                         text = "";
//                     }
//                     result.basData.push({
//                         title: content[j].attribute.cnName,
//                         id: content[j].id,
//                         reset:{
//                             type: type,
//                             url: _url_,
//                             basImg: ossDefault.list_320,
//                             len: len
//                         },
//                         h_text: text,
//                         content: content[j].content ? content[j].content : ""
//                     })
//
//                 }else {
//
//                     result.info.len = result.info.infotext.length;
//                     //基本信息attributeId = "0" || "2" || "3" 直接放入页面中
//                     if(content[j].attribute.dataType == 0 || content[j].attribute.dataType == 2 || content[j].attribute.dataType == 3){
//                         if(content[j].content != null && content[j].content != ""){
//                             result.info.id = 9527;
//                             result.info.infotext.push({
//                                 title: content[j].attribute.cnName,
//                                 text: content[j].content
//                             });
//
//                         }
//                     }
//                     //attributeId > 100
//                     if(content[j].attribute.dataType > 100){
//                         // 内容问编码的  根据编码   去别的表里去查ajax
//
//                         var valContent = getTextByTypeAndCode(content[j].attribute.dataType, content[j].content);
//
//                         result.info.infotext.push({
//
//                             title: content[j].attribute.cnName,
//                             text: valContent
//                         });
//                     }
//
//                 }
//
//
//                 //图集展示获取数据
//                 if(content[j].id == atlasId){
//                     var resList = content[j].resourceList;
//                     for(var z = 0; z < resList.length; z++){
//                         var videoImg = "";
//                         if(resList[z].type == 0){
//                             videoImg = oss.picUrl + oss.project + resList[z].uri;
//                         }else{
//                             videoImg = oss.picVideo + oss.project + resList[z].uri;
//                         }
//                         result.urlset.push({
//                             name: resList[z].description,
//                             type: resList[z].type,
//                             url: videoImg,
//                             basImg: ossDefault.list_320                            //没有数据先填写一张默认图
//                         })
//
//                     }
//                 }
//
//             }
//
//
//             //推荐传承人/代表性传承人  itemses   oss.handle.domain + oss.handle.ossHeadPortrait
//             for(var t = 0; t < item.length; t++){
//                 var tmp_title, tmp_uri, _type;
//                 var mentList = item[t].baseModel.contentFragmentList;
//                 for(var u = 0; u < mentList.length; u++){
//                     //名字
//                     if(mentList[u].attributeId == 13 ){
//                         tmp_title = mentList[u].content ? mentList[u].content : "";
//                     }
//                     //头像
//                     if(mentList[u].attributeId == 113){
//                         if(mentList[u].resourceList.length > 0){
//                             if(mentList[u].resourceList[0].uri != ""){
//                                 tmp_uri = mentList[u].resourceList[0].uri.indexOf("http://") < 0 ? oss.picUrl + oss.master + mentList[u].resourceList[0].uri + oss.handle.domain + oss.handle.ossHeadPortrait : mentList[u].resourceList[0].uri;
//                             }else{
//                                 tmp_uri = ossDefault.list_320 + oss.handle.domain + oss.handle.ossHeadPortrait;
//                             }
//                         }else{
//                             tmp_uri = ossDefault.list_320 + oss.handle.domain + oss.handle.ossHeadPortrait;
//                         }
//                     }
//                     //非遗级别
//                     if(mentList[u].attributeId == 111){
//                         _type = mentList[u].content ? getCategoryTextById(mentList[u].attribute.dataType ,mentList[u].content) : "";
//                     }
//                 }
//                 //推荐传承人
//                 result.area.push({
//                     title: tmp_title,
//                     imgUrl: tmp_uri,
//                     id: hrefUrl.pages + hrefUrl.encydetails + item[t].baseModel.id
//                 });
//
//                 //代表性传承人
//                 result.inherItor.push({
//                     name: tmp_title,
//                     imgUrl: tmp_uri,
//                     id: hrefUrl.pages + hrefUrl.encydetails + item[t].baseModel.id,
//                     type: _type
//                 })
//
//             }
//
//
//
//
//
//
//             if(result.banner.url == undefined || result.banner.url == null || result.banner.url == ""){
//                 result.banner.url = ossDefault.list_320;
//             }
//
//
//             callback && callback(result);
//         }
//     }
//
//     httpRequest(params);
// }
//
