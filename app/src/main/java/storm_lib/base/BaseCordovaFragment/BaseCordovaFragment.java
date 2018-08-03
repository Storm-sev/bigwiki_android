package storm_lib.base.BaseCordovaFragment;


import android.content.Context;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.FrameLayout;
import android.widget.RelativeLayout;

import com.efeiyi.bigwiki.R;

import org.apache.cordova.ConfigXmlParser;
import org.apache.cordova.CordovaInterfaceImpl;
import org.apache.cordova.CordovaPreferences;
import org.apache.cordova.CordovaWebView;
import org.apache.cordova.CordovaWebViewImpl;
import org.apache.cordova.PluginEntry;
import org.apache.cordova.engine.SystemWebView;

import java.util.ArrayList;

import butterknife.Unbinder;
import storm_lib.base.BaseCordovaActivity;
import storm_lib.utils.LogUtils;

public abstract  class BaseCordovaFragment extends Fragment {

    public String TAG = this.getClass().getSimpleName();

    protected CordovaWebView webView;

    protected CordovaPreferences preferences;
    protected String launchUrl;
    protected ArrayList<PluginEntry> pluginEntries;
    protected CordovaInterfaceImpl cordovaInterface;
    protected Context mContext;


    @Override
    public void onAttach(Context context) {
        super.onAttach(context);
        this.mContext = context;
    }

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        // rootView will contain cordova web view
        View rootView = inflater.inflate(attachLayoutRes(), container, false);
        cordovaInterface = new CordovaInterfaceImpl(getActivity());
//        if (savedInstanceState != null)
//            cordovaInterface.restoreInstanceState(savedInstanceState);

        loadConfig();
        // new web view
        webView = new CordovaWebViewImpl(CordovaWebViewImpl.createEngine(getActivity(), preferences));

        RelativeLayout.LayoutParams wvlp = new RelativeLayout.LayoutParams(
                RelativeLayout.LayoutParams.MATCH_PARENT,
                RelativeLayout.LayoutParams.MATCH_PARENT);
        webView.getView().setLayoutParams(wvlp);
        // init
        if (!webView.isInitialized()) {
            webView.init(cordovaInterface, pluginEntries, preferences);
            ((SystemWebView)(webView.getView())).getSettings().setUserAgentString("Android");
        }
        cordovaInterface.onCordovaInit(webView.getPluginManager());
        // your Url
        LogUtils.d(TAG, "load   Web view url " + loadWebViewUrl());
        webView.loadUrl(launchUrl);

        ((FrameLayout) rootView).addView(webView.getView());
        loadWebViewUrl();
        return rootView;
    }

    protected abstract String loadWebViewUrl();


    protected abstract int attachLayoutRes();


    protected void loadConfig() {
        ConfigXmlParser parser = new ConfigXmlParser();
        parser.parse(getActivity());
        preferences = parser.getPreferences();
        preferences.setPreferencesBundle(getActivity().getIntent().getExtras());
        // set config.xml
        launchUrl = parser.getLaunchUrl();
        LogUtils.d(TAG,"原始  -------" + launchUrl);
        pluginEntries = parser.getPluginEntries();
    }

    @Override
    public void onActivityCreated(@Nullable Bundle savedInstanceState) {
        super.onActivityCreated(savedInstanceState);
        initData();
    }

    protected abstract void initData();


    @Override
    public void onResume() {
        super.onResume();
        if (webView == null) {
            return;
        }

        this.webView.handleResume(true);
    }

    @Override
    public void onPause() {
        super.onPause();

        if (webView != null) {
            this.webView.handlePause(true);

        }
    }

    @Override
    public void onDestroy() {
        super.onDestroy();

        if (webView != null) {
            this.webView.handleDestroy();
        }
    }


    @Override
    public void onStart() {
        super.onStart();

        if (webView != null) {
            this.webView.handleStart();

        }
    }

    @Override
    public void onStop() {
        super.onStop();

        if (webView != null) {
            this.webView.handleStop();

        }
    }
}

