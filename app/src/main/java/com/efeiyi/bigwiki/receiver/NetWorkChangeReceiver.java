package com.efeiyi.bigwiki.receiver;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.net.ConnectivityManager;

import storm_lib.utils.LogUtils;
import storm_lib.utils.NetWorkUtils;

/**
 * 监听网络状态的广播
 */
public class NetWorkChangeReceiver extends BroadcastReceiver {


    public  static final String TAG = NetWorkChangeReceiver.class.getSimpleName();


    @Override
    public void onReceive(Context context, Intent intent) {

        if (intent.getAction().equals(ConnectivityManager.CONNECTIVITY_ACTION)) {
            // 检查网络状态

            boolean connected = NetWorkUtils.isConnected();
            if (connected) {
                LogUtils.d(TAG, "有网络");
            } else {
                LogUtils.d(TAG, "无网络");

            }


        }
    }


    /**
     * 网络状态接口的改变
     */
    public interface netWorkState {

        void onNetorkState(boolean isConnected);

    }



}
