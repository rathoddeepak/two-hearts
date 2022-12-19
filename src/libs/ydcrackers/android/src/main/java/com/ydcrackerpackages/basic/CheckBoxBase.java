package com.ydcrackerpackages.basic;

import android.content.Context;
import android.animation.Animator;
import android.animation.AnimatorListenerAdapter;
import android.animation.ObjectAnimator;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Path;
import android.graphics.PorterDuff;
import android.graphics.PorterDuffXfermode;
import android.graphics.Rect;
import android.graphics.RectF;
import androidx.annotation.Keep;

import android.text.TextPaint;
import android.view.View;

import com.ydcrackerpackages.util.AndroidUtilities;

public class CheckBoxBase {

    private View parentView;
    private Context mContext;
    private Rect bounds = new Rect();
    private RectF rect = new RectF();

    private static Paint paint;
    private static Paint eraser;
    private Paint checkPaint;
    private Paint backgroundPaint;
    private TextPaint textPaint;

    private Path path = new Path();

    private Bitmap drawBitmap;
    private Canvas bitmapCanvas;

    private boolean enabled = true;

    private boolean attachedToWindow;

    private float backgroundAlpha = 1.0f;

    private float progress;
    private ObjectAnimator checkAnimator;

    private boolean isChecked;

    private String checkColorKey = "#ffffff";
    private String serviceColorKey = "#ffffff";    
    private String backgroundColorKey = "#333333";
    private String background2ColorKey = "#333333";
    private String key_dialogBackground = "#ffffff";
    private String key_attachPhotoBackground = "#ffffff";
    private String key_checkbox = "#ffffff";
    private String key_checkboxDisabled = "#ffffff";

    private boolean useDefaultCheck;

    private boolean drawUnchecked = true;
    private int drawBackgroundAsArc;

    private float size;

    private String checkedText;

    private ProgressDelegate progressDelegate;

    public interface ProgressDelegate {
        void setProgress(float progress);
    }

    public void setCheckColor(String color){
        checkColorKey = color;
    }

    public void setBackgroundColor(String color){
        backgroundColorKey = color;
    }

    public void setBackground2Color(String color){
        background2ColorKey = color;
    }

    public void setDialogBackgroundColor(String color){
        key_dialogBackground = color;
    }

    public void setPhotoBackgroundColor(String color){
        key_attachPhotoBackground = color;
    }

    public void setCheckBoxColor(String color){
        key_checkbox = color;
    }

    public void setCheckBoxDisabledColor(String color){
        key_checkboxDisabled = color;
    }

    public CheckBoxBase(View parent, int sz, Context context) {
        mContext = context;
        parentView = parent;
        size = sz;
        if (paint == null) {
            paint = new Paint(Paint.ANTI_ALIAS_FLAG);

            eraser = new Paint(Paint.ANTI_ALIAS_FLAG);
            eraser.setColor(0);
            eraser.setXfermode(new PorterDuffXfermode(PorterDuff.Mode.CLEAR));
        }
        checkPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
        checkPaint.setStrokeCap(Paint.Cap.ROUND);
        checkPaint.setStyle(Paint.Style.STROKE);
        checkPaint.setStrokeJoin(Paint.Join.ROUND);
        checkPaint.setStrokeWidth(AndroidUtilities.dp(1.9f));

        backgroundPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
        backgroundPaint.setStyle(Paint.Style.STROKE);
        backgroundPaint.setStrokeWidth(AndroidUtilities.dp(1.2f));

        drawBitmap = Bitmap.createBitmap(AndroidUtilities.dp(size), AndroidUtilities.dp(size), Bitmap.Config.ARGB_4444);
        bitmapCanvas = new Canvas(drawBitmap);
    }

    public void onAttachedToWindow() {
        attachedToWindow = true;
    }

    public void onDetachedFromWindow() {
        attachedToWindow = false;
    }

    public void setBounds(int x, int y, int width, int height) {
        bounds.left = x;
        bounds.top = y;
        bounds.right = x + width;
        bounds.bottom = y + height;
    }

    public void setDrawUnchecked(boolean value) {
        drawUnchecked = value;
    }

    @Keep
    public void setProgress(float value) {
        if (progress == value) {
            return;
        }
        progress = value;
        invalidate();
        if (progressDelegate != null) {
            progressDelegate.setProgress(value);
        }
    }

    private void invalidate() {
        if (parentView.getParent() != null) {
            View parent = (View) parentView.getParent();
            parent.invalidate();
        }
        parentView.invalidate();
    }

    public void setProgressDelegate(ProgressDelegate delegate) {
        progressDelegate = delegate;
    }

    public float getProgress() {
        return progress;
    }

    public boolean isChecked() {
        return isChecked;
    }

    public void setEnabled(boolean value) {
        enabled = value;
    }

    public void setDrawBackgroundAsArc(int type) {
        drawBackgroundAsArc = type;
        if (type == 4 || type == 5) {
            backgroundPaint.setStrokeWidth(AndroidUtilities.dp(1.9f));
            if (type == 5) {
                checkPaint.setStrokeWidth(AndroidUtilities.dp(1.5f));
            }
        } else if (type == 3) {
            backgroundPaint.setStrokeWidth(AndroidUtilities.dp(1.2f));
        } else if (type != 0) {
            backgroundPaint.setStrokeWidth(AndroidUtilities.dp(1.5f));
        }
    }

    private void cancelCheckAnimator() {
        if (checkAnimator != null) {
            checkAnimator.cancel();
            checkAnimator = null;
        }
    }

    private void animateToCheckedState(boolean newCheckedState) {
        checkAnimator = ObjectAnimator.ofFloat(this, "progress", newCheckedState ? 1 : 0);
        checkAnimator.addListener(new AnimatorListenerAdapter() {
            @Override
            public void onAnimationEnd(Animator animation) {
                if (animation.equals(checkAnimator)) {
                    checkAnimator = null;
                }
                if (!isChecked) {
                    checkedText = null;
                }
            }
        });
        checkAnimator.setInterpolator(CubicBezierInterpolator.EASE_OUT);
        checkAnimator.setDuration(200);
        checkAnimator.start();
    }

    public void setColor(String background, String background2, String check, String dialogBackground,String photoBackground,String checkBox, String disabled, String serviceColorKey) {
        backgroundColorKey = background;
        background2ColorKey = background2;
        checkColorKey = check;
        key_dialogBackground = dialogBackground;
        key_attachPhotoBackground = photoBackground;
        key_checkbox = checkBox;
        key_checkboxDisabled = disabled;
        serviceColorKey = serviceColorKey;
    }

    public void setUseDefaultCheck(boolean value) {
        useDefaultCheck = value;
    }

    public void setBackgroundAlpha(float alpha) {
        backgroundAlpha = alpha;
    }

    public void setNum(int num) {
        if (num >= 0) {
            checkedText = "" + (num + 1);
        } else if (checkAnimator == null) {
            checkedText = null;
        }
        invalidate();
    }

    public void setChecked(boolean checked, boolean animated) {
        setChecked(-1, checked, animated);
    }

    public void setChecked(int num, boolean checked, boolean animated) {
        if (num >= 0) {
            checkedText = "" + (num + 1);
            invalidate();
        }
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

    public void draw(Canvas canvas) {
        if (drawBitmap == null) {
            return;
        }

        drawBitmap.eraseColor(0);
        float rad = AndroidUtilities.dp(size / 2);
        float outerRad = rad;
        if (drawBackgroundAsArc != 0) {
            outerRad -= AndroidUtilities.dp(0.2f);
        }

        float roundProgress = progress >= 0.5f ? 1.0f : progress / 0.5f;

        int cx = bounds.centerX();
        int cy = bounds.centerY();

        if (backgroundColorKey != null) {
            if (drawUnchecked) {
                if (drawBackgroundAsArc == 6 || drawBackgroundAsArc == 7) {
                    paint.setColor(Color.parseColor(background2ColorKey));
                    backgroundPaint.setColor(Color.parseColor(checkColorKey));
                } else {
                    paint.setColor(Color.parseColor(serviceColorKey));
                    backgroundPaint.setColor(Color.parseColor(checkColorKey));
                }
            } else {
                backgroundPaint.setColor(AndroidUtilities.getOffsetColor(0x00ffffff, Color.parseColor(background2ColorKey != null ? background2ColorKey : checkColorKey), progress, backgroundAlpha));
            }
        } else {
            if (drawUnchecked) {
                paint.setColor(Color.argb((int) (25 * backgroundAlpha), 0, 0, 0));
                if (drawBackgroundAsArc == 8) {
                    backgroundPaint.setColor(Color.parseColor(background2ColorKey));
                } else {
                    backgroundPaint.setColor(AndroidUtilities.getOffsetColor(0xffffffff, Color.parseColor(checkColorKey), progress, backgroundAlpha));
                }
            } else {
                backgroundPaint.setColor(AndroidUtilities.getOffsetColor(0x00ffffff, Color.parseColor(background2ColorKey != null ? background2ColorKey : checkColorKey), progress, backgroundAlpha));
            }
        }

        if (drawUnchecked) {
            if (drawBackgroundAsArc == 8) {
                canvas.drawCircle(cx, cy, rad - AndroidUtilities.dp(1.5f), backgroundPaint);
            } else if (drawBackgroundAsArc == 6 || drawBackgroundAsArc == 7) {
                canvas.drawCircle(cx, cy, rad - AndroidUtilities.dp(1), paint);
                canvas.drawCircle(cx, cy, rad - AndroidUtilities.dp(1.5f), backgroundPaint);
            } else {
                canvas.drawCircle(cx, cy, rad, paint);
            }
        }
        paint.setColor(Color.parseColor(checkColorKey));
        if (drawBackgroundAsArc != 7 && drawBackgroundAsArc != 8 && drawBackgroundAsArc != 9) {
            if (drawBackgroundAsArc == 0) {
                canvas.drawCircle(cx, cy, rad, backgroundPaint);
            } else {
                rect.set(cx - outerRad, cy - outerRad, cx + outerRad, cy + outerRad);
                int startAngle;
                int sweepAngle;
                if (drawBackgroundAsArc == 6) {
                    startAngle = 0;
                    sweepAngle = (int) (-360 * progress);
                } else if (drawBackgroundAsArc == 1) {
                    startAngle = -90;
                    sweepAngle = (int) (-270 * progress);
                } else {
                    startAngle = 90;
                    sweepAngle = (int) (270 * progress);
                }

                if (drawBackgroundAsArc == 6) {
                    int color = Color.parseColor(key_dialogBackground);
                    int alpha = Color.alpha(color);
                    backgroundPaint.setColor(color);
                    backgroundPaint.setAlpha((int) (alpha * progress));
                    canvas.drawArc(rect, startAngle, sweepAngle, false, backgroundPaint);
                    color = Color.parseColor(key_attachPhotoBackground);
                    alpha = Color.alpha(color);
                    backgroundPaint.setColor(color);
                    backgroundPaint.setAlpha((int) (alpha * progress));
                    canvas.drawArc(rect, startAngle, sweepAngle, false, backgroundPaint);
                } else {
                    canvas.drawArc(rect, startAngle, sweepAngle, false, backgroundPaint);
                }
            }
        }

        if (roundProgress > 0) {
            float checkProgress = progress < 0.5f ? 0.0f : (progress - 0.5f) / 0.5f;

            if (drawBackgroundAsArc == 9) {
                paint.setColor(Color.parseColor(background2ColorKey));
            } else if (drawBackgroundAsArc == 6 || drawBackgroundAsArc == 7 || !drawUnchecked && backgroundColorKey != null) {
                paint.setColor(Color.parseColor(backgroundColorKey));
            } else {
                paint.setColor(Color.parseColor(enabled ? key_checkbox : key_checkboxDisabled));
            }          
            checkPaint.setColor(Color.parseColor(checkColorKey));

            rad -= AndroidUtilities.dp(0.5f);
            bitmapCanvas.drawCircle(drawBitmap.getWidth() / 2, drawBitmap.getHeight() / 2, rad, paint);
            bitmapCanvas.drawCircle(drawBitmap.getWidth() / 2, drawBitmap.getWidth() / 2, rad * (1.0f - roundProgress), eraser);
            canvas.drawBitmap(drawBitmap, cx - drawBitmap.getWidth() / 2, cy - drawBitmap.getHeight() / 2, null);

            if (checkProgress != 0) {
                if (checkedText != null) {
                    if (textPaint == null) {
                        textPaint = new TextPaint(Paint.ANTI_ALIAS_FLAG);
                        textPaint.setTypeface(AndroidUtilities.getTypeface(mContext, "fonts/rmedium.ttf"));
                    }
                    final float textSize, y;
                    switch (checkedText.length()) {
                        case 0:
                        case 1:
                        case 2:
                            textSize = 14f;
                            y = 18f;
                            break;
                        case 3:
                            textSize = 10f;
                            y = 16.5f;
                            break;
                        default:
                            textSize = 8f;
                            y = 15.75f;
                    }
                    textPaint.setTextSize(AndroidUtilities.dp(textSize));
                    textPaint.setColor(Color.parseColor(checkColorKey));
                    canvas.save();
                    canvas.scale(checkProgress, 1.0f, cx, cy);
                    canvas.drawText(checkedText, cx - textPaint.measureText(checkedText) / 2f, AndroidUtilities.dp(y), textPaint);
                    canvas.restore();
                } else {
                    path.reset();

                    float scale = drawBackgroundAsArc == 5 ? 0.8f : 1.0f;
                    float checkSide = AndroidUtilities.dp(9 * scale) * checkProgress;
                    float smallCheckSide = AndroidUtilities.dp(4 * scale) * checkProgress;
                    int x = cx - AndroidUtilities.dp(1.5f);
                    int y = cy + AndroidUtilities.dp(4);
                    float side = (float) Math.sqrt(smallCheckSide * smallCheckSide / 2.0f);
                    path.moveTo(x - side, y - side);
                    path.lineTo(x, y);
                    side = (float) Math.sqrt(checkSide * checkSide / 2.0f);
                    path.lineTo(x + side, y - side);
                    canvas.drawPath(path, checkPaint);
                }
            }
        }
    }
}
