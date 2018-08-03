package storm_lib.httpclient.interceptor;

import java.io.IOException;

import okhttp3.CacheControl;
import okhttp3.Interceptor;
import okhttp3.Request;
import okhttp3.Response;
import storm_lib.utils.NetWorkUtils;

/**
 * 配置缓存库
 */
public class CacheInterceptor implements Interceptor {

    private static final String TAG = CacheInterceptor.class.getSimpleName();


    @Override
    public Response intercept(Chain chain) throws IOException {

        Request request =
                chain.request();

        if (!NetWorkUtils.isConnected()) {  // 判断网络 是否链接
            request.newBuilder()
                    .cacheControl(CacheControl.FORCE_CACHE) //
                    .build();
        }

        Response response
                = chain.proceed(request);


        if (NetWorkUtils.isConnected()) { // 网络有链接的时候
            return response.newBuilder()
                    .header("Cache-Control", "public, max-age=" + 60)
                    .removeHeader("Pragma")
                    .build();
        } else {
            // 没有网络的时候
            int maxTime = 24 * 24 * 60; // 离线缓存时间

            return  response.newBuilder()
                    .header("Cache-Control", "public, only-if-cached, max-stale=" + maxTime)
                    .removeHeader("Pragma")
                    .build();

        }

    }
}
