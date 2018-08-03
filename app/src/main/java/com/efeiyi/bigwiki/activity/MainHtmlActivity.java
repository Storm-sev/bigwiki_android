package com.efeiyi.bigwiki.activity;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.support.v4.app.FragmentTransaction;
import android.util.Log;
import android.widget.FrameLayout;

import com.efeiyi.bigwiki.R;
import com.efeiyi.bigwiki.fragment.CordovaFragment;

import butterknife.BindView;
import butterknife.ButterKnife;
import storm_lib.base.BaseActivity;
import storm_lib.base.BaseCordovaFragment.BaseCordovaFragment;
import storm_lib.utils.LogUtils;

/**
 * 首页
 */
public class MainHtmlActivity extends BaseActivity {


    private static final String TAG = MainHtmlActivity.class.getSimpleName();
    @BindView(R.id.fl_main)
    FrameLayout flMain;

    BaseCordovaFragment fragment;

    @Override
    protected void setUpListener() {

    }

    @Override
    protected void init() {
        fragment = new CordovaFragment();

        FragmentTransaction ft =
                getSupportFragmentManager().beginTransaction();

        ft.add(R.id.fl_main, fragment);

        ft.commit();

    }

    @Override
    protected void onNewIntent(Intent intent) {


        super.onNewIntent(intent);

        if (fragment != null) {
            ((CordovaFragment) fragment).shareToDetail(intent.getData());
        }


//        Uri data = intent.getData();
//
//
//        if (data != null) {
//
//            // 跳转 分享相关的页面
//
//            Intent intent1 = new Intent(this, SharedDetailActivity.class);
//            intent1.setData(data);
//            startActivity(intent1);
//        }
    }

    @Override
    protected void initViews() {

    }

    @Override
    protected void initData() {

    }

    @Override
    protected int attachLayoutRes() {
        return R.layout.activity_main_html;
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // TODO: add setContentView(...) invocation
        ButterKnife.bind(this);
    }
}
