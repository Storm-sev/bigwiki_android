package storm_lib.httpclient.downLoad;

import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.os.Environment;
import android.util.Log;
import android.widget.SimpleCursorTreeAdapter;

import com.efeiyi.bigwiki.app.MApplication;
import com.efeiyi.bigwiki.bean.VersionBean;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FilenameFilter;
import java.io.IOException;
import java.util.List;

import io.reactivex.Observable;
import io.reactivex.Observer;
import io.reactivex.android.schedulers.AndroidSchedulers;
import io.reactivex.disposables.Disposable;
import io.reactivex.functions.Consumer;
import io.reactivex.schedulers.Schedulers;
import okhttp3.ResponseBody;
import retrofit2.http.Url;
import storm_lib.base.BaseObserver;
import storm_lib.base.BaseSubscriber;
import storm_lib.httpclient.manager.HttpClientManager;
import storm_lib.utils.LogUtils;
import storm_lib.utils.SPUtils;

/**
 * 下载管理工具类
 */
public class DownLoadManager {

    public static final String TAG = DownLoadManager.class.getSimpleName();


    /**
     * 保存图片到相册
     * @param context
     * @param imgRes
     * @return
     */
    public static boolean downloadImgToCamera(Context context,int imgRes) {

        // 获取资源文件
        Bitmap image = BitmapFactory.decodeResource(context.getResources(), imgRes);

        //存文件
        String imgDir = Environment.getExternalStorageDirectory().getAbsolutePath() + File.separator + "bigwikiimage";

        File appDir = new File(imgDir);

        if (!appDir.exists()) {
            appDir.mkdirs();
        }

        String fileName = System.currentTimeMillis() + ".jpg";

        File file = new File(appDir, fileName);

        try {
            FileOutputStream fos = new FileOutputStream(file);

          boolean isSucess = image.compress(Bitmap.CompressFormat.JPEG, 60, fos);

            fos.flush();
            fos.close();

            Uri uri = Uri.fromFile(file);

            context.sendBroadcast(new Intent(Intent.ACTION_MEDIA_SCANNER_SCAN_FILE, uri));

            return isSucess;

            // 保存图片到相册,

        }  catch (IOException e) {
            e.printStackTrace();
        }

        return false;

    }

    /**
     * 版本检测
     *
     * @param phone
     */
    public static void checkVersion(String phone, String version, BaseObserver<VersionBean> observer ) {


        Observable<VersionBean> versionBeanObservable =
                HttpClientManager.getDownLoadService(false).checkVersion(phone, version);

        versionBeanObservable.subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe(observer);
    }

    /**
     * 更新apk
     */
    public static void loadApk(String url, final FileCallBack<ResponseBody> fileCallBack) {


        if( url == null || url.equals("")) {

            fileCallBack.onError(new Throwable("this url is no data"), null);
        }
        Observable<ResponseBody> downLoadNewApk =
                HttpClientManager.getDownLoadService().downLoadNewApk(url);

        downLoadNewApk.subscribeOn(Schedulers.io())
                .observeOn(Schedulers.io())
                .doOnNext(new Consumer<ResponseBody>() {
                    @Override
                    public void accept(ResponseBody body) throws Exception {
                        LogUtils.d(TAG, "body ---> " + body.contentLength());
                        fileCallBack.saveFile(body);

                    }
                }).observeOn(AndroidSchedulers.mainThread())
                .subscribe(new FileSubscriber<ResponseBody>(fileCallBack));

    }


    /**
     * 下载导航栏的图标文件
     */
    public static void loadNavigatorBarIcon(String iconUrl, final FileCallBack<ResponseBody> fileCallBack) {


        Observable<ResponseBody> downloadIcon
                = HttpClientManager.getDownLoadService(false).downloadFile(iconUrl);

        downloadIcon.subscribeOn(Schedulers.io())
                .observeOn(Schedulers.io())
                .doOnNext(new Consumer<ResponseBody>() {
                    @Override
                    public void accept(ResponseBody body) throws Exception {
                        fileCallBack.saveFile(body);
                    }
                })
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe(new FileSubscriber<ResponseBody>(fileCallBack));

    }


    /**
     * 多个图标文件下载
     */
    public static void loadNavigatorBarIcon(final List<String> iconUrls) {

        final String iconPath = MApplication.appContext.getExternalFilesDir("").getAbsolutePath() + File.separator + "icon";
        File file = new File(iconPath);

        if (!file.exists()) { // 创建文件夹 ;
            file.mkdir();
        }


        final String fileName = "icon.png";

        for (int i = 0; i <= iconUrls.size(); i++) {


            loadNavigatorBarIcon(iconUrls.get(i), new FileCallBack<ResponseBody>(iconPath,
                    fileName, false) {

                long fileSize = 0;

                @Override
                public void onSuccess(ResponseBody body) {
                    // 获取bogy的长度

                    fileSize = body.contentLength();

                }

                @Override
                public void onStart() {

                }

                @Override
                public void onComplete() {
                    // 下载完成后

                    // 拿到longSize 对比长度
                    //检测图片是否下载完整
                    SPUtils sp_icon = SPUtils.getINSTACE("sp_icon");
                    sp_icon.put(fileName, true);
                    // 完整那么 存储到sp中的结果


                }

                @Override
                public void onError(Throwable e, String fileName) {
                    // 如果出现错误 检查网络

                    //loadNavigatorBarIcon(iconUrls.get(i), this);

                    // 为空的时 重新获取
                }


                @Override
                public void onProgress(float progress, long total) {

                }
            });


        }


    }


}
