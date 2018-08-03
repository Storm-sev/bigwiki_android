const apiSlider = domain + '/items/getListByObjectId'
const apiList = domain + "/information/getList" //列表
const apiDetail = domain + "/information/get" //详情
const apiFeedback = domain + "/feedback/save" //详情报错
const ossInformation = 'http://resource.efeiyi.com/image/information/'


//项目
const CODE_PROJECT_TYPE = 0 //targetType
const CODE_PROJECT_TITLE = 4 //标题
const CODE_PROJECT_HEAD = 1 //头图
const CODE_PROJECT_RECOMMEND = 196 //推荐位
//传承人
const CODE_MASTER_TYPE = 1
const CODE_MASTER_TITLE = 13
const CODE_MASTER_HEAD = 10
const CODE_MASTER_AVATAR = 113
const CODE_MASTER_RECOMMEND = 197
//作品
const CODE_PRODUCT_TYPE = 2
const CODE_PRODUCT_TITLE = 28
const CODE_PRODUCT_HEAD = 25
const CODE_PRODUCT_RECOMMEND = 198
//资讯/活动
const CODE_INFORMATION_TYPE = 5
const CODE_INFORMATION_TITLE = 186
const CODE_INFORMATION_HEAD = 159
const CODE_INFORMATION_CONTENT = 163
const CODE_INFORMATION_ADDRESS = 187
const CODE_INFORMATION_SOURCE_ADDRESS = 181
const CODE_INFORMATION_RECOMMEND = 199

//
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

//处理数据
var handleCommonData = {
    init: function (base, data) {
        var id = base.id
        var type = base.type
        var targetType = base.targetType
        var ichCategoryId = base.ichCategoryId
        var result = []
        //数据格式
        var format = {}


        for (let i = 0; i < data.length; i++) {
            var _data = data[i]
            var _id = _data.attributeId

            format.id = id
            format.targetType = targetType

            if (targetType == 1) {
                // console.log('ichCategoryId->', ichCategoryId)
            }

            //轮播图
            base.objectId == 1 && (format.link = base.link)

            switch (targetType) {
                case CODE_PROJECT_TYPE://项目
                    format.flagName = '项目'
                    format.projectName = getCategoryTextById(ichCategoryId)
                    _id == CODE_PROJECT_TITLE && (format.title = _data.content)
                    _id == CODE_PROJECT_HEAD && (format.imgUrls = this.handMedia(targetType, _data))
                    if (_id == CODE_PROJECT_RECOMMEND) {
                        format.recommend = this.handMedia(targetType, _data)
                    } else {
                        format.recommend = ''
                    }
                    break;
                case CODE_MASTER_TYPE://传承人
                    format.flagName = '传承人'
                    format.projectName = getCategoryTextById(ichCategoryId)
                    _id == CODE_MASTER_TITLE && (format.title = _data.content)
                    _id == CODE_MASTER_HEAD && (format.imgUrls = this.handMedia(targetType, _data))

                    if (_id == CODE_MASTER_RECOMMEND) {
                        format.recommend = this.handMedia(targetType, _data)
                    } else {
                        format.recommend = ''
                    }
                    break;
                case CODE_INFORMATION_TYPE://资讯/活动
                    format.type = type
                    format.source = base.source
                    if (type == 0) {//资讯
                        format.href = rootName + '/pages/news/details.html?id=' + id
                        format.time = getDateDiff(getDateTimeStamp(base.time))
                    }
                    if (type == 1) {//活动
                        format.href = rootName + '/pages/activity/details.html?id=' + id
                        if (base.startDate && base.endDate) {
                            var sTime = base.startDate
                            var eTime = base.endDate
                            format.time = differTime(sTime.replace(new RegExp(/-/gm), "/"), eTime.replace(new RegExp(/-/gm), "/"))
                        }
                    }

                    if (_id == CODE_INFORMATION_ADDRESS) {
                        format.address = _data.content
                    }

                    if (_id == CODE_INFORMATION_TITLE) {
                        format.title = _data.content
                    }

                    // format.imgUrls = []
                    if (_id == CODE_INFORMATION_HEAD) {
                        format.imgUrls = this.handMedia(targetType, _data)
                    } else {
                        if (!format.imgUrls) {
                            format.imgUrls = []
                        }
                    }

                    if (_id == CODE_INFORMATION_RECOMMEND) {
                        format.recommend = this.handMedia(targetType, _data)
                    } else {
                        format.recommend = ''
                    }


                    //判断是几张图片
                    if (format.imgUrls.length == 0) {
                        format.className = 'len0'
                    } else if (format.imgUrls.length == 1) {
                        format.className = 'len1'
                    } else if (format.imgUrls.length >= 3) {
                        format.className = 'len2'
                    }
                    // format.imgUrls = (_id == CODE_INFORMATION_HEAD) ? this.handMedia(targetType, _data) : ['/assets-wiki/images/default/head224_138.png']
                    break;
                default:
                    break;
            }
        }
        return format
    },
    //处理图片resourceList
    handMedia: function (type, data) {
        var result = []
        var _data = data.resourceList
        for (let i = 0; i < _data.length; i++) {
            var uri = _data[i].uri
            switch (type) {
                case 0://项目
                    uri.indexOf('http') == -1 ? result.push(oss.picUrl + oss.project + uri) : result.push(uri)
                    break;
                case 1://传承人
                    uri.indexOf('http') == -1 ? result.push(oss.picUrl + oss.master + uri) : result.push(uri)
                    break;
                case 5:
                    uri.indexOf('http') == -1 ? result.push(ossInformation + uri) : result.push(uri)
                    break;
                case 6://教学馆
                // uri.indexOf('http') == -1 ? result.push(oss.picUrl + oss.teaching + uri) : result.push(uri)
                case 7://体验馆
                    uri.indexOf('http') == -1 ? result.push(oss.picUrl + oss.experienceHall + uri) : result.push(uri)
                    break;
                default:
                    break;
            }
        }
        return result
    },
    //输出指定类型的数据
    outputTargetType: function (targetType, data) {
        var result = []
        for (var i in data) {
            data[i].targetType == targetType && (result.push(data[i]))
        }
        return result
    }
}

/**
 * mescroll
 * @param $this
 * @param sCallback
 */
var initMescroll = function ($this, sCallback, sInited, pageObj) {
    $this.mescroll = new MeScroll('mescroll', {
        up: {
            callback: function (page) {
                sCallback && sCallback(page);
            },
            isBounce: false, //此处禁止ios回弹,解析(务必认真阅读,特别是最后一点)
            page: {
                size: 10
            },
            empty: { //配置列表无任何数据的提示
                warpId: "dataList",
                icon: "../../assets-wiki/images/icon-no-data@2x.png",
                tip: "<div class='upwarp-nodata'><p>暂无信息</p><p>当前没有更多信息，请稍后查询…</p></div>",
            },
            inited: function (a, b) {
                sInited && sInited(a, b)
            },
            onScroll: function (mescroll, y, isUp) {
                var name = window.location.pathname
                switch (name) {
                    case '/info/pages/index/index.html':
                        // pageObj.scroll = y
                        // mySessionStorage.setter('indexData', pageObj)
                        // console.log('pageObj->',pageObj)
                        break;
                    case '/info/pages/news/index.html':
                        // mySessionStorage.setter('newsScroll', y)
                        break;
                    case '/info/pages/activity/index.html':
                        // mySessionStorage.setter('activityScroll', y)
                        break;
                }
            }
        }
    })
}

/**
 * 获取轮播图数据
 * @param {*} params 需要传的参数
 * @param {*} callback 回调
 */
var getSlider = function (params, callback) {
    var _params = {
        url: apiSlider,
        data: params,
        sCallback: function (res) {
            var arr = res.data
            var result = []
            //处理baseModel

            for (let i = 0; i < arr.length; i++) {
                var _arr = arr[i].baseModel.contentFragmentList
                var base = {
                    objectId: 1,
                    id: arr[i].baseModel.id,
                    time: arr[i].lastEditDate,
                    targetType: parseInt(arr[i].targetType),
                    type: arr[i].baseModel.type ? parseInt(arr[i].baseModel.type) : '',
                    link: arr[i].link
                }
                result.push(handleCommonData.init(base, _arr))
            }
            callback && callback(handleSlider(result), res.total)
        }
    }

    function handleSlider(data) {
        var result = []
        for (let i = 0; i < data.length; i++) {
            var targetType = data[i].targetType
            var temp = {}
            temp.imgUrl = data[i].recommend.toString() + '?x-oss-process=style/banner-head'
            if (targetType == 0) {//项目
                temp.href = rootName + '/pages/ency/details.html?type=' + targetType + '&id=' + data[i].id
            }

            if (targetType == 1) {//传承人
                temp.href = rootName + '/pages/ency/details.html?type=' + targetType + '&id=' + data[i].id
            }

            if (targetType == 2) {//作品
                temp.href = rootName + '/pages/ency/details.html?type=' + targetType + '&id=' + data[i].id
            }

            if (targetType == 5) {//资讯
                data[i].type == 0 && (temp.href = rootName + '/pages/news/details.html?id=' + data[i].id)
                data[i].type == 1 && (temp.href = rootName + '/pages/activity/details.html?id=' + data[i].id)
            }
            result.push(temp)
        }
        return result
    }

    httpRequest(_params)
}

//获取首页内容列表
var getIndex = function (params) {
    var _this = this
    //返回数据的格式
    var _params = {
        url: apiSlider,
        data: params.data,
        sCallback: function (res) {
            var arr = res.data
            var result = []
            //处理baseModel
            for (let i = 0; i < arr.length; i++) {
                var _arr = arr[i].baseModel.contentFragmentList
                var ichCategoryId = ''
                //传承人
                if (arr[i].targetType == 1) {
                    if (arr[i].baseModel.ichProject && arr[i].baseModel.ichProject.ichCategoryId) {
                        ichCategoryId = arr[i].baseModel.ichProject.ichCategoryId
                    }
                }
                //项目名称
                if (arr[i].targetType == 0 && arr[i].baseModel.ichCategoryId) {
                    ichCategoryId = arr[i].baseModel.ichCategoryId
                }
                var base = {
                    id: arr[i].baseModel.id,
                    time: arr[i].lastEditDate,
                    targetType: parseInt(arr[i].targetType),
                    type: arr[i].baseModel.type ? parseInt(arr[i].baseModel.type) : '',
                    source: arr[i].baseModel.source ? arr[i].baseModel.source : '',
                    ichCategoryId: ichCategoryId,
                    endDate: arr[i].baseModel.endDate ? arr[i].baseModel.endDate : '',
                    startDate: arr[i].baseModel.startDate ? arr[i].baseModel.startDate : ''
                }
                result.push(handleCommonData.init(base, _arr))
            }
            params.callback && params.callback(result)
        }
    }
    httpRequest(_params)
}

/**
 * 获取资讯首页数据
 * @param params
 * @param callback
 */
var getNewsIndex = function (params, callback) {
    var data = {
        url: apiList,
        data: params,
        sCallback: function (res) {
            var arr = res.data

            if(arr){
                var total = res.total
                var result = []
                for (let i = 0; i < arr.length; i++) {
                    var _arr = arr[i].contentFragmentList
                    var base = {
                        id: arr[i].id,
                        time: arr[i].lastEditDate,
                        targetType: 5,
                        type: arr[i].type,
                        source: arr[i].source,
                        link: arr[i].link,
                        endDate: arr[i].endDate ? arr[i].endDate : '',
                        startDate: arr[i].startDate ? arr[i].startDate : ''
                    }
                    result.push(handleCommonData.init(base, _arr))
                }
            }else {
                result = mySessionStorage.getter('newsData')
                if(result){
                    total = result.total
                }
            }
            callback && callback(result, total)
        }
    }
    httpRequest(data)
}

//获取资讯详情
var getInformationDetail = function (type, callback, eCallback) {
    var data = {
        url: apiDetail,
        data: {
            id: getHttpParam('id')
        },
        sCallback: function (res) {
            var data = res.data.contentFragmentList
            var _source = res.data.source
            var _time = res.data.lastEditDate.substring(0, 10)


            var format = {
                title: '',//标题
                source: _source,//来源
                time: _time,//时间
                content: [],//正文
                shareContent: '',//未处理的正文
                headImg: '',//头图
                type: parseInt(res.data.type),//0是资讯，1是活动
                sourceAddress: '', //原文地址
                startDate:res.data.startDate,
                endDate:res.data.endDate,
            }
            var result = {}
            for (let i = 0; i < data.length; i++) {
                var attributeId = parseInt(data[i].attributeId)
                //标题
                attributeId == CODE_INFORMATION_TITLE && (format.title = data[i].content)
                //头图
                if (attributeId == CODE_INFORMATION_HEAD) {
                    if (data[i].resourceList[0].uri) {
                        let _uri = data[i].resourceList[0].uri
                        if (_uri.indexOf('http') == -1) {
                            _uri = ossInformation + _uri
                        }
                        format.headImg = _uri
                    }
                }
                //原文地址
                if (attributeId == CODE_INFORMATION_SOURCE_ADDRESS) {
                    format.sourceAddress = data[i].content
                }
                //原文地址
                if (attributeId == CODE_INFORMATION_ADDRESS) {
                    format.address = data[i].content
                }
                //正文
                if (attributeId == CODE_INFORMATION_CONTENT) {
                    let temp = {}
                    if (data[i].resourceList.length > 0) {
                        let _uri = data[i].resourceList[0].uri
                        if (_uri.indexOf('http') == -1) {
                            _uri = ossInformation + _uri
                        }
                        temp.picture = _uri
                    }
                    if (!format.shareContent) {
                        format.shareContent = data[i].content
                    }
                    temp.text = clearHtml(data[i].content)
                    format.content.push(temp)

                }
            }
            if (format.type == type) {
                result = {
                    code: 0,
                    data: format
                }
            } else {
                result = {
                    code: 1,
                    data: "没有数据"
                }
            }

            callback && callback(result)
        },
        eCallback: function (res) {
            eCallback && eCallback(result)
        }
    }
    httpRequest(data)
}

//获取教学馆详情
var getTeachingDetail = function (callback) {
    var data = {
        url: domain + '/teaching/get',
        data: {
            id: getHttpParam('id')
        },
        sCallback: function (res) {
            var data = res.data.contentFragmentList
            var result = {
                time: res.data.lastEditDate.substring(0, 10),
                content: []
            }
            for (let i = 0; i < data.length; i++) {
                var attributeId = parseInt(data[i].attributeId)
                switch (attributeId) {
                    case 160://标题
                        result.title = data[i].content
                        break;
                    case 161://头图
                        result.headImg = handleCommonData.handMedia(6, data[i])
                        break;
                    case 162://正文
                        result.content.push({
                            text: data[i].content,
                            picture: handleCommonData.handMedia(6, data[i])[0]
                        })
                        break;
                }

            }
            callback && callback(result)
        }
    }
    httpRequest(data)
}

//获取体验馆详情
var getExperienceDetail = function (callback) {
    var data = {
        url: domain + '/experienceHall/get',
        data: {
            id: getHttpParam('id')
        },
        sCallback: function (res) {
            var data = res.data.contentFragmentList
            var result = {
                time: res.data.lastEditDate.substring(0, 10),
                content: []
            }
            for (let i = 0; i < data.length; i++) {
                var attributeId = parseInt(data[i].attributeId)
                switch (attributeId) {
                    case 165://标题
                        result.title = data[i].content
                        break;
                    case 164://背景图
                        result.headImg = handleCommonData.handMedia(6, data[i])
                        break;
                    case 166://地址
                        // result.address = handleCommonData.handMedia(6, data[i])
                        break;
                    case 167://正文
                        result.content.push({
                            text: data[i].content,
                            picture: handleCommonData.handMedia(7, data[i])[0]
                        })
                        break;
                    case 162://正文
                        result.content.push({
                            text: data[i].content,
                            picture: handleCommonData.handMedia(6, data[i])[0]
                        })
                        break;
                }
            }
            callback && callback(result)
        }
    }
    httpRequest(data)
}


//资讯、活动、体验馆、教学分享
var appDetailShare = function (data, pageUrl) {
    var _data = data
    var temp = []
    var share = {}
    if (_data.headImg.length == 0) {
        _data.headImg = ['https://general-h5.oss-cn-beijing.aliyuncs.com/images/icon-default.png']
    }
    share.title = _data.title
    temp.push(_data.headImg)
    share.imageUrl = temp[0].toString()
    share.htmlUrl = pageUrl

    //提取第一段文字
    for (let i = 0; i < _data.content.length; i++) {
        var _text = _data.content[i].text
        if (!share.content) {
            share.content = _text
        }
    }

    if (!share.content && share.content.length == 0) {
        share.content = share.htmlUrl
    }
    return share
}