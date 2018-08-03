package storm_lib.utils;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class StringUtils {

    public static final String TAG = StringUtils.class.getSimpleName();

    public static final String PHONE_REGEX = "^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$";

    public static final String PASSWORD_REGEX = "^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$";

    /**
     * 检测是否为手机号
     */
    public static boolean isMobile(String phoneNumber) {

        Pattern p = Pattern.compile(PHONE_REGEX, Pattern.CASE_INSENSITIVE);

        Matcher matcher = p.matcher(phoneNumber);

        return matcher.matches();

    }


    public static boolean checkPassword(String password) {

        Pattern p = Pattern.compile(PASSWORD_REGEX, Pattern.CASE_INSENSITIVE);

        Matcher matcher = p.matcher(password);

        return matcher.matches();

    }


    /**
     * 获取存储图标的文件名
     *
     * @return
     */
    public static String fileDirName(String zipUrl) {

        if (zipUrl != null) {
            return zipUrl.substring(zipUrl.lastIndexOf("/") + 1, zipUrl.lastIndexOf("."));
        }

        return null;
    }


    /**
     * 获取链接种的文件名
     *
     * @param zipUrl
     * @return
     */
    public static String zipFileName(String zipUrl) {

        if (zipUrl != null && zipUrl.length() != 0) {

            return zipUrl.substring(zipUrl.lastIndexOf("/") + 1, zipUrl.length());
        }
        return null;
    }

    /**
     * 从文件名获取文件
     */
    public static String zipFile2dir(String fileName
    ) {

        if (fileName != null && fileName.length() != 0) {

            return fileName.substring(0, fileName.lastIndexOf("."));
        }

        return null;
    }




}
