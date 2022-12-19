package com.scribbles.util;

import android.content.ContentResolver;
import android.text.TextUtils;
import android.webkit.MimeTypeMap;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

public class MediaUtil {

    private static final String TAG = MediaUtil.class.getSimpleName();

    public static final String IMAGE_PNG         = "image/png";
    public static final String IMAGE_JPEG        = "image/jpeg";
    public static final String IMAGE_HEIC        = "image/heic";
    public static final String IMAGE_HEIF        = "image/heif";
    public static final String IMAGE_WEBP        = "image/webp";
    public static final String IMAGE_GIF         = "image/gif";
    public static final String AUDIO_AAC         = "audio/aac";
    public static final String AUDIO_UNSPECIFIED = "audio/*";
    public static final String VIDEO_MP4         = "video/mp4";
    public static final String VIDEO_UNSPECIFIED = "video/*";
    public static final String VCARD             = "text/x-vcard";
    public static final String LONG_TEXT         = "text/x-signal-plain";
    public static final String VIEW_ONCE         = "application/x-signal-view-once";
    public static final String UNKNOWN           = "*/*";

    public static SlideType getSlideTypeFromContentType(@NonNull String contentType) {
        if (isGif(contentType)) {
            return SlideType.GIF;
        } else if (isImageType(contentType)) {
            return SlideType.IMAGE;
        } else if (isVideoType(contentType)) {
            return SlideType.VIDEO;
        } else if (isAudioType(contentType)) {
            return SlideType.AUDIO;
        } else if (isMms(contentType)) {
            return SlideType.MMS;
        } else if (isLongTextType(contentType)) {
            return SlideType.LONG_TEXT;
        } else if (isViewOnceType(contentType)) {
            return SlideType.VIEW_ONCE;
        } else {
            return SlideType.DOCUMENT;
        }
    }

    public static @Nullable String getCorrectedMimeType(@Nullable String mimeType) {
        if (mimeType == null) return null;

        switch(mimeType) {
            case "image/jpg":
                return MimeTypeMap.getSingleton().hasMimeType(IMAGE_JPEG)
                        ? IMAGE_JPEG
                        : mimeType;
            default:
                return mimeType;
        }
    }


    public static boolean isMms(String contentType) {
        return !TextUtils.isEmpty(contentType) && contentType.trim().equals("application/mms");
    }

    public static boolean isGif(Attachment attachment) {
        return isGif(attachment.getContentType());
    }

    public static boolean isJpeg(Attachment attachment) {
        return isJpegType(attachment.getContentType());
    }

    public static boolean isHeic(Attachment attachment) {
        return isHeicType(attachment.getContentType());
    }

    public static boolean isHeif(Attachment attachment) {
        return isHeifType(attachment.getContentType());
    }

    public static boolean isImage(Attachment attachment) {
        return isImageType(attachment.getContentType());
    }

    public static boolean isAudio(Attachment attachment) {
        return isAudioType(attachment.getContentType());
    }

    public static boolean isVideo(Attachment attachment) {
        return isVideoType(attachment.getContentType());
    }

    public static boolean isVideo(String contentType) {
        return !TextUtils.isEmpty(contentType) && contentType.trim().startsWith("video/");
    }

    public static boolean isVcard(String contentType) {
        return !TextUtils.isEmpty(contentType) && contentType.trim().equals(VCARD);
    }

    public static boolean isGif(String contentType) {
        return !TextUtils.isEmpty(contentType) && contentType.trim().equals("image/gif");
    }

    public static boolean isJpegType(String contentType) {
        return !TextUtils.isEmpty(contentType) && contentType.trim().equals(IMAGE_JPEG);
    }

    public static boolean isHeicType(String contentType) {
        return !TextUtils.isEmpty(contentType) && contentType.trim().equals(IMAGE_HEIC);
    }

    public static boolean isHeifType(String contentType) {
        return !TextUtils.isEmpty(contentType) && contentType.trim().equals(IMAGE_HEIF);
    }

    public static boolean isFile(Attachment attachment) {
        return !isGif(attachment) && !isImage(attachment) && !isAudio(attachment) && !isVideo(attachment);
    }

    public static boolean isTextType(String contentType) {
        return (null != contentType) && contentType.startsWith("text/");
    }

    public static boolean isImageType(String contentType) {
        return (null != contentType) && contentType.startsWith("image/");
    }

    public static boolean isAudioType(String contentType) {
        return (null != contentType) && contentType.startsWith("audio/");
    }

    public static boolean isVideoType(String contentType) {
        return (null != contentType) && contentType.startsWith("video/");
    }

    public static boolean isImageOrVideoType(String contentType) {
        return isImageType(contentType) || isVideoType(contentType);
    }

    public static boolean isLongTextType(String contentType) {
        return (null != contentType) && contentType.equals(LONG_TEXT);
    }

    public static boolean isViewOnceType(String contentType) {
        return (null != contentType) && contentType.equals(VIEW_ONCE);
    }

    public static @Nullable String getDiscreteMimeType(@NonNull String mimeType) {
        final String[] sections = mimeType.split("/", 2);
        return sections.length > 1 ? sections[0] : null;
    }



    private static boolean isSupportedVideoUriScheme(@Nullable String scheme) {
        return ContentResolver.SCHEME_CONTENT.equals(scheme) ||
                ContentResolver.SCHEME_FILE.equals(scheme);
    }

    public enum SlideType {
        GIF,
        IMAGE,
        VIDEO,
        AUDIO,
        MMS,
        LONG_TEXT,
        VIEW_ONCE,
        DOCUMENT
    }
}
