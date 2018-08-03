package com.efeiyi.bigwiki.activity;

import android.annotation.SuppressLint;
import android.os.Bundle;
import android.support.v4.view.ViewPager;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.Toast;

import com.efeiyi.bigwiki.R;
import com.efeiyi.bigwiki.adapter.GuidePagerAdapter;
import com.jakewharton.rxbinding2.view.RxView;

import butterknife.BindView;
import butterknife.ButterKnife;
import storm_lib.base.BaseActivity;
import storm_lib.httpclient.downLoad.DownLoadManager;

public class GuideActivity extends BaseActivity {

    public static final String TAG = GuideActivity.class.getSimpleName();

    @BindView(R.id.vp_guide)
    ViewPager vpGuide;
    @BindView(R.id.back)
    ImageButton back;
    @BindView(R.id.iv_download_guide)
    ImageView ivDownloadGuide;

    private GuidePagerAdapter mAdapter;

    private int curPos;

    private int[] guideRes = {R.drawable.guide1, R.drawable.guide2,
            R.drawable.guide3, R.drawable.guide4};


    @SuppressLint("CheckResult")
    @Override
    protected void setUpListener() {

        RxView.clicks(back)
                .subscribe(o -> {
                    finish();
                });

        RxView.clicks(ivDownloadGuide)
                .subscribe(o -> {

                    //保存图片到相册

                    boolean downState = DownLoadManager.downloadImgToCamera(this, guideRes[curPos]);

                    if (downState) {
                        Toast.makeText(this, "保存成功", Toast.LENGTH_SHORT).show();
                    } else {
                        Toast.makeText(this, "保存失败", Toast.LENGTH_SHORT).show();

                    }
                });


        vpGuide.addOnPageChangeListener(new ViewPager.OnPageChangeListener() {
            @Override
            public void onPageScrolled(int position, float positionOffset, int positionOffsetPixels) {

            }

            @Override
            public void onPageSelected(int position) {
                curPos = position;
            }

            @Override
            public void onPageScrollStateChanged(int state) {

            }
        });


    }

    @Override
    protected void init() {

    }

    @Override
    protected void initViews() {

        mAdapter = new GuidePagerAdapter(this, guideRes);
        vpGuide.setAdapter(mAdapter);

    }

    @Override
    protected void initData() {

    }

    @Override
    protected int attachLayoutRes() {
        return R.layout.activity_guide;
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // TODO: add setContentView(...) invocation
        ButterKnife.bind(this);
    }
}
