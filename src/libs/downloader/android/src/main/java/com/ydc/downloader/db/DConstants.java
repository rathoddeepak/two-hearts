package com.ydc.downloader.db;
import java.util.Date;
import java.io.File;
public class DConstants {
    //Helping Constants
    public static final String DEST = "/storage/emulated/0/TwoHearts/";
    public static final String VDS = "Videos";
    public static final String DB = "DB";
    public static final String IMGS = "Images";
    public static final String TAG = "ReactDownloadManager";
    //Download Status
    public static final int ALL = -1;
    public static final int DOWNLOADING = 0;
    public static final int PAUSED = 1;
    public static final int COMPLETED = 2;
    public static final int ERROR = 3;
    public static final int IDLE = 4;
    public static final int NEEDACTION = 5;
    //Database Order
    public static final int DESC = 0;
    public static final int ASC = 1;
    //Functions
    public static String createDest(String filename, String extension){
        new File(DConstants.DEST + DConstants.DB).mkdir();
        return DConstants.DEST + DConstants.DB + "/" + filename+"."+extension;
    }
    //Notification Constants
    public static final int FG_ID = 1;
}
