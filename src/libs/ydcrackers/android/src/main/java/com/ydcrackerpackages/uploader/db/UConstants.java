package com.ydcrackerpackages.uploader.db;

import java.util.Date;

public class UConstants {
    //Helping Constants
    public static String DEST = "";
    public static final String VDS = "Videos";
    public static final String IMGS = "Images";
    public static final String TAG = "ReactUploadManager";    
    //Upload Status
    public static final int ALL = -1;
    public static final int UPLOADING = 0;
    public static final int PAUSED = 1;
    public static final int COMPLETED = 2;
    public static final int ERROR = 3;
    public static final int IDEAL = 4;
    public static final int NEEDACTION = 5;
    public static final int COMPRESSING = 6;
    public static final int COMPRESSED = 7;
    public static final int COMPRESS_ERROR = 8;
    public static final int CANCLED = 9;
    //Upload Order
    public static final int DESC = 0;
    public static final int ASC = 1;
    //Upload Types
    public static final int HOME = 0;    
    public static final int PHOTOS = 1;
    public static final int ALBUM = 2;
    public static final int AVATAR = 3;
    public static final int COVER = 4;
    public static final int OTHER1 = 5;
    public static final int OTHER2 = 6;
    //Functions
    public static String createDest(String url, String ext){        
        int i = url.lastIndexOf('.') ;
        if (i >= 0)ext = url.substring(i+1);
        return DEST + VDS + "/" + (new Date()).getTime()+"."+ext;
    }
    //Notification Constants
    public static final int FG_ID = 66;
    //getApplicationContext().getFilesDir().getAbsolutePath()
}
