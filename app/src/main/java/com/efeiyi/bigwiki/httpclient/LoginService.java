package com.efeiyi.bigwiki.httpclient;


import com.efeiyi.bigwiki.bean.UserBean;
import com.efeiyi.bigwiki.bean.VerifyBean;

import io.reactivex.Observable;
import okhttp3.ResponseBody;
import retrofit2.http.GET;
import retrofit2.http.POST;
import retrofit2.http.Query;

public interface LoginService {

    /**
     * 发送验证码
     */
    @GET("appGetVerifycode?")
    Observable<VerifyBean> sendVerifyCode(@Query("phone") String phoneNumber,
                                          @Query("type") String type);

    @GET("appGetVerifycode?")
    Observable<ResponseBody> sendVerifyCode2(@Query("phone") String phoneNumber,
                                             @Query("type") String type);

    /**
     * 注册
     */
    @POST("appregister")
    Observable<UserBean> registerUser(@Query("params") String params,
                                      @Query("code") String code);


    /**
     * 登录接口
     */
    @POST("appLogin")
    Observable<UserBean> login(@Query("params") String userContent);
}


