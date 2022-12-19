package com.ydcrackerpackages.MediaManager;

import android.animation.ValueAnimator;
import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Paint;
import android.graphics.RectF;
import android.view.MotionEvent;
import android.view.View;
import android.view.animation.BounceInterpolator;

public class SeekBar extends View {
    private RectF bitmapRect = new RectF();
    private Paint paint = new Paint();

    private double bufferedProgress = 0;
    private double progress = 0;
    private double thumbX = 22;
    private int thumbSize = 22;
    private boolean pressed = false;
    public float breakAt;
    public SeekBarListener seekBarListener;
    Context context;
    public SeekBar(Context context, SeekBarListener seekBarListener){
        super(context);
        this.context = context;
        this.seekBarListener = seekBarListener;
    }
    public SeekBar(Context context){
        super(context);
    }
    public void animateScrubber(int from, int to){
        ValueAnimator thumbAni;
        thumbAni = ValueAnimator.ofInt(from, to).setDuration(100);
        thumbAni.setInterpolator(new BounceInterpolator());
        thumbAni.addUpdateListener(new ValueAnimator.AnimatorUpdateListener() {
            @Override
            public void onAnimationUpdate(ValueAnimator valueAnimator) {
                thumbSize = (Integer) valueAnimator.getAnimatedValue();
                invalidate();
            }
        });
        thumbAni.start();
    }

    @Override
    public boolean onTouchEvent(MotionEvent event) {
        super.onTouchEvent(event);

        if(event.getPointerCount() > 1) {
            pressed = false;
            return false;
        }

        if(MotionEvent.ACTION_DOWN == event.getAction()){
            pressed = true;
            animateScrubber(22, 24);
            seekBarListener.onDown();
        }
        
        if(event.getX() > getMeasuredWidth()){
            progress = getMeasuredWidth() - 12;
        }else if(event.getX() < 12){
            progress = 12;
        }else{
            progress = (long) event.getX();
        }

        if(MotionEvent.ACTION_UP == event.getAction() || MotionEvent.ACTION_CANCEL == event.getAction()){
            pressed = false;
            animateScrubber(24, 22);
            double tempProgress = progress == 12 ? 0 : progress + 12;
            double percent = (tempProgress/getMeasuredWidth())*100;
            seekBarListener.onSeek(percent);
            performClick();
            seekBarListener.onUp();
        }

        thumbX = progress + 12;
        invalidate();
        return true;
    }

    @Override
    public boolean performClick() {
        super.performClick();
        return true;
    }
    public void setProgress(double val){
        if(!pressed){
            progress =  val <= 12 ? 12 :  val;
            thumbX = progress + 12;
            invalidate();
        }
    }
    public void setBufferedProgress(double progress){
        bufferedProgress = progress;
        invalidate();
    }
    @Override
    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);

        int background = 0xff5c5c5c;
        int buffered_progress = 0xffd5d0d7;
        int progressBar = 0xffffffff;
        int progressBarThumb = 0xffffffff;

        //Background
        paint.setColor(background);

        int height = 20;
        int bottom = 30;
        long allowed = getMeasuredWidth() - 24;
        bitmapRect.set(0, height, getMeasuredWidth(), bottom);
        canvas.drawRoundRect(bitmapRect, 10, 10 , paint);

        //ProgressBar
        paint.setColor(progressBar);
        bitmapRect.set(0, height, (float) progress, bottom);
        canvas.drawRoundRect(bitmapRect, 10, 10 , paint);

        //Buffered Progress
        paint.setColor(buffered_progress);
        bitmapRect.set(0, height, (float) bufferedProgress, bottom);
        canvas.drawRoundRect(bitmapRect, 10, 10 , paint);

        //thumb
        paint.setColor(progressBarThumb);
        long cx;
        if(thumbX > allowed){
            cx =  allowed;
        }else{
            cx =  (long) thumbX;
        }
        canvas.drawCircle(cx, 24, thumbSize, paint);

        breakAt = getMeasuredWidth() - 24;
    }

    public interface SeekBarListener {
        void  onSeek(double progress);
        void  onDown();
        void  onUp();
    }
}