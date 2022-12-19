package com.ydcrackerpackages.uploader;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import android.util.Log;
import android.app.NotificationManager;
import android.content.Context;
import android.content.BroadcastReceiver;
import android.os.Parcelable;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.ContentValues;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import com.ydcrackerpackages.Utilities.ReactNativeFileManager;
import com.ydcrackerpackages.uploader.MediaTaskHandler;
import net.gotev.uploadservice.UploadService;

import net.gotev.uploadservice.BroadcastData;
import net.gotev.uploadservice.UploadInfo;

import com.ydcrackerpackages.uploader.db.UConstants;
import com.ydcrackerpackages.uploader.db.UL_DBHelper;
import com.ydcrackerpackages.BuildConfig;

import java.util.ArrayList;
import java.io.File;
public class MediaUploadManager extends ReactContextBaseJavaModule implements LifecycleEventListener {
    public static ReactApplicationContext reactContext;
    //Declarations 
    public String GLOBAL_EVENT = "MediaGlobal";
    public static MediaTaskHandler mediaTaskHandler = new MediaTaskHandler();
    private UL_DBHelper db;
    private final BroadcastReceiver uploadreceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            BroadcastData data = intent.getParcelableExtra("broadcastData");
            UploadInfo uploadInfo = data.getUploadInfo();
            WritableMap map = Arguments.createMap();
            boolean hasCB = uploadInfo.getUploadId().contains("cb");
            String id = uploadInfo.getUploadId();
            Log.d("ZEBRA", "GOT -> result -> " + hasCB);
            Log.d("ZEBRA", "GOT -> result -> " + id);
            if(hasCB)map.putString("task_id", id);
            switch (data.getStatus()) {
                case IN_PROGRESS:
                    if(hasCB){                        
                        map.putString("type", "progress");
                        map.putInt("progress", uploadInfo.getProgressPercent());                        
                        sendEvent(GLOBAL_EVENT, map);
                    }else{
                        db.updateProgress(id, uploadInfo.getProgressPercent());
                    }                    
                break;
                case ERROR:
                    if(hasCB){
                        String reason = data.getException() == null ? data.getServerResponse().getBodyAsString() : data.getException().toString();
                        map.putString("type", "error");
                        map.putInt("response_code", data.getServerResponse().getHttpCode());
                        map.putString("response_message", data.getServerResponse().getBodyAsString());              
                        sendEvent(GLOBAL_EVENT, map);
                    }else{
                        db.updateItem(id, UConstants.ERROR);
                    }
                break;
                case COMPLETED:
                    if(hasCB){
                        map.putString("type", "completed");
                        map.putInt("response_code", data.getServerResponse().getHttpCode());
                        map.putString("response_message", data.getServerResponse().getBodyAsString());              
                        sendEvent(GLOBAL_EVENT, map);
                    }else{
                        Log.d("ReactUploadManager", data.getServerResponse().getBodyAsString());
                        db.updateItem(id, UConstants.COMPLETED);
                    }                    
                break;
                case CANCELLED:
                    if(hasCB){
                        map.putString("type", "cancled");                        
                        sendEvent(GLOBAL_EVENT, map);
                    }else{
                        db.updateItem(id, UConstants.CANCLED);
                    }                                  
                break;
            }
        }
    };
    
    public MediaUploadManager(ReactApplicationContext context) {
        super(context);  
        reactContext = context;
        db = new UL_DBHelper(context);
        mediaTaskHandler.attachHelper(db);
        registerBroadcastReceiver(); 
        reactContext.addLifecycleEventListener(this);
    }

    public void registerBroadcastReceiver(){                
        IntentFilter filter = new IntentFilter();
        filter.addAction("tw_file_upload");
        reactContext.registerReceiver(uploadreceiver, filter);
    }

    @Override
    public void onHostResume() {
        IntentFilter filter = new IntentFilter();
        filter.addAction("tw_file_upload");
        reactContext.registerReceiver(uploadreceiver, filter);
    }

    @Override
    public void onHostPause() {
        if(uploadreceiver != null)reactContext.unregisterReceiver(uploadreceiver);                        
    }

    @Override
    public void onHostDestroy() {
        try {
            reactContext.unregisterReceiver(uploadreceiver);
        }catch(Exception e){
            e.printStackTrace();
        }        
    }    


    @Override
    public String getName() {
        return "UploadManager";
    }

    @ReactMethod
    public void startProcess() {
        mediaTaskHandler.startProcess(reactContext);
    }

   @ReactMethod
    public void stopProcess(String id) {
        mediaTaskHandler.deleteTask(id, reactContext);        
    }

    @ReactMethod
    public void clearAll(int type) {
        ArrayList<ContentValues> allDownloads = db.retrieveData(-1, UConstants.DESC);
        WritableArray reactArray = Arguments.createArray();
        for(int i = 0; i < allDownloads.size(); i++){
            ContentValues nativeItem = allDownloads.get(i);            
            int status = nativeItem.getAsInteger("status");
            int tp = nativeItem.getAsInteger("type");;
            if(type == tp || type == -1){
                if(status == UConstants.IDEAL){
                    db.deleteItem(nativeItem.getAsString("id"));            
                }
            }
        }        
    }

    @ReactMethod
    public void addProcess(ReadableMap map) {
        addProcessNative(map);
    }

    @ReactMethod
    public void addProcessCallback(ReadableMap map, Callback callback) {        
        callback.invoke(addProcessNative(map));
    }

    private int addProcessNative(ReadableMap map){
        MediaItem item = new MediaItem();
        item.setSource(                    
            map.getString("source"),
            map.getInt("width"),
            map.getInt("height")
        );
        if(map.hasKey("type"))item.setForType(map.getInt("type"));
        item.setServer(map.getString("server_params"), map.getString("server_url"));
        return mediaTaskHandler.addProcess2(item);
    }

    @ReactMethod
    public void addProcessBatch(ReadableArray arrayMap, boolean startAfter) {
        for (int i = 0; i < arrayMap.size(); i++ ) {
            MediaItem item = new MediaItem();
            ReadableMap map = arrayMap.getMap(i);
            item.setSource(                    
                map.getString("source"),
                map.getInt("width"),
                map.getInt("height")
            );
            item.setServer(map.getString("server_params"), map.getString("server_url"));
            mediaTaskHandler.addProcess(item);
        }     
        if(startAfter)mediaTaskHandler.startProcess(reactContext);        
    }

    private void sendEvent(String eventName, @Nullable WritableMap params) {
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, params);
    }

    @ReactMethod 
    public void initialCheck() {
        File outputDir = new File(reactContext.getExternalFilesDir(null), "outputs");                
        outputDir.mkdir();        
        if (outputDir.isDirectory()) {
           for (File ct : outputDir.listFiles()){
                ct.delete();
           }
        }            
    }

    @ReactMethod
    public void retriveUploads(int type, Callback callback){
        ArrayList<ContentValues> allDownloads = db.retrieveData(-1, UConstants.ASC);
        WritableArray reactArray = Arguments.createArray();
        for(int i = 0; i < allDownloads.size(); i++){
            ContentValues nativeItem = allDownloads.get(i);            
            int status = nativeItem.getAsInteger("status");
            int tp = nativeItem.getAsInteger("type");;
            if(type == tp || type == -1){
                if(status == UConstants.COMPLETED){
                    db.deleteItem(nativeItem.getAsString("id"));            
                }else{
                    WritableMap item = Arguments.createMap();
                    item.putInt("id", nativeItem.getAsInteger("id"));
                    item.putInt("type", tp);        
                    item.putString("temp", nativeItem.getAsString("temp"));
                    item.putString("main", nativeItem.getAsString("main"));
                    item.putInt("status", status);
                    item.putInt("total", nativeItem.getAsInteger("total"));
                    item.putInt("uploaded", nativeItem.getAsInteger("uploaded"));            
                    item.putInt("compress", nativeItem.getAsInteger("compress"));
                    item.putInt("width", nativeItem.getAsInteger("width"));
                    item.putString("task_id", nativeItem.getAsString("task_id"));
                    item.putString("time", nativeItem.getAsString("time"));            
                    item.putString("server_params", nativeItem.getAsString("server_params"));
                    item.putString("server_url", nativeItem.getAsString("server_url"));
                    item.putInt("height", nativeItem.getAsInteger("height"));
                    reactArray.pushMap(item);
                }  
            }          
        }
        callback.invoke(reactArray);        
    }
}

