package com.ydcrackerpackages.uploader.events;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.util.Log;
import android.widget.Toast;
import net.gotev.uploadservice.UploadService;


public class NotificationActionsReceiver extends BroadcastReceiver {

    @Override
    public void onReceive(Context context, Intent intent) {            
        if (intent == null) {                        
            return;
        }
        if(android.os.Build.VERSION.SDK_INT < android.os.Build.VERSION_CODES.O){
            if(!NotificationActions.INTENT_ACTION.equals(intent.getAction())){
                return;
            }
        }

        if (NotificationActions.ACTION_CANCEL_UPLOAD.equals(intent.getStringExtra(NotificationActions.PARAM_ACTION))) {
            Toast.makeText(context,"Please wait, a minute", Toast.LENGTH_LONG).show();
            onUserRequestedUploadCancellation(context, intent.getStringExtra(NotificationActions.PARAM_UPLOAD_ID));
        }

    }

    private void onUserRequestedUploadCancellation(Context context, String uploadId) {        
        Intent closeDialog = new Intent(Intent.ACTION_CLOSE_SYSTEM_DIALOGS);
        context.sendBroadcast(closeDialog);
        UploadService.stopUpload(uploadId);
    }
}
