import {
  NativeModules,  
  DeviceEventEmitter
} from 'react-native';
const {UploadManager} = NativeModules;
export default {
  addProcess(item){
    return UploadManager.addProcess(item);
  },
  addProcessCallback(itm, callback){
    return UploadManager.addProcessCallback(itm, callback);
  },
  addProcessBatch(items, startAfter){
    return UploadManager.addProcessBatch(items, startAfter);
  },
  retriveUploads(type, callback){
    return UploadManager.retriveUploads(type, callback)
  },
  startProcess(){
    return UploadManager.startProcess();
  },
  stopProcess(taskId){
    return UploadManager.stopProcess(taskId);
  },
  addListener(type, listener: Function){
    return DeviceEventEmitter.addListener(type, (data) => {      
          listener(data)      
    });
  },
  initialCheck(){
      return UploadManager.initialCheck();
  },
  removeListener(type){
    DeviceEventEmitter.removeAllListeners(type);    
  }
}
