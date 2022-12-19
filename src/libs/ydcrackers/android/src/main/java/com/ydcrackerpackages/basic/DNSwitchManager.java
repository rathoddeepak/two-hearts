package com.ydcrackerpackages.basic;

//Steps 1: Create Create Class extending SimpleViewManger;
//Steps 2: Create Class extending view to defined custom view
//Steps 3: Register View by CreateViewMangers
import android.graphics.Color;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.ydcrackerpackages.basic.widgets.DayNightSwitch;
import com.ydcrackerpackages.R;

public class DNSwitchManager extends SimpleViewManager<DayNightSwitch> {
	public static final String CLASS_NAME = "DayNightSwitch";	

	@Override
	public String getName(){
		return CLASS_NAME;
	}

	@Override
	public DayNightSwitch createViewInstance(ThemedReactContext context){        
        return new DayNightSwitch(context);   
	}

    @ReactProp(name = "selected")
    public void setChecked(DayNightSwitch dnswitch, boolean selected) {
        dnswitch.toggle();
    }


    @Override
    public void onDropViewInstance(DayNightSwitch dnswitch) {
        dnswitch = null;
    }
}