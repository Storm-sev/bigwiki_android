package storm_lib.httpclient.downLoad;

import android.media.audiofx.LoudnessEnhancer;
import android.util.Log;

import org.reactivestreams.Subscriber;
import org.reactivestreams.Subscription;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;

import okhttp3.ResponseBody;
import storm_lib.httpclient.RxBus;
import storm_lib.utils.CloseUtils;
import storm_lib.utils.LogUtils;

/**
 * 下载文件的回调
 */
public abstract class FileCallBack<T> {

    public static final String TAG = FileCallBack.class.getSimpleName();

    protected String fileDir;           // 文件存储路径
    protected String fileName;          // 文件的名字
    protected boolean isOpenProgress;   // 是否显示进度


    public FileCallBack(String fileDir, String fileName, boolean isOpenProgress) {
        this.fileDir = fileDir;
        this.fileName = fileName;
        this.isOpenProgress = isOpenProgress;

        if (isOpenProgress) {
            subscribeLoadProgress();  //订阅进度条
        }

    }


    public abstract void onSuccess(T t);

    public abstract void onStart();

    public abstract void onComplete();

    public abstract void onError(Throwable e,String fileName);

    public abstract void onProgress(float progress, long total);


    /**
     * s
     *
     * @param body
     */
    public void saveFile(ResponseBody body) {


        byte[] buff = new byte[2048];
        int len;

        File dir = new File(fileDir);

        if (!dir.exists()) {
            dir.mkdirs();
        }
        InputStream is = null;
        FileOutputStream fos = null;
        File file = null;

        try {
            is = body.byteStream();

            file = new File(dir, fileName);

            fos = new FileOutputStream(file);


            while ((len = is.read(buff)) != -1) {
                fos.write(buff, 0, len);

            }

            fos.flush();

        } catch (IOException e) {
            e.printStackTrace();
            LogUtils.d(TAG,"下载失败");

            onError(e,fileName); //回调接口

        } finally {

            CloseUtils.closeIO(is, fos);

            if (isOpenProgress) {  // 没有进度条解除订阅
                //解除订阅
                unSubscribe();
            }

        }

    }

    /**
     * 解除订阅
     */
    private void unSubscribe() {

        if (RxBus.getInstance().hasSubscribers(true)) {
            RxBus.getInstance().unSubscription();
        }


    }


    /**
     * 订阅进度条 显示
     */
    private void subscribeLoadProgress() {


        RxBus.getInstance().doFlowable(FileLoadEvent.class, new Subscriber<FileLoadEvent>() {
            Subscription sub;


            @Override
            public void onSubscribe(Subscription s) {
                LogUtils.d(TAG, "订阅 progress :  onSubscribe ");
                this.sub = s;

                sub.request(1);
            }

            @Override
            public void onNext(FileLoadEvent fileLoadEvent) {
                LogUtils.d(TAG, "订阅 progress :  onNext()");

                long progress = fileLoadEvent.getProgress();
                long total = fileLoadEvent.getTotal();

                onProgress(progress * 1.0f / total, total);
                sub.request(1);
            }


            @Override
            public void onError(Throwable t) {
                LogUtils.d(TAG, "订阅 progress : onError");


            }

            @Override
            public void onComplete() {
                LogUtils.d(TAG, "订阅 progress : onComplete ");

            }
        });

    }


   // 不带进度的 存储文件
//    public void  saveFileNoProgress() {
//
//    }
}
