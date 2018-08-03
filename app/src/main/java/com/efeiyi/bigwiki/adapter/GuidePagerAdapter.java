package com.efeiyi.bigwiki.adapter;

import android.content.Context;
import android.support.annotation.NonNull;
import android.support.v4.view.PagerAdapter;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;

/**
 * guide pager  adapter
 */
public class GuidePagerAdapter extends PagerAdapter {


    private Context mContext;
    private int[]  guideRes;

    public GuidePagerAdapter(Context context, int[] guideRes) {
        this.mContext = context;
        this.guideRes = guideRes;
    }

    @Override
    public int getCount() {
        return guideRes.length;
    }

    @Override
    public boolean isViewFromObject(@NonNull View view, @NonNull Object object) {
        return view == object;
    }

    @Override
    public void destroyItem(@NonNull ViewGroup container, int position, @NonNull Object object) {
        container.removeView((View) object);
    }


    @NonNull
    @Override
    public Object instantiateItem(@NonNull ViewGroup container, int position) {

        ImageView imageView = new ImageView(mContext);
        imageView.setScaleType(ImageView.ScaleType.FIT_XY);
//        imageView.setBackgroundResource();
        imageView.setBackgroundResource(guideRes[position]);

        container.addView(imageView);
        return imageView;
    }
}
