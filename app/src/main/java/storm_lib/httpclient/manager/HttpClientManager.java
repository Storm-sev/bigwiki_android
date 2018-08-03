package storm_lib.httpclient.manager;

import com.efeiyi.bigwiki.app.MApplication;
import com.efeiyi.bigwiki.httpclient.LoginService;

import java.io.File;
import java.util.concurrent.TimeUnit;

import okhttp3.Cache;
import okhttp3.OkHttpClient;
import okhttp3.logging.HttpLoggingInterceptor;
import retrofit2.Retrofit;
import retrofit2.adapter.rxjava2.RxJava2CallAdapterFactory;
import retrofit2.converter.gson.GsonConverterFactory;
import storm_lib.httpclient.Api;
import storm_lib.httpclient.downLoad.DownLoadService;
import storm_lib.httpclient.downLoad.ProgressInterceptor;
import storm_lib.httpclient.interceptor.CacheInterceptor;
import storm_lib.httpclient.service.HttpClientService;
import storm_lib.utils.LogUtils;

/**
 * 网络框架
 */
public class HttpClientManager {

    private static final String TAG = HttpClientManager.class.getSimpleName();


    public static OkHttpClient httpClient;      //
    public static volatile Retrofit mRetrofit;
    public static HttpClientService mHttpClientService;


    /**
     * 初始化 操作
     *
     * @return
     */
    private static Retrofit initRetrofit() {

        if (mRetrofit == null) {
            synchronized (HttpClientManager.class) {
                if (mRetrofit == null) {
                    HttpLoggingInterceptor loggingInterceptor = new HttpLoggingInterceptor();
                    loggingInterceptor.setLevel(HttpLoggingInterceptor.Level.BODY);  // 设置请求中的log

                    CacheInterceptor cacheInterceptor = new CacheInterceptor();

                    Cache cache = new Cache(new File(MApplication.appContext.getCacheDir(), "HttpCache"),
                            1024 * 1024 * 100);

                    LogUtils.d(TAG, "okhttp网络请求的缓存路径 " + MApplication.appContext.getCacheDir().toString());

                    httpClient = new OkHttpClient.Builder()
//                            .cache(cache)
                            .addInterceptor(cacheInterceptor)
                            .retryOnConnectionFailure(true)
                            .addInterceptor(loggingInterceptor)
                            .connectTimeout(10, TimeUnit.SECONDS)
                            .readTimeout(10, TimeUnit.SECONDS)
                            .writeTimeout(10, TimeUnit.SECONDS)
                            .build();


                    mRetrofit = new Retrofit.Builder()
                            .baseUrl(Api.BASE_URL)
                            .client(httpClient)
                            .addCallAdapterFactory(RxJava2CallAdapterFactory.create())
                            .addConverterFactory(GsonConverterFactory.create())
                            .build();

                }
            }
        }
        return mRetrofit;
    }


    /**
     *  login model
     *
     * @return
     */
    public static LoginService getLoginService() {


        return initRetrofit()
                .newBuilder()
                .client(httpClient.newBuilder()
                        .cache(null)
                        .build())
                .build()
                .create(LoginService.class);
    }

    /**
     * 获取下载添加进度条的接口
     *
     * @return
     */
    public static DownLoadService getDownLoadService() {
        // 创建 进度interceptor  '

        ProgressInterceptor progressInterceptor = new ProgressInterceptor();

        return initRetrofit()
                .newBuilder()
                .client(httpClient
                        .newBuilder()
                        .addNetworkInterceptor(progressInterceptor)
                        .build()
                ).build()
                .create(DownLoadService.class);

    }


    /**
     * 获取下载接口
     * 不带进度条
     */
    public static DownLoadService getDownLoadService(boolean isProgress) {


        return initRetrofit().create(DownLoadService.class);
    }


    /**
     * 获取数据请求接口
     *
     * @return
     */
    public static HttpClientService getHttpClientService() {
        if (mHttpClientService == null) {
            mHttpClientService = getHttpService(HttpClientService.class);
        }
        return mHttpClientService;
    }

    /**
     * 获取请求接口
     */
    public static <T> T getHttpService(Class<T> clazz) {
        return initRetrofit().create(clazz);
    }

}
