package com.efeiyi.bigwiki.activity;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.os.Bundle;
import android.support.v4.app.FragmentTransaction;
import android.webkit.WebView;
import android.widget.ImageView;

import com.efeiyi.bigwiki.R;
import com.efeiyi.bigwiki.fragment.ShareDetailFragment;
import com.jakewharton.rxbinding2.view.RxView;

import butterknife.BindView;
import butterknife.ButterKnife;
import storm_lib.base.BaseActivity;
import storm_lib.base.BaseCordovaFragment.BaseCordovaFragment;
import storm_lib.utils.LogUtils;
import storm_lib.utils.PermissionManager;

/**
 * 从其他应用分享跳转的页面
 */
public class SharedDetailActivity extends BaseActivity {

    BaseCordovaFragment fragment;
    @BindView(R.id.iv_back)
    ImageView ivBack;

    private int[] permissions = {PermissionManager.CODE_STORAGE, PermissionManager.CODE_PHONE};


    @SuppressLint("CheckResult")
    @Override
    protected void setUpListener() {

        RxView.clicks(ivBack).subscribe(o -> {

            // 权限判断
            if (!PermissionManager.isAllRequestPermissionGranted(this, permissions)) {

                Intent intent = new Intent(SharedDetailActivity.this, SplashActivity.class);
                startActivity(intent);
            } else finish();

        });

    }

    @Override
    protected void init() {
        fragment = new ShareDetailFragment();

        FragmentTransaction ft =
                getSupportFragmentManager().beginTransaction();

        ft.add(R.id.fl_share, fragment);

        ft.commit();
    }

    @Override
    protected void initViews() {

    }

    @Override
    protected void initData() {
    }

    @Override
    protected int attachLayoutRes() {
        return R.layout.activity_shared_detail;
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // TODO: add setContentView(...) invocation
        ButterKnife.bind(this);
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);

        setIntent(intent);

    }

}
