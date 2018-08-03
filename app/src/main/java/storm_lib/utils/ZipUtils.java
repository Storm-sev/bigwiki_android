package storm_lib.utils;

import android.nfc.Tag;
import android.text.InputType;
import android.util.Log;
import android.widget.Toolbar;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.lang.reflect.Array;
import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.List;
import java.util.regex.Pattern;
import java.util.zip.ZipEntry;
import java.util.zip.ZipFile;
import java.util.zip.ZipOutputStream;

import okhttp3.CookieJar;

/**
 * 解压相关工具类
 */
public class ZipUtils {

    public static final String TAG = ZipUtils.class.getSimpleName();

    private static final int BUFFER_LEN = 8192;

    /**
     * unzip file
     *
     * @param zipFile
     * @param destDir
     * @return
     */
    public static List<File> unZipFile(File zipFile,
                                       File destDir) throws IOException {


        return unZipFileByKeyword(zipFile, destDir, null);
    }

    private static List<File> unZipFileByKeyword(File zipFile, File destDir, String keyword) throws IOException {

        if (zipFile == null || destDir == null) return null;

        List<File> files
                = new ArrayList<>();

        ZipFile zf = null;

        //
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.N) {
            zf = new ZipFile(zipFile, Charset.forName("GBK"));
        }
        //
        Enumeration<?> entries = zf.entries();

        if (isSpace(keyword)) { // 密码为空
            while (entries.hasMoreElements()) {
                ZipEntry entry = (ZipEntry) entries.nextElement();
                String entryName = entry.getName();

                if (entryName.contains("../")) {
                    LogUtils.d(TAG, "zipUtils unzip  is  dangerous");
                    return files;
                }

                if (!unzipChildFile(destDir, files, zf, entry, entryName)) return files;

            }
        } else {
            while (entries.hasMoreElements()) {
                ZipEntry zipEntry = (ZipEntry) entries.nextElement();

                String entryName = zipEntry.getName();

                if (entryName.contains("../")) {
                    LogUtils.d(TAG, "zipUtils unzip  is  dangerous");
                    return files;
                }

                if (entryName.contains(keyword)) {

                    if (!unzipChildFile(destDir, files, zf, zipEntry, entryName)) return files;
                }
            }
        }
        return files;
    }

    /**
     * destDir
     */
    private static boolean unzipChildFile(File destDir,
                                          List<File> files,
                                          ZipFile zf,
                                          ZipEntry zipEntry,
                                          String entryName) throws IOException {

        String filePath = destDir + File.separator + entryName;
        File file = new File(filePath);
        files.add(file);

        if (zipEntry.isDirectory()) { //是目录
            if (!createOrExistDir(file)) return false;
        } else {
            if (!createOrExistsFile(file)) return false;
            //写入文件
            InputStream in = null;
            OutputStream out = null;
            try {
                in = new BufferedInputStream(zf.getInputStream(zipEntry));
                out = new BufferedOutputStream(new FileOutputStream(file));
                byte buffer[] = new byte[BUFFER_LEN];
                int len;
                while ((len = in.read(buffer)) != -1) {
                    out.write(buffer, 0, len);
                }

            } finally {

                if (in != null) {
                    in.close();
                }
                if (out != null) {
                    out.close();

                }
            }

        }


        return true;
    }


    private static boolean createOrExistsFile(File file) {
        if (file == null) return false;
        if (file.exists()) return file.isFile();
        if (!createOrExistDir(file.getParentFile())) return false;


        try {

            // 用来检查是不是真的创建文件成功
            return file.createNewFile(); // y
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }


    public static boolean createOrExistDir(File file) {

        return file != null && (file.exists() ? file.isDirectory() : file.mkdirs());
    }

    /**
     * 压缩文件
     *
     * @param srcFile
     * @param rootPath
     * @param zos
     * @param comment
     * @return
     */
    private static boolean zipFile(File srcFile, String rootPath,
                                   ZipOutputStream zos, String comment) throws IOException {

        rootPath = rootPath + (isSpace(rootPath) ? "" : File.separator) + srcFile.getName();
        if (srcFile.isDirectory()) { //是一个目录

            File[] fileList = srcFile.listFiles();

            if (fileList == null || fileList.length <= 0) {
                ZipEntry entry = new ZipEntry(rootPath + '/');
                entry.setComment(comment);
                zos.putNextEntry(entry);
                zos.closeEntry();
            } else {
                for (File file : fileList) {
                    if (!zipFile(file, rootPath, zos, comment)) {
                        return false;
                    }
                }
            }
        } else {// 是一个文件撒

            InputStream is = null;

            try {
                is = new BufferedInputStream(new FileInputStream(srcFile));

                ZipEntry entry = new ZipEntry(rootPath);

                entry.setComment(comment); // 设置注释
                zos.putNextEntry(entry);

                byte buffer[] = new byte[BUFFER_LEN];
                int len;

                while ((len = is.read(buffer, 0, BUFFER_LEN)) != -1) {
                    zos.write(buffer, 0, len);
                }

                zos.closeEntry();

            } finally {

                if (is != null) {
                    is.close();
                }
            }

        }
        return true;

    }

    private static boolean isSpace(String s) {
        if (s == null) {
            return true;
        }

        for (int i = 0, len = s.length(); i < len; i++) {
            if (!Character.isWhitespace(s.charAt(i))) {
                return false;
            }
        }
        return true;
    }

}
