package storm_lib.base;

import android.app.Fragment;
import android.content.Context;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import butterknife.ButterKnife;
import butterknife.Unbinder;

public abstract class BaseFragment extends Fragment {

    public static final String TAG = BaseFragment.class.getSimpleName();


    protected Context mContext;

    protected View mRootView;

    protected Unbinder unbinder;


    @Override
    public void onAttach(Context context) {
        super.onAttach(context);
        this.mContext = context;

    }


    @Nullable
    @Override
    public View onCreateView(LayoutInflater inflater, @Nullable ViewGroup container, Bundle savedInstanceState) {
        if (mRootView == null) {
            mRootView = inflater.inflate(attachLayoutRes(), null);
            unbinder = ButterKnife.bind(this, mRootView);

        }
        return mRootView;
    }


    @Override
    public void onActivityCreated(@Nullable Bundle savedInstanceState) {
        super.onActivityCreated(savedInstanceState);

        initData();
        setUpListener();
    }

    // set listener
    protected abstract void setUpListener();

    // init data
    protected abstract void initData();

    // init layout for fragment
    protected abstract int attachLayoutRes();


    @Override
    public void onDestroyView() {
        super.onDestroyView();
        unbinder.unbind();
    }

}
