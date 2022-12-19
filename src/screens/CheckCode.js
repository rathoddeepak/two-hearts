import React from 'react';
import {
	View,
	Text,
	Image,
	Animated,
	StatusBar,
	Keyboard,
	StyleSheet,
	TextInput,
	PanResponder
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {
	Icon,
	s,
	Hr,
	Ripple,
	StageAdapter
	//ActionBar
} from 'components';
import {
	Dimensions,
	AndroidUtilities,
} from 'ydc';

const UpdateDetailsHeight = AndroidUtilities.hp('59.31%');
const AdapterHeight = AndroidUtilities.hp('5.241%');

const TextInputHeight = AndroidUtilities.hp('7%');
const TextInputWidth = AndroidUtilities.wp('88.5%');

const btnHeight = AndroidUtilities.hp('4.5%');
const btnWidth = AndroidUtilities.wp('27.22%');

const width = Dimensions.get('REAL_WINDOW_WIDTH');
const maleImg = '../res/images/male.png'
const femaleImg = '../res/images/female.png'

export default class UpdateDetails extends React.Component {
	constructor(props){
		super(props)
		this.state = {
		   native:true			
		}		
	}
	/*
	componentDidMount(){
	   Keyboard.addListener("keyboardDidShow", this._keyboardDidShow);
       Keyboard.addListener("keyboardDidHide", this._keyboardDidHide);
	}
	componentWillUnmount(){
		Keyboard.removeListener("keyboardDidShow", this._keyboardDidShow);
        Keyboard.removeListener("keyboardDidHide", this._keyboardDidHide);
	}
	_keyboardDidShow = ({endCoordinates}) => {
		Animated.parallel([
			Animated.timing(this.state.logoAni1, {
				toValue:logoSize2,			
				useNativeDriver:false
			}),
			Animated.timing(this.state.logoAni2, {
				toValue:logoSize3,			
				useNativeDriver:false
			})
		]).start();
	}
	_keyboardDidHide = (e) => {
		Animated.parallel([
			Animated.timing(this.state.logoAni1, {
				toValue:logoSize1,			
				useNativeDriver:false
			}),
			Animated.timing(this.state.logoAni2, {
				toValue:logoSize2,
				useNativeDriver:false
			})
		]).start();
	}*/
	render(){	
		return (	
		<View style={{height:AndroidUtilities.hp("100%"),width, backgroundColor:s[config.theme_s].color, justifyContent:'center'}}>
		 	
		 
		 <View style={{height:UpdateDetailsHeight,alignSelf:'center',justifyContent:'center', alignItems:'center', width:TextInputWidth}}>

		 <StageAdapter currentIdx={0} height={AdapterHeight} width={TextInputWidth} />

		 <View style={sty.textInput}>
		  <View style={[s["tw"].h100,s["tw"].w15,s["tw"].centerItems]}>
		   <Icon name="user_outline" color="black" size={AndroidUtilities.fv(25)} />
		  </View>

		  <TextInput
		   selectionColor={s[config.theme_s].selectionColor}
		   placeholder="Fullname"
		   KeyboardType="email-address"
		   style={{
		   	width:"80%",
		   	color:"black",
		   	fontWeight:"bold",
		   	fontSize:AndroidUtilities.fv(12)
		   }}
		  />
		 </View>

		 	  
		   <GenderSlider />
		 
		 <Ripple rippleContainerBorderRadius={10} style={{width:btnWidth,height:btnHeight,borderRadius:10,alignItems:'center',justifyContent:'center',alignSelf:'center',marginTop:AndroidUtilities.hp("5%"),backgroundColor:s[config.theme_s].light}}>
		  <Text style={{
		  	fontSize:AndroidUtilities.fv(14),
		  	fontWeight:'bold',
		  	color:'white',		  	
		  }}>Next</Text>
		 </Ripple>

		 </View>

		 

		</View>		
		)
	}
}

class GenderSlider extends React.Component {
	constructor(props){
		super(props)
		this.minMoveX = 196.36363358931106;
		this.maxMoveX = 229.1818154074929;

		this.currentX = new Animated.Value(0),
		this.hasMoved = false;
		this._panResponder = PanResponder.create({
          // Ask to be the responder:
          onStartShouldSetPanResponder: (evt, gestureState) => true,
          onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
          onMoveShouldSetResponderCapture: () => true,
          onMoveShouldSetPanResponder: (evt, gestureState) => true,
          onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
          onPanResponderGrant: (evt, gestureState) => {
          	this.hasMoved = false;            
          },
          onPanResponderMove: (evt, gestureState) => {
          	this.hasMoved = true;
            clearTimeout(this.onPressTimeout);
            this.currentX.setValue(gestureState.moveX);            
          },
          onPanResponderTerminationRequest: (evt, gestureState) => true,
          onPanResponderRelease: (evt, gestureState) => {
          	var half = width/2;
          	console.log(gestureState);
          	if(this.hasMoved){
          		if(gestureState.moveX > half){
	            	Animated.spring(this.currentX, {
	            		toValue:this.maxMoveX,
	            		friction:100,
	            		useNativeDriver:false
	            	}).start();
	            }else{
	            	Animated.spring(this.currentX, {
	            		toValue:this.minMoveX,
	            		friction:100,
	            		useNativeDriver:false
	            	}).start();
	            }
          	}else{          		
          		if(gestureState.x0 > half){
	            	Animated.spring(this.currentX, {
	            		toValue:this.maxMoveX,
	            		friction:100,
	            		useNativeDriver:false
	            	}).start();
	            }else{
	            	Animated.spring(this.currentX, {
	            		toValue:this.minMoveX,
	            		friction:100,
	            		useNativeDriver:false
	            	}).start();
	            }	          	
          	}            
          },
          onPanResponderTerminate: (evt, gestureState) => {
            
          },
          onShouldBlockNativeResponder: (evt, gestureState) => {
            // Returns whether this component should block native components from becoming the JS
            // responder. Returns true by default. Is currently only supported on android.
            return false;
          },
        });
	}
	componentDidMount(){		
		setTimeout(() => {
			this.genderSlider.measure( (fx, fy, width, height, px, py) => {
	            console.log('Component width is: ' + width)
	            console.log('Component height is: ' + height)
	            console.log('X offset to frame: ' + fx)
	            console.log('Y offset to frame: ' + fy)
	            console.log('X offset to page: ' + px)
	            console.log('Y offset to page: ' + py)            
			    this.minMoveX = px + btnWidth/2;
			    this.maxMoveX = (px - 3) + btnWidth
	        })  
	    },  100 )
	}
	render(){
		const translateX = this.currentX.interpolate({
			inputRange:[this.minMoveX, this.maxMoveX],
			outputRange:[0, btnWidth - btnHeight - 3],
			extrapolate:'clamp',
			useNativeDriver:true
		});
		const color = this.currentX.interpolate({
			inputRange:[this.minMoveX, this.maxMoveX],
			outputRange:["#FA2C7F", "#6CDAFE"],
			extrapolate:'clamp',
			useNativeDriver:true
		});
		const scaleMale = this.currentX.interpolate({
			inputRange:[this.minMoveX, this.maxMoveX],
			outputRange:[1, 0],
			extrapolate:'clamp',
			useNativeDriver:true
		});
		const scalefemale = this.currentX.interpolate({
			inputRange:[this.minMoveX, this.maxMoveX],
			outputRange:[0, 1],
			extrapolate:'clamp',
			useNativeDriver:true
		});		
		

		return (
		<View style={sty.textInput}>
		<View style={[s["tw"].h100,s["tw"].w33,s["tw"].centerItems]}>
		   <Animated.Text style={{fontSize:AndroidUtilities.fv(12),fontWeight:'bold',color:s[config.theme_s].color,opacity:scaleMale}}>Male</Animated.Text>
		  </View>
		  
		<View style={[s["tw"].h100,s["tw"].w33,s["tw"].centerItems]}>	
		<View 
		    {...this._panResponder.panHandlers}
		    ref={view =>  this.genderSlider = view}
		    
	        style={{width:btnWidth,height:btnHeight,borderRadius:30,borderColor:s[config.theme_s].color,justifyContent:'center',borderWidth:3,backgroundColor:s[config.theme_s].dim}}>
		   
		   <Animated.View style={{
		   	borderRadius:100,
		   	height:btnHeight - 3,
		   	borderWidth:3,
		   	borderColor:color,
		   	backgroundColor:'white',
		   	width:btnHeight - 3,
		   	transform:[{translateX:translateX}]
		   }} />

            <Animated.Image source={require(femaleImg)} tintColor="#FA2C7F" 
            style={{height:AndroidUtilities.fv(15),width:AndroidUtilities.fv(15),position:'absolute',transform:[
		   	{translateX:-btnHeight/3.5},
		   	{translateY:btnHeight/2.1},
		   	{scale:scaleMale},
		   	]}} />

		   	<Animated.Image source={require(maleImg)} tintColor="#6CDAFE" style={{height:AndroidUtilities.fv(15),width:AndroidUtilities.fv(15),position:'absolute',transform:[
		   	{translateX:btnWidth/1.2},
		   	{translateY:-btnHeight/2},
		   	{scale:scalefemale},
		   	]}} />
		  </View>

		  </View>

		  <View style={[s["tw"].h100,s["tw"].w33,s["tw"].centerItems]}>
		   <Animated.Text style={{fontSize:AndroidUtilities.fv(12),fontWeight:'bold',color:s[config.theme_s].color,opacity:scalefemale}}>Female</Animated.Text>
		  </View>		  
		 </View>

		)
	}
}
const sty = StyleSheet.create({
  textInput:{
  	height:TextInputHeight,
 	width:TextInputWidth,
 	elevation:5,
 	backgroundColor:'white',
 	alignSelf:'center',
 	flexDirection:'row',
 	borderRadius:10,
 	marginTop:AndroidUtilities.hp("4.5%")
  }
})