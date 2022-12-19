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
const ImageHolderSize = AndroidUtilities.wp("100%")/4;
const AniImageView = Animated.createAnimatedComponent(ImageView);
const AniFlatList  = Animated.createAnimatedComponent(FlatList);
const ParallexHeader = AndroidUtilities.hps("30%") + Dimensions.get('STATUS_BAR_HEIGHT');
const displacement = ParallexHeader*30/100;
let localGalleryDb = null;
const issuer = "photos";
let handlerSync = null;
var selectedArray = [];
const dataProvider = new DataProvider((r1, r2) => {return r1 !== r2});
const sh = AndroidUtilities.hps("5%");
const sw = constants.width();
export default class PhotosView extends React.PureComponent {
	constructor(props){
		super(props)
		this.state = {			
			viewMode:0,
			photos:[{type:'separator',title:'Loading...'}]
		},
		this.isAtCurrentScreen = true;
		this.imageHandle = [];
		this.alreadyPressed = false;
		this.BackHandler = this.BackHandler.bind(this)
		this._layoutProvider = new LayoutProvider((i) => {
            return this.state.photos[i].type;
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
			selectionEnabled:true,
			selectedCount:0,
			stickyHeaderIndices:[0],
			loading:false,
			token:0,
			fetchType:0,
			viewerShowing:false
		}, () => {
			   this.actionBar.show();
		       this.loadMainView();
		})
	   
	}

	loadMainView = () => {
	   localGalleryDb = new Datastore({filename: 'galleryDB', autoload: true});
	   GetToken(issuer, token => {
	        if(token == 0){
	        	this.setState({viewMode:6});
	        	return;
	        }
	   	    this.setState({token,viewMode:0});	   	    
			this.loadGalleryPhotos();		    
	   });
	}

	componentWillUnmount() {    
	  BackHandler.removeEventListener('hardwareBackPress', this.BackHandler)
	}

	BackHandler() {
	    if(selectedArray.length > 0){
	    	this.startDeselecting()
	    	return true;
        }else{
	    	return false;
        }
	}
		
	loadGalleryPhotos = async () => {			
		localGalleryDb.find({}).sort({ _id: -1 }).exec((err, images) => {
	        if(images.length == 0)return;
		    var len = this.state.photos.length;        			    		    
            this.setState({loading:false}) 	
        	this.dateSortPhotos(images, true, len, photos => {
        		if(photos.length == 0)return;
        		this.setState({photos});	        	
        	});	
		});
	}

	dateSortPhotos(photos, checkDate = false, si, callback){		
	    let currentDate = {};	    
	    if(checkDate && this.state.photos.length > 0){
	    	if(this.state.photos[this.state.photos.length - 1]?.time != undefined)(currentDate = request.timeReadableObject(this.state.photos[this.state.photos.length - 1]?.time));
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
	    callback(dateSorted);
	    setTimeout(() => {
	    	this.handleSeprators(si);
	    }, 500)
	}

	handleSeprators(si){
		si--;
		const photos = this.state.photos;
		let stickyHeaderIndices = [];
		for (let i = (si < 0 ? 0 : si); i < photos.length; i++){			
			if(photos[i]?.type === 'separator')				
				stickyHeaderIndices.push(i);			
		}
	    this.setState({stickyHeaderIndices});
	}
	handleDone = () => {
		var photos = [];
		for (var i = 0; i < selectedArray.length; i++){
			photos.push(this.state.photos[selectedArray[i]]._id);
		}		
		this.props.route.params?.onSelect(photos);
		this.props.navigation.goBack();
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
		if(viewMode == 6){
			return (
				<View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
				    <Text numberOfLines={1} style={{fontSize:15,color:"white", width:'95%'}}>No Photos Avaliable</Text>
				</View>
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
			  	<ActionBar
				 ref={ref => this.actionBar = ref}
				 selectedCount={selectedCount}
				 onPressClose={() => {
				 	if(selectedArray.length === 0){
						this.props.navigation.goBack();
						return;
					}else{
						this.startDeselecting();
					}
				 }}
				 onPressDone={this.handleDone}
				/>				  
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
				 : null}
				{!this.state.loading && this.state.photos.length > 0 ?
					<RecyclerListView
					  rowRenderer={this._renderRow} 
					  disableRecycling
					  dataProvider={dataProvider.cloneWithRows(this.state.photos)}					              
                      layoutProvider={this._layoutProvider}			  
				   />
				: null}
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
		this.imageHandle[index]?.select();
		this.onSelectionAttempt(index);
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
	    		   	 blurHash={data.blurHash}
	    		   	 ref={ref => this.imageHandle[index] = ref}
	    		   	 url={data.url}	    		   	     		   	
	    		   	 selectionEnabled
	    		   	 selected={selectedArray.indexOf(index) != -1}
	    		   	 index={index}				    		   	 
	    		   	 onPress={() => this.handleMediaItemPress(index)}
	    		   	 onSelectionAttempt={() => this.onSelectionAttempt(index)}
	    		   	 checkBoxPress={(bool) => this.checkBoxPress(bool, index)}
    		   	/>
		)
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
		if(selectedArray.length == 1 && !this.state.selectionEnabled){			
			this.onSelectionAttempt();
		}		
		this.setState({selectedCount:selectedArray.length});		
	}

	startDeselecting = () => {		
		selectedArray.forEach(idx => {
			 if(this.imageHandle[idx] != undefined)this.imageHandle[idx].deselect(true)
		});
		selectedArray = [];
		this.setState({selectedCount:0})
	}

	onSelectionAttempt(index){		
		this.checkBoxPress(true, index)		    		
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
			onPressDone,
			onPressClose,
			onPress,
			selectedCount
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
			 <View style={{width:'70%',height:'100%',flexDirection:'row',alignItems:'center'}}>
			  <NumberTicker
				number={selectedCount}
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
			   <TouchableOpacity onPress={onPressDone} disabled={selectedCount == 0} style={{opacity:selectedCount > 0 ? 1 : 0.5}}><Icon name="tick" color="black" size={AndroidUtilities.fv(20)} /></TouchableOpacity>
			 </Animtable.View>			
			</View></AndroidCircularReveal>
		)
	}	
}
