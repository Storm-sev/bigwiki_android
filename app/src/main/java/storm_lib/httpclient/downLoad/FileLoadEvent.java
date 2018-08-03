package storm_lib.httpclient.downLoad;

/**
 * 文件下载event
 */
public class FileLoadEvent {

    long total;
    long progress;


    public FileLoadEvent(long total, long progress) {
        this.total = total;
        this.progress = progress;
    }

    public FileLoadEvent() {
    }


    public long getTotal() {
        return total;
    }

    public void setTotal(long total) {
        this.total = total;
    }

    public long getProgress() {
        return progress;
    }

    public void setProgress(long progress) {
        this.progress = progress;
    }
}
