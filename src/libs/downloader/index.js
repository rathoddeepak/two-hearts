import React, { Component } from 'react';
import {
  requireNativeComponent,
  UIManager,  
  ViewPropTypes,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import {
  NativeModules, 
  DeviceEventEmitter
} from 'react-native';
const {YdcDownloader} = NativeModules;

export default {
  initialCheck(){
    return YdcDownloader.initialCheck();
  },
  addToDownloads(fileName, url, ext, id, extra){
    return YdcDownloader.addToDownloads(fileName, url, ext, id, extra);
  },
  retriveDownloads(status, type, callback){
    return YdcDownloader.retriveDownloads(status, type, callback);
  },
  fileLength(path, callback){
    return YdcDownloader.fileLength(path, callback);
  },
  deleteTask(id,dest){
    return YdcDownloader.deleteTask(id,dest);
  },
  readFile(location){
    return YdcDownloader.readfile(location);
  },
  controlButton(id,ext,status){
    return YdcDownloader.controlButton(id,ext,status);
  },
  pauseTask(id){
    return YdcDownloader.pauseTask(id);
  }
}