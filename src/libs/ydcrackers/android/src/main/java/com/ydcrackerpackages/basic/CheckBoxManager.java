package com.ydcrackerpackages.basic;

//Steps 1: Create Create Class extending SimpleViewManger;
//Steps 2: Create Class extending view to defined custom view
//Steps 3: Register View by CreateViewMangers
import android.graphics.Color;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.ydcrackerpackages.basic.CircleCheckBox;
import com.ydcrackerpackages.R;

public class CheckBoxManager extends SimpleViewManager<CircleCheckBox> {
	public static final String CLASS_NAME = "YDCCheckBox";
	ReactApplicationContext reactContext;

	public CheckBoxManager(ReactApplicationContext context){
		reactContext = context;
	}

	@Override
	public String getName(){
		return CLASS_NAME;
	}

	@Override
	public CircleCheckBox createViewInstance(ThemedReactContext context){        
        return new CircleCheckBox(context);   
	}

	@ReactProp(name = "selected")
	public void setChecked(CircleCheckBox checkBox, boolean selected) {
        checkBox.setChecked(selected);
    }

    @ReactProp(name = "duration")
    public void setDuration(CircleCheckBox checkBox, int duration) {
       checkBox.setDuration(duration);
    }

    @ReactProp(name = "tickerColor")
    public void setTickerColor(CircleCheckBox checkBox, String color) {
        checkBox.setTickerColor(Color.parseColor(color));        
    }

    @ReactProp(name = "tickerWidth")
    public void setTickerWidth(CircleCheckBox checkBox, int width) {
        checkBox.setTickerWidth(width);
    }

    @ReactProp(name = "borderWidth")
    public void setBorderWidth(CircleCheckBox checkBox, int width) {
        checkBox.setBorderWidth(width);
    }

    @ReactProp(name = "borderColor")
    public void setBorderColor(CircleCheckBox checkBox, String color) {
        checkBox.setBorderColor(Color.parseColor(color));    
    }

    @ReactProp(name = "backgroundColor")
    public void setBackgroundColor(CircleCheckBox checkBox, String color) {
        checkBox.setBackgroundColor(Color.parseColor(color));    
    }

    /*
    @ReactProp(name = "hookColor")
    public void setHookColor(AnimatedCheckBox checkBox, String hookColor) {
        Paris.styleBuilder(checkBox)        
        .acb_hook_color(Color.parseColor(hookColor))                
        .apply();        
    }

    @ReactProp(name = "borderCheckedColor")
    public void setBorderCheckedColor(AnimatedCheckBox checkBox, String borderCheckedColor) {
       Paris.styleBuilder(checkBox)        
        .acb_border_checked_color(Color.parseColor(borderCheckedColor))                
        .apply();
    }

    @ReactProp(name = "borderNotCheckedColor")
    public void setBorderNotCheckedColor(AnimatedCheckBox checkBox, String borderNotCheckedColor) {
        Paris.styleBuilder(checkBox)        
        .acb_border_not_checked_color(Color.parseColor(borderNotCheckedColor))                
        .apply();        
    }

    @ReactProp(name = "hookStrokeWidth")
    public void setHookStrokeWidth(AnimatedCheckBox checkBox, double value) {
        checkBox.hookStrokeWidth = (float) value;
    }

    @ReactProp(name = "borderCheckedStrokeWidth")
    public void setBorderCheckedStrokeWidth(AnimatedCheckBox checkBox, double value) {
        checkBox.borderCheckedStrokeWidth = (float) value;
    }

    @ReactProp(name = "duration")
    public void setDuration(AnimatedCheckBox checkBox, int value) {
        checkBox.duration = (long) value;
    }

    @ReactProp(name = "padding")
    public void setPadding(AnimatedCheckBox checkBox, double value) {
        checkBox.padding = (float) value;
    }
    */
    @Override
    public void onDropViewInstance(CircleCheckBox checkBox) {
        checkBox = null;
    }
}