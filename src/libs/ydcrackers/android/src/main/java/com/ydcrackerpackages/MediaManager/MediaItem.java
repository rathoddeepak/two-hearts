package com.ydcrackerpackages.MediaManager;
import java.util.HashMap;
public class MediaItem {
    public String source, thumbnail, blurHash;
    public int width, height, imageCenter, imageCenter2, oHeight, oWidth, o_idx;
    public float x, y;

    public MediaItem(                
        int width,
        int height,
        int oWidth,
        int oHeight,
        String source,
        String thumbnail,
        int imageCenter,
        int imageCenter2,
        String blurHash,
        int o_idx
    ){
        this.width = width; 
        this.height = height;
        this.oWidth = oWidth; 
        this.oHeight = oHeight; 
        this.source = source;
        this.thumbnail = thumbnail; 
        this.imageCenter = imageCenter; 
        this.imageCenter2 = imageCenter2;
        this.blurHash = blurHash;
        this.o_idx = o_idx;
    }
    public void setX(double x){
        this.x = (float) x;
    }
    public void setY(double y){
        this.y = (float) y;
    }
}
