import {
  NativeModules, 
  NativeEventEmitter,
  Platform,
  StatusBar,   
  PixelRatio,  
  DeviceEventEmitter
} from 'react-native';
import {
  Dimensions
} from 'ydc';
const {AndroidUtilities, AudioManger} = NativeModules;
import { isIphoneX } from "react-native-iphone-x-helper";

let screenWidth = Dimensions.get('REAL_WINDOW_WIDTH');
let screenHeight = Dimensions.get('USABLE_HEIGHT');
let statusHeight = Dimensions.get('STATUS_BAR_HEIGHT');
const standardLength = screenWidth > screenHeight ? screenWidth : screenHeight;
const offset = screenWidth > screenHeight ? 0 : Platform.OS === "ios" ? 78 : StatusBar.currentHeight; // iPhone X style SafeAreaView size in portrait
const deviceHeight = isIphoneX() || Platform.OS === "android"? standardLength - offset : standardLength;

gotMobileNumber = (event) => {
  console.log("mobileNumber", event)
}
export default {  
  getGalleryImages(params){
      return AndroidUtilities.getGalleryImages(params);
  },
  startAudioRecording(failure){
      return AudioManger.startAudioRecording(failure);
  },
  addListener(on, fun){
    DeviceEventEmitter.addListener(on, fun);
  },
  vibrate(times){
    return AudioManger.Vibrate(times);
  },
  stopAudioRecording(del){
      return AudioManger.stopAudioRecording(del);
  },
  getImageAlbums(){
      return AndroidUtilities.getImageAlbums();
  },
  getMusicFiles(options){
      return new Promise((resolve, reject) => {

            //if(Platform.OS === "android"){
                AndroidUtilities.getMusicFiles(options, 
                  (tracks) => {
                      resolve(tracks);
                  },
                  (error) => {
                      resolve(error);
                  }
                );
            //}else{
            /*   AndroidUtilities.getMusicFiles(options, (tracks) => {
                    if(tracks.length > 0){
                        resolve(tracks);
                    }else{
                        resolve("Error, you don't have any tracks");
                    }
                });        
            */
   })
  },
  wp(widthPercent){
    const elemWidth = typeof widthPercent === "number" ? widthPercent : parseFloat(widthPercent);
    return PixelRatio.roundToNearestPixel(screenWidth * elemWidth / 100);
  },
  hp(heightPercent){
    const elemHeight = typeof heightPercent === "number" ? heightPercent : parseFloat(heightPercent);
    return PixelRatio.roundToNearestPixel(screenHeight * elemHeight / 100);
  },
  hps(heightPercent){
    const elemHeight = typeof heightPercent === "number" ? heightPercent : parseFloat(heightPercent);
    return PixelRatio.roundToNearestPixel((screenHeight - statusHeight) * elemHeight / 100);
  },
  listenOrientationChange(that){
    Dimensions.addEventListener('change', newDimensions => {  
    screenWidth = newDimensions.window.width;
    screenHeight = newDimensions.window.height;
      that.setState({
        orientation: screenWidth < screenHeight ? 'portrait' : 'landscape'
      });
    });
  },
  removeOrientationListener(){
    Dimensions.removeEventListener('change', () => {});
  },
  fp(percent) {
    const heightPercent = (percent * screenHeight) / 100;
    return Math.round(heightPercent);
  },
  fv(fontSize, standardScreenHeight = 680) {
    const heightPercent = (fontSize * screenHeight) / standardScreenHeight;
    return Math.round(heightPercent);
  }

}
