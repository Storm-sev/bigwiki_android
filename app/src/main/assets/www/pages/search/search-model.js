// 构建数据
function  bulidData(data) {
    var listData = [];
    // 根据不同的类型 获取拆分接口数据针对不同类型时所需要的不同的参数
    function handleData(params) {
        var arr = params.array.contentFragmentList; // 集合
        var obj = {
            'marking': params.marking,
            'type': params.type,
            'typeName': params.typeName,
            'id': params.id // 数据ID
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
                    if(arr[i].content.indexOf('http') < 0) {
                        obj.img = params.oss + arr[i].content + oss.handle.domain + oss.handle.encyList;
                    } else {
                        obj.img = arr[i].content;
                    }
                    break;
                default:
                    // console.log(" arr[i].attributeId ",  arr[i], arr[i].attributeId)
                    break;
            }
        }
        listData.push(obj);
    }

    // 根据不同的类型 获取拆分接口数据针对不同类型时所需要的不同的参数
    function getParams(array) {
        var params = {
            array: array,
            type: array.targetType,
            typeName: getTypeName(array.targetType),
            id: array.targetId
        };
        // 根据分类取出不同 attributeId
        switch (array.targetType) {
            case "0":
                // 项目
                var p = {
                    title:"4",
                    info:"9",
                    img:"1", // 背景图 项目
                    oss: oss.picUrl + oss.project,
                    marking: ""
                }
                if(array.ichCategoryId) {
                    p.marking = getCategoryTextById(array.ichCategoryId);
                }
                handleData(Object.assign(params, p));
                break;
            case "1":
                //
                var c = array.contentFragmentList;
                var p = {
                    title:"13",
                    info:"11",
                    img:"113", // 传承人 头像
                    oss: oss.picUrl + oss.master,
                    marking: ""
                }
                // 取出项目名称
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
                handleData(Object.assign(params, {title: "28", info: "31", img: "25", // 背景图 项目
                    oss: oss.picUrl + oss.works,
                    marking: ""
                }))
            default:
                break;
        }
        return params;
    }

    // 处理数据
    for(var i = 0; i < data.length; i++) {
        getParams(data[i]);
    }
    return listData;
}

// 推荐搜索数据、后端暂时无功能、暂写如下变量
var recommend = [
    {
        'keyword': '北京花丝镶嵌制作技艺'
    },
    {
        'keyword': '北京景泰蓝工艺'
    },
    {
        'keyword': '皮影戏（泰山皮影戏）'
    },
    {
        'keyword': '北京玉器'
    }
]