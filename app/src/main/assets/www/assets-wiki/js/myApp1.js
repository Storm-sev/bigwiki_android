
/**
 * 判断是否是ios Android  手机系统
 * @return 1   ios
 * @return 2   Android
 * @return 3   微信
 * @return 4   其他浏览器
 * @type {string}
 */

var Resources = "1.0.0";    //资源版本号

var upiosAnd = function () {
    // var _getUser = "ios?1.0.0";
    var _getUser = navigator.userAgent;
    var iosAnd = _getUser.split("?")[0];
    var Edition =  _getUser.split("?")[1];
    var obj = {
        appVers: Edition,    //app版本号
        type: "",             //手机系统
        H5vers: Resources    //资源版本号
    };

    switch (iosAnd) {
        case "ios":
            obj.type = 1;
            return obj;
            break;
        case "Android":
            obj.type = 2;
            return obj;
            break;
        default:
            // h5端判断所属环境
            var ua = _getUser.toLowerCase();
            if(ua.match(/MicroMessenger/i) == 'micromessenger') {
                obj.type = 3;
                return obj; // 微信
            } else {
                obj.type = 4;
                return obj; // 其他浏览器
            }
            break;
    }
};

// 移动端接口定义
switch (upiosAnd().type) {
    case 1:
        // ios
        var btnSetting = function () { // 设置
            navigation.setting.openUserSetting()
        };

        var cacheData = function (callback) { // 获取缓存大小
            navigation.setting.getCache(
                function(result){
                    localStorage.setItem('cacheData',result)
                    callback && callback(result)

                },null,null)
        };

        var removeData = function (callback) { // 清除缓存
            navigation.setting.clearCache(
                function(result){
                    callback && callback(result)
                },null,null)
        };

        var shareCordova = function (data) { // 分享功能


            if(data.htmlUrl.indexOf('http://m.diich.com/info/pages/') == -1){
                data.htmlUrl = httpsUrl + data.htmlUrl + "&share=true";
            }
            navigation.setting.share(data);
        };

        var getOpen = function () { // 查看开平页面引导图
            navigation.setting.openGuide()
        };

        var c = 0;
        var pushTion = function (data) {   //发送ios版本
            c++;
            if(c == 1){
                navigation.setting.updateResource(data);
            }

        }

        //调研报告下载链接
        var researchReportDownUrl = function (url) {
            console.log(url)
        }
        break;
    case 2:

        // 安卓
        var btnSetting = function () { // 设置
            navigator.setting.startSettingActivity();
        };

        var cacheData = function (callback) { // 获取缓存大小
            // callback && callback("1M")
            navigator.setting.showCache(0, function onSuccess(cache){

                callback && callback(cache)

            }, function onError(){


            });

        };

        var removeData = function (callback) { // 清除缓存
            navigator.setting.cleanCache(0, function onCleanSuccess(){
                callback && callback();
            }, function onCleanError(){

            });



        };

        var shareCordova = function (data) { // 分享功能

            if(data.htmlUrl.indexOf('http://m.diich.com/info/pages/') == -1){
                data.htmlUrl = httpsUrl + data.htmlUrl + "&share=true";
            }
            navigator.setting.share(data);
        };

        var getOpen = function () { // 查看开平页面引导图
            navigator.setting.showGuidePager();
        };

        var c = 0;
        var pushTion = function (data) {   //发送Android版本
            if(c == 1){
                console.log("app=>接收的版本更新数据", data);
            }

        };

        //调研报告下载链接
        var researchReportDownUrl = function (url) {
            console.log('调用源生==========---------------======================')
            navigator.setting.downloadFile(url,function onSuccess(){

            },function onError(){

            });
        }

        break;
    default:
        var removeData = function (callback) { // 清除缓存
            // navigator.setting.cleanCache(0, function onCleanSuccess(){
                callback && callback();
            // }, function onCleanError(){

            // });

        };
        break;
};

/**
* 安卓、ios 统一回调
* callback 移动端回调
* callback1 H5回调
*/




function callApp(callback, callback1) {
    var code = upiosAnd().type;
    if(code == 1 || code == 2) {
        callback && callback(upiosAnd());
    } else {
        callback1 && callback1(upiosAnd());
    }
}