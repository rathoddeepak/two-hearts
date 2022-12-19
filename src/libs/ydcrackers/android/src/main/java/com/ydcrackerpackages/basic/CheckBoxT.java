package com.ydcrackerpackages.basic;

import android.content.Context;
import android.graphics.Canvas;
import android.view.View;
import com.facebook.react.bridge.ReadableMap;
public class CheckBoxT extends View {

    private CheckBoxBase checkBoxBase;    
    public CheckBoxT(Context context, int sz) {
        super(context);
        checkBoxBase = new CheckBoxBase(this, sz, context);
    }

    public void setProgressDelegate(CheckBoxBase.ProgressDelegate delegate) {
        checkBoxBase.setProgressDelegate(delegate);
        /*
            checkBox.setProgressDelegate(progress -> {
            float scale = 1.0f - (1.0f - 0.857f) * checkBox.getProgress();
            imageView.setScaleX(scale);
            imageView.setScaleY(scale);
        });
        */
    }

    public void setChecked(int num, boolean checked, boolean animated) {
        checkBoxBase.setChecked(num, checked, animated);
    }

    public void setChecked(boolean checked, boolean animated) {
        checkBoxBase.setChecked(checked, animated);
    }

    public void setNum(int num) {
        checkBoxBase.setNum(num);
    }

    public boolean isChecked() {
        return checkBoxBase.isChecked();
    }

    public void setColor(ReadableMap map) {
        String background = map.hasKey("background") ? map.getString("background") : "#ffffff";
        String background2 = map.hasKey("background2") ? map.getString("background2") : "#ffffff";
        String check = map.hasKey("check") ? map.getString("check") : "#ffffff";
        String dialogBackground = map.hasKey("dialogBackground") ? map.getString("dialogBackground") : "#ffffff";
        String photoBackground = map.hasKey("photoBackground") ? map.getString("photoBackground") : "#ffffff";
        String checkBox = map.hasKey("checkBox") ? map.getString("checkBox") : "#ffffff";
        String disabled = map.hasKey("disabled") ? map.getString("disabled") : "#ffffff";
        String serviceColorKey = map.hasKey("serviceColorKey") ? map.getString("serviceColorKey") : "#ffffff";
        checkBoxBase.setColor(background, background2, check, dialogBackground, photoBackground, checkBox, disabled, serviceColorKey);
    }

    @Override
    public void setEnabled(boolean enabled) {
        checkBoxBase.setEnabled(enabled);
        super.setEnabled(enabled);
    }

    public void setDrawUnchecked(boolean value) {
        checkBoxBase.setDrawUnchecked(value);
    }

    public void setDrawBackgroundAsArc(int type) {
        checkBoxBase.setDrawBackgroundAsArc(type);
    }

    public float getProgress() {
        return checkBoxBase.getProgress();
    }

    @Override
    protected void onAttachedToWindow() {
        super.onAttachedToWindow();
        checkBoxBase.onAttachedToWindow();
    }

    @Override
    protected void onDetachedFromWindow() {
        super.onDetachedFromWindow();
        checkBoxBase.onDetachedFromWindow();
    }

    @Override
    protected void onLayout(boolean changed, int left, int top, int right, int bottom) {
        super.onLayout(changed, left, top, right, bottom);
        checkBoxBase.setBounds(0, 0, right - left, bottom - top);
    }

    @Override
    protected void onDraw(Canvas canvas) {
        checkBoxBase.draw(canvas);
    }
}
