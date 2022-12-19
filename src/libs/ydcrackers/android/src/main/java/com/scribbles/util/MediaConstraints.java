package com.scribbles.util;

import android.content.Context;
import android.os.Build;

public abstract class MediaConstraints {
    private static final String TAG = MediaConstraints.class.getSimpleName();

    public static MediaConstraints getPushMediaConstraints() {
        return new PushMediaConstraints();
    }

    public abstract int getImageMaxWidth(Context context);
    public abstract int getImageMaxHeight(Context context);
    public abstract int getImageMaxSize(Context context);

    public abstract int getGifMaxSize(Context context);
    public abstract int getVideoMaxSize(Context context);

    public int getUncompressedVideoMaxSize(Context context) {
        return getVideoMaxSize(context);
    }

    public int getCompressedVideoMaxSize(Context context) {
        return getVideoMaxSize(context);
    }

    public static boolean isVideoTranscodeAvailable() {
        return Build.VERSION.SDK_INT >= 26 && MemoryFileDescriptor.supported();
    }
}
