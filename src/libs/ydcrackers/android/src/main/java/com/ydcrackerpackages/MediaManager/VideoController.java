package com.ydcrackerpackages.MediaManager;

import android.animation.ValueAnimator;
import android.content.Context;
import android.graphics.Color;
import android.graphics.drawable.Animatable;
import android.view.Gravity;
import android.view.View;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.TextView;

import androidx.appcompat.widget.AppCompatImageButton;
import androidx.vectordrawable.graphics.drawable.AnimatedVectorDrawableCompat;

import com.ydcrackerpackages.R;

public class VideoController extends LinearLayout {
    private Context context;
    private SeekBar seekBar;
    private int seekBarWidth;
    private ControlBtn controlBtn;
    private TextView timer;
    public VideoController(Context context, SeekBar.SeekBarListener listener, int bmargin){
        super(context);
        this.context = context;

        //DeviceDimensions
        int deviceWidth = context.getResources().getDisplayMetrics().widthPixels;
        int twenty = deviceWidth*15/100;
        int thirty = deviceWidth*30/100;
        seekBarWidth = deviceWidth*55/100;

        //Main Container

        RelativeLayout.LayoutParams mainParams = new RelativeLayout.LayoutParams(RelativeLayout.LayoutParams.MATCH_PARENT, RelativeLayout.LayoutParams.MATCH_PARENT);
        mainParams.addRule(RelativeLayout.ALIGN_PARENT_BOTTOM);
        mainParams.bottomMargin = bmargin;
        setLayoutParams(mainParams);
        getLayoutParams().height = 100;
        setOrientation(LinearLayout.HORIZONTAL);
        setGravity(Gravity.CENTER_VERTICAL | Gravity.CENTER_HORIZONTAL);
        setBackgroundColor(Color.parseColor("black"));

        //Play Pause Button
        LinearLayout controlBtnHolder = new LinearLayout(context);
        controlBtnHolder.setLayoutParams(new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.MATCH_PARENT));
        controlBtnHolder.getLayoutParams().width = twenty;
        controlBtnHolder.setGravity(Gravity.CENTER_VERTICAL | Gravity.CENTER_HORIZONTAL);
        controlBtn = new ControlBtn(context,true);
        controlBtnHolder.addView(controlBtn);

        //SeekBar
        seekBar = new SeekBar(context, listener);
        seekBar.setLayoutParams(new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.MATCH_PARENT));
        seekBar.getLayoutParams().width = seekBarWidth;
        seekBar.getLayoutParams().height = 50;

        //Timer View
        timer = new TextView(context);
        timer.setTextSize(12);
        timer.setTextColor(Color.parseColor("white"));
        timer.setText("0:0/0:0");
        timer.setLayoutParams(new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.MATCH_PARENT));
        timer.getLayoutParams().width = thirty;
        timer.setGravity(Gravity.CENTER_VERTICAL|Gravity.CENTER_HORIZONTAL);        
        timer.setTextAlignment(View.TEXT_ALIGNMENT_CENTER);

        addView(controlBtnHolder);
        addView(seekBar);
        addView(timer);
    }
    public VideoController(Context context){
        super(context);
    }
    public void setCurrentTime(long cTime, long tTime){

        int cnTime = ((int) cTime) / 1000;
        int tnTime = ((int) tTime) / 1000;

        String currentTime = ((cnTime % 3600) / 60)+":"+(cnTime % 60);
        String totalTime = ((tnTime % 3600) / 60)+":"+(tnTime % 60);
        String time = currentTime+"/"+totalTime;
        timer.setText(time);
    }
    public void setProgress(long bProgress, long total){
        double percent = ((double)bProgress/total)*100;
        double progress = seekBarWidth*percent/100;
        seekBar.setProgress(progress);

    }
    public void setBufferedProgress(long bProgress, long total){
        double percent = ((double)bProgress/total)*100;
        double progress = seekBarWidth*percent/100;
        seekBar.setBufferedProgress(progress);
    }
    public void togglePlay(boolean isPlaying){
        controlBtn.toggleView(isPlaying);
    }
    public void addClickListener(View.OnClickListener listener){
        controlBtn.setOnClickListener(listener);
    }

    public class ControlBtn extends AppCompatImageButton {
        private AnimatedVectorDrawableCompat avd;
        public ControlBtn(Context context, boolean state){
            super(context);
            setLayoutParams(new LinearLayout.LayoutParams(LinearLayout.LayoutParams.WRAP_CONTENT, LinearLayout.LayoutParams.MATCH_PARENT));
            getLayoutParams().width = 50;
            getLayoutParams().height = 50;
            avd = AnimatedVectorDrawableCompat.create(context, state ? R.drawable.play_to_pause : R.drawable.pause_to_play);
            setImageDrawable(avd);
            Animatable animatable = (Animatable) getDrawable();
            animatable.start();
        }
        public void toggleView(boolean isPlaying){
            avd = AnimatedVectorDrawableCompat.create(context, isPlaying ? R.drawable.play_to_pause : R.drawable.pause_to_play);
            setImageDrawable(avd);
            Animatable animatable = (Animatable) getDrawable();
            animatable.start();
        }
    }
}
