package com.efeiyi.bigwiki.service;

import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.os.Environment;
import android.os.IBinder;
import android.support.annotation.Nullable;

import java.io.File;
import java.io.IOException;
import java.util.List;

import io.reactivex.Observable;
import io.reactivex.ObservableSource;
import io.reactivex.disposables.Disposable;
import io.reactivex.functions.Function;
import okhttp3.ResponseBody;
import storm_lib.RxHelper;
import storm_lib.base.BaseObserver;
import storm_lib.httpclient.manager.HttpClientManager;
import storm_lib.utils.FileUtils;
import storm_lib.utils.LogUtils;
import storm_lib.utils.SPUtils;
import storm_lib.utils.StringUtils;
import storm_lib.utils.ZipUtils;

/**
 * 更换图标服务
 */
public class DownLoadNavService extends Service {

    public static final String TAG = DownLoadNavService.class.getSimpleName();

    public static boolean LOADING_ICON_CODE = false;

    public String iconZipUrl;

    private String iconFilePath;
    // 图片存储路径
    SPUtils navIconSPUtils;

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {

        init(intent);
        return super.onStartCommand(intent, flags, startId);

    }

    //初始化操作
    private void init(Intent intent) {

        iconZipUrl = intent.getStringExtra("iconUrl");
        iconFilePath = getIconFilePath();

        navIconSPUtils = SPUtils.getINSTACE("navIcon");

        File zipFileDir = new File(iconFilePath);
        File zipFile = new File(zipFileDir, StringUtils.zipFileName(iconZipUrl));

        String fileName = StringUtils.zipFileName(iconZipUrl);

        if (zipFile.exists()) {
            //存在 并是一个文件 // 解压文件

            if (!navIconSPUtils.getBoolean(fileName)) {
                unZipFile(zipFileDir, fileName);
            }
        } else {
            // 下载文件
            startLoadNavIconZip(iconZipUrl, zipFileDir, fileName);

        }

    }

    private void startLoadNavIconZip(String iconZipUrl, File zipFileDir, String fileName) {

        Observable<ResponseBody> responseBodyObservable =
                HttpClientManager.getDownLoadService(false)
                        .downloadFile(iconZipUrl);

        responseBodyObservable.compose(RxHelper.IO_Main())
                .flatMap(new Function<ResponseBody, ObservableSource<Boolean>>() {
                    @Override
                    public ObservableSource<Boolean> apply(ResponseBody body) throws Exception {

                        boolean isSave = false;
                        try {
                            isSave = FileUtils.saveFile(body, zipFileDir, fileName);
                        } catch (Exception e) {
                            e.printStackTrace();
                            LogUtils.d(TAG, "没有保存成功" + e.getMessage());

                        }
                        LogUtils.d(TAG, " 是否存储成功 " + isSave);
                        boolean isZip = false;
                        if (isSave) {
                            // 文件是否解压
                            try {
                                List<File> files = ZipUtils.unZipFile(new File(zipFileDir, fileName), zipFileDir);
                                isZip = true; // 解压成功

                            } catch (IOException e) {
                                e.printStackTrace();
                                isZip = false;
                            }
                        } else {

                            return Observable.empty();
                        }
                        return Observable.just(isZip);
                    }

                }).subscribe(new BaseObserver<Boolean>() {
            @Override
            public void onSubscribe(Disposable d) {
                super.onSubscribe(d);
            }

            @Override
            public void onNext(Boolean aBoolean) {

                super.onNext(aBoolean);
                LogUtils.d(TAG, "onnext");
                if (aBoolean) { //保存成功
                    navIconSPUtils.put(fileName, true);
                  //  navIconSPUtils.put("currentIcon", fileName);

                } else navIconSPUtils.put(fileName, false);

                stopSelf();
            }

            @Override
            public void onError(Throwable e) {
                super.onError(e);
                LogUtils.d(TAG, "onError" + e.toString());
            }

            @Override
            public void onComplete() {
                super.onComplete();

                LogUtils.d(TAG, "onComplete");
            }
        });

    }


    private void unZipFile(File zipFileDir, String fileName) {

        // 文件是否解压
        try {
            List<File> files = ZipUtils.unZipFile(new File(zipFileDir, fileName), zipFileDir);

            navIconSPUtils.put(fileName, true);
        } catch (IOException e) {
            e.printStackTrace();
            navIconSPUtils.put(fileName, false);
        }

        stopSelf();

    }

    private String getIconFilePath() {

        boolean sd = FileUtils.isSD();
        if (sd) {
            return Environment.getExternalStorageDirectory().getAbsolutePath() + File.separator + StringUtils.fileDirName(iconZipUrl);

        } else {
            return FileUtils.getFileDir(this) + File.separator + StringUtils.fileDirName(iconZipUrl);
        }
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    public static void startLoadNavIconService(Context context, String url) {

        Intent intent = new Intent(context, DownLoadNavService.class);
        intent.putExtra("iconUrl", url);
        context.startService(intent);
        DownLoadNavService.LOADING_ICON_CODE = true;
    }
}
