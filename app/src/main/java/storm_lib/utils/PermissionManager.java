package storm_lib.utils;

import android.Manifest;
import android.app.Activity;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.provider.Settings;
import android.support.v4.app.ActivityCompat;
import android.support.v4.content.ContextCompat;
import android.support.v7.app.AlertDialog;

import io.reactivex.disposables.Disposable;

/**
 * 权限管理类
 */
public class PermissionManager  {

    public static final String TAG = PermissionManager.class.getSimpleName();

    public static final int CODE_CONTACT = 0;  // 联系人
    public static final int CODE_PHONE = 1;    // 电话
    public static final int CODE_CALENDAR = 2;  // 日历
    public static final int CODE_CAMERA = 3;    // 相机
    public static final int CODE_SENSORS = 4;  // 传感器
    public static final int CODE_LOCATION = 5;  // 定位
    public static final int CODE_STORAGE = 6;  // SD
    public static final int CODE_MICROPHONE = 7;  // 麦克风
    public static final int CODE_SMS = 8;      // 短信

    // 对应的权限  只需申请权限组内个一个就可
    public static final String PERMISSION_GET_ACCOUNTS = Manifest.permission.GET_ACCOUNTS;  // 联系人
    public static final String PERMISSION_READ_PHONE_STATE = Manifest.permission.READ_PHONE_STATE;  // 电话
    public static final String PERMISSION_READ_CALENDAR = Manifest.permission.READ_CALENDAR;  // 日历
    public static final String PERMISSION_CAMERA = Manifest.permission.CAMERA;  // 相机
    public static final String PERMISSION_BODY_SENSORS = Manifest.permission.BODY_SENSORS; // 传感器
    public static final String PERMISSION_ACCESS_FINE_LOCATION = Manifest.permission.ACCESS_FINE_LOCATION;  // 定位
    public static final String PERMISSION_WRITE_EXTERNAL_STORAGE = Manifest.permission.WRITE_EXTERNAL_STORAGE;
    public static final String PERMISSION_RECORD_AUDIO = Manifest.permission.RECORD_AUDIO;
    public static final String PERMISSION_READ_SMS = Manifest.permission.READ_SMS;

    public final static int REQUEST_OPEN_APPLICATION_SETTING_CODE = 12345;
    /**
     * 权限组类
     */
    public static String[] requestPermissions = {

            PERMISSION_GET_ACCOUNTS,
            PERMISSION_READ_PHONE_STATE,
            PERMISSION_READ_CALENDAR,
            PERMISSION_CAMERA,
            PERMISSION_BODY_SENSORS,
            PERMISSION_ACCESS_FINE_LOCATION,
            PERMISSION_WRITE_EXTERNAL_STORAGE,
            PERMISSION_RECORD_AUDIO,
            PERMISSION_READ_SMS

    };

    /**
     * @param activity
     * @param requestCode
     * @param permissions
     * @param grantResults
     * @param permissionCodes
     * @param permissionState
     */
    public static void onRequestAllPermissionResult(Activity activity, int requestCode, String[] permissions, int[] grantResults, int[] permissionCodes, OnApplyPermissionState permissionState) {
        switch (requestCode) {
            case CODE_CONTACT:
            case CODE_PHONE:
            case CODE_CALENDAR:
            case CODE_CAMERA:
            case CODE_SENSORS:
            case CODE_LOCATION:
            case CODE_STORAGE:
            case CODE_MICROPHONE:
            case CODE_SMS:
                // 如果用户拒绝 发起第二次申请
                if (PackageManager.PERMISSION_GRANTED != grantResults[0]) {
                    //
                    if (ActivityCompat.shouldShowRequestPermissionRationale(activity, permissions[0])) {
                        LogUtils.d("第一次拒绝 不勾选" + ActivityCompat.shouldShowRequestPermissionRationale(activity, permissions[0]));
                        // 第一次拒绝的时候返回true
                        showPermissionOkorCancel(activity, permissionCodes, permissionState);
                    } else { // 勾选了不在询问
                        LogUtils.d("第n次拒绝" + ActivityCompat.shouldShowRequestPermissionRationale(activity, permissions[0]));
                        showSettingsPermission(activity);
                    }
                    return;
                }

                //进行到这里说申请完成
                if (isAllRequestPermissionGranted(activity, permissionCodes)) {

                    if (permissionState != null) {
                        permissionState.onAfterApplyPermission();
                    }
                } else {
                    applayAllPermission(activity, permissionCodes, permissionState);
                }
                break;

        }

    }


    public static void showSystemSettingPermission(Activity activity) {

        AlertDialog.Builder builder = new AlertDialog.Builder(activity);
        builder.setMessage("打开权限,以便正常使用本应用");
        builder.setPositiveButton("去设置", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {

                openApplicationSetting(activity, REQUEST_OPEN_APPLICATION_SETTING_CODE);
                dialog.dismiss();
            }
        });
        builder.setCancelable(false);
        builder.show();
    }


    public static void showSettingsPermission(final Activity activity) {
        AlertDialog.Builder builder = new AlertDialog.Builder(activity);
        builder.setTitle("权限申请");
        builder.setMessage("请在打开的窗口中开启" + "权限,以便正常使用本应用");
        builder.setPositiveButton("去设置", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                //引导用户去设置页面开启
                openApplicationSetting(activity, REQUEST_OPEN_APPLICATION_SETTING_CODE);
                dialog.dismiss();
            }
        });
        builder.setNegativeButton("取消", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                dialog.dismiss();
                activity.finish();
            }
        });
        builder.setCancelable(false);
        builder.show();
    }

    /**
     * 用户手动打开应用设置权限
     *
     * @param requestCode
     * @return
     */
    public static void openApplicationSetting(Activity activity, int  requestCode) {

        try {
            Intent intent
                    = new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS, Uri.parse("package:" + activity.getPackageName()));
            intent.addCategory(Intent.CATEGORY_DEFAULT);

            activity.startActivityForResult(intent, requestCode);

        } catch (Throwable e) {
            e.printStackTrace();
        }

    }

    /**
     * 显示申请permission 的原因
     *
     * @param activity
     * @param requestCode
     * @param permissionState
     */
    private static void showPermissionOkorCancel(final Activity activity, final int[] requestCode, final OnApplyPermissionState permissionState) {
        AlertDialog.Builder builder = new AlertDialog.Builder(activity)
                //.setMessage("需要此权限,以便正常使用这个功能")
                .setMessage("要么就开权限, 要么就卸载老子,草")
                .setPositiveButton("确认", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        //申请权限
                        applayAllPermission(activity, requestCode, permissionState);
                    }

                });

        builder.setCancelable(false);
        builder.show();
    }

    /**
     * 申请完成后的回调
     *
     * @param activity
     * @param permiss
     * @param requestCode
     * @param data
     * @param applyPermissionState
     */
    public static void onActivityResult(Activity activity, int[] permiss, int requestCode, Intent data, OnApplyPermissionState applyPermissionState) {

        switch (requestCode) {
            case REQUEST_OPEN_APPLICATION_SETTING_CODE:

                if (isAllRequestPermissionGranted(activity, permiss)) {

                    // 回调接口
                    if (applyPermissionState != null) {

                        applyPermissionState.onAfterApplyPermission();
                    }
                } else {
                    applayAllPermission(activity, permiss, applyPermissionState);
                }
                break;

        }

    }

    public static boolean isrequestPermissionGranted(Activity activity, int permissionCode) {
        return isAllRequestPermissionGranted(activity, new int[]{permissionCode});
    }

    /**
     * 多个权限申请
     *
     * @param activity
     * @param permissionCodes
     * @return
     */
    public static boolean isAllRequestPermissionGranted(Activity activity, int[] permissionCodes) {

        for (int permissionCode : permissionCodes) {

            if (PackageManager.PERMISSION_GRANTED != ContextCompat.checkSelfPermission(activity, requestPermissions[permissionCode])) {

                return false;
            }
        }

        return true;

    }

    public static void applayPermisiion(Activity activity, int permissionCode, OnApplyPermissionState applyPermissionState) {

        applayAllPermission(activity, new int[]{permissionCode}, applyPermissionState);

    }

    /**
     * 请求权限
     *
     * @param activity
     * @param permissionCodes
     * @param permissionState
     */
    public static void applayAllPermission(Activity activity, int[] permissionCodes, OnApplyPermissionState permissionState) {

        for (int permissionCode : permissionCodes) {
            if (PackageManager.PERMISSION_GRANTED != ContextCompat.checkSelfPermission(activity, requestPermissions[permissionCode])) {
                ActivityCompat.requestPermissions(activity, new String[]{requestPermissions[permissionCode]}, permissionCode);
                return;
            }
        }

        if (permissionState != null) {
            permissionState.onAfterApplyPermission();
        }
    }

    public interface OnApplyPermissionState {
        void onAfterApplyPermission();
    }



}
