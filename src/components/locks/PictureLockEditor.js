import React, { Component } from 'react';
import {
	View,
	Text,
	StyleSheet,
	Image,
	PanResponder,
	Animated,
	ToastAndroid
} from 'react-native';
import Icon from 'components/UI/Icon';
import Ripple from 'components/UI/Ripple';
import constants from 'libs/constants';
import AndroidUtilities from 'ydc/AndroidUtilities';
import InteractUser from 'ydc/InteractUser';
import * as Animatable from 'react-native-animatable'
const ImageHolderWidth = constants.width()/1.5;
const ImageHolderHeight = constants.maxHeight2()/1.5;
const headerHeight = (constants.maxHeight2() - ImageHolderHeight) / 1.5;
const footerHeight = (constants.maxHeight2() - ImageHolderHeight) /3.4;
const RADIUS = 50;
const SET = 'Set Picture Lock';
const CONFIRM = 'Confirm Picture Lock';
export default class PictureLockEditor extends Component {
	constructor(props) {
		super(props);
		this.state = {
			picture:'',
			taskName:SET,
			record:true,
			taskTwo:'',
			lockStep:0			
		}
	}
	componentDidMount() {
		InteractUser.getLockParams(data => {
		    try{	
				let json = JSON.parse(data);
				if(typeof json == 'object' && json?.loc){
					this.setState({picture:json.pic});
					setTimeout(() => this.invalidate(4, json.loc), 300);
				}else {
					this.invalidate(1)
				}
			}catch(err){
				this.invalidate(1);
			}
		})		
	}
	invalidate = (lockStep, locations = null) => {
		this.setState({lockStep});
		switch(lockStep){
		  	case 1://Don't have image
			  	this.setState({taskTwo:'Select Image',disable:true});
			  	this.reset?.zoomOut();
			  	this.startOver?.zoomOut();
		  	break;
		  	case 2://Image Selected now set positions
			  	this.setState({taskTwo:'Tap on Image',disable:false,record:true});
			  	this.reset?.zoomIn();
			  	this.startOver?.zoomIn();
		  	break;
		  	case 3://Confirm Points
			  	this.setState({taskTwo:'Confirm Lock',disable:false});	
			  	this.reset?.zoomIn();
			  	this.startOver?.zoomOut();
		  	break;
		  	case 4://Dispatch locations			  	
			  	this.imageHolder.dispatch(locations);
			  	this.setState({taskTwo:'Reset',disable:true});
			  	this.reset?.zoomOut();
			  	this.startOver?.zoomOut();
		  	break;
		  	case 5://Dispatch locations		  	
				this.setState({taskTwo:'Reset',disable:true,reset:false,startOver:false})
				this.reset?.zoomOut();
				this.startOver?.zoomOut();
		  	break;
		}
	}
	actAccording = () => {
		const lockStep = this.state.lockStep;
		if(lockStep == 2 || lockStep == 3)return;
		if(lockStep == 1){
			InteractUser.showBottomSheet({			
				hasOnlyContent:false,
				hideCameraTile:false,
				spanCount:3,
				alsoEdit:-1,
				dontDismissOnSelect:true
			}).then(callback => {				
				this.setState({picture:"file://"+callback}, () => {
					this.invalidate(2);
				});
			});
		}else if(lockStep == 4 || lockStep == 5){
			this.resetHolder();
		}
	}
	resetHolder = () => {
		this.startAgain();
	  	this.setState({lockStep:1}, this.actAccording);
	}
	startAgain = () => {		
		this.imageHolder.clear();
	  	this.imageHolder.clearLoc();  	
	}
	handleRecord = () => {
		this.setState({taskName:CONFIRM,record:false}, () => {
			setTimeout(() => {
				this.invalidate(3)
				this.imageHolder.clear();
				setTimeout(() => this.mainText.tada(), 200)
			}, 200);
		})
	}
	handleComplete = (loc) => {
		this.invalidate(5);
		InteractUser.setCurrentLock(0);
		InteractUser.setLockParams(JSON.stringify({
			loc,
			pic:this.state.picture			
		}));
		ToastAndroid.show("Picture Lock Added Successfully!", ToastAndroid.SHORT);
		this.props.navigation.goBack();
	}
	render() {
		const {
			picture,
			taskName,
			record,
			taskTwo,
			disable
		} = this.state;		
		return (
			<View style={sty.container}>
			 <TapImageHolder 
			  uri={picture} 
			  record={record} 
			  ref={ref => this.imageHolder = ref} 
			  onRecorded={this.handleRecord} 
			  onComplete={this.handleComplete}
			  listenTap={disable}
			 />

			 <View style={sty.header}>
			  <Animatable.Text numberOfLines={1} ref={ref => this.mainText = ref} style={sty.taskNm}>{taskName}</Animatable.Text>
			  <Text numberOfLines={3} style={sty.caption}>Tap three times on picture, remember position where you tapped to unlock your app</Text>
			 </View>

			 <View style={sty.footer}>
			   <Animatable.View ref={ref => this.reset = ref} animation="zoomIn"><Ripple onPress={this.resetHolder}  style={[sty.counterItem, {width:50}]}>
			    <Icon name="reset" />
			   </Ripple></Animatable.View>

			   <View style={sty.counterItem}>
			    <Text numberOfLines={1} onPress={this.actAccording} style={sty.counterText}>{taskTwo}</Text>
			   </View>

			   <Animatable.View ref={ref => this.startOver = ref} animation="zoomIn"><Ripple onPress={this.startAgain} style={sty.counterItem}>
			    <Text numberOfLines={1} style={{fontSize:12}}>Start Again</Text>
			   </Ripple></Animatable.View>

			 </View>

			</View>
		)
	}
}

class TapImageHolder extends Component {
	constructor(props) {
		super(props);
		this.state = {
			locations:[],			
			tapCount:0,
			height:ImageHolderHeight,
			width:ImageHolderWidth,
			x:0,
			y:0
		};
		this.pan = new Animated.ValueXY();
		this.panResponder = PanResponder.create({
		    onStartShouldSetPanResponder: () => true,
		    onPanResponderStart: ({nativeEvent}) => {
		      if(this.props.listenTap)return;
		      console.log(`${nativeEvent.pageX} - ${this.state.x}`)
		      this.handleTap({x:nativeEvent.pageX - this.state.x, y:nativeEvent.pageY - this.state.y});
		    }	    
		});
		this.tapBall = [];
	}
	onLayout = ({nativeEvent}) => {
		const l = nativeEvent.layout;
	    this.setState({x:l.x,y:l.y})
	}
	handleTap({x,y}){
		console.log(x, y)
		const maxWidth = this.state.width;
		const maxHeight = this.state.height;
		if(this.props.record){			
			var locations = this.state.locations;			
			var len = locations.length;
			if(len < 3){				
				locations.push({x:x/ImageHolderWidth, y:y/ImageHolderHeight});				
				this.tapBall[len].show({x:x,y:y});
				this.setState({locations});
				if(locations.length == 3){					
					setTimeout(() => {this.props.onRecorded()}, 400)
				}
			}
		}else{			
			var tapCount = this.state.tapCount;
			const checkLocation = this.state.locations[tapCount];					
			const xLoc = checkLocation.x * maxWidth;
			const yLoc = checkLocation.y * maxHeight;

			const maxX = xLoc + RADIUS;
			const minX = xLoc - RADIUS;

			const maxY = yLoc + RADIUS;
			const minY = yLoc - RADIUS;

			var flag = 0;

			if(x >= minX && x <= maxX)flag++;					
			if(y >= minY && y <= maxY)flag++;

			if(flag == 2){
				tapCount++;
				if(tapCount == 3){				    
					this.props.onComplete(this.state.locations);
				}else{
					this.setState({tapCount})
				}	
				this.tapBall[tapCount - 1].show({x:x, y:y});		
			}else{												
				this.setState({tapCount:0}, () => {
					ToastAndroid.show("Wrong Locations, Retry!", ToastAndroid.SHORT);
					this.clear();
				})
			}
		}		
	}
	clear = () => {		
		this.tapBall[0].hide();
		this.tapBall[1].hide();
		this.tapBall[2].hide();
	}
	clearLoc = () => {		
		this.setState({locations:[]})
	}
	dispatch = (locations) => {
		const w = this.state.width;
		const h = this.state.height;
		let counter = 0;
		locations.forEach(({x, y}) => {
			const xLoc = (x * w);
			const yLoc = (y * h);
			this.tapBall[counter]?.show({x: xLoc, y: yLoc});
			counter++;
		})		
	}
	render() {
		const {
			width,
			height,
			uri
		} = this.props;
		return (
			<View
			   onLayout={this.onLayout}
			   style={{width:ImageHolderWidth,height:ImageHolderHeight,backgroundColor:'grey'}}  
			   {...this.panResponder.panHandlers}>
			   <Image style={{flex:1}} source={{uri}} />			   
			   <TapBall ref={ref => this.tapBall[0] = ref} count={1} />
			   <TapBall ref={ref => this.tapBall[1] = ref} count={2} />
			   <TapBall ref={ref => this.tapBall[2] = ref} count={3} />
			</View>
		)
	}
}

class TapBall extends Component {	
	show = ({x , y}) => {					
		this.tb?.transitionTo({opacity:1,translateX:x - RADIUS/2, translateY:y - RADIUS/2, scale:1});
	}
	hide = () => {
		this.tb?.transitionTo({scale:0});
	}
	render() {
		return (
			<Animatable.View ref={ref => this.tb = ref} style={sty.tapBall}>
			 <Text style={sty.tapText}>{this.props.count}</Text>
			</Animatable.View>
		)
	}
}
const sty = StyleSheet.create({
	taskNm:{
		fontSize:16,
		color:'black',
		marginLeft:5,
		fontWeight:'bold',
		paddingTop:constants.statusBar()
	},
	caption:{
		fontSize:14,
		color:'black',
		marginLeft:5
	},
	container: {		
		alignItems:'center',
		justifyContent:'center',
		height:constants.maxHeight2(),
		width:constants.width(),
		backgroundColor:'#E2E6EC',		
	},	
	header:{		
		width:constants.width(),
		backgroundColor:'white',
		elevation:2,		
		padding:10,
		position:'absolute',
		top:0
	},
	footer:{		
		height:footerHeight,
		width:constants.width(),
		backgroundColor:'white',
		elevation:20,		
		position:'absolute',
		bottom:0,
		padding:10,
		flexDirection:'row',
		justifyContent:'space-between'
	},
	counterContainer:{
		flexDirection:'row',
		justifyContent:'space-between'
	},
	counterItem:{
		height:50,			
		justifyContent:'center',
		alignItems:'center'		
	},
	counterText:{
		fontSize:19,
		color:'black',		
		fontWeight:'bold'
	},
	tapBall:{
		height:50,
		width:50,
		borderRadius:100,
		backgroundColor:'#1D3B8Db4',
		position:'absolute',
		justifyContent:'center',
		alignItems:'center',
		opacity:0
	},
	tapText:{
		fontSize:19,
		color:'white',
		fontWeight:'bold'
	},
})