package com.ydcrackerpackages.basic;

import android.content.Context;
import android.content.res.TypedArray;
import android.graphics.Camera;
import android.graphics.Canvas;
import android.graphics.Matrix;
import android.graphics.Paint;
import android.graphics.Rect;
import android.graphics.Region;
import android.graphics.Typeface;
import android.os.Build;
import android.os.Handler;
import android.text.TextUtils;
import android.util.AttributeSet;
import android.util.Log;
import android.view.MotionEvent;
import android.view.VelocityTracker;
import android.view.View;
import android.view.ViewConfiguration;
import android.widget.Scroller;

import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.uimanager.events.RCTEventEmitter;

import java.util.Arrays;
import java.util.List;
import com.ydcrackerpackages.basic.IDebug;
import com.ydcrackerpackages.basic.IWheelPicker;
import com.ydcrackerpackages.R;
public class WheelPicker extends View implements IDebug, IWheelPicker, Runnable {
    /**
     * @see OnWheelChangeListener#onWheelScrollStateChanged(int)
     */
    public static final int SCROLL_STATE_IDLE = 0, SCROLL_STATE_DRAGGING = 1,
            SCROLL_STATE_SCROLLING = 2;

    /**
     * @see #setItemAlign(int)
     */
    public static final int ALIGN_CENTER = 0, ALIGN_LEFT = 1, ALIGN_RIGHT = 2;

    private static final String TAG = WheelPicker.class.getSimpleName();

    private final Handler mHandler = new Handler();

    private Paint mPaint;
    private Scroller mScroller;
    private VelocityTracker mTracker;
    /**
     * Determines whether the current scrolling animation is triggered by touchEvent or setSelectedItemPosition.
     * User added eventListeners will only be fired after touchEvents.
     */
    private boolean isTouchTriggered;

    /**
     * @see OnWheelChangeListener,OnItemSelectedListener
     */
    private OnItemSelectedListener mOnItemSelectedListener;
    private OnWheelChangeListener mOnWheelChangeListener;

    private Rect mRectDrawn;
    private Rect mRectIndicatorHead, mRectIndicatorFoot;
    private Rect mRectCurrentItem;

    private Camera mCamera;
    private Matrix mMatrixRotate, mMatrixDepth;


    private List mData;

    /**     
     *
     * @see #setMaximumWidthText(String)
     */
    private String mMaxWidthText;

    /**     
     *
     * @see #setVisibleItemCount(int)
     */
    private int mVisibleItemCount, mDrawnItemCount;


    private int mHalfDrawnItemCount;


    private int mTextMaxWidth, mTextMaxHeight;

    /**     
     *
     * @see #setItemTextColor(int)
     * @see #setSelectedItemTextColor(int)
     */
    private int mItemTextColor, mSelectedItemTextColor;

    /**     
     *
     * @see #setItemTextSize(int)
     */
    private int mItemTextSize;

    /**     
     *
     * @see #setIndicatorSize(int)
     */
    private int mIndicatorSize;

    /**     
     *
     * @see #setIndicatorColor(int)
     */
    private int mIndicatorColor;

    /**
     * ????????????
     *
     * @see #setCurtainColor(int)
     */
    private int mCurtainColor;

    /**     
     *
     * @see #setItemSpace(int)
     */
    private int mItemSpace;

    /**     
     *
     * @see #setItemAlign(int)
     */
    private int mItemAlign;


    private int mItemHeight, mHalfItemHeight;


    private int mHalfWheelHeight;

    /**     
     *
     * @see #setSelectedItemPosition(int)
     */
    private int mSelectedItemPosition;

    /**     
     *
     * @see #getCurrentItemPosition()
     */
    private int mCurrentItemPosition;


    private int mMinFlingY, mMaxFlingY;


    private int mMinimumVelocity = 50, mMaximumVelocity = 8000;


    private int mWheelCenterX, mWheelCenterY;


    private int mDrawnCenterX, mDrawnCenterY;


    private int mScrollOffsetY;


    private int mTextMaxWidthPosition;


    private int mLastPointY;


    private int mDownPointY;


    private int mTouchSlop = 8;

    /**     
     *
     * @see #setSameWidth(boolean)
     */
    private boolean hasSameWidth;

    /**     
     *
     * @see #setIndicator(boolean)
     */
    private boolean hasIndicator;

    /**     
     *
     * @see #setCurtain(boolean)
     */
    private boolean hasCurtain;

    /**     
     *
     * @see #setAtmospheric(boolean)
     */
    private boolean hasAtmospheric;

    /**     
     *
     * @see #setCyclic(boolean)
     */
    private boolean isCyclic;

    /**
     
     *
     * @see #setCurved(boolean)
     */
    private boolean isCurved;

    /**
     
     */
    private boolean isClick;

    /**
     
     */
    private boolean isForceFinishScroll;

    /**
     * Font typeface path from assets
     */
    private String fontPath;

    private boolean isDebug;

    public ReactContext reactContext;
    public WheelPicker(Context context) {
        this(context, null);        
        reactContext = (ReactContext) context;
    }

    public WheelPicker(Context context, AttributeSet attrs) {
        super(context, attrs);

        TypedArray a = context.obtainStyledAttributes(attrs, R.styleable.WheelPicker);
        int idData = a.getResourceId(R.styleable.WheelPicker_wheel_data, 0);
        mData = Arrays.asList(idData);
        mItemTextSize = a.getDimensionPixelSize(R.styleable.WheelPicker_wheel_item_text_size,
                getResources().getDimensionPixelSize(R.dimen.WheelItemTextSize));
        mVisibleItemCount = a.getInt(R.styleable.WheelPicker_wheel_visible_item_count, 7);
        mSelectedItemPosition = a.getInt(R.styleable.WheelPicker_wheel_selected_item_position, 0);
        hasSameWidth = a.getBoolean(R.styleable.WheelPicker_wheel_same_width, false);
        mTextMaxWidthPosition =
                a.getInt(R.styleable.WheelPicker_wheel_maximum_width_text_position, -1);
        mMaxWidthText = a.getString(R.styleable.WheelPicker_wheel_maximum_width_text);
        mSelectedItemTextColor = a.getColor
                (R.styleable.WheelPicker_wheel_selected_item_text_color, -1);
        mItemTextColor = a.getColor(R.styleable.WheelPicker_wheel_item_text_color, 0xFF888888);
        mItemSpace = a.getDimensionPixelSize(R.styleable.WheelPicker_wheel_item_space,
                getResources().getDimensionPixelSize(R.dimen.WheelItemSpace));
        isCyclic = a.getBoolean(R.styleable.WheelPicker_wheel_cyclic, false);
        hasIndicator = a.getBoolean(R.styleable.WheelPicker_wheel_indicator, false);
        mIndicatorColor = a.getColor(R.styleable.WheelPicker_wheel_indicator_color, 0xFFEE3333);
        mIndicatorSize = a.getDimensionPixelSize(R.styleable.WheelPicker_wheel_indicator_size,
                getResources().getDimensionPixelSize(R.dimen.WheelIndicatorSize));
        hasCurtain = a.getBoolean(R.styleable.WheelPicker_wheel_curtain, false);
        mCurtainColor = a.getColor(R.styleable.WheelPicker_wheel_curtain_color, 0x88FFFFFF);
        hasAtmospheric = a.getBoolean(R.styleable.WheelPicker_wheel_atmospheric, false);
        isCurved = a.getBoolean(R.styleable.WheelPicker_wheel_curved, false);
        mItemAlign = a.getInt(R.styleable.WheelPicker_wheel_item_align, ALIGN_CENTER);
        fontPath = a.getString(R.styleable.WheelPicker_wheel_font_path);
        a.recycle();

        
        // Update relevant parameters when the count of visible item changed
        updateVisibleItemCount();

        mPaint = new Paint(Paint.ANTI_ALIAS_FLAG | Paint.DITHER_FLAG | Paint.LINEAR_TEXT_FLAG);
        mPaint.setTextSize(mItemTextSize);

        if (fontPath != null) {
            Typeface typeface = Typeface.createFromAsset(context.getAssets(), fontPath);
            setTypeface(typeface);
        }

        
        // Update alignment of text
        updateItemTextAlign();

        
        // Correct sizes of text
        computeTextSize();

        mScroller = new Scroller(getContext());

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.DONUT) {
            ViewConfiguration conf = ViewConfiguration.get(getContext());
            mMinimumVelocity = conf.getScaledMinimumFlingVelocity();
            mMaximumVelocity = conf.getScaledMaximumFlingVelocity();
            mTouchSlop = conf.getScaledTouchSlop();
        }
        mRectDrawn = new Rect();

        mRectIndicatorHead = new Rect();
        mRectIndicatorFoot = new Rect();

        mRectCurrentItem = new Rect();

        mCamera = new Camera();

        mMatrixRotate = new Matrix();
        mMatrixDepth = new Matrix();
    }

    private void updateVisibleItemCount() {
        if (mVisibleItemCount < 2)
            throw new ArithmeticException("Wheel's visible item count can not be less than 2!");

        
        // Be sure count of visible item is odd number
        if (mVisibleItemCount % 2 == 0)
            mVisibleItemCount += 1;
        mDrawnItemCount = mVisibleItemCount + 2;
        mHalfDrawnItemCount = mDrawnItemCount / 2;
    }

    private void computeTextSize() {
        mTextMaxWidth = mTextMaxHeight = 0;
        if (hasSameWidth) {
            mTextMaxWidth = (int) mPaint.measureText(String.valueOf(mData.get(0)));
        } else if (isPosInRang(mTextMaxWidthPosition)) {
            mTextMaxWidth = (int) mPaint.measureText
                    (String.valueOf(mData.get(mTextMaxWidthPosition)));
        } else if (!TextUtils.isEmpty(mMaxWidthText)) {
            mTextMaxWidth = (int) mPaint.measureText(mMaxWidthText);
        } else {
            for (Object obj : mData) {
                String text = String.valueOf(obj);
                int width = (int) mPaint.measureText(text);
                mTextMaxWidth = Math.max(mTextMaxWidth, width);
            }
        }
        Paint.FontMetrics metrics = mPaint.getFontMetrics();
        mTextMaxHeight = (int) (metrics.bottom - metrics.top);
    }

    private void updateItemTextAlign() {
        switch (mItemAlign) {
            case ALIGN_LEFT:
                mPaint.setTextAlign(Paint.Align.LEFT);
                break;
            case ALIGN_RIGHT:
                mPaint.setTextAlign(Paint.Align.RIGHT);
                break;
            default:
                mPaint.setTextAlign(Paint.Align.CENTER);
                break;
        }
    }

    @Override
    protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
        int modeWidth = MeasureSpec.getMode(widthMeasureSpec);
        int modeHeight = MeasureSpec.getMode(heightMeasureSpec);

        int sizeWidth = MeasureSpec.getSize(widthMeasureSpec);
        int sizeHeight = MeasureSpec.getSize(heightMeasureSpec);

        
        // Correct sizes of original content
        int resultWidth = mTextMaxWidth;
        int resultHeight = mTextMaxHeight * mVisibleItemCount + mItemSpace * (mVisibleItemCount - 1);

        
        // Correct view sizes again if curved is enable
        if (isCurved) {
            resultHeight = (int) (2 * resultHeight / Math.PI);
        }
        if (isDebug)
            Log.i(TAG, "Wheel's content size is (" + resultWidth + ":" + resultHeight + ")");

        
        // Consideration padding influence the view sizes
        resultWidth += getPaddingLeft() + getPaddingRight();
        resultHeight += getPaddingTop() + getPaddingBottom();
        if (isDebug)
            Log.i(TAG, "Wheel's size is (" + resultWidth + ":" + resultHeight + ")");

        
        // Consideration sizes of parent can influence the view sizes
        resultWidth = measureSize(modeWidth, sizeWidth, resultWidth);
        resultHeight = measureSize(modeHeight, sizeHeight, resultHeight);

        setMeasuredDimension(resultWidth, resultHeight);
    }

    private int measureSize(int mode, int sizeExpect, int sizeActual) {
        int realSize;
        if (mode == MeasureSpec.EXACTLY) {
            realSize = sizeExpect;
        } else {
            realSize = sizeActual;
            if (mode == MeasureSpec.AT_MOST)
                realSize = Math.min(realSize, sizeExpect);
        }
        return realSize;
    }

    @Override
    protected void onSizeChanged(int w, int h, int oldW, int oldH) {        
        // Set content region
        mRectDrawn.set(getPaddingLeft(), getPaddingTop(), getWidth() - getPaddingRight(),
                getHeight() - getPaddingBottom());
        if (isDebug)
            Log.i(TAG, "Wheel's drawn rect size is (" + mRectDrawn.width() + ":" +
                    mRectDrawn.height() + ") and location is (" + mRectDrawn.left + ":" +
                    mRectDrawn.top + ")");

        
        // Get the center coordinates of content region
        mWheelCenterX = mRectDrawn.centerX();
        mWheelCenterY = mRectDrawn.centerY();

        
        // Correct item drawn center
        computeDrawnCenter();

        mHalfWheelHeight = mRectDrawn.height() / 2;

        mItemHeight = mRectDrawn.height() / mVisibleItemCount;
        mHalfItemHeight = mItemHeight / 2;

        
        // Initialize fling max Y-coordinates
        computeFlingLimitY();

        
        // Correct region of indicator
        computeIndicatorRect();

        
        // Correct region of current select item
        computeCurrentItemRect();
    }

    private void computeDrawnCenter() {
        switch (mItemAlign) {
            case ALIGN_LEFT:
                mDrawnCenterX = mRectDrawn.left;
                break;
            case ALIGN_RIGHT:
                mDrawnCenterX = mRectDrawn.right;
                break;
            default:
                mDrawnCenterX = mWheelCenterX;
                break;
        }
        mDrawnCenterY = (int) (mWheelCenterY - ((mPaint.ascent() + mPaint.descent()) / 2));
    }

    private void computeFlingLimitY() {
        int currentItemOffset = mSelectedItemPosition * mItemHeight;
        mMinFlingY = isCyclic ? Integer.MIN_VALUE :
                -mItemHeight * (mData.size() - 1) + currentItemOffset;
        mMaxFlingY = isCyclic ? Integer.MAX_VALUE : currentItemOffset;
    }

    private void computeIndicatorRect() {
        if (!hasIndicator) return;
        int halfIndicatorSize = mIndicatorSize / 2;
        int indicatorHeadCenterY = mWheelCenterY + mHalfItemHeight;
        int indicatorFootCenterY = mWheelCenterY - mHalfItemHeight;
        mRectIndicatorHead.set(mRectDrawn.left, indicatorHeadCenterY - halfIndicatorSize,
                mRectDrawn.right, indicatorHeadCenterY + halfIndicatorSize);
        mRectIndicatorFoot.set(mRectDrawn.left, indicatorFootCenterY - halfIndicatorSize,
                mRectDrawn.right, indicatorFootCenterY + halfIndicatorSize);
    }

    private void computeCurrentItemRect() {
        if (!hasCurtain && mSelectedItemTextColor == -1) return;
        mRectCurrentItem.set(mRectDrawn.left, mWheelCenterY - mHalfItemHeight, mRectDrawn.right,
                mWheelCenterY + mHalfItemHeight);
    }

    @Override
    protected void onDraw(Canvas canvas) {
        if (null != mOnWheelChangeListener)
            mOnWheelChangeListener.onWheelScrolled(mScrollOffsetY);
        if(mData.size() == 0)
            return;
        int drawnDataStartPos = -mScrollOffsetY / mItemHeight - mHalfDrawnItemCount;
        for (int drawnDataPos = drawnDataStartPos + mSelectedItemPosition,
             drawnOffsetPos = -mHalfDrawnItemCount;
             drawnDataPos < drawnDataStartPos + mSelectedItemPosition + mDrawnItemCount;
             drawnDataPos++, drawnOffsetPos++) {
            String data = "";
            if (isCyclic) {
                int actualPos = drawnDataPos % mData.size();
                actualPos = actualPos < 0 ? (actualPos + mData.size()) : actualPos;
                data = String.valueOf(mData.get(actualPos));
            } else {
                if (isPosInRang(drawnDataPos))
                    data = String.valueOf(mData.get(drawnDataPos));
            }
            mPaint.setColor(mItemTextColor);
            mPaint.setStyle(Paint.Style.FILL);
            int mDrawnItemCenterY = mDrawnCenterY + (drawnOffsetPos * mItemHeight) +
                    mScrollOffsetY % mItemHeight;

            int distanceToCenter = 0;
            if (isCurved) {                
                // Correct ratio of item's drawn center to wheel center
                float ratio = (mDrawnCenterY - Math.abs(mDrawnCenterY - mDrawnItemCenterY) -
                        mRectDrawn.top) * 1.0F / (mDrawnCenterY - mRectDrawn.top);
                
                // Correct unit
                int unit = 0;
                if (mDrawnItemCenterY > mDrawnCenterY)
                    unit = 1;
                else if (mDrawnItemCenterY < mDrawnCenterY)
                    unit = -1;

                float degree = (-(1 - ratio) * 90 * unit);
                if (degree < -90) degree = -90;
                if (degree > 90) degree = 90;
                distanceToCenter = computeSpace((int) degree);

                int transX = mWheelCenterX;
                switch (mItemAlign) {
                    case ALIGN_LEFT:
                        transX = mRectDrawn.left;
                        break;
                    case ALIGN_RIGHT:
                        transX = mRectDrawn.right;
                        break;
                }
                int transY = mWheelCenterY - distanceToCenter;

                mCamera.save();
                mCamera.rotateX(degree);
                mCamera.getMatrix(mMatrixRotate);
                mCamera.restore();
                mMatrixRotate.preTranslate(-transX, -transY);
                mMatrixRotate.postTranslate(transX, transY);

                mCamera.save();
                mCamera.translate(0, 0, computeDepth((int) degree));
                mCamera.getMatrix(mMatrixDepth);
                mCamera.restore();
                mMatrixDepth.preTranslate(-transX, -transY);
                mMatrixDepth.postTranslate(transX, transY);

                mMatrixRotate.postConcat(mMatrixDepth);
            }
            if (hasAtmospheric) {
                int alpha = (int) ((mDrawnCenterY - Math.abs(mDrawnCenterY - mDrawnItemCenterY)) *
                        1.0F / mDrawnCenterY * 255);
                alpha = alpha < 0 ? 0 : alpha;
                mPaint.setAlpha(alpha);
            }            
            // Correct item's drawn centerY base on curved state
            int drawnCenterY = isCurved ? mDrawnCenterY - distanceToCenter : mDrawnItemCenterY;
            
            // Judges need to draw different color for current item or not
            if (mSelectedItemTextColor != -1) {
                canvas.save();
                if (isCurved) canvas.concat(mMatrixRotate);
                canvas.clipRect(mRectCurrentItem, Region.Op.DIFFERENCE);
                canvas.drawText(data, mDrawnCenterX, drawnCenterY, mPaint);
                canvas.restore();

                mPaint.setColor(mSelectedItemTextColor);
                canvas.save();
                if (isCurved) canvas.concat(mMatrixRotate);
                canvas.clipRect(mRectCurrentItem);
                canvas.drawText(data, mDrawnCenterX, drawnCenterY, mPaint);
                canvas.restore();
            } else {
                canvas.save();
                canvas.clipRect(mRectDrawn);
                if (isCurved) canvas.concat(mMatrixRotate);
                canvas.drawText(data, mDrawnCenterX, drawnCenterY, mPaint);
                canvas.restore();
            }
            if (isDebug) {
                canvas.save();
                canvas.clipRect(mRectDrawn);
                mPaint.setColor(0xFFEE3333);
                int lineCenterY = mWheelCenterY + (drawnOffsetPos * mItemHeight);
                canvas.drawLine(mRectDrawn.left, lineCenterY, mRectDrawn.right, lineCenterY,
                        mPaint);
                mPaint.setColor(0xFF3333EE);
                mPaint.setStyle(Paint.Style.STROKE);
                int top = lineCenterY - mHalfItemHeight;
                canvas.drawRect(mRectDrawn.left, top, mRectDrawn.right, top + mItemHeight, mPaint);
                canvas.restore();
            }
        }        
        // Need to draw curtain or not
        if (hasCurtain) {
            mPaint.setColor(mCurtainColor);
            mPaint.setStyle(Paint.Style.FILL);
            canvas.drawRect(mRectCurrentItem, mPaint);
        }        
        // Need to draw indicator or not
        if (hasIndicator) {
            mPaint.setColor(mIndicatorColor);
            mPaint.setStyle(Paint.Style.FILL);
            canvas.drawRect(mRectIndicatorHead, mPaint);
            canvas.drawRect(mRectIndicatorFoot, mPaint);
        }
        if (isDebug) {
            mPaint.setColor(0x4433EE33);
            mPaint.setStyle(Paint.Style.FILL);
            canvas.drawRect(0, 0, getPaddingLeft(), getHeight(), mPaint);
            canvas.drawRect(0, 0, getWidth(), getPaddingTop(), mPaint);
            canvas.drawRect(getWidth() - getPaddingRight(), 0, getWidth(), getHeight(), mPaint);
            canvas.drawRect(0, getHeight() - getPaddingBottom(), getWidth(), getHeight(), mPaint);
        }
    }

    private boolean isPosInRang(int position) {
        return position >= 0 && position < mData.size();
    }

    private int computeSpace(int degree) {
        return (int) (Math.sin(Math.toRadians(degree)) * mHalfWheelHeight);
    }

    private int computeDepth(int degree) {
        return (int) (mHalfWheelHeight - Math.cos(Math.toRadians(degree)) * mHalfWheelHeight);
    }

    @Override
    public boolean onTouchEvent(MotionEvent event) {
        switch (event.getAction()) {
            case MotionEvent.ACTION_DOWN:
                isTouchTriggered = true;
                if (null != getParent())
                    getParent().requestDisallowInterceptTouchEvent(true);
                if (null == mTracker)
                    mTracker = VelocityTracker.obtain();
                else
                    mTracker.clear();
                mTracker.addMovement(event);
                if (!mScroller.isFinished()) {
                    mScroller.abortAnimation();
                    isForceFinishScroll = true;
                }
                mDownPointY = mLastPointY = (int) event.getY();
                break;
            case MotionEvent.ACTION_MOVE:
                if (Math.abs(mDownPointY - event.getY()) < mTouchSlop) {
                    isClick = true;
                    break;
                }
                isClick = false;
                mTracker.addMovement(event);
                if (null != mOnWheelChangeListener)
                    mOnWheelChangeListener.onWheelScrollStateChanged(SCROLL_STATE_DRAGGING);
                
                // Scroll WheelPicker's content
                float move = event.getY() - mLastPointY;
                if (Math.abs(move) < 1) break;
                mScrollOffsetY += move;
                mLastPointY = (int) event.getY();
                invalidate();
                break;
            case MotionEvent.ACTION_UP:
                if (null != getParent())
                    getParent().requestDisallowInterceptTouchEvent(false);
                if (isClick && !isForceFinishScroll) break;
                mTracker.addMovement(event);

                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.DONUT)
                    mTracker.computeCurrentVelocity(1000, mMaximumVelocity);
                else
                    mTracker.computeCurrentVelocity(1000);
                
                // Judges the WheelPicker is scroll or fling base on current velocity
                isForceFinishScroll = false;
                int velocity = (int) mTracker.getYVelocity();
                if (Math.abs(velocity) > mMinimumVelocity) {
                    mScroller.fling(0, mScrollOffsetY, 0, velocity, 0, 0, mMinFlingY, mMaxFlingY);
                    mScroller.setFinalY(mScroller.getFinalY() +
                            computeDistanceToEndPoint(mScroller.getFinalY() % mItemHeight));
                } else {
                    mScroller.startScroll(0, mScrollOffsetY, 0,
                            computeDistanceToEndPoint(mScrollOffsetY % mItemHeight));
                }                
                // Correct coordinates
                if (!isCyclic)
                    if (mScroller.getFinalY() > mMaxFlingY)
                        mScroller.setFinalY(mMaxFlingY);
                    else if (mScroller.getFinalY() < mMinFlingY)
                        mScroller.setFinalY(mMinFlingY);
                mHandler.post(this);
                if (null != mTracker) {
                    mTracker.recycle();
                    mTracker = null;
                }
                break;
            case MotionEvent.ACTION_CANCEL:
                if (null != getParent())
                    getParent().requestDisallowInterceptTouchEvent(false);
                if (null != mTracker) {
                    mTracker.recycle();
                    mTracker = null;
                }
                break;
        }
        return true;
    }

    private int computeDistanceToEndPoint(int remainder) {
        if (Math.abs(remainder) > mHalfItemHeight)
            if (mScrollOffsetY < 0)
                return -mItemHeight - remainder;
            else
                return mItemHeight - remainder;
        else
            return -remainder;
    }

    @Override
    public void run() {
        if (null == mData || mData.size() == 0) return;
        if (mScroller.isFinished() && !isForceFinishScroll) {
            if (mItemHeight == 0) return;
            int position = (-mScrollOffsetY / mItemHeight + mSelectedItemPosition) % mData.size();
            position = position < 0 ? position + mData.size() : position;
            if (isDebug)
                Log.i(TAG, position + ":" + mData.get(position) + ":" + mScrollOffsetY);
            mCurrentItemPosition = position;
            if (null != mOnItemSelectedListener && isTouchTriggered)
                mOnItemSelectedListener.onItemSelected(this, mData.get(position), position);
            if (null != mOnWheelChangeListener && isTouchTriggered) {
                mOnWheelChangeListener.onWheelSelected(position);
                mOnWheelChangeListener.onWheelScrollStateChanged(SCROLL_STATE_IDLE);
            }

            if(isTouchTriggered){
                WritableMap map  = Arguments.createMap();
                map.putInt("position", position);  
                sendEvent(map);
            }
        }
        if (mScroller.computeScrollOffset()) {
            if (null != mOnWheelChangeListener)
                mOnWheelChangeListener.onWheelScrollStateChanged(SCROLL_STATE_SCROLLING);
            mScrollOffsetY = mScroller.getCurrY();
            postInvalidate();
            mHandler.postDelayed(this, 16);
        }
    }

    @Override
    public void setDebug(boolean isDebug) {
        this.isDebug = isDebug;
    }

    @Override
    public int getVisibleItemCount() {
        return mVisibleItemCount;
    }

    @Override
    public void setVisibleItemCount(int count) {
        mVisibleItemCount = count;
        updateVisibleItemCount();
        requestLayout();
    }

    @Override
    public boolean isCyclic() {
        return isCyclic;
    }

    @Override
    public void setCyclic(boolean isCyclic) {
        this.isCyclic = isCyclic;
        computeFlingLimitY();
        invalidate();
    }

    @Override
    public void setOnItemSelectedListener(OnItemSelectedListener listener) {
        mOnItemSelectedListener = listener;
    }

    @Override
    public int getSelectedItemPosition() {
        return mSelectedItemPosition;
    }

    @Override
    public void setSelectedItemPosition(int position) {
        setSelectedItemPosition(position, true);
    }

    public void setSelectedItemPosition(int position, final boolean animated) {
      isTouchTriggered = false;
      if (animated && mScroller.isFinished()) { // We go non-animated regardless of "animated" parameter if scroller is in motion
        int length = getData().size();
        int itemDifference = position - mCurrentItemPosition;
        if (itemDifference == 0)
          return;
        if (isCyclic && Math.abs(itemDifference) > (length / 2)) { // Find the shortest path if it's cyclic
          itemDifference += (itemDifference > 0) ? -length : length;
        }
        mScroller.startScroll(0, mScroller.getCurrY(), 0, (-itemDifference) * mItemHeight);
        mHandler.post(this);
      } else {
        if (!mScroller.isFinished())
          mScroller.abortAnimation();
        position = Math.min(position, mData.size() - 1);
        position = Math.max(position, 0);
        mSelectedItemPosition = position;
        mCurrentItemPosition = position;
        mScrollOffsetY = 0;
        computeFlingLimitY();
        requestLayout();
        invalidate();
      }
    }

    @Override
    public int getCurrentItemPosition() {
        return mCurrentItemPosition;
    }

    @Override
    public List getData() {
        return mData;
    }

    @Override
    public void setData(List data) {
        if (null == data)
            throw new NullPointerException("WheelPicker's data can not be null!");
        mData = data;

        
        if (mSelectedItemPosition > data.size() - 1 || mCurrentItemPosition > data.size() - 1) {
            mSelectedItemPosition = mCurrentItemPosition = data.size() - 1;
        } else {
            mSelectedItemPosition = mCurrentItemPosition;
        }
        mScrollOffsetY = 0;
        computeTextSize();
        computeFlingLimitY();
        requestLayout();
        invalidate();
    }

    public void setSameWidth(boolean hasSameWidth) {
        this.hasSameWidth = hasSameWidth;
        computeTextSize();
        requestLayout();
        invalidate();
    }

    @Override
    public boolean hasSameWidth() {
        return hasSameWidth;
    }

    @Override
    public void setOnWheelChangeListener(OnWheelChangeListener listener) {
        mOnWheelChangeListener = listener;
    }

    @Override
    public String getMaximumWidthText() {
        return mMaxWidthText;
    }

    @Override
    public void setMaximumWidthText(String text) {
        if (null == text)
            throw new NullPointerException("Maximum width text can not be null!");
        mMaxWidthText = text;
        computeTextSize();
        requestLayout();
        invalidate();
    }

    @Override
    public int getMaximumWidthTextPosition() {
        return mTextMaxWidthPosition;
    }

    @Override
    public void setMaximumWidthTextPosition(int position) {
        if (!isPosInRang(position))
            throw new ArrayIndexOutOfBoundsException("Maximum width text Position must in [0, " +
                    mData.size() + "), but current is " + position);
        mTextMaxWidthPosition = position;
        computeTextSize();
        requestLayout();
        invalidate();
    }

    @Override
    public int getSelectedItemTextColor() {
        return mSelectedItemTextColor;
    }

    @Override
    public void setSelectedItemTextColor(int color) {
        mSelectedItemTextColor = color;
        computeCurrentItemRect();
        invalidate();
    }

    @Override
    public int getItemTextColor() {
        return mItemTextColor;
    }

    @Override
    public void setItemTextColor(int color) {
        mItemTextColor = color;
        invalidate();
    }

    @Override
    public int getItemTextSize() {
        return mItemTextSize;
    }

    @Override
    public void setItemTextSize(int size) {
        mItemTextSize = size;
        mPaint.setTextSize(mItemTextSize);
        computeTextSize();
        requestLayout();
        invalidate();
    }

    @Override
    public int getItemSpace() {
        return mItemSpace;
    }

    @Override
    public void setItemSpace(int space) {
        mItemSpace = space;
        requestLayout();
        invalidate();
    }

    @Override
    public void setIndicator(boolean hasIndicator) {
        this.hasIndicator = hasIndicator;
        computeIndicatorRect();
        invalidate();
    }

    @Override
    public boolean hasIndicator() {
        return hasIndicator;
    }

    @Override
    public int getIndicatorSize() {
        return mIndicatorSize;
    }

    @Override
    public void setIndicatorSize(int size) {
        mIndicatorSize = size;
        computeIndicatorRect();
        invalidate();
    }

    @Override
    public int getIndicatorColor() {
        return mIndicatorColor;
    }

    @Override
    public void setIndicatorColor(int color) {
        mIndicatorColor = color;
        invalidate();
    }

    @Override
    public void setCurtain(boolean hasCurtain) {
        this.hasCurtain = hasCurtain;
        computeCurrentItemRect();
        invalidate();
    }

    @Override
    public boolean hasCurtain() {
        return hasCurtain;
    }

    @Override
    public int getCurtainColor() {
        return mCurtainColor;
    }

    @Override
    public void setCurtainColor(int color) {
        mCurtainColor = color;
        invalidate();
    }

    @Override
    public void setAtmospheric(boolean hasAtmospheric) {
        this.hasAtmospheric = hasAtmospheric;
        invalidate();
    }

    @Override
    public boolean hasAtmospheric() {
        return hasAtmospheric;
    }

    @Override
    public boolean isCurved() {
        return isCurved;
    }

    @Override
    public void setCurved(boolean isCurved) {
        this.isCurved = isCurved;
        requestLayout();
        invalidate();
    }

    @Override
    public int getItemAlign() {
        return mItemAlign;
    }

    @Override
    public void setItemAlign(int align) {
        mItemAlign = align;
        updateItemTextAlign();
        computeDrawnCenter();
        invalidate();
    }

    @Override
    public Typeface getTypeface() {
        if (null != mPaint)
            return mPaint.getTypeface();
        return null;
    }

    @Override
    public void setTypeface(Typeface tf) {
        if (null != mPaint)
            mPaint.setTypeface(tf);
        computeTextSize();
        requestLayout();
        invalidate();
    }

    /**     
     *
     * @author AigeStudio 2016-06-17
     *         
     * @version 1.1.0
     */
    public interface OnItemSelectedListener {
        /**                  
         *
         * @param picker   
         * @param data     
         * @param position 
         */
        void onItemSelected(WheelPicker picker, Object data, int position);
    }

    /**     
     *
     * @author AigeStudio 2016-06-17
     *         ???????????????
     *         <p>
     *         New project structure
     * @since 2016-06-17
     */
    public interface OnWheelChangeListener {
        /**                           
         * <p>
         * Invoke when WheelPicker scroll stopped
         * WheelPicker will return a distance offset which between current scroll position and
         * initial position, this offset is a positive or a negative, positive means WheelPicker is
         * scrolling from bottom to top, negative means WheelPicker is scrolling from top to bottom
         *
         * @param offset ?????????????????????????????????????????????????????????????????????
         *               <p>
         *               Distance offset which between current scroll position and initial position
         */
        void onWheelScrolled(int offset);

        /**                  
         * <p>
         * Invoke when WheelPicker scroll stopped
         * This method will be called when WheelPicker stop and return current selected item data's
         * position in list
         *
         * @param position ???????????????????????????????????????????????????
         *                 <p>
         *                 Current selected item data's position in list
         */
        void onWheelSelected(int position);

        /**                  
         * <p>
         * Invoke when WheelPicker's scroll state changed
         * The state of WheelPicker always between idle, dragging, and scrolling, this method will
         * be called when they switch
         *
         * @param state ????????????????????????????????????????????????????????????
         *              {@link WheelPicker#SCROLL_STATE_IDLE}
         *              ???????????????????????????????????????
         *              {@link WheelPicker#SCROLL_STATE_DRAGGING}
         *              ???????????????????????????????????????
         *              {@link WheelPicker#SCROLL_STATE_SCROLLING}
         *              ???????????????????????????????????????
         *              <p>
         *              State of WheelPicker, only one of the following
         *              {@link WheelPicker#SCROLL_STATE_IDLE}
         *              Express WheelPicker in state of idle
         *              {@link WheelPicker#SCROLL_STATE_DRAGGING}
         *              Express WheelPicker in state of dragging
         *              {@link WheelPicker#SCROLL_STATE_SCROLLING}
         *              Express WheelPicker in state of scrolling
         */
        void onWheelScrollStateChanged(int state);
    }

    public void sendEvent(WritableMap map){
        reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(getId(), "onItemSelected", map);
    }
}
