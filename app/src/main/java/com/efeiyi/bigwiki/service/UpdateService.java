package com.efeiyi.bigwiki.service;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.nfc.Tag;
import android.os.Build;
import android.os.Environment;
import android.os.IBinder;
import android.os.SystemClock;
import android.support.annotation.Nullable;
import android.support.annotation.RequiresApi;
import android.support.annotation.VisibleForTesting;
import android.support.v4.app.NotificationCompat;
import android.text.style.BulletSpan;
import android.widget.RemoteViews;
import android.widget.Toast;

import com.efeiyi.bigwiki.R;
import com.umeng.commonsdk.debug.E;

import java.io.File;
import java.net.NoRouteToHostException;

import okhttp3.ResponseBody;
import storm_lib.httpclient.downLoad.DownLoadManager;
import storm_lib.httpclient.downLoad.FileCallBack;
import storm_lib.utils.AppUtils;
import storm_lib.utils.LogUtils;

public class UpdateService extends Service {

    private static final String TAG = UpdateService.class.getSimpleName();

    public static final int UPDATE_CODE = 1001;

    public static boolean DOWNLOAD_CODE = false;

    private NotificationManager notificationManager;
    private NotificationCompat.Builder mBuilder;


    private int preProgress;


    private RemoteViews mNotiCustomView; // 通知栏自定义view

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }


    @RequiresApi(api = Build.VERSION_CODES.O)
    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {

        LogUtils.d(TAG, "开启下载服务");
        createNotification();
        downLoadNewVersionApk(intent);
        return super.onStartCommand(intent, flags, startId);
    }


    /**
     * 下载 apk
     *
     * @param intent
     */
    private void downLoadNewVersionApk(Intent intent) {
        if (intent == null) {
            DOWNLOAD_CODE = false;
            stopSelf();
            return;
        }


        String apk_url = intent.getStringExtra("APK_URL");


        DownLoadManager.loadApk(apk_url, new FileCallBack<ResponseBody>(Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS).getAbsolutePath(),


                AppUtils.getNameFormUrl(apk_url), true) {


            @Override
            public void onSuccess(ResponseBody body) {

                LogUtils.d(TAG, "下载成功");

            }

            @Override
            public void onStart() {

                LogUtils.d(TAG, "下载 apk onStart");
            }

            @Override
            public void onComplete() {

                File fileDir = new File(Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS).getAbsolutePath());

                File file = new File(fileDir, AppUtils.getNameFormUrl(apk_url));


                if (file.exists()) {
                    notificationManager.notify(UPDATE_CODE, mBuilder.build());
                    notificationManager.cancel(UPDATE_CODE);
                    AppUtils.installApk(UpdateService.this, file);

                }

                DOWNLOAD_CODE = false;
                stopSelf();


            }

            @Override
            public void onError(Throwable e, String fileName) {
                Toast.makeText(UpdateService.this, "安装包更新失m败,稍后请重试.", Toast.LENGTH_SHORT).show();
                DOWNLOAD_CODE = false;
                stopSelf();

                LogUtils.d(TAG, "下载失败 " + e.toString());
            }

            @Override
            public void onProgress(float progress, long total) {

                updateUI(progress, total);

            }
        });


    }

    private void updateUI(float progress, long total) {
        int curProgress
                = (int) (progress * 100);

        if (preProgress < curProgress) {

            mNotiCustomView.setProgressBar(R.id.pb_download, 100, curProgress, false);

            mNotiCustomView.setTextViewText(R.id.tv_tool_title, "非遗大百科: " + curProgress + "%");
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                mBuilder.build();
                notificationManager.notify(UPDATE_CODE, mBuilder.build());
            } else {
                notificationManager.notify(UPDATE_CODE, mBuilder.build());

            }

        }

        preProgress = curProgress;
    }


    // init  初始化通知栏
    private void createNotification() {

        notificationManager = (NotificationManager) this.getSystemService(Context.NOTIFICATION_SERVICE);


        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {

            String channleId = "down";
            String channleName = "update_apk";

            NotificationChannel channel = new NotificationChannel(channleId, channleName, NotificationManager.IMPORTANCE_HIGH);

            notificationManager.createNotificationChannel(channel);

//
            mBuilder = new NotificationCompat.Builder(getApplicationContext(), "down");
            mBuilder.setSmallIcon(R.mipmap.app_icon);

        } else {


            mBuilder = new NotificationCompat.Builder(getApplicationContext());

        }

        mNotiCustomView = new RemoteViews(this.getPackageName(), R.layout.notification_update);
        mNotiCustomView.setProgressBar(R.id.pb_download, 100, 0, false);

        mNotiCustomView.setTextViewText(R.id.tv_tool_title, "非遗大百科: 0%");

        mBuilder.setCustomContentView(mNotiCustomView);
        mBuilder.setWhen(System.currentTimeMillis());
        mBuilder.setSmallIcon(R.mipmap.app_icon);

        mBuilder.build();

        notificationManager.notify(UPDATE_CODE, mBuilder.build());

//


    }


    @Override
    public void onDestroy() {
        super.onDestroy();
    }




    /**
     * 开启服务
     */
    public static void startDownLoadApp(Context context, String apkUrl) {

        Intent intent = new Intent(context, UpdateService.class);
        intent.putExtra("APK_URL", apkUrl);
        context.startService(intent);
    }
}
