package com.twohearts;

import android.app.Application;
import android.content.Context;

import androidx.appcompat.app.AppCompatDelegate;
import androidx.multidex.MultiDex;
import android.os.Build;
import android.app.NotificationChannel;
import android.app.NotificationManager;

// import com.evernote.android.job.JobManager;
import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;

import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;


//Image Viewer Initailizations
import com.github.piasy.biv.loader.glide.GlideImageLoader;
import com.github.piasy.biv.BigImageViewer;
import com.facebook.drawee.backends.pipeline.Fresco;

//Own 
// import com.twohearts.chat.utils.MyMigration;
// import com.twohearts.chat.utils.SharedPreferencesManager;
import com.ydcrackerpackages.YdcPackage;
import com.ydc.downloader.ReactDownloaderPackage;
import net.gotev.uploadservice.UploadService;

import java.lang.reflect.InvocationTargetException;
import java.util.List;

// import io.realm.Realm;
// import io.realm.RealmConfiguration;

// import com.twohearts.chat.TwChatPackage;

public class MainApplication extends Application implements ReactApplication {
  private static MainApplication mApp = null;
  private static String currentChatId = "";
  private static boolean chatActivityVisible;
  private static boolean phoneCallActivityVisible;
  private static boolean baseActivityVisible;
  private static boolean isCallActive = false;
  
  private final ReactNativeHost mReactNativeHost =
      new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
          return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
          List<ReactPackage> packages = new PackageList(this).getPackages();
          // Packages that cannot be autolinked yet can be added manually here, for example:
          packages.add(new ReactDownloaderPackage());
          packages.add(new YdcPackage());
          return packages;
        }

        @Override
        protected String getJSMainModuleName() {
          return "index";
        }
      };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
    Fresco.initialize(this);
    BigImageViewer.initialize(GlideImageLoader.with(this));
    createNotificationChannel();    
    UploadService.NAMESPACE = "com.ydcrackerpackages";

    //add support for vector drawables on older APIs
    AppCompatDelegate.setCompatVectorFromResourcesEnabled(true);
    //init realm
    // Realm.init(this);
    //init set realm configs
    // RealmConfiguration realmConfiguration = new RealmConfiguration.Builder()
    //         .schemaVersion(MyMigration.SCHEMA_VERSION)
    //         .migration(new MyMigration())
    //         .build();
    // Realm.setDefaultConfiguration(realmConfiguration);
    //init shared prefs manager
    //SharedPreferencesManager.init(this);
    //init evernote job
    // JobManager.create(this).addJobCreator(new com.twohearts.chat.job.FireJobCreator());

    mApp = this;
  }

  private void createNotificationChannel() {
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O){
        CharSequence name = "Upload Notification";
        String description = "Uploading All Files to Server";
        int importance = NotificationManager.IMPORTANCE_DEFAULT;

        NotificationChannel notificationChannel = new NotificationChannel("upload_photos", name, importance);
        notificationChannel.setDescription(description);
        notificationChannel.setSound(null, null);
        NotificationManager notificationManager = (NotificationManager)getSystemService(NOTIFICATION_SERVICE);
        notificationManager.createNotificationChannel(notificationChannel);
    }
  }

  /**
   * Loads Flipper in React Native templates. Call this in the onCreate method with something like
   * initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
   */
  private static void initializeFlipper(
      Context context, ReactInstanceManager reactInstanceManager) {
    if (BuildConfig.DEBUG) {
      try {
        /*
         We use reflection here to pick up the class that initializes Flipper,
        since Flipper library is not available in release mode
        */
        Class<?> aClass = Class.forName("com.twohearts.ReactNativeFlipper");
        aClass
            .getMethod("initializeFlipper", Context.class, ReactInstanceManager.class)
            .invoke(null, context, reactInstanceManager);
      } catch (ClassNotFoundException | InvocationTargetException | NoSuchMethodException | IllegalAccessException e) {
        e.printStackTrace();
      }
    }
  }


  //Chat Application Part 

  public static boolean isChatActivityVisible() {
      return chatActivityVisible;
  }

  public static String getCurrentChatId() {
      return currentChatId;
  }

  public static void chatActivityResumed(String chatId) {
      chatActivityVisible = true;
      currentChatId = chatId;
  }

  public static void chatActivityPaused() {
      chatActivityVisible = false;
      currentChatId = "";
  }

  public static boolean isPhoneCallActivityVisible() {
      return phoneCallActivityVisible;
  }

  public static void phoneCallActivityResumed() {
      phoneCallActivityVisible = true;
  }

  public static void phoneCallActivityPaused() {
      phoneCallActivityVisible = false;
  }


  public static boolean isBaseActivityVisible() {
      return baseActivityVisible;
  }

  public static void baseActivityResumed() {
      baseActivityVisible = true;
  }

  public static void baseActivityPaused() {
      baseActivityVisible = false;
  }


  public static void setCallActive(boolean mCallActive) {
      isCallActive = mCallActive;
  }

  public static boolean isIsCallActive() {
      return isCallActive;
  }

  public static Context context() {
        return mApp.getApplicationContext();
    }

    //to run multi dex
    @Override
    protected void attachBaseContext(Context base) {
        super.attachBaseContext(base);
        MultiDex.install(this);
    }
}
