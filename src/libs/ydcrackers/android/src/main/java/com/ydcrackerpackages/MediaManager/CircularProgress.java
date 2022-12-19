package com.ydcrackerpackages.MediaManager;

import android.animation.Animator;
import android.animation.AnimatorSet;
import android.animation.ValueAnimator;
import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.RectF;
import android.view.View;
import android.view.animation.LinearInterpolator;

import androidx.interpolator.view.animation.LinearOutSlowInInterpolator;

public class CircularProgress extends View {
    private RectF oval;

    private Paint paint;
    private Paint circlePaint;
    private int size;
    private int initial = 0 ;
    private int progress;
    int mProgress;
    int lineAnimator = 40;
    int fiftyAni = 0;
    int twentyFiveAni = 0;

    public final int START_DOWNLOADING = 1;
    public final int CANCEL_DOWNLOADING = 2;
    public final int SHOW_PROGRESS = 3;

    int currentProgress = 3;
    public CircularProgress(Context context){
        super(context);
        oval = new RectF();
        paint = new Paint();
        circlePaint = new Paint();
        paint.setAntiAlias(true);
        paint.setColor(Color.WHITE);
        paint.setStyle(Paint.Style.STROKE);
        paint.setStrokeWidth(10);
        paint.setStrokeCap(Paint.Cap.ROUND);

        circlePaint.setAntiAlias(true);
        circlePaint.setColor(Color.BLACK);
        circlePaint.setAlpha(50);
        circlePaint.setStyle(Paint.Style.FILL);


    }
    void setSize(int size){
        this.size = size;
    }
    public void setProgress(int percent){
        mProgress = 360*percent/100;
    }
    void setState(int state){
        if(currentProgress != state){
            switch (state){
                case START_DOWNLOADING:
                    currentProgress = START_DOWNLOADING;
                    animateCancel();
                    break;
                case CANCEL_DOWNLOADING:
                    animateDown();
                    currentProgress = CANCEL_DOWNLOADING;
                    setProgress(3);
                    break;

            }
        }

    }
    void updateProgress(){
        if(initial >= 360){
            initial = 0;
        }
        if(progress <= mProgress){
            progress += 3;
        }
        initial += 2;
        if(progress <= 360){
            invalidate();
        }else {
            dismiss();
        }
    }
    void abort(){
        progress = 361;
    }
    void dismiss(){
        if(progress <= 360){
        ValueAnimator animator = ValueAnimator.ofFloat(1, 0);
        animator.setDuration(300);
        animator.addUpdateListener(new ValueAnimator.AnimatorUpdateListener() {
            @Override
            public void onAnimationUpdate(ValueAnimator valueAnimator) {
                Float value = (Float) valueAnimator.getAnimatedValue();
                setAlpha(value);
            }
        });
        animator.addListener(new Animator.AnimatorListener() {
            @Override
            public void onAnimationStart(Animator animator) { }

            @Override
            public void onAnimationEnd(Animator animator) { setVisibility(View.GONE); }

            @Override
            public void onAnimationCancel(Animator animator) { }

            @Override
            public void onAnimationRepeat(Animator animator) { }
        });
        animator.start();
        }
    }
    void animateCancel(){
        ValueAnimator animator2 = ValueAnimator.ofInt(0, 40);
        animator2.setDuration(400);
        animator2.setInterpolator(new LinearOutSlowInInterpolator());
        animator2.addUpdateListener(new ValueAnimator.AnimatorUpdateListener() {
            @Override
            public void onAnimationUpdate(ValueAnimator valueAnimator) {
                lineAnimator = (Integer) valueAnimator.getAnimatedValue();
                invalidate();
            }
        });
        animator2.addListener(new Animator.AnimatorListener() {
            @Override
            public void onAnimationStart(Animator animator) {

            }

            @Override
            public void onAnimationEnd(Animator animator) {
                setProgress(3);
                currentProgress = SHOW_PROGRESS;
                updateProgress();
            }

            @Override
            public void onAnimationCancel(Animator animator) {

            }

            @Override
            public void onAnimationRepeat(Animator animator) {

            }
        });
        animator2.start();
    }
    void animateDown(){
        AnimatorSet animatorSet = new AnimatorSet();
        ValueAnimator fifty = ValueAnimator.ofInt(0, 50);
        fifty.addUpdateListener(new ValueAnimator.AnimatorUpdateListener() {
            @Override
            public void onAnimationUpdate(ValueAnimator valueAnimator) {
                fiftyAni = (Integer) valueAnimator.getAnimatedValue();
                invalidate();
            }
        });
        ValueAnimator twentyFive = ValueAnimator.ofInt(0, 30);
        twentyFive.addUpdateListener(new ValueAnimator.AnimatorUpdateListener() {
            @Override
            public void onAnimationUpdate(ValueAnimator valueAnimator) {
                twentyFiveAni = (Integer) valueAnimator.getAnimatedValue();
                invalidate();
            }
        });
        animatorSet.setDuration(250);
        animatorSet.setInterpolator(new LinearInterpolator());
        animatorSet.playTogether(twentyFive, fifty);
        animatorSet.start();
    }
    @Override
    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);
        int x = (getMeasuredWidth() - size) / 2; //Finding Center of View
        int y = (getMeasuredHeight() - size) / 2; //Finding Center of View
        oval.set(x, y, x + size, y + size);
        canvas.drawCircle(getMeasuredWidth()/2, getMeasuredHeight()/2, 60, circlePaint);
        switch (currentProgress){
            case SHOW_PROGRESS:
                canvas.drawArc(oval, initial, progress, false, paint);
                canvas.drawLine(80, 80, 80 + lineAnimator, 80 + lineAnimator, paint);
                canvas.drawLine(120, 80, 120 - lineAnimator, 80 + lineAnimator, paint);
                canvas.drawLine(120, 80, 120 - lineAnimator, 80 + lineAnimator, paint);
                updateProgress();
                break;
            case CANCEL_DOWNLOADING:
                canvas.drawLine(100, 70, 100, 70 + fiftyAni, paint);
                canvas.drawLine(100, 130, 100 - twentyFiveAni, 130 - twentyFiveAni, paint);
                canvas.drawLine(100, 130, 100 + twentyFiveAni, 130 - twentyFiveAni, paint);
                break;
            case START_DOWNLOADING:
                canvas.drawLine(80, 80, 80 + lineAnimator, 80 + lineAnimator, paint);
                canvas.drawLine(120, 80, 120 - lineAnimator, 80 + lineAnimator, paint);
                canvas.drawLine(120, 80, 120 - lineAnimator, 80 + lineAnimator, paint);
                break;
        }
    }
}
