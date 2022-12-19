package com.ydcrackerpackages.MediaManager;

import android.animation.ValueAnimator;
import android.content.Context;
import android.graphics.drawable.Animatable;
import android.net.Uri;
import android.os.SystemClock;
import android.view.GestureDetector;
import android.view.Gravity;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.view.animation.LinearInterpolator;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;

import androidx.vectordrawable.graphics.drawable.AnimatedVectorDrawableCompat;

import com.danikula.videocache.HttpProxyCacheServer;
import com.ydcrackerpackages.R;
import com.google.android.exoplayer2.Player;
import com.google.android.exoplayer2.SimpleExoPlayer;
import com.google.android.exoplayer2.source.MediaSource;
import com.google.android.exoplayer2.source.ProgressiveMediaSource;
import com.google.android.exoplayer2.source.ExtractorMediaSource;
import com.google.android.exoplayer2.trackselection.DefaultTrackSelector;
import com.google.android.exoplayer2.ui.PlayerView;
import com.google.android.exoplayer2.upstream.DataSource;
import com.google.android.exoplayer2.upstream.DefaultDataSourceFactory;

public class VideoPlayer extends FrameLayout {
    private Context context;
    private PlayerView playerView;
    private RadialProgress radialProgress;
    private boolean playWhenReady = true;
    private int currentWindow = 0;
    private long playbackPosition = 0;
    private boolean isStreamable = false;
    private QuickTimer quickTimer;
    private long lastTapTime = -1;
    private String url;
    private PagerEventsListener2 mDListener;
    public SimpleExoPlayer player;
    public float initial = 0f;
    public float lastY = 0f;
    private GestureDetector gestureDetector;
    private static final long DOUBLE_CLICK_TIME_DELTA = 300;
    long lastClickTime = 0;
    public VideoPlayer(Context context, String url){
        super(context);
        this.context = context;
        gestureDetector = new GestureDetector(context, new GestureListener());
        RelativeLayout.LayoutParams mainParams = new RelativeLayout.LayoutParams(RelativeLayout.LayoutParams.MATCH_PARENT, RelativeLayout.LayoutParams.MATCH_PARENT);
        mainParams.addRule(RelativeLayout.CENTER_HORIZONTAL|RelativeLayout.CENTER_VERTICAL);
        setLayoutParams(mainParams);

        playerView = new PlayerView(context);
        playerView.setUseController(false);
        playerView.setLayoutParams(new FrameLayout.LayoutParams(FrameLayout.LayoutParams.MATCH_PARENT, FrameLayout.LayoutParams.MATCH_PARENT));

        LinearLayout progressContainer = new LinearLayout(context);
        progressContainer.setLayoutParams(new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.MATCH_PARENT));
        progressContainer.setGravity(Gravity.CENTER_VERTICAL|Gravity.CENTER_HORIZONTAL);


        radialProgress = new RadialProgress(context, 100, "#ffffff");
        radialProgress.setLayoutParams(new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.MATCH_PARENT));
        radialProgress.getLayoutParams().width = 114;
        radialProgress.getLayoutParams().height = 114;
        radialProgress.setVisibility(View.INVISIBLE);

        quickTimer = new QuickTimer(context);

        progressContainer.addView(radialProgress);

        addView(playerView);
        addView(progressContainer);


        addView(quickTimer);


        this.url = url;
        if(url.endsWith("hls") || url.endsWith("ss") || url.endsWith("dash") || url.endsWith("m3u8")){
            isStreamable = true;
        }

    }

    public VideoPlayer(Context context){
        super(context);
    }


    @Override
    public boolean onTouchEvent(MotionEvent event) {
        super.onTouchEvent(event);
        if(event.getPointerCount() > 1){
            return true;
        }if(event.getAction() == MotionEvent.ACTION_UP){
            mDListener.setUserInputEnabled(true);
            if(Math.abs(playerView.getY()-lastY) > 300){
                pause();
                mDListener.onDismiss(playerView.getY(), playerView.getMeasuredHeight());
            }else{
                ValueAnimator setVidBack = ValueAnimator.ofFloat(getY(), lastY);
                setVidBack.setDuration(300);
                setVidBack.setInterpolator(new LinearInterpolator());
                setVidBack.addUpdateListener(new ValueAnimator.AnimatorUpdateListener() {
                    @Override
                    public void onAnimationUpdate(ValueAnimator valueAnimator) {
                        Float value = (Float) valueAnimator.getAnimatedValue();
                        playerView.setY(value);
                    }
                });
                setVidBack.start();
            }
            performClick();
            return false;
        }
        return gestureDetector.onTouchEvent(event);
    }

    public class GestureListener extends GestureDetector.SimpleOnGestureListener {
        @Override
        public boolean onDown(MotionEvent e) {
            lastY = playerView.getY();

            long clickTime = System.currentTimeMillis();
            if (clickTime - lastClickTime < DOUBLE_CLICK_TIME_DELTA){
                if(e.getX()  > (float) quickTimer.getWidth()/2){
                    long inc = player.getCurrentPosition()+10000;
                    if(inc < player.getDuration()){
                        player.seekTo(inc);                        
                    }
                    quickTimer.animateForward();
                }else{
                    long inc = player.getCurrentPosition()-10000;
                    if(10000 < inc){
                        player.seekTo(inc);                        
                    }
                    quickTimer.animateReverse();
                }
                lastClickTime = 0;
            }
            lastClickTime = clickTime;

            return true;
        }
        @Override
        public boolean onScroll(MotionEvent e1, MotionEvent e2, float velocityX, float velocityY) {
            float angle = (float) Math.toDegrees(Math.atan2(e1.getY() - e2.getY(), e2.getX() - e1.getX()));
            /*if (angle > -45 && angle <= 45) {
                Log.d("DEBUG_TAG", "Right to Left swipe performed");
                return false;
            }

            if (angle >= 135 && angle < 180 || angle < -135 && angle > -180) {
                Log.d("DEBUG_TAG", "Left to Right swipe performed");
                return true;
            }*/
            if (angle < -45 && angle >= -135) {
                playerView.setY(playerView.getY()-velocityY);
                mDListener.setUserInputEnabled(false);
                return false;
            }
            if (angle > 45 && angle <= 135) {
                playerView.setY(playerView.getY()-velocityY);
                mDListener.setUserInputEnabled(false);
                return false;
            }

            return false;
        }
    }

    @Override
    public boolean performClick() {
        super.performClick();
        return true;
    }

    public void initializePlayer() {
        MediaSource mediaSource;
        if(url.startsWith("file://")){
            mediaSource = buildLocalMediaSource(url);
        }else{
            mediaSource = buildMediaSource(url);
        }        
        DefaultTrackSelector trackSelector = new DefaultTrackSelector(context);
        trackSelector.setParameters(trackSelector.buildUponParameters().setMaxVideoSizeSd());
        if(isStreamable){
            player = new SimpleExoPlayer.Builder(context)
                    .setTrackSelector(trackSelector)
                    .build();
        }else{
            player = new SimpleExoPlayer.Builder(context).build();
        }
        playerView.setPlayer(player);
        player.setRepeatMode(Player.REPEAT_MODE_ONE);
        playerView.setUseController(false);
        player.setPlayWhenReady(playWhenReady);
        player.seekTo(currentWindow, playbackPosition);
        player.prepare(mediaSource, false, false);
    }

    public boolean togglePlay(){
        if(player != null){
            if(player.isPlaying()){
                player.setPlayWhenReady(false);
                return true;
            }else{
                player.setPlayWhenReady(true);
                return false;
            }
        }
        return false;
    }
    public void pause(){
        if(player != null) {
            player.setPlayWhenReady(false);
        }
    }
    public void seekTo(long to){
        if(player != null){
            player.seekTo(to);
        }
    }
    public void onBuffer(){
        if(player.isLoading() && player.getBufferedPosition() <= player.getContentPosition()){
            radialProgress.setVisibility(View.VISIBLE);
        }else{
            radialProgress.setVisibility(View.INVISIBLE);
        }
    }
    public long getDuration(){
        return player.getDuration();
    }
    public long getBufferedPosition(){
        return player.getBufferedPosition();
    }
    public long getCurrentPosition(){
        return player.getCurrentPosition();
    }
    private MediaSource buildMediaSource(String url) {
        HttpProxyCacheServer proxyServer = new HttpProxyCacheServer.Builder(context).maxCacheSize(1024 * 1024 * 1024).build();
        String proxyURL = proxyServer.getProxyUrl(url);
        DataSource.Factory dataSourceFactory = new DefaultDataSourceFactory(context, "exoplayer-codelab");
        return new ProgressiveMediaSource.Factory(dataSourceFactory).createMediaSource(Uri.parse(proxyURL));
    }
    private MediaSource buildLocalMediaSource(String url) {
        return new ExtractorMediaSource.Factory(new DefaultDataSourceFactory(context,"Exoplayer-local")).createMediaSource(Uri.parse(url));
    }
    public int getPybackState(){
        if(player == null){
            return -6;
        }
        return player.getPlaybackState();
    }
    public void addListener(Player.EventListener listener){
        player.addListener(listener);
    }
    public void addDismissListener(PagerEventsListener2 listener){
        mDListener = listener;
    }
    public void removeListener(Player.EventListener listener){
        player.removeListener(listener);
    }
    public void releasePlayer() {
        if (player != null) {
            playWhenReady = player.getPlayWhenReady();
            playbackPosition = player.getCurrentPosition();
            currentWindow = player.getCurrentWindowIndex();
            player.release();
            player = null;
        }
    }
    public class QuickTimer extends LinearLayout {
        private ImageView animatedImage;
        private ImageView animatedImage2;
        public QuickTimer(Context context){
           super(context);
           int width = context.getResources().getDisplayMetrics().widthPixels / 2;
           setLayoutParams(new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.MATCH_PARENT));
           setOrientation(LinearLayout.HORIZONTAL);

           LinearLayout leftPart = new LinearLayout(context);
            leftPart.setLayoutParams(new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.MATCH_PARENT));
            leftPart.setGravity(Gravity.CENTER_VERTICAL|Gravity.CENTER_HORIZONTAL);
            leftPart.getLayoutParams().width = width;
            animatedImage = new ImageView(context);
            animatedImage.setLayoutParams(new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.MATCH_PARENT));
            animatedImage.getLayoutParams().width = 200;
            animatedImage.getLayoutParams().height = 200;
            animatedImage.setRotation(180);
            leftPart.addView(animatedImage);

            LinearLayout rightPart = new LinearLayout(context);
            rightPart.setLayoutParams(new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.MATCH_PARENT));
            rightPart.setGravity(Gravity.CENTER_VERTICAL|Gravity.CENTER_HORIZONTAL);
            rightPart.getLayoutParams().width = width;
            animatedImage2 = new ImageView(context);
            animatedImage2.setLayoutParams(new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.MATCH_PARENT));
            animatedImage2.getLayoutParams().width = 200;
            animatedImage2.getLayoutParams().height = 200;
            rightPart.addView(animatedImage2);

            addView(leftPart);
            addView(rightPart);
        }

        public void animateReverse(){
            AnimatedVectorDrawableCompat compact =  AnimatedVectorDrawableCompat.create(context, R.drawable.avd_video_fr);
            animatedImage.setImageDrawable(compact);
            Animatable leftAnimator = (Animatable) animatedImage.getDrawable();
            leftAnimator.start();
        }

        public void animateForward(){
            AnimatedVectorDrawableCompat compact =  AnimatedVectorDrawableCompat.create(context, R.drawable.avd_video_fr);
            animatedImage2.setImageDrawable(compact);
            Animatable rightAnimator = (Animatable) animatedImage2.getDrawable();
            rightAnimator.start();
        }
    }
}
