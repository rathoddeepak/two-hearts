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
	SyncView2,
	Button
} from 'components';
import * as Animtable from 'react-native-animatable';
import AndroidCircularReveal from 'ydc/AndroidCircularReveal';
import request from 'ydc/api';
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
			loading:true,
			currentCover:-1,
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
	   const album = this.props.route.params.album;
	   BackHandler.addEventListener('hardwareBackPress', this.BackHandler)
	   this.isAtCurrentScreen = true;
	   this.imageHandle = [];
	   this.alreadyPressed = false;
	   this.setState({
	   	    album,
		   	title:album['an'],			
			selectionEnabled:false,
			selectedCount:0,
			stickyHeaderIndices:[0],			
			token:0,
			fetchType:0,
			viewerShowing:false
		}, () => {
		       this.loadMainView()
		})
	   
	}
	loadMainView = () => {
	   localGalleryDb = new Datastore({filename: 'galleryDB', autoload: true});
	   albumsDb = new Datastore({filename: 'albumsDB', autoload: true});	   	   
	   this.loadGalleryPhotos();	   
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
	componentWillUnmount() {    
	  BackHandler.removeEventListener('hardwareBackPress', this.BackHandler)
	}
	loadGalleryPhotos = async () => {		
		await albumsDb.findOne({ _id: this.state.album._id}, (err, doc) => {		  
		  if(err == null && doc['md'].length > 0){
		    this.setState({
		    	photosIDs: doc['md']
		    })		    
		  	this.loadPhotosFromIds(doc['md']);
		  }else{
		  	this.setState({photos:eds,tempPhotos:[],loading:false});
		  }		  
		});		  
	}
	loadPhotosFromIds(md){
		var $in = [];
	    md.forEach(id => $in.push(parseInt(id)));
	  	localGalleryDb.find({_id: {$in} }).sort({ _id: -1 }).exec((err, images) => {		  	    
	  		this.renderPhotoView(images);
	  	})
	}
	renderPhotoView = async (images) => {		
		ImageViewer.cleanUp();		
		if(images.length == 0)return;
		var len = this.state.photos.length;        
    	this.dateSortPhotos(images, true, len, photos => {
    		this.setState({loading:false});
    		if(photos.length == 0)return;
    		this.setState({photos:new DataProvider((r1, r2) => {return r1 !== r2}).cloneWithRows(photos),tempPhotos:photos}, () => {
    			this.handleSeprators(0);
    		});
        	const mediaItems = [];
		    for(var i = 0; i < photos.length; i++){
		       if(photos[i]['type'] != 'separator'){
		       	var item = request.getViewer(photos[i], ImageHolderSize, ImageHolderSize);
		       	item['o_idx'] = i;
		        mediaItems.push(item);
		       }
		    }
		    ImageViewer.dispatchViewer(mediaItems);

    	});
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
	    	if(this.state.album.cover == dateSorted[i]?._id){
		    	this.setState({currentCover:i});
		    	dateSorted[i]['cover'] = true;
		    }
	    }
	    callback(dateSorted);	    
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
		return (
			<View style={{
				height:constants.maxHeight2(),
				width:constants.width(),
				alignSelf:'center',
				backgroundColor:'white',
			}}>
			  <StatusBar barStyle="dark-content"/>
		        <View style={{height:AndroidUtilities.hps("12%"),paddingTop:Dimensions.get("STATUS_BAR_HEIGHT"),width:constants.width(),backgroundColor:'white',elevation:5,flexDirection:'row'}}>
				 <TouchableOpacity onPress={() => this.BackHandler()} style={{width:'15%',height:'100%',justifyContent:'center',alignItems:'center'}}>
				   <Icon name="back" color="black" size={AndroidUtilities.fv(25)} />
				 </TouchableOpacity>
				 <View style={{width:'70%',height:'100%',justifyContent:'center'}}>
				  <Text numberOfLines={1} style={{fontSize:AndroidUtilities.fv(18),fontWeight:'500',color:'black'}}>{this.state.title}</Text>
				 </View>
				 <TouchableOpacity onPress={this.handleAddPhotos} style={{width:'15%',height:'100%',justifyContent:'center',alignItems:'center'}}>
				   <Icon name="add" color="black" size={AndroidUtilities.fv(20)} />
				 </TouchableOpacity>
				    {selectionEnabled ?
				  	<ActionBar
					 ref={ref => this.actionBar = ref}
					 selectedCount={selectedCount}
					 onPressClose={this.removeSelection}
					 onPressCover={this.onTryCover}
					 onPressDelete={this.handleDelete}
					/>
				  : null}
				</View>	
				{this.state.tempPhotos.length == 0 && !this.state.loading ?
			  	 <NoneToAdd onAddPress={this.handleAddPhotos} />
				: null}  			
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
				 : null }
				 {!this.state.loading && this.state.tempPhotos.length > 0 ?
				 <RecyclerListView
					  rowRenderer={this._renderRow}
					  dataProvider={photos}
					  disableRecycling
                      layoutProvider={this._layoutProvider}			  
				 /> : null}	
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

	handleAddPhotos = () => {
		this.props.navigation.navigate('GallerySelector', {
			onSelect:this.handleAddPhotoIds
		});
	}
	handleAddPhotoIds = async (ids, add = true) => {		
		this.loadingModal.show();
		var err_txt = `Unable to ${add ? "add" : "remove"} photo to albums!`;
		var tm = moment().unix();
	    try{
			var res = await request.perform('albums_handler', {
				user_id,
				relation_code,
				store:"albums",				
				aid:this.state.album._id,
				request:add ? "add_media" : "remove_media",
				tm,
				ids
			}, "albums", false);			
			if(res)this.loadingModal.hide();				
			if(res != 'fetch_error'){
				if (res.status == 200){	
					selectedArray = [];
				    StoreToken("albums", tm)
				    let album = this.state.album;
					let currentPhotos = album['md'];
					for(let i = 0; i < album['md'].length; i++)currentPhotos[i] = parseInt(currentPhotos[i]);

					let md = currentPhotos;				
					if(add){
						for(var i = 0; i < ids.length; i++)if(currentPhotos.indexOf(ids[i]) == -1)md.unshift(ids[i]);
					}else{
						for(var i = 0; i < ids.length; i++){
							var index = currentPhotos.indexOf(ids[i]);							
							if(index != -1)md.splice(index, 1);
						}					
					}
					localGalleryDb.update({ _id: parseInt(this.state.album._id) }, { $set:{md}}, { multi: false }, (e, n) => {});
					album['md'] = md;				
					this.setState({album,loading:true}, () => {						
						this.loadPhotosFromIds(md);
					});
				}else{
					request.pop(err_txt);
				}
			}else{				
				request.pop(err_txt);
			}
		}catch(err) {		    
		    this.loadingModal.hide();		
			request.pop(err_txt);
		}
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
			    	{
			    		title:'Make Cover',
			    		icon:'edit'
			    	},
			    	{
			    		title:'Delete Photo',
			    		icon:'delete'
			    	}
		    	]
		    }		    
		    this.imageHandle[index].setHere(config, 0);	    			
			ImageViewer.onPageChange(({position, o_idx}) => {			    		    		
				if(this.imageHandle[o_idx] != undefined){ this.imageHandle[o_idx].dispatchCords(position, 0)}
				ImageViewer.setHeaderPagination(position+1, len);								
			    ImageViewer.setCaption(photos[o_idx].caption);
			    ImageViewer.setTime(photos[o_idx].time_readable);			    
			    ImageViewer.setHeartState(photos[o_idx].heartState, false);
			    if((this.state.photos.length - position) < 10){
			    	this.loadGalleryPhotos(true);
			    }
			});
			ImageViewer.onHeartPress((data) => {				
				const id = photos[data.o_idx]['_id'];					
				const state = request.predictHeartState(photos[data.o_idx].heartState, user['gender'] == "male" ? request.MALE : request.FEMALE);				
				this.updateHeart(id, state, data.o_idx);								
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
				    }else if(clickedItem == "Make Cover"){
				    	this.updateCover(o_idx, this.state.album._id);
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
    _renderRow(type, data, index) {	   
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
	    		   	 cover={data.cover}
	    		   	 blurHash={data.blurHash}
	    		   	 ref={ref => this.imageHandle[index] = ref}
	    		   	 url={data.url}
	    		   	 selectionEnabled
	    		   	 index={index}				    		   	 
	    		   	 onPress={() => this.handleMediaItemPress(index)}
	    		   	 onSelectionAttempt={() => this.onSelectionAttempt(index)}
	    		   	 checkBoxPress={(bool) => this.checkBoxPress(bool, index)}
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
				"user_id":1,
				"relation_code":123456,
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
					this.setState({tempPhotos:photos,photos:new DataProvider((r1, r2) => {return r1 !== r2}).cloneWithRows(photos)});
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

	updateCover = async (o_idx, album_id) => {
		const photos = this.state.tempPhotos;
		const photo_id = photos[o_idx]['_id'];
		this.loadingModal.show();
		var err_txt = "Unable to change cover!";
		var tm = moment().unix();
	    try{
			var res = await request.perform('albums_handler', {user_id:1,
				relation_code:123456,
				store:"albums",
				request:"update_cover",
				gender:"male",
				tm,
				pid:photo_id,
				aid:this.state.album._id}, "albums", false);
			if(res)this.loadingModal.hide();
			
			if(res != 'fetch_error'){
				if (res.status != 200){					
					ToastAndroid.show(err_txt, ToastAndroid.SHORT)    
				}else{
					let album = this.state.album;
					album['cover'] = photo_id;
					photos[o_idx]["cover"] = true;
					this.imageHandle[this.state.currentCover]?.removeC();				
					this.imageHandle[o_idx]?.addC();
					this.setState({album,currentCover:o_idx,tempPhotos:photos,photos:new DataProvider((r1, r2) => {return r1 !== r2}).cloneWithRows(photos)});
				    StoreToken("albums", tm)
					albumsDb.update({ _id: parseInt(album_id) }, { $set:{cover:photo_id}}, { multi: false }, (e, n) => {
						ToastAndroid.show('Cover Updated!', ToastAndroid.SHORT)
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

	handleDelete = () => {
		var photos = [];
		for (var i = 0; i < selectedArray.length; i++){
			photos.push(parseInt(this.state.tempPhotos[selectedArray[i]]._id));
		}
		this.handleAddPhotoIds(photos, false)
	}

	onTryCover = () => {
		if(selectedArray.length > 1){
			request.pop("Select Only One Media to make as cover");
			return;
		}
		this.updateCover(selectedArray[0], this.state.album._id);
	}
}

class NoneToAdd extends React.PureComponent {	
	render() {
		const {
			onAddPress
		} = this.props;
		return (
			<View style={{flex:1,justifyContent:'center',alignItems:'center'}}>			    
			    <Button text="Add Photos & Videos" onPress={onAddPress} />
			</View>
		)
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
			onPressCover
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
			   <TouchableOpacity onPress={onPressCover}><Icon name="bookmark" color="grey" size={AndroidUtilities.fv(20)} /></TouchableOpacity>
			 </Animtable.View>
			 <Animtable.View animation="zoomIn" style={{width:'15%',height:'100%',justifyContent:'center',alignItems:'center'}}>
			   <TouchableOpacity onPress={onPressDelete}><Icon name="trash" color="black" size={AndroidUtilities.fv(20)} /></TouchableOpacity>
			 </Animtable.View>			
			</View></AndroidCircularReveal>
		)
	}	
}