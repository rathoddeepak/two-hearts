//Male Shares the code

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
	PanResponder,
	ToastAndroid
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {
	Icon,
	s,
	Hr,
	Ripple,
	StageAdapter	
} from 'components';
import {
	Dimensions,
	AndroidUtilities,
	request
} from 'ydc';
const UpdateDetailsHeight = AndroidUtilities.hp('59.31%');
const AdapterHeight = AndroidUtilities.hp('5.241%');

const TextInputHeight = AndroidUtilities.hp('7%');
const TextInputWidth = AndroidUtilities.wp('88.5%');

const btnHeight = AndroidUtilities.hp('4.5%');
const btnWidth = AndroidUtilities.wp('48.05%');

const width = Dimensions.get('REAL_WINDOW_WIDTH');
const maleImg = '../res/images/male.png'
const femaleImg = '../res/images/female.png'

export default class MaleVerification extends React.Component {
	constructor(props){
		super(props)
		this.state = {
		   adjustableY:new Animated.Value(0),
		   relation_code:''
		}		
	}
	
	componentDidMount(){	   
	   Keyboard.addListener("keyboardDidShow", this._keyboardDidShow);
       Keyboard.addListener("keyboardDidHide", this._keyboardDidHide);
	}
	componentWillUnmount(){
		Keyboard.removeListener("keyboardDidShow", this._keyboardDidShow);
        Keyboard.removeListener("keyboardDidHide", this._keyboardDidHide);
	}
	_keyboardDidShow = ({endCoordinates}) => {
		Animated.timing(this.state.adjustableY, {
			toValue:-endCoordinates.height/2,			
			useNativeDriver:false
		}).start();
	}
	_keyboardDidHide = (e) => {
		Animated.timing(this.state.adjustableY, {
			toValue:0,			
			useNativeDriver:false
		}).start();
	}
	
	render(){
		const {
			relation_code
		} = this.state;
		return (	
		<View style={{height:AndroidUtilities.hp("100%"),width, backgroundColor:s[config.theme_s].color, justifyContent:'center'}}>
		 <Animated.View style={{height:UpdateDetailsHeight,alignSelf:'center',justifyContent:'center', alignItems:'center', width:TextInputWidth, transform:[{translateY:this.state.adjustableY}]}}>

		 <StageAdapter currentIdx={1} height={AdapterHeight} width={TextInputWidth} />

		 <Text style={[{fontSize:AndroidUtilities.fv(12),textAlign:'center',marginTop:AndroidUtilities.hp("4%"),alignSelf:'center',color:'white'}]}>
			 Below is relationship code tell your partner to enter these code in her device (app).
			 Once these code is entered, you are ready to go!.
		 </Text>

		 <View style={sty.textInput}>
		  <View style={[s["tw"].h100,s["tw"].w15,s["tw"].centerItems]}>
		   
		   <Animatable.View animation="tada" easing="ease-out" iterationCount="infinite" style={{height:AndroidUtilities.fv(25),width:AndroidUtilities.fv(25),backgroundColor:s[config.theme_s].color, justifyContent:'center', alignItems:'center', borderRadius:50}}>
		    <Icon name="heart" color="white" size={AndroidUtilities.fv(15)} />
		   </Animatable.View>
		    
		  </View>

		  <TextInput
		   selectionColor={s[config.theme_s].selectionColor}
		   placeholder="Enter verificaton code!"
		   keyboardType="number-pad"
		   value={relation_code}
		   editable={false}
		   style={{
		   	width:"80%",
		   	color:"black",
		   	fontWeight:"bold",
		   	fontSize:AndroidUtilities.fv(12)
		   }}
		  />
		 </View>

		 <Ripple rippleContainerBorderRadius={10} onPress={() => this.props.navigation.navigate('Welcome')} style={{width:btnWidth,height:btnHeight,borderRadius:10,alignItems:'center',justifyContent:'center',alignSelf:'center',marginTop:AndroidUtilities.hp("5%"),backgroundColor:s[config.theme_s].light}}>
		  <Text style={{
		  	fontSize:AndroidUtilities.fv(14),
		  	fontWeight:'bold',
		  	color:'white',		  	
		  }}>Waiting for partner!</Text>
		 </Ripple>

		 </Animated.View>	
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