package com.ydcrackerpackages.MediaManager;


import android.animation.ValueAnimator;
import android.content.Context;
import android.graphics.Color;
import android.graphics.drawable.GradientDrawable;
import android.net.Uri;
import android.os.Handler;
import android.widget.ImageView;
import android.os.SystemClock;
import android.util.Log;
import android.view.GestureDetector;
import android.view.MotionEvent;
import android.view.View;
import android.view.Gravity;
import android.view.animation.LinearInterpolator;
import android.widget.FrameLayout;
import android.widget.LinearLayout;
import android.widget.ImageButton;
import android.widget.RelativeLayout;

import androidx.viewpager2.widget.ViewPager2;

import com.ydcrackerpackages.R;
import com.bumptech.glide.Glide;
import com.bumptech.glide.request.RequestOptions;
import com.google.android.exoplayer2.ExoPlaybackException;
import com.google.android.exoplayer2.PlaybackParameters;
import com.google.android.exoplayer2.Player;
import com.google.android.exoplayer2.Timeline;
import com.google.android.exoplayer2.source.TrackGroupArray;
import com.google.android.exoplayer2.trackselection.TrackSelectionArray;

public class VideoContainer extends RelativeLayout {
    private VideoPlayer videoPlayer;
    private VideoController seekBar;
    int DISMISS_THRESHOLD = 300;
    private Context context;
    private ViewPager2 mediaSlider;
    private VideoImage videoImage;
    private PagerEventsListener mDListener;
    private Handler handler = new Handler();
    private boolean lostFocus = false;
    private boolean initialized;
    private boolean dragging = false;
    public boolean isSwiping = false;
    public int itemIndex;
    public String source;
    public String thumbnail;
    public int bottomMargin = 0;
    public VideoContainer(Context context, final ViewPager2 mediaSlider, int bottomMargin) {
        super(context);        
        this.context = context;
        this.mediaSlider = mediaSlider;
        this.bottomMargin = bottomMargin;
        mediaSlider.registerOnPageChangeCallback(new ViewPager2.OnPageChangeCallback() {
            @Override
            public void onPageScrolled(int position, float positionOffset, int positionOffsetPixels) {
                super.onPageScrolled(position, positionOffset, positionOffsetPixels);
                isSwiping = true;
            }

            @Override
            public void onPageSelected(int position) {
                super.onPageSelected(position);
                isSwiping = false;
                if(itemIndex != position && initialized){
                    videoPlayer.pause();
                    seekBar.togglePlay(false);
                    handler.removeCallbacks(updateProgressAction);
                    videoPlayer.releasePlayer();
                    removeAllViews();
                    lostFocus = true;
                    initialized = false;
                }else if(lostFocus && itemIndex == position){
                   addView(videoImage);
                   lostFocus = false;
                }
            }

            @Override
            public void onPageScrollStateChanged(int state) {
                super.onPageScrollStateChanged(state);
                isSwiping = false;
            }
        });
        setLayoutParams(new RelativeLayout.LayoutParams(RelativeLayout.LayoutParams.MATCH_PARENT, RelativeLayout.LayoutParams.MATCH_PARENT));
        setBackgroundColor(Color.parseColor("black"));

        videoImage = new VideoImage(context, new OnClickListener() {
            @Override
            public void onClick(View view) {
                dispatchVideoPlayer(source);
            }
        });

        addView(videoImage);
    }
    public void setItem(String thumbnail, final String source, int itemIndex){
        this.thumbnail = thumbnail;
        this.source = source;
        this.itemIndex = itemIndex;
        videoImage.showImage(thumbnail);
    }
    public void onDismiss(PagerEventsListener listener){
        mDListener = listener;
    }
    void dispatchVideoPlayer(String source){
        removeView(videoImage);
        videoPlayer = new VideoPlayer(context, source);

        videoPlayer.initializePlayer();
        seekBar = new VideoController(context, new SeekBar.SeekBarListener() {
            @Override
            public void onSeek(double progressPercent) {
                long time = (videoPlayer.getDuration()*((long)progressPercent))/100;
                dragging = true;
                videoPlayer.seekTo(time);
            }

            @Override
            public void onDown() {
                mediaSlider.setUserInputEnabled(false);
            }

            @Override
            public void onUp() {
                mediaSlider.setUserInputEnabled(true);
            }
        }, bottomMargin);
        videoPlayer.addListener(new Player.EventListener() {
            @Override
            public void onTimelineChanged(Timeline timeline, int reason) {

            }

            @Override
            public void onTracksChanged(TrackGroupArray trackGroups, TrackSelectionArray trackSelections) {

            }

            @Override
            public void onLoadingChanged(boolean isLoading) {

            }

            @Override
            public void onPlayerStateChanged(boolean playWhenReady, int playbackState) {
                initialized = true;
                updateProgressBar();
            }

            @Override
            public void onPlaybackSuppressionReasonChanged(int playbackSuppressionReason) {

            }

            @Override
            public void onIsPlayingChanged(boolean isPlaying) {

            }

            @Override
            public void onRepeatModeChanged(int repeatMode) {

            }

            @Override
            public void onShuffleModeEnabledChanged(boolean shuffleModeEnabled) {

            }

            @Override
            public void onPlayerError(ExoPlaybackException error) {

            }

            @Override
            public void onPositionDiscontinuity(int reason) {

            }

            @Override
            public void onPlaybackParametersChanged(PlaybackParameters playbackParameters) {

            }

            @Override
            public void onSeekProcessed() {
                dragging = false;
            }
        });
        videoPlayer.addDismissListener(new PagerEventsListener2() {
            @Override
            public void onDismiss(float position, float height) {
                mDListener.onDismiss(position, itemIndex);
            }

            @Override
            public void setUserInputEnabled(boolean bool) {
                mediaSlider.setUserInputEnabled(bool);
            }
        });
        seekBar.addClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                seekBar.togglePlay(!videoPlayer.togglePlay());
            }
        });
        addView(videoPlayer);
        addView(seekBar);
    }
    private void updateProgressBar() {
        long duration = videoPlayer == null ? 0 : videoPlayer.getDuration();
        long position = videoPlayer == null ? 0 : videoPlayer.getCurrentPosition();
        if (!dragging) {
            seekBar.setProgress(position,duration);
            seekBar.setCurrentTime(position,duration);
            videoPlayer.onBuffer();
        }
        long bufferedPosition = videoPlayer == null ? 0 : videoPlayer.getBufferedPosition();
        seekBar.setBufferedProgress(bufferedPosition, duration);
        // Remove scheduled updates.
        handler.removeCallbacks(updateProgressAction);
        // Schedule an update if necessary.
        int playbackState = videoPlayer.getPybackState() == -1 ? Player.STATE_IDLE : videoPlayer.getPybackState();
        if (playbackState != Player.STATE_IDLE && playbackState != Player.STATE_ENDED) {
            /*
            long delayMs;
            if (videoPlayer.getPlayWhenReady() && playbackState == Player.STATE_READY) {
                delayMs = 1000 - (position % 1000);
                if (delayMs < 200) {
                    delayMs += 1000;
                }
            } else {
                delayMs = 1000;
            }
            */
            handler.postDelayed(updateProgressAction, 1000);
        }
    }
    public class VideoImage extends FrameLayout {
        private float lastY = 0f;
        private GestureDetector gestureDetector;
        private ImageView imageView;
        private LinearLayout imageButtonContainer;
        public VideoImage(Context context, View.OnClickListener listener){
            super(context);
            setLayoutParams(new FrameLayout.LayoutParams(FrameLayout.LayoutParams.MATCH_PARENT, FrameLayout.LayoutParams.MATCH_PARENT));
            gestureDetector = new GestureDetector(context, new GestureListener());
            float buttonX = context.getResources().getDisplayMetrics().widthPixels/2 - 50;
            float buttonY = context.getResources().getDisplayMetrics().heightPixels/2 - 50;

            imageView = new ImageView(context);            
            imageView.setLayoutParams(new FrameLayout.LayoutParams(FrameLayout.LayoutParams.MATCH_PARENT, FrameLayout.LayoutParams.MATCH_PARENT) );            

            GradientDrawable shape = new GradientDrawable();
            shape.setShape(GradientDrawable.RECTANGLE);
            shape.setColor(Color.argb(120, 0, 0,0));
            shape.setCornerRadius(100);

            imageButtonContainer = new LinearLayout(context);
            imageButtonContainer.setBackground(shape);
            imageButtonContainer.setLayoutParams(new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.MATCH_PARENT));
            imageButtonContainer.setX(buttonX);
            imageButtonContainer.setY(buttonY);
            imageButtonContainer.getLayoutParams().width = 170;            
            imageButtonContainer.getLayoutParams().height = 170;
            imageButtonContainer.setGravity(Gravity.CENTER_HORIZONTAL|Gravity.CENTER_VERTICAL);

            ImageButton imageButton = new ImageButton(context);            
            imageButton.setImageResource(R.drawable.pl_play);
            imageButton.setLayoutParams(new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.MATCH_PARENT));
            imageButton.getLayoutParams().width = 90;
            imageButton.getLayoutParams().height = 90;            
            imageButton.setOnClickListener(listener);
            imageButton.setBackgroundColor(Color.TRANSPARENT);
            imageButtonContainer.addView(imageButton);

            addView(imageView);
            addView(imageButtonContainer);
        }
        public void showImage(String imageUrl){
            Glide
             .with(context)
             .asBitmap()         
             .load(imageUrl)
             .apply(new RequestOptions().fitCenter())
             .into(imageView);            
        }
        @Override
        public boolean dispatchTouchEvent(MotionEvent event) {
            super.dispatchTouchEvent(event);
            if(event.getPointerCount() > 1 || isSwiping){
                imageButtonContainer.setAlpha(1f);
                return true;
            }
            if(event.getAction() == MotionEvent.ACTION_UP || event.getAction() == MotionEvent.ACTION_CANCEL ){
                mediaSlider.setUserInputEnabled(true);
                if(Math.abs(imageView.getY()-lastY) > DISMISS_THRESHOLD){
                    mDListener.onDismiss(imageView.getY(), itemIndex);
                }else{
                    imageButtonContainer.setAlpha(1f);
                    ValueAnimator setVidBack = ValueAnimator.ofFloat(imageView.getY(), lastY);
                    setVidBack.setDuration(300);
                    setVidBack.setInterpolator(new LinearInterpolator());
                    setVidBack.addUpdateListener(new ValueAnimator.AnimatorUpdateListener() {
                        @Override
                        public void onAnimationUpdate(ValueAnimator valueAnimator) {
                            Float value = (Float) valueAnimator.getAnimatedValue();
                            imageView.setY(value);
                        }
                    });
                    setVidBack.start();
                }
                return false;
            }
            return gestureDetector.onTouchEvent(event);
        }
        public class GestureListener extends GestureDetector.SimpleOnGestureListener {
            @Override
            public boolean onDown(MotionEvent e) {                
                lastY = imageView.getY();
                return true;
            }
            @Override
            public boolean onScroll(MotionEvent e1, MotionEvent e2, float velocityX, float velocityY) {
                imageButtonContainer.setAlpha(0f);
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
                    imageView.setY(imageView.getY()-velocityY);
                    mediaSlider.setUserInputEnabled(false);
                    return false;
                }
                if (angle > 45 && angle <= 135) {
                    imageView.setY(imageView.getY()-velocityY);
                    mediaSlider.setUserInputEnabled(false);
                    return false;
                }

                return false;
            }
        }
    }
    private final Runnable updateProgressAction = new Runnable() {
        @Override
        public void run() {
            updateProgressBar();
        }
    };
}
