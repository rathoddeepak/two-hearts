package com.ydc.downloader.services;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.Service;
import android.content.ContentValues;
import android.content.Intent;
import android.content.Context;
import android.os.AsyncTask;
import android.os.Binder;
import android.os.Build;
import android.os.IBinder;
import android.os.PowerManager;
import android.util.Log;

import androidx.annotation.Nullable;
import androidx.core.app.NotificationCompat;

import com.ydc.downloader.R;
import com.ydc.downloader.db.DConstants;
import com.ydc.downloader.db.DL_DBHelper;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Objects;

public class DownloadService extends Service {
    private HashMap<String, DownloadTask> downloadTasks = new HashMap<>();
    private final Binder binder = new DownloadServiceBinder();
    private static final int LIMIT = 3;
    //public static final String SERVICE = "download_ui_service";

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return binder;
    }

    @Override
    public void onCreate() {
        super.onCreate();
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        if(downloadTasks.keySet().size() >= 3)return START_REDELIVER_INTENT;
        if(intent.getIntExtra("is_initial", 0) == 1) {
            reInitiate();
        }
        DownloadTask downloadTask = new DownloadTask();
        downloadTask.execute(intent.getStringExtra("url"), intent.getStringExtra("dest"), intent.getBooleanExtra("chunked", false) ? "y" : "n");
        downloadTask.setDownloadId(intent.getStringExtra("download_id"));
        downloadTasks.put(intent.getStringExtra("download_id"), downloadTask);
        Log.d(DConstants.TAG, "Download ID " + intent.getStringExtra("download_id") );
        showNotification();
        return START_REDELIVER_INTENT;
    }

    public void showNotification(){
        if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationManager notificationManager = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
            notificationManager.createNotificationChannel(new NotificationChannel("download_files", "Download Files", NotificationManager.IMPORTANCE_DEFAULT));
        }
        if(downloadTasks.keySet().size() > 0){
            Notification notification = new NotificationCompat
                    .Builder(getApplicationContext(), "download_files")
                    .setContentTitle("Download Files")
                    .setSmallIcon(R.drawable.download)
                    .setChannelId("download_files")
                    .setContentText("Downloading "+downloadTasks.keySet().size()+" Files")
                    //.addAction(new NotificationCompat.Action(R.drawable.exo_notification_play, "Play", playIntent))
                    //.addAction(new NotificationCompat.Action(R.drawable.exo_notification_pause, "Pause", pauseIntent))
                    //.addAction(new NotificationCompat.Action(R.drawable.exo_notification_stop, "Stop", stopIntent))
                    .build();
            startForeground(DConstants.FG_ID, notification);
        }else {
            stopForeground(true);
        }
    }
    public void reInitiate(){
        if(downloadTasks.keySet().size() < 3){
            DL_DBHelper dbHelper = new DL_DBHelper(getApplicationContext());
            ArrayList<ContentValues> values = dbHelper.retrieveData(DConstants.IDLE, null, null);
            if(values.size() == 0)return;
            ContentValues item = values.get(0);
            Intent intent = new Intent(getApplicationContext(), DownloadService.class);
            intent.putExtra("chunked", false);
            intent.putExtra("download_id", item.getAsString("id"));
            intent.putExtra("dest", item.getAsString("dest"));
            intent.putExtra("name", item.getAsString("name"));
            intent.putExtra("url", item.getAsString("url"));
            startService(intent);
        }
    }
    public void cancelTask(String id){
        DownloadTask task = downloadTasks.get(id);
        if(task != null){
            task.cancel(true);
            downloadTasks.remove(id);
        }

        if(downloadTasks.keySet().size() == 0){
            stopForeground(true);
        }
    }

    public void pauseTask(String id){
        DownloadTask downloadTask = downloadTasks.get(id);
        if(downloadTask != null){
            DL_DBHelper dbHelper = new DL_DBHelper(getApplicationContext());
            dbHelper.updateItem(id, DConstants.PAUSED);
            downloadTasks.remove(id);
            downloadTask.setPaused(true);
            downloadTask.cancel(true);
        }
        if(downloadTasks.keySet().size() == 0){
            stopForeground(true);
        }
    }

    @Override
    public void onDestroy() {
        Log.d(DConstants.TAG, "OnDestroy");
        super.onDestroy();
    }

    class DownloadTask extends AsyncTask<String, String, String> {

        String downloadId, dest;
        boolean paused = false;

        public void setDownloadId(String downloadId) {
            this.downloadId = downloadId;
        }

        public void setPaused(boolean paused) {
            this.paused = paused;
        }
        @Override
        protected void onPreExecute() {
            super.onPreExecute();
            PowerManager pm = (PowerManager) getSystemService(Context.POWER_SERVICE);
            PowerManager.WakeLock mWakeLock = pm.newWakeLock(PowerManager.PARTIAL_WAKE_LOCK,
                    getClass().getName());
            mWakeLock.acquire(10*60*1000L);
        }
        @Override
        protected String doInBackground(String... strings) {

            DL_DBHelper dbHelper = new DL_DBHelper(getApplicationContext());
            dbHelper.updateItem(downloadId, DConstants.DOWNLOADING);

            Log.d(DConstants.TAG, "Download Started " + strings[0]);
            InputStream input = null;
            OutputStream output = null;
            HttpURLConnection connection = null;
            try {
                URL url = new URL(strings[0]);
                connection = (HttpURLConnection) url.openConnection();
                File file = new File(strings[1]);
                if(!file.exists()){
                    file.createNewFile();
                    output = new FileOutputStream(strings[1]);
                }else if(strings[2].equals("y")){
                    Log.d(DConstants.TAG, "Downloading Partial File " + file.length());
                    connection.setRequestProperty("Range", "bytes=" + (int) file.length() + "-");
                    output = new FileOutputStream(strings[1], true);
                }
                connection.connect();
                if (connection.getResponseCode() != HttpURLConnection.HTTP_OK && connection.getResponseCode() != HttpURLConnection.HTTP_PARTIAL) {
                    return "error";
                }
                int fileLength = connection.getContentLength();
                if(fileLength != -1 && fileLength > 0){
                    dbHelper.updateEBytes(downloadId,fileLength);
                }
                Log.d(DConstants.TAG, "Downloading At" + strings[1]);
                input = connection.getInputStream();

                byte[] data = new byte[4096];
                int count;
                while ((count = input.read(data)) != -1) {
                    // allow canceling with back button
                    if (isCancelled()) {
                        input.close();
                        return "cancel";
                    }
                    output.write(data, 0, count);
                }
            } catch (Exception e) {
                Log.d(DConstants.TAG, "Downloading Error" + e.toString());
                return "error";
            } finally {
                try {
                    if (output != null)
                        output.close();
                    if (input != null)
                        input.close();
                } catch (IOException ignored) {
                }
                if (connection != null)
                    connection.disconnect();
            }
            return null;
        }

        @Override
        protected void onPostExecute(String result) {
            super.onPostExecute(result);
            Log.d(DConstants.TAG, result == null ? "Completed" : result);
            downloadTasks.remove(downloadId);
            if (paused){
                DL_DBHelper dbHelper = new DL_DBHelper(getApplicationContext());
                dbHelper.updateItem(downloadId, DConstants.PAUSED);
            }else if(result == null){
                showNotification();
                DL_DBHelper dbHelper = new DL_DBHelper(getApplicationContext());
                dbHelper.updateItem(downloadId, DConstants.COMPLETED);
            }else if(result.equals("error")){
                DL_DBHelper dbHelper = new DL_DBHelper(getApplicationContext());
                dbHelper.updateItem(downloadId, DConstants.ERROR);
                showNotification();
            }else if(result.equals("cancel")){
                DL_DBHelper dbHelper = new DL_DBHelper(getApplicationContext());
                dbHelper.deleteItem(downloadId);
                showNotification();
            }
            reInitiate();
        }
    }
    public class DownloadServiceBinder extends Binder {
        public DownloadService getService(){
            return DownloadService.this;
        }
    }
}
