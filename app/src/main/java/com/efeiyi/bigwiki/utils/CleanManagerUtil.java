package com.efeiyi.bigwiki.utils;

import android.content.Context;
import android.os.Environment;

import com.efeiyi.bigwiki.app.MApplication;

import java.io.File;
import java.math.BigDecimal;

import storm_lib.utils.LogUtils;

/**
 * 本应用清除缓存管理
 */
public class CleanManagerUtil {

    public static final String TAG = CleanManagerUtil.class.getSimpleName();

    public static final String SD_CACHE = "";


    public static Context getContext() {

        return MApplication.getAppContext();
    }


    /**
     * 清除app 下的缓存文件
     */
    public static void deleteAppCache() {
        //清除应用内缓存
        deleteInternalCache();
        //清除sd 卡的缓存
        deleteSDCache();
    }


    /**
     * 清除sd 卡的缓存文件
     */
    private static void deleteSDCache() {
        if (Environment.getExternalStorageState().equals(Environment.MEDIA_MOUNTED)) {
            cleanFileByDirectory(getContext().getExternalCacheDir());
        } else {

            return;
        }

    }

    /**
     * 清除自定义路径下的文件
     */
    private static void deleteCustomCache(String filePath) {

        cleanFileByDirectory(new File(filePath));
    }


    /**
     * 清除 date/data/包名/files 文件的内容 只支持目录下的文件的删除.
     */
    private static void deleteFile() {
        cleanFileByDirectory(getContext().getFilesDir());
    }

    /**
     * 清除本应用内的缓存文件
     */
    private static void deleteInternalCache() {
        cleanFileByDirectory(getContext().getCacheDir());
    }

    /**
     * 获取总的缓冲大小
     *
     * @return
     */
    public static String getTotalCacheSize() throws Exception {

        // 获取应用内缓存

        long cacheSize = getFolderSize(getContext().getCacheDir());
        LogUtils.d(TAG,"获取的文件路径 : " + getContext().getCacheDir().getAbsolutePath() + "文件大小" +  getFolderSize(new File(getContext().getCacheDir().getAbsolutePath(), "org.chromium.android_webview")));

        if (Environment.getExternalStorageState().equals(Environment.MEDIA_MOUNTED)) {
            cacheSize += getFolderSize(getContext().getExternalCacheDir());
            LogUtils.d(TAG,"获取的sd文件路径 : " + getContext().getExternalCacheDir().getAbsolutePath().toString() +
                    "文件大小" +  getFolderSize(getContext().getExternalCacheDir()));

        }

        return getFormatSize(cacheSize);
    }

    /**
     * 清除文件
     *
     * @param file
     */
    private static void cleanFileByDirectory(File file) {
        if (file != null && file.exists() && file.isDirectory()) {
            for (File item : file.listFiles()) {
                item.delete();
            }
        }
    }

    /**
     * 格式化单位
     *
     * @param size
     * @return
     */
    public static String getFormatSize(long size) {
        double kiloByte = size / 1024;

        if (kiloByte < 1) {
            return size + "B";
        }

        double megaByte = kiloByte / 1024;
        if (megaByte < 1) {
            BigDecimal result = new BigDecimal(Double.toString(kiloByte));
            return result.setScale(2, BigDecimal.ROUND_HALF_UP).toPlainString() + "kB";

        }

        double gigaByte = megaByte / 1024;
        if (gigaByte < 1) {
            BigDecimal resultMb = new BigDecimal(Double.toString(megaByte));
            return resultMb.setScale(2, BigDecimal.ROUND_HALF_UP).toPlainString() + "MB";
        }

        double teraByte = gigaByte / 1024;
        if (teraByte < 1) {
            BigDecimal resultGB = new BigDecimal(Double.toString(gigaByte));
            return resultGB.setScale(2, BigDecimal.ROUND_HALF_UP).toPlainString() + "GB";
        }

        BigDecimal resultTB = new BigDecimal(Double.toString(teraByte));

        return resultTB.setScale(2, BigDecimal.ROUND_HALF_UP).toPlainString() + "TB";
    }

    /**
     * 获取文件大小
     *
     * @param file
     * @return
     */
    public static long getFolderSize(File file) throws Exception {
        long size = 0;

        try {
            File[] filesList = file.listFiles();

            for (int i = 0; i < filesList.length; i++) {
                // 如果下面还又文件
                if (filesList[i].isDirectory()) {
                    size = size + getFolderSize(filesList[i]);
                } else {
                    size = size + filesList[i].length();
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }


        return size;
    }

}
