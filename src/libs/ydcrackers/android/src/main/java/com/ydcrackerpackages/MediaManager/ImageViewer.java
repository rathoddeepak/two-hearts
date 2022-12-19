package com.ydcrackerpackages.MediaManager;

import android.animation.ValueAnimator;
import android.content.Context;
import android.net.Uri;
import android.util.Log;
import android.view.GestureDetector;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.view.animation.LinearInterpolator;
import android.widget.FrameLayout;
import androidx.viewpager2.widget.ViewPager2;

import com.davemorrissey.labs.subscaleview.SubsamplingScaleImageView;
import com.github.piasy.biv.loader.ImageLoader;
import com.github.piasy.biv.view.BigImageView;
import com.github.piasy.biv.view.GlideImageViewFactory;

import java.io.File;

public class ImageViewer extends FrameLayout {
    private GestureDetector gestureDetector;
    private BigImageView imageView;
    int DISMISS_THRESHOLD = 300;
    public float lastY = 0f;
    public boolean isSwiping = false;
    public boolean isFirst = true;
    public boolean imageLoaded = false;
    public boolean isCanceled = false;
    int index;
    private ViewPager2 mediaSlider;
    private PagerEventsListener mDListener;
    CircularProgress progressBar;

    public ImageViewer(Context context, ViewPager2 mediaSlider){
        super(context);        
        isSwiping = false;
        int deviceWidth = context.getResources().getDisplayMetrics().widthPixels;
        int deviceHeight = context.getResources().getDisplayMetrics().heightPixels;
        progressBar = new CircularProgress(context);
        progressBar.setLayoutParams(new ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
        progressBar.getLayoutParams().width = 200;
        progressBar.getLayoutParams().height = 200;
        progressBar.setSize(100);
        progressBar.setTranslationY(deviceHeight/2-100);
        progressBar.setTranslationX(deviceWidth/2-100);

        setLayoutParams(new FrameLayout.LayoutParams(FrameLayout.LayoutParams.MATCH_PARENT, FrameLayout.LayoutParams.MATCH_PARENT));
        gestureDetector = new GestureDetector(context, new GestureListener());
        imageView = new BigImageView(context);
        imageView.setLayoutParams(new ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
        imageView.setImageViewFactory(new GlideImageViewFactory());;
        imageView.setInitScaleType(BigImageView.INIT_SCALE_TYPE_CENTER);

        progressBar.setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View view) {
                if(isCanceled){
                    imageView.loadMainImageNow();
                    progressBar.setState(progressBar.START_DOWNLOADING);
                    isCanceled = false;
                }else{
                    imageView.cancel();
                    progressBar.setState(progressBar.CANCEL_DOWNLOADING);
                    isCanceled = true;
                }
            }
        });

        imageView.setImageLoaderCallback(new ImageLoader.Callback() {
            @Override
            public void onCacheHit(int imageType, File image) {
                imageLoaded = true;
                progressBar.abort();
                progressBar.setVisibility(View.GONE);
            }
            @Override
            public void onCacheMiss(int imageType, File image) {
                imageLoaded = false;
                progressBar.setState(progressBar.START_DOWNLOADING);
                progressBar.setVisibility(View.VISIBLE);
            }

            @Override
            public void onStart() {
                progressBar.setState(progressBar.SHOW_PROGRESS);
                progressBar.setProgress(3);

            }

            @Override
            public void onProgress(int progress) {
                progressBar.setProgress(progress);
            }

            @Override
            public void onFinish() {
                //progressBar.dismiss();
            }

            @Override
            public void onSuccess(File image) {
               imageLoaded = true;
               progressBar.dismiss();
               final SubsamplingScaleImageView view = imageView.getSSIV();

                if( view != null ){
                    view.setMinimumDpi(60);

                    view.setOnImageEventListener(new SubsamplingScaleImageView.OnImageEventListener() {
                        @Override
                        public void onReady() {

                        }

                        @Override
                        public void onImageLoaded() {
                            view.setDoubleTapZoomDpi(60);
                            view.setDoubleTapZoomDuration(200);
                            view.setDoubleTapZoomStyle(SubsamplingScaleImageView.ZOOM_FOCUS_FIXED);
                            view.setQuickScaleEnabled(false);
                        }

                        @Override
                        public void onPreviewLoadError(Exception e) {

                        }

                        @Override
                        public void onImageLoadError(Exception e) {

                        }

                        @Override
                        public void onTileLoadError(Exception e) {

                        }

                        @Override
                        public void onPreviewReleased() {

                        }
                    });
                }
            }

            @Override
            public void onFail(Exception error) {
               progressBar.dismiss();
            }
        });
        this.mediaSlider = mediaSlider;
        this.mediaSlider.registerOnPageChangeCallback(new ViewPager2.OnPageChangeCallback() {
            @Override
            public void onPageScrolled(int position, float positionOffset, int positionOffsetPixels) {
                super.onPageScrolled(position, positionOffset, positionOffsetPixels);
                if(isFirst){
                    isSwiping = false;
                    isFirst = false;
                }else{
                    isSwiping = true;
                }
            }

            @Override
            public void onPageSelected(int position) {
                super.onPageSelected(position);
                isSwiping = false;
                if(!imageLoaded){
                    imageView.loadMainImageNow();
                }
            }

            @Override
            public void onPageScrollStateChanged(int state) {
                super.onPageScrollStateChanged(state);
                isSwiping = false;
            }
        });

        addView(imageView);
        addView(progressBar);
    }
    public void setIndex(int index){
        this.index = index;
    }
    public void onDismiss(PagerEventsListener listener){
        mDListener = listener;
    }
    public ImageViewer(Context context){
        super(context);
    }
    public void showImage(String source){
        imageView.showImage(Uri.parse(source));
    }
    public void showImage(String thumbnail, String source){
        imageView.showImage(Uri.parse(thumbnail), Uri.parse(source));
    }
    @Override
    public boolean dispatchTouchEvent(MotionEvent event) {
        super.dispatchTouchEvent(event);
        if(event.getPointerCount() > 1 || isSwiping || !imageLoaded){
            return true;
        }else if(imageView.getSSIV() != null && imageView.getSSIV().getScale() >= imageView.getSSIV().getMinScale()+0.2f){
            Log.d("trail_e", imageView.getSSIV().getScale()+"  "+imageView.getSSIV().getMinScale());
            mediaSlider.setUserInputEnabled(false);
            return true;
        }else if(event.getAction() == MotionEvent.ACTION_UP){
            mediaSlider.setUserInputEnabled(true);
            if(Math.abs(imageView.getY()-lastY) > DISMISS_THRESHOLD){
                mDListener.onDismiss(imageView.getY(), index);
            }else{
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
            if(e1 == null || e2 == null){
                return false;
            }
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
