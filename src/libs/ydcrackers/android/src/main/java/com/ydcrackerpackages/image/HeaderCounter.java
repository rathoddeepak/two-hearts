package com.ydcrackerpackages.image;

import android.content.Context;

import android.graphics.Color;
import android.graphics.drawable.Drawable;

import android.view.Gravity;
import android.view.View;
import android.util.Log;
import android.view.ViewGroup;
import android.widget.ImageButton;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.facebook.react.bridge.ReadableMap;

import androidx.core.graphics.drawable.DrawableCompat;
import com.robinhood.ticker.TickerUtils;
import com.robinhood.ticker.TickerView;

import com.ydcrackerpackages.basic.CheckBoxT;
import com.ydcrackerpackages.R;
import com.ydcrackerpackages.util.AndroidUtilities;

class HeaderCounter extends RelativeLayout {    
    int currentPosition = 0;
    int totalCount= 0;
    int type = 1;
    int checkBoxCount = 0;
    boolean checked = false;
    TextView paginationIndex;
    TickerView tickerView;
    String tempString;
    int maxWidth;
    int currentCount = 0;
    int backBtnWidth;
    int paginationWidth;
    int counterWidth;
    int selectedCount = 0;
    private CheckBoxT checkBox;
    public final static int SINGLE_SELECTION = 1;
    public final static int MULTI_SELECTION = 2;

    HeaderNormalListener mHeaderNormalListener;
    HeaderCounter(Context context){
        super(context);
        maxWidth = context.getResources().getDisplayMetrics().widthPixels;        
        backBtnWidth = 15*maxWidth/100;
        paginationWidth = 35*maxWidth/100;
        counterWidth = 50*maxWidth/100;        
        //Align Parent Top
        LayoutParams parentTop = new LayoutParams(LayoutParams.WRAP_CONTENT, LayoutParams.WRAP_CONTENT);        
        parentTop.addRule(RelativeLayout.ALIGN_PARENT_TOP);
        setLayoutParams(parentTop);        
        getLayoutParams().height = 130 + AndroidUtilities.statusBarHeight;
        setBackgroundColor(Color.argb(100, 0, 0, 0));


        //Main Container
        LinearLayout mainContainer = new LinearLayout(context);
        LinearLayout.LayoutParams mainContainerParams = new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.MATCH_PARENT);
        mainContainerParams.topMargin = AndroidUtilities.statusBarHeight;
        mainContainer.setLayoutParams(mainContainerParams);
        mainContainer.getLayoutParams().height = 130;
        mainContainer.getLayoutParams().width = maxWidth;        
        mainContainer.setGravity(Gravity.CENTER_VERTICAL);
        

        //Navigation Bar Icon
        LinearLayout backBtnContainer = new LinearLayout(context);
        LinearLayout.LayoutParams backBtnContainerParams = new LinearLayout.LayoutParams(LinearLayout.LayoutParams.WRAP_CONTENT, LinearLayout.LayoutParams.WRAP_CONTENT);        
        backBtnContainer.setLayoutParams(backBtnContainerParams);
        backBtnContainer.getLayoutParams().width = backBtnWidth;
        backBtnContainer.setGravity(Gravity.CENTER_VERTICAL);

        ImageButton backBtn = new ImageButton(context);
        LinearLayout.LayoutParams btnParams = new LinearLayout.LayoutParams(LinearLayout.LayoutParams.WRAP_CONTENT, LinearLayout.LayoutParams.WRAP_CONTENT);
        btnParams.setMargins(30, 0, 30, 0);
        backBtn.setLayoutParams(btnParams);
        backBtn.getLayoutParams().height = 80;
        backBtn.getLayoutParams().width = 80;
        backBtn.setColorFilter(Color.argb(255, 255, 255, 255));
        backBtn.setBackgroundResource(R.drawable.navigation_left);
        backBtn.setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View view) {
                //On Back Button Pressed
                if(mHeaderNormalListener != null){
                    mHeaderNormalListener.onBackBtnPressListener();
                }
            }
        });
        Drawable buttonDrawable = backBtn.getBackground();
        buttonDrawable = DrawableCompat.wrap(buttonDrawable);
        DrawableCompat.setTint(buttonDrawable, Color.WHITE);
        backBtn.setBackground(buttonDrawable);

        backBtnContainer.addView(backBtn);

        //Pagination Indexed
        LinearLayout paginationContainer = new LinearLayout(context);
        LinearLayout.LayoutParams paginationContainerParams = new LinearLayout.LayoutParams(LinearLayout.LayoutParams.WRAP_CONTENT, LinearLayout.LayoutParams.WRAP_CONTENT);        
        paginationContainer.setLayoutParams(paginationContainerParams);
        paginationContainer.getLayoutParams().width = paginationWidth;
        paginationContainer.setGravity(Gravity.CENTER_VERTICAL);
        paginationIndex = new TextView(context);
        paginationIndex.setTextColor(Color.WHITE);
        paginationIndex.setTextAlignment(TEXT_ALIGNMENT_TEXT_START);
        paginationIndex.setTextSize(18);
        paginationContainer.addView(paginationIndex);

        //Selected or Not Selected As well as Counter
        LinearLayout counterContainer = new LinearLayout(context);
        LinearLayout.LayoutParams counterContainerParams = new LinearLayout.LayoutParams(LinearLayout.LayoutParams.WRAP_CONTENT, LinearLayout.LayoutParams.WRAP_CONTENT);       
        counterContainer.setLayoutParams(counterContainerParams);
        counterContainer.getLayoutParams().width = counterWidth;
        counterContainer.setGravity(Gravity.CENTER_VERTICAL | Gravity.CENTER_HORIZONTAL);

        tickerView = new TickerView(context);
        tickerView.setLayoutParams(new ViewGroup.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT));
        tickerView.getLayoutParams().width = counterWidth/2;
        tickerView.setCharacterLists(TickerUtils.provideNumberList());
        float spTextSize = 14;
        float textSize = spTextSize * getResources().getDisplayMetrics().scaledDensity;
        tickerView.setTextSize(textSize);
        tickerView.setTextAlignment(TEXT_ALIGNMENT_CENTER);
        tickerView.setTextColor(Color.WHITE);
        tickerView.setText("0 Selected");
        tickerView.setAnimationDuration(300);

        checkBox = new CheckBoxT(context, AndroidUtilities.dp(14));
        checkBox.setDrawBackgroundAsArc(6);
        checkBox.setLayoutParams(new ViewGroup.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT));        
        checkBox.setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View view) {
            	if(mHeaderNormalListener != null){
            		mHeaderNormalListener.onChecked(!checked);
            	}
                if(!checked){
                    setSelectedCount(selectedCount+1);
                }else if(selectedCount != 0){
                    setSelectedCount(selectedCount-1);
                }     
                setCheckBoxChecked(!checked);                
            }
        });
        counterContainer.addView(tickerView);
        counterContainer.addView(checkBox);

        mainContainer.addView(backBtnContainer);
        mainContainer.addView(paginationContainer);
        mainContainer.addView(counterContainer);
        tickerView.animate();
        addView(mainContainer);
    }
    public void setType(int type){
    	this.type = type;
        switch (type){
            case SINGLE_SELECTION:
                tickerView.setVisibility(View.GONE);
                break;
            case MULTI_SELECTION:
                break;
            default:
        }

    }

    //CheckBox Params
    public void setCheckBoxColor(ReadableMap map){
    	checkBox.setColor(map);
    }
    public void setCheckBoxChecked(int num, boolean checked) {
        this.checked = checked;
        checkBoxCount = num;
        checkBox.setChecked(num, checked, true);
    }

    public void setCheckBoxChecked(boolean checked) {
    	this.checked = checked;
        checkBox.setChecked(checked, true);        
    }

    public void setCheckBoxNum(int num) {
    	checkBoxCount = num;
        checkBox.setNum(num);
    }

    //Pagination Params
    public void setTotal(int total){
        totalCount = total;
        tempString = currentPosition+" of "+total;
        paginationIndex.setText(tempString);
    }
    public void setPagination(int current, int total){
        currentCount = current;
        totalCount = total;
        tempString = current+" of "+total;
        paginationIndex.setText(tempString);
    }
    public void setCurrent(int current){
        currentCount = current;
        tempString = current+" of "+totalCount;
        paginationIndex.setText(tempString);
    }

    public void setSelectedCount(int digits){
        if(digits == selectedCount){
            return;
        } else if(selectedCount > digits){
            tickerView.setPreferredScrollingDirection(TickerView.ScrollingDirection.UP);
        }else{
            tickerView.setPreferredScrollingDirection(TickerView.ScrollingDirection.DOWN);
        }
        selectedCount = digits;
        tickerView.setText(digits+ " Selected");
    }
    public void increaseCount(){
        tickerView.setPreferredScrollingDirection(TickerView.ScrollingDirection.UP);
        currentCount++;
        tickerView.setText(currentCount+ " Selected");
    }
    public void decreaseCount(){
        tickerView.setPreferredScrollingDirection(TickerView.ScrollingDirection.DOWN);
        currentCount--;
        tickerView.setText(Integer.toString(currentCount));
    }

    //Callback Params
    public void setOnAnyClickListener(HeaderNormalListener listener){
        mHeaderNormalListener = listener;
    }
}
