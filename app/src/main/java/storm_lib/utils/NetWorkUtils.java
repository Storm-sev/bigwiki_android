package storm_lib.utils;

import android.content.Context;
import android.content.Intent;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.wifi.WifiManager;
import android.provider.Settings;
import android.telephony.TelephonyManager;

import java.lang.reflect.Method;

import static android.telephony.TelephonyManager.NETWORK_TYPE_GSM;
import static android.telephony.TelephonyManager.NETWORK_TYPE_IWLAN;
import static android.telephony.TelephonyManager.NETWORK_TYPE_TD_SCDMA;
import static com.efeiyi.bigwiki.app.MApplication.appContext;

/**
 * Created by storm on 2017/9/12.
 * 网络检测工具类
 */

public class NetWorkUtils {


    private static final String TAG = NetWorkUtils.class.getSimpleName();

    public enum NetworkType {
        NETWORK_WIFI,
        NETWORK_4G,
        NETWORK_3G,
        NETWORK_2G,
        NETWORK_UNKNOWN,
        NETWORK_NO
    }


    /**
     * 打开网络设置界面
     */
    public static void openWirelessSetting() {

        appContext.startActivity(
                new Intent(Settings.ACTION_WIRELESS_SETTINGS)
                        .setFlags(Intent.FLAG_ACTIVITY_NEW_TASK));

    }

    /**
     * 获取活动的网络信息
     * <p>权限 {@code <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE"/>}</p>
     */
    public static NetworkInfo getActiveNetworkInfo() {
        return ((ConnectivityManager) appContext.getSystemService(Context.CONNECTIVITY_SERVICE)).getActiveNetworkInfo();
    }


    /**
     * 网络是否连接
     * <p   >权限 {@code <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE"/>}</p>
     */
    public static boolean isConnected() {

        NetworkInfo info = getActiveNetworkInfo();
        return info != null && info.isAvailable();

    }


    /**
     * 判断是否打开移动数据网络
     *
     * @return
     */
    public static boolean isOpenDataEnabled() {

        try {
            TelephonyManager manager =
                    (TelephonyManager) appContext.getSystemService(Context.TELEPHONY_SERVICE);

            Method getPhoneDataEnabledMethod
                    = manager.getClass().getDeclaredMethod("getDataEnabled");

            if (null != getPhoneDataEnabledMethod) {
                return (boolean) getPhoneDataEnabledMethod.invoke(manager);
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return false;
    }


    /**
     * 打开或者关闭移动数据
     *
     * @return
     */
    public static void setDataEnabled(boolean enable) {

        try {
            TelephonyManager manager =
                    (TelephonyManager) appContext.getSystemService(Context.TELEPHONY_SERVICE);

            Method setPhoneDataEnableMethod = manager.getClass().getDeclaredMethod("setDataEnabled", boolean.class);

            if (null != setPhoneDataEnableMethod) {

                setPhoneDataEnableMethod.invoke(manager, enable);
            }
        } catch (Exception e) {

        }
    }


    /**
     * 判断网络是否是4G
     * <p>需添加权限 {@code <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE"/>}</p>
     *
     * @return
     */
    public static boolean is4G() {
        NetworkInfo info = getActiveNetworkInfo();

        return info != null && info.isAvailable() && info.getSubtype() == TelephonyManager.NETWORK_TYPE_LTE;

    }


    /**
     * 判断 wifi 是否已经打开
     * <p>需添加权限 {@code <uses-permission android:name="android.permission.ACCESS_WIFI_STATE"/>}</p>
     *
     * @return
     */
    public static boolean getWifiEnable() {

        WifiManager wifiManager
                = (WifiManager) appContext.getSystemService(Context.WIFI_SERVICE);

        return wifiManager.isWifiEnabled();


    }

    /**
     * 打开或者关闭wifi
     * <p>需添加权限 {@code <uses-permission android:name="android.permission.CHANGE_WIFI_STATE"/>}</p>
     *
     * @param enable
     */
    public static void setWifiEnable(boolean enable) {

        WifiManager wifiManager =
                (WifiManager) appContext.getSystemService(Context.WIFI_SERVICE);


        if (enable) { // 需要打开
            if (!wifiManager.isWifiEnabled()) {
                wifiManager.setWifiEnabled(true);
            }

        } else { // 需要关闭 

            if (wifiManager.isWifiEnabled()) {
                wifiManager.setWifiEnabled(false);
            }
        }

    }


    /**
     * 判断 wifi 是否是连接状态
     * <p>需添加权限 {@code <uses-permission android:name="android.permission.ACCESS_WIFI_STATE"/>}</p>
     * <p>需添加权限 {@code <uses-permission android:name="android.permission.INTERNET"/>}</p>
     *
     * @return
     */
    public static boolean isWifiConnected() {


        ConnectivityManager cm =
                (ConnectivityManager) appContext.getSystemService(Context.CONNECTIVITY_SERVICE);

        return cm != null && cm.getActiveNetworkInfo() != null
                && cm.getActiveNetworkInfo().getSubtype() == ConnectivityManager.TYPE_WIFI;

    }


    /**
     * 获取当前网络类型
     * <p>需添加权限 {@code <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE"/>}</p>
     *
     * @return 网络类型
     * <ul>
     * <li>{@link NetworkType#NETWORK_WIFI   } </li>
     * <li>{@link NetworkType#NETWORK_4G     } </li>
     * <li>{@link NetworkType#NETWORK_3G     } </li>
     * <li>{@link NetworkType#NETWORK_2G     } </li>
     * <li>{@link NetworkType#NETWORK_UNKNOWN} </li>
     * <li>{@link NetworkType#NETWORK_NO     } </li>
     * </ul>
     */
    public static NetworkType getNetworkType() {
        NetworkType netType = NetworkType.NETWORK_NO;
        NetworkInfo info = getActiveNetworkInfo();
        if (info != null && info.isAvailable()) {

            if (info.getType() == ConnectivityManager.TYPE_WIFI) {
                netType = NetworkType.NETWORK_WIFI;
            } else if (info.getType() == ConnectivityManager.TYPE_MOBILE) {
                switch (info.getSubtype()) {

                    case NETWORK_TYPE_GSM:
                    case TelephonyManager.NETWORK_TYPE_GPRS:
                    case TelephonyManager.NETWORK_TYPE_CDMA:
                    case TelephonyManager.NETWORK_TYPE_EDGE:
                    case TelephonyManager.NETWORK_TYPE_1xRTT:
                    case TelephonyManager.NETWORK_TYPE_IDEN:
                        netType = NetworkType.NETWORK_2G;
                        break;

                    case NETWORK_TYPE_TD_SCDMA:
                    case TelephonyManager.NETWORK_TYPE_EVDO_A:
                    case TelephonyManager.NETWORK_TYPE_UMTS:
                    case TelephonyManager.NETWORK_TYPE_EVDO_0:
                    case TelephonyManager.NETWORK_TYPE_HSDPA:
                    case TelephonyManager.NETWORK_TYPE_HSUPA:
                    case TelephonyManager.NETWORK_TYPE_HSPA:
                    case TelephonyManager.NETWORK_TYPE_EVDO_B:
                    case TelephonyManager.NETWORK_TYPE_EHRPD:
                    case TelephonyManager.NETWORK_TYPE_HSPAP:
                        netType = NetworkType.NETWORK_3G;
                        break;

                    case NETWORK_TYPE_IWLAN:
                    case TelephonyManager.NETWORK_TYPE_LTE:
                        netType = NetworkType.NETWORK_4G;
                        break;
                    default:

                        String subtypeName = info.getSubtypeName();
                        if (subtypeName.equalsIgnoreCase("TD-SCDMA")
                                || subtypeName.equalsIgnoreCase("WCDMA")
                                || subtypeName.equalsIgnoreCase("CDMA2000")) {
                            netType = NetworkType.NETWORK_3G;
                        } else {
                            netType = NetworkType.NETWORK_UNKNOWN;
                        }
                        break;
                }
            } else {
                netType = NetworkType.NETWORK_UNKNOWN;
            }
        }
        return netType;
    }


}

