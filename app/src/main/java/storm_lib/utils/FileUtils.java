package storm_lib.utils;

import android.app.Application;
import android.content.Context;
import android.os.Environment;
import android.widget.TextView;

import java.io.File;
import java.io.FileFilter;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.security.cert.TrustAnchor;

import anet.channel.request.ByteArrayEntry;
import okhttp3.ResponseBody;

/**
 * 文件操作工具类
 */
public class FileUtils {

    public static final  String TAG= FileUtils.class.getSimpleName();
    /**
     *
     *
     */
    public static long getFileSize(File file) throws IOException {

        long size = 0;
        if (file.exists()) {
            FileInputStream fis = null;
            fis = new FileInputStream(file);

            size = fis.available();  // 获取的文件长度

        } else {

            size = -1;
        }

        return size;
    }


    /**
     * 检测sd 卡是否
     */
    public static boolean isSD() {

        if (Environment.getExternalStorageState().equals(Environment.MEDIA_MOUNTED)) {
            return true;
        } else return false;
    }


    public static String getFileDir(Context context) {

        return context.getFilesDir().getAbsolutePath();
    }


    public static boolean deleteAllFilesInDir(File dir) {


        return deleteFilesInDirWithFilter(dir, new FileFilter() {
            @Override
            public boolean accept(File pathname) {
                return true;
            }
        });
    }



    private static boolean deleteFilesInDirWithFilter(File dir, FileFilter fileFilter) {

        if (dir == null) return false;
        if (!dir.exists()) return true;
        if (!dir.isDirectory()) return false;

        File[] files = dir.listFiles();

        if (files != null && files.length != 0) {
            for (File file : files) {
                if (fileFilter.accept(file)) {
                    if (file.isFile()) {
                        if (!file.delete()) return false;
                    } else if (file.isDirectory()) {
                        if (!deleteDir(file)) return false;
                    }
                }
            }
        }

        return true;
    }

    // 删除目录
    private static boolean deleteDir(File dir) {

        if (dir == null) return false;
        if (!dir.exists()) return true;
        if (!dir.isDirectory()) return false;

        File[] files = dir.listFiles();
        if (files != null && files.length != 0) {

            for (File file : files) {

                if (file.isFile()) {
                    if (!file.delete()) return false;
                } else if (file.isDirectory()) {
                    if (!deleteDir(file)) return false;
                }
            }
        }


        return dir.delete();
    }

    /**
     * 存储文件
     */
    public static boolean saveFile(ResponseBody body, File zipFileDir, String fileName) {

        boolean isSave;

        if (body == null || zipFileDir == null || fileName == null) {
            return false;
        }

        if (!zipFileDir.exists() ) { // 文件 有问题

            LogUtils.d(TAG, "创建 zip 文件目录" + zipFileDir.isDirectory());

            zipFileDir.mkdirs();

        }
        InputStream is = null;

        FileOutputStream fos = null;

        File zipFile = new File(zipFileDir, fileName);

        try {
            is = body.byteStream();

            byte[] buffer = new byte[2048];
            int len;

            fos = new FileOutputStream(zipFile);

            while ((len = is.read(buffer)) != -1) {
                fos.write(buffer, 0, len);
            }

            fos.flush();

            isSave = true;

        } catch (IOException e) {
            e.printStackTrace();
            isSave = false;
        } finally {

            CloseUtils.closeIO(is, fos);

        }


        return isSave;
    }
}
