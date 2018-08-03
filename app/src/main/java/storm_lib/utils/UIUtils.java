package storm_lib.utils;

import android.app.KeyguardManager;
import android.content.Context;

/**
 * ui 视图操作类
 */
public class UIUtils {

    public static final String TAG = UIUtils.class.getSimpleName();




    public static int getScreenWidth() {
        return AppUtils.getAppContext().getResources().getDisplayMetrics().widthPixels;

    }


    public static int getScreenHeight() {
        return AppUtils.getAppContext().getResources().getDisplayMetrics().heightPixels;

    }



    public static boolean isScreenLock() {
       KeyguardManager km =
               (KeyguardManager) AppUtils.getAppContext().getSystemService(Context.KEYGUARD_SERVICE);

       return km.inKeyguardRestrictedInputMode();
    }


    /**
     * dp 转化px
     *
     * @param dpValue dp 转化px
     * @return
     */
    public static int dip2px(float dpValue) {
        final float scale = AppUtils.getAppContext().getResources().getDisplayMetrics().density;
        return (int) (dpValue * scale + 0.5f);
    }


    /**
     * px 转化 dp
     *
     * @param pxValue
     * @return
     */
    public static int px2dip(float pxValue) {
        final float scale = AppUtils.getAppContext().getResources().getDisplayMetrics().density;
        return (int) (pxValue / scale + 0.5f);
    }





}
