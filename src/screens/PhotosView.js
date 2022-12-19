//File Imports
import React from 'react';
import {
	View,
	Text,
	FlatList,
	Animated,
	StatusBar,
	TouchableWithoutFeedback,
	TouchableOpacity,
	ToastAndroid,
	BackHandler
} from 'react-native';
import constants from 'libs/constants';
import {	
	Dimensions,
	AndroidUtilities,
} from 'ydc';
import {
	s,
	ImageView,
	Icon,
	Ripple,
	NumberTicker,
	CoordinateViewItem,
	LoadingModal,
	ShareRemoteModal,
	SyncView2
} from 'components';
import * as Animtable from 'react-native-animatable';
import AndroidCircularReveal from 'ydc/AndroidCircularReveal';
import {request} from 'ydc';
import ImageViewer from 'ydc/imageview';
import LottieView from 'lottie-react-native';
import moment from 'moment';
import Datastore from 'react-native-local-mongodb';
import {
	GetToken,
	StoreToken,
	APPEND_FETCH,
	NEW_FETCH,
	FlushToken
} from 'components/token';
import Downloader from 'ydc-rn-downloader';
import {RecyclerListView, LayoutProvider, DataProvider} from "recyclerlistview";
//Declerations
//const ImagePadding = AndroidUtilities.hps("0.5%");
let currentState = 1;
const ImageHolderSize = AndroidUtilities.wp("100%")/3;
const AniImageView = Animated.createAnimatedComponent(ImageView);
const AniFlatList  = Animated.createAnimatedComponent(FlatList);
const ParallexHeader = AndroidUtilities.hps("30%") + Dimensions.get('STATUS_BAR_HEIGHT');
const displacement = ParallexHeader*30/100;
let localGalleryDb = null;
const issuer = "photos";
let handlerSync = null;
var selectedArray = [];
const eds = new DataProvider((r1, r2) => {return r1 !== r2}).cloneWithRows([]);
const sh = AndroidUtilities.hps("5%");
const sw = constants.width();
export default class PhotosView extends React.PureComponent {
	constructor(props){
		super(props)
		this.state = {
			tempPhotos:[],
			viewMode:0,
			photos:new DataProvider((r1, r2) => {return r1 !== r2}).cloneWithRows([{type:'separator',title:'Loading...'}])
		},
		this.isAtCurrentScreen = true;
		this.imageHandle = [];
		this.alreadyPressed = false;
		this.BackHandler = this.BackHandler.bind(this)
		this._layoutProvider = new LayoutProvider((i) => {
            return this.state.photos.getDataForIndex(i).type;
        }, (type, dim) => {
            if(type == "separator"){
            	dim.width = sw;
                dim.height = sh;
            }else{            	
                dim.width = ImageHolderSize;
                dim.height = ImageHolderSize;
            }
        });
        this._renderRow = this._renderRow.bind(this)
	}	
	
	componentDidMount(){	   	   
	   BackHandler.addEventListener('hardwareBackPress', this.BackHandler)
	   this.isAtCurrentScreen = true;
	   this.imageHandle = [];
	   this.alreadyPressed = false;
	   this.setState({
		   	title:"All Photos",			
			selectionEnabled:false,
			selectedCount:0,
			stickyHeaderIndices:[0],
			loading:false,
			token:0,
			fetchType:0,
			mounted:true,
			viewerShowing:false
		}, () => {
			localGalleryDb = new Datastore({filename: 'galleryDB', autoload: true});
			//localGalleryDb.remove({}, { multi: true }, (err, numRemoved) => {})   
			//FlushToken();
		    this.loadMainView()
		})
	    
	}
	loadMainView = () => {	   
	  //  GetToken(issuer, token => {
	  //       if(token == 0){
	  //       	this.startSyncMode();
	  //       }	            
	  //  	    this.setState({token,viewMode:0});	   	    
			// this.loadGalleryPhotos();
		 //    this.syncDb();
	  //  });
	   this.loadGalleryPhotos();
	}
	componentWillUnmount() {
	  this.setState({mounted:false})
	  BackHandler.removeEventListener('hardwareBackPress', this.BackHandler)
	}

	BackHandler() {
	    if(this.state.selectionEnabled){
	    	this.removeSelection();
	    	return true;	        
        }else if(this.state.viewerShowing){
	    	ImageViewer.dismiss();
	    	return true;
        }else{
	    	return false;
        }
	}
	startSyncMode = () => {		
		this.setState({viewMode:1,photos:eds});
   		ImageViewer.cleanUp();
	}
	syncDb = async () => {
	    if(this.state.viewMode == 1){	   
	    	return;
	    }
        try{
			var res = await request.perform('albums_handler', {
				user_id,
				relation_code,
				store:"photos",
				request:"sync_z",				
				tk:this.state.token
			},"albums", false);
			//alert(JSON.stringify(res))		
			if(res != 'fetch_error'){				
				if ('rs' in res){					
					this.startSyncMode();
				}else if(res.length != 0){				        
				        StoreToken(issuer, res[0].tk);	    
						this.setState({token:res[0].tk}, () => {
							for (var i = 0; i < res.length; i++){							
								if(res[i].type == 'add_new'){
									localGalleryDb.insert(res[i]['new_data'], (e, n) => {});
								}else if(res[i].type == 'change'){						
									localGalleryDb.update({ _id: parseInt(res[i]._id) }, { $set: res[i].new_data }, { multi: false }, (e, n) => {});
								}else if(res[i].type == 'delete'){
									localGalleryDb.remove({ _id: parseInt(res[i]._id)}, {}, (e, n) => {});
								}else if(res[i].type == 'delete_multi'){
									res[i]._id.forEach(_id => localGalleryDb.remove({_id:parseInt(_id)}, {multi: true}, (e, n) => {}));
								}
							}
							if (this.isAtCurrentScreen) {
								
				            	this.setState({loading:true,photos:eds,tempPhotos:[],stickyHeaderIndices:[0]}, () => {
				            		ImageViewer.cleanUp();
				            		this.loadGalleryPhotos()
				            	});				            	
				            }
							this.r();
						});				
						return;				
						
				}
				this.r();
				return;
			}else{
				this.r();
				return;
			}
		}catch(err) {			
			this.r();
		}        
    }

    r = () => {
		if(this.state.mounted)setTimeout(() => this.syncDb(), 5000);
	}

	loadGalleryPhotos = async () => {
		/*var offset = 0;
		if(offset == 0){
			ImageViewer.cleanUp();
		}*/
		ImageViewer.cleanUp();
		let photos = [
			{
				index : 0,
				width : 640,
				height : 966,
				blurHash : 'L4CYw4Iu}p^J00t1OsI[-UMx0gJA',
				thumbnail : 'https://cdn.pixabay.com/photo/2020/09/25/13/49/blood-test-5601437__480.jpg',
				url : 'https://cdn.pixabay.com/photo/2020/09/25/13/49/blood-test-5601437__480.jpg'
			}
		]
		// this.setState({photos:new DataProvider((r1, r2) => {return r1 !== r2}).cloneWithRows(photos), tempPhotos:photos});        		
    	const mediaItems = [];
	    for(var i = 0; i < photos.length; i++){
	       if(photos[i]['type'] != 'separator'){
	       	var item = request.getViewer(photos[i], ImageHolderSize, ImageHolderSize);   
	       	item['o_idx'] = photos[i]['index'];
	        mediaItems.push(item);			       
	       }		        
	    }
	    ImageViewer.dispatchViewer(mediaItems);

	    ImageViewer.onHeartPress((data) => {			    
	    	const state = request.predictHeartState(currentState,  request.MALE);
	    	currentState = state;
			ImageViewer.setHeartState(state, true);						
		});

	    // public final static int MALELIKED = 1, FEMALELIKED = 2, NONLIKED = 3, BOTHLIKED = 4, MALE = 7, FEMALE = 8;
	    setTimeout(() => {
	    	var config = {
		    	index:0,
		    	viewerType:"header_menu",
		    	footerType:"mediaFooter",
		    	loadType:'blur',
		    	totalAssets:1,
		    	footerConfig:{
		    		caption:'This is caption',
					time:'06:00 AM',
					heartState:1
		    	},
		    	menuItems:[
			    	{
			    		title:'Save photo',
			    		icon:'save'
			    	},
			    	//{
			    		//title:'Edit caption',
			    		//icon:'edit'
			    	//},
			    	{
			    		title:'Delete Photo',
			    		icon:'delete'
			    	}
		    	]
		    }
	    	ImageViewer.showLayout(0, config, {x : 0, y : 0});
	    }, 1000)

		// localGalleryDb.find({}).sort({ _id: -1 }).exec((err, images) => {
	 //        if(images.length == 0)return;
		//     var len = this.state.tempPhotos.length;        			    		    
  //           this.setState({loading:false}) 	
  //       	this.dateSortPhotos(images, true, len, photos => {
  //       		if(photos.length == 0)return;
  //       		this.setState({photos:new DataProvider((r1, r2) => {return r1 !== r2}).cloneWithRows(photos), tempPhotos:photos});        		
	 //        	const mediaItems = [];
		// 	    for(var i = 0; i < photos.length; i++){
		// 	       if(photos[i]['type'] != 'separator'){
		// 	       	var item = request.getViewer(photos[i], ImageHolderSize, ImageHolderSize);   
		// 	       	item['o_idx'] = photos[i]['index'];
		// 	        mediaItems.push(item);			       
		// 	       }		        
		// 	    }
		// 	    ImageViewer.dispatchViewer(mediaItems);
  //       	});	
		// });      	   
	            
	}

	countPhotosOffset = () => {
		let count = 0;
		for(var i = 0; i < this.state.tempPhotos.length; i++){
			if(this.state.tempPhotos[i].type != 'separator'){
				count++;
			}
		}
		return count;
	}

	dateSortPhotos(photos, checkDate = false, si, callback){		
	    let currentDate = {};	    
	    if(checkDate && this.state.tempPhotos.length > 0){
	    	if(this.state.tempPhotos[this.state.tempPhotos.length - 1]?.time != undefined)(currentDate = request.timeReadableObject(this.state.tempPhotos[this.state.tempPhotos.length - 1]?.time));
	    }	    
	    var todayObject = request.timeReadableObject();	    
	    var dateSorted = [];	      
	    for(var i = 0; i < photos.length; i++){	    		    	
	    	photos[i]['url'] = request.site_url()+photos[i]['url'];
 		    if(photos[i]['date'] != currentDate['date'] || photos[i]['month'] != currentDate['month'] || photos[i]['year'] != currentDate['year']){
		      currentDate = request.timeReadableObject(photos[i]['time']);
		      if(todayObject['date'] == photos[i]['date'] && todayObject['month'] == photos[i]['month'] && todayObject['year'] == photos[i]['year']){
		        dateSorted.push({type:'separator', title:'Today'});
		      }else if(todayObject['date'] - 1 == photos[i]['date'] && todayObject['month'] == photos[i]['month'] && todayObject['year'] == photos[i]['year']){
		        dateSorted.push({type:'separator', title:'Yesterday'});		        
		      } else {		      	
		        var title = `${request.ordinal(photos[i]['date'])} ${request.month(photos[i]['month'])} ${photos[i]['year']}`;
		        dateSorted.push({type:'separator', title:title});
		      }		      		      	      		      		     
		    }		    
		    dateSorted.push(photos[i]);
	    }
	    for (var i = 0; i < dateSorted.length; i++){
	    	if(dateSorted[i]['type'] != 'separator'){
		    	dateSorted[i]['index'] = i;		    
		    }
	    }
	    callback(dateSorted);
	    setTimeout(() => {
	    	this.handleSeprators(si);
	    }, 500)
	}	
	handleSeprators(si){
		si--;
		const photos = this.state.tempPhotos;
		let stickyHeaderIndices = [];
		for (let i = (si < 0 ? 0 : si); i < photos.length; i++){			
			if(photos[i]?.type === 'separator')				
				stickyHeaderIndices.push(i);			
		}
	    this.setState({stickyHeaderIndices});
	}
	render(){
		const {
			selectionEnabled,
			selectedCount,
			photos,
			stickyHeaderIndices,
			loading,
			viewMode
		} = this.state;
		if(viewMode == 1){
			return (
				<SyncView2 
				 onDoneSync={this.loadMainView} 
				 title="Loading Photos" 
				 desc={`Please wait, we are downloading some data for you "it wont take long time"`} 
				 issuer={issuer} 
				 customDB="galleryDB" 
				 store="photos"
				/>
			)
		}
		return (
			<View style={{
				height:constants.maxHeight2(),
				width:constants.width(),
				alignSelf:'center',
				backgroundColor:'white',
			}}>
			  <StatusBar barStyle="dark-content"/>
		        <View style={{height:AndroidUtilities.hps("12%"),paddingTop:Dimensions.get("STATUS_BAR_HEIGHT"),width:constants.width(),backgroundColor:'white',elevation:5,flexDirection:'row'}}>
				 <View style={{width:'15%',height:'100%',justifyContent:'center',alignItems:'center'}}>
				   <Icon name="back" color="black" size={AndroidUtilities.fv(25)} />
				 </View>
				 <View style={{width:'80%',height:'100%',justifyContent:'center'}}>
				  <Text numberOfLines={1} style={{fontSize:AndroidUtilities.fv(18),fontWeight:'500',color:'black'}}>{this.state.title}</Text>
				 </View>
				  {selectionEnabled ?
				  	<ActionBar
					 ref={ref => this.actionBar = ref}
					 selectedCount={selectedCount}
					 onPressClose={this.removeSelection}
					 onPressDelete={() => {					 	
					 	this.deletePhotos(selectedArray);
					 }}
					/>
				  : null}
				</View>				
				 {this.state.loading ?				   
				   <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
				 	<LottieView	
				     loop	
				     autoPlay
				     resizeMode="cover"				     
				     style={{height:200,width:200}}				     
				     source={require('../res/anim/loading.json')}		     
				    />
				   </View>				    
				 : <RecyclerListView
					  rowRenderer={this._renderRow} 
					  dataProvider={this.state.photos}    
					  disableRecycling                  
                      layoutProvider={this._layoutProvider}			  
				   />}
    		  <LoadingModal 
    		   ref={ref => (this.loadingModal = ref)}
    		   cancelable={false}
    		  />
    		  <ShareRemoteModal
    		   ref={ref => (this.shareRemoteModal = ref)}
    		  />
			</View>
		)
	}

	async handleMediaItemPress(index){
		
    	if(!this.alreadyPressed){
    		this.setState({viewerShowing: true})
    		this.isAtCurrentScreen = false;
	    	this.alreadyPressed = true;
	    	const photos = this.state.tempPhotos;	    	
		    const len = this.state.tempPhotos.length - this.state.stickyHeaderIndices.length;
		    var config = {
		    	index:index - this.getStickyHeaderIndices(index),
		    	viewerType:"header_menu",
		    	footerType:"mediaFooter",
		    	loadType:'blur',
		    	totalAssets:len,
		    	footerConfig:{
		    		caption:photos[index]['caption'],
					time:photos[index]['time_readable'],
					heartState:photos[index]['heartState']
		    	},
		    	menuItems:[
			    	{
			    		title:'Save photo',
			    		icon:'save'
			    	},
			    	//{
			    		//title:'Edit caption',
			    		//icon:'edit'
			    	//},
			    	{
			    		title:'Delete Photo',
			    		icon:'delete'
			    	}
		    	]
		    }		    
		    this.imageHandle[index].setHere(config, 0);	    			
			ImageViewer.onPageChange(({position, o_idx}) => {			    		    		
				// if(this.imageHandle[o_idx] != undefined){ this.imageHandle[o_idx].dispatchCords(position, 0)}
				// ImageViewer.setHeaderPagination(position+1, len);								
			 //    ImageViewer.setCaption(photos[o_idx].caption);
			 //    ImageViewer.setTime(photos[o_idx].time_readable);			    
			    ImageViewer.setHeartState(photos[o_idx].heartState, false);
			 //    if((this.state.photos.length - position) < 10){
			 //    	this.loadGalleryPhotos(true);
			 //    }
			});
			ImageViewer.onHeartPress((data) => {			    
				// const id = photos[data.o_idx]['_id'];					
				// const state = request.predictHeartState(photos[data.o_idx].heartState,  user['gender'] == "male" ? request.MALE : request.FEMALE);				
				// this.updateHeart(id, state, data.o_idx);								
			});
			ImageViewer.onMenuItemPress(({pageIndex, clickedItem, o_idx}) => {				    
				    if(clickedItem == "Save photo"){
				    	this.downloadPhoto(o_idx);
				    }else if(clickedItem == "Delete Photo"){
				    	ImageViewer.dismiss();		    
				    	if(this.imageHandle[o_idx] != undefined){										
							this.imageHandle[o_idx].select();
							this.onSelectionAttempt(o_idx);
						}
				    }else if(clickedItem == "Send as message"){
				    	this.sendMessage(o_idx)
				    }				    
			});
			ImageViewer.onMediaButtonPress(({pageIndex, o_idx, button}) => {
				if(button == "three"){ //Download
					this.downloadPhoto(o_idx);
				}else{ //Share Media
					this.shareMedia(o_idx);
				}			
			});
			ImageViewer.onDismiss(() => {
				this.isAtCurrentScreen = true;
				this.alreadyPressed = false;
				ImageViewer.removeListeners();
				this.setState({viewerShowing:false})
				//ImageViewer.cleanUp();
			});
		}		
    }
    _renderRow(type, data) {	   
       if(type == 'separator'){
	   	    return ( 		   	
    		   	<View style={{height:AndroidUtilities.hps("5%"),width:constants.width(),backgroundColor:'white'}}>								 
				 <View style={{width:'80%',height:'100%',justifyContent:'center'}}>
				  <Text numberOfLines={1} style={{fontSize:AndroidUtilities.fv(15),fontWeight:'500',color:'black',paddingLeft:10}}>{data.title}</Text>
				 </View>
				</View>
		    )
	   }
	   return ( 		   	
    		   	<CoordinateViewItem					    		   	     
	    		   	 width={ImageHolderSize}
	    		   	 height={ImageHolderSize}
	    		   	 style={{padding:0}}
	    		   	 heartState={data.heartState}
	    		   	 type={type}
	    		   	 blurHash={data.blurHash}
	    		   	 ref={ref => this.imageHandle[data.index] = ref}
	    		   	 url={data.url}
	    		   	 selectionEnabled
	    		   	 index={data.index}				    		   	 
	    		   	 onPress={() => this.handleMediaItemPress(data.index)}
	    		   	 onSelectionAttempt={() => this.onSelectionAttempt(data.index)}
	    		   	 checkBoxPress={(bool) => this.checkBoxPress(bool, data.index)}
    		   	/>
		)
    }
    shareMedia = (idx) => {    	  
    	  const m = this.state.tempPhotos[idx];    	  
    	  this.shareRemoteModal.shareItem(m?.url, m?.type);
    }
    downloadPhoto = (idx) => {
    	const url = this.state.tempPhotos[idx]?.url;
    	var extra = {about:"Your shared media",cover:"",type:0,data_id:1}
    	if(url == undefined){
    		ToastAndroid.show("Unable to download media", ToastAndroid.SHORT);
    		return;
    	}
    	var ext = this.state.tempPhotos[idx].type == "image" ? "jpg" : "mp4";
	    Downloader.addToDownloads("Shared "+this.state.tempPhotos[idx].type, url, ext, "-1", extra);
	    ToastAndroid.show("Media Added for downloading", ToastAndroid.SHORT);
    }
    getStickyHeaderIndices(index){
    	let idxs = this.state.stickyHeaderIndices;
    	let count = 0;    	
    	for (var i = 0; i < idxs.length; i++) {    		    		
    		if(idxs[i] < index){
    			count++;
    		}else{    			
    			break;
    		}
    	}
    	return count;
    }
	checkBoxPress(add, index){
		if(index == undefined)return false;
		let result = selectedArray.indexOf(index);
		if(add && result != -1){
			//Do Nothing
		}else if(add && result == -1){
			selectedArray.push(index);
		}else if(!add && result != -1){
			selectedArray.splice(result, 1);
		}
		if(selectedArray.length == 0){
			this.removeSelection();			
		}else if(selectedArray.length == 1 && !this.state.selectionEnabled){			
			this.onSelectionAttempt();
		}
		console.log(selectedArray)
		this.setState({selectedCount:selectedArray.length});		
	}

	removeSelection = () => {
		this.startDeselecting();
		this.actionBar.hide();
		setTimeout(() => {
			this.setState({selectionEnabled:false});
		}, 600);
	}

	startDeselecting = () => {
		selectedArray.forEach(idx => {
			 if(this.imageHandle[idx] != undefined)this.imageHandle[idx].deselect(true)
		});
		selectedArray = [];
	}

	onSelectionAttempt(index){		
		this.setState({selectionEnabled:true}, () => {
			this.checkBoxPress(true, index)
		    this.actionBar.show();
		});
		
	}

	updateHeart = async (photo_id, heartState, o_idx) => {
		this.loadingModal.show();
		var err_txt = "Unable to add photo to favorites!";
		var time = moment().unix();
	    try{
			var res = await request.perform('media_handler', {params:JSON.stringify({
				"user_id":user_id,
				"relation_code":relation_code,
				"store":"photos",
				"photo_id":photo_id,
				"heartState":heartState,
				"request":"update_heart",
				"gender":"male",
				"time":time,
			})}, "albums", false);
			if(res)this.loadingModal.hide();
			
			if(res != 'fetch_error'){
				if (res.status != 200){					
					ToastAndroid.show(err_txt, ToastAndroid.SHORT)    
				}else{					
					const photos = this.state.tempPhotos;
				    ImageViewer.setHeartState(heartState, true);
					photos[o_idx]["heartState"] = heartState;
					this.imageHandle[o_idx]?.setHeart(heartState);
					this.setState({photos:new DataProvider((r1, r2) => {return r1 !== r2}).cloneWithRows(photos)});
				    StoreToken("photos", time)
					localGalleryDb.update({ _id: parseInt(photo_id) }, { $set:{heartState}}, { multi: false }, (e, n) => {
						if(heartState == 4){
		                	ToastAndroid.show('Same Choices 😍😍', ToastAndroid.SHORT)
		                }else if(heartState == 4){
		                	ToastAndroid.show('Removed from favorites!', ToastAndroid.SHORT)
		                }else{
		                	ToastAndroid.show('These photo is in favorites!', ToastAndroid.SHORT)
		                }
					});					
				}				
			}else{				
				ToastAndroid.show(err_txt, ToastAndroid.SHORT)    
			}
		}catch(err) {			
		    this.loadingModal.hide();		
			ToastAndroid.show(err_txt, ToastAndroid.SHORT)    
		}
	}

	async deletePhotos(toDelete){		
		this.loadingModal.show();
		const currentPhotos = this.state.tempPhotos;
		var photos = [];		
		var err_txt = "Unable to delete photos!";
		var time = moment().unix();
		for (var i = 0; i < toDelete.length; i++)photos.push(currentPhotos[toDelete[i]]['_id']);		
	    try{
			var res = await request.perform('media_handler', {params:JSON.stringify({
				"user_id":user_id,
				"relation_code":relation_code,
				"store":"photos",
				"ids":photos,				
				"request":"delete_photos",
				"gender":"male",
				"time":time,
			})}, "albums", false);
			if(res)this.loadingModal.hide();			
			if(res != 'fetch_error'){
				if (res.status != 200){					
					ToastAndroid.show(err_txt, ToastAndroid.SHORT)    
				}else{
					ToastAndroid.show("Photos deleted successfully!", ToastAndroid.SHORT);
					this.startDeselecting();					
					this.setState({photos:new DataProvider((r1, r2) => {return r1 !== r2}).cloneWithRows(currentPhotos), tempPhotos:currentPhotos, selectedCount:0, token:time});
					toDelete.forEach(index => {						
						this.imageHandle[index]?.deselect(true)
					});
				    StoreToken("photos", issuer);
				    photos.forEach( _id => localGalleryDb.remove({_id:parseInt(_id)}, {multi: true}, (e, n) => {

				    }));
				    this.loadGalleryPhotos();		    
				}
			}else{				
				ToastAndroid.show(err_txt, ToastAndroid.SHORT)    
			}
		}catch(err) {		    	
		    this.loadingModal.hide();		
			ToastAndroid.show(err_txt, ToastAndroid.SHORT)    
		}
	}

}

class ActionBar extends React.PureComponent {
	show = () => {		
		setTimeout(() => {
	       this.animatedContainer.reveal(40);     
	    }, 100);
	}
	hide = () => {		
		setTimeout(() => {
	       this.animatedContainer.hide(40);     
	    }, 100);
	}
	render(){
		const {
			onPressDelete,
			onPressClose,
			onPress
		} = this.props;
		return (
		<AndroidCircularReveal style={{        
			position:'absolute',
	        width:constants.width(),	        
	        height:AndroidUtilities.hps("12%"),
	        backgroundColor:"transparent",
	        }} ref={ref => this.animatedContainer = ref} animationDuration={300}>
			<View style={{height:AndroidUtilities.hps("12%"),width:constants.width(),paddingTop:Dimensions.get("STATUS_BAR_HEIGHT"),backgroundColor:'#f2f2f2',flexDirection:'row'}}>

			 <Animtable.View animation="zoomIn" style={{width:'15%',height:'100%',justifyContent:'center',alignItems:'center'}}>
			   <TouchableOpacity onPress={onPressClose}><Icon name="close" color="black" size={AndroidUtilities.fv(15)} /></TouchableOpacity>
			 </Animtable.View>
			 <View style={{width:'55%',height:'100%',flexDirection:'row',alignItems:'center'}}>
			  <NumberTicker
				number={this.props.selectedCount}
				targetNumber={2}
				movingDown={false}
				iterations={1}
				textSize={AndroidUtilities.fv(14)}
				duration={500}
				textStyle={{fontWeight:'500',color:'black'}}
				/>
			  <Text numberOfLines={1} style={{fontSize:AndroidUtilities.fv(14),fontWeight:'500',color:'black'}}>  Media Selected</Text>
			 </View>
			 <Animtable.View animation="zoomIn" style={{width:'15%',height:'100%',justifyContent:'center',alignItems:'center'}}>
			   <TouchableWithoutFeedback onPress={onPress}><Icon name="fav" color="black" size={AndroidUtilities.fv(20)} /></TouchableWithoutFeedback>
			 </Animtable.View>
			 <Animtable.View animation="zoomIn" style={{width:'15%',height:'100%',justifyContent:'center',alignItems:'center'}}>
			   <TouchableOpacity onPress={onPressDelete}><Icon name="trash" color="black" size={AndroidUtilities.fv(20)} /></TouchableOpacity>
			 </Animtable.View>			
			</View></AndroidCircularReveal>
		)
	}	
}
