package com.efeiyi.bigwiki.bean;

public class VersionBean {


    /**
     * msg : SUCCESS
     * code : 0
     * data : {"coerce":true,"version":"1.0","url":"www.baidu.com"}
     */

    private String msg;
    private int code;
    private DataBean data;

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }

    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public DataBean getData() {
        return data;
    }

    public void setData(DataBean data) {
        this.data = data;
    }

    public static class DataBean {
        /**
         * coerce : true
         * version : 1.0
         * url : www.baidu.com
         */

        private boolean coerce;
        private String version;
        private String url;

        public boolean isCoerce() {
            return coerce;
        }

        public void setCoerce(boolean coerce) {
            this.coerce = coerce;
        }

        public String getVersion() {
            return version;
        }

        public void setVersion(String version) {
            this.version = version;
        }

        public String getUrl() {
            return url;
        }

        public void setUrl(String url) {
            this.url = url;
        }
    }
}
