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
	ToastAndroid
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import GlobalHandler from 'res/GlobalHandler';
import {
	Icon,
	s,
	Hr,
	Ripple,
	LoadingModal
} from 'components';
import {
	Dimensions,
	request,
	AndroidUtilities,
	InteractUser
} from 'ydc';
import CountryPicker from 'components/countryCode'
import SMSVerifyCode from 'components/esm/';

const logoSize1 = AndroidUtilities.fv(33);
const logoSize2 = AndroidUtilities.fv(12);
const logoSize3 = AndroidUtilities.fv(5);

const TextInputHeight = AndroidUtilities.hp('7%');
const TextInputWidth = AndroidUtilities.wp('88.5%');

const btnHeight = AndroidUtilities.hp('4.5%');
const btnWidth = AndroidUtilities.wp('27.22%');

const width = Dimensions.get('REAL_WINDOW_WIDTH');

const beforeSend = "We will send OTP to verify you";
const txtStyle = {fontSize:14,color:'#f2f2f2',textAlign:'center',marginTop:AndroidUtilities.hp("2%")};
export default class ForgotPassword extends React.Component {
	constructor(props){
		super(props)
		this.state = {
			logoAni1:new Animated.Value(logoSize1),
			logoAni2:new Animated.Value(logoSize2),
			phone:'',
			password:'',
			callingCode:91,
			h_note:beforeSend
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
	}
	onRegisterPress = () => {
	  //this.onUserVerified("+917038193132");
	  //return;
	  //let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
	  this.setState({otpSend:false});    
	  let reg_num = /^\+?\d+$/;
	  let {phone,callingCode} = this.state;	  
	  if(request.isBlank(phone)){
	     ToastAndroid.show("Please Enter Phone Number!", ToastAndroid.SHORT);
	     return;
	  }else if(reg_num.test(phone)){	     
	     if(phone.length != 10 ){
	       ToastAndroid.show("Phone number should contains 10 nunmbers only!", ToastAndroid.SHORT);
	       return;
	     }	     
	  }else{
	  	ToastAndroid.show("Please Enter Valid Phone Number!", ToastAndroid.SHORT);
	  	return;
	  }
	  phone = `+${callingCode}${phone}`;
	  this.loading?.show();
	  this.setState({inputEnabled:false});
	  InteractUser.isLoggedIn(logged => {
	  	if(logged)InteractUser.logout();

	  	console.log("Verifying user");
        InteractUser.sendOtp(
          phone, 

          (token) => {
          	this.loading?.hide();
            this.setState({token,otpSend:true});            
          }, 

          (response) => {
          	this.loading?.hide();          	
            if(response == "verified"){
              this.OnUserVerified(phone);
            }else{
              this.setState({otpSend:false,inputEnabled:true});  
              request.pop("Unable to send OTP!");
            }
          }
        )

	  });
	}
	validateOtp = (otp) => {
		let phone = `+${this.state.callingCode}${this.state.phone}`;
		this.loading?.show();
		InteractUser.verifyOtp(this.state.token, otp, (response) => {
		  this.loading?.hide();
          if(response === 'verified'){
          	this.onUserVerified(phone);
          }else{
          	this.verifyOtp?.onChangeText([]);
          	request.pop("Invalid OTP Entered!");
          }
        })
	}
	onUserVerified = (phone_no) => {
		InteractUser.getUserId(fire_id => {			
			this.verifyOtp?.reset();
			this.resetOTP?.clear();
			this.setState({setOTP: false,phone:''});
          	GlobalHandler.setMultiAsyncData({
          		log_state:5,
          		fire_id,          		
          		phone_no          		
          	});
          	setTimeout(() => this.props.navigation.navigate("UpdatePassword"), 130)
      	})
	}
	handleSelect = ({callingCode}) => {
		this.setState({callingCode:callingCode[0]})
	}
	setEnabled = () => {
		this.setState({inputEnabled:true})
	}
	render(){	
		const {
			logoAni1,
			logoAni2,
			phone,
			password,
			otpSend,
			h_note
		} = this.state;
		return (	
		<View style={{height:AndroidUtilities.hp("100%"),width, backgroundColor:s[config.theme_s].color}}>
		 <View style={[{height:AndroidUtilities.hp("93%"),width}, s["tw"].centerItems]}>		 

		 <View style={{width:width}}>
			 <Animated.Text style={{fontSize:logoAni1,fontWeight:'bold',alignSelf:'center',color:'white'}}>
			 Reset Password
			 </Animated.Text>
			 <Animated.Text style={[{fontSize:logoAni2,marginTop:AndroidUtilities.hp("1%"),alignSelf:'center',color:'white'}]}>
			 Enter your registered phone number
			 </Animated.Text>
		 </View>

		 <View style={{marginTop:AndroidUtilities.hp("4%")}}>

		 <View style={sty.textInput}>
		  <View style={[s["tw"].h100,s["tw"].w15,s["tw"].centerItems]}>
		   <CountryPicker	        
			withEmoji
		    withCallingCodeButton
		    withFlagButton={false}
			withAlphaFilter
			countryCode="IN"
			onSelect={this.handleSelect}	        
	       />
		  </View>
		  <TextInput
		   autoFocus
		   value={phone}
		   selectionColor={s[config.theme_s].selectionColor}
		   onChangeText={(phone) => this.setState({phone})}
		   placeholder="Phone no."
		   keyboardType="number-pad"
		   style={{
		   	width:"80%",
		   	color:"black",
		   	fontWeight:"bold",
		   	fontSize:AndroidUtilities.fv(12)
		   }}
		  />
		 </View>
		 

		 {otpSend ? <SMSVerifyCode
		   ref={ref => (this.verifycode = ref)}
		   onInputCompleted={this.validateOtp}
		   containerPaddingHorizontal={25}		   
		   coverRadius={5}
		   verifyCodeLength={6}
		   focusedCodeViewBorderColor="#3f51b5"	   
		   codeViewBorderColor="#f2f2f2"
		   codeViewStyle={{backgroundColor:'white',elevation:10}}
		   containerBackgroundColor="transparent"
		  /> : <Text style={txtStyle}>{h_note}</Text>}

		 </View>

		 {otpSend ?
		 <ResentOTP ref={ref => this.resetOTP = ref} onPress={this.onRegisterPress} onTimeUp={this.setEnabled}/>
		 :<Ripple onPress={this.onRegisterPress} rippleContainerBorderRadius={10} style={{width:btnWidth,height:btnHeight,borderRadius:10,alignItems:'center',justifyContent:'center',alignSelf:'center',marginTop:AndroidUtilities.hp("2%"),backgroundColor:s[config.theme_s].light}}>
		  <Text style={{
		  	fontSize:AndroidUtilities.fv(14),
		  	fontWeight:'bold',
		  	color:'white',		  	
		  }}>Send OTP</Text>
		 </Ripple>}
         </View>

		 <Ripple onPress={() => this.props.navigation.navigate('Login')} rippleContainerBorderRadius={30} style={{
		 	height:AndroidUtilities.hp('7%'),
		 	position:'absolute',
		 	bottom:0,
		 	width:TextInputWidth,
		 	borderTopWidth:0.6,
		 	borderColor:"#f3f3f3b4",
		 	justifyContent:'center',
		 	alignItems:'center',
		 	alignSelf:'center'
		 }}>
		 <Text style={{
		  	fontSize:AndroidUtilities.fv(14),
		  	fontWeight:'bold',
		  	color:'white',		  	
		  }}>Already Have An Account</Text>
		 </Ripple>
		 
		 <LoadingModal ref={ref => this.loading = ref}/>
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

class ResentOTP extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			count:60,
			countEnd:false
		}
	}

	componentDidMount() {
		this.count()
	}
	clear = () => {
		this.setState({count:0})
	}
	count = () => {
		if(this.state.count == 0){
			this.setState({countEnd:true});
			this.props.onTimeUp();
			return
		}
		setTimeout(() => {
			this.setState({count:this.state.count - 1});
			this.count();
		}, 1000)		
	}
	render() {
		return this.state.countEnd ? <Text onPress={this.props.onPress} style={txtStyle}>Resend OTP</Text> : <Text style={txtStyle}>{`00:${this.state.count}`}</Text>			 		
	}
}