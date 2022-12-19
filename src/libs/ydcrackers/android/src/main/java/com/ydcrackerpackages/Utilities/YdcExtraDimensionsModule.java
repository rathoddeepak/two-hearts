package com.ydcrackerpackages.Utilities;

import java.lang.Math;
import java.lang.reflect.InvocationTargetException;

import android.content.Context;
import android.os.Build;
import android.os.Handler;
import android.os.Looper;
import android.app.Activity;
import android.util.DisplayMetrics;
import android.view.Display;
import android.view.View;
import android.provider.Settings;
import android.content.res.Resources;
import android.view.WindowManager;
import android.view.ViewConfiguration;
import android.graphics.Point;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactContextBaseJavaModule;

import java.util.HashMap;
import java.util.Map;
import java.lang.Math;
import java.lang.reflect.Field;

public class YdcExtraDimensionsModule extends ReactContextBaseJavaModule {

    private ReactContext mReactContext;
    private float density;
    private int usableHeight;
    final Map<String, Object> constants =  new HashMap<>();
    public YdcExtraDimensionsModule(ReactApplicationContext reactContext) {
        super(reactContext);
        mReactContext = reactContext;        
        density = mReactContext.getResources().getDisplayMetrics().density;
        setConstant2();
    }

    @Override
    public String getName() {
        return "ExtraDimensions";
    }

    @Override
    public Map<String, Object> getConstants() {        
        final Context ctx = getReactApplicationContext();
        final DisplayMetrics metrics = ctx.getResources().getDisplayMetrics();

        // Get the real display metrics if we are using API level 17 or higher.
        // The real metrics include system decor elements (e.g. soft menu bar).
        //
        // See: http://developer.android.com/reference/android/view/Display.html#getRealMetrics(android.util.DisplayMetrics)
        if (Build.VERSION.SDK_INT >= 17) {
            Display display = ((WindowManager) mReactContext.getSystemService(Context.WINDOW_SERVICE))
                    .getDefaultDisplay();
            try {
                Display.class.getMethod("getRealMetrics", DisplayMetrics.class).invoke(display, metrics);
            } catch (InvocationTargetException e) {
            } catch (IllegalAccessException e) {
            } catch (NoSuchMethodException e) {
            }
        }

        constants.put("REAL_WINDOW_HEIGHT", getRealHeight(metrics));
        constants.put("REAL_WINDOW_WIDTH", getRealWidth(metrics));
        constants.put("STATUS_BAR_HEIGHT", getStatusBarHeight(metrics));
        constants.put("SOFT_MENU_BAR_HEIGHT", getSoftMenuBarHeight(metrics));
        constants.put("SMART_BAR_HEIGHT", getSmartBarHeight(metrics));
        constants.put("SOFT_MENU_BAR_ENABLED", hasPermanentMenuKey());
        
        return constants;
    }

    @ReactMethod
    public void appUsableHeight(final Callback c){
    
        getCurrentActivity().runOnUiThread(new Runnable() {
          @Override
          public void run()
          {
             View rootView =  getCurrentActivity().getWindow().getDecorView().getRootView();
             c.invoke(px(rootView.getMeasuredHeight()));
          }
        });
    }

   // @ReactMethod
    //public void setConstant(){
        //Handler handler = new Handler();
        //handler.postDelayed(new Runnable() {
            //@Override
            //public void run() {
                //View rootView =  getCurrentActivity().getWindow().getDecorView().getRootView();
                //constants.put("USABLE_HEIGHT", px(rootView.getMeasuredHeight()));
            //}
        //}, 300);
   // }

    
    public void setConstant2(){
        Handler handler = new Handler(Looper.getMainLooper());
        Runnable runnable = new Runnable() {
            @Override
            public void run() { 
                Activity activity = getCurrentActivity();
                if (activity != null) {
                    View rootView =  activity.getWindow().getDecorView().getRootView();
                    constants.put("USABLE_HEIGHT", px(rootView.getMeasuredHeight()));                
                }else{
                    handler.postDelayed(this, 300);
                }
            }
        };
        handler.postDelayed(runnable, 300);     
    }

    public int px(float value) {
        if (value == 0) {
            return 0;
        }
        return (int) Math.floor(value/density);
    }

    private boolean hasPermanentMenuKey() {
        final Context ctx = getReactApplicationContext();
        int id = ctx.getResources().getIdentifier("config_showNavigationBar", "bool", "android");
        return !(id > 0 && ctx.getResources().getBoolean(id));
    }

    private float getStatusBarHeight(DisplayMetrics metrics) {
        final Context ctx = getReactApplicationContext();
        final int heightResId = ctx.getResources().getIdentifier("status_bar_height", "dimen", "android");
        return
          heightResId > 0
            ? ctx.getResources().getDimensionPixelSize(heightResId) / metrics.density
            : 0;
    }

    private float getSoftMenuBarHeight(DisplayMetrics metrics) {
        if(hasPermanentMenuKey()) {
            return 0;
        }
        final Context ctx = getReactApplicationContext();
        final int heightResId = ctx.getResources().getIdentifier("navigation_bar_height", "dimen", "android");
        return
          heightResId > 0
            ? ctx.getResources().getDimensionPixelSize(heightResId) / metrics.density
            : 0;
    }

    private float getRealHeight(DisplayMetrics metrics) {
        return metrics.heightPixels / metrics.density;
    }

    private float getRealWidth(DisplayMetrics metrics) {
        return metrics.widthPixels / metrics.density;
    }

    // 获取魅族SmartBar高度
    private float getSmartBarHeight(DisplayMetrics metrics) {
        final Context context = getReactApplicationContext();
        final boolean isMeiZu = Build.MANUFACTURER.equals("Meizu");
 
        final boolean autoHideSmartBar = Settings.System.getInt(context.getContentResolver(),
            "mz_smartbar_auto_hide", 0) == 1;
 
        if (!isMeiZu || autoHideSmartBar) {
            return 0;
        }
        try {
            Class c = Class.forName("com.android.internal.R$dimen");
            Object obj = c.newInstance();
            Field field = c.getField("mz_action_button_min_height");
            int height = Integer.parseInt(field.get(obj).toString());
            return context.getResources().getDimensionPixelSize(height) / metrics.density;
        } catch (Throwable e) { // 不自动隐藏smartbar同时又没有smartbar高度字段供访问，取系统navigationbar的高度
            return getNormalNavigationBarHeight(context) / metrics.density;
        }
        //return getNormalNavigationBarHeight(context) / metrics.density;
    }
 
    protected static float getNormalNavigationBarHeight(final Context ctx) {
        try {
            final Resources res = ctx.getResources();
            int rid = res.getIdentifier("config_showNavigationBar", "bool", "android");
            if (rid > 0) {
                boolean flag = res.getBoolean(rid);
                if (flag) {
                    int resourceId = res.getIdentifier("navigation_bar_height", "dimen", "android");
                    if (resourceId > 0) {
                        return res.getDimensionPixelSize(resourceId);
                    }
                }
            }
        } catch (Throwable e) {
            return 0;
        }
        return 0;
    }
}