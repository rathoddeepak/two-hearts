//Female Enter the code
//xta5eo
//5ebf7a01f86c0000690076a3
import React from 'react';
import {
	View,
	Text,	
	Animated,
	StatusBar,
	Keyboard,
	StyleSheet,
	TextInput,	
	ActivityIndicator
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {
	Icon,
	s,
	Hr,
	Ripple,
	StageAdapter,
	LoadingModal	
	//ActionBar
} from 'components';
import {
	Dimensions,
	AndroidUtilities,
	request
} from 'ydc';
import GlobalHandler from 'res/GlobalHandler';
const UpdateDetailsHeight = AndroidUtilities.hp('59.31%');
const AdapterHeight = AndroidUtilities.hp('5.241%');

const TextInputHeight = AndroidUtilities.hp('7%');
const TextInputWidth = AndroidUtilities.wp('88.5%');

const btnHeight = AndroidUtilities.hp('4.5%');
const btnWidth = AndroidUtilities.wp('27.22%');

const width = Dimensions.get('REAL_WINDOW_WIDTH');

export default class VerifyCode extends React.Component {
	constructor(props){
		super(props)
		this.state = {
		   adjustableY:new Animated.Value(0),
		   relation_code:"",
		   checking:false	   
		}				
	}
	
	componentDidMount(){
		this.loopCheckCode();
		Keyboard.addListener("keyboardDidShow", this._keyboardDidShow);
		Keyboard.addListener("keyboardDidHide", this._keyboardDidHide);
	}
	componentWillUnmount(){
		this.setState({checking:true})
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
	checkCode = async () => {
		this.setState({checking: true});
		if(this.state.relation_code.length != 6 && isNaN(this.state.relation_code)){
			request.pop("Invalid relation code!");
			return;
		}
		this.loading?.show();
		var res = await request.perform('checkCode', {
			user_id,
			rc:this.state.relation_code,			
		},"prms", false);
		if(res)this.loading?.hide();
        if(res != 'fetch_error' && typeof res == 'object' && res.status == 200){
        	this.loading?.hide();
			GlobalHandler.setPartner(res.data.partner);
			GlobalHandler.setMultiAsyncData({
				partner: res.data.partner,
				log_state:3
			});
			global.partner = res.data.partner;
			global.log_state = 3;
			this.props.navigation.navigate("Welcome");
		}else{
			this.setState({checking: false});
			request.pop("Please Check your code again!");
		}	
	}
	loopCheckCode = async () => {
		var res = await request.perform('checkCode', {
			user_id,
			tcode,			
		},"prms", false);
        if(res != 'fetch_error' && typeof res == 'object' && res.status == 200){
			GlobalHandler.setPartner(res.data.partner);
			GlobalHandler.setMultiAsyncData({
				partner: res.data.partner,
				log_state: 3
			});
			this.props.navigation.navigate("Welcome");
		}else{
			if(!this.state.checking){
				setTimeout(() => this.loopCheckCode(), 2400);
			}
		}
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

		  <Text
		   style={{
		   	width:"70%",
		   	color:"black",
		   	fontWeight:"bold",		   	
		   	fontSize:AndroidUtilities.fv(12),		   	
		   	top:'6%'
		   }}
		  >{tcode}</Text>

		  <View style={[s["tw"].h100,s["tw"].w15,s["tw"].centerItems]}>
		   
		   <ActivityIndicator color="black" size="small" />
		    
		  </View>
		 </View>

		 <Text style={{
		  	fontSize:AndroidUtilities.fv(14),
		  	fontWeight:'bold',
		  	color:'white',		  	
		  	marginTop:AndroidUtilities.hp("1%")	  	
		  }}>OR</Text>


		 <Animated.Text style={[{fontSize:AndroidUtilities.fv(12),textAlign:'center',marginTop:AndroidUtilities.hp("1%"),alignSelf:'center',color:'white'}]}>
			 Ask your partner for verificaton code, code is diplayed on partner device.
			 Then enter that code below, then you are ready to go!
		 </Animated.Text>

		 <View style={sty.textInput}>
		  <View style={[s["tw"].h100,s["tw"].w15,s["tw"].centerItems]}>
		   
		   <View style={{height:AndroidUtilities.fv(25),width:AndroidUtilities.fv(25),backgroundColor:s[config.theme_s].color, justifyContent:'center', alignItems:'center', borderRadius:50}}>
		    <Icon name="heart" color="white" size={AndroidUtilities.fv(15)} />
		   </View>
		    
		  </View>

		  <TextInput
		   selectionColor={s[config.theme_s].selectionColor}
		   placeholder="Enter verificaton code!"
		   autoCapitalize={'none'}		   
		   value={relation_code}
		   onChangeText={relation_code => {
		   	relation_code = request.removeSpaces(relation_code);
		   	this.setState({
		   		relation_code
		   	});
		   }}
		   maxLength={6}
		   editable={true}
		   style={{
		   	width:"80%",
		   	color:"black",
		   	fontWeight:"bold",
		   	fontSize:AndroidUtilities.fv(12)
		   }}
		  />
		 </View>

		 <Ripple rippleContainerBorderRadius={10} onPress={this.checkCode} style={{width:btnWidth,height:btnHeight,borderRadius:10,alignItems:'center',justifyContent:'center',alignSelf:'center',marginTop:AndroidUtilities.hp("5%"),backgroundColor:s[config.theme_s].light}}>
		  <Text style={{
		  	fontSize:AndroidUtilities.fv(14),
		  	fontWeight:'bold',
		  	color:'white',		  	
		  }}>Check</Text>
		 </Ripple>

		 </Animated.View>

		 <LoadingModal ref={ref => this.loading = ref} />
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