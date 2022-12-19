package com.ydcrackerpackages.image;

import android.content.Context;
import android.graphics.Color;
import android.graphics.drawable.Drawable;
import android.graphics.Typeface;
import android.view.Gravity;
import android.view.View;
import android.util.Log;
import android.view.ViewGroup;
import android.widget.ImageButton;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.TextView;
import androidx.annotation.Nullable;
import androidx.core.graphics.drawable.DrawableCompat;
import androidx.core.content.ContextCompat;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableArray;

import com.skydoves.powermenu.PowerMenuItem;
import com.skydoves.powermenu.PowerMenu;
import com.skydoves.powermenu.MenuAnimation;
import com.skydoves.powermenu.OnMenuItemClickListener;

import com.ydcrackerpackages.R;
import com.ydcrackerpackages.picker.Utils;
import com.ydcrackerpackages.util.AndroidUtilities;

class HeaderMenu extends RelativeLayout {  
  int currentPosition = 0;
  int totalCount= 0;
  TextView counterIndex;
  String tempString;
  PowerMenu powerMenu;


  private int backBtnWidth;
  private int counterWidth;
  private int contextMenuWidth;
  private int maxWidth;

  HeaderNormalListener mHeaderNormalListener;

  HeaderMenu(Context context){
      super(context);
      maxWidth = context.getResources().getDisplayMetrics().widthPixels;        
      backBtnWidth = 5*maxWidth/100;
      contextMenuWidth = 20*maxWidth/100;
      counterWidth = 75*maxWidth/100;       
      //Align Parent Top
      LayoutParams parentTop = new LayoutParams(LayoutParams.WRAP_CONTENT, LayoutParams.WRAP_CONTENT);        
      parentTop.addRule(RelativeLayout.ALIGN_PARENT_TOP);
      setLayoutParams(parentTop);        
      getLayoutParams().height = 130 + AndroidUtilities.statusBarHeight;
      setBackgroundColor(Color.argb(100, 0, 0, 0));      

      LinearLayout  mainContainer = new LinearLayout(context);      
      LinearLayout.LayoutParams mainContainerParams = new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.MATCH_PARENT);
      mainContainerParams.topMargin = AndroidUtilities.statusBarHeight;      
      mainContainer.setLayoutParams(mainContainerParams);
      mainContainer.getLayoutParams().height = 130;
      mainContainer.setGravity(Gravity.CENTER_VERTICAL);
      
      //Navigation Bar Icon
      LinearLayout backBtnContainer = new LinearLayout(context);
      LinearLayout.LayoutParams backBtnContainerParams = new LinearLayout.LayoutParams(LinearLayout.LayoutParams.WRAP_CONTENT, LinearLayout.LayoutParams.WRAP_CONTENT);
      backBtnContainerParams.weight = backBtnWidth;
      backBtnContainer.setLayoutParams(backBtnContainerParams);
      backBtnContainer.setGravity(Gravity.CENTER_VERTICAL);

      ImageButton backBtn = new ImageButton(context);
      LinearLayout.LayoutParams btnParams = new LinearLayout.LayoutParams(LinearLayout.LayoutParams.WRAP_CONTENT, LinearLayout.LayoutParams.WRAP_CONTENT);
      btnParams.setMargins(30, 0, 30, 0);
      backBtn.setLayoutParams(btnParams);
      backBtn.getLayoutParams().height = Utils.dp2px(30);
      backBtn.getLayoutParams().width = Utils.dp2px(30);
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
      LinearLayout counterContainer = new LinearLayout(context);
      LinearLayout.LayoutParams counterContainerParams = new LinearLayout.LayoutParams(LinearLayout.LayoutParams.WRAP_CONTENT, LinearLayout.LayoutParams.WRAP_CONTENT);
      counterContainerParams.weight = counterWidth;
      counterContainer.setLayoutParams(counterContainerParams);
      counterContainer.setGravity(Gravity.CENTER_VERTICAL);
      counterIndex = new TextView(context);
      counterIndex.setTextColor(Color.WHITE);
      counterIndex.setTextAlignment(TEXT_ALIGNMENT_TEXT_START);
      counterIndex.setTextSize(18);

      counterContainer.addView(counterIndex);

      //Menu Icon
      ImageButton menuBtn = new ImageButton(context);
      LinearLayout.LayoutParams menuBtnParams = new LinearLayout.LayoutParams(LinearLayout.LayoutParams.WRAP_CONTENT, LinearLayout.LayoutParams.WRAP_CONTENT);
      menuBtnParams.setMargins(30, 0, 30, 0);
      menuBtn.setLayoutParams(menuBtnParams);
      menuBtn.getLayoutParams().height = Utils.dp2px(30);
      menuBtn.getLayoutParams().width = Utils.dp2px(30);;
      menuBtn.setColorFilter(Color.argb(255, 255, 255, 255));
      menuBtn.setBackgroundResource(R.drawable.menu_vertical_circle);
      Drawable buttonDrawable2 = menuBtn.getBackground();
      buttonDrawable2 = DrawableCompat.wrap(buttonDrawable2);
      DrawableCompat.setTint(buttonDrawable2, Color.WHITE);
      menuBtn.setBackground(buttonDrawable2);
      menuBtn.setOnClickListener(new OnClickListener() {
          @Override
          public void onClick(View view) {
              powerMenu.showAsDropDown(view);
          }
      });

      RelativeLayout menu = new RelativeLayout(context);
      RelativeLayout.LayoutParams menuParams = new RelativeLayout.LayoutParams(RelativeLayout.LayoutParams.WRAP_CONTENT, RelativeLayout.LayoutParams.WRAP_CONTENT);
      menuParams.addRule(RelativeLayout.ALIGN_PARENT_BOTTOM);      
      menu.addView(menuBtn);

      mainContainer.addView(backBtnContainer);
      mainContainer.addView(counterContainer);
      mainContainer.addView(menu);

      powerMenu = new PowerMenu.Builder(context)
              .setAnimation(MenuAnimation.SHOWUP_TOP_RIGHT) // Animation start point (TOP | LEFT).
              .setMenuRadius(10f) // sets the corner radius.
              .setMenuShadow(10f) // sets the shadow.
              .setTextColor(ContextCompat.getColor(context, R.color.white))
              .setTextGravity(Gravity.CENTER)
              .setShowBackground(false)
              .setOnMenuItemClickListener(new OnMenuItemClickListener<PowerMenuItem>() {
                  @Override
                  public void onItemClick(int position, PowerMenuItem item) {
                      powerMenu.dismiss();
                      if(mHeaderNormalListener != null){
                          mHeaderNormalListener.onMenuItemClick(position,item.getTitle());
                      }
                  }
              })
              .setSelectedTextColor(Color.WHITE)
              .setTextTypeface(Typeface.create("sans-serif-medium", Typeface.NORMAL))
              .setMenuColor(Color.parseColor("#636668"))
              .setSelectedMenuColor(getResources().getColor(R.color.colorPrimary))
              .build();

      addView(mainContainer);
  }

    public void setTotal(int total){
        totalCount = total;
        tempString = currentPosition+" of "+total;
        counterIndex.setText(tempString);
    }
    public void setPagination(int current, int total){
        currentPosition = current;
        totalCount = total;
        tempString = current+" of "+total;
        counterIndex.setText(tempString);
    }
    public void setCurrent(int current){
        currentPosition = current;
        tempString = current+" of "+totalCount;
        counterIndex.setText(tempString);
    }

    public void setMenuItems(ReadableArray items){
      for (int i = 0; i < items.size(); i++){
          ReadableMap item = items.getMap(i);
          powerMenu.addItem(new PowerMenuItem(item.getString("title"), getResourceIdFromString(item.getString("icon"))));
      }
    }

    private int getResourceIdFromString(@Nullable String icon){
      if(icon != null){
          switch (icon){
            case "save":
              return R.drawable.download;
            case "edit":
              return R.drawable.edit;
            case "delete":
              return R.drawable.delete2;
            case "send":
              return R.drawable.outline_send;  
            default:
              return R.drawable.outline_send;
          }
      }else {
          return R.drawable.attach_send;
      }
    }

    public void setOnAnyClickListener(HeaderNormalListener listner){
        mHeaderNormalListener = listner;
    }
}