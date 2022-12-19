package com.ydcrackerpackages.image;

import android.animation.ArgbEvaluator;
import android.animation.ValueAnimator;
import android.content.Context;
import android.graphics.Color;
import android.graphics.drawable.Animatable;
import android.view.animation.LinearInterpolator;
import androidx.appcompat.widget.AppCompatImageButton;
import androidx.core.content.ContextCompat;
import androidx.vectordrawable.graphics.drawable.AnimatedVectorDrawableCompat;
import com.ydcrackerpackages.R;

public class HeartView extends AppCompatImageButton {
    Context context;
    AnimatedVectorDrawableCompat avd;
    int currentState = 3;
    int red = Color.parseColor("#f44336");
    public final static int MALELIKED = 1, FEMALELIKED = 2, NONLIKED = 3, BOTHLIKED = 4, MALE = 7, FEMALE = 8;
    HeartView(Context context){
        super(context);
        this.context = context;
        avd = AnimatedVectorDrawableCompat.create(context, R.drawable.avd_male_normal);
        setColorFilter(ContextCompat.getColor(context, R.color.color_white));
        setImageDrawable(avd);
    }
    public void normalizeState(int normalizeState, boolean addBounce){
    	if(currentState == normalizeState){
    		return;
    	}
		if(currentState == NONLIKED && normalizeState == MALELIKED){
			spring(true, addBounce, Color.WHITE, red);
            currentState = MALELIKED;
            avd = AnimatedVectorDrawableCompat.create(context, R.drawable.avd_male_heart);
		}else if(currentState == FEMALELIKED && normalizeState == MALELIKED){
			spring(true, addBounce, red, red);
            currentState = MALELIKED;
            avd = AnimatedVectorDrawableCompat.create(context, R.drawable.avd_female_male);			
		}else if(currentState == BOTHLIKED && normalizeState == MALELIKED){
			spring(true, addBounce, red, red);
            currentState = MALELIKED;
            avd = AnimatedVectorDrawableCompat.create(context, R.drawable.avd_filled_male);
		}

		else if(currentState == NONLIKED && normalizeState == FEMALELIKED){
			spring(true, addBounce, Color.WHITE, red);
            currentState = FEMALELIKED;
            avd = AnimatedVectorDrawableCompat.create(context, R.drawable.avd_female_heart);
		}else if(currentState == MALELIKED && normalizeState == FEMALELIKED){
			spring(true, addBounce, red, red);
            currentState = FEMALELIKED;
            avd = AnimatedVectorDrawableCompat.create(context, R.drawable.avd_male_female);
		}else if(currentState == BOTHLIKED && normalizeState == FEMALELIKED){
			spring(true, addBounce, red, red);
            currentState = FEMALELIKED;
            avd = AnimatedVectorDrawableCompat.create(context, R.drawable.avd_filled_female);
		}

		else if(currentState == MALELIKED && normalizeState == BOTHLIKED){
			spring(true, addBounce, red, red);
            currentState = BOTHLIKED;
            avd = AnimatedVectorDrawableCompat.create(context, R.drawable.avd_male_filled);
		}else if(currentState == FEMALELIKED && normalizeState == BOTHLIKED){
			spring(true, addBounce, red, red);
            currentState = BOTHLIKED;
            avd = AnimatedVectorDrawableCompat.create(context, R.drawable.avd_female_filled);
		}else if(currentState == NONLIKED && normalizeState == BOTHLIKED){
			spring(true, addBounce, Color.WHITE, red);
            currentState = BOTHLIKED;
            avd = AnimatedVectorDrawableCompat.create(context, R.drawable.avd_normal_filled);
		}

		else if(currentState == BOTHLIKED	&& normalizeState == NONLIKED){
			spring(true, addBounce, red, Color.WHITE);
            currentState = NONLIKED;
            avd = AnimatedVectorDrawableCompat.create(context, R.drawable.avd_filled_normal);
		}else if(currentState == MALELIKED	&& normalizeState == NONLIKED){
			spring(true, addBounce, red, Color.WHITE);
            currentState = NONLIKED;
            avd = AnimatedVectorDrawableCompat.create(context, R.drawable.avd_male_normal);
		}else if(currentState == FEMALELIKED && normalizeState == NONLIKED){
			spring(true, addBounce, red, Color.WHITE);
            currentState = NONLIKED;
            avd = AnimatedVectorDrawableCompat.create(context, R.drawable.avd_filled_normal);
		}
       
        setImageDrawable(avd);
        Animatable animatable = (Animatable) getDrawable();
        animatable.start();
    }
    private void spring(boolean hasColor, boolean addBounce, int fromColor, int toColor){
        if(addBounce){
	        ValueAnimator buttonOpen = ValueAnimator.ofFloat(1f, 1.2f, 1);
	        buttonOpen.setInterpolator(new LinearInterpolator());
	        buttonOpen.addUpdateListener(new ValueAnimator.AnimatorUpdateListener() {
	            @Override
	            public void onAnimationUpdate(ValueAnimator valueAnimator) {
	                Float value = (Float) valueAnimator.getAnimatedValue();
	                setScaleX(value);
	                setScaleY(value);
	            }
	        });
	        buttonOpen.setDuration(1000);
	        buttonOpen.start();
        }
        if(hasColor){
            ValueAnimator colorChange = ValueAnimator.ofObject(new ArgbEvaluator(), fromColor, toColor);
            colorChange.addUpdateListener(new ValueAnimator.AnimatorUpdateListener() {
                @Override
                public void onAnimationUpdate(ValueAnimator valueAnimator) {
                    int value = (int) valueAnimator.getAnimatedValue();
                    setColorFilter(value);
                }
            });
            colorChange.setDuration(1000);
            colorChange.start();
        }else{
            setColorFilter(fromColor);
        }

    }
    public int getCurrentState(){
        return  currentState;
    }
}

