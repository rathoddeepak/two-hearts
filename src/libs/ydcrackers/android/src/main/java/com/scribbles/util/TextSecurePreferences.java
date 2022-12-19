package com.scribbles.util;

import android.content.Context;
import android.preference.PreferenceManager;

public class TextSecurePreferences {
    public  static final String INCOGNITO_KEYBORAD_PREF          = "pref_incognito_keyboard";
    public static boolean isIncognitoKeyboardEnabled(Context context) {
        return getBooleanPreference(context, INCOGNITO_KEYBORAD_PREF, false);
    }
    public static boolean getBooleanPreference(Context context, String key, boolean defaultValue) {
        return PreferenceManager.getDefaultSharedPreferences(context).getBoolean(key, defaultValue);
    }
}
