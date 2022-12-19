import { requireNativeComponent, Dimensions, PixelRatio } from 'react-native';

module.exports = {
  get AndroidUtilities() {
    return require('./AndroidUtilities').default;
  },
  get Dimensions() {
    return require('./Dimensions').default;
  },  
  get DPCheckBox() {
    return require('./DPCheckBox').default;
  },
  get CheckBox() {
    return require('./checkbox').default;
  },
  get CheckBoxT() {
    return require('./checkboxt').default;
  },
  get CheckBoxSquare() {
    return require('./checkboxsquare').default;
  },
  get ImageView() {
    return require('./imageview').default;
  },
  get AndroidCircularReveal(){
    return require('./AndroidCircularReveal').default
  },
  get request(){
    return require('./api').default
  },
  get WheelPicker(){
    return require('./wheelPicker').default
  },
  get WheelDatePicker(){
    return require('./WheelDatePicker').default
  },
  get UploadManager() {
    return require('./UploadManager').default;
  },
  get WaveImage(){
    return require('./WaveImage').default
  },
  get MessagesList(){
    return require('./MessagesList').default
  },
  get DayNightSwitch(){
    return require('./DayNightSwitch').default    
  },
  get SharedPreferences(){
    return require('./SharedPreferences').default
  },
  get InteractUser(){
    return require('./InteractUser').default
  }
}
