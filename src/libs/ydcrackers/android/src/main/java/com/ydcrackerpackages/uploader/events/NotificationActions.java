package com.ydcrackerpackages.uploader.events;

import android.app.PendingIntent;
import android.widget.Toast;
import android.content.Context;
import android.content.Intent;
import com.ydcrackerpackages.uploader.events.NotificationActionsReceiver;

/**
 * @author Aleksandar Gotev
 */

public class NotificationActions {        
    public static String INTENT_ACTION = "com.ydcrackerpackages.uploader.events.notification.action";
    protected static final String PARAM_ACTION = "action";
    protected static final String PARAM_UPLOAD_ID = "uploadId";

    protected static final String ACTION_CANCEL_UPLOAD = "cancelUpload";

    private NotificationActions() { }

    public static PendingIntent getCancelUploadAction(final Context context,
                                                      final int requestCode,
                                                      final String uploadID) { 
        Intent intent = android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O ? 
                         new Intent(context, NotificationActionsReceiver.class) :
                         new Intent(INTENT_ACTION);           
        intent.putExtra(PARAM_ACTION, ACTION_CANCEL_UPLOAD);
        intent.putExtra(PARAM_UPLOAD_ID, uploadID);        
      
        return PendingIntent.getBroadcast(context, requestCode, intent, PendingIntent.FLAG_CANCEL_CURRENT);
    }
}
