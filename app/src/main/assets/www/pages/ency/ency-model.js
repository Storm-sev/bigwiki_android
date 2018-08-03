// 首页  轮播图
const wkSwiper = {
    props: {
        swiper: []
    },
    template: `<div class="swiper-container">
                    <div class="swiper-wrapper">
                        <div class="swiper-slide" v-for="item in swiper">
                            <a :href="'###'+ item.id" v-if="item.id">
                                <template v-if="!item.type">
                                    <img :src="item.imgUrl" alt="">
                                </template>
                                <template v-if="item.type==1">
                                    <img :src="item.imgUrl" alt="">
                                </template>
                                <template v-if="item.type==2">
                                    <img :src="item.imgUrl" alt="">
                                </template>
                            </a>
                            <a href="javascript:;" v-if="!item.id">
                                <template v-if="!item.type">
                                    <img :src="item.imgUrl" alt="">
                                </template>
                                <template v-if="item.type==1">
                                    <img :src="item.imgUrl" alt="">
                                </template>
                                <template v-if="item.type==2">
                                    <img :src="item.imgUrl" alt="">
                                </template>
                            </a>
                        </div>
                    </div>
                    <div class="swiper-pagination"></div>
                </div>`
}   
    // 处理轮播图数据
    function buildSwiper(data) {
        // console.log("data --- >", data);
        var swiper = [];
        for(var i = 0; i < data.length; i++) {
            var obj = {};
            obj.name = data[i].name;
            obj.imgUrl = oss.picUrl + data[i].resource_OFF.uri + oss.handle.domain + oss.handle.encyBanner;
            swiper.push(obj);
        }
        return swiper;
    }

    function getDatas(page, params, successCallback, errorCallback) {
        params['currPage'] = page.num;
        params['pageSize'] = page.size;
        var param = {
            url: api.getList,
            data: params,
            sCallback: function (res) {
                // console.log("res -- >", res)
                if(res.total != -1) {
                     app.$data.total = res.total; // 记录总数据条数
                }
                if(res.code == 0 && res.data.length > 0) {
                    successCallback && successCallback(bulidData(res.data)); // 处理数据
                    // console.log(bulidData(res.data));
                } else {
                    var listData=[];
                    successCallback && successCallback(listData); // 处理数据
                }
            },
            eCallback: function (err) {
                errorCallback && errorCallback(err);
            }
        }
        httpRequest(param);
    }

    // // 构建数据
    function  bulidData(data) {
        // console.log("data -- ", data);
        var listData = [];
        function getParams(array) {
            // console.log("array -- >", array)
            var params = {
                array: array,
                type: array.targetType,
                typeName: getTypeName(array.targetType)
            };

            // 根据不同的类型 获取拆分接口数据针对不同类型时所需要的不同的参数
            function handleData(params) {
                var arr = params.array.baseModel.contentFragmentList; // 集合
                var obj = {
                    'marking': params.marking,
                    'type': params.type,
                    'typeName': params.typeName,
                    'id': params.array.baseModel.id // 数据ID
                };
                for(var i = 0; i < arr.length; i++) {
                    switch (arr[i].attributeId) {
                        case params.title:
                            // title 标题
                            obj.title = arr[i].content;
                            break;
                        case params.info:
                            // info 简介
                            obj.info = arr[i].content.replace(/<[^>]+>/g,"");
                            break;
                        case params.img:
                            // img 图片
                            if(arr[i].resourceList[0].uri.indexOf('http') < 0) {
                                obj.img = params.oss + arr[i].resourceList[0].uri + oss.handle.domain + oss.handle.encyList;
                            } else {
                                obj.img = arr[i].resourceList[0].uri;
                            }
                            break;
                        default:
                            // console.log(" arr[i].attributeId ",  arr[i], arr[i].attributeId)
                            break;
                    }
                }
                // // 项目处理图片默认图问题
                // if(params.img == 1) {
                //     if(!obj.img) {
                //         obj.img = "../../assets-wiki/pics/timg-30.png";
                //     }
                // }

                // // 传承人处理图片默认图问题
                // if(params.img == 113) {
                //     if(!obj.img) {
                //         obj.img = "../../assets-wiki/pics/timg-30.png";
                //     }
                // }
                // console.log("obj --- >", obj)
                listData.push(obj);
            }

            // 根据分类取出不同 attributeId
            switch (array.targetType) {
                case "0":
                    // 项目
                    handleData(Object.assign(params, {title:"4",info:"9",img:"1",
                        oss: oss.picUrl + oss.project,
                        marking: getCategoryTextById(array.ichCategoryId)}));
                    break;
                case "1":
                    // 传承人
                    // var c = array.baseModel.contentFragmentList;
                    var c = array.baseModel.ichProject ? array.baseModel.ichProject.contentFragmentList : "";
                    var p = {
                        title:"13",
                        info:"11",
                        // img:"10",
                         img:"113",
                        oss: oss.picUrl + oss.master,
                        marking: ""
                    }
                    
                    for(var i = 0; i < c.length; i++) {
                        if(c[i].attributeId == "4") {
                            p.marking = c[i].content; // 传承人标示取项目名称
                            break;
                        }
                    }
                    handleData(Object.assign(params, p));
                    break;
                case "2":
                    // 作品
                    var c = array.baseModel.ichMaster ? array.baseModel.ichMaster.contentFragmentList : "";
                    var p = {
                        title: "28",
                        info: "", 
                        img: "25",
                        oss: oss.picUrl + oss.works,
                        marking: ""
                    }
                    // 取出项目名称
                    for(var i = 0; i < c.length; i++) {
                        if(c[i].attributeId == "13") {
                            p.marking = c[i].content; // 传承人标示取项目名称
                             break;
                        }
                    }
                    handleData(Object.assign(params, p));
                    break;
                default:
                    break;
            }
            return params;
        }

        for(var i = 0; i < data.length; i++) {
            getParams(data[i]);
        }
        return listData;
    }