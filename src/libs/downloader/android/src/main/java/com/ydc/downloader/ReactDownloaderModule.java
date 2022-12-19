package com.ydc.downloader;

import android.os.Build;
import android.os.Handler;
import androidx.annotation.Nullable;
import android.content.BroadcastReceiver;
import android.content.ComponentName;
import android.content.ContentValues;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.ServiceConnection;
import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.localbroadcastmanager.content.LocalBroadcastManager;

import android.os.Handler;
import android.os.IBinder;
import android.util.Log;

import com.ydc.downloader.db.DConstants;
import com.ydc.downloader.db.DL_DBHelper;
import com.ydc.downloader.services.DownloadService;

import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.LifecycleEventListener;
//import com.facebook.react.bridge.queue.MessageQueueThreadImpl;
//import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReadableMap;
//import com.facebook.react.bridge.ReadableArray;
//import com.facebook.react.bridge.UiThreadUtil;

//import java.util.HashMap;
//import java.lang.Runnable;
import java.io.File;
import java.lang.StringBuilder;
import java.util.ArrayList;
import java.io.FileInputStream;
import java.io.InputStreamReader;
import java.io.BufferedReader;
public class ReactDownloaderModule extends ReactContextBaseJavaModule implements LifecycleEventListener {
	public static ReactApplicationContext reactContext;	
    
    private DL_DBHelper db;
    private DownloadService downloadService;
    private boolean  isBonded = false;
    private ServiceConnection serviceConnection = new ServiceConnection() {
        @Override
        public void onServiceConnected(ComponentName componentName, IBinder iBinder) {
            DownloadService.DownloadServiceBinder serviceBinder = (DownloadService.DownloadServiceBinder) iBinder;
            downloadService = serviceBinder.getService();
            isBonded = true;
            Log.d(DConstants.TAG, "onServiceConnected");
        }
        @Override
        public void onServiceDisconnected(ComponentName componentName) {
            isBonded = false;
            Log.d(DConstants.TAG, "onServiceConnected");
        }
    };

    public ReactDownloaderModule(ReactApplicationContext context) {
        super(context);  
        reactContext = context;
        db = new DL_DBHelper(context);
        reactContext.addLifecycleEventListener(this);        
        reactContext.bindService(new Intent(reactContext, DownloadService.class), serviceConnection, Context.BIND_AUTO_CREATE);
    }

    @Override
    public String getName() {
        return "YdcDownloader";
    }

    @ReactMethod 
    public void initialCheck() {
        ArrayList<ContentValues> allDownloads = db.retrieveData(DConstants.ALL, null, DConstants.DESC);
        for(int i = 0; i < allDownloads.size(); i++){
            ContentValues item = allDownloads.get(i);
            if(item.getAsInteger("status") == DConstants.DOWNLOADING){
                db.updateItem(item.getAsString("id"), DConstants.PAUSED);
            }
        }

        Intent intent = new Intent(reactContext, DownloadService.class);
        intent.putExtra("is_initial", 1);
        reactContext.startService(intent);
    }

    @ReactMethod
    public void addToDownloads(String fileName, String url, String ext, String id, @Nullable ReadableMap extra){
        ContentValues item = !id.equals("-1") ? db.getItemById(id) : null;
        id = item == null ? "-1" : id;
        String dest = !id.equals("-1") ? item.getAsString("dest") : DConstants.createDest(fileName, ext);
        Intent intent = new Intent(reactContext, DownloadService.class);
        intent.putExtra("chunked", !id.equals("-1"));
        String about = "", cover = "";
        int type = 0, data_id = 0;        
        if(id.equals("-1")){
            //about = extra.getString("about");
            //cover = extra.getString("cover");
            type = extra.getInt("type");
            data_id = extra.getInt("data_id");
        }
        id = !id.equals("-1") ? id : db.addToDownloads(fileName, url, dest, about, cover, type, data_id) + "";
        intent.putExtra("download_id", id+"");
        intent.putExtra("dest", dest);
        intent.putExtra("name", fileName);
        intent.putExtra("url", url);        
        reactContext.startService(intent);
        //Log.d(DConstants.TAG, "Download ID got " + id);        
        //adapter.reload(db.retrieveData(DConstants.ALL, DConstants.DESC));
    }
    
    @ReactMethod
    public void retriveDownloads(int status, int type, Callback callback){
        ArrayList<ContentValues> allDownloads = db.retrieveData(status, type, DConstants.DESC);
        WritableArray reactArray = Arguments.createArray();
        for(int i = 0; i < allDownloads.size(); i++){
            ContentValues nativeItem = allDownloads.get(i);
            WritableMap item = Arguments.createMap();            
            
            item.putInt("id", nativeItem.getAsInteger("id"));
            item.putInt("status", nativeItem.getAsInteger("status"));        
            item.putInt("type", nativeItem.getAsInteger("type"));
            item.putInt("data_id", nativeItem.getAsInteger("data_id"));

            item.putString("name", nativeItem.getAsString("name"));
            item.putString("url", nativeItem.getAsString("url"));
            item.putString("dest", nativeItem.getAsString("dest"));            
            item.putString("created", nativeItem.getAsString("created"));
            item.putString("about", nativeItem.getAsString("about"));
            item.putString("cover", nativeItem.getAsString("cover"));
            item.putString("e_bytes", nativeItem.getAsString("e_bytes"));
            if(nativeItem.getAsInteger("status") == DConstants.DOWNLOADING || nativeItem.getAsInteger("status") == DConstants.PAUSED)
                item.putInt("w_bytes", fileLength(nativeItem.getAsString("dest")));
            else
                item.putInt("w_bytes", 0);            
            reactArray.pushMap(item);
        }
        callback.invoke(reactArray);
        //Log.d(DConstants.TAG, "Download ID got " + id);        
        //adapter.reload(db.retrieveData(DConstants.ALL, DConstants.DESC));
    }
    
    @ReactMethod
    public void readfile(String filename, Promise promise) {
        try {
            FileInputStream fis =  new FileInputStream(new File(filename));
            InputStreamReader isr = new InputStreamReader(fis, "UTF-8");
            BufferedReader bufferedReader = new BufferedReader(isr);
            StringBuilder sb = new StringBuilder();
            String line;
            while ((line = bufferedReader.readLine()) != null)sb.append(line).append("\n");   
            fis.close();
            isr.close();      
            promise.resolve(sb.toString());
        } catch (Exception e) {
            promise.reject(e);
        }
    }

    @ReactMethod
    public void pauseTask(String id){
        downloadService.pauseTask(id);    
    }

    public int fileLength(String path){
        File file = new File(path);
        if(file.exists()){            
            return (int) file.length();
        }
        return 0;        
    }

    @ReactMethod
    public void deleteTask(String id, String dest){
        db.deleteItem(id);            
        if(dest != null){
            File file = new File(dest);
            if(file.exists()){
                file.delete();
            }
        }            
        downloadService.cancelTask(id);
    }

    @ReactMethod
    public void controlButton(String id, int status, String ext, Promise promise){
        ContentValues item = db.getItemById(id);
        if(item == null){
            promise.reject("Item Not Found");
            return;
        }
        String fileName = item.getAsString("name");
        String url = item.getAsString("url");            
        if(status == DConstants.IDLE){            
            addToDownloads(fileName, url, ext, id, null);            
            promise.resolve(DConstants.DOWNLOADING);
        }else if(status == DConstants.DOWNLOADING){            
            downloadService.pauseTask(id);           
            promise.resolve(DConstants.PAUSED);
        }else if(status == DConstants.PAUSED){            
            addToDownloads(fileName, url, ext, id, null);
            promise.resolve(DConstants.DOWNLOADING);
        }        
    }
    
    @Override
    public void onHostDestroy() {
        if(downloadService != null){
            downloadService.stopForeground(true);
            downloadService.stopSelf();
        }
    }

    public static String getStatus(int state){
        switch (state){
            case DConstants.DOWNLOADING:return "Downloading...";
            case DConstants.ERROR:return "Error while downloading!";
            case DConstants.IDLE:return "Waiting";
            case DConstants.PAUSED:return "Paused";
            case DConstants.COMPLETED:return "Completed!";
        }
        return "Unknown error!";
    }
    public static String getButton(int state){
        switch (state){
            case DConstants.DOWNLOADING:return "PAUSE";
            case DConstants.IDLE:return "FORCE DOWNLOAD";
            case DConstants.PAUSED:return "RESUME";
        }
        return "Unknown error!";
    }

    @Override public void onHostResume() {}
    @Override public void onHostPause() {}
}