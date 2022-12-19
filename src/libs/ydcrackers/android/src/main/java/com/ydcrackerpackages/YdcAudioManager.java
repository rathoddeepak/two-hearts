package com.ydcrackerpackages;

import android.os.Handler;
import android.os.Vibrator;
import android.os.Environment;
import android.os.Looper;
import android.content.Context;
import android.media.MediaRecorder;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.bridge.LifecycleEventListener;

import java.util.ArrayList;
import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;

import com.ydcrackerpackages.Utilities.Helper;

public class YdcAudioManager extends ReactContextBaseJavaModule implements LifecycleEventListener {

	public static ReactApplicationContext reactContext;

	private String currentOutFile;
    private MediaRecorder audioRecorder;
    private boolean isRecording;
    private boolean halted = false;    
	public static final int REPEAT_INTERVAL = 100;
	private Handler handler = new Handler(Looper.getMainLooper()); // Handler for updating the // visualizer
	
    public YdcAudioManager(ReactApplicationContext context) {
        super(context);  
        reactContext = context;        
        reactContext.addLifecycleEventListener(this);
    }

    @Override
    public String getName() {
        return "AudioManger";
    }

	@ReactMethod
	public void startAudioRecording(final Callback failure) {		
		if (Helper.getHelperInstance().createRecordingFolder()) {
			SimpleDateFormat dateFormat = new SimpleDateFormat("yyyyMMdd_HH_mm_ss");
			String currentTimeStamp = dateFormat.format(new Date());
			currentOutFile = Helper.RECORDING_PATH+ "/recording_" + currentTimeStamp + ".3gp";
			audioRecorder = new MediaRecorder();
			audioRecorder.setAudioSource(MediaRecorder.AudioSource.MIC);
			audioRecorder.setOutputFormat(MediaRecorder.OutputFormat.THREE_GPP);
			audioRecorder.setAudioEncoder(MediaRecorder.OutputFormat.AMR_NB);
			audioRecorder.setOutputFile(currentOutFile);
			try {
				audioRecorder.prepare();
				audioRecorder.start();
				isRecording = true;
				handler.post(updateVisualizer);
			}catch (IllegalStateException e) {				
				isRecording = false;
				failure.invoke(e.toString());
			}catch (IOException e) {
				isRecording = false;
				failure.invoke(e.toString());	
			}
		} else {
			failure.invoke("path error");
			isRecording = false;
		}
	}

	@ReactMethod
	public void Vibrate(int times) {
		((Vibrator) reactContext.getSystemService(Context.VIBRATOR_SERVICE)).vibrate(times);
	}

	@ReactMethod
	public void stopAudioRecording(Boolean delete, final Promise promise) {		
		try {
			if (null != audioRecorder) {
				audioRecorder.stop();
				audioRecorder.release();
				audioRecorder = null;
				handler.removeCallbacks(updateVisualizer);
				if(delete){					
					File recording = new File(currentOutFile);
					if (recording.exists() && recording.delete()) {
						promise.resolve(currentOutFile);
					} else {
						promise.reject("not found");
					}
				}else{
					promise.resolve(currentOutFile);
				}				
			}

		} catch (Exception e) {
			promise.reject(e.toString());
		}
	}

	@Override
	public void onHostPause() {
		// TODO Auto-generated method stub		
		if (isRecording) {

			try {
				if (null != audioRecorder) {
					audioRecorder.stop();
					audioRecorder.release();
					audioRecorder = null;
					halted = true;
					handler.removeCallbacks(updateVisualizer);
				}

			} catch (Exception e) {
				handler.removeCallbacks(updateVisualizer);
			}
		}
	}

	@Override
	public void onHostResume() {		
		if (halted) {
			WritableMap params = Arguments.createMap();
            params.putString("filePath", currentOutFile);
            sendEvent(reactContext, "onHaltResume", params);
		}
	}

	@Override
	public void onHostDestroy() {
		if (null != audioRecorder) {
			audioRecorder.stop();
			audioRecorder.release();				
			handler.removeCallbacks(updateVisualizer);
	    }
	}

	// updates the visualizer every 50 milliseconds
	Runnable updateVisualizer = new Runnable() {
		@Override
		public void run() {
			if (isRecording) // if we are already recording
			{
				if(null != audioRecorder){
					// get the current amplitude
					int x = audioRecorder.getMaxAmplitude();
					
					WritableMap params = Arguments.createMap();
	                params.putInt("amplitude", x);
	                sendEvent(reactContext, "onAmplitude", params);

					//visualizerView.addAmplitude(x); // update the VisualizeView
					//visualizerView.invalidate(); // refresh the VisualizerView

					// update in 40 milliseconds
					handler.postDelayed(this, REPEAT_INTERVAL);
				}else{
					handler.removeCallbacks(updateVisualizer);
				}

			}
		}
	};

	private void sendEvent(ReactContext reactContext,String eventName,@Nullable WritableMap params) {
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, params);
    }

}