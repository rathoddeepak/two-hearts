package com.ydcrackerpackages.basic;

import android.graphics.Color;
import android.view.View;
import androidx.annotation.Nullable;

import com.facebook.react.common.MapBuilder;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

import com.ydcrackerpackages.basic.WheelPicker;
import com.ydcrackerpackages.R;
import java.util.HashMap;
import java.util.List;
import java.util.ArrayList;
import java.util.Map;

public class WheelPickerManager extends SimpleViewManager<WheelPicker> {
	public static final String CLASS_NAME = "YDCWheelPicker";
	ReactApplicationContext reactContext;    
	public WheelPickerManager(ReactApplicationContext context){
		reactContext = context;
	}

	@Override
	public String getName(){
		return CLASS_NAME;
	}

	@Override
	public WheelPicker createViewInstance(ThemedReactContext context){       
       return new WheelPicker(context);
	}

	@ReactProp(name = "setCyclic")
	public void setCyclic(WheelPicker wheelPicker, boolean setCyclic) {        
        wheelPicker.setCyclic(setCyclic);
    }

    @ReactProp(name = "setCurved")
    public void setCurved(WheelPicker wheelPicker, boolean curved) {        
        wheelPicker.setCurved(curved);
    }


    @ReactProp(name = "selectedItemPosition")
    public void setSelectedItemPosition(WheelPicker wheelPicker, int position) {        
        wheelPicker.setSelectedItemPosition(position);
    }

    @ReactProp(name = "data")
    public void setData(WheelPicker wheelPicker, ReadableArray data) {
        List<String> listData = new ArrayList<String>(); 
        for (int i = 0; i < data.size(); i++ ) {
            listData.add(data.getString(i));
        }
        wheelPicker.setData(listData);
    }

    @ReactProp(name = "selectedItemTextColor")
	public void setSelectedItemTextColor(WheelPicker wheelPicker, String color) {
        int color2 = Color.parseColor(color);
        wheelPicker.setSelectedItemTextColor(color2);
    }

    @ReactProp(name = "itemTextColor")
    public void setItemTextColor(WheelPicker wheelPicker, String color) {
        int color2 = Color.parseColor(color);
        wheelPicker.setItemTextColor(color2);
    }

    @ReactProp(name = "indicator")
    public void setIndicator(WheelPicker wheelPicker, boolean indicator) {        
        wheelPicker.setIndicator(indicator);    
    }

    @ReactProp(name = "indicatorSize")
    public void setIndicatorSize(WheelPicker wheelPicker, int size) {            
        wheelPicker.setIndicatorSize(size);    
    }

    @ReactProp(name = "textSize")
    public void setItemTextSize(WheelPicker wheelPicker, int size) {            
        wheelPicker.setItemTextSize(size);    
    }

    @ReactProp(name = "indicatorColor")
    public void setIndicatorColor(WheelPicker wheelPicker, String color) {
        int color2 = Color.parseColor(color);
        wheelPicker.setIndicatorColor(color2);    
    }

    @ReactProp(name = "curtain")
    public void setCurtain(WheelPicker wheelPicker, boolean hasCurtain) {        
        wheelPicker.setCurtain(hasCurtain);    
    }

    @ReactProp(name = "atmospheric")
    public void setAtmospheric(WheelPicker wheelPicker, boolean bool) {        
        wheelPicker.setAtmospheric(bool);    
    }


    @ReactProp(name = "textAlign")
    public void setItemAlign(WheelPicker wheelPicker, String alignMent) {
        int align = View.TEXT_ALIGNMENT_CENTER;
        switch(alignMent){
            case "inherit":
            align = View.TEXT_ALIGNMENT_INHERIT;
            break;
            case "gravity":
            align = View.TEXT_ALIGNMENT_GRAVITY;
            break;
            case "start":
            align = View.TEXT_ALIGNMENT_TEXT_START;
            break;
            case "end":
            align = View.TEXT_ALIGNMENT_TEXT_END;
            break;
            case "center":
            align = View.TEXT_ALIGNMENT_CENTER;
            break;
            case "view_start":
            align = View.TEXT_ALIGNMENT_VIEW_START;
            break;
            case "view_end":
            align = View.TEXT_ALIGNMENT_VIEW_END;
            break;            
        }       
        wheelPicker.setItemAlign(align);         
    }

    @Override
        public Map getExportedCustomBubblingEventTypeConstants() {
        return MapBuilder.builder()
            .put(
                "onItemSelected",
                MapBuilder.of(
                    "phasedRegistrationNames",
                    MapBuilder.of("bubbled", "onItemSelected")))
                    .build();
    }

    @Override
    public void onDropViewInstance(WheelPicker wheelPicker) {
        wheelPicker = null;
    }

    @Override
    public void receiveCommand(WheelPicker picker, int commandId, @Nullable ReadableArray args) {
        super.receiveCommand(picker, commandId, args);
        switch(commandId){
            case 0:
            picker.setSelectedItemPosition(args.getInt(0));
            break;
        }
    }
}