package com.ydcrackerpackages.picker;

import android.content.res.Resources;
import android.graphics.Bitmap;
import android.graphics.drawable.Drawable;
import android.net.Uri;
import android.os.Bundle;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.recyclerview.widget.DividerItemDecoration;
import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.util.TypedValue;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageButton;
import android.widget.ProgressBar;

import com.bumptech.glide.Glide;
import com.bumptech.glide.load.DataSource;
import com.bumptech.glide.load.engine.GlideException;
import com.bumptech.glide.request.RequestListener;
import com.bumptech.glide.request.target.Target;
import com.google.android.material.bottomsheet.BottomSheetDialogFragment;
import com.ydcrackerpackages.R;

import java.util.ArrayList;
import java.util.List;

public class StickerSelectFragment extends BottomSheetDialogFragment {
    private List<Sticker> stickers = new ArrayList<>();
    private OnStickerPress onStickerPress;
    public StickerSelectFragment() {

    }
    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        int MAX_STICKERS = 73;
        for(int i = 1; i < MAX_STICKERS; i++){
            String base = "http://192.168.43.250/mobile/stickers/(";
            stickers.add(new Sticker(base + i + ").png"));
        }
    }

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.sticker_select_bs, container, false);
    }
    public void setOnStickerPressListener(OnStickerPress onStickerPress){
        this.onStickerPress = onStickerPress;
    }
    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        bindViews(view);
    }

    private void bindViews(View rootView){
        RecyclerView recyclerView = rootView.findViewById(R.id.stickers_rv);
        StickerAdapter stickerAdapter = new StickerAdapter(stickers, new StickerAdapter.StickerDelegate() {
            @Override
            public void loadSticker(Uri uri, ImageButton imageButton, ProgressBar bar) {
                Glide.with(getContext()).asBitmap().load(uri).addListener(new RequestListener<Bitmap>() {
                    @Override
                    public boolean onLoadFailed(@Nullable GlideException e, Object model, Target<Bitmap> target, boolean isFirstResource) {
                        bar.setVisibility(View.GONE);
                        return false;
                    }

                    @Override
                    public boolean onResourceReady(Bitmap resource, Object model, Target<Bitmap> target, DataSource dataSource, boolean isFirstResource) {
                        bar.setVisibility(View.GONE);
                        return false;
                    }
                }).into(imageButton);
            }
            @Override
            public void onStickerClick(Uri uri) {
                if(onStickerPress != null)onStickerPress.onClick(uri);
                dismiss();
            }
        });
        RecyclerView.LayoutManager manager = new GridLayoutManager(getContext(), 3);
        recyclerView.setLayoutManager(manager);
        recyclerView.addItemDecoration(new GridItemSpacingDecoration(3, Utils.dp2px(10), false));
        recyclerView.setAdapter(stickerAdapter);
    }


    public interface OnStickerPress {
        void onClick(Uri uri);
    }
}