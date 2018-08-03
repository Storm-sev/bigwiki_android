package storm_lib.utils;


import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.support.v4.content.FileProvider;

import com.efeiyi.bigwiki.app.MApplication;
import com.umeng.socialize.bean.SHARE_MEDIA;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

/**
 * app 相关工具类
 */
public class AppUtils {

    public static final String TAG = AppUtils.class.getSimpleName();


    /**
     * application context
     */
    public  static Context getAppContext() {
        return MApplication.appContext;
    }


    /**
     * install app
     * @param context
     * @param file
     */
    public static void installApk(Context context, File file) {



        Intent intent = new Intent();

        intent.setAction(Intent.ACTION_VIEW);

        intent.addCategory(Intent.CATEGORY_DEFAULT);
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        if (Build.VERSION.SDK_INT >= 24) {


            Uri apkUri
                    = FileProvider.getUriForFile(context, "com.efeiyi.bigiWiki.fileProvide", file);
            intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
            intent.setDataAndType(apkUri, "application/vnd.android.package-archive");

        } else {

            intent.setDataAndType(Uri.fromFile(file), "application/vnd.android.package-archive");

        }
        context.getApplicationContext().startActivity(intent);

    }

    /**
     * 获取当前应用的版本号
     * @return
     */
    public static int getVersionCode(){
        int versionCode = 0;
        PackageManager packageManager = getAppContext().getPackageManager();

        try {
            PackageInfo packageInfo = packageManager.getPackageInfo(getAppContext().getPackageName(), 0);
            LogUtils.d(TAG,"获取的版本 信息 ->  " + packageInfo.versionCode);

            versionCode =  packageInfo.versionCode ;

        } catch (PackageManager.NameNotFoundException e) {
            LogUtils.d(TAG, "获取版本  : " + e);
            e.printStackTrace();

        }

        return versionCode;
    }


    /**
     *
     * @param apk_url
     * @return
     */
    public static String  getNameFormUrl(String apk_url) {
        if(apk_url == null || apk_url.equals("")) {
            return "";
        }
        return apk_url.substring(apk_url.lastIndexOf("/") + 1);
    }

    /**
     * 获取版本状态
     * @return
     */
    public static String getVersion() {
        PackageManager pm = getAppContext().getPackageManager();

        try {
          PackageInfo packageInfo =   pm.getPackageInfo(getAppContext().getPackageName(), 0);
          String versionName = packageInfo.versionName;

          return versionName;
        } catch (PackageManager.NameNotFoundException e) {
            e.printStackTrace();
        }

        return null;
    }


    /**
     * 判断安装的软件
     */
    public static List<SHARE_MEDIA> getShareSoft() {

        List<SHARE_MEDIA> shares = new ArrayList<>();

        PackageManager pm = getAppContext().getPackageManager();
        List<PackageInfo> pinfos =
                pm.getInstalledPackages(0);

        shares.removeAll(null);

        if (pinfos != null) {
            for (PackageInfo pinfo : pinfos) {

              String pn =   pinfo.packageName;
                if(pn.equals("com.tencent.mm")) {

                    //
                    shares.add(SHARE_MEDIA.WEIXIN);
                    shares.add(SHARE_MEDIA.WEIXIN_CIRCLE);
                }

                if(pn.equals("com.tencent.mobileqq")) {
                    shares.add(SHARE_MEDIA.QQ);
                }


            }
        }

        return shares;

    }
}
