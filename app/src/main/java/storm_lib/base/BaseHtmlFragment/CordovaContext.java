package storm_lib.base.BaseHtmlFragment;

import android.app.Activity;
import android.content.Context;
import android.content.ContextWrapper;
import android.content.Intent;

import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;

import java.util.concurrent.ExecutorService;

public class CordovaContext extends ContextWrapper implements CordovaInterface {

    public static final String TAG = CordovaContext.class.getSimpleName();

    CordovaInterface cordova;

    public CordovaContext(Context context, CordovaInterface fragment) {
        super(context);

        this.cordova = fragment;

    }

    @Override
    public void startActivityForResult(CordovaPlugin command, Intent intent, int requestCode) {
//        cordova.startActivityForResult(command, intent, requestCode);
    }

    @Override
    public void setActivityResultCallback(CordovaPlugin plugin) {

//        cordova.setActivityResultCallback(plugin);
    }

    @Override
    public Activity getActivity() {
        return cordova.getActivity();
    }

    @Override
    public Context getContext() {
        return cordova.getContext();
    }

    @Override
    public Object onMessage(String id, Object data) {
        return cordova.onMessage(id, data);
    }

    @Override
    public ExecutorService getThreadPool() {
        return cordova.getThreadPool();
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
