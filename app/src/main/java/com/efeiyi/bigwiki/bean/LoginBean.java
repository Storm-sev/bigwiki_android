package com.efeiyi.bigwiki.bean;

/**
 * 登录所需要的bean 类
 */
public class LoginBean {


    /**
     * loginType : 4
     * loginName : 18302229140
     * password : 123123aa
     */

    private int loginType;
    private String loginName;
    private String password;

    public int getLoginType() {
        return loginType;
    }

    public void setLoginType(int loginType) {
        this.loginType = loginType;
    }

    public String getLoginName() {
        return loginName;
    }

    public void setLoginName(String loginName) {
        this.loginName = loginName;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
