package storm_lib.httpclient.downLoad;

import io.reactivex.Observer;
import io.reactivex.disposables.Disposable;

public class FileSubscriber<T> implements Observer<T> {


    public static final String TAG= FileSubscriber.class.getSimpleName();

    private  FileCallBack fileCallBack;

    private  Disposable mDisposable;


    public FileSubscriber(FileCallBack<T> fileCallBack) {
        this.fileCallBack = fileCallBack;

    }

    @Override
    public void onSubscribe(Disposable d) {
        this.mDisposable = d;
        if (fileCallBack != null) {
            fileCallBack.onStart();
        }
    }

    @Override
    public void onNext(T t) {

        if (fileCallBack != null) {
            fileCallBack.onSuccess(t);
        }


    }

    @Override
    public void onError(Throwable e) {
        if (fileCallBack != null) {
            fileCallBack.onError(e, fileCallBack.fileName);
        }
    }

    @Override
    public void onComplete() {

        if (fileCallBack != null) {
            fileCallBack.onComplete();

        }

    }
}
