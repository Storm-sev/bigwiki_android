package storm_lib.httpclient.downLoad;


import com.efeiyi.bigwiki.bean.IconBean;
import com.efeiyi.bigwiki.bean.VersionBean;

import io.reactivex.Observable;
import okhttp3.ResponseBody;
import retrofit2.http.GET;
import retrofit2.http.POST;
import retrofit2.http.Query;
import retrofit2.http.Streaming;
import retrofit2.http.Url;

/**
 * 下载接口
 */
public interface DownLoadService {


    /**
     * 检测版本
     * @param phone
     * @param
     * @return
     */
    @GET("appversion/getapp")
    Observable<VersionBean> checkVersion(@Query("type") String phone,
                                         @Query("appVer") String version);

    /**
     * 更新apk
     *
     * @param url
     * @return
     */
    @Streaming
    @GET
    Observable<ResponseBody> downLoadNewApk(@Url String url);


    /**
     * 下载资源文件
     */
    @Streaming
    @GET
    Observable<ResponseBody> downloadFile(@Url String fileUrl);


    @GET("navigationbar/getlist")
    Observable<IconBean> navigatorBarIcon(@Query("type") String type);


}
