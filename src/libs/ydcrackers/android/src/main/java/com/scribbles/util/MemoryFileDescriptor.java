package com.scribbles.util;

import android.app.ActivityManager;
import android.content.Context;
import android.os.ParcelFileDescriptor;
import android.util.Log;

import androidx.annotation.NonNull;

import java.io.Closeable;
import java.io.FileDescriptor;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.channels.FileChannel;
import java.text.NumberFormat;
import java.util.Locale;
import java.util.concurrent.atomic.AtomicLong;

public final class MemoryFileDescriptor implements Closeable {

    private static final String TAG = "ZEBRA";

    private static Boolean supported;

    private final ParcelFileDescriptor parcelFileDescriptor;
    private final AtomicLong           sizeEstimate;

    /**
     * Does this device support memory file descriptor.
     */
    public synchronized static boolean supported() {
        if (supported == null) {
            try {
                int fileDescriptor = FileUtils.createMemoryFileDescriptor("CHECK");

                if (fileDescriptor < 0) {
                    supported = false;
                    Log.w(TAG, "MemoryFileDescriptor is not available.");
                } else {
                    supported = true;
                    ParcelFileDescriptor.adoptFd(fileDescriptor).close();
                }
            } catch (IOException e) {
                Log.w(TAG, e);
            }
        }
        return supported;
    }

    /**
     * memfd files do not show on the available RAM, so we must track our allocations in addition.
     */
    private static long sizeOfAllMemoryFileDescriptors;

    private MemoryFileDescriptor(@NonNull ParcelFileDescriptor parcelFileDescriptor, long sizeEstimate) {
        this.parcelFileDescriptor = parcelFileDescriptor;
        this.sizeEstimate         = new AtomicLong(sizeEstimate);
    }


    @Override
    public void close() throws IOException {
        try {
            clearAndRemoveAllocation();
        } catch (Exception e) {
            Log.w(TAG, "Failed to clear data in MemoryFileDescriptor", e);
        } finally {
            parcelFileDescriptor.close();
        }
    }

    private void clearAndRemoveAllocation() throws IOException {
        clear();

        long oldEstimate = sizeEstimate.getAndSet(0);

        synchronized (MemoryFileDescriptor.class) {
            sizeOfAllMemoryFileDescriptors -= oldEstimate;
        }
    }

    /** Rewinds and clears all bytes. */
    private void clear() throws IOException {
        long size;
        try (FileInputStream fileInputStream = new FileInputStream(getFileDescriptor())) {
            FileChannel channel = fileInputStream.getChannel();
            size = channel.size();

            if (size == 0) return;

            channel.position(0);
        }
        byte[] zeros = new byte[16 * 1024];

        try (FileOutputStream output = new FileOutputStream(getFileDescriptor())) {
            while (size > 0) {
                int limit = (int) Math.min(size, zeros.length);

                output.write(zeros, 0, limit);

                size -= limit;
            }
        }
    }

    public FileDescriptor getFileDescriptor() {
        return parcelFileDescriptor.getFileDescriptor();
    }

    public void seek(long position) throws IOException {
        try (FileInputStream fileInputStream = new FileInputStream(getFileDescriptor())) {
            fileInputStream.getChannel().position(position);
        }
    }

    public long size() throws IOException {
        try (FileInputStream fileInputStream = new FileInputStream(getFileDescriptor())) {
            return fileInputStream.getChannel().size();
        }
    }

    public static class MemoryFileException extends IOException {
    }

    private static final class MemoryLimitException extends MemoryFileException {
    }

    private static final class MemoryFileCreationException extends MemoryFileException {
    }
}
