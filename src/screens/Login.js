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
	ToastAndroid,
	Alert
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {
	Icon,
	s,
	Hr,
	Ripple,
	LoadingModal
	//ActionBar
} from 'components';
import {
	Dimensions,
	AndroidUtilities,
	request,
	InteractUser
} from 'ydc';
import CountryPicker from 'components/countryCode';
import GlobalHandler from 'res/GlobalHandler';
const PromoImage = '../res/images/promo.png';
const PromoImageHeight = AndroidUtilities.hp('36.96%');
const TextInputHeight = AndroidUtilities.hp('7%');
const TextInputWidth = AndroidUtilities.wp('88.5%');

const btnHeight = AndroidUtilities.hp('4.5%');
const btnWidth = AndroidUtilities.wp('27.22%');

const width = Dimensions.get('REAL_WINDOW_WIDTH');
let height = Dimensions.get('USABLE_HEIGHT');

import io from 'socket.io-client';
export default class Login extends React.Component {
	constructor(props){
		super(props)
		this.state = {
			phone_or_email:'',
			password:'',
			callingCode:'91',
			promoImageHeight:new Animated.Value(PromoImageHeight),
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
		Animated.spring(this.state.promoImageHeight, {
			toValue:endCoordinates.height - AndroidUtilities.hp("8%"),			
			useNativeDriver:false
		}).start();
	}
	_keyboardDidHide = (e) => {
		Animated.spring(this.state.promoImageHeight, {
			toValue:PromoImageHeight,
			useNativeDriver:false			
		}).start();
	}
	onLoginPress = () => {	 
		this.attemptLogin({});
		return
	  let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
	  let reg_num = /^\+?\d+$/;
	  const {phone_or_email,password} = this.state;
	  let phone_no = phone_or_email, data = {};
	  if(request.isBlank(phone_no)){
	     ToastAndroid.show("Enter phone number!", ToastAndroid.SHORT);
	     return;
	  }else if(reg_num.test(phone_no) == true){	     
	     if(phone_no.length != 10 ){
	       ToastAndroid.show("Phone number should contains 10 nunmbers only!", ToastAndroid.SHORT);
	       return;
	     }     
	  }else if(isNaN(parseInt(phone_no, 10)) &&reg_num.test(phone_no) == false){
	    ToastAndroid.show("Invalid phone number!", ToastAndroid.SHORT);
	  }
	  if(request.isBlank(password)){
		ToastAndroid.show("Enter Password!", ToastAndroid.SHORT);
		return;
	  }else if(password.length < 6){
		ToastAndroid.show("Password too short!", ToastAndroid.SHORT);
		return;
	  }
	  data['phone_no'] = `+${this.state.callingCode+phone_no}`;
	  data['password'] = password;
	  this.attemptLogin(data);
	}
	dispatchId = () => {
		var fetchId = request.makeid(6);
		this.setState({
			fetchId
		})
		return fetchId;
	}
	attemptLogin = async (data) => {	    
		try{
			this.loading.show();
			this.furtherProcess({user : 'dsfds', partner : 'nn22s'});
			return
			const res = await request.perform("login", data, this.dispatchId(), false);						
			if(res == 'fetch_error'){
			  this.error();
			}else if(typeof res == 'object'){
				if(res.status == 200){
					// InteractUser.loginViaToken(res.data.token, callback => {
					// 	if(callback == 'verified')
							this.furtherProcess({user : 'dsfds', partner : 'nn22s'});
					// 	else
					// 		this.error();
					// })			
				}else if(res.status == 400){
					ToastAndroid.show(res.data, ToastAndroid.LONG);
				}else{
					this.error();
				}
			}else{
				this.error();
			}
		}catch(err){    			
			this.error();
		}
	}
	furtherProcess(dta){
		this.loading.hide();
		if(dta.partner != false){
			GlobalHandler.setMultiAsyncData({
				user:{
					id : 1,
					name : 'Deepak',
					relation_code : 'asda',
					fire_id : 'hasj'
				},
				partner: {
					id : 2,
					name : 'Test',
					relation_code : 'asda',
					fire_id : 'hasj'
				},
				log_state: 3
			});
			GlobalHandler.setUser({
					id : 1,
					name : 'Deepak',
					relation_code : 'asda',
					fire_id : 'hasj'
			});
			GlobalHandler.setPartner({
					id : 2,
					name : 'Test',
					relation_code : 'asda',
					fire_id : 'hasj'
			});
			// InteractUser.initListener();
			setTimeout(() => this.props.navigation.navigate('HomeActivity'), 100);
		}else{
			Alert.alert(
		      "No Partner connected",
		      "you are just on step away from connecting partner",
		      [
		        {
		          text: "Cancel",		          
		          style: "cancel"
		        },
		        { text: "OK", onPress:() => this.connectPartner(dta)}
		      ]		      
		    );
		}		
	}
	error(){
		this.loading.hide();
		ToastAndroid.show("Error found please try again later!", ToastAndroid.LONG);
	}
	navForgot = () => {
		this.props.navigation.navigate('RegisterAcitivty', {screen:'ForgotPassword'})
	}
	connectPartner(response){
		GlobalHandler.setMultiAsyncData({
			user:response['user'],
			log_state:2
		});
		GlobalHandler.setUser(response['user']);
		this.props.navigation.navigate('Verification');
	}
	handleSelect = ({callingCode}) => {
		this.setState({callingCode:callingCode[0]})
	}
	render(){
		const {
			promoImageHeight
		} = this.state;
		return (	
		<View style={{height, width, backgroundColor:s[config.theme_s].color}}>		 
		 <Animated.View style={{width:width,height:promoImageHeight}}>
		 <Ripple>
		 <Image 		  
		  source={require(PromoImage)}
		  style={[s["tw"].h100,s["tw"].w100]}
		 />
		 </Ripple>
		 </Animated.View>		 
		 <View style={{height:AndroidUtilities.hp("10%"),width:width}}>
			 <Text style={{fontSize:AndroidUtilities.fv(33),fontWeight:'bold',alignSelf:'center',color:'white'}}>
			 {config.appName}
			 </Text>
			 <Text style={[{fontSize:AndroidUtilities.fv(12),marginTop:AndroidUtilities.hp("1%"),alignSelf:'center',color:'white'}]}>
			 The private place for only two hearts
			 </Text>
		 </View>		
		 <View style={{
		 	marginTop:AndroidUtilities.hp("4%")
		 }}>
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
		   selectionColor={s[config.theme_s].selectionColor}
		   placeholder="Phone no or email"
		   keyboardType="email-address"
		   onChangeText={(phone_or_email) => this.setState({phone_or_email})}
		   style={{
		   	width:"80%",
		   	color:"black",
		   	fontWeight:"bold",
		   	fontSize:AndroidUtilities.fv(12)
		   }}
		  />
		 </View>

		 <View style={sty.textInput}>
		  <View style={[s["tw"].h100,s["tw"].w15,s["tw"].centerItems]}>
		   <Icon name="lock_outline" color="black" size={AndroidUtilities.fv(25)} />
		  </View>
		  <TextInput 
		   TextContentType="password"
		   secureTextEntry
		   keyboardType="visible-password"
		   onChangeText={(password) => this.setState({password})}
		   autoCompleteType="password"
		   selectionColor={s[config.theme_s].selectionColor}
		   placeholder="Password"
		   style={{
		   	width:"80%",
		   	color:"black",
		   	fontWeight:"bold",
		   	fontSize:AndroidUtilities.fv(12)
		   }}
		  />
		 </View>
		 </View>
		 <Text onPress={this.navForgot} style={{fontSize:14,color:'#f2f2f2',width:TextInputWidth,alignSelf:'center',marginTop:20,marginLeft:10}}>Forgot Password?</Text>
		 <Ripple onPress={this.onLoginPress} style={{width:btnWidth,height:btnHeight,borderRadius:10,alignItems:'center',justifyContent:'center',alignSelf:'center',marginTop:AndroidUtilities.hp("2%"),overflow:'hidden',backgroundColor:s[config.theme_s].light}}>		  
		  <Text style={{
		  	fontSize:AndroidUtilities.fv(14),
		  	fontWeight:'bold',
		  	color:'white',		  	
		  }}>Login</Text>		  
		 </Ripple>

		 <Ripple onPress={() => this.props.navigation.navigate('RegisterAcitivty')} rippleContainerBorderRadius={30} style={{
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
		  }}>Create New Account</Text>
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
 	marginTop:AndroidUtilities.hp("3.5%")
  }
})