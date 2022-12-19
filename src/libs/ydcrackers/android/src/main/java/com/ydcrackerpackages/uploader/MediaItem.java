package com.ydcrackerpackages.uploader;

import android.media.MediaMetadataRetriever;
import android.graphics.Bitmap;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.lang.RuntimeException;
import java.util.UUID;

public class MediaItem {
    public String url, thumbnail, server_url, server_params, thread_id, task_id;     
    int duration, type, width, height, for_type = 1;
    static int VIDEO_FILE = 2, AUDIO_FILE = 3, IMAGE_FILE = 1, GIF_FILE = 4, WORKING = 6, IDEAL = 7;
    int status = 4;
    private MediaMetadataRetriever retriever = null;
    private Bitmap bmp = null;
    private FileInputStream inputStream = null;
    public void setForType(int for_type){
        this.for_type = for_type;
    }
    public int getForType(int for_type){
        return for_type;
    }
    public boolean setSource(String source, int width, int height){
        this.width = width;
        this.height = height;
        source = source.toLowerCase();
        if(source.endsWith("mp4") || source.endsWith("avi") || source.endsWith("flv") || source.endsWith("3gp") || source.endsWith("mkv") || source.endsWith("mpg") || source.endsWith("wmv")){            
            try {
                retriever = new  MediaMetadataRetriever();
                inputStream = new FileInputStream(source);
                retriever.setDataSource(inputStream.getFD());
                bmp = retriever.getFrameAtTime();
                this.width = bmp.getWidth();
                this.height = bmp.getHeight();
                   if (retriever != null){
                       retriever.release();
                   }if (inputStream != null){
                       inputStream.close();
                   }
            } catch (FileNotFoundException e) {
                
            } catch (IOException e) {
                
            } catch (RuntimeException e) {
                
            }

            type = VIDEO_FILE;
            //duration = getDuration(source);
            duration = 0;
        }else if(source.endsWith("jpg") || source.endsWith("jpeg") || source.endsWith("png") || source.endsWith("bmp")){
            type = IMAGE_FILE;
            //duration = getDuration(source);
            duration = 0;
        }else if(source.endsWith("wav") || source.endsWith("mp3") || source.endsWith("aac") || source.endsWith("m4a")){
            type = AUDIO_FILE;
        }else if(source.endsWith("gif")){
            type = GIF_FILE;
        }else{
            return false;
        } 
        this.url = source;
        return true;
    }
    public void setServer(String jsonParams, String server_url){
        this.server_params = jsonParams;
        this.server_url = server_url;
    }
} 