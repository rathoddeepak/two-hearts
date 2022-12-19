package com.ydcrackerpackages.image;

import android.net.Uri;
import android.os.Build;
import android.os.Handler;
import androidx.annotation.Nullable;
import android.database.DataSetObserver;
import android.content.Context;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.util.TypedValue;
import android.view.View;
import android.view.Gravity;
import android.view.WindowManager;
import android.view.animation.Animation;
import android.view.animation.AccelerateDecelerateInterpolator;
import android.view.animation.Transformation;
import android.animation.ObjectAnimator;
import android.animation.ValueAnimator;
import android.animation.AnimatorSet;
import android.animation.Animator;
import android.animation.ArgbEvaluator;
import android.animation.AnimatorListenerAdapter;
import android.graphics.drawable.AnimatedVectorDrawable;
import android.graphics.drawable.Drawable;
import android.graphics.PixelFormat;
import android.graphics.Color;
import android.graphics.Bitmap;

import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.bridge.queue.MessageQueueThreadImpl;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.UiThreadUtil;

import com.bumptech.glide.Glide;
import com.bumptech.glide.load.DecodeFormat;
import com.bumptech.glide.request.RequestOptions;
import com.bumptech.glide.load.resource.drawable.DrawableTransitionOptions;
import com.ydcrackerpackages.MediaManager.DepthTransformation;
import com.ydcrackerpackages.MediaManager.MediaManagerAdapter;
import com.ydcrackerpackages.MediaManager.PagerEventsListener;
import com.ydcrackerpackages.MediaManager.MediaItem;
import com.ydcrackerpackages.image.HeaderNormalListener;
import com.github.piasy.biv.loader.ImageLoader;
import com.github.piasy.biv.loader.glide.GlideImageLoader;
import com.github.piasy.biv.view.GlideImageViewFactory;

import com.ydcrackerpackages.util.AndroidUtilities;
import com.ydcrackerpackages.R;

import java.io.File;
import java.util.HashMap;
import java.lang.Runnable;
import java.util.ArrayList;

import androidx.viewpager2.widget.ViewPager2;
import com.skydoves.powermenu.PowerMenuItem;
//import com.ydcrackerpackages.blurhash.BlurHashResourceDecoder;
//import com.ydcrackerpackages.blurhash.BlurHash;
import com.ydcrackerpackages.blurhash.BlurHashDecoder;
public class YdcImageManager extends ReactContextBaseJavaModule {

    public static ReactApplicationContext reactContext;
    
    private WindowManager wm;    
    private WindowManager.LayoutParams windowLayoutParams;      
    private MainMediaHolder mainMediaHolder;
    private ImageView transitionImage;
    private ViewPager2 mediaSlider;    
    private float dismissImagePos;
    private MediaManagerAdapter mediaManagerAdapter;    
    
    public static ArrayList<MediaItem> mediaObjects = new ArrayList<>();
    private MediaItem dismissImage;
    private HeaderCounter headerCounter;
    private HeaderMenu headerMenu;
    private MediaFooter mediaFooter;
    //public ViewerTopLayout viewerTop;
    //public LinearLayout viewerBottom;

    public int INITIAL = 0;
    public int TOTALASSETS = 0;
    public boolean IS_SELECTED = false;
    public int SELECTED_COUNT = 0;
    public String VIEWER_TYPE = "header_counter";
    public String LOAD_TYPE = "local";
    public ReadableArray MENU_ITEMS;
    public String FOOTER_TYPE = null;
    public ReadableMap MEDIA_FOOTER; 
    public boolean HAS_OIDX = false;
    public YdcImageManager(ReactApplicationContext context) {
        super(context);  
        reactContext = context;
        AndroidUtilities.getStatusBarHeight(context);
    }

    @Override
    public String getName() {
        return "ImageView";
    }

    @ReactMethod
    public void dispatchViewer(ReadableArray media){        
        int o_idx = 0;
        for(int i = 0; i < media.size(); i++){
            ReadableMap map = media.getMap(i);
            if(map.hasKey("o_idx")){
                HAS_OIDX = true;
                o_idx = map.getInt("o_idx");
            }            
            MediaItem item = new MediaItem(                                
                map.getInt("width"),
                map.getInt("height"),
                map.getInt("oWidth"),
                map.getInt("oHeight"),
                map.getString("source"),
                map.getString("thumbnail"),
                map.getInt("imageCenter"),
                map.getInt("imageCenter2"),
                map.getString("blurHash"),
                o_idx
            );
            mediaObjects.add(item);
        }              
    }

    @ReactMethod
    public void dispatchCords(int index, ReadableMap item){
       mediaObjects.get(index).setX(item.getDouble("x"));      
       mediaObjects.get(index).setY(item.getDouble("y"));
    }

    @ReactMethod
    public void cleanUp(){        
        mediaObjects.removeAll(mediaObjects);
        if(mediaManagerAdapter != null){
            mediaManagerAdapter.cleanUp();
        }
        VIEWER_TYPE = "header_counter";
        FOOTER_TYPE = null;
        INITIAL = 0;
        TOTALASSETS = 0;
        IS_SELECTED = false;
        SELECTED_COUNT = 0;
        MENU_ITEMS = null;
        MEDIA_FOOTER = null;
        HAS_OIDX = false;
        headerCounter = null; 
        headerMenu = null;
        mediaFooter = null;
    }
    
    @ReactMethod
    public void showLayout(int initial, ReadableMap config, ReadableMap item){        
        INITIAL = initial;
        mediaObjects.get(initial).setX(item.getDouble("x"));
        mediaObjects.get(initial).setY(item.getDouble("y"));
        if(config.hasKey("viewerType")){
            VIEWER_TYPE = config.getString("viewerType");
        }
        if(config.hasKey("loadType")){
            LOAD_TYPE = config.getString("loadType");
        }
        if(config.hasKey("totalAssets")){
            TOTALASSETS = config.getInt("totalAssets");
        }
        if(config.hasKey("isSelected")){
            IS_SELECTED = config.getBoolean("isSelected");
        }
        if(config.hasKey("selectedCount")){
            SELECTED_COUNT = config.getInt("selectedCount");
        }
        if(config.hasKey("menuItems")){
            MENU_ITEMS = config.getArray("menuItems");
        }
        if(config.hasKey("footerType")){
            FOOTER_TYPE = config.getString("footerType");
        }
        if(config.hasKey("footerConfig")){
            MEDIA_FOOTER = config.getMap("footerConfig");
        }
        UiThreadUtil.runOnUiThread(new Runnable() {
          @Override
          public void run() {
            showLayoutNative();
          }
        });       
    }
    public void showLayoutNative(){
        //ReadableMap viewerTopConfig = map.getMap("viewerTopConfig");

        dismissImage = mediaObjects.get(INITIAL);

        transitionImage = new ImageView(reactContext);
        transitionImage.setLayoutParams(new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.MATCH_PARENT));
        transitionImage.getLayoutParams().width = dismissImage.oWidth;        
        transitionImage.getLayoutParams().height = dismissImage.oHeight;
        transitionImage.setScaleType(ImageView.ScaleType.CENTER_CROP);
        if(LOAD_TYPE.equals("blur")){
            transitionImage.setImageBitmap(BlurHashDecoder.decode(dismissImage.blurHash, 20, 12, 1f));
        }else{
            Glide
             .with(reactContext)
             .asBitmap()             
             .load(dismissImage.source.endsWith(".mp4") ? dismissImage.thumbnail : dismissImage.source)             
             .apply(new RequestOptions().override(dismissImage.width/2, dismissImage.height/2))
             .into(transitionImage);
        }          
        windowLayoutParams = new WindowManager.LayoutParams();
        windowLayoutParams.height = WindowManager.LayoutParams.MATCH_PARENT;
        windowLayoutParams.format = PixelFormat.TRANSLUCENT;
        windowLayoutParams.width = WindowManager.LayoutParams.MATCH_PARENT;
        windowLayoutParams.gravity = Gravity.TOP | Gravity.LEFT;
        windowLayoutParams.type = WindowManager.LayoutParams.LAST_APPLICATION_WINDOW;
        windowLayoutParams.softInputMode = WindowManager.LayoutParams.SOFT_INPUT_ADJUST_PAN;        
        windowLayoutParams.flags = WindowManager.LayoutParams.FLAG_ALT_FOCUSABLE_IM;
        if (Build.VERSION.SDK_INT >= 21) {
            windowLayoutParams.flags |= WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN |
                    WindowManager.LayoutParams.FLAG_LAYOUT_INSET_DECOR |
                    WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS;
            if (Build.VERSION.SDK_INT >= 28) {
                windowLayoutParams.layoutInDisplayCutoutMode = WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_SHORT_EDGES;
            }
        }
        wm = (WindowManager) getCurrentActivity().getSystemService(Context.WINDOW_SERVICE);

        mainMediaHolder = new MainMediaHolder(reactContext);
        mediaSlider = new ViewPager2(reactContext);        
        mediaSlider.setPageTransformer(new DepthTransformation());        
        mediaManagerAdapter = new MediaManagerAdapter(reactContext, mediaObjects, mediaSlider);
        mediaManagerAdapter.registerMediaEventCallBacks(new PagerEventsListener(){
            @Override
            public void onDismiss(float position, int index) {               
               handleDismiss(position, index);
            }
        });
        if(FOOTER_TYPE != null){
            mediaManagerAdapter.shiftControllerUp(300);
        }
        mediaSlider.setAdapter(mediaManagerAdapter);
        mediaSlider.setCurrentItem(INITIAL, false);
        mediaSlider.setVisibility(View.INVISIBLE);
        mediaSlider.registerOnPageChangeCallback(new ViewPager2.OnPageChangeCallback() {
            @Override
            public void onPageSelected(int position) {
                INITIAL = position;
                super.onPageSelected(position);
                if(headerCounter != null){
                 headerCounter.setCurrent(position+1);
                }else if(headerMenu != null){
                 headerMenu.setCurrent(position+1);
                }
                WritableNativeMap currentPage = new WritableNativeMap();
                if(HAS_OIDX){
                    MediaItem currentObject = mediaObjects.get(position);
                    currentPage.putInt("o_idx", currentObject.o_idx);
                }                
                currentPage.putInt("position", position);                
                emitDeviceEvent("onPageChange", currentPage);
            }
        });
        mainMediaHolder.addView(mediaSlider);
        mainMediaHolder.addView(transitionImage);
        //Header Part
        if(VIEWER_TYPE.equals("header_counter")){
            headerCounter = new HeaderCounter(reactContext);
            headerCounter.setType(HeaderCounter.MULTI_SELECTION);
            headerCounter.setSelectedCount(SELECTED_COUNT);
            headerCounter.setCheckBoxChecked(IS_SELECTED);
            headerCounter.setVisibility(View.INVISIBLE);
            headerCounter.setPagination(INITIAL, TOTALASSETS);
            headerCounter.setOnAnyClickListener(new HeaderNormalListener() {
                    public void onMenuItemClick(int position, String clickedItem){
                        
                    }
                    public void onChecked(boolean bool){
                        IS_SELECTED = bool;
                        WritableNativeMap event = new WritableNativeMap();
                        event.putInt("pageIndex", INITIAL);
                        event.putBoolean("checked", bool);
                        emitDeviceEvent("onChecked", event);
                    }
                    public void onBackBtnPressListener(){
                        handleDismiss(0f, INITIAL);                    
                    }
            });
            mainMediaHolder.addView(headerCounter);
        }else if(VIEWER_TYPE.equals("header_menu")){
            headerMenu = new HeaderMenu(reactContext);
            headerMenu.setMenuItems(MENU_ITEMS);
            headerMenu.setVisibility(View.INVISIBLE);
            headerMenu.setPagination(INITIAL + 1, TOTALASSETS);
            headerMenu.setOnAnyClickListener(new HeaderNormalListener() {
                    public void onMenuItemClick(int position, String clickedItem){
                        WritableNativeMap event = new WritableNativeMap();
                        event.putInt("pageIndex", position);
                        event.putString("clickedItem", clickedItem);
                        if(HAS_OIDX){
                            MediaItem currentObject = mediaObjects.get(INITIAL);
                            event.putInt("o_idx", currentObject.o_idx);
                        }
                        emitDeviceEvent("onMenuItemPress", event);
                    }
                    public void onChecked(boolean bool){
                        
                    }
                    public void onBackBtnPressListener(){
                        handleDismiss(0f, INITIAL);
                    }
            });
            mainMediaHolder.addView(headerMenu);
        }
        if(FOOTER_TYPE != null){
            if(FOOTER_TYPE.equals("mediaFooter")){
                mediaFooter = new MediaFooter(reactContext);
                mediaFooter.setCaption(MEDIA_FOOTER.getString("caption"));
                mediaFooter.setTime(MEDIA_FOOTER.getString("time"));                
                mediaFooter.setVisibility(View.INVISIBLE);
                mediaFooter.setHeartState(MEDIA_FOOTER.getInt("heartState"), false);
                mediaFooter.setOnClickListener(new FooterNormalListener() {
                        public void onSubmit(String caption){
                           
                        }
                        public void onButtonPress(String btnName){
                            WritableNativeMap event = new WritableNativeMap();
                            event.putInt("pageIndex", INITIAL);
                            if(HAS_OIDX){
                                MediaItem currentObject = mediaObjects.get(INITIAL);
                                event.putInt("o_idx", currentObject.o_idx);
                            }
                            event.putString("button", btnName);
                            emitDeviceEvent("onMediaButtonPress", event);
                        }
                        public void onHeartPress(int state){
                            WritableNativeMap event = new WritableNativeMap();
                            event.putInt("pageIndex", INITIAL);
                            if(HAS_OIDX){
                                MediaItem currentObject = mediaObjects.get(INITIAL);
                                event.putInt("o_idx", currentObject.o_idx);
                            }
                            emitDeviceEvent("onHeartPress", event);
                        }
                });
                mainMediaHolder.addView(mediaFooter);
            }            
        }        
        
        wm.addView(mainMediaHolder, windowLayoutParams);
        showSharedForward();
    }

    void handleDismiss(float position, int index){
        transitionImage.setAlpha(1f);
        transitionImage.requestLayout();
        dismissImage = mediaObjects.get(index);
        if(LOAD_TYPE.equals("blur")){
            transitionImage.setImageBitmap(BlurHashDecoder.decode(dismissImage.blurHash, 20, 12, 1f));        
        }
        Glide
           .with(reactContext)           
           .load(dismissImage.source.endsWith(".mp4") ? dismissImage.thumbnail : dismissImage.source)
           .apply(new RequestOptions().override(dismissImage.width/2, dismissImage.height/2))
           .into(transitionImage);
           dismissImagePos = (float) (dismissImage.imageCenter2) + position;
           transitionImage.setY(dismissImagePos);           
           transitionImage.setVisibility(View.VISIBLE);
        Handler handler = new android.os.Handler();
        handler.postDelayed(new Runnable() {
            @Override
            public void run() {
                showSharedBack();
                mainMediaHolder.removeView(mediaSlider);
                emitDeviceEvent("onDismiss", null);
            }
        }, 150);
    }

    @ReactMethod
    public void dismiss(){
        UiThreadUtil.runOnUiThread(new Runnable() {
          @Override
          public void run() {
            handleDismiss(0f, INITIAL);
          }
        });        
    }

    private void showSharedForward(){
        int fromHeight = dismissImage.oHeight;
        int fromWidth = dismissImage.oWidth;

        int toWidth = dismissImage.width;
        int toHeight = dismissImage.height;

        float fromX = dismissImage.x;
        float fromY = dismissImage.y;
        
        int toX = 0;
        float toY = (float) dismissImage.imageCenter;
        
        int duration = 300;

        ValueAnimator width = ValueAnimator.ofInt(fromWidth, toWidth).setDuration(duration);
        ValueAnimator height = ValueAnimator.ofInt(fromHeight, toHeight).setDuration(duration);
        ObjectAnimator x = ObjectAnimator.ofFloat(transitionImage, "translationX", fromX, toX);
        ObjectAnimator y = ObjectAnimator.ofFloat(transitionImage, "translationY", fromY, toY);

        width.addUpdateListener(anim1 -> {                        
            transitionImage.getLayoutParams().width = (Integer) anim1.getAnimatedValue();
            transitionImage.requestLayout();
        });
        height.addUpdateListener(anim2 -> {
            transitionImage.getLayoutParams().height = (Integer) anim2.getAnimatedValue();
            transitionImage.requestLayout();
        });

        AnimatorSet animatorSet = new AnimatorSet();
        animatorSet.playTogether(width, height, x, y);
        animatorSet.setDuration(duration);
        animatorSet.setInterpolator(new AccelerateDecelerateInterpolator());
        animatorSet.start();
        animatorSet.addListener(new AnimatorListenerAdapter() {
            @Override
            public void onAnimationEnd(Animator animation) {
                mediaSlider.setVisibility(View.VISIBLE);
                if(VIEWER_TYPE.equals("header_counter")){
                    headerCounter.setVisibility(View.VISIBLE);
                }else if(VIEWER_TYPE.equals("header_menu")){
                    headerMenu.setVisibility(View.VISIBLE);
                }
                if(FOOTER_TYPE != null){
                    if(FOOTER_TYPE.equals("mediaFooter")){
                        mediaFooter.setVisibility(View.VISIBLE);
                    }
                }
                
                Handler handler = new android.os.Handler();
                handler.postDelayed(new Runnable() {
                    @Override
                    public void run() {
                        ValueAnimator alpha = ValueAnimator.ofFloat(1, 0).setDuration(duration);
                        alpha.addUpdateListener(anim1 -> {                        
                            transitionImage.setAlpha((Float) anim1.getAnimatedValue());
                            transitionImage.requestLayout();
                        });
                        alpha.addListener(new AnimatorListenerAdapter() {
                            @Override
                            public void onAnimationEnd(Animator animation) {
                                transitionImage.setVisibility(View.GONE);
                            }
                        });
                        alpha.start();                        
                    }
                }, 300);
               
                //viewerTop.setVisible();
            }
        });
    }
    private void showSharedBack(){
        int fromHeight = dismissImage.height;
        int fromWidth = dismissImage.width;
        int toWidth = dismissImage.oWidth;
        int toHeight = dismissImage.oHeight;
        int fromX = 0;
        float toX = dismissImage.x;
        float toY = dismissImage.y;
        int duration = 300;

        ValueAnimator width = ValueAnimator.ofInt(fromWidth, toWidth).setDuration(duration);
        ValueAnimator height = ValueAnimator.ofInt(fromHeight, toHeight).setDuration(duration);
        ObjectAnimator x = ObjectAnimator.ofFloat(transitionImage, "translationX", fromX, toX);
        ObjectAnimator y = ObjectAnimator.ofFloat(transitionImage, "translationY", dismissImagePos, toY);

        width.addUpdateListener(anim1 -> {                        
            transitionImage.getLayoutParams().width = (Integer) anim1.getAnimatedValue();
            transitionImage.requestLayout();
        });
        height.addUpdateListener(anim2 -> {
            transitionImage.getLayoutParams().height = (Integer) anim2.getAnimatedValue();
            transitionImage.requestLayout();
        });

        AnimatorSet animatorSet = new AnimatorSet();
        animatorSet.playTogether(width, height, x, y);
        animatorSet.setDuration(duration);
        animatorSet.setInterpolator(new AccelerateDecelerateInterpolator());
        animatorSet.start();

        animatorSet.addListener(new AnimatorListenerAdapter() {
            @Override
            public void onAnimationEnd(Animator animation) {                
                wm.removeView(mainMediaHolder);
            }
        });
    }

    @ReactMethod
    public void addPages(ReadableArray extraData){        
        mediaManagerAdapter.addPages(extraData);
    }

    //Header Counter Params
    @ReactMethod
    public void setHeaderPagination(int current, int total){
        UiThreadUtil.runOnUiThread(new Runnable() {
          @Override
          public void run() {
            switch(VIEWER_TYPE){
                case "header_counter":
                  headerCounter.setPagination(current, total);
                break;
                case "header_menu":
                  headerMenu.setPagination(current, total);
                break;
            }            
        }});
    }

    @ReactMethod
    public void setHeaderPagTotal(int total){
    UiThreadUtil.runOnUiThread(new Runnable() {
          @Override
          public void run() {  
            switch(VIEWER_TYPE){
                case "header_counter":
                headerCounter.setTotal(total);
                break;
                case "header_menu":
                headerMenu.setTotal(total);
                break;
            }
            
        }});
    }

    @ReactMethod
    public void setHeaderPagCurrent(int current){
        UiThreadUtil.runOnUiThread(new Runnable() {
          @Override
          public void run() { 
            switch(VIEWER_TYPE){
                case "header_counter":
                headerCounter.setCurrent(current);
                break;
                case "header_menu":
                headerMenu.setCurrent(current);
                break;
            }            
        }});
    }

    @ReactMethod
    public void setCheckBoxColor(ReadableMap map){
        UiThreadUtil.runOnUiThread(new Runnable() {
          @Override
          public void run() {
            headerCounter.setCheckBoxColor(map);
        }});
    }

    @ReactMethod
    public void setCheckBoxChecked(int num, boolean checked) {
        UiThreadUtil.runOnUiThread(new Runnable() {
          @Override
          public void run() {
            headerCounter.setCheckBoxChecked(num, checked);
        }});
    }

    @ReactMethod
    public void setCheckBoxChecked(boolean checked) {
        if(IS_SELECTED == checked){
            return;
        }
        IS_SELECTED = checked;        
        UiThreadUtil.runOnUiThread(new Runnable() {
          @Override
          public void run() {
            headerCounter.setCheckBoxChecked(checked);
        }});
    }

    @ReactMethod
    public void setCheckBoxNum(int num) {
        UiThreadUtil.runOnUiThread(new Runnable() {
          @Override
          public void run() {
            headerCounter.setCheckBoxNum(num);
        }});
    }

    @ReactMethod
    public void setHeaderCounterConfig(ReadableMap map){
    UiThreadUtil.runOnUiThread(new Runnable() {
          @Override
          public void run() {        
            if(map.hasKey("type")){
                switch (map.getString("type")) {
                    case "single":
                    headerCounter.setType(HeaderCounter.SINGLE_SELECTION);
                    break;
                    case "multiple":
                    headerCounter.setType(HeaderCounter.MULTI_SELECTION);
                    break;
                    default:
                        
                }
            }
        }});
    }

    @ReactMethod
    public void setSelectedCount(int num) {
        UiThreadUtil.runOnUiThread(new Runnable() {
          @Override
          public void run() {
            headerCounter.setSelectedCount(num);
        }});
    }

    @ReactMethod
    public void increaseCount() {
        UiThreadUtil.runOnUiThread(new Runnable() {
          @Override
          public void run() {
            headerCounter.increaseCount();
        }});
    }

    @ReactMethod
    public void decreaseCount() {
        UiThreadUtil.runOnUiThread(new Runnable() {
          @Override
          public void run() {
            headerCounter.decreaseCount();
        }});
    }

    //HeaderMenu Params
    @ReactMethod
    public void setMenuItems(ReadableArray items) {
        UiThreadUtil.runOnUiThread(new Runnable() {
          @Override
          public void run() {
            headerMenu.setMenuItems(items);
        }});
    }
    
    //Media Footer Params
    @ReactMethod
    public void setCaption(String title){
        UiThreadUtil.runOnUiThread(new Runnable() {
          @Override
          public void run() {
            mediaFooter.setCaption(title);
        }});
    }

    @ReactMethod
    public void setTime(String time){
        UiThreadUtil.runOnUiThread(new Runnable() {
          @Override
          public void run() {
            mediaFooter.setTime(time);
        }});
    }

    @ReactMethod
    public void setCommentCount(int count){
        UiThreadUtil.runOnUiThread(new Runnable() {
          @Override
          public void run() {
            mediaFooter.setCommentCount(count);
        }});
    }

    @ReactMethod
    public void setHeartState(int state, boolean addBounce){
        UiThreadUtil.runOnUiThread(new Runnable() {
          @Override
          public void run() {
            mediaFooter.setHeartState(state, addBounce);
          }
        });
    }
    
    public class MainMediaHolder extends FrameLayout {
        MainMediaHolder(Context context){
            super(context);
            setLayoutParams(new FrameLayout.LayoutParams(FrameLayout.LayoutParams.MATCH_PARENT, FrameLayout.LayoutParams.MATCH_PARENT));
            setBackgroundColor(Color.BLACK);
        }
    }

    private static void emitDeviceEvent(String eventName, @Nullable WritableMap eventData ){
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, eventData);
    }
}