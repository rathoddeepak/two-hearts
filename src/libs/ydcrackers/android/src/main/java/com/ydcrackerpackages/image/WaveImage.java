package com.ydcrackerpackages.image;

//Steps 1: Create Create Class extending SimpleViewManger;
//Steps 2: Create Class extending view to defined custom view
//Steps 3: Register View by CreateViewMangers
import android.widget.ImageView;
import android.graphics.drawable.Drawable;
import android.graphics.drawable.BitmapDrawable;
import android.graphics.Bitmap;
import android.media.ThumbnailUtils;
import android.provider.MediaStore.Images.Thumbnails;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.ydcrackerpackages.basic.CircleCheckBox;
import com.ydcrackerpackages.R;
import com.ydcrackerpackages.image.WaveDrawable;
public class WaveImage extends SimpleViewManager<ImageView> {
	public static final String CLASS_NAME = "WaveImage";
	public WaveDrawable mWaveDrawable;
	public static ReactApplicationContext reactContext;
	public WaveImage(ReactApplicationContext context){
		reactContext = context;
	}
	@Override
	public String getName(){
		return CLASS_NAME;
	}

	@Override
	public ImageView createViewInstance(ThemedReactContext context){        
        return new ImageView(context);   
	}

	@ReactProp(name = "source")
	public void setImageDrawable(ImageView waveImage, String source) {
		Drawable mDrawable = null;
		if(source.endsWith("mp4") || source.endsWith("avi") || source.endsWith("flv") || source.endsWith("3gp") || source.endsWith("mkv") || source.endsWith("mpg") || source.endsWith("wmv")){
            Bitmap bitmap = ThumbnailUtils.createVideoThumbnail(source, Thumbnails.MINI_KIND);
		    mDrawable = new BitmapDrawable(reactContext.getResources(), bitmap);
        }else if(source.endsWith("jpg") || source.endsWith("jpeg") || source.endsWith("png") || source.endsWith("bmp") || source.endsWith("gif")){
            mDrawable = Drawable.createFromPath(source);
        }
        if(mDrawable != null){
        	mWaveDrawable = new WaveDrawable(mDrawable);
        	waveImage.setImageDrawable(mWaveDrawable);        	
        }		
    }

    @ReactProp(name = "amplitude")
	public void setWaveAmplitude(ImageView waveImage, int amplitude) {
		if(mWaveDrawable != null){
			mWaveDrawable.setWaveAmplitude(amplitude);
		}		
    }

    @ReactProp(name = "resizeMode")
	public void setScaleType(ImageView waveImage, int resizeMode) {
		switch (resizeMode) {
		 case 1:
		   waveImage.setScaleType(ImageView.ScaleType.CENTER);
		 break;
		 case 2:
		   waveImage.setScaleType(ImageView.ScaleType.CENTER_CROP);
		 break;
		 case 3:
		   waveImage.setScaleType(ImageView.ScaleType.CENTER_INSIDE);
		 break;
		 case 4:
		   waveImage.setScaleType(ImageView.ScaleType.FIT_CENTER);
		 break;
		 case 5:
		   waveImage.setScaleType(ImageView.ScaleType.FIT_END);
		 break;
		 case 6:
		   waveImage.setScaleType(ImageView.ScaleType.FIT_START);
		 break;
		 case 7:
		   waveImage.setScaleType(ImageView.ScaleType.FIT_XY);
		 break;
		 case 8:
		   waveImage.setScaleType(ImageView.ScaleType.MATRIX);
		 break;
		 default:
		   waveImage.setScaleType(ImageView.ScaleType.CENTER_CROP);
		}		
    }

    @ReactProp(name = "level")
	public void setLevel(ImageView waveImage, int level) {
		if(mWaveDrawable != null){
			mWaveDrawable.setLevel(level); 
		}		
    }

    @ReactProp(name = "waveLength")
	public void setWaveLength(ImageView waveImage, int lenth) {
		if(mWaveDrawable != null){
			mWaveDrawable.setWaveLength(lenth);
		}		
    }

    @ReactProp(name = "speed")
	public void setWaveSpeed(ImageView waveImage, int speed) {
		if(mWaveDrawable != null){
			mWaveDrawable.setWaveSpeed(speed);
		}		
    }

    @ReactProp(name = "indeterminate")
	public void setIndeterminate(ImageView waveImage, boolean indeterminate) {
		if(mWaveDrawable != null){
			mWaveDrawable.setIndeterminate(indeterminate);
		}		
    }

    @Override
    public void onDropViewInstance(ImageView waveImage) {
        waveImage = null;
    }
}