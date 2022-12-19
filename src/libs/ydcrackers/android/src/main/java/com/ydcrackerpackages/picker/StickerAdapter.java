package com.ydcrackerpackages.picker;

import android.graphics.Color;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import android.net.Uri;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageButton;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.TextView;

import java.util.List;
import java.util.Random;

import com.bumptech.glide.Glide;
import com.ydcrackerpackages.R;
class StickerAdapter extends RecyclerView.Adapter<StickerAdapter.StickerHolder> {
    List<Sticker> stickerDataList;
    private StickerDelegate stickerDelegate;
    public StickerAdapter(List<Sticker> stickerDataList, StickerDelegate stickerDelegate) {
        this.stickerDataList = stickerDataList;
        this.stickerDelegate = stickerDelegate;
    }
    @NonNull
    @Override
    public StickerHolder onCreateViewHolder(@NonNull ViewGroup viewGroup, int i) {
        View itemView = LayoutInflater.from(viewGroup.getContext())
                .inflate(R.layout.sticker_item, viewGroup, false);
        return new StickerHolder(itemView);
    }
    @Override
    public void onBindViewHolder(StickerHolder viewHolder, int i) {
        viewHolder.loadImage(stickerDataList.get(i).getUrl());
    }
    @Override
    public int getItemCount() {
        return stickerDataList.size();
    }
    class StickerHolder extends RecyclerView.ViewHolder {
        ImageButton imageButton;
        ProgressBar progressBar;
        Uri uri;
        public StickerHolder(View itemView) {
            super(itemView);
            imageButton = itemView.findViewById(R.id.sticker_iv);
            progressBar = itemView.findViewById(R.id.ivs_p);
            imageButton.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    stickerDelegate.onStickerClick(uri);
                }
            });
        }
        public void loadImage(String url){
            uri = Uri.parse(url);
            stickerDelegate.loadSticker(uri, imageButton, progressBar);
        }
    }
    public interface StickerDelegate {
        void loadSticker(Uri uri, ImageButton imageButton, ProgressBar progressBar);
        void onStickerClick(Uri uri);
    }
}