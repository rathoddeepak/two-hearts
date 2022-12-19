import {
  NativeModules, 
  DeviceEventEmitter
} from 'react-native';
const {InteractUser} = NativeModules;
export default {
  initListener(){
    return InteractUser?.initListener();
  },
  startListener(){
    return InteractUser?.startListener();
  },
  getMessage(){
    return InteractUser?.getMessage();
  },
  startServices(){
    return InteractUser?.startServices();
  },
  sendOtp(phone_number, codeSend, successFail){
    return InteractUser?.sendOtp(phone_number, codeSend, successFail)
  },
  loginViaToken(token, callback){
    return InteractUser?.loginViaToken(token, callback)
  },
  verifyOtp(token, otp, callback){
      return InteractUser?.verifyOtp(token, otp, callback)
  },  
  startChatActivity(){
      return InteractUser?.startChatActivity()
  },
  logout(){
      return InteractUser?.logout()
  },
  isLoggedIn(callback){
      return InteractUser?.isLoggedIn(callback)
  },
  saveUserLocally(c){
      return InteractUser?.saveUserLocally(c)
  },
  setupPartner(partner){
      return InteractUser?.setupPartner(partner);
  },
  getPartnerId(callback){
  	return InteractUser?.getPartnerId(callback)
  },
  getUserId(callback){
  	return InteractUser?.getUserId(callback)
  },
  getMyNumber(callback){
    return InteractUser?.getMyNumber(callback)
  },
  onTyping(listener: Function){
    return DeviceEventEmitter.addListener("TPS", (data) => {      
          listener(data)      
    });
  },
  onNotTyping(listener: Function){
    return DeviceEventEmitter.addListener("LMS", (data) => {      
          listener(data)      
    });
  },
  onMessageChange(listener: Function){
    return DeviceEventEmitter.addListener("MSGC", (data) => {      
          listener(data)      
    });
  },
  showBottomSheet(config){
      return InteractUser?.showBottomSheet(config)
  },  
  closeEdit(){
      return InteractUser?.closeEdit()
  },
  setCurrentLock(lock){
      return InteractUser?.setCurrentLock(lock)
  },
  getCurrentLock(callback){
      return InteractUser?.getCurrentLock(callback)
  },
  setLockParams(params){
      return InteractUser?.setLockParams(params)
  },
  getLockParams(callback){
      return InteractUser?.getLockParams(callback);
  },
  getLastNotifyRead(i){
    return InteractUser?.getLastNotifyRead(i);
  },
  setLastNotifyRead(i){
    return InteractUser?.setLastNotifyRead(i);
  },
  getNotifyUnread(i){
    return InteractUser?.getNotifyUnread(i);
  },
  setNotifyUnread(i){
    return InteractUser?.setNotifyUnread(i);
  },
  getUserHome(i){
    return InteractUser?.getUserHome(i);
  },
  setUserHome(i){
    return InteractUser?.setUserHome(i);
  },
  attachListener(){
      return InteractUser?.attachListener();
  },
  onShakeToggle(){
      return DeviceEventEmitter.addListener("ShakeToggle", (data) => {      
            listener(data)      
      });
  },
  onShake(listener){
      return DeviceEventEmitter.addListener("ShakeEvent", (data) => {      
          listener(data)      
      });
  },
  removeOnShake(){
    DeviceEventEmitter.removeAllListeners("ShakeEvent");
  }
}