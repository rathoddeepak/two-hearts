package com.scribbles.util;

import android.annotation.TargetApi;
import android.app.ActivityManager;
import android.content.Context;
import android.os.Build;
import android.os.Handler;
import android.os.Looper;

import androidx.annotation.NonNull;

public class Util {

    private static volatile Handler handler;

    @TargetApi(Build.VERSION_CODES.KITKAT)
    public static boolean isLowMemory(Context context) {
        ActivityManager activityManager = (ActivityManager) context.getSystemService(Context.ACTIVITY_SERVICE);

        return (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT && activityManager.isLowRamDevice()) ||
                activityManager.getLargeMemoryClass() <= 64;
    }
    public static boolean isMainThread() {
        return Looper.myLooper() == Looper.getMainLooper();
    }
    public static void runOnMain(final @NonNull Runnable runnable) {
        if (isMainThread()) runnable.run();
        else                getHandler().post(runnable);
    }

    private static Handler getHandler() {
        if (handler == null) {
            synchronized (Util.class) {
                if (handler == null) {
                    handler = new Handler(Looper.getMainLooper());
                }
            }
        }
        return handler;
    }
}
