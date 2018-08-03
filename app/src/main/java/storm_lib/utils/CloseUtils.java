package storm_lib.utils;

import java.io.Closeable;
import java.io.IOException;

/**
 * Created by storm on 2017/9/15.
 * 关闭流 操作类
 */

public class CloseUtils {

    /**
     * 关闭流
     * @param closeables
     */
    public static void closeIO(final Closeable... closeables) {

        if (closeables == null) return;

        for (Closeable closeable : closeables) {

            if (closeable != null) {
                try {
                    closeable.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }




}
