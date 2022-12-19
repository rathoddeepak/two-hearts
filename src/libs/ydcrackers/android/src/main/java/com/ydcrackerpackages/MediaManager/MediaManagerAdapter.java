package com.ydcrackerpackages.MediaManager;

import android.content.Context;
import android.media.Image;
import android.net.Uri;
import android.util.Log;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;
import androidx.viewpager2.widget.ViewPager2;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.UiThreadUtil;

import java.util.ArrayList;
import com.ydcrackerpackages.MediaManager.MediaItem;
public class MediaManagerAdapter extends RecyclerView.Adapter<MediaManagerAdapter.MediaManagerHolder> {
    private static ArrayList<SimpleItem> items = new ArrayList<>();
    private Context context;
    public ViewPager2 slider;
    private PagerEventsListener mListener;
    private int controllerPos = 0;
    public MediaManagerAdapter(Context context, ArrayList<MediaItem> data, ViewPager2 slider) {
        if(items.size() != 0){
            items.removeAll(items);
        }        
        addItems(data);
        this.context = context;
        this.slider = slider;
    }
    @NonNull
    @Override
    public MediaManagerHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        LinearLayout mediaItemHolder = new LinearLayout(context);
        mediaItemHolder.setLayoutParams(new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.MATCH_PARENT));
        mediaItemHolder.setGravity(Gravity.CENTER_VERTICAL|Gravity.CENTER_HORIZONTAL);
        SimpleItem currentItem = items.get(viewType);        
        return new MediaManagerHolder(mediaItemHolder, currentItem.source);
    }

    public void cleanUp(){
        items.removeAll(items);
        UiThreadUtil.runOnUiThread(new Runnable() {          
          @Override
          public void run() {            
            notifyDataSetChanged();
          }
        });
    }

    public void addPages(ReadableArray extraData){
        addItems(extraData);
        UiThreadUtil.runOnUiThread(new Runnable() {          
          @Override
          public void run() {
            notifyDataSetChanged();
          }
        });
    }

    public void addItems(ReadableArray extraData){        
        for (int i = 0; i < extraData.size(); i++) {
            ReadableMap map = extraData.getMap(i);
            SimpleItem item = new SimpleItem(map.getString("source"), map.getString("thumbnail"));
            items.add(item);        
        }        
    }

    public void addItems(ArrayList<MediaItem> extraData){        
        for (int i = 0; i < extraData.size(); i++) {
            MediaItem mitem = extraData.get(i);
            SimpleItem item = new SimpleItem(mitem.source, mitem.thumbnail);
            items.add(item);        
        }        
    }    

    public void registerMediaEventCallBacks(PagerEventsListener listener){
        mListener = listener;
    }

    @Override
    public void onBindViewHolder(@NonNull MediaManagerHolder holder, int position) {
        SimpleItem currentItem = items.get(position);
        holder.onBind(position, currentItem.thumbnail, currentItem.source);
    }

    @Override
    public int getItemViewType(int position) {
        return position;
    }

    @Override
    public int getItemCount() {
        return items.size();
    }

    public void shiftControllerUp(int y){
        this.controllerPos = y;
    }

    class MediaManagerHolder extends RecyclerView.ViewHolder {
        LinearLayout mediaItemHolder;
        VideoContainer videoContainer;
        ImageViewer imageView;
        int itemIndex;
        private MediaManagerHolder(LinearLayout mediaItemHolder, String source) {
            super(mediaItemHolder);
            this.mediaItemHolder = mediaItemHolder;            
            if(source.endsWith("mp4")  || source.endsWith("3gp") || source.endsWith("avi")){
                videoContainer = new VideoContainer(context, slider, controllerPos);                
                videoContainer.onDismiss(new PagerEventsListener(){
                    @Override
                    public void onDismiss(float position, int index) {
                        mListener.onDismiss(position, index);
                    }
                });
                mediaItemHolder.addView(videoContainer);
            }else{
                imageView = new ImageViewer(context, slider);
                imageView.onDismiss(new PagerEventsListener(){
                    @Override
                    public void onDismiss(float position, int index) {
                        mListener.onDismiss(position, index);
                    }
                });
                mediaItemHolder.addView(imageView);
            }
        }

        private void onBind(int position, String thumbnail, String source){
            itemIndex = position;
            if(source.endsWith("mp4")  || source.endsWith("3gp") || source.endsWith("avi")){
                videoContainer.setItem(thumbnail, source, position);
            }else{
                imageView.setIndex(position);
                imageView.showImage(thumbnail, source);
            }
        }
    }

    class SimpleItem {
        String source;
        String thumbnail;
        SimpleItem(String source, String thumbnail){
            this.source = source;
            this.thumbnail = thumbnail;
        }
    }
}