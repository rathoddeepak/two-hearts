package com.twohearts;

import android.content.Context;
import android.app.NotificationManager;

import com.facebook.react.ReactActivity;
import java.io.File;
public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "TwoHearts";
  }

  @Override
  protected void onDestroy() {
  	super.onDestroy();
  	NotificationManager notificationManager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
  	notificationManager.cancelAll();
    
    String APPDIR =  getApplicationContext().getExternalFilesDir(null).toString()+"/outputs/";
    File fdelete = new File(APPDIR);
    if (fdelete.exists()) fdelete.delete();
  }
  
}
