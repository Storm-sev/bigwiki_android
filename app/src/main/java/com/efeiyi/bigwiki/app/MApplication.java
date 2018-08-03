package com.efeiyi.bigwiki.app;

import android.app.Application;
import android.content.Context;
import android.content.IntentFilter;

import com.efeiyi.bigwiki.BuildConfig;
import com.efeiyi.bigwiki.receiver.NetWorkChangeReceiver;
import com.meituan.android.walle.WalleChannelReader;
import com.umeng.analytics.MobclickAgent;
import com.umeng.commonsdk.UMConfigure;
import com.umeng.message.IUmengRegisterCallback;
import com.umeng.message.PushAgent;
import com.umeng.message.UmengNotificationClickHandler;
import com.umeng.message.entity.UMessage;
import com.umeng.socialize.PlatformConfig;

import storm_lib.utils.LogUtils;

/**
 * application
 */
public class MApplication extends Application {

    public static final String TAG = MApplication.class.getSimpleName();

    public static Context appContext;

    public static LogUtils.Config config;

    private PushAgent mPushAgent;  // 友盟

    private  NetWorkChangeReceiver netWorkChangeReceiver;

    @Override
    public void onCreate() {
        super.onCreate();
        appContext = this;
        initLog();
        initUmeng();
        initNetworkInfo();

    }


    /**
     * 关闭广播
     */
    public void closeNetWorkInfo() {
        if (netWorkChangeReceiver != null) {
            unregisterReceiver(netWorkChangeReceiver);

        }

    }
    /**
     * 初始化网络监听状态
     */
    private void initNetworkInfo() {

        IntentFilter intentFilter = new IntentFilter();
        intentFilter.addAction("android.net.conn.CONNECTIVITY_CHANGE");
         netWorkChangeReceiver = new NetWorkChangeReceiver();
        registerReceiver(netWorkChangeReceiver, intentFilter);

    }


    /**
     * 初始化友盟服务
     */
    private void initUmeng() {
        // 友盟统计

        String channel = WalleChannelReader.getChannel(this);
        LogUtils.d(TAG, "获取的渠道信息" + channel);

        UMConfigure.init(this, "5afd4b20f43e4807a9000197", channel, UMConfigure.DEVICE_TYPE_PHONE,
                "73c70b5ae640fedb5a5be029e0561257");

        UMConfigure.setLogEnabled(true);
        MobclickAgent.setScenarioType(this, MobclickAgent.EScenarioType.E_UM_NORMAL);


        PlatformConfig.setWeixin("wx5eb60285e13062c4", "eed06f97356be88b5fe59307fdaf42fa");
        PlatformConfig.setQQZone("1106987534","9bBGrynOTILTDhQ1");

//        eed06f97356be88b5fe59307fdaf42fa
//        UMShareAPI.init(this,"5afd4b20f43e4807a9000197");




        mPushAgent = PushAgent.getInstance(this);


        mPushAgent.register(new IUmengRegisterCallback() {
            @Override
            public void onSuccess(String s) {
                LogUtils.d(TAG, "device token " + s);
            }

            @Override
            public void onFailure(String s, String s1) {

                LogUtils.d(TAG, "失败" + s + "----" + s1);
            }
        });


        // 自定义通知打开动作
        notificationOpenAction();

    }

    /**
     * 自定义通知打开动作
     */
    private void notificationOpenAction() {

        UmengNotificationClickHandler umengNotificationClickHandler = new UmengNotificationClickHandler() {
            @Override
            public void dealWithCustomAction(Context context, UMessage uMessage) {
                super.dealWithCustomAction(context, uMessage);
                LogUtils.d(TAG, "message..." + uMessage.custom);

            }
        };

        mPushAgent.setNotificationClickHandler(umengNotificationClickHandler);

    }


    private void initLog() {

        config = LogUtils.getConfig()
                .setLogSwitch(BuildConfig.DEBUG)
                .setConsoleSwitch(BuildConfig.DEBUG)
                .setGlobalTag("LJY")
                .setLog2FileSwitch(false)
                .setSingleTagSwitch(true)
                .setLogHeadSwitch(true)
                .setBorderSwitch(true)
                .setConsoleFilter(LogUtils.V)
                .setFileFilter(LogUtils.V);

        LogUtils.d(TAG, "更新log 打印");

    }

    public static Context getAppContext() {
        return appContext;
    }




}
