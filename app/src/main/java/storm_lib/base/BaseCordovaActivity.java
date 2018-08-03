package storm_lib.base;

import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v7.app.AppCompatActivity;

import com.umeng.analytics.MobclickAgent;

import org.apache.cordova.CordovaActivity;

/**
 * base cordovaactivity
 *
 */
public abstract class BaseCordovaActivity extends CordovaActivity {

    private static final String TAG = BaseCordovaActivity.class.getSimpleName();


    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        Bundle extras = getIntent().getExtras();
        if (extras != null && extras.getBoolean("cdvStartInBackground", false)) {
            moveTaskToBack(true);
        }

        loadUrl(loadHtmlUrl());

    }

    /**
     *  load html
     */
    protected abstract String loadHtmlUrl();


    @Override
    protected void onResume() {
        super.onResume();
        MobclickAgent.onResume(this);

    }

    @Override
    protected void onPause() {
        super.onPause();
        MobclickAgent.onPause(this);
    }
}
