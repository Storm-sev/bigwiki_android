package org.apache.cordova.setting;

import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.ContentResolver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.graphics.Color;
import android.net.Uri;
import android.provider.Settings;
import android.text.Html;
import android.util.Log;
import android.widget.Toast;

import com.efeiyi.bigwiki.MainActivity;
import com.efeiyi.bigwiki.R;

import com.efeiyi.bigwiki.activity.GuideActivity;
import com.efeiyi.bigwiki.app.MApplication;
import com.efeiyi.bigwiki.utils.CleanManagerUtil;
import com.umeng.socialize.ShareAction;
import com.umeng.socialize.UMShareAPI;
import com.umeng.socialize.UMShareListener;
import com.umeng.socialize.bean.SHARE_MEDIA;
import com.umeng.socialize.media.UMImage;
import com.umeng.socialize.media.UMWeb;
import com.umeng.socialize.shareboard.ShareBoardConfig;

import org.apache.cordova.CordovaActivity;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CallbackContext;

import org.apache.cordova.Whitelist;
import org.json.JSONArray;
import org.json.JSONException;

import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.List;

import storm_lib.utils.AppUtils;
import storm_lib.utils.DialogHelper;
import storm_lib.utils.LogUtils;

import static com.efeiyi.bigwiki.utils.ActionUtils.ACTION_CLEAN_CACHE;
import static com.efeiyi.bigwiki.utils.ActionUtils.ACTION_DOWLNLOAD_FILE;
import static com.efeiyi.bigwiki.utils.ActionUtils.ACTION_HIDE_STATUSBAR;
import static com.efeiyi.bigwiki.utils.ActionUtils.ACTION_LOGIN_STATE_CALLBACK;
import static com.efeiyi.bigwiki.utils.ActionUtils.ACTION_SETTRING;
import static com.efeiyi.bigwiki.utils.ActionUtils.ACTION_SHARE;
import static com.efeiyi.bigwiki.utils.ActionUtils.ACTION_SHOW_CACHE;
import static com.efeiyi.bigwiki.utils.ActionUtils.ACTION_SHOW_GUIDE;
import static com.efeiyi.bigwiki.utils.ActionUtils.ACTION_SHOW_STATUSBAR;
import static com.umeng.socialize.utils.ContextUtil.getPackageName;

/**
 * This class echoes a string called from JavaScript.
 */
public class SettingPlugin extends CordovaPlugin {

    public static final String TAG = SettingPlugin.class.getSimpleName();

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        if (action.equals(ACTION_SETTRING)) {

            startSettingActivity(args, callbackContext);
            return true;
        }

        // H5 页面显示缓存
        if (action.equals(ACTION_SHOW_CACHE)) {
            showAppCache(args, callbackContext);
            return true;
        }

        // 清除缓存
        if (action.equals(ACTION_CLEAN_CACHE)) {
            cleanAppCache(args, callbackContext);
            return true;
        }
        if (action.equals(ACTION_LOGIN_STATE_CALLBACK)) {
            h5LoginCallBack(args, callbackContext);

            return true;

        }

        if (action.equals(ACTION_SHOW_GUIDE)) {
            showGuidePager(args, callbackContext);
            return true;
        }


        if (action.equals(ACTION_SHARE)) {
            share(args, callbackContext);
            return true;
        }

        if(action.equals(ACTION_DOWLNLOAD_FILE)) {

            downLoadFilePath(args, callbackContext);
            return true;
        }

        return false;
    }

    /**
     * 下载链接
     * @param args
     * @param callbackContext
     */
    private void downLoadFilePath(JSONArray args, CallbackContext callbackContext) {

        String filePath = null;

        try {
            filePath = args.getString(0);

            LogUtils.d(TAG, "获取需要复制的地址 " + filePath);

           ClipboardManager cm =
                   (ClipboardManager) MApplication.getAppContext().getSystemService(Context.CLIPBOARD_SERVICE);

            if (filePath != null && filePath.length() > 0) {

                ClipData mClipData = ClipData.newPlainText("Label", filePath);

                cm.setPrimaryClip(mClipData);

                // 显示 toast

                Toast.makeText(MApplication.appContext, "已复制到剪切板", Toast.LENGTH_SHORT).show();

            }

        } catch (JSONException e) {
            e.printStackTrace();
        }


    }

    private void share(JSONArray args, CallbackContext callbackContext) {


        ShareBoardConfig config = new ShareBoardConfig();


        String webUrl = null;
        String title = null;
        String content = null;
        String imageUrl = null;


        try {
            title = args.getString(0);
            content = args.getString(1);
            imageUrl = args.getString(2);
            webUrl = args.getString(3);

        } catch (JSONException e) {
            e.printStackTrace();
        }

        LogUtils.d(TAG,"页面链接 + " + webUrl);

        LogUtils.d(TAG, "获取的图片地址" + imageUrl);


        if(content.contains("<br/>")) {
            content = content.replaceAll("<br/>", "");
        }


        if(content.contains("<br>")) {
            content = content.replaceAll("<br>", "");
        }

        if(content.contains("<p>")) {
            content = content.replaceAll("<p>", "");
        }

        if (content.contains("&nbsp;")) {
            content = content.replaceAll("&nbsp;", "");
        }

        if(content.contains("/n")) {
            content = content.replaceAll("/n", "");
        }


        config.setShareboardBackgroundColor(Color.WHITE);
        config.setCancelButtonVisibility(false);
        config.setTitleText("点击分享");
        config.setMenuItemBackgroundColor(ShareBoardConfig.BG_SHAPE_NONE);

        UMWeb web = new UMWeb(webUrl);
        web.setTitle(title);
        web.setDescription(content);
        UMImage umimage = new UMImage(cordova.getActivity(), imageUrl);
        web.setThumb(umimage);

        // 获取手机是否安装
        UMShareAPI umShareAPI = UMShareAPI.get(cordova.getContext());

        boolean isQQ = umShareAPI.isInstall(cordova.getActivity(), SHARE_MEDIA.QQ);
        boolean isWeixin = umShareAPI.isInstall(cordova.getActivity(), SHARE_MEDIA.WEIXIN);

        ShareAction shareAction = new ShareAction(cordova.getActivity()).withMedia(web);


        if (isQQ && isWeixin) {

            shareAction.setDisplayList(SHARE_MEDIA.WEIXIN,
                    SHARE_MEDIA.WEIXIN_CIRCLE, SHARE_MEDIA.QQ);

        } else if (isQQ && !isWeixin) {

            shareAction.setDisplayList(SHARE_MEDIA.QQ);

        } else if (!isQQ && isWeixin) {

            shareAction.setDisplayList(SHARE_MEDIA.WEIXIN,
                    SHARE_MEDIA.WEIXIN_CIRCLE);

        } else {

            Toast.makeText(cordova.getActivity(), "没有安装任何分享软件", Toast.LENGTH_SHORT).show();
            return;
        }


        shareAction.setCallback(new UMShareListener() {
            @Override
            public void onStart(SHARE_MEDIA share_media) {


            }

            @Override
            public void onResult(SHARE_MEDIA share_media) {

                LogUtils.d(TAG, "onResult");

                if (share_media.equals(SHARE_MEDIA.WEIXIN)) {

                    Toast.makeText(cordova.getContext(), "微信分享成功", Toast.LENGTH_LONG).show();

                }


                if (share_media.equals(SHARE_MEDIA.WEIXIN_CIRCLE)) {
                    Toast.makeText(cordova.getContext(), "朋友圈分享成功", Toast.LENGTH_LONG).show();

                }


                if (share_media.equals(SHARE_MEDIA.QQ)) {
                    Toast.makeText(cordova.getContext(), "QQ分享成功", Toast.LENGTH_LONG).show();

                }

            }

            @Override
            public void onError(SHARE_MEDIA share_media, Throwable throwable) {
                LogUtils.d(TAG, "onError" + throwable.toString());
                Toast.makeText(cordova.getActivity(), "分享失败", Toast.LENGTH_SHORT).show();
            }


            @Override
            public void onCancel(SHARE_MEDIA share_media) {
                LogUtils.d(TAG, "onCancel");

                Toast.makeText(cordova.getActivity(), "取消分享", Toast.LENGTH_SHORT).show();

            }
        }).open(config);


    }

    private void startShare(UMWeb web, ShareBoardConfig config) {

        new ShareAction(cordova.getActivity()).withMedia(web).setDisplayList(

        )
                .setCallback(new UMShareListener() {
                    @Override
                    public void onStart(SHARE_MEDIA share_media) {

                        LogUtils.d(TAG, "onStart");

                    }

                    @Override
                    public void onResult(SHARE_MEDIA share_media) {

                        LogUtils.d(TAG, "onResult");

                        if (share_media.equals(SHARE_MEDIA.WEIXIN)) {

                            Toast.makeText(cordova.getContext(), "微信分享成功", Toast.LENGTH_LONG).show();

                        }

                        if (share_media.equals(SHARE_MEDIA.WEIXIN_CIRCLE)) {
                            Toast.makeText(cordova.getContext(), "朋友圈分享成功", Toast.LENGTH_LONG).show();

                        }

                        if (share_media.equals(SHARE_MEDIA.QQ)) {
                            Toast.makeText(cordova.getContext(), "QQ分享成功", Toast.LENGTH_LONG).show();

                        }

                    }

                    @Override
                    public void onError(SHARE_MEDIA share_media, Throwable throwable) {
                        LogUtils.d(TAG, "onError" + throwable.toString());
                        Toast.makeText(cordova.getActivity(), "分享失败", Toast.LENGTH_SHORT).show();
                    }


                    @Override
                    public void onCancel(SHARE_MEDIA share_media) {
                        LogUtils.d(TAG, "onCancel");

                        Toast.makeText(cordova.getActivity(), "取消分享", Toast.LENGTH_SHORT).show();

                    }
                }).open(config);


    }

    private void showGuidePager(JSONArray args, CallbackContext callbackContext) {


        cordova.getActivity().startActivity(new Intent(cordova.getActivity(), GuideActivity.class));


    }

    private void h5LoginCallBack(JSONArray args, CallbackContext callbackContext) {


    }

    private void cleanAppCache(JSONArray args, CallbackContext callbackContext) {


        LogUtils.d(TAG, "清除缓存成功   ---- fuck ------");
        CleanManagerUtil.deleteAppCache();
        callbackContext.success();


    }

    private void showAppCache(JSONArray args, CallbackContext callbackContext) {


        try {
            String cacheSize = CleanManagerUtil.getTotalCacheSize();
            LogUtils.d("TAG", "执行showCache方法 " + cacheSize);


            callbackContext.success(cacheSize);
        } catch (Exception e) {
            e.printStackTrace();
            callbackContext.error("错误");
        }

    }

    private void startSettingActivity(JSONArray args, CallbackContext callbackContext) {

        LogUtils.d(TAG, "跳转到系统设置 -----------");
        Intent intent = new Intent();
        intent.setAction(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
        intent.setData(Uri.fromParts("package", getPackageName(), null));
        cordova.getActivity().startActivity(intent);
        callbackContext.success();
    }

    /**
     * 社会分享
     */
//    private boolean share(JSONArray args, CallbackContext callbackContext) {
//
//
//        LogUtils.d(TAG,"执行分享---------");
//
//        ShareBoardConfig config = new ShareBoardConfig();
//
////        String webUrl = "http://www.baidu.com";
//
//        String webUrl = null;
//        String title = null;
//        String content = null;
//        String imageUrl = null;
//        try {
//            title = args.getString(0);
//            content = args.getString(1);
//            webUrl =  args.getString(3);
//            imageUrl = args.getString(2);
//
//
//
//
//        } catch (JSONException e) {
//            e.printStackTrace();
//        }
//
//
//        config.setShareboardBackgroundColor(Color.WHITE);
//        config.setCancelButtonVisibility(false);
//        config.setTitleText("点击分享");
//        config.setMenuItemBackgroundColor(ShareBoardConfig.BG_SHAPE_NONE);
//
//
//        LogUtils.d(TAG, "H5 调用分享  ");
//
//        UMWeb web = new UMWeb(webUrl);
//        web.setTitle(title);
//        web.setDescription(content);
//        UMImage umimage = new UMImage(cordova.getActivity(), imageUrl);
//        web.setThumb(umimage);
//
//        new ShareAction(cordova.getActivity()).withMedia(web).setDisplayList(SHARE_MEDIA.WEIXIN, SHARE_MEDIA.WEIXIN_CIRCLE, SHARE_MEDIA.QQ)
//                .setCallback(new UMShareListener() {
//                    @Override
//                    public void onStart(SHARE_MEDIA share_media) {
//
//                        LogUtils.d(TAG,"onStart");
//
//                    }
//
//                    @Override
//                    public void onResult(SHARE_MEDIA share_media) {
//
//                        LogUtils.d(TAG,"onResult");
//                        Toast.makeText(cordova.getActivity(), "分享成功", Toast.LENGTH_SHORT).show();
//
//                        if(share_media.equals(SHARE_MEDIA.WEIXIN)) {
//
//                        }
//
//                        if(share_media.equals(SHARE_MEDIA.WEIXIN_CIRCLE)) {
//
//                        }
//
//                        if(share_media.equals(SHARE_MEDIA.QQ)) {
//
//                        }
//
//                    }
//
//                    @Override
//                    public void onError(SHARE_MEDIA share_media, Throwable throwable) {
//                        LogUtils.d(TAG,"onError" + throwable.toString());
//                        Toast.makeText(cordova.getActivity(), "分享失败", Toast.LENGTH_SHORT).show();
//                    }
//
//
//                    @Override
//                    public void onCancel(SHARE_MEDIA share_media) {
//                        LogUtils.d(TAG, "onCancel");
//
//                        Toast.makeText(cordova.getActivity(), "取消分享", Toast.LENGTH_SHORT).show();
//
//                    }
//                }).open(config);
//        return true;
//
//
//    }

//    private void hideStatusBar(JSONArray args, CallbackContext callbackContext) {
//
//        LogUtils.d(TAG, "H5 调用源生隐藏状态栏  ");
//        //隐藏状态栏
//
//
//    }

//    private void showStatusBar(JSONArray args, CallbackContext callbackContext) {
//
//        LogUtils.d(TAG, " h 5 调用原生显示状态栏 ");
//    }


    /**
     * 显示
     */
//    private boolean showGuidePager(JSONArray args, CallbackContext callbackContext) {
//
//        LogUtils.d(TAG, " h 5 调用查看引导页面 ");
//        Intent intent = new Intent(cordova.getContext(), GuideShowActivity.class);
//        cordova.getActivity().startActivity(intent);
//
//
//        return true;
//
//    }

//    // h5 登录成功后 得回调
//    private void h5LoginCallBack(JSONArray args, CallbackContext callbackContext) {
//
//
//    }

//    /**
//     * 清除缓存
//     */
//    private boolean cleanAppCache(JSONArray args, CallbackContext callbackContext) {
//
//        LogUtils.d(TAG, "清除缓存成功   ---- fuck ------");
////
//        CleanManagerUtil.deleteAppCache();
//        callbackContext.success();
//
//        return true;
//
//    }

//    /**
//     * 显示 缓存大小
//     */
//    private boolean showAppCache(JSONArray args, CallbackContext callbackContext) {
//
//
//        LogUtils.d(TAG, "=获取 清除缓存的信息");
//
//        try {
//            String cacheSize = CleanManagerUtil.getTotalCacheSize();
//            LogUtils.d("TAG", "执行shouCache方法 " + cacheSize);
//
//
//            callbackContext.success("100M");
//        } catch (Exception e) {
//            e.printStackTrace();
//            callbackContext.error("错误");
//        }
//        return true;
//    }


//    // 跳转到系统设置页面
//    private void startSettingActivity(JSONArray args, CallbackContext callbackContext) {
//
//        LogUtils.d(TAG, "跳转到系统设置 -----------");
//        Intent intent = new Intent(Settings.ACTION_SETTINGS);
//        cordova.getActivity().startActivity(intent);
//        callbackContext.success();
//
//    }


}
