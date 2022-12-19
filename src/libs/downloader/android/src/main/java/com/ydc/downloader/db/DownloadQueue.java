package com.ydc.downloader.db;

import android.content.ContentValues;
import android.content.Context;

import java.util.ArrayList;

public class DownloadQueue {
    public static ArrayList<ContentValues> getTypedDownloads(Context context, int type){
        DL_DBHelper dbHelper = new DL_DBHelper(context);
        return dbHelper.retrieveData(type, null, null);
    }
    public static ContentValues topMost(Context context){
        DL_DBHelper dbHelper = new DL_DBHelper(context);
        return dbHelper.getOrderedData(0);
    }
    public static ContentValues bottomMost(Context context){
        DL_DBHelper dbHelper = new DL_DBHelper(context);
        return dbHelper.getOrderedData(1);
    }
}
