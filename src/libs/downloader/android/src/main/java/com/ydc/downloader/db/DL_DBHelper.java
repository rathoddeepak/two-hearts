package com.ydc.downloader.db;

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

public class DL_DBHelper extends SQLiteOpenHelper {
    public static final String DB = "appDB";
    public static final String TABLE = "dl";
    public static final String[] cols = {"id", "name", "url", "dest", "status", "created", "about", "cover", "type", "data_id", "e_bytes"};
    public static final String create_table = "CREATE TABLE "+TABLE+" ";
    public DL_DBHelper(@Nullable Context context) {
        super(context, DB, null, 1);
        SQLiteDatabase db = getWritableDatabase();
    }

    @Override
    public void onCreate(SQLiteDatabase sqLiteDatabase) {
        Log.d(DConstants.TAG, "Database Table Created");
        sqLiteDatabase.execSQL("CREATE TABLE "+TABLE+ " (id integer primary key autoincrement, name text, url text, dest text, status integer, created text, about text, cover text, type integer, data_id integer, e_bytes text) ");
    }

    @Override
    public void onUpgrade(SQLiteDatabase sqLiteDatabase, int i, int i1) {
        sqLiteDatabase.execSQL("DROP TABLE IF EXISTS "+TABLE);
    }

    public int addToDownloads(String name, String url, String dest, String about, String cover, int type, int  data_id){
        SQLiteDatabase db = getWritableDatabase();
        ContentValues insertValues = new ContentValues();
        insertValues.put(cols[1], name);
        insertValues.put(cols[2], url);
        insertValues.put(cols[3], dest);
        insertValues.put(cols[4], DConstants.IDLE);
        insertValues.put(cols[5], System.currentTimeMillis());
        insertValues.put(cols[6], about);
        insertValues.put(cols[7], cover);
        insertValues.put(cols[8], type);
        insertValues.put(cols[9], data_id);
        insertValues.put(cols[10], "0");
        return (int) db.insert(TABLE, null, insertValues);
    }

    public ArrayList<ContentValues> retrieveData(int status,@Nullable Integer type, @Nullable Integer order){
        SQLiteDatabase database = getReadableDatabase();
        String whereClause = " ";
        if(status == DConstants.NEEDACTION){
            whereClause = " WHERE `status` = "+DConstants.PAUSED+" OR `status` = "+DConstants.DOWNLOADING;
        }else if(status != -1){
            whereClause = " WHERE `status` = "+status;
        }
        if(type != null){
            whereClause = " WHERE `type` = "+type;
        }
        if(order != null){
            whereClause += " ORDER BY `id` " + (order == DConstants.DESC ? "DESC" : "ASC");
        }
        Cursor cursor = database.rawQuery("SELECT * FROM "+TABLE+whereClause, null);
        ArrayList<ContentValues> data = new ArrayList<>();
        while (cursor.moveToNext()){
            ContentValues values = new ContentValues();
            values.put(cols[0], cursor.getString(0));
            values.put(cols[1], cursor.getString(1));
            values.put(cols[2], cursor.getString(2));
            values.put(cols[3], cursor.getString(3));
            values.put(cols[4], cursor.getInt(4));
            values.put(cols[5], cursor.getString(5));
            values.put(cols[6], cursor.getString(6));
            values.put(cols[7], cursor.getString(7));
            values.put(cols[8], cursor.getInt(8));
            values.put(cols[9], cursor.getInt(9));
            values.put(cols[10], cursor.getString(10));
            data.add(values);
        }
        cursor.close();
        return data;
    }
    public ContentValues getItemById(String id){
        SQLiteDatabase database = getReadableDatabase();
        Cursor cursor = database.rawQuery("SELECT * FROM "+TABLE+" WHERE `id` = "+id, null);
        ContentValues values = new ContentValues();
        if(cursor.moveToFirst()){
            values.put(cols[0], cursor.getString(0));
            values.put(cols[1], cursor.getString(1));
            values.put(cols[2], cursor.getString(2));
            values.put(cols[3], cursor.getString(3));
            values.put(cols[4], cursor.getInt(4));
            values.put(cols[5], cursor.getString(5));
            values.put(cols[6], cursor.getString(6));
            values.put(cols[7], cursor.getString(7));
            values.put(cols[8], cursor.getInt(8));
            values.put(cols[9], cursor.getInt(9));
            values.put(cols[10], cursor.getString(10));
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
            values.put(cols[0], cursor.getString(0));
            values.put(cols[1], cursor.getString(1));
            values.put(cols[2], cursor.getString(2));
            values.put(cols[3], cursor.getString(3));
            values.put(cols[4], cursor.getString(4));
            values.put(cols[5], cursor.getString(5));
            values.put(cols[6], cursor.getString(6));
            values.put(cols[7], cursor.getString(7));
            values.put(cols[8], cursor.getInt(8));
            values.put(cols[9], cursor.getInt(9));
            values.put(cols[10], cursor.getString(10));            
            cursor.close();
            return values;
        }else{
            return null;
        }
    }

    public boolean updateItem(String id, int status){
        SQLiteDatabase database = getWritableDatabase();
        ContentValues values = new ContentValues();
        values.put(cols[4], status);
        return database.update(TABLE, values, "id = ?", new String[] {id}) > 0;
    }

    public boolean updateEBytes(String id, int bytes){
        SQLiteDatabase database = getWritableDatabase();
        ContentValues values = new ContentValues();
        values.put(cols[10], bytes + "");
        return database.update(TABLE, values, "id = ?", new String[] {id}) > 0;
    } 

    public boolean deleteItem(String id){
        SQLiteDatabase database = getWritableDatabase();
        return database.delete(TABLE, " id = ? ", new String[] {id}) > 0;
    }
}
