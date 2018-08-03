package storm_lib.base;

import org.reactivestreams.Subscriber;
import org.reactivestreams.Subscription;

/**
 * 带背压
 */
public abstract class BaseSubscriber<T> implements Subscriber<T> {

    Subscription mSubscription;

    @Override
    public void onSubscribe(Subscription s) {
        this.mSubscription = s;
    }

    @Override
    public void onNext(T t) {

    }

    @Override
    public void onError(Throwable t) {

    }

    @Override
    public void onComplete() {

    }
}
