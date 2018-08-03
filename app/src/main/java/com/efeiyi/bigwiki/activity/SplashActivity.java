package com.efeiyi.bigwiki.activity;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.support.annotation.VisibleForTesting;
import android.support.v4.view.ViewPager;
import android.view.View;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.Toast;

import com.efeiyi.bigwiki.MainActivity;
import com.efeiyi.bigwiki.R;
import com.efeiyi.bigwiki.adapter.GuidePagerAdapter;
import com.efeiyi.bigwiki.bean.IconBean;
import com.efeiyi.bigwiki.bean.VersionBean;
import com.efeiyi.bigwiki.service.DownLoadNavService;
import com.efeiyi.bigwiki.service.UpdateService;
import com.jakewharton.rxbinding2.view.RxView;
import com.tbruyelle.rxpermissions2.RxPermissions;

import java.util.concurrent.TimeUnit;

import butterknife.BindView;
import butterknife.ButterKnife;
import io.reactivex.Observable;
import io.reactivex.android.schedulers.AndroidSchedulers;
import io.reactivex.disposables.Disposable;
import io.reactivex.functions.Consumer;
import storm_lib.RxHelper;
import storm_lib.base.BaseActivity;
import storm_lib.base.BaseObserver;
import storm_lib.httpclient.downLoad.DownLoadManager;
import storm_lib.httpclient.downLoad.DownLoadService;
import storm_lib.httpclient.manager.HttpClientManager;
import storm_lib.utils.AppUtils;
import storm_lib.utils.DialogHelper;
import storm_lib.utils.LogUtils;
import storm_lib.utils.PermissionManager;
import storm_lib.utils.SPUtils;
import storm_lib.utils.StringUtils;

/**
 * splash
 */
public class SplashActivity extends BaseActivity {

    public static final String TAG = SplashActivity.class.getSimpleName();

    @BindView(R.id.iv_splash)
    ImageView ivSplash;
    @BindView(R.id.vp_guide)
    ViewPager vpGuide;
    @BindView(R.id.btn_to_main)
    ImageButton btnToMain;


    private SPUtils navIconSPUtils;

    private GuidePagerAdapter mPagerAdapter;

    String fileName;
    SPUtils splashStateSP;

    private static int[] guideRes = {R.drawable.guide1, R.drawable.guide2,
            R.drawable.guide3, R.drawable.guide4};


    @SuppressLint("CheckResult")
    @Override
    protected void setUpListener() {

        RxView.clicks(btnToMain).subscribe(o -> {
            splashStateSP.put("firstOpen", true);
            toMain();

        });

        // 页面监听
        vpGuide.addOnPageChangeListener(new ViewPager.OnPageChangeListener() {
            @Override
            public void onPageScrolled(int position, float positionOffset, int positionOffsetPixels) {

            }

            @Override
            public void onPageSelected(int position) {

                if (position == guideRes.length - 1) {
                    btnToMain.setVisibility(View.VISIBLE);


                } else {
                    btnToMain.setVisibility(View.GONE);
                }
            }

            @Override
            public void onPageScrollStateChanged(int state) {

            }
        });

    }

    /**
     * 测试使用
     *
     * @param
     */
//    private void testToMain(String url) {
//
//        Intent intent = new Intent(SplashActivity.this, MainHtmlActivity.class);
//        intent.putExtra("url", url);
//        startActivity(intent);
////        overridePendingTransition(R.anim.tomain_open, R.anim.tomain_close);
//        finish();
//
//    }
    @Override
    protected void init() {
        splashStateSP = SPUtils.getINSTACE("SplashState");
        //request permission
        requestPermission();

        //  navIconSPUtils = SPUtils.getINSTACE("navIcon");


    }

    @Override
    protected void initViews() {
        ivSplash.setBackgroundResource(R.drawable.bg_splash);

    }

    @Override
    protected void initData() {
    }


    @Override
    protected int attachLayoutRes() {
        return R.layout.activity_splash;
    }


    @SuppressLint("CheckResult")
    private void requestPermission() {
        // 权限请求
        new RxPermissions(SplashActivity.this)
                .request(PermissionManager.PERMISSION_WRITE_EXTERNAL_STORAGE,
                        PermissionManager.PERMISSION_READ_PHONE_STATE)
                .subscribe(new Consumer<Boolean>() {
                    @Override
                    public void accept(Boolean aBoolean) throws Exception {
                        if (aBoolean) {
                            _initData();
                        } else {
                            PermissionManager.showSystemSettingPermission(SplashActivity.this);
                        }
                    }
                });


//        new RxPermissions(SplashActivity.this)
//                .requestEach(PermissionManager.PERMISSION_WRITE_EXTERNAL_STORAGE,
//                        PermissionManager.PERMISSION_READ_PHONE_STATE)
//                .subscribe(new Consumer<Permission>() {
//                    @Override
//                    public void accept(Permission permission) throws Exception {
//
//
//                        if (permission.granted) {
//
//                            LogUtils.d(TAG, "获取权限 " + permission.name);
//                            if (permission.name.equals(PermissionManager.PERMISSION_WRITE_EXTERNAL_STORAGE)) {
//                                LogUtils.d(TAG, "sd卡权限请求通过");
//
//                            }
//
//                            if (permission.name.equals(PermissionManager.PERMISSION_READ_PHONE_STATE)) {
//                                LogUtils.d(TAG, "读取手机 phone 的状态");
//                                // 开始倒计时
//
//                            }
//                            _initData();
//                        } else if (permission.shouldShowRequestPermissionRationale) {
//                            if (permission.name.equals(PermissionManager.PERMISSION_WRITE_EXTERNAL_STORAGE)) {
//                                Log.d(TAG, "二次权限请求 sd卡");
//                                PermissionManager.showSystemSettingPermission(SplashActivity.this);
//                                return;
//                            }
//
//                            if (permission.name.equals(PermissionManager.PERMISSION_READ_PHONE_STATE)) {
//                                LogUtils.d(TAG, "二次权限请求  手机状态的权限 ");
//                                PermissionManager.showSystemSettingPermission(SplashActivity.this);
//                                return;
//                            }
//
//                        } else { // 点击不在提醒
//
//
//                            if (permission.name.equals(PermissionManager.PERMISSION_WRITE_EXTERNAL_STORAGE)) {
//                                LogUtils.d(TAG,"点击了不在提醒 sd卡");
//                                PermissionManager.showSystemSettingPermission(SplashActivity.this);
//                                return;
//
//                            }
//
//                            if (permission.name.equals(PermissionManager.PERMISSION_READ_PHONE_STATE)) {
//                                LogUtils.d(TAG,"点击了不在提醒 phone");
//
//                                PermissionManager.showSystemSettingPermission(SplashActivity.this);
//                                return;
//                            }
//
//                        }
//
//                    }
//                });
    }


    private void _initData() {

        if (!PermissionManager.isAllRequestPermissionGranted(this, permissions)) {
            LogUtils.d(TAG, "全部权限没有通过");
            return;
        }

        //_______版本更新测试dialog -------
//        new IosAlertDialog(this).builder()
//                .setTitle("版本更新通知")
//                .setMsg("已有新版本,为了获得更好的体验,请您进行更新")
//                .setPositiveButton("立即更新", new View.OnClickListener() {
//                    @Override
//                    public void onClick(View v) {
//
//                    }
//                }).setNegativeButton("取消", new View.OnClickListener() {
//
//            @Override
//            public void onClick(View arg0) {
//                // TODO Auto-generated method stub
//            }
//        }).show();


//        toMain();
//

        boolean firstOpen = splashStateSP.getBoolean("firstOpen");
        LogUtils.d(TAG, "获取的跳转 " + fileName);
        if (!firstOpen) {


            toGuide();

        } else {


            String version = AppUtils.getVersion();
            LogUtils.d(TAG, "获取的版本" + version);

            //版本检测
            DownLoadManager.checkVersion("2", version, new BaseObserver<VersionBean>() {
                @Override
                public void onSubscribe(Disposable d) {
                    super.onSubscribe(d);
                }

                @Override
                public void onNext(VersionBean versionBean) {
                    super.onNext(versionBean);

                    LogUtils.d(TAG, "获取新的版本信息 :onNext 获取的code 值 " + versionBean.getCode());

                    checkVersion(versionBean);


                }

                @Override
                public void onError(Throwable e) {
                    super.onError(e);

                    LogUtils.d(TAG, "获取新版本的信息 : onError");
                    toMain();

                }

                @Override
                public void onComplete() {
                    super.onComplete();
////
                    LogUtils.d(TAG, "获取新版本的信息 : onComplete");
                }
            });

//
        }
//        //图标检测
        //  checkNavigatorBarIcon();

    }

    /**
     * 版本判断
     */
    private void checkVersion(VersionBean versionBean) {

        if (versionBean.getCode() == 0) {

            if (versionBean.getData().isCoerce()) {// 强制更新

                DialogHelper.showDialogForVersion(this,
                        "版本更新通知",
                        "已有新版本,为不影响您的使用,请您立即更新!"
                        , new View.OnClickListener() {
                            @Override
                            public void onClick(View v) {
                                // ---下载新版本
                                if (UpdateService.DOWNLOAD_CODE) {
                                    return;
                                }

                                UpdateService.startDownLoadApp(SplashActivity.this, versionBean.getData().getUrl());
                                UpdateService.DOWNLOAD_CODE = true;
                                toMain();


                            }
                        }, new View.OnClickListener() {
                            @Override
                            public void onClick(View v) {

                                finish();
                            }
                        });

            } else {
                // 非强制更新
                //versionBean.getData().getVersion()
                if (!(AppUtils.getVersion().equals(versionBean.getData().getVersion()))) {
                    DialogHelper.showDialogForVersion(this,
                            "版本更新通知",
                            "已有新版本,为获得更好体验,请您进行更新!"
                            , new View.OnClickListener() {
                                @Override
                                public void onClick(View v) {
                                    // 下载新版本

                                    if (UpdateService.DOWNLOAD_CODE) {
                                        return;
                                    }

                                    // 测试版本
//                                    String url = "https://qd.myapp.com/myapp/qqteam/AndroidQQi/qq_6.0.0.6500_android_r24934_GuanWang_537055160_release.apk";
                                    UpdateService.startDownLoadApp(SplashActivity.this, versionBean.getData().getUrl());
                                    UpdateService.DOWNLOAD_CODE = true;
                                    toMain();


                                }
                            }, new View.OnClickListener() {
                                @Override
                                public void onClick(View v) {


                                    toMain();
                                }
                            });


                } else {

                    LogUtils.d("检测版本, 相同 情况下直接跳转mainactivity ");
                    toMain();
                }

            }

        } else {
            // 返回其他code 值
            toMain();
        }

//        int currentVersion = AppUtils.getVersionCode();
//
//        LogUtils.d(TAG, "获取的版本信息----------" + currentVersion);
//
//        if (versionBean.getCode() == 0) { //请求成功
//            LogUtils.d(TAG,"获取数据成功");
//            if (currentVersion == Integer.valueOf(versionBean.getData().getVersion())) {
//                LogUtils.d(TAG,"版本一样 --------------------");
//                toMain();
//            } else if (currentVersion < Integer.valueOf(versionBean.getData().getVersion())) {
//                LogUtils.d(TAG,"版本不一样 当前版本小");
//                DialogHelper
//                        .showDialogForVersion(this, "版本更新通知", "已有新版本,为了获得更好的体验,请您进行更新",
//                                new View.OnClickListener() {
//                                    @Override
//                                    public void onClick(View v) {
//                                        // 升级
//                                        if(UpdateService.DOWNLOAD_CODE) {
//                                            return;
//                                        }
//
//                                        UpdateService.startDownLoadApp(SplashActivity.this,versionBean.getData().getUrl());
//                                        UpdateService.DOWNLOAD_CODE = true;
//                                        toMain();
//                                    }
//                                }, new View.OnClickListener() {
//                                    @Override
//                                    public void onClick(View v) {
//                                        // 取消  进入主页
//                                        toMain();
//                                    }
//                                });
//            }
//        }

//


//        if (currentVersion < versionBean.getMinVersionCode()) {
//            // 显示必须更新
//            // dialog 显示
//
//            //
//
//
//        } else if (currentVersion > versionBean.getMinVersionCode() && currentVersion < versionBean.getNewVersionCode()) {
//            // 非必须更新
//            // dialog显示
//            if (UpdateService.DOWNLOAD_CODE) {
//                return;
//            }
//            // showDialog ();
//
//            UpdateService.startDownLoadApp(this, versionBean.getApkUrl());
//            UpdateService.DOWNLOAD_CODE = true;
//
//        } else {
//
//            toMain();
//        }

    }


    @SuppressLint("CheckResult")
    private void toMain() {
//
//        Observable.interval(1, TimeUnit.SECONDS)
//                .take(2)
//                .subscribe(new Consumer<Long>() {
//                    @Override
//                    public void accept(Long aLong) throws Exception {
//                        if (aLong == 1) {


        Intent intent = new Intent(SplashActivity.this, MainHtmlActivity.class);
        intent.setData(getIntent().getData());
        startActivity(intent);
        overridePendingTransition(R.anim.tomain_open, R.anim.tomain_close);
        finish();
//                        }
//                    }
//                });


    }

    private void toGuide() {

        Observable.interval(1, TimeUnit.SECONDS)
                .take(3)
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe(new BaseObserver<Long>() {

                    Disposable mDisposable;

                    @Override
                    public void onSubscribe(Disposable d) {
                        super.onSubscribe(d);
                        this.mDisposable = d;
                    }

                    @Override
                    public void onNext(Long aLong) {
                        super.onNext(aLong);

                        if (aLong == 2) {
                            toGoGuideState();
                            if (mDisposable.isDisposed()) {
                                mDisposable.dispose();

                            }

//                            toGoGuideState();
                        }

                        LogUtils.d(TAG, "倒计时操作  +  " + aLong);
                    }

                    @Override
                    public void onError(Throwable e) {
                        super.onError(e);
                    }

                    @Override
                    public void onComplete() {
                        super.onComplete();
                    }
                });


    }


    private void toGoGuideState() {

        ivSplash.setVisibility(View.GONE);
        vpGuide.setVisibility(View.VISIBLE);

        mPagerAdapter = new GuidePagerAdapter(this, guideRes);
        vpGuide.setAdapter(mPagerAdapter);

    }


    private void checkNavigatorBarIcon() {

        DownLoadService downLoadService =
                HttpClientManager.getDownLoadService(false);

        downLoadService.navigatorBarIcon(String.valueOf(0))
                .compose(RxHelper.IO_Main())
                .subscribe(new BaseObserver<IconBean>() {
                    @Override
                    public void onSubscribe(Disposable d) {
                        super.onSubscribe(d);
                    }

                    @Override
                    public void onNext(IconBean iconBean) {
                        super.onNext(iconBean);

                        if (iconBean.getCode() == 0) {
                            // 获取zip文件 还有开启服务
                            // updateOrNormalIcon(iconBean.getData().get(0).getResource_ON().getUri());
                            updateOrNormalIcon("http://diich-resource.oss-cn-beijing.aliyuncs.com/image/appNavigation/NAVBAR.zip");
                        }
                    }

                    @Override
                    public void onError(Throwable e) {
                        super.onError(e);

                    }

                    @Override
                    public void onComplete() {
                        super.onComplete();
                    }
                });


    }

    /**
     * 检测 模块图标
     */
    private void updateOrNormalIcon(String uri) {

        //测试 ----------
        String url
                = "http://diich-resource.oss-cn-beijing.aliyuncs.com/image/appNavigation/NAVBAR.zip";


        if (!navIconSPUtils.getBoolean(StringUtils.zipFileName(url))) {

            // 表示已经下载已经
            if (!DownLoadNavService.LOADING_ICON_CODE) {
                DownLoadNavService.startLoadNavIconService(this, url);
            }

        }


        boolean newState = false;

        //startTOMain(newState, navIconSPUtils.getBoolean(StringUtils.zipFileName(url)),StringUtils.zipFileName(url));


    }

    // 启动主页
    private void startTOMain(boolean newState, boolean isUnzip, String zipName) {

        Intent intent = new Intent(SplashActivity.this, MainActivity.class);
        intent.putExtra("newState", newState);
        intent.putExtra("isUnzip", isUnzip);
        intent.putExtra("iconFile", zipName);
        startActivity(intent);
        overridePendingTransition(R.anim.tomain_open, R.anim.tomain_close);
        finish();
    }


//    private void startLoadNavIcon(String uri) {
//
//        Intent intent = new Intent(this, DownLoadNavService.class);
//        intent.putExtra("iconUrl", uri);
//        this.startService(intent);
//        DownLoadNavService.LOADING_ICON_CODE = true;
//
//    }


    private int[] permissions = {PermissionManager.CODE_STORAGE, PermissionManager.CODE_PHONE};


    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        switch (requestCode) {

            case PermissionManager.REQUEST_OPEN_APPLICATION_SETTING_CODE:

                _initData();

                break;
        }
    }


}
