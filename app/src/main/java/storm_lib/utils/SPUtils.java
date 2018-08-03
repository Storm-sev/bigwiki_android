package storm_lib.utils;

import android.content.Context;
import android.content.SharedPreferences;
import android.support.annotation.NonNull;
import android.support.v4.util.SimpleArrayMap;

import com.efeiyi.bigwiki.app.MApplication;

import java.util.Map;


public class SPUtils {

    public static final String TAG = SPUtils.class.getSimpleName();


    public static SharedPreferences sp;
    public static SimpleArrayMap<String, SPUtils> SP_UTILS_MAP = new SimpleArrayMap<>();


    public SPUtils(String spName) {
        sp = MApplication.appContext.getSharedPreferences(spName, Context.MODE_PRIVATE);
    }


    public static SPUtils getINSTEANCE() {
        return getINSTACE("");
    }


    public static SPUtils getINSTACE(String spName) {

        if (isSpace(spName)) {
            spName = "storm";
        }

        SPUtils spUtils = SP_UTILS_MAP.get(spName);

        if (spUtils == null) {
            spUtils = new SPUtils(spName);
            SP_UTILS_MAP.put(spName, spUtils);
        }

        return spUtils;


    }

    // -----------------put get-----------

    //string

    public void put(@NonNull String key, @NonNull String value) {

        sp.edit().putString(key, value).apply();

    }

    public String getString(@NonNull String key) {
        return getString(key, "");
    }

    public String getString(@NonNull String key, String defValue) {
        return sp.getString(key, defValue);
    }

    // int

    public void put(@NonNull String key, int value) {

        sp.edit().putInt(key, value).apply();

    }

    public int getInt(@NonNull String key) {
        return getInt(key, -1);
    }


    public int getInt(@NonNull String key, int defValue) {
        return sp.getInt(key, defValue);
    }

    // float

    public void put(@NonNull String key, float value) {

        sp.edit().putFloat(key, value).apply();

    }

    public float getFloat(@NonNull String key) {
        return getFloat(key, -1F);
    }


    public float getFloat(@NonNull String key, float defValue) {
        return sp.getFloat(key, defValue);
    }


    // long

    public void put(@NonNull String key, long value) {

        sp.edit().putFloat(key, value).apply();

    }

    public long getLong(@NonNull String key) {
        return getLong(key, -1L);
    }


    public long getLong(@NonNull String key, long defValue) {
        return sp.getLong(key, defValue);
    }

    // Boolean

    public void put(@NonNull String key, boolean value) {

        sp.edit().putBoolean(key, value).apply();

    }

    public boolean getBoolean(@NonNull String key) {
        return getBoolean(key, false);
    }


    public boolean getBoolean(@NonNull String key, boolean defValue) {
        return sp.getBoolean(key, defValue);
    }

    //获取全部
    public Map<String, ?> getAll() {
        return sp.getAll();
    }


    public void remove(@NonNull String key) {
        sp.edit().remove(key).apply();
    }

    /**
     * 清除sp中 的所有数据
     */
    public void clear() {
        sp.edit().clear().apply();
    }

    /**
     * 判断字符串是否为空 或者全部为空的字符串
     *
     * @param str
     * @return
     */
    public static boolean isSpace(String str) {
        if (str == null) {
            return true;
        }

        for (int i = 0, len = str.length(); i < len; ++i) {
            if (!Character.isWhitespace(str.charAt(i))) {

                return false;
            }
        }


        return true;
    }

}
