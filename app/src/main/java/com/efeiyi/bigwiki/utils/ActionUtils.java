package com.efeiyi.bigwiki.utils;


/**
 * 源于js 调用原生的tag
 */
public class ActionUtils {

    public static final String TAG = ActionUtils.class.getSimpleName();

    /**
     * toast
     */
    public static final String ACTION_SHOW_TOAST = "showToast";

    /**
     * 显示 dialog
     */
    public static final String ACTION_SHOW_DIALOG = "showDialog";


    /**
     * 显示带结果回调的dialog
     */
    public static final String ACTION_SHOW_DIALOG_CLICK = "showOnClickDialog";


    /**
     * 跳转到设置界面
     */
    public static final String ACTION_SETTRING = "startSetting";

    /**
     * 显示缓存
     */
    public static final String ACTION_SHOW_CACHE = "showCache";

    /**
     * 清除缓存
     */
    public static final String ACTION_CLEAN_CACHE = "cleanCache";


    // H5 登录成功后回调到原生
    public static final String ACTION_LOGIN_STATE_CALLBACK = "loginStateToAndroid";


    // 查看引导页面
    public static final String ACTION_SHOW_GUIDE = "showGuidePager";

    // 显示状态栏
    public static final String ACTION_SHOW_STATUSBAR = "showStatusBar";

    // 隐藏状态栏
    public static final String ACTION_HIDE_STATUSBAR = "hideStatusBar";

    // 分享
    public static final String ACTION_SHARE = "share";

    // 下载链接
    public static final String ACTION_DOWLNLOAD_FILE = "downloadFile";

    // 所谓的强制更新

    public static final String ACTION_PUSH_TINT = "pushTion";

}


