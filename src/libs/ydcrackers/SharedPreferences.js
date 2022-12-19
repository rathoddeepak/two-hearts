import {
  NativeModules, 
  DeviceEventEmitter
} from 'react-native';
const {SharedPreferences} = NativeModules;
export default {  
  setItem(key, value){
      return SharedPreferences.setItem(key, value);
  },
  getItem(key, callback){
      return SharedPreferences.getItem(key, callback);
  },
  getItems(keys){
      return SharedPreferences.getItems(keys, callback);
  },
  getAll(callback){
      return SharedPreferences.getAll(callback);
  },
  clear(){
      return SharedPreferences.clear();
  },
  getAllKeys(){
      return SharedPreferences.getAllKeys();
  },
  removeItem(){
      return SharedPreferences.removeItem();
  }
}