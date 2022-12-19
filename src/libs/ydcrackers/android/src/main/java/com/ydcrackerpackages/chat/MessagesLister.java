package com.ydcrackerpackages.chat;

import android.view.ViewGroup;
import androidx.annotation.Nullable;

import com.stfalcon.chatkit.commons.ImageLoader;
import com.stfalcon.chatkit.messages.MessageInput;
import com.stfalcon.chatkit.messages.MessagesList;
import com.stfalcon.chatkit.messages.MessagesListAdapter;
import com.stfalcon.chatkit.utils.DateFormatter;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.bridge.UiThreadUtil;

import com.bumptech.glide.Glide;
import java.util.Date;
public class MessagesLister extends SimpleViewManager<MessagesList> {
	public static final String CLASS_NAME = "MessagesList";
	public MessagesList messageList;
	public static ReactApplicationContext reactContext;
	private MessagesListAdapter<Message> adapter;
	private ImageLoader imageLoader;
	public MessagesLister(ReactApplicationContext context){
		reactContext = context;
	}

	@Override
	public String getName(){
		return CLASS_NAME;
	}

	@Override
	public MessagesList createViewInstance(ThemedReactContext context){        
        return new MessagesList(context);   
	}

	@ReactProp(name = "initialize")
	public void initialize(MessagesList messageList, String user_id) {
		if(messageList != null){				
			adapter = new MessagesListAdapter<>(user_id, imageLoader);
			adapter.setDateHeadersFormatter(new DateFormatter.Formatter() {
            @Override
            public String format(Date date) {
	                if (DateFormatter.isToday(date)) {
	                    return "Today";
	                } else if (DateFormatter.isYesterday(date)) {
	                    return "yesterday";
	                } else {
	                    return DateFormatter.format(date, DateFormatter.Template.STRING_DAY_MONTH_YEAR);
	                }
	            }
	        });
			messageList.setAdapter(adapter);
		}
    }

    @ReactProp(name = "addToStart")
	public void addToStart(MessagesList messageList, ReadableMap map) {			
		if(adapter != null && map.getBoolean("insert")){
			User u = new User("sdfsf", "sdfsdf", "dsf", true);
	        Message m = new Message("asda", u, map.getString("text"));
	        adapter.addToStart(m, true);	        	       
		}
    }

    @Override
    public void onDropViewInstance(MessagesList messagesList) {
        messagesList = null;
        adapter = null;
    }
}