package storm_lib.base;

import io.reactivex.Observer;
import io.reactivex.disposables.Disposable;

/**
 * 观察者 不带被压
 */
public abstract class BaseObserver<T> implements Observer<T> {

    Disposable mDisposable;
    @Override
    public void onSubscribe(Disposable d) {
       this.mDisposable = d;
    }

    @Override
    public void onNext(T t) {

    }

    @Override
    public void onError(Throwable e) {

    }

    @Override
    public void onComplete() {

    }
}
