package com.ydcrackerpackages.uploader;

import android.content.Context;
import android.media.MediaPlayer;
import android.net.Uri;
import android.util.Log;
import android.graphics.Bitmap;
import android.media.MediaMetadataRetriever;

import androidx.annotation.NonNull;
import androidx.lifecycle.LifecycleOwner;
import androidx.lifecycle.Lifecycle;

import com.otaliastudios.transcoder.Transcoder;
import com.otaliastudios.transcoder.TranscoderListener;
import com.otaliastudios.transcoder.engine.TrackStatus;
import com.otaliastudios.transcoder.sink.DataSink;
import com.otaliastudios.transcoder.sink.DefaultDataSink;
import com.otaliastudios.transcoder.source.DataSource;
import com.otaliastudios.transcoder.source.UriDataSource;
import com.otaliastudios.transcoder.strategy.DefaultVideoStrategy;
import com.otaliastudios.transcoder.validator.DefaultValidator;
import com.otaliastudios.gif.strategy.DefaultStrategy;
import com.otaliastudios.gif.GIFCompressor;
import com.otaliastudios.gif.GIFListener;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.lang.Math;

import io.reactivex.functions.Consumer;
import io.reactivex.schedulers.Schedulers;
import io.reactivex.android.schedulers.AndroidSchedulers;
import com.ydcrackerpackages.compressor.Compressor;

import net.gotev.uploadservice.MultipartUploadRequest;
import net.gotev.uploadservice.ServerResponse;
import net.gotev.uploadservice.UploadInfo;
import net.gotev.uploadservice.UploadStatusDelegate;
import net.gotev.uploadservice.UploadNotificationAction;
import net.gotev.uploadservice.UploadNotificationConfig;
import com.ydcrackerpackages.uploader.events.NotificationActions;
import net.gotev.uploadservice.UploadService;
import com.ydcrackerpackages.uploader.db.UConstants;
import com.ydcrackerpackages.uploader.db.UL_DBHelper;
import com.ydcrackerpackages.uploader.MediaItem;
import com.ydcrackerpackages.R;

public class MediaTaskHandler {

    private int SLOTS_SIZE = 2;    
    private final ArrayList<MediaItem> workers = new ArrayList<>();
    public UL_DBHelper dbHelper;
    public void attachHelper(UL_DBHelper dbHelper){
        this.dbHelper = dbHelper;
    }

    public void addProcess(MediaItem item){        
        if(dbHelper != null)dbHelper.addToUploads(item.for_type, item.url, item.width, item.height, item.server_url, item.server_params);       
    }

    public int addProcess2(MediaItem item){        
        if(dbHelper != null)     
            return dbHelper.addToUploads(item.for_type, item.url, item.width, item.height, item.server_url, item.server_params);
        else        
            return -1;
    }

    public void startProcess(Context context){
        ArrayList<MediaItem> itemPendingToPerform = dbHelper.retrieveData2(UConstants.IDEAL, null);
        if(itemPendingToPerform.size() > 0){            
            addToFreeSlots(itemPendingToPerform, context);
        }
    }
    //Workers Part
    private void addToFreeSlots(ArrayList<MediaItem> items, Context context){
        int slots = SLOTS_SIZE - workers.size();
        Log.d(UConstants.TAG,"Slots Avialable "+slots);
        if(slots > 0){

            int itemsToAdd = items.size();
            int i = 0;

            if(itemsToAdd > slots){
                itemsToAdd = slots;
            }
            Log.d(UConstants.TAG,"Items to add -> "+itemsToAdd);
            for( ; i < itemsToAdd; i++){
                workers.add(items.get(i));                
                Log.d(UConstants.TAG,"Adding to Slot "+items.get(i).status);
            }
            if(workers.size() > 0){
                invalidateWorker(context);
            }
        }
    }
    private void invalidateWorker(Context context){
        for (int i = 0; i < workers.size(); i++) {
            MediaItem itm = workers.get(i);
            if(itm.type == MediaItem.AUDIO_FILE){
                Log.d(UConstants.TAG,"Starting Audio Upload");
                startUploadAudio(itm);
            }else if(itm.type == MediaItem.VIDEO_FILE){
                Log.d(UConstants.TAG,"Starting VIDEO Upload "+itm.status);
                startUploadVideo(itm, context);
            }else if(itm.type == MediaItem.IMAGE_FILE){
                Log.d(UConstants.TAG,"Starting Image Upload "+itm.status);
                startUploadImage(itm, context);
            }else if(itm.type == MediaItem.GIF_FILE){
                Log.d(UConstants.TAG,"Starting Gif Upload");
                startUploadGif(itm, context);
            }
        }
        if(workers.size() < SLOTS_SIZE){            
            startProcess(context);
        }
    }
    private void startUploadAudio(MediaItem item){
        //p("Task Completed -> "+item.url);
        //removeAndAddIfAny(item.task_id);
    }
    private void startUploadVideo(MediaItem item, Context context){
        Log.d(UConstants.TAG,"COMPRESSING VIDEO "+ item.status);
        if(item.status != UConstants.IDEAL)
            return;
        else
            item.status = UConstants.COMPRESSING;
        dbHelper.updateItem(item.task_id, UConstants.COMPRESSING);        
        Log.d(UConstants.TAG,"COMPRESSING VIDEO 2"+ item.status);
        float fraction, qualityCheck = (item.height+item.width)*0.3f;
        if(qualityCheck >= 310f && qualityCheck <= 420f)fraction = 0.7f;
        else if(qualityCheck > 420f)fraction = 0.5f;
        else fraction = 1f;
        if(fraction != 1f) {
            try {
                File outputDir = new File(context.getExternalFilesDir(null), "outputs");               
                outputDir.mkdir();
                File mTranscodeOutputFile = File.createTempFile("file_"+item.task_id, ".mp4", outputDir);
                DataSink sink = new DefaultDataSink(mTranscodeOutputFile.getAbsolutePath());
                DefaultVideoStrategy strategy = DefaultVideoStrategy.fraction(fraction).build();
                if(dbHelper != null)dbHelper.updateColumn(item.task_id,UL_DBHelper.TEMP,mTranscodeOutputFile.getAbsolutePath());
                Transcoder.into(sink)
                        .addDataSource(item.url)
                        .setVideoTrackStrategy(strategy)
                        .setListener(new TranscoderListener() {
                            public void onTranscodeCreated(String thread_id) {
                                item.thread_id = thread_id;                        
                                Log.d(UConstants.TAG, "onTranscodeCreated" + thread_id);
                            }
                            public void onTranscodeProgress(double progress) {
                                int simplified = (int) Math.round(progress * 10000);
                                if(dbHelper != null)dbHelper.updateCompress(item.task_id, simplified);
                                Log.d(UConstants.TAG, "onTranscodeProgress "+simplified);
                            }
                            public void onTranscodeCompleted(int successCode) {
                                item.url = mTranscodeOutputFile.getAbsolutePath();
                                if(checkWorkerForId(item.task_id)){
                                    removeAndAddIfAny(item.task_id, context);
                                    talkToGotev(context, item);
                                    if(dbHelper != null)dbHelper.updateItem(item.task_id, UConstants.COMPRESSED);
                                }
                                Log.d(UConstants.TAG, "onTranscodeCompleted");
                            }
                            public void onTranscodeCanceled() {                                
                                if(dbHelper != null)dbHelper.updateItem(item.task_id, UConstants.COMPRESS_ERROR);
                                if(mTranscodeOutputFile.exists())mTranscodeOutputFile.delete();
                                removeAndAddIfAny(item.task_id, context);                                
                                Log.d(UConstants.TAG, "Cancled");                           
                            }
                            public void onTranscodeFailed(@NonNull Throwable exception) {                                                                
                                if(dbHelper != null)dbHelper.updateItem(item.task_id, UConstants.COMPRESS_ERROR);
                                if(mTranscodeOutputFile.exists())mTranscodeOutputFile.delete();
                                removeAndAddIfAny(item.task_id, context);
                                Log.d(UConstants.TAG, "Failed to Compress "+exception.toString());                           
                            }
                        })
                        .setValidator(new DefaultValidator() {
                            @Override
                            public boolean validate(@NonNull TrackStatus videoStatus, @NonNull TrackStatus audioStatus) {
                                return super.validate(videoStatus, audioStatus);
                            }
                        }).transcode();
            } catch (Exception e) {
                if(dbHelper != null)dbHelper.updateItem(item.task_id, UConstants.COMPRESS_ERROR);
                removeAndAddIfAny(item.task_id, context);
                Log.d(UConstants.TAG, e.toString());    
            }
        }else{
            if(dbHelper != null)dbHelper.updateItem(item.task_id, UConstants.COMPRESSED);
            removeAndAddIfAny(item.task_id, context);
            talkToGotev(context, item);
            Log.d(UConstants.TAG, "No need to compress");    
        }
    }
    public void startUploadImage(MediaItem item, Context context){
        if(item.status != UConstants.IDEAL)
            return;
        else
            item.status = UConstants.COMPRESSING;
        Log.d(UConstants.TAG,"COMPRESSING Image -> "+ item.task_id);
        if(dbHelper != null)dbHelper.updateItem(item.task_id, UConstants.COMPRESSING);
        try {            
            File outputDir = new File(context.getExternalFilesDir(null), "outputs");
            outputDir.mkdir();
            String ext = item.url.substring(item.url.lastIndexOf("."));
            File mTranscodeOutputFile = File.createTempFile("file_"+item.task_id, ext, outputDir);
            File actualImage = new File("file://"+item.url);
            long fileSizeInBytes = actualImage.length();     
            long fileSizeInKB = fileSizeInBytes / 1024;
            if(fileSizeInKB > 250){
                if(dbHelper != null)dbHelper.updateColumn(item.task_id, UL_DBHelper.TEMP, mTranscodeOutputFile.getAbsolutePath());
                new Compressor(context, mTranscodeOutputFile.getAbsolutePath())
                .compressToFileAsFlowable(actualImage)            
                .subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe(new Consumer<File>() {
                    @Override
                    public void accept(File file) {
                        if(file.length() < fileSizeInBytes){
                            item.url = file.getAbsolutePath();
                        }           
                        if(checkWorkerForId(item.task_id)){
                            removeAndAddIfAny(item.task_id, context);
                            talkToGotev(context, item);
                            if(dbHelper != null)dbHelper.updateItem(item.task_id, UConstants.COMPRESSED); 
                        }
                    }
                }, new Consumer<Throwable>() {
                    @Override
                    public void accept(Throwable throwable) {
                        if(dbHelper != null)dbHelper.updateItem(item.task_id, UConstants.COMPRESS_ERROR);
                        removeAndAddIfAny(item.task_id, context);
                    }
                });
            }else{
                if(checkWorkerForId(item.task_id)){
                    removeAndAddIfAny(item.task_id, context);
                    talkToGotev(context, item);
                    if(dbHelper != null)dbHelper.updateItem(item.task_id, UConstants.COMPRESSED);                                  
                }
            }
        }catch(IOException exception){
            if(dbHelper != null)dbHelper.updateItem(item.task_id, UConstants.COMPRESS_ERROR);                                
            removeAndAddIfAny(item.task_id, context);    
            Log.d(UConstants.TAG, exception.toString());    
        }
    }
    private void startUploadGif(MediaItem item, Context context){
        if(item.status != UConstants.IDEAL)
            return;
        else
            item.status = UConstants.COMPRESSING;        
        if(dbHelper != null)dbHelper.updateItem(item.task_id, UConstants.COMPRESSING);
        float fraction,  qualityCheck = (item.height+item.width)*0.3f;
        if(qualityCheck >= 300 && qualityCheck <= 432)fraction = 0.5f;
        else if(qualityCheck >= 432)fraction = 0.3f;
        else fraction = 1f;
        if(fraction != 1f) {
            try {
                File outputDir = new File(context.getExternalFilesDir(null), "outputs");                
                outputDir.mkdir();
                File mTranscodeOutputFile = File.createTempFile("file_"+item.task_id, ".mp4", outputDir);
                com.otaliastudios.gif.sink.DataSink sink = new com.otaliastudios.gif.sink.DefaultDataSink(mTranscodeOutputFile.getAbsolutePath());
                DefaultStrategy strategy = DefaultStrategy.fraction(fraction).build();
                if(dbHelper != null)dbHelper.updateColumn(item.task_id, UL_DBHelper.TEMP, mTranscodeOutputFile.getAbsolutePath());
                GIFCompressor.into(sink)
                        .addDataSource(context, item.url)                        
                        .setStrategy(strategy)
                        .setListener(new GIFListener() {
                            public void onGIFCompressionCreated(String thread_id) {
                                item.thread_id = thread_id;
                            }
                            public void onGIFCompressionProgress(double progress) {
                                int simplified = (int) Math.round(progress * 10000);
                                if(dbHelper != null)dbHelper.updateCompress(item.task_id, simplified);                             
                            }
                            public void onGIFCompressionCompleted() {
                                item.url = mTranscodeOutputFile.getAbsolutePath();                                
                                if(checkWorkerForId(item.task_id)){
                                    removeAndAddIfAny(item.task_id, context);
                                    talkToGotev(context, item);
                                    if(dbHelper != null)dbHelper.updateItem(item.task_id, UConstants.COMPRESSED);
                                }
                            }
                            public void onGIFCompressionCanceled() {                                
                                if(dbHelper != null)dbHelper.updateItem(item.task_id, UConstants.CANCLED); 
                                removeAndAddIfAny(item.task_id, context);
                            }
                            public void onGIFCompressionFailed(@NonNull Throwable exception) {                                
                                if(dbHelper != null)dbHelper.updateItem(item.task_id, UConstants.COMPRESS_ERROR);
                                removeAndAddIfAny(item.task_id, context);
                            }
                        }).compress();
            } catch (Exception e) {                
                if(dbHelper != null)dbHelper.updateItem(item.task_id, UConstants.COMPRESS_ERROR);
                removeAndAddIfAny(item.task_id, context);            
            }
        }else{            
            if(checkWorkerForId(item.task_id)){
                removeAndAddIfAny(item.task_id, context);
                talkToGotev(context, item);
                if(dbHelper != null)dbHelper.updateItem(item.task_id, UConstants.COMPRESSED);                                
            }
        }
    }
    public void removeAndAddIfAny(String task_id, Context context){
        for (int i = 0; i < workers.size(); i++) {
            MediaItem itm = workers.get(i);
            if(itm.task_id == task_id){
                workers.remove(i);
                if(workers.size() < SLOTS_SIZE){                    
                    startProcess(context);
                }
                break;
            }
        }
    }
    public void talkToGotev(Context context, MediaItem item){
        Log.d(UConstants.TAG,"Uploading ->"+item.server_url + " For Type -> " + item.for_type);
        try{
            if(dbHelper != null)dbHelper.updateItem(item.task_id, UConstants.UPLOADING);            
            MultipartUploadRequest request = new MultipartUploadRequest(context, item.for_type == UConstants.OTHER1 ? item.task_id + "cb" : item.task_id  , item.server_url).setMaxRetries(2);
            UploadNotificationConfig uploadNotificationConfig = new UploadNotificationConfig();
            uploadNotificationConfig.getCancelled().autoClear = true;
            uploadNotificationConfig.getError().autoClear = true;
            uploadNotificationConfig.getCompleted().autoClear = true;            
            request.setNotificationConfig(uploadNotificationConfig);
            request.addParameter("params", item.server_params);
            request.addFileToUpload(item.url, "file");            
            request.startUpload();
            Log.d(UConstants.TAG,"Uploading Started->"+item.url);
        }catch (Exception e){
            Log.d(UConstants.TAG,"Uploading Error->"+e.toString());
            if(dbHelper != null)dbHelper.updateItem(item.task_id, UConstants.ERROR);
        }
    }
    public void deleteTask(String task_id, Context context) {
        boolean hasCall = task_id.contains("cb");
        String mainId = task_id;
        if(hasCall)mainId = task_id.replace("cb", "");
        String APPDIR = context.getExternalFilesDir(null).toString()+"/outputs/";
        if(dbHelper != null)dbHelper.deleteItem(mainId);
        for (int i = 0; i < workers.size(); i++) {
            MediaItem item = workers.get(i);            
            if(item.task_id.equals(mainId)) {                   
                removeAndAddIfAny(mainId, context);
                if(item.type == MediaItem.GIF_FILE && GIFCompressor.cancel(item.thread_id)){
                    deleteFile(APPDIR+mainId+".mp4");
                    return;
                }else if(item.type == MediaItem.VIDEO_FILE && Transcoder.cancel(item.thread_id)){
                    deleteFile(APPDIR+mainId+".mp4");
                    return;
                }
            }
        }
        UploadService.stopUpload(hasCall ? task_id : mainId);        
    }
    public static void deleteFile(String path){
        File fdelete = new File(path);
        if (fdelete.exists()) {
            fdelete.delete();
        }
    }
    public boolean checkWorkerForId(String task_id){
        for (int i = 0; i < workers.size(); i++) {
            MediaItem item = workers.get(i);
            if(item.task_id == task_id) {
                return true;
            }
        }
        return false;
    }
    interface TaskListener {
        void onNewItem(MediaItem item);
        void onTaskCompleted(String task_id);
        void onTaskCompressProgress(String task_id, int progress);
        void onCancled(String task_id);        
        void onCompressError(String task_id, String reason);
        void onUploadProgress(String task_id, int progress);
        void onUploadError(String task_id, String reason);
        void onFinalComplition(String task_id, int responseCode, String responseMessage);
    }
}