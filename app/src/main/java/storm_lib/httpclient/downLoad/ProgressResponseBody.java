package storm_lib.httpclient.downLoad;

import android.support.annotation.Nullable;

import java.io.IOException;

import okhttp3.MediaType;
import okhttp3.ResponseBody;
import okio.Buffer;
import okio.BufferedSource;
import okio.ForwardingSource;
import okio.Okio;
import okio.Source;
import storm_lib.httpclient.RxBus;

/**
 *  响应体 实时获取下载进度
 */
public class ProgressResponseBody extends ResponseBody {


    public static final String TAG = ProgressResponseBody.class.getSimpleName();

    private ResponseBody responseBody;
    private FileLoadEvent fileLoadEvent;
    private BufferedSource bufferedSource;


    public ProgressResponseBody(ResponseBody responseBody) {
        this.responseBody = responseBody;

        this.fileLoadEvent = new FileLoadEvent();
    }

    @Nullable
    @Override
    public MediaType contentType() {


        return responseBody.contentType();
    }

    @Override
    public long contentLength() {
        return responseBody.contentLength();
    }

    @Override
    public BufferedSource source() {
        if (bufferedSource == null) {
            bufferedSource = Okio.buffer(source(responseBody.source()));
        }
        return bufferedSource;
    }

    private Source source(BufferedSource source) {

        return new ForwardingSource(source) {
            long bytesReaded = 0;


            @Override
            public long read(Buffer sink, long byteCount) throws IOException {
                long bytesRead = super.read(sink, byteCount);

                bytesReaded += bytesRead == -1 ? 0 : bytesRead;
                fileLoadEvent.setTotal(responseBody.contentLength());
                fileLoadEvent.setProgress(bytesReaded);
                // rxbus 发送数据

                RxBus.getInstance().sendByBackPressure(fileLoadEvent);

                return bytesRead;
            }
        };

    }
}
