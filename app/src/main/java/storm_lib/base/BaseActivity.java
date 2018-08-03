package storm_lib.base;

import android.content.Intent;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v4.app.FragmentActivity;
import android.support.v7.app.AppCompatActivity;

import com.umeng.analytics.MobclickAgent;
import com.umeng.message.PushAgent;
import com.umeng.socialize.UMShareAPI;

import butterknife.ButterKnife;
import storm_lib.utils.LogUtils;


/**
 * base activity
 */
public abstract class BaseActivity extends FragmentActivity {

    public static final String TAG = BaseActivity.class.getSimpleName();

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(attachLayoutRes());
        ButterKnife.bind(this);
        LogUtils.d(TAG,"创建 activity ----------------" + this);
        PushAgent.getInstance(this).onAppStart();  // 程序开始的时候调用
        init();
        initViews();
        initData();
        setUpListener();
    }


    // listener
    protected abstract void setUpListener();

    // init
    protected abstract void init();

    //view
    protected abstract void initViews();

    // data
    protected abstract void initData();

    /**
     * init lauout
     */
    protected abstract int attachLayoutRes();



    @Override
    protected void onResume() {
        super.onResume();
        // umeng
        MobclickAgent.onResume(this);

    }

    @Override
    protected void onPause() {
        super.onPause();
        //umeng
        MobclickAgent.onPause(this);

    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        //UMShareAPI.get(this).onActivityResult(requestCode, resultCode, data);
    }
}
