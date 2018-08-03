cordova.define("cordova-plugin-setting.SettingPlugin", function(require, exports, module) {
var exec = require('cordova/exec');

// 跳转到系统设置页面
exports.startSettingActivity = function(arg0,success,error){
  exec(success,error,"SettingPlugin",'startSetting',[arg0]);
};

// 显示缓存
exports.showCache = function(arg0,success,error){
  exec(success,error,"SettingPlugin",'showCache',[arg0]);
};



// 清除缓存
exports.cleanCache = function(arg0,success,error){
  exec(success,error,"SettingPlugin",'cleanCache',[arg0]);
};

exports.share = function(data,success,error){

            var title = data.title;
            var content = data.content;
            var imageUrl = data.imageUrl;
//            var htmlUrl = data.htmlUrl
            var htmlUrl = data.htmlUrl

   var args = [title,content,imageUrl,htmlUrl];

  exec(success,error,"SettingPlugin",'share',args);

};


// 调用展示应到也
exports.showGuidePager = function(arg0,success,error){
  exec(success,error,"SettingPlugin",'showGuidePager',[arg0]);
};

});
