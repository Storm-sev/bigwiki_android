package storm_lib.base.BaseHtmlFragment;

import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.graphics.Bitmap;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v4.app.Fragment;
import android.text.Layout;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.WebView;

import org.apache.cordova.ConfigXmlParser;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaPreferences;
import org.apache.cordova.CordovaWebView;
import org.apache.cordova.CordovaWebViewImpl;
import org.apache.cordova.PluginEntry;
import org.apache.cordova.engine.SystemWebView;
import org.apache.cordova.engine.SystemWebViewClient;
import org.apache.cordova.engine.SystemWebViewEngine;

import java.util.ArrayList;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.prefs.BackingStoreException;

import butterknife.ButterKnife;
import butterknife.Unbinder;
import storm_lib.utils.LogUtils;

public abstract class BaseHtmlFragment extends Fragment implements CordovaInterface {

    private final String TAG = this.getClass().getSimpleName();

    protected Context mContext;
    protected ConfigXmlParser mXmlParser;
    protected CordovaPreferences mPreferences;

    protected String launchUrl;

    protected ArrayList<PluginEntry> mPluginEntries;

    protected MyCordovaInterfaceImpl mCordovaInterfaceImpl;

    protected CordovaWebView mAppView;

    protected SystemWebView mSystemWebView;

    protected View mRootView;

    protected Unbinder unbinder;


    @Override
    public void onAttach(Context context) {
        super.onAttach(context);
        this.mContext = context;

    }


    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        loadConfig();
    }


    private void loadConfig() {

        mXmlParser = new ConfigXmlParser();
        mXmlParser.parse(this.getActivity());

        mPreferences = mXmlParser.getPreferences();
        mPreferences.setPreferencesBundle(getActivity().getIntent().getExtras());

        launchUrl = mXmlParser.getLaunchUrl();

        mPluginEntries = mXmlParser.getPluginEntries();

        mXmlParser.parse(mContext);

//        mCordovaInterfaceImpl = new MyCordovaInterfaceImpl(getActivity());


    }


    @Nullable
    @Override
    public View onCreateView(LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {

        if (mRootView == null) {
            LayoutInflater localInflater = inflater.cloneInContext(new CordovaContext(mContext, this));
            mRootView = localInflater.inflate(attachLayoutRes(), null);
            unbinder = ButterKnife.bind(this, mRootView);
            mSystemWebView = mRootView.findViewById(attachWebViewIdRes());
            mSystemWebView.getSettings().setUserAgentString("Android");

            mAppView = new CordovaWebViewImpl(new SystemWebViewEngine(mSystemWebView));
            mAppView.init(this, mXmlParser.getPluginEntries(), mPreferences);


        }

        return mRootView;
    }

    @Override
    public void onViewCreated(View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        mAppView.loadUrl(loadWebViewUrl());

    }

    @Override
    public void onActivityCreated(@Nullable Bundle savedInstanceState) {
        super.onActivityCreated(savedInstanceState);

        _init();
        setUpListener();
    }

    private void _init() {

        // 监听页面加载完成
        mSystemWebView.setWebViewClient(new SystemWebViewClient((SystemWebViewEngine) mAppView.getEngine()) {

            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                LogUtils.d(TAG, "页面加载完成 " + url);
                initData();
            }

            @Override
            public void onPageStarted(WebView view, String url, Bitmap favicon) {
                super.onPageStarted(view, url, favicon);
                LogUtils.d(TAG,"webView onPagerStart : " + url);

                preLoadHtmlData(view,url);
            }

            @Override
            public void onReceivedError(WebView view, int errorCode, String description, String failingUrl) {
                super.onReceivedError(view, errorCode, description, failingUrl);
                LogUtils.d(TAG,"webView onReceivedError : ");
            }
        });




    }

    protected abstract void preLoadHtmlData(WebView view, String url);



    protected abstract void setUpListener();


    protected abstract void initData();


    protected abstract String loadWebViewUrl();


    protected abstract int attachWebViewIdRes();


    protected abstract int attachLayoutRes();


    @Override
    public void onStart() {
        super.onStart();
        if (this.mAppView == null) {
            return;

        }

        this.mAppView.handleStart();

    }

    @Override
    public void onResume() {
        super.onResume();
        if (this.mAppView == null) {
            return;

        }

        this.mSystemWebView.requestFocus();
        this.mAppView.handleResume(this.keepRunning);

    }


    @Override
    public void onStop() {
        super.onStop();
        if (this.mAppView == null) {
            return;

        }
        this.mAppView.handleStop();
    }

    @Override
    public void onPause() {
        super.onPause();

        if (this.mAppView != null) {
            boolean keepRunning = this.keepRunning;

            this.mAppView.handlePause(keepRunning);

        }

    }


    @Override
    public void onDestroyView() {
        super.onDestroyView();

        if (unbinder != null) {
            unbinder.unbind();
        }

        if (null != mAppView) {
            mAppView.handleDestroy();
        }

    }


    // cordova ---

    protected static CordovaPlugin mCordovaPlugin;

    protected boolean keepRunning = true;

    protected boolean activityResultKeepRunning;

    private final ExecutorService threadPool = Executors.newCachedThreadPool();

    @Override
    public void startActivityForResult(CordovaPlugin command, Intent intent, int requestCode) {
        mCordovaPlugin = command;

        this.activityResultKeepRunning = this.keepRunning;

        if (command == null) {
            this.keepRunning = false;
        }
       // super.startActivityForResult(intent, requestCode);
    }


    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {

        CordovaPlugin plugin = mCordovaPlugin;

        if (plugin != null) {
            plugin.onActivityResult(requestCode, resultCode, data);
        }

      //  super.onActivityResult(requestCode, resultCode, data);

    }


    @Override
    public void setActivityResultCallback(CordovaPlugin plugin) {

    }

    @Override
    public Object onMessage(String id, Object data) {
        return null;
    }

    @Override
    public ExecutorService getThreadPool() {
        return threadPool;
    }

    @Override
    public void requestPermission(CordovaPlugin plugin, int requestCode, String permission) {

    }

    @Override
    public void requestPermissions(CordovaPlugin plugin, int requestCode, String[] permissions) {

    }

    @Override
    public boolean hasPermission(String permission) {
        return false;
    }


}
