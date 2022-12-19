package com.ydcrackerpackages.basic;

import android.view.View;
import android.graphics.Color;
import android.graphics.RectF;
import android.graphics.Bitmap;
import android.graphics.Paint;
import android.graphics.Canvas;
import android.content.Context;
import androidx.annotation.Keep;
import android.graphics.PorterDuff;
import android.animation.ObjectAnimator;
import android.graphics.PorterDuffXfermode;
import android.graphics.PorterDuffColorFilter;

import com.ydcrackerpackages.util.AndroidUtilities;

public class CheckBoxSquare extends View {

    private RectF rectF;

    private Bitmap drawBitmap;
    private Canvas drawCanvas;
    private Paint checkboxSquare_backgroundPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
    private Paint checkMarkColor = new Paint(Paint.ANTI_ALIAS_FLAG);
    private Paint checkboxSquare_eraserPaint  = new Paint(Paint.ANTI_ALIAS_FLAG);
    

    private float progress;
    private ObjectAnimator checkAnimator;

    private boolean attachedToWindow;
    private boolean isChecked;
    private boolean isDisabled;
    private boolean isAlert;

    private final static float progressBounceDiff = 0.2f;
    private int uncheckedColor = 0;
    private int disabledColor = 0;
    private int backgroundColor = 0;    

    public CheckBoxSquare(Context context, boolean alert) {
        super(context);
        rectF = new RectF();
        drawBitmap = Bitmap.createBitmap(AndroidUtilities.dp(18), AndroidUtilities.dp(18), Bitmap.Config.ARGB_4444);
        drawCanvas = new Canvas(drawBitmap);
        isAlert = alert;
    }

    @Keep
    public void setProgress(float value) {
        if (progress == value) {
            return;
        }
        progress = value;
        invalidate();
    }

    public float getProgress() {
        return progress;
    }

    public void setUncheckedColor(int uncheckedColor) {
        this.uncheckedColor = uncheckedColor;
    }

    public void setDisabledColor(int disabledColor) {
        this.disabledColor = disabledColor;
    }

    public void setBackgroundColor(int backgroundColor) {
        this.backgroundColor = backgroundColor;
    }
    
    public void setCheckColor(int checkMarkClr) {
        checkMarkColor.setColor(checkMarkClr);
    }
    
    private void cancelCheckAnimator() {
        if (checkAnimator != null) {
            checkAnimator.cancel();
        }
    }

    private void animateToCheckedState(boolean newCheckedState) {
        checkAnimator = ObjectAnimator.ofFloat(this, "progress", newCheckedState ? 1 : 0);
        checkAnimator.setDuration(300);
        checkAnimator.start();
    }

    @Override
    protected void onAttachedToWindow() {
        super.onAttachedToWindow();
        attachedToWindow = true;
    }

    @Override
    protected void onDetachedFromWindow() {
        super.onDetachedFromWindow();
        attachedToWindow = false;
    }

    @Override
    protected void onLayout(boolean changed, int left, int top, int right, int bottom) {
        super.onLayout(changed, left, top, right, bottom);
    }

    public void setChecked(boolean checked, boolean animated) {
        if (checked == isChecked) {
            return;
        }
        isChecked = checked;
        if (attachedToWindow && animated) {
            animateToCheckedState(checked);
        } else {
            cancelCheckAnimator();
            setProgress(checked ? 1.0f : 0.0f);
        }
    }

    public void setDisabled(boolean disabled) {
        isDisabled = disabled;
        invalidate();
    }

    public boolean isChecked() {
        return isChecked;
    }

    @Override
    protected void onDraw(Canvas canvas) {        
        checkboxSquare_eraserPaint.setColor(0);
        checkboxSquare_eraserPaint.setXfermode(new PorterDuffXfermode(PorterDuff.Mode.CLEAR));

        if (getVisibility() != VISIBLE) {
            return;
        }

        float checkProgress;
        float bounceProgress;        
        int color = backgroundColor;
        if (progress <= 0.5f) {
            bounceProgress = checkProgress = progress / 0.5f;
            int rD = (int) ((Color.red(color) - Color.red(uncheckedColor)) * checkProgress);
            int gD = (int) ((Color.green(color) - Color.green(uncheckedColor)) * checkProgress);
            int bD = (int) ((Color.blue(color) - Color.blue(uncheckedColor)) * checkProgress);
            int c = Color.rgb(Color.red(uncheckedColor) + rD, Color.green(uncheckedColor) + gD, Color.blue(uncheckedColor) + bD);
            checkboxSquare_backgroundPaint.setColor(c);
        } else {
            bounceProgress = 2.0f - progress / 0.5f;
            checkProgress = 1.0f;            
        }
        if (isDisabled) {
            checkboxSquare_backgroundPaint.setColor(disabledColor);
        }
        float bounce = AndroidUtilities.dp(1) * bounceProgress;
        rectF.set(bounce, bounce, AndroidUtilities.dp(18) - bounce, AndroidUtilities.dp(18) - bounce);

        drawBitmap.eraseColor(0);
        drawCanvas.drawRoundRect(rectF, AndroidUtilities.dp(2), AndroidUtilities.dp(2), checkboxSquare_backgroundPaint);

        if (checkProgress != 1) {
            float rad = Math.min(AndroidUtilities.dp(7), AndroidUtilities.dp(7) * checkProgress + bounce);
            rectF.set(AndroidUtilities.dp(2) + rad, AndroidUtilities.dp(2) + rad, AndroidUtilities.dp(16) - rad, AndroidUtilities.dp(16) - rad);
            drawCanvas.drawRect(rectF, checkboxSquare_eraserPaint);
        }

        if (progress > 0.5f) {            
            int endX = (int) (AndroidUtilities.dp(7) - AndroidUtilities.dp(3) * (1.0f - bounceProgress));
            int endY = (int) (AndroidUtilities.dpf2(13) - AndroidUtilities.dp(3) * (1.0f - bounceProgress));
            drawCanvas.drawLine(AndroidUtilities.dp(7), (int) AndroidUtilities.dpf2(13), endX, endY, checkMarkColor);

            endX = (int) (AndroidUtilities.dpf2(7) + AndroidUtilities.dp(7) * (1.0f - bounceProgress));
            endY = (int) (AndroidUtilities.dpf2(13) - AndroidUtilities.dp(7) * (1.0f - bounceProgress));
            drawCanvas.drawLine((int) AndroidUtilities.dpf2(7), (int) AndroidUtilities.dpf2(13), endX, endY, checkMarkColor);
        }
        canvas.drawBitmap(drawBitmap, 0, 0, null);
    }

}
