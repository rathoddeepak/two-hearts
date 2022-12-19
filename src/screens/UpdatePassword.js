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
	TouchableOpacity,
	Alert
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
	WheelDatePicker,
	request,
	InteractUser
} from 'ydc';
import GlobalHandler from 'res/GlobalHandler';

const UpdateDetailsHeight = AndroidUtilities.hp('46.31%');
const AdapterHeight = AndroidUtilities.hp('5.241%');

const TextInputHeight = AndroidUtilities.hp('7%');
const TextInputWidth = AndroidUtilities.wp('88.5%');

const btnHeight = AndroidUtilities.hp('4.5%');
const btnWidth = AndroidUtilities.wp('27.22%');

const width = Dimensions.get('REAL_WINDOW_WIDTH');

export default class UpdatePassword extends React.Component {
	constructor(props){
		super(props)
		this.state = {
		   adjustableY:new Animated.Value(0),
		   cpassword:'123456',
		   password:'123456'
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
			toValue:-endCoordinates.height/1.5,			
			useNativeDriver:false
		}).start();
	}
	_keyboardDidHide = (e) => {
		Animated.timing(this.state.adjustableY, {
			toValue:0,			
			useNativeDriver:false
		}).start();
	}
	handleFinalRegister = async () => {	    
		try{	
			if(this.state.password.length < 6){
				request.pop("Password is too short!");
				return;
			}else if(this.state.cpassword != this.state.password){
				request.pop("Password does not match!");
				return;
			}
			this.loading.show();
			const data = {
				password:this.state.password,
				fire_id,
				phone_no				
			};
			const res = await request.perform("user_handler", data, "log", false);			
			if(res)this.loading.hide();			
			if(typeof res == 'object' && res.status == 200){				
				const response = res.data;
				if(response.user == false){
					Alert.alert(
				      "You don't have account",
				      "you are just on step away from creating a new account",
				      [
				        {
				          text: "Cancel",		          
				          style: "cancel"
				        },
				        { text: "OK", onPress:() => this.createAccount(response)}
				      ]		      
				    );						;
				}else if(response.user && response.partner == false){
					Alert.alert(
				      "No Partner connected",
				      "you are just on step away from connecting partner",
				      [
				        {
				          text: "Cancel",		          
				          style: "cancel"
				        },
				        { text: "OK", onPress:() => this.connectPartner(response)}
				      ]		      
				    );
				}else if(response.user && response.partner){
					GlobalHandler.setMultiAsyncData({
						user:res.data['user'],
						partner: res.data.partner,
						log_state: 3
					});
					GlobalHandler.setUser(res.data['user']);
					GlobalHandler.setPartner(res.data['partner']);
					InteractUser.initListener();
					setTimeout(() => this.props.navigation.navigate('HomeActivity'), 100);
				}else{
					this.error();
				}
			}else{
				this.error();
			}
		}catch(err){		  	
			this.loading.hide();
			this.error();
		}
	}
	createAccount(data){	
		setTimeout(() => this.props.navigation.navigate('UpdateDetails'), 100);
	}
	connectPartner(response){
		GlobalHandler.setMultiAsyncData({
			user:response['user'],
			log_state:2
		});
		GlobalHandler.setUser(response['user']);
		this.props.navigation.navigate('Verification');
	}
	error(){
		request.pop("Error found please try again later!");
	}
	render(){
		const {			
			password,
			cpassword
		}	= this.state;
		return (	
		<View style={{height:AndroidUtilities.hp("100%"),width, backgroundColor:s[config.theme_s].color, justifyContent:'center'}}>		 	
		 
		 <Animated.View style={{height:UpdateDetailsHeight,alignSelf:'center',justifyContent:'center', alignItems:'center', width:TextInputWidth, transform:[{translateY:this.state.adjustableY}]}}>

		 <View style={sty.textInput}>
		  <View style={[s["tw"].h100,s["tw"].w15,s["tw"].centerItems]}>
		   <Icon name="lock_outline" color="black" size={AndroidUtilities.fv(25)} />
		  </View>

		  <TextInput
		   selectionColor={s[config.theme_s].selectionColor}
		   placeholder="Password"
		   value={password}
		   onChangeText={(password) => this.setState({password})}
		   secureTextEntry
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
		   selectionColor={s[config.theme_s].selectionColor}
		   placeholder="Confirm Password"
		   value={cpassword}
		   secureTextEntry
		   onChangeText={(cpassword) => this.setState({cpassword})}		   
		   style={{
		   	width:"80%",
		   	color:"black",
		   	fontWeight:"bold",
		   	fontSize:AndroidUtilities.fv(12)
		   }}
		  />
		 </View>
	
		  <Ripple rippleContainerBorderRadius={10} onPress={this.handleFinalRegister} style={{width:btnWidth,height:btnHeight,borderRadius:10,alignItems:'center',justifyContent:'center',alignSelf:'center',backgroundColor:s[config.theme_s].light,top:20}}>		 
		  <Text style={{
		  	fontSize:AndroidUtilities.fv(14),
		  	fontWeight:'bold',
		  	color:'white',		  	
		  }}>Confirm</Text>		 
		 </Ripple>

		 </Animated.View>

		 
		 
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
 	marginTop:AndroidUtilities.hp("2.5%")
  }
})