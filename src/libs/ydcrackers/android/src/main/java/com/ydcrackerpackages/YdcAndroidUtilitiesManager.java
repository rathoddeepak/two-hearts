package com.ydcrackerpackages;



import android.content.ContentResolver;
import android.database.Cursor;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.media.MediaMetadataRetriever;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.provider.MediaStore;
import androidx.annotation.Nullable;
import android.util.Log;


import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;

import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.ydcrackerpackages.Utilities.ReactNativeFileManager;
import com.ydcrackerpackages.Utilities.GalleryCursorManager;

public class YdcAndroidUtilitiesManager extends ReactContextBaseJavaModule {

    public static ReactApplicationContext reactContext;

    //Get Music Files Declaration
    private boolean getBluredImages = false;
    private boolean getArtistFromSong = false;
    private boolean getDurationFromSong = true;
    private boolean getTitleFromSong = true;
    private boolean getIDFromSong = false;
    private boolean getCoverFromSong = false;
    private boolean getGenreFromSong = false;
    private boolean getAlbumFromSong = true;
    private boolean getDateFromSong = false;
    private boolean getCommentsFromSong = false;
    private boolean getLyricsFromSong = false;
    private int minimumSongDuration = 0;
    private int songsPerIteration = 0;
    private int version = Build.VERSION.SDK_INT;
    private String[] STAR = { "*" };
    //Music Files Declaration End

    public YdcAndroidUtilitiesManager(ReactApplicationContext context) {
        super(context);  
        reactContext = context;        
    }

    @Override
    public String getName() {
        return "AndroidUtilities";
    }

    //Get Music Files Functions Start
    @ReactMethod
    public void getMusicFiles(ReadableMap options, final Callback successCallback, final Callback errorCallback) {


        if (options.hasKey("blured")) {
            getBluredImages = options.getBoolean("blured");
        }


        if (options.hasKey("artist")) {
            getArtistFromSong = options.getBoolean("artist");
        }

        if (options.hasKey("duration")) {
            getDurationFromSong = options.getBoolean("duration");
        }

        if (options.hasKey("title")) {
            getTitleFromSong = options.getBoolean("title");
        }

        if (options.hasKey("id")) {
            getIDFromSong = options.getBoolean("id");
        }

        if (options.hasKey("cover")) {
            getCoverFromSong = options.getBoolean("cover");
        }

        if (options.hasKey("genre")) {
            getGenreFromSong = options.getBoolean("genre");
        }

        if (options.hasKey("album")) {
            getAlbumFromSong = options.getBoolean("album");
        }

        /*if (options.hasKey("date")) {
            getDateFromSong = options.getBoolean("date");
        }

        if (options.hasKey("comments")) {
            getCommentsFromSong = options.getBoolean("comments");
        }

        if (options.hasKey("lyrics")) {
            getLyricsFromSong = options.getBoolean("lyrics");
        }*/

        if (options.hasKey("batchNumber")) {
            songsPerIteration = options.getInt("batchNumber");
        }

        if (options.hasKey("minimumSongDuration") && options.getInt("minimumSongDuration") > 0) {
            minimumSongDuration = options.getInt("minimumSongDuration");
        } else {
            minimumSongDuration = 0;
        }

        if(version <= 19){
            getSongs(successCallback,errorCallback);
        }else{
            Thread bgThread = new Thread(null,
                    new Runnable() {
                        @Override
                        public void run() {
                            getSongs(successCallback,errorCallback);
                        }
                    }, "asyncTask", 1024
            );
            bgThread.start();
        }
    }

    private void getSongs(final Callback successCallback, final Callback errorCallback){
        ContentResolver musicResolver = getCurrentActivity().getContentResolver();
        Uri musicUri = MediaStore.Audio.Media.EXTERNAL_CONTENT_URI;
        String selection = MediaStore.Audio.Media.IS_MUSIC + "!= 0";

        if(minimumSongDuration > 0){
            selection += " AND " + MediaStore.Audio.Media.DURATION + " >= " + minimumSongDuration;
        }

        String sortOrder = MediaStore.Audio.Media.TITLE + " ASC";
        Cursor musicCursor = musicResolver.query(musicUri, STAR, selection, null, sortOrder);

        //Log.i("Tienes => ",Integer.toString(musicCursor.getCount()));

        int pointer = 0;

        if (musicCursor != null && musicCursor.moveToFirst()) {

            if (musicCursor.getCount() > 0) {
                WritableArray jsonArray = new WritableNativeArray();
                WritableMap items;


                //FFmpegMediaMetadataRetriever mmr = new FFmpegMediaMetadataRetriever();
                MediaMetadataRetriever mmr = new MediaMetadataRetriever();


                int idColumn = musicCursor.getColumnIndex(android.provider.MediaStore.Audio.Media._ID);

                try {
                    do {
                        try {
                            items = new WritableNativeMap();

                            long songId = musicCursor.getLong(idColumn);

                            if (getIDFromSong) {
                                String str = String.valueOf(songId);
                                items.putString("id", str);
                            }

                            String songPath = musicCursor.getString(musicCursor.getColumnIndexOrThrow(MediaStore.Audio.Media.DATA));
                            //MP3File mp3file = new MP3File(songPath);

                            Log.e("musica",songPath);

                            if (songPath != null && songPath != "") {

                                String fileName = songPath.substring(songPath.lastIndexOf("/") + 1);

                                //by default, always return path and fileName
                                items.putString("path", songPath);
                                items.putString("fileName", fileName);

                                mmr.setDataSource(songPath);

                                //String songTimeDuration = mmr.extractMetadata(FFmpegMediaMetadataRetriever.METADATA_KEY_DURATION);
                                String songTimeDuration = mmr.extractMetadata(mmr.METADATA_KEY_DURATION);
                                int songIntDuration = Integer.parseInt(songTimeDuration);

                                if (getAlbumFromSong) {
                                    String songAlbum = mmr.extractMetadata(mmr.METADATA_KEY_ALBUM);
                                    //String songAlbum = mmr.extractMetadata(FFmpegMediaMetadataRetriever.METADATA_KEY_ALBUM);
                                    items.putString("album", songAlbum);
                                }

                                if (getArtistFromSong) {
                                    String songArtist = mmr.extractMetadata(mmr.METADATA_KEY_ARTIST);
                                    //String songArtist = mmr.extractMetadata(FFmpegMediaMetadataRetriever.METADATA_KEY_ARTIST);
                                    items.putString("author", songArtist);
                                }


                                if (getTitleFromSong) {
                                    String songTitle = mmr.extractMetadata(mmr.METADATA_KEY_TITLE);
                                    //String songTitle = mmr.extractMetadata(FFmpegMediaMetadataRetriever.METADATA_KEY_TITLE);
                                    items.putString("title", songTitle);
                                }

                                if (getGenreFromSong) {
                                    String songGenre = mmr.extractMetadata(mmr.METADATA_KEY_GENRE);
                                    //String songGenre = mmr.extractMetadata(FFmpegMediaMetadataRetriever.METADATA_KEY_GENRE);
                                    items.putString("genre", songGenre);
                                }

                                if (getDurationFromSong) {
                                    items.putString("duration", songTimeDuration);
                                }

                                /*if (getCommentsFromSong) {
                                    items.putString("comments", mmr.extractMetadata(FFmpegMediaMetadataRetriever.METADATA_KEY_COMMENT));
                                }

                                if (getDateFromSong) {
                                    items.putString("date", mmr.extractMetadata(FFmpegMediaMetadataRetriever.METADATA_KEY_DATE));
                                }

                                if (getLyricsFromSong) {
                                    //String lyrics = mp3file.getID3v2Tag().getSongLyric();
                                    //items.putString("lyrics", lyrics);
                                }*/

                                if (getCoverFromSong) {

                                    ReactNativeFileManager fcm = new ReactNativeFileManager();

                                    String encoded = "";
                                    String blurred = "";
                                    try {
                                        byte[] albumImageData = mmr.getEmbeddedPicture();

                                        if (albumImageData != null) {
                                            Bitmap songImage = BitmapFactory.decodeByteArray(albumImageData, 0, albumImageData.length);

                                            try {
                                                String pathToImg = Environment.getExternalStorageDirectory() + "/" + songId + ".jpg";
                                                encoded = fcm.saveImageToStorageAndGetPath(pathToImg, songImage);
                                                items.putString("cover", "file://" + encoded);
                                            } catch (Exception e) {
                                                // Just let images empty
                                                Log.e("error in image", e.getMessage());
                                            }

                                            if (getBluredImages) {
                                                try {
                                                    String pathToImg = Environment.getExternalStorageDirectory() + "/" + songId + "-blur.jpg";
                                                    blurred = fcm.saveBlurImageToStorageAndGetPath(pathToImg, songImage);
                                                    items.putString("blur", "file://" + blurred);
                                                } catch (Exception e) {
                                                    Log.e("error in image-blured", e.getMessage());
                                                }
                                            }
                                        }
                                    }catch (Exception e) {
                                        Log.e("embedImage","No embed image");
                                    }
                                }


                                jsonArray.pushMap(items);

                                if (songsPerIteration > 0) {

                                    if (songsPerIteration > musicCursor.getCount()) {
                                        if (pointer == (musicCursor.getCount() - 1)) {
                                            WritableMap params = Arguments.createMap();
                                            params.putArray("batch", jsonArray);
                                            sendEvent(reactContext, "onBatchReceived", params);
                                        }
                                    } else {
                                        if (songsPerIteration == jsonArray.size()) {
                                            WritableMap params = Arguments.createMap();
                                            params.putArray("batch", jsonArray);
                                            sendEvent(reactContext, "onBatchReceived", params);
                                            jsonArray = new WritableNativeArray();
                                        } else if (pointer == (musicCursor.getCount() - 1)) {
                                            WritableMap params = Arguments.createMap();
                                            params.putArray("batch", jsonArray);
                                            sendEvent(reactContext, "onBatchReceived", params);
                                        }
                                    }

                                    pointer++;
                                }
                            }

                        } catch (Exception e) {
                            // An error in one message should not prevent from getting the rest
                            // There are cases when a corrupted file can't be read and a RuntimeException is raised

                            // Let's discuss how to deal with these kind of exceptions
                            // This song will be ignored, and incremented the pointer in order to this plugin work
                            pointer++;

                            continue; // This is redundant, but adds meaning
                        }

                    } while (musicCursor.moveToNext());

                    if (songsPerIteration == 0) {
                        successCallback.invoke(jsonArray);
                    }

                } catch (RuntimeException e) {
                    errorCallback.invoke(e.toString());
                } catch (Exception e) {
                    errorCallback.invoke(e.getMessage());
                } finally {
                    mmr.release();
                }
            }else{
                Log.i("com.tests","Error, you dont' have any songs");
                successCallback.invoke("Error, you dont' have any songs");
            }
        }else{
            Log.i("com.tests","Something get wrong with musicCursor");
            errorCallback.invoke("Something get wrong with musicCursor");
        }
    }    
    //Get Music Files Functions Stop

    //Gallery Files Function Start 
     @ReactMethod
    public void getGalleryImages(final ReadableMap params, final Promise promise) {
        if (isJellyBeanOrLater()) {
            promise.reject(new Exception("Version of Android must be > JellyBean"));
            return;
        }

        String requestedType = "all";
        if (params.hasKey("type")) {
            requestedType = params.getString("type");
        }

        Integer limit = 10;
        if (params.hasKey("limit")) {
            limit = params.getInt("limit");
        }
        Integer startFrom = 0;
        if (params.hasKey("startFrom")) {
            startFrom = params.getInt("startFrom");
        }
        String albumName = null;
        if (params.hasKey("albumName")) {
            albumName = params.getString("albumName");
        }

        WritableMap response = new WritableNativeMap();

        Cursor gallery = null;
        try {
            gallery = GalleryCursorManager.getAssetCursor(requestedType, albumName, reactContext);
            WritableArray assets = new WritableNativeArray();

            if(gallery.getCount() <= startFrom ) {
                promise.reject("gallery index out of bound", "");
                return;
            } else {
                response.putInt("totalAssets", gallery.getCount());
                boolean hasMore = gallery.getCount() > startFrom + limit;
                response.putBoolean("hasMore", hasMore);
                if(hasMore) {
                    response.putInt("next", startFrom + limit);
                } else {
                    response.putInt("next", gallery.getCount());
                }
                gallery.moveToPosition(startFrom);
            }

            do {
                WritableMap asset = getAsset(gallery);
                assets.pushMap(asset);
                if (gallery.getPosition() == (startFrom + limit) - 1) break;
            } while (gallery.moveToNext());

            response.putArray("assets", assets);

            promise.resolve(response);

        } catch (SecurityException ex) {
            System.err.println(ex);
        } finally {
            if (gallery != null) gallery.close();
        }
    }


    @ReactMethod
    public void getImageAlbums(final Promise promise) {
        if (isJellyBeanOrLater()) {
            promise.reject(new Exception("Version of Android must be > JellyBean"));
            return;
        }

        WritableMap response = new WritableNativeMap();


        Cursor gallery = null;
        try {
            gallery = GalleryCursorManager.getAlbumCursor(reactContext);
            WritableArray albums = new WritableNativeArray();
            response.putInt("totalAlbums", gallery.getCount());
            gallery.moveToFirst();
            do {
                WritableMap album = getAlbum(gallery);
                albums.pushMap(album);
            } while (gallery.moveToNext());

            response.putArray("albums", albums);

            promise.resolve(response);

        } catch (SecurityException ex) {
            System.err.println(ex);
        } finally {
            if (gallery != null) gallery.close();
        }

    }

    private WritableMap getAsset(Cursor gallery) {
        WritableMap asset = new WritableNativeMap();
        int mediaType = gallery.getInt(gallery.getColumnIndex(MediaStore.Files.FileColumns.MEDIA_TYPE));
        String mimeType = gallery.getString(gallery.getColumnIndex(MediaStore.Files.FileColumns.MIME_TYPE));
        String creationDate = gallery.getString(gallery.getColumnIndex(MediaStore.Files.FileColumns.DATE_ADDED));
        String fileName = gallery.getString(gallery.getColumnIndex(MediaStore.Files.FileColumns.DISPLAY_NAME));
        Double height = gallery.getDouble(gallery.getColumnIndex(MediaStore.Files.FileColumns.HEIGHT));
        Double width = gallery.getDouble(gallery.getColumnIndex(MediaStore.Files.FileColumns.WIDTH));
        String uri = "file://" + gallery.getString(gallery.getColumnIndex(MediaStore.Files.FileColumns.DATA));
        Double id = gallery.getDouble(gallery.getColumnIndex(MediaStore.Files.FileColumns._ID));


        asset.putString("mimeType", mimeType);
        asset.putString("creationDate", creationDate);
        asset.putDouble("height", height);
        asset.putDouble("width", width);
        asset.putString("filename", fileName);
        asset.putDouble("id", id);
        asset.putString("uri", uri);

        if (mediaType == MediaStore.Files.FileColumns.MEDIA_TYPE_IMAGE) {
            asset.putDouble("duration", 0);
            asset.putString("type", "image");

        } else if (mediaType == MediaStore.Files.FileColumns.MEDIA_TYPE_VIDEO) {
            Double duration = gallery.getDouble(gallery.getColumnIndex(MediaStore.Video.VideoColumns.DURATION));
            asset.putDouble("duration", duration / 1000);
            asset.putString("type", "video");
        }
        return asset;
    }

    private WritableMap getAlbum(Cursor gallery) {
        WritableMap album = new WritableNativeMap();
        String albumName = gallery.getString(gallery.getColumnIndex(MediaStore.Images.ImageColumns.BUCKET_DISPLAY_NAME));
        int assetCount = gallery.getInt(gallery.getColumnIndex("assetCount"));        
        Cursor galleryCover = GalleryCursorManager.getAssetCursor("all", albumName, reactContext);
        galleryCover.moveToPosition(0);
        WritableMap cover = getAsset(galleryCover);        
        album.putString("title", albumName);
        album.putInt("assetCount", assetCount);
        album.putString("cover", cover.getString("uri"));
        return album;
    }


    private Boolean isJellyBeanOrLater() {
        return Build.VERSION.SDK_INT < Build.VERSION_CODES.JELLY_BEAN;
    }
    //Gallery Files Function Stop

    private void sendEvent(ReactContext reactContext,
                           String eventName,
                           @Nullable WritableMap params) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }
}

