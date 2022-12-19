import {
  NativeModules, 
  DeviceEventEmitter
} from 'react-native';
const {ImageView} = NativeModules;
export default {  
  dispatchViewer(items){
      return ImageView.dispatchViewer(items)
  },
  cleanUp(){
      return ImageView.cleanUp()
  },
  dispatchCords(index, item){
      return ImageView.dispatchCords(index, item)
  },
  showLayout(index,config,item){
      return ImageView.showLayout(index,config,item)
  },
  addPages(pages){
      return ImageView.addPages(pages);
  },
  onPageChange(listener: Function){
  	return DeviceEventEmitter.addListener("onPageChange", (data) => {	    
  	      listener(data)	    
  	});
  },
  onDismiss(listener: Function){
  	return DeviceEventEmitter.addListener("onDismiss", (data) => {	    
  	      listener(data)	    
  	});
  },
  onHeartPress(listener: Function){
    return DeviceEventEmitter.addListener("onHeartPress", (data) => {      
          listener(data)      
    });
  },
  onMediaButtonPress(listener: Function){
    return DeviceEventEmitter.addListener("onMediaButtonPress", (data) => {
      listener(data);
    })
  },
  setHeartState(state, boolean){
    return ImageView.setHeartState(state, boolean);
  },
  onCheckBoxChange(listener: Function){
    return DeviceEventEmitter.addListener("onChecked", (data) => {      
          listener(data)      
    });
  },
  setCaption(caption){
    return ImageView.setCaption(caption);
  },
  setTime(desc){
    return ImageView.setTime(desc);
  },
  onMenuItemPress(listener: Function){
    return DeviceEventEmitter.addListener("onMenuItemPress", (data) => {      
          listener(data)      
    });
  },
  removeListeners(){    
  	DeviceEventEmitter.removeAllListeners("onPageChange");
    DeviceEventEmitter.removeAllListeners("onChecked");
    DeviceEventEmitter.removeAllListeners("onMediaButtonPress");
    DeviceEventEmitter.removeAllListeners("onDismiss");
    DeviceEventEmitter.removeAllListeners("onMenuItemPress");
    DeviceEventEmitter.removeAllListeners("onHeartPress");  
  },
  setHeaderPagination(current, total){
    return ImageView.setHeaderPagination(current, total)
  },
  setCurrent(current){
    return ImageView.setHeaderPagCurrent(current)
  },
  setTotal(total){
    return ImageView.setHeaderPagTotal(total)
  },
  setCheckBoxColor(map){
    return ImageView.setCheckBoxColor(map)
  },
  setHeaderCounterConfig(type){
    return ImageView.setHeaderCounterConfig(type)
  },
  setCheckBoxNum(num){
    return ImageView.setCheckBoxNum(num)
  },
  setCheckBoxChecked(checked){
    return ImageView.setCheckBoxChecked(checked)
  },
  dismiss(){
    return ImageView.dismiss()
  }
}