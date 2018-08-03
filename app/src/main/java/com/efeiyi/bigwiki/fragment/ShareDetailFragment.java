package com.efeiyi.bigwiki.fragment;

import android.net.Uri;
import android.util.Log;

import com.efeiyi.bigwiki.R;
import com.nordnetab.chcp.main.HotCodePushPlugin;
import com.nordnetab.chcp.main.model.PluginFilesStructure;

import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginEntry;

import java.util.Collection;

import storm_lib.base.BaseCordovaFragment.BaseCordovaFragment;
import storm_lib.utils.LogUtils;

public class ShareDetailFragment extends BaseCordovaFragment {


    @Override
    protected String loadWebViewUrl() {



        String data = getActivity().getIntent().getData().toString();
//        String path = data.getQueryParameter("path");

        String path = data.substring((data.indexOf("=") + 1));


        LogUtils.d(TAG, "获取的值 在分享的--------------- fragment 中   " + path);
//        return "file:///android_asset/www/pages/news/details.html?id=1471";



        path = "file:///android_asset/www/" + path;

        launchUrl = path;

        HotCodePushPlugin hotCodePush =
                (HotCodePushPlugin) webView.getPluginManager().getPlugin("HotCodePush");
        hotCodePush.setStartingPage(path);

        LogUtils.d(TAG,"自定义加载  --------------------");

        return path;
    }

    @Override
    protected int attachLayoutRes() {
        return R.layout.fragment_share_open;
    }

    @Override
    protected void initData() {

    }
}
