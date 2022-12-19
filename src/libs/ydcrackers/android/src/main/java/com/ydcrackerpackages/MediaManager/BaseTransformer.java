package com.ydcrackerpackages.MediaManager;

import androidx.annotation.NonNull;
import androidx.viewpager2.widget.ViewPager2;
import android.view.View;
public abstract class BaseTransformer implements ViewPager2.PageTransformer {
    protected abstract void onTransform(View view, float position);

    @Override
    public void transformPage(@NonNull View view, float position) {
        onPreTransform(view, position);
        onTransform(view, position);
        onPostTransform(view, position);
    }
    private boolean hideOffscreenPages() {
        return true;
    }

    private boolean isPagingEnabled() {
        return false;
    }

    private void onPreTransform(View view, float position) {
        final float width = view.getWidth();

        view.setRotationX(0);
        view.setRotationY(0);
        view.setRotation(0);
        view.setScaleX(1);
        view.setScaleY(1);
        view.setPivotX(0);
        view.setPivotY(0);
        view.setTranslationY(0);
        view.setTranslationX(isPagingEnabled() ? 0f : -width * position);

        if (hideOffscreenPages()) {
            view.setAlpha(position <= -1f || position >= 1f ? 0f : 1f);
        } else {
            view.setAlpha(1f);
        }
    }
    private void onPostTransform(View view, float position) {
    }

}