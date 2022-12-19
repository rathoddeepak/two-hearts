package com.scribbles.util;

import android.content.Context;

import androidx.annotation.AnyThread;
import androidx.annotation.MainThread;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AlertDialog;

import com.ydcrackerpackages.R;

public final class SimpleProgressDialog {

    private SimpleProgressDialog() {}

    @MainThread
    public static @NonNull AlertDialog show(@NonNull Context context) {
        AlertDialog dialog = new AlertDialog.Builder(context)
                .setView(R.layout.progress_dialog)
                .setCancelable(false)
                .create();
        dialog.show();
        dialog.getWindow().setLayout(context.getResources().getDimensionPixelSize(R.dimen.progress_dialog_size),
                context.getResources().getDimensionPixelSize(R.dimen.progress_dialog_size));

        return dialog;
    }


    public interface DismissibleDialog {
        @AnyThread
        void dismiss();
    }
}
