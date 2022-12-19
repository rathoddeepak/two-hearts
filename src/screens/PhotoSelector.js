import React from 'react';
import {
	View,
	Text,
	ToastAndroid,
	ScrollView,
	FlatList,
	Animated,
	Modal,
	TouchableWithoutFeedback,
	PixelRatio,
	findNodeHandle,
	UIManager
} from 'react-native';
import {
	AndroidUtilities,
	Dimensions,
	CheckBoxT,		
} from 'ydc';
import {
	s,
	Icon,
	CoordinateView,
	Ripple,
	ImageView as PhotoView,
	NumberTicker
} from 'components';
import FastImage from 'react-native-fast-image';
import AndroidCircularReveal from 'ydc/AndroidCircularReveal';
import ImageView from 'ydc/imageview';
import * as Animtable from 'react-native-animatable';
import constants from 'libs/constants';

const AniImage  = Animated.createAnimatedComponent(FastImage);
const AniFlatList  = Animated.createAnimatedComponent(FlatList);
const MediaHeaderHeight = AndroidUtilities.hps("7.5%");
const ImageHolderSize = AndroidUtilities.wp("100%")/3;
const ImageHolderWidth = AndroidUtilities.wp("95.277%");
const ImagePadding = AndroidUtilities.hps("0.5%");

var assetCount = 0;
var firstPic = '';
const MAX_WIDTH = Dimensions.get("REAL_WINDOW_WIDTH");
var alreadyPressed = false;
var selectedArray = [];

function getValidIndex(string){
	string = string.split('$-$');	
	return string;
}
export default class PhotoSelector extends React.Component {
	constructor(props){
		super(props)
		this.state = {
			albums:[{
				title:'All Photos',
				assetCount:0,
				cover:''				
			}],
			photos:[],
			currentAlbum:'All Photos',
			selected:[],
			startFrom:0,
			hasMore:true,
			scrollY:new Animated.Value(0),
			totalAssets:0,
			selectionEnabled:false,
			selectedCount:0
		},		
        this.imageHandle = [];
        this.handleChecked = this.handleChecked.bind(this);
        this.handleImageViewerDissmiss = this.handleImageViewerDissmiss.bind(this);
	}
	componentDidMount(){
	    ImageView.cleanUp();	
		this.loadImage('all');
		setTimeout(() => {
			this.loadAlbums();
		}, 300);
	}
	componentWillUnmount(){
		ImageView.cleanUp();
	}
	attachIndex = () => {
		setTimeout(() => {
	    	for(var c = 0; c < selectedArray.length; c++){			
			    var validIdx = getValidIndex(selectedArray[c]);						    	   
				if(validIdx[0] == this.state.currentAlbum && this.imageHandle[validIdx[1]] != undefined){								
					this.imageHandle[validIdx[1]].select(false);
					this.imageHandle[validIdx[1]].setCount(c);
				}			
			}
	    }, 400)
	}
	loadAlbums = async () => {
		try {
			var res = await AndroidUtilities.getImageAlbums();
			if(res){				
				this.setState({
					albums:[...this.state.albums, ...res.albums],			
				});				
			}	
		}catch(err){
			console.log(err);
		}
	}
	loadImage = async (type, albumName = 'All Photos', addPages = false) => {
		let startFrom = this.state.startFrom;
		let hasMore = this.state.hasMore;
		if(this.state.currentAlbum != albumName){
			startFrom = 0;
			hasMore = true;
			ImageView.cleanUp();
			this.setState({
				startFrom:0,
				currentAlbum:albumName,
				photos:[]
			});
		}
		if(hasMore){
			try {
				var params = {type:type,limit:20,startFrom:startFrom};				
				if(albumName != 'All Photos'){
					params['albumName'] = albumName;
				}
				var res = await AndroidUtilities.getGalleryImages(params);
				if(res){
				    var mediaItems = [];
				    for(var i = 0; i < res.assets.length; i++){
				        var item = this.getViewer(res.assets[i]);
				        if(item){
				        	mediaItems.push(item);
				        }								        					    						    					        
				    }			
					this.setState({
						photos:[...this.state.photos, ...mediaItems],
						hasMore:res.hasMore,
						startFrom:res.next,
						totalAssets:res.totalAssets
					}, () => {
					    ImageView.dispatchViewer(mediaItems);
					    if(addPages){
					    	ImageView.addPages(mediaItems);
					    }
					    this.attachIndex();					  
					});
					if(albumName == 'All Photos' && startFrom == 0){
						assetCount = res.totalAssets;
						firstPic = res.assets[0]['uri'];
					}
				}
			}catch(err){
				console.log(err);
			}
		}		
	}
	onPressAlbums(title){		
		if(title == 'All Photos'){
			this.loadImage('all');
		}else{			
			this.loadImage('all', title);
		}		
	}
	onAlbumPress = (albumName) => {
		this.loadImage('all', albumName);
	}
	getViewer(item){
	 if(isNaN(item.width) || item.width == 0 || isNaN(item.height) || item.height == 0){
	 	return false;
	 }
	 const imageWidth = item.width;
	 const imageHeight = item.height;
	 const resizedHeight = imageHeight * (MAX_WIDTH/imageWidth);	 
	 const imageCenter = AndroidUtilities.hp('100%')/2 - resizedHeight/2;
	 return {
	  width:PixelRatio.getPixelSizeForLayoutSize(MAX_WIDTH),
	  height:PixelRatio.getPixelSizeForLayoutSize(resizedHeight),
	  source:item.uri,
	  thumbnail:item.uri,
	  oWidth:PixelRatio.getPixelSizeForLayoutSize(ImageHolderSize),
	  oHeight:PixelRatio.getPixelSizeForLayoutSize(ImageHolderSize),
	  imageCenter:PixelRatio.getPixelSizeForLayoutSize(imageCenter),
	  imageCenter2:PixelRatio.getPixelSizeForLayoutSize(imageCenter),
	  imageWidth:item.width,
	  imageHeight:item.height,
	  blurHash:' '
	 };
	}
	showPhotoViewer(index){		
		if(!alreadyPressed){
			alreadyPressed = true;									
			this.imageHandle[index].setHere(this.state.totalAssets);						
			ImageView.onPageChange(({position}) => {				
				if(selectedArray.indexOf(this.state.currentAlbum+'$-$'+position) != -1){					
					ImageView.setCheckBoxChecked(true);
				}else{					
					ImageView.setCheckBoxChecked(false);
				}
				ImageView.setHeaderPagination(position+1, this.state.totalAssets);
				if(this.imageHandle[position] != undefined){
					this.imageHandle[position].dispatchCords();
			    }
			    if((this.state.photos.length - position) < 10){
			    	this.loadImage('all', this.state.currentAlbum, true);
			    }
			});
			ImageView.onCheckBoxChange(this.handleChecked);	
			ImageView.onDismiss(this.handleImageViewerDissmiss);
		}			
	}
	handleChecked({pageIndex, checked}){
		if(!this.state.selectionEnabled){
			this.setState({selectionEnabled:true}, () => {			
				this.actionBar.show();
			});	
		}
		this.checkBoxPress(checked, pageIndex);
	}
	handleImageViewerDissmiss = () => {
		this.attachIndex();
	}
	checkBoxPress(add, index){		
		index = this.state.currentAlbum+'$-$'+index+'$-$'+this.state.photos[index].source+'$-$'+this.state.photos[index].width+'$-$'+this.state.photos[index].height;		
		let result = selectedArray.indexOf(index);
		if(add && result != -1){
			//Do Nothing
		}else if(add && result == -1){
			selectedArray.push(index);
		}else if(!add && result != -1){
			selectedArray.splice(result, 1);			
		}
		for(var i = 0; i < selectedArray.length; i++){
			if(selectedArray.length > 1 && !add && result != -1){		
			    var validIdx = getValidIndex(selectedArray[i]);
				if(this.imageHandle[validIdx[1]] != undefined){
					this.imageHandle[validIdx[1]].setCount(i);					
				}
			}
		}
		if(selectedArray.length == 0){
			this.actionBar.hide();
			setTimeout(() => {
				this.setState({selectionEnabled:false});
			}, 600);
		}
		this.setState({selectedCount:selectedArray.length});		
	}
	clearAll = () => {
		for(var i = 0; i < selectedArray.length; i++){
		   var validIdx = getValidIndex(selectedArray[i]);	
			if(this.imageHandle[validIdx[1]] != undefined){
				this.imageHandle[validIdx[1]].deselect();					
			}			
		}
		selectedArray = [];
		this.setState({selectedCount:0});
		this.actionBar.hide();
		setTimeout(() => {			
			this.setState({selectionEnabled:false})
		}, 300);	
	}	
	onSelectionAttempt(index){		
		this.setState({selectionEnabled:true}, () => {
			this.checkBoxPress(true, index);
			this.actionBar.show();
		});		
	}

	handleItemSupply = () => {
		const { navigation, route } = this.props;
		var mediaItems = [];
	    for(var i = 0; i < selectedArray.length; i++){
	        var validIdx = getValidIndex(selectedArray[i]);	          
	        mediaItems.push({
	        	source:validIdx[2],
	        	width:parseInt(validIdx[3]),
	        	height:parseInt(validIdx[4])
	        });
	    }
	    this.clearAll();
	    navigation.goBack();
	    route.params.onSelect(mediaItems);
	}

	render(){
		const {
			currentAlbum,
			photos,
			albums,
			selectionEnabled,
			selectedCount
		} = this.state;
		const elevation = this.state.scrollY.interpolate({
			inputRange:[0, 30],
			outputRange:[0, 4],
			extrapolate:'clamp'
		})
		return (
			<View style={{
				flex:1,
				backgroundColor:'white'				
			}}>
			   <Animated.View style={{width:'100%',backgroundColor:'white',zIndex:-1,elevation:elevation}}>
				<MediaHeader
				    ref={ref => this.mediaHeader = ref}
				    elevation={5}
					currentAlbum={currentAlbum}
					albums={albums}
					onPress={(data) => this.onPressAlbums(data)}
				/>
				{selectionEnabled ?
				  	<ActionBar
					 ref={ref => this.actionBar = ref}
					 selectedCount={selectedCount}
					 albums={albums}
					 onClearAll={this.clearAll}
					 onDonePress={this.handleItemSupply}					 
					 onPress={(data) => this.onPressAlbums(data)}
					/>
    			: null}
    			</Animated.View>
				<View style={{width:constants.width(),alignSelf:'center',height:AndroidUtilities.hps("91%")}}>
					<AniFlatList				 					 
					 contentContainerStyle={{flexGrow:1,flexDirection:'row',flexWrap:'wrap'}}					 
					 data={photos}
					 extraData={photos}					 
					 onEndReached = {({ distanceFromEnd }) => {					    
					        this.loadImage('all', this.state.currentAlbum)					    
					 }}
					 onEndReachedThreshold={0.01}					 
					 onScroll={Animated.event(
			          [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }],
					  {
					    useNativeDriver: true,
					    listener: event => {
					      const offsetY = event.nativeEvent.contentOffset.y
					      // do something special
					    },
					  },
					)}
					 renderItem={({ item, index }) => {return(
					 	<GridSelectableImage
					 	    width={ImageHolderSize}
			                height={ImageHolderSize}
			                ref={ref => this.imageHandle[index] = ref}			                
			                url={item.source}                
			                imageHeight={item.imageHeight}
			                imageWidth={item.imageWidth}
			                index={index}
			                currentAlbum={this.state.currentAlbum}
			                onPress={() => this.showPhotoViewer(index)}		
			                style={{padding:ImagePadding}}
							selectionEnabled={selectionEnabled}
							onSelectionAttempt={() => this.onSelectionAttempt(index)}
							checkBoxPress={(bool) => this.checkBoxPress(bool, index)}			 	 
					 	/>
					 )}}
	                 keyExtractor={(item, index) => index}
					/>
				</View>
			</View>
		)
	}
}


class GridSelectableImage extends React.Component {
	constructor(props){
		super(props)
		this.state = {
			scale:new Animated.Value(1),
			selected:false,	
			count:-1,
			width:0,
		    height:0,
		    pageX:0,
		    pageY:0,
		    opacity:1,
		}				
	}
	toggle  = () => {
		if(this.state.selected){
			this.deselect();
		}else{
			this.select();
		}
	}
	componentDidMount(){
		this.updateCount();
	}
	select = (updateCount = true) => {
		Animated.timing(this.state.scale, {
			toValue:0.8,
			duration:300,
			useNativeDriver:true
		}).start();
		this.setState({selected:true});
		if(updateCount){
			this.updateCount();
		}else{
			this.checkBox.select();
		}		
	}
	updateCount = () => {
		const {
			currentAlbum,
			index,
		} = this.props;
		setTimeout(() => {
			let string = currentAlbum+'$-$'+index;
			for (var count = 0; count < selectedArray.length; count++){
				if(selectedArray[count].startsWith(string)){					
					this.setState({count});
					break;
				}
			}			
		}, 300);		
	}
	setCount = (count) => {		
		this.setState({count:count});		
	}
	deselect = () => {		
		Animated.timing(this.state.scale, {
			toValue:1,
			duration:300,
			useNativeDriver:true
		}).start();
		this.setState({selected:false,count:-1});
		this.checkBox.deselect();
	}
	onCheckPress = (selected) => {		
		this.updateCount();
		this.setState({selected});
		this.toggle();				
		this.props.checkBoxPress(selected);		
		if(!this.props.selectionEnabled){
			this.props.onSelectionAttempt(this.props.index);
		}
	}	
	hide = () => {
		this.setState({
		  opacity:0
		})
	}
	show = () => {
		this.setState({
		  opacity:1
		})
	}
	getViewer(){
	 const {imageWidth,imageHeight, url, width, height} = this.props;
	 const resizedHeight = imageHeight * (MAX_WIDTH/imageWidth);
	 const imageCenter = AndroidUtilities.hp('100%')/2 - resizedHeight/2;
	 return {
	  width:PixelRatio.getPixelSizeForLayoutSize(MAX_WIDTH),
	  height:PixelRatio.getPixelSizeForLayoutSize(resizedHeight),
	  source:url,
	  thumbnail:url,
	  oWidth:PixelRatio.getPixelSizeForLayoutSize(width),
	  oHeight:PixelRatio.getPixelSizeForLayoutSize(height),
	  imageCenter:PixelRatio.getPixelSizeForLayoutSize(imageCenter),
	  imageCenter2:PixelRatio.getPixelSizeForLayoutSize(imageCenter),	  
	 };
	}
	dispatchCords = () => {  
	 var view = this.refs['Marker'];
	 var handle = findNodeHandle(view);     
	 UIManager.measure(handle, (x, y, width, height, pageX, pageY) => {	    
    	let data = {          
	      x:isNaN(x) ? 0 : PixelRatio.getPixelSizeForLayoutSize(pageX) - ImagePadding,
	      y:isNaN(y) ? constants.maxHeight2() : PixelRatio.getPixelSizeForLayoutSize(pageY),          
	    }        
	    ImageView.dispatchCords(this.props.index, data);	    
	 });      
	}
	setHere = (totalAssets) => {  
	 var view = this.refs['Marker'];
	 var handle = findNodeHandle(view);     
	 UIManager.measure(handle, (x, y, width, height, pageX, pageY) => {        
	    let data = {          
	      x:PixelRatio.getPixelSizeForLayoutSize(pageX) - ImagePadding,
	      y:PixelRatio.getPixelSizeForLayoutSize(pageY),          
	    }        
	    ImageView.showLayout(this.props.index,
	    {
	    	totalAssets,
	    	isSelected:this.state.selected,	    	
	    	selectedCount:selectedArray.length
	    }
	    , data);
	    alreadyPressed = false;
	 });      
	}
	render(){
		const {
			scale,
			opacity
		} = this.state;
		const {
			width,
			height,
			borderRadius,			
			url,
			selectionEnabled,
			index
		} = this.props;
		return (
			<TouchableWithoutFeedback delayLongPress={200} rippleContainerBorderRadius={borderRadius} onPress={this.props.onPress}>
			<View style={{opacity}}>
			<Animated.View style={[{
				width,
				height,
				borderRadius,
				backgroundColor:'white',
				transform:[
			 	{scale:scale}
			 	]
			}, this.props.style]} ref={"Marker"} onLayout={({nativeEvent}) => {
                  var view = this.refs['Marker'];
                  var handle = findNodeHandle(view);
                  UIManager.measure(handle, (x, y, width, height, pageX, pageY) => {
                    this.setState({width, height, pageX, pageY});
                  })
                }}>
			<PhotoView
			 borderRadius={borderRadius}
			 source={url}
			 thumbnail={url}
			 borderRadius={5}
			 style={{
			 	flex:1			 	
			 }}
			/>		
			</Animated.View>
			
				<View style={{
					position:'absolute',
					right:7,
					top:7
				}}>			
				<CheckBoxT
				  ref={ref => this.checkBox = ref}
				  onChange={bool => this.onCheckPress(bool)}
				  checked={this.state.selected}
				  type={6}
				  size={AndroidUtilities.fv(23)} 
				  count={this.state.count}
				  colorMap = {{
				    background:s[config.theme_s].color,
				    background2:"#00000000",
				    check:"white",
				    disabled:"yellow"
				  }}
				/> 
				</View>
			
			</View></TouchableWithoutFeedback>
		)
	}
}

class ActionBar extends React.Component {	
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
	onPress = () => {
		this.coordinateView.getCoordinates(resolve => {
			this.albumPickerModel.showFrom(resolve.height/2.4 + resolve.pageY);
		})
	}
	render(){
		return (
		<AndroidCircularReveal style={{        
			position:'absolute',
	        width:constants.width(),	        
	        height:MediaHeaderHeight,
	        backgroundColor:"transparent",
	        }} ref={ref => this.animatedContainer = ref} animationDuration={300}>
			<View style={{height:MediaHeaderHeight,width:constants.width(),backgroundColor:'#f2f2f2',flexDirection:'row'}}>

			 <CoordinateView style={{width:'10%',height:'100%'}} ref={ref => this.coordinateView = ref}><Ripple onPress={this.onPress} style={{flex:1,justifyContent:'center',alignItems:'center'}}>
			   <Icon name="chevron_down" color="black" size={AndroidUtilities.fv(18)} />
			 </Ripple></CoordinateView>

			 <Ripple onPress={this.onPress}  style={{width:'50%',height:'100%',flexDirection:'row',alignItems:'center'}}>
			  
			  <NumberTicker
				number={this.props.selectedCount}
				targetNumber={2}
				movingDown={false}
				iterations={1}
				textSize={AndroidUtilities.fv(14)}
				duration={500}
				textStyle={{fontWeight:'500',color:'black'}}
				/>
			  <Text numberOfLines={1} style={{fontSize:AndroidUtilities.fv(13),fontWeight:'500',color:'black'}}>  Media Selected</Text>
			 </Ripple>
			 <Ripple onPress={this.props.onClearAll} style={{width:'20%',height:'100%',justifyContent:'center',alignItems:'center'}}>
			   <Text numberOfLines={1} style={{fontSize:AndroidUtilities.fv(13),color:s[config.theme_s].color,fontWeight:'bold'}}>Clear All</Text>
			 </Ripple>
			 <Ripple onPress={this.props.onDonePress}  style={{width:'20%',height:'100%',justifyContent:'center',alignItems:'center'}}>
			   <Text numberOfLines={1} style={{fontSize:AndroidUtilities.fv(13),fontWeight:'bold',color:s[config.theme_s].color}}>Done</Text>
			 </Ripple>

			 <AlbumPickerModel				 
			  data={this.props.albums}
			  ref={ref => this.albumPickerModel = ref}
			  onSelected={(data) => this.props.onPress(data)}
			 />

			</View></AndroidCircularReveal>
		)
	}
}

class AlbumPickerModel extends React.Component {
	constructor(props){
		super(props)
		this.state = {
			visible:false,
			showFromY:0,
			animation:new Animated.Value(0)
		}		
	}
	showFrom = (showFromY) => {		
		this.setState({
			visible:true,
			showFromY
		});
		Animated.timing(this.state.animation, {
				toValue:10,
				duration:300,
				useNativeDriver:true
		}).start();
		setTimeout(() => {			
			if(this.animatedContainer != undefined || this.animatedContainer != null){
				this.animatedContainer.reveal(1000);
			}		
		}, 100);			
	}
	onRequestClose = (showFromY) => {		
		setTimeout(() => {
			this.setState({
				visible:false
			});
		}, 300);
		if(this.animatedContainer != undefined || this.animatedContainer != null){
			this.animatedContainer.hide(1000);
		}		
		Animated.timing(this.state.animation, {
				toValue:0,
				duration:300,
				useNativeDriver:true
		}).start();
	}
	render(){
		const {
			data
		} = this.props;
		const color = this.state.animation.interpolate({
			inputRange:[0, 10],
			outputRange:[0, 1]
		})
		return (
			<Modal transparent visible={this.state.visible} onRequestClose={this.onRequestClose}>
			<TouchableWithoutFeedback style={{height:AndroidUtilities.hps('100%'),width:'100%'}} onPress={this.onRequestClose}>
			    <View style={{height:AndroidUtilities.hps('100%'),width:'100%'}}>			
			     <Animated.View style={{
			     	position:'absolute',
			     	height:AndroidUtilities.hps('100%'),
			     	width:'100%',
			     	backgroundColor:"#000000b4",
			     	top: this.state.showFromY,
			     	opacity:color
			     }} />
				 <AndroidCircularReveal ref={ref => this.animatedContainer = ref} style={{        
			        flex: 0,
			        width: '100%',			        
			        position: 'absolute',
			        top: this.state.showFromY,
			        zIndex: 4}}>
			        <View style={{flex:1,backgroundColor:'white',maxHeight:AndroidUtilities.hps("50%")}} >
			        <FlatList				 
						 contentContainerStyle={{flexGrow: 1}}						 
						 data={data}
						 extraData={data}
						 renderItem={({ item }) => {return(
						 	<Ripple onPress={() => {
						 		this.onRequestClose();
						 		this.props.onSelected(item.title)
						 	}} style={{
						 		width:'100%',
						 		height:AndroidUtilities.hps("8%"),
						 		flexDirection:'row'
						 	}}>
							 	<View style={{width:'20%'}}>
							 	 <FastImage source={{
							 	 	uri:item.cover == '' ? firstPic : item.cover
							 	 }} style={{
							 	 	height:AndroidUtilities.fv(50),
							 	 	width:AndroidUtilities.fv(50)
							 	 }}/>
							 	</View>
							 	<View style={{width:'80%'}}>
							 	 <Text numberOfLines={1} >{item.title}</Text>
							 	 <Text numberOfLines={1} >{item.assetCount == '' ? assetCount : item.assetCount}</Text>
							 	</View>
						 	</Ripple>
						 )}}
		                 keyExtractor={(item, index) => index}
					/>
					</View>
				 </AndroidCircularReveal>				
				</View>
				</TouchableWithoutFeedback>
			</Modal>
		)
	}
}

class MediaHeader extends React.Component {
	onPress = () => {
		this.coordinateView.getCoordinates(resolve => {
			this.albumPickerModel.showFrom(resolve.height/2.4 + resolve.pageY);
		})
	}
	render(){
		const {
			currentAlbum,
			albums
		} = this.props;
		return (
			<>
				<View style={{
					height:MediaHeaderHeight,
					width:ImageHolderWidth,					
					flexDirection:'row',
					alignItems:'center',	
					alignSelf:'center'							   
				}}>
				
				<CoordinateView ref={ref => this.coordinateView = ref} style={{
					width:'50%',
					height:'100%',					
				}}>				
				<Ripple rippleContainerBorderRadius={10} style={{
					width:'100%',
					flexDirection:'row',	
					height:'100%',
					alignItems:'center'			
				}} onPress={this.onPress}>
					<Text numberOfLines={1} style={{fontSize:AndroidUtilities.fv(16), fontWeight:'bold', color:s[config.theme_s].color, maxWidth:'80%',paddingRight:ImagePadding}}>
						{currentAlbum}
					</Text>
					<View style={{
						height:'100%',
						justifyContent:'center'
					}}><Icon name="chevron_down" color={s[config.theme_s].color} size={AndroidUtilities.fv(18)} />
					</View>
				</Ripple>
				</CoordinateView>
			
				</View>				
				<AlbumPickerModel				 
				 data={albums}
				 ref={ref => this.albumPickerModel = ref}
				 onSelected={(data) => this.props.onPress(data)}
				/>
			</>
		)
	}
}