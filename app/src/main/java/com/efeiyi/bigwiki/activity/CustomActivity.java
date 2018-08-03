package com.efeiyi.bigwiki.activity;

import android.media.tv.TvContract;
import android.os.Bundle;
import android.webkit.WebView;

import com.efeiyi.bigwiki.R;

import butterknife.BindView;
import butterknife.ButterKnife;
import storm_lib.base.BaseActivity;

public class CustomActivity extends BaseActivity {


    @BindView(R.id.wb_web)
    WebView wbWeb;

    @Override
    protected void setUpListener() {

    }

    @Override
    protected void init() {

        wbWeb.getSettings().setAppCacheEnabled(true);
        wbWeb.getSettings().setJavaScriptEnabled(true);
        wbWeb.loadUrl("http://m.diich.com/info/");

    }

    @Override
    protected void initViews() {

    }

    @Override
    protected void initData() {

    }

    @Override
    protected int attachLayoutRes() {
        return R.layout.activity_custom;
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // TODO: add setContentView(...) invocation
        ButterKnife.bind(this);
    }
}
