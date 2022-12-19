const ApiUrl = "http://192.168.43.250/TwoHearts/app_api.php?type=";
import {ToastAndroid,PixelRatio} from 'react-native' 
import NetInfo from '@react-native-community/netinfo';
import fetch from './request'
import Datastore from 'react-native-local-mongodb';
import constants from '../constants';
import moment from 'moment';
const partnerId = 773;
const myId = 822;
const configId = 7878878;
const lauchId = 12523;
const tokenId = 15234;
const MALELIKED = 1, FEMALELIKED = 2, NONLIKED = 3, BOTHLIKED = 4, REMOVEMALE = 5, REMOVEFEMALE = 6, MALE = 7, FEMALE = 8;
//Status Constants
const UPLOADING = 0;
const PAUSED = 1;
const COMPLETED = 2;
const ERROR = 3;
const IDEAL = 4;
const COMPRESSING = 6;
const COMPRESSED = 7;
const COMPRESS_ERROR = 8;
const CANCLED = 9;
//Types Constants
const HOME = 0;    
const PHOTOS = 1;
const ALBUM = 2;
const AVATAR = 3;
const COVER = 4;
const OTHER1 = 5;
const OTHER2 = 6;
const fetchDatabase = new Datastore({filename: "fetchDatabase", autoload: true})
const userDatabase = new Datastore({filename: "userDatabase", autoload: true})
const push = async (params) => {  
  fetchDatabase.findOne({ url: params.url}, (err, doc) => {
       if(err == null || doc == null){
        fetchDatabase.insert(params, (e, n) => {});
       }else{
        fetchDatabase.update({ url: params.url }, { $set: params }, { multi: false }, (e, n) => {});
       }
  });
}

const resolve = async (url) => {  
  fetchDatabase.findOne({ url: params.url}, (err, doc) => {
       if(doc == null || err == null){
        return false;
       }else{
        return doc;
       }
  });
}

const deleteObject = async (url) => {  
  let object = realm.objectForPrimaryKey('fetchDatabase', url);   
  fetchDatabase.delete({ url: url}, (err, doc) => {});
}

const request = {
  MALELIKED, FEMALELIKED, NONLIKED, BOTHLIKED, REMOVEMALE, REMOVEFEMALE, MALE, FEMALE,
  pushItem(key, params){
    userDatabase.insert({_id:key,...params},  (e, n) => {});
  },
  pushReplaceItem(key, params){
    userDatabase.findOne({ _id: key}, (err, doc) => {
       if(err == null || doc == null){
        userDatabase.insert(params, (e, n) => {});
       }else{
        userDatabase.update({ url: params.url }, { $set: params }, { multi: false }, (e, n) => {});
       }
    });
  },
  resolveItem(schema, id){    
    userDatabase.findOne({ _id: schema}, (err, doc) => {
       if(err == null || doc == null){
        userDatabase.insert(params, (e, n) => {});
       }else{
        userDatabase.update({ url: params.url }, { $set: params }, { multi: false }, (e, n) => {});
       }
    });
  },  
  network(){
      return NetInfo.fetch().then(connectionInfo => {
      if(connectionInfo.type == 'none'){
        return false
      }else{
        return true     
      } 
    })
  },
  myId(){
    return myId;
  },
  partnerId(){
    return partnerId;
  },
  configId(){
    return configId;
  },
  launchId(){
    return launchId;
  },  
  
  getLaunchPage(){
       
  },
  getLaunchPageParams(){
    
  },

  setLaunchPage(page, params = " "){
   //realm.create('InitailPage', {launch_id:lauchId,appLaunchPage:page, params:params});    
  },
  decideMedal(i){
    if(i == 0){
      return 'gold-medal';
    }else if(i == 1){
      return 'silver-medal';
    }else if(i == 2){
      return 'bronze-medal';
    }
  },
  ordinal(i) {
    var j = i % 10,
        k = i % 100;
    if (j == 1 && k != 11) {
        return i + "st";
    }
    if (j == 2 && k != 12) {
        return i + "nd";
    }
    if (j == 3 && k != 13) {
        return i + "rd";
    }
    return i + "th";
  },
  month(month){  
  switch(month){
    case 1:
    return 'January';
    case 2:
    return 'February';
    case 3:
    return 'March';
    case 4:
    return 'April';
    case 5:
    return 'May';
    case 6:
    return 'June';
    case 7:
    return 'July';
    case 8:
    return 'August';
    case 9:
    return 'September';
    case 10:
    return 'October';
    case 11:
    return 'November';
    case 12:
    return 'December';
    default:
    return 'January';
    }
  },
  timeReadableObject(time = -1){
    if(time == -1){
      time = moment().unix();   
    }
    var raw = moment.unix(time);
    return {
      month:raw.format("MM"),
      year:raw.format("YYYY"),
      date:raw.format("DD")
    }
  },
  loadClassThemes(){
   return JSON.parse(`[
         {
            "name":"Dark Blue Accounting",
            "url":"uploads/cls_themes/theme_blue.jpg",
            "bgColor":"#4a97d1"
         },
         {
            "name":"Dark Grey Mathematics",
            "url":"uploads/cls_themes/theme_grey.jpg",
            "bgColor":"#445b63"
         },
         {
            "name":"Dark Orange Sports",
            "url":"uploads/cls_themes/theme_orange.jpg",
            "bgColor":"#f6bf27"
         },
         {
            "name":"Dark Blue Accounting",
            "url":"uploads/cls_themes/theme_blue.jpg",
            "bgColor":"#4a97d1"
         },
         {
            "name":"Dark Grey Mathematics",
            "url":"uploads/cls_themes/theme_grey.jpg",
            "bgColor":"#445b63"
         },
         {
            "name":"Dark Orange Sports",
            "url":"uploads/cls_themes/theme_orange.jpg",
            "bgColor":"#f6bf27"
         }
      ]`)
  },
  isBlank(str) {return (!str || /^\s*$/.test(str))},
  site_url() {return 'http://192.168.43.250/TwoHearts/'},
  api_url() {return ApiUrl},
  unshift(main, target){
    var temp = main;
    main[0] = target;
    for(var i = 1; i <= main.length; i++){
      main[i] = temp[i-1];
    }    
    return main;
  },
  isValidName(userInput) {   
    var regex = /^[\p{L}\p{M}]+([\p{L}\p{Pd}\p{Zs}'.]*[\p{L}\p{M}])+$|^[\p{L}\p{M}]+$/u;
    return regex.test(userInput);  
  },
  countWords(str) {
       return str.split(' ').filter((n) => { return n != '' }).length;
  },
  removeSpaces(str) {    
    str = str.replace(/\s+/g, " "); // Remove more than two spaces
    str = str.replace(/^[ ]+|[ ]+$/g,''); // Remove more Ending and Begining Spaces
    return str;
  },
  isValidUrl(userInput) {
    var res = userInput.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    if(res == null)
       return false;
    else
       return true;
  },
  isValidFbUrl(userInput) {    
    if(userInput.match(/^(https?:\/\/)?(www\.)?facebook.com\/[a-zA-Z0-9(\.\?)?]/) == 1 && userInput.match(/home((\/)?\.[a-zA-Z0-9])?/) == 0) {
      return true;
    } else {
      return false;
    }   
  },
  isValidYtUrl(userInput){      
          if (userInput != undefined || userInput != '') {
              var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
              var match = userInput.match(regExp);
              if (match && match[2].length == 11) {
                  return true;
                  //$('#ytplayerSide').attr('src', 'https://www.youtube.com/embed/' + match[2] + '?autoplay=0');
              }
              else {
                  return false;
              }
          }
  },
  isValidEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }, 
  isValidInstaUrl(userInput){      
          if (userInput != undefined || userInput != '') {
              var regExp = /^\s*(http\:\/\/)?instagram\.com\/[a-z\d-_]{1,255}\s*$/i;
              var match = userInput.match(regExp);
              if (match) {
                  return true;                  
              }
              else {
                  return false;
              }
          }
  },
  randomGradient(type, i = 'ran', pack = 1){
    var colors = [
        {colors:['#7e1edf', '#4737cb'], shadow:'#7e1edf'},
        {colors:[ '#fe7b83','#7e1edf'], shadow:'#fe7b83'},
        {colors:['#62aed7', '#30b9c0'], shadow:'#30b9c0'},
    ];
    var colors2 = [
        {colors:['#b993d6', '#8ca6db'], shadow:'#636FA4'},
        {colors:[ '#d53369','#ff5858'], shadow:'#ff5858'}, 
        {colors:['#f2709c', '#ff9472'], shadow:'#BB377b'},               
    ];
    var n;
    if(i%3 == 0){
      n = 0;
    }else if(i%2 == 0){
      n = 1;
    }else if(i%2 != 0){
      n = 2;
    }else if(i == 'ran'){
      n = Math.floor(Math.random()*colors.length);      
    }
    if(type == 'colors'){
      if(pack == 1){
         return colors[n].colors;  
      }else if(pack == 2){
         return colors2[n].colors; 
      }
      
    }else{
      if(pack == 1){
         return colors[n].shadow;  
      }else if(pack == 2){
         return colors2[n].shadow;
      }
      
    } 
  },  
  async _fetch(code, details, tag){  
    var formBody = [];
    for (var property in details) {
    var encodedKey = encodeURIComponent(property);
    var encodedValue = encodeURIComponent(details[property]);
    formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");
    return fetch(ApiUrl+code, {
    method: 'POST',
    timeout: 4000,
    headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: formBody}, tag)
    .then((response) => response.text())
    .then((res) => {
      //if(code == "download_sync&user_id=13&relation_code=731504&storex=sync_sz"){
        //console.log(res)
      //}
      return JSON.parse(res);
    })
    .catch((error)=>{      
      return 'fetch_error';
    });
  },
  async checkItem(code, ignoreTime = false){    
    var dta = await resolve(ApiUrl+code);    
    if(dta != false){              
      if(ignoreTime){
        return JSON.parse(dta.data);
      }else{
        var start = new Date(dta.time);            
        var end = Date.now();                        
        var diff = end - start.getTime();
        var hrs = Math.floor((diff) / (3.6e+6));            
        if(hrs < 2){
           return JSON.parse(dta.data);
        }else{
          deleteObject(ApiUrl+code); 
          return false;        
        }
      }      
    }else{      
      return false;
    }
  },
  isURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?'+
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+
    '((\\d{1,3}\\.){3}\\d{1,3}))'+
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+
    '(\\?[;&a-z\\d%_.~+=-]*)?'+
    '(\\#[-a-z\\d_]*)?$','i');
    return pattern.test(str);
  },
  makeid(length) {
   var result           = '';
   var characters       = '01234567890123456789';
   var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
  },
  createGETMathod(data){
    var link = ApiUrl;
    data.map(data => {
      link += '&'+data.key+'='+data.value
    })
    return link;
  },
  async ydcPerform(code, details, tag, callback2, callback, cache = true){                 
      var netInfo = await this.network();     
      //if(netInfo == true){ <-- Important
      if(netInfo == true){                    
        if(cache){
          var data = await this.checkItem(code, true);           
        }else{
          var data = false;
        }        
        if(data == false){
          var res = await this._fetch(code, details, tag);          
          if(res != 'fetch_error'){
            if(res.status == 200){
             if(cache == true){                
                push({url:ApiUrl+code, time:Date.now(), data:JSON.stringify(res)});
              }
            }   
            callback2(res);
            return;
          }else{            
            callback2('fetch_error');
            return;
          }
        }else{
          callback(data);
          var res = await this._fetch(code, details, tag);          
          if(res != 'fetch_error'){
            if(res.status == 200){
             if(cache == true){
                push({url:ApiUrl+code, time:Date.now(), data:JSON.stringify(res)});
             }             
            }   
            callback2(res);           
          }else{
            return;
          }         
        }
      }else{
        var data = await this.checkItem(code, true);
        if(data != false){
          callback(data);          
        }else{          
          callback2('network_error');
          return;
        }
      }      
  },
  async perform(code, details, tag, cache = true){                 
      var netInfo = await this.network();     
      //if(netInfo == true){ <-- Important
      if(netInfo == true){
        if(cache){
          var data = await this.checkItem(code);  
        }else{
          var data = false;
        }        
        if(data == false){
          var res = await this._fetch(code, details, tag);          
          if(res != 'fetch_error'){
            if(res.status == 200){
             if(cache == true){
              push({url:ApiUrl+code,time:Date.now(),data:JSON.stringify(res)});
              return res;
             }else{
               return res;
             }              
            }else{
              return res;
            }
          }else{        
            return 'fetch_error';
          }
        }else{
          return data;
        }
      }else{
        var data = await this.checkItem(code);        
        if(data != false){
          return data
        }else{
          ToastAndroid.show("Please Check your Internet Connection!")         
          return 'network_error';
        }
      }      
  },
  pop(d){
    ToastAndroid.show(d, ToastAndroid.SHORT);
  },
  getViewer(item, originalWidth, originalHeight, forceAdd = false){
     if(isNaN(item.width) || item.width == 0 || isNaN(item.height) || item.height == 0){
      return false;
     }
     const imageWidth = item.width;
     const imageHeight = item.height;
     const resizedHeight = imageHeight * (constants.width()/imageWidth);   
     const imageCenter = constants.screenHeight2()/2 - resizedHeight/2;
     var source = item.uri == undefined ? item.url : item.uri;
     var thumbnail = item.thumbnail == undefined ? source : item.thumbnail;
     if(forceAdd)source = 'http://192.168.43.250/TwoHearts/'+source;     
     if(thumbnail.startsWith("uploads")){
      thumbnail = source+'_thumb';
     }
     if(item.type == 'video'){
      var temp = item.url;      
      temp = temp.replace("mp4", "jpg");
      source = item.url;
      thumbnail = temp;      
     }     
     return {
      width:PixelRatio.getPixelSizeForLayoutSize(constants.width()),
      height:PixelRatio.getPixelSizeForLayoutSize(resizedHeight),
      source:source,
      thumbnail:thumbnail,
      oWidth:PixelRatio.getPixelSizeForLayoutSize(originalWidth),
      oHeight:PixelRatio.getPixelSizeForLayoutSize(originalHeight),
      imageCenter:PixelRatio.getPixelSizeForLayoutSize(imageCenter),
      imageCenter2:PixelRatio.getPixelSizeForLayoutSize(imageCenter),
      imageWidth:item.width,
      imageHeight:item.height,
      blurHash:item.blurHash
     };
  },
  decodeStatus(status) {
    switch (status) {
      case UPLOADING:
      return 'Uploading...'
      case COMPLETED:
      return 'COMPLETED'
      case ERROR:
      return 'Error while uploading'
      case IDEAL:
      return 'Waiting'
      case COMPRESSING:
      return 'Compressing'
      case COMPRESSED:
      return 'Preparing to upload'
      case COMPRESS_ERROR:
      return 'Error while uploading'
      case CANCLED:
      return 'Cancled'
    }
  },
  getFileName(fullPath){
    return fullPath?.replace(/^.*[\\\/]/, '');
  },
  predictHeartState(currentState, gender){    
    if(gender == MALE){
      switch(currentState){
        case MALELIKED:
         return NONLIKED;
        case FEMALELIKED:
         return BOTHLIKED;
        case BOTHLIKED:
         return FEMALELIKED;
        case NONLIKED:
         return MALELIKED; 
      }
    }else if(gender == FEMALE){
      switch(currentState){
        case FEMALELIKED:
         return NONLIKED;
        case MALELIKED:
         return BOTHLIKED;
        case BOTHLIKED:
         return MALELIKED;
        case NONLIKED:
         return FEMALELIKED; 
      }
    }
  },  
  /*
   Photos --> Part Start <------
   <<Strategy No. 1>>    
    When data length are not equal than add so the data is being  add for first
   <<Strategy No. 2>>
    When the data is not in sequence ignore and flush database reload from initial
   <<Strategy No. 3>>
    When the data is in sequence check for changes in required fields and maintain synchronization
    -- null pointer exception --
  */
  compareObjects(obj, jbo, pattern){
    if(obj.length != jbo.length){
      return false;
    }
    for(let i = 0; i < obj.length; i++){
      if(obj[i][pattern] != jbo[i][pattern]){
        return false;
      }
    }
    return true;
  }  
}

export default request;