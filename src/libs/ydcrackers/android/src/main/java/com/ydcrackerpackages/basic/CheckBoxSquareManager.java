package com.ydcrackerpackages.basic;

//Steps 1: Create Create Class extending SimpleViewManger;
//Steps 2: Create Class extending view to defined custom view
//Steps 3: Register View by CreateViewMangers
import android.graphics.Color;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

import com.ydcrackerpackages.R;

public class CheckBoxSquareManager extends SimpleViewManager<CheckBoxSquare> {
	public static final String CLASS_NAME = "YDCCheckBoxSquare";
	ReactApplicationContext reactContext;

	public CheckBoxSquareManager(ReactApplicationContext context){
		reactContext = context;
	}

	@Override
	public String getName(){
		return CLASS_NAME;
	}

	@Override
	public CheckBoxSquare createViewInstance(ThemedReactContext context){
       return new CheckBoxSquare(context, false);
	}

	@ReactProp(name = "uncheckedColor")
	public void setUncheckedColor(CheckBoxSquare checkBoxSquare, String uncheckedColor) {
        int c = Color.parseColor(uncheckedColor);
        checkBoxSquare.setUncheckedColor(c);
    }

    @ReactProp(name = "disabledColor")
	public void setDisabledColor(CheckBoxSquare checkBoxSquare, String disabledColor) {
        int c = Color.parseColor(disabledColor);
        checkBoxSquare.setDisabledColor(c);
    }

    @ReactProp(name = "backgroundColor")
	public void setBackgroundColor(CheckBoxSquare checkBoxSquare, String backgroundColor) {
        int c = Color.parseColor(backgroundColor);
        checkBoxSquare.setBackgroundColor(c);
    }

    @ReactProp(name = "checkColor")
	public void setCheckColor(CheckBoxSquare checkBoxSquare, String checkColor) {
        int c = Color.parseColor(checkColor);
        checkBoxSquare.setCheckColor(c);
    }

    @ReactProp(name = "checked")
	public void setChecked(CheckBoxSquare checkBoxSquare, boolean checked) {
        checkBoxSquare.setChecked(checked, true);
    }

    @ReactProp(name = "disabled")
	public void setDisabled(CheckBoxSquare checkBoxSquare, boolean disabled) {
        checkBoxSquare.setDisabled(disabled);
    }

    @ReactProp(name = "cancel")
    public void cancelCheckAnimator(CheckBoxSquare checkBoxSquare, boolean cancel) {
        if(cancel == true){
            checkBoxSquare.setDisabled(true);
        }        
    }

    @Override
    public void onDropViewInstance(CheckBoxSquare checkBoxSquare) {
        checkBoxSquare = null;
    }
}