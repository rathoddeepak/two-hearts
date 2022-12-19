package com.ydcrackerpackages;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import com.facebook.react.bridge.JavaScriptModule;

import  com.ydcrackerpackages.sp.YdSharedPreferences;
import  com.ydcrackerpackages.image.YdcImageManager;
import  com.ydcrackerpackages.basic.CheckBoxManager;
import  com.ydcrackerpackages.basic.CheckBoxSquareManager;
import  com.ydcrackerpackages.basic.CheckBoxTManager;
import  com.ydcrackerpackages.basic.DNSwitchManager;
import  com.ydcrackerpackages.basic.WheelPickerManager;
import  com.ydcrackerpackages.uploader.MediaUploadManager;
import  com.ydcrackerpackages.image.WaveImage;
import  com.ydcrackerpackages.chat.MessagesLister;
import  com.ydcrackerpackages.Utilities.YdcExtraDimensionsModule;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.ArrayList;

public class YdcPackage implements ReactPackage {
	 @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        List<NativeModule> modules = new ArrayList<>();
        modules.add(new YdcAudioManager(reactContext));
        modules.add(new YdcImageManager(reactContext));
        modules.add(new YdcExtraDimensionsModule(reactContext));        
        modules.add(new YdcAndroidUtilitiesManager(reactContext));
        modules.add(new MediaUploadManager(reactContext));
        modules.add(new YdSharedPreferences(reactContext));
        return modules;
    }

    // Deprecated from RN 0.47
    public List<Class<? extends JavaScriptModule>> createJSModules() {
        return Collections.emptyList();
    }

    @Override
    public List<ViewManager> createViewManagers(
                            ReactApplicationContext reactContext) {
	    return Arrays.<ViewManager>asList(
          new CheckBoxSquareManager(reactContext),
          new CheckBoxManager(reactContext),
          new CheckBoxTManager(reactContext),          
          new WheelPickerManager(reactContext),
          new WaveImage(reactContext),
          new MessagesLister(reactContext),
          new CircularRevealViewManager(),
          new DNSwitchManager()       
	    );
    }
}