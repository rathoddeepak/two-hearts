package com.ydcrackerpackages.uploader.db;

import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;
import android.os.SystemClock;
import android.util.Log;
import androidx.annotation.Nullable;
import java.security.Security;
import java.util.ArrayList;
import java.util.Date;
import com.ydcrackerpackages.uploader.MediaItem;
/*
 Add To Uploadss
 Check If Upload Temp File Exists
 Get From Uploads
*/
public class UL_DBHelper extends SQLiteOpenHelper {
    public static final String DB = "appDB2";
    public static final String TABLE = "ul";
    public static final String[] cols = {"id", "type", "temp", "main", "status", "total", "uploaded", "compress", "width", "task_id", "time", "server_url", "server_params", "height"};
    public static final int ID = 0;
    public static final int TYPE = 1;
    public static final int TEMP = 2;
    public static final int MAIN = 3;
    public static final int STATUS = 4;
    public static final int TOTAL = 5;
    public static final int UPLOADED = 6;
    public static final int COMPRESS = 7;
    public static final int WIDTH = 8;
    public static final int TASK_ID = 9;
    public static final int TIME = 10;    
    public static final int SERVER_URL = 11;   
    public static final int SERVER_PARAM = 12;
    public static final int HEIGHT = 13;

    public UL_DBHelper(@Nullable Context context) {
        super(context, DB, null, 2);
        SQLiteDatabase db = getWritableDatabase();
    }

    @Override
    public void onCreate(SQLiteDatabase sqLiteDatabase) {        
        //Log.d(UConstants.TAG, "CREATE TABLE "+TABLE+ " (id integer primary key autoincrement, type integer, main text, status integer, total integer, uploaded integer, compress integer, width integer, task_id text, time text, server_url text, server_params text, height integer) ");
        sqLiteDatabase.execSQL("CREATE TABLE "+TABLE+ " (id integer primary key autoincrement, type integer, temp text, main text, status integer, total integer, uploaded integer, compress integer, width integer, task_id text, time text, server_url text, server_params text, height integer) ");
    }

    @Override
    public void onUpgrade(SQLiteDatabase sqLiteDatabase, int i, int i1) {
        sqLiteDatabase.execSQL("DROP TABLE IF EXISTS "+TABLE);
        onCreate(sqLiteDatabase);
    }

    public int addToUploads(int type, String main, int width, int height, String server_url, String server_params){
        SQLiteDatabase db = getWritableDatabase();        
        ContentValues insertValues = new ContentValues();
        insertValues.put(cols[TYPE], type);
        insertValues.put(cols[TEMP], " ");
        insertValues.put(cols[MAIN], main);
        insertValues.put(cols[STATUS], UConstants.IDEAL);
        insertValues.put(cols[TOTAL], "0");
        insertValues.put(cols[UPLOADED], "0");
        insertValues.put(cols[COMPRESS], "0");
        insertValues.put(cols[WIDTH], width);        
        insertValues.put(cols[TASK_ID], 0);
        insertValues.put(cols[TIME], System.currentTimeMillis());
        insertValues.put(cols[SERVER_URL], server_url);
        insertValues.put(cols[SERVER_PARAM], server_params);
        insertValues.put(cols[HEIGHT], height);
        int id = (int) db.insert(TABLE, null, insertValues);
        Log.d(UConstants.TAG, "Server Url "+ server_url);
        db.close();
        return id;
    }

    public ArrayList<ContentValues> retrieveData(int status, @Nullable Integer order){
        SQLiteDatabase database = getReadableDatabase();
        String whereClause = " ";
        if(status != -1){
            whereClause = " WHERE `status` = "+status;
        }
        if(order != null){
            whereClause += " ORDER BY `id` " + (order == UConstants.DESC ? "DESC" : "ASC");
        }
        Cursor cursor = database.rawQuery("SELECT * FROM "+TABLE+whereClause, null);
        ArrayList<ContentValues> data = new ArrayList<>();
        while (cursor.moveToNext()){
            ContentValues values = new ContentValues();            
            values.put(cols[ID], cursor.getInt(0));
            values.put(cols[TYPE], cursor.getInt(1));
            values.put(cols[TEMP], cursor.getString(2));
            values.put(cols[MAIN], cursor.getString(3));
            values.put(cols[STATUS], cursor.getInt(4));
            values.put(cols[TOTAL], cursor.getInt(5));
            values.put(cols[UPLOADED], cursor.getInt(6));
            values.put(cols[COMPRESS], cursor.getInt(7));
            values.put(cols[WIDTH], cursor.getString(8));
            values.put(cols[HEIGHT], cursor.getString(13));
            values.put(cols[TASK_ID], cursor.getInt(0));
            values.put(cols[TIME], cursor.getString(10));
            values.put(cols[SERVER_URL], cursor.getString(11));
            values.put(cols[SERVER_PARAM], cursor.getString(12));
            data.add(values);
        }
        cursor.close();
        return data;
    }

    public ArrayList<MediaItem> retrieveData2(int status, @Nullable Integer order){
        SQLiteDatabase database = getReadableDatabase();
        String whereClause = " ";
        if(status == UConstants.NEEDACTION){
            whereClause = " WHERE `status` = "+UConstants.PAUSED+" OR `status` = "+UConstants.UPLOADING;
        }else if(status != -1){
            whereClause = " WHERE `status` = "+status;
        }
        if(order != null){
            whereClause += " ORDER BY `id` " + (order == UConstants.DESC ? "DESC" : "ASC");
        }
        Cursor cursor = database.rawQuery("SELECT * FROM "+TABLE+whereClause, null);
        ArrayList<MediaItem> data = new ArrayList<>();
        while (cursor.moveToNext()){
            MediaItem item = new MediaItem();
            item.setSource(
                cursor.getString(MAIN),
                cursor.getInt(WIDTH),
                cursor.getInt(HEIGHT)
            );
            item.task_id = cursor.getInt(ID)+"";
            item.setForType(cursor.getInt(TYPE));
            Log.d(UConstants.TAG, "Got Server Url -> "+cursor.getString(SERVER_URL));
            item.setServer(cursor.getString(SERVER_PARAM), cursor.getString(SERVER_URL));
            data.add(item);
        }
        cursor.close();
        return data;
    }
    public ContentValues getItemById(String id){
        SQLiteDatabase database = getReadableDatabase();
        Cursor cursor = database.rawQuery("SELECT * FROM "+TABLE+" WHERE `id` = "+id, null);
        ContentValues values = new ContentValues();
        if(cursor.moveToFirst()){
            values.put(cols[ID], cursor.getString(0));
            values.put(cols[TYPE], cursor.getString(1));
            values.put(cols[TEMP], cursor.getString(2));
            values.put(cols[MAIN], cursor.getString(3));
            values.put(cols[STATUS], cursor.getInt(4));
            values.put(cols[TOTAL], cursor.getString(5));
            values.put(cols[UPLOADED], cursor.getString(6));
            values.put(cols[COMPRESS], cursor.getString(7));
            values.put(cols[WIDTH], cursor.getInt(8));
            values.put(cols[HEIGHT], cursor.getInt(13));
            values.put(cols[TASK_ID], cursor.getInt(0));
            values.put(cols[TIME], cursor.getString(10));
            values.put(cols[SERVER_URL], cursor.getString(11));
            values.put(cols[SERVER_PARAM], cursor.getString(12));
        }else{
            cursor.close();
            return null;
        }
        cursor.close();
        return values;
    }
    public ContentValues getOrderedData(int o){
        String order = o == 0 ? "DESC" : "ASC";
        SQLiteDatabase database = getReadableDatabase();
        Cursor cursor = database.query(TABLE, null, null, null, null, null, null);
        ContentValues values = new ContentValues();
        if(cursor.moveToLast()){
            values.put(cols[ID], cursor.getString(0));
            values.put(cols[TYPE], cursor.getString(1));
            values.put(cols[TEMP], cursor.getString(2));
            values.put(cols[MAIN], cursor.getString(3));
            values.put(cols[STATUS], cursor.getString(4));
            values.put(cols[TOTAL], cursor.getString(5));
            values.put(cols[UPLOADED], cursor.getString(6));
            values.put(cols[COMPRESS], cursor.getString(7));
            values.put(cols[WIDTH], cursor.getInt(8));
            values.put(cols[HEIGHT], cursor.getInt(13));
            values.put(cols[TASK_ID], cursor.getInt(0));
            values.put(cols[TIME], cursor.getString(10));  
            values.put(cols[SERVER_URL], cursor.getString(11));
            values.put(cols[SERVER_PARAM], cursor.getString(12));
            cursor.close();
            return values;
        }else{
            return null;
        }
    }

    public boolean updateItem(String id, int status){
        SQLiteDatabase database = getWritableDatabase();
        ContentValues values = new ContentValues();
        values.put(cols[STATUS], status);
        return database.update(TABLE, values, "id = ?", new String[] {id}) > 0;
    }

    public boolean updateProgress(String id, int progress){
        SQLiteDatabase database = getWritableDatabase();
        ContentValues values = new ContentValues();
        values.put(cols[UPLOADED], progress);
        return database.update(TABLE, values, "id = ?", new String[] {id}) > 0;
    }

    public boolean updateCompress(String id, int progress){
        SQLiteDatabase database = getWritableDatabase();
        ContentValues values = new ContentValues();
        values.put(cols[COMPRESS], progress);
        return database.update(TABLE, values, "id = ?", new String[] {id}) > 0;
    }

    public boolean updateColumn(String id, int column, String value){
        SQLiteDatabase database = getWritableDatabase();
        ContentValues values = new ContentValues();
        values.put(cols[column], value);
        return database.update(TABLE, values, "id = ?", new String[] {id}) > 0;
    }

    public boolean updateUploaded(String id, int bytes){
        SQLiteDatabase database = getWritableDatabase();
        ContentValues values = new ContentValues();
        values.put(cols[UPLOADED], bytes + "");
        return database.update(TABLE, values, "id = ?", new String[] {id}) > 0;
    }

    public boolean deleteItem(String id){
        SQLiteDatabase database = getWritableDatabase();
        return database.delete(TABLE, " id = ? ", new String[] {id}) > 0;
    }
}
