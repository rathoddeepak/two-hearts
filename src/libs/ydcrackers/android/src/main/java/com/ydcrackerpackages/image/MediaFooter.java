package com.ydcrackerpackages.image;

import android.content.Context;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.ImageButton;
import android.widget.RelativeLayout;
import android.widget.LinearLayout;
import android.graphics.Color;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;

import com.robinhood.ticker.TickerUtils;
import com.robinhood.ticker.TickerView;
import com.ydcrackerpackages.picker.Utils;
import com.ydcrackerpackages.util.AndroidUtilities;
import com.ydcrackerpackages.R;

class MediaFooter extends RelativeLayout {    
    TextView captionTitle;
    TextView captionDesc;
    TickerView commentCount;
    FooterNormalListener listener;
    String title = "";
    String desc = "";
    HeartView btnOne;
    MediaFooter(Context context){
        super(context);
        int maxWidth = context.getResources().getDisplayMetrics().widthPixels;
        //Absolute Helper
        int fourthPart = maxWidth/4;
        LayoutParams params = new LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.WRAP_CONTENT);
        params.addRule(ALIGN_PARENT_BOTTOM);
        setLayoutParams(params);        
        setGravity(Gravity.BOTTOM|Gravity.LEFT);
        getLayoutParams().height = 300;
        setY(context.getResources().getDisplayMetrics().heightPixels - 300);
        setBackgroundColor(Color.argb(100, 0, 0, 0));

        //Main Container
        LinearLayout container = new LinearLayout(context);
        container.setGravity(Gravity.CENTER_VERTICAL|Gravity.CENTER_HORIZONTAL);
        container.setLayoutParams(new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT));        
        container.setOrientation(LinearLayout.VERTICAL);

        // Caption Layer
        LinearLayout captionLayer = new LinearLayout(context);
        captionLayer.setOrientation(LinearLayout.VERTICAL);
        captionLayer.setLayoutParams(new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT));
        captionLayer.setGravity(Gravity.CENTER_VERTICAL|Gravity.CENTER_HORIZONTAL);
        captionLayer.getLayoutParams().width = maxWidth;
        captionTitle = new TextView(context);
        captionTitle.setTextSize(14);
        captionTitle.setText(title);
        captionTitle.setTextColor(Color.WHITE);
        captionTitle.setTextAlignment(TEXT_ALIGNMENT_CENTER);
        captionTitle.setGravity(Gravity.CENTER_HORIZONTAL);        
        captionDesc = new TextView(context);
        captionDesc.setTextSize(12);
        captionDesc.setTextColor(Color.GRAY);
        captionDesc.setText(desc);
        captionDesc.setTextAlignment(TEXT_ALIGNMENT_CENTER);
        captionDesc.setGravity(Gravity.CENTER_HORIZONTAL);
        captionLayer.addView(captionTitle);
        captionLayer.addView(captionDesc);

        //Media Buttons Layer
        LinearLayout mediaButtonsLayer = new LinearLayout(context);
        mediaButtonsLayer.setLayoutParams(new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT));
        mediaButtonsLayer.setGravity(Gravity.CENTER_VERTICAL|Gravity.CENTER_HORIZONTAL);
        mediaButtonsLayer.getLayoutParams().height = 180;

        //Button One Container -> Add Photo to Fav
        LinearLayout btnOneContainer = new LinearLayout(context);
        btnOneContainer.setLayoutParams(new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.MATCH_PARENT));
        btnOneContainer.getLayoutParams().width = fourthPart;
        btnOneContainer.setGravity(Gravity.CENTER_VERTICAL|Gravity.CENTER_HORIZONTAL);
        btnOne = new HeartView(context);
        btnOne.setLayoutParams(new ViewGroup.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT));
        btnOne.getLayoutParams().width = Utils.dp2px(25);
        btnOne.getLayoutParams().height = Utils.dp2px(25);
        //btnOne.normalizeState();
        btnOne.setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View view) {                
                if(listener != null)
                    listener.onHeartPress(btnOne.getCurrentState());
            }
        });
        btnOneContainer.addView(btnOne);
        /*Button Two Container -> Load Comments
        LinearLayout btnTwoContainer = new LinearLayout(context);
        btnTwoContainer.setLayoutParams(new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.MATCH_PARENT));
        btnTwoContainer.getLayoutParams().width = fourthPart;
        btnTwoContainer.setGravity(Gravity.CENTER_VERTICAL|Gravity.CENTER_HORIZONTAL);
        ImageButton btnTwo = new ImageButton(context);
        btnTwo.setLayoutParams(new ViewGroup.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT));
        btnTwo.getLayoutParams().width = 65;
        btnTwo.getLayoutParams().height = 65;
        btnTwo.setBackground(AndroidUtilities.getDrawable(context, "comment.png"));
        btnTwo.setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View view) {
                if(listener != null)
                    listener.onButtonPress("two");
            }
        });

        btnTwo.setColorFilter(Color.WHITE);
        commentCount = new TickerView(context);
        commentCount.setTextSize(14);
        commentCount.setTextColor(Color.WHITE);
        commentCount.setCharacterLists(TickerUtils.provideNumberList());
        commentCount.setTextAlignment(TEXT_ALIGNMENT_CENTER);
        btnTwoContainer.addView(btnTwo);
        btnTwoContainer.addView(commentCount);*/

        //Button Three Container -> Download Photo to gallery
        LinearLayout btnThreeContainer = new LinearLayout(context);
        btnThreeContainer.setLayoutParams(new LinearLayout.LayoutParams(LinearLayout.LayoutParams.WRAP_CONTENT, LinearLayout.LayoutParams.MATCH_PARENT));
        btnThreeContainer.getLayoutParams().width = fourthPart;
        btnThreeContainer.setGravity(Gravity.CENTER_VERTICAL|Gravity.CENTER_HORIZONTAL);
        ImageButton btnThree = new ImageButton(context);
        btnThree.setLayoutParams(new ViewGroup.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT));
        btnThree.getLayoutParams().width = Utils.dp2px(30);
        btnThree.getLayoutParams().height = Utils.dp2px(30);
        btnThree.setBackground(AndroidUtilities.getDrawable(context, "download.png"));
        btnThree.setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View view) {
                if(listener != null)
                    listener.onButtonPress("three");
            }
        });
        btnThreeContainer.addView(btnThree);
        //Button Four Container -> Send Image to Message
        LinearLayout btnFourContainer = new LinearLayout(context);
        btnFourContainer.setLayoutParams(new LinearLayout.LayoutParams(LinearLayout.LayoutParams.WRAP_CONTENT, LinearLayout.LayoutParams.MATCH_PARENT));
        btnFourContainer.getLayoutParams().width = fourthPart;
        btnFourContainer.setGravity(Gravity.CENTER_VERTICAL|Gravity.CENTER_HORIZONTAL);
        ImageButton btnFour = new ImageButton(context);
        btnFour.setLayoutParams(new ViewGroup.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT));
        btnFour.getLayoutParams().width = Utils.dp2px(25);
        btnFour.getLayoutParams().height = Utils.dp2px(25);
        btnFour.setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View view) {
                if(listener != null)
                    listener.onButtonPress("four");
            }
        });
        btnFour.setBackground(AndroidUtilities.getDrawable(context, "share.png"));
        btnFourContainer.addView(btnFour);

        mediaButtonsLayer.addView(btnOneContainer);
        //mediaButtonsLayer.addView(btnTwoContainer);
        mediaButtonsLayer.addView(btnThreeContainer);
        mediaButtonsLayer.addView(btnFourContainer);

        container.addView(captionLayer);
        container.addView(mediaButtonsLayer);
        addView(container);
    }
    public void setOnClickListener(FooterNormalListener listener) {
        this.listener = listener;
    }
    public void setCaption(String title){
        this.title = title;
        captionTitle.setText(title);
        captionTitle.setTextAlignment(TEXT_ALIGNMENT_CENTER);
    }
    public void setTime(String time){
        desc = time;
        captionDesc.setText(desc);
        captionDesc.setTextAlignment(TEXT_ALIGNMENT_CENTER);
    }
    public void setCommentCount(int count){
        commentCount.setText(" "+count);
    }
    public void setHeartState(int state, boolean addBounce){
        btnOne.normalizeState(state, addBounce);
    }
}