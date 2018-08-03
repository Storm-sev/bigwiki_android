package storm_lib.utils;

import android.app.Activity;
import android.app.ProgressDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.media.Image;
import android.support.annotation.DrawableRes;
import android.support.annotation.Nullable;
import android.support.annotation.StringRes;
import android.support.v7.app.AlertDialog;
import android.view.Gravity;
import android.view.View;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import com.efeiyi.bigwiki.IosAlertDialog;
import com.efeiyi.bigwiki.R;

/**
 * @author storm_
 * @date 2017/9/12
 * @address zq329051@outlook.com
 * @describe :　 dialog 工具类
 */
public class DialogHelper {


    public static final String TAG = DialogHelper.class.getSimpleName();


    /**
     * dialog 版本更新
     */
    public static void showDialogForVersion(Context context, String title, String message, View.OnClickListener positiveListener,
                                            View.OnClickListener negativeListener) {


        new IosAlertDialog(context).builder()
                .setTitle(title)
                .setMsg(message)
                .setPositiveButton("立即更新", new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        positiveListener.onClick(v);
                    }
                })
                .setNegativeButton("暂不更新", new View.OnClickListener() {

                    @Override
                    public void onClick(View arg0) {
                        // TODO Auto-generated method stub
                        negativeListener.onClick(arg0);

                    }
                }).show();
    }


    public static void showNoListenerDialog(Context context, String title, String message) {


        AlertDialog.Builder dialog
                = new AlertDialog.Builder(context);

        dialog.setTitle(title)
                .setMessage(message)
                .setPositiveButton("确定", null)
                .show();

    }


    /**
     * dialog (此处使用的v4包下的dialog)
     *
     * @param title
     */
    public static void showDialog(Context context, @StringRes int title, final DialogPositiveButtonListener dialogPosListener) {

        AlertDialog.Builder dialog = new AlertDialog.Builder(context);

        dialog.setMessage(title);
        dialog.setCancelable(false);
        dialog.setPositiveButton("确定", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {

                if (dialogPosListener != null) {
                    dialogPosListener.onDialogPositiveButtonListener();

                }

            }
        });

        dialog.setNegativeButton("取消", null);
        if (!((Activity) context).isFinishing()) {

            dialog.show();
        }

    }


    public static void showClickDialog(Context context, String title, String message, String positiveMsg, String negativeMsg, final DialogPositiveButtonListener listener) {


        AlertDialog.Builder dialog = new AlertDialog.Builder(context);
        dialog.setTitle(title);
        dialog.setMessage(message);
        dialog.setPositiveButton(positiveMsg, new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                if (listener != null) {
                    listener.onDialogPositiveButtonListener();
                }

            }
        });

        dialog.setNegativeButton(negativeMsg, new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {

                if (listener != null) {
                    listener.onDialogNegativeButtonListener();

                }
            }
        });

    }


    public static void showClickDialog(Context context, String message, String positiveMsg, String negativeMsg, final DialogPositiveButtonListener listener) {


        AlertDialog.Builder dialog = new AlertDialog.Builder(context);
        dialog.setMessage(message);
        dialog.setPositiveButton(positiveMsg, new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                if (listener != null) {
                    listener.onDialogPositiveButtonListener();
                }

            }
        });

        dialog.setNegativeButton(negativeMsg, new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {

                if (listener != null) {
                    listener.onDialogNegativeButtonListener();

                }
            }
        });

    }


    public static void showClickDialog(Context context, @StringRes int message, final DialogPositiveButtonListener dialogPositiveButtonListener) {


        AlertDialog.Builder dialog = new AlertDialog.Builder(context);
        dialog.setMessage(message);
        dialog.setPositiveButton(android.R.string.ok, new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {

                if (dialogPositiveButtonListener != null) {
                    dialogPositiveButtonListener.onDialogPositiveButtonListener();

                }
                dialog.dismiss();

            }
        });

        dialog.setNegativeButton(android.R.string.cancel, new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                if (dialogPositiveButtonListener != null) {
                    dialogPositiveButtonListener.onDialogNegativeButtonListener();

                }
                dialog.dismiss();

            }
        });


        dialog.show();


    }


    /**
     * 无点击事件的dialog
     *
     * @param title
     * @param message
     */
    public static void showNoClickDialog(Context context, int title, int message) {


        AlertDialog.Builder dialog = new AlertDialog.Builder(context);
        dialog.setTitle(title);
        dialog.setMessage(context.getText(message));
        dialog.setNeutralButton("OK", null);
        if (!((Activity) context).isFinishing()) {

            dialog.show();
        }

    }


    public interface DialogPositiveButtonListener {

        void onDialogPositiveButtonListener();

        void onDialogNegativeButtonListener();
    }


    /**
     * 加载数据进度条 (水平风格)
     */
    public static ProgressDialog createProgressDialogH(Context context, @Nullable String dialogTitle) {

        ProgressDialog dialogH = new ProgressDialog(context);

        dialogH.setProgressStyle(ProgressDialog.STYLE_HORIZONTAL);
        if (null == dialogTitle) {
            dialogH.setTitle(null);
        } else {
            dialogH.setTitle(dialogTitle);
        }
        dialogH.setCanceledOnTouchOutside(false);

        return dialogH;


    }


    public static void showCustomToast(Context context, String msg) {

        Toast toast = new Toast(context);
        toast.setGravity(Gravity.CENTER, 12, 20);
        TextView textView = new TextView(context);
        textView.setText(msg);
        textView.setBackground(context.getResources().getDrawable(R.drawable.bg_toast));
        textView.setTextColor(context.getResources().getColor(R.color.material_white));
        textView.setGravity(Gravity.CENTER);
        toast.setDuration(Toast.LENGTH_SHORT);

        toast.setView(textView);
        toast.show();
    }


    public static void showCustomToastOrIcon(Context context, @DrawableRes int drawableRes) {

        Toast toast = new Toast(context);
        toast.setGravity(Gravity.CENTER, 12, 20);
        ImageView imageView = new ImageView(context);
        imageView.setBackground(context.getResources().getDrawable(drawableRes));
        toast.setDuration(Toast.LENGTH_SHORT);
        toast.setView(imageView);
        toast.show();
    }


}
