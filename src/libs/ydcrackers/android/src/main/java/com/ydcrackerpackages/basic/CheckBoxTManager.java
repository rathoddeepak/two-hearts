package com.ydcrackerpackages.basic;

import android.graphics.Color;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.annotations.ReactProp;

import com.ydcrackerpackages.R;

public class CheckBoxTManager extends SimpleViewManager<CheckBoxT> {
	public static final String CLASS_NAME = "YDCCheckBoxT";
    public int size = 21;
	ReactApplicationContext reactContext;

	public CheckBoxTManager(ReactApplicationContext context){
		reactContext = context;
	}

	@Override
	public String getName(){
		return CLASS_NAME;
	}

	@Override
	public CheckBoxT createViewInstance(ThemedReactContext context){
       return new CheckBoxT(context, size);
	}

    @ReactProp(name = "size")
    public void size(CheckBoxT checkBoxT, int size) {
        this.size = size;
    }

	@ReactProp(name = "checked")
	public void setChecked(CheckBoxT checkBoxT, boolean checked) {
        checkBoxT.setChecked(checked, true);
    }

    @ReactProp(name = "count")
    public void setNum(CheckBoxT checkBoxT, int count) {
        checkBoxT.setNum(count);
    }

    @ReactProp(name = "disabled")
    public void setEnabled(CheckBoxT checkBoxT, boolean disabled) {
        checkBoxT.setEnabled(!disabled);
    }

    @ReactProp(name = "drawUnchecked")
    public void setDrawUnchecked(CheckBoxT checkBoxT, boolean drawUnchecked) {
        checkBoxT.setDrawUnchecked(drawUnchecked);
    }

    @ReactProp(name = "type")
    public void setDrawBackgroundAsArc(CheckBoxT checkBoxT, int type) {
        checkBoxT.setDrawBackgroundAsArc(type);
    }

    @ReactProp(name = "colorMap")
    public void setColor(CheckBoxT checkBoxT, ReadableMap colorMap) {
        checkBoxT.setColor(colorMap);
    }


    @Override
    public void onDropViewInstance(CheckBoxT checkBoxT) {
        checkBoxT = null;
    }
}