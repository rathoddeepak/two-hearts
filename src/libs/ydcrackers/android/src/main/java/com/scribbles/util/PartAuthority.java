package com.scribbles.util;
import android.content.ContentUris;
import android.content.Context;
import android.content.UriMatcher;
import android.net.Uri;
import androidx.annotation.NonNull;

import java.io.IOException;
import java.io.InputStream;

public class PartAuthority {

    public static InputStream getAttachmentStream(@NonNull Context context, @NonNull Uri uri)
            throws IOException {
        try {
            return context.getContentResolver().openInputStream(uri);
        } catch (SecurityException se) {
            throw new IOException(se);
        }
    }

}
