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
	ToastAndroid,
	TouchableOpacity
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
	request
} from 'ydc';
import GlobalHandler from 'res/GlobalHandler';

const UpdateDetailsHeight = AndroidUtilities.hp('70.31%');
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
		   adjustableY:new Animated.Value(0),
		   birthDay:'7-7-2003',
		   gender:'male',
		   full_name:'',
		   password:''
		}		
	}	
	componentDidMount(){
	   console.log("from app ->"+fire_id)
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
			let validFullName = request.removeSpaces(this.state.full_name);		
			if(!request.isValidName(validFullName)){			
				request.pop("Please enter valid name!");
				return;
			}else if(request.countWords(validFullName) < 2){
				request.pop("Please enter your surname!");
				return;
			}else if(this.state.password.length < 6){
				request.pop("Password is too short!");
				return;
			}
			this.loading.show();
			const data = {};
			data['full_name'] = validFullName;
			data['password'] = this.state.password;
			data['gender'] = this.state.gender;	
			data['born'] = this.state.birthDay;	
			data['fireid'] = fire_id;
			data['phone_no'] = phone_no;
			data['platform'] = 'android';
			data['platform_details'] = 'android';						
			const res = await request.perform("registerUser", data, "log", false);
			console.log(res)
			if(res)this.loading.hide();			
			if(res == 'fetch_error'){
			  this.error();
			}else if(typeof res == 'object'){
				if(res.status == 200){								
					GlobalHandler.setMultiAsyncData({
						user:res.data['user'],
						log_state:2
					});
					GlobalHandler.setUser(res.data['user']);
					this.props.navigation.navigate('Verification');					
				}else if(res.status == 400){
					request.pop(res.data);
				}else{
					this.error();
				}
			}else{
				this.error();
			}
		}catch(err){
		    console.log(err);		    
			this.loading.hide();
			this.error();
		}
	}
	error(){
		request.pop("Error found please try again later!");
	}
	render(){
		const {
			full_name,
			password
		}	= this.state;
		return (	
		<View style={{height:AndroidUtilities.hp("100%"),width, backgroundColor:s[config.theme_s].color, justifyContent:'center'}}>
		 	
		 
		 <Animated.View style={{height:UpdateDetailsHeight,alignSelf:'center',justifyContent:'center', alignItems:'center', width:TextInputWidth, transform:[{translateY:this.state.adjustableY}]}}>

		 <StageAdapter currentIdx={0} height={AdapterHeight} width={TextInputWidth} />

		 <View style={sty.textInput}>
		  <View style={[s["tw"].h100,s["tw"].w15,s["tw"].centerItems]}>
		   <Icon name="user_outline" color="black" size={AndroidUtilities.fv(25)} />
		  </View>

		  <TextInput
		   selectionColor={s[config.theme_s].selectionColor}
		   placeholder="Fullname"
		   value={full_name}
		   onChangeText={(full_name) => this.setState({full_name})}
		   keyboardType="email-address"
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
		   placeholder="Password"
		   value={password}
		   onChangeText={(password) => this.setState({password})}		   
		   style={{
		   	width:"80%",
		   	color:"black",
		   	fontWeight:"bold",
		   	fontSize:AndroidUtilities.fv(12)
		   }}
		  />
		 </View>

		 <GenderSlider onChange={gender => this.setState({
		 	gender
		  })}
		 />		 

		 <WheelDatePicker
		   style={sty.dateInput}
		   textSize={40}
		   onChange={data => {
		   	let birthDay = data.day+'-'+data.month+'-'+data.year;
		   	this.setState({
		   		birthDay:birthDay
		   	})
		   }}
		  />		
		  <Ripple rippleContainerBorderRadius={10} onPress={this.handleFinalRegister} style={{width:btnWidth,height:btnHeight,borderRadius:10,alignItems:'center',justifyContent:'center',alignSelf:'center',backgroundColor:s[config.theme_s].light,top:20}}>		 
		  <Text style={{
		  	fontSize:AndroidUtilities.fv(14),
		  	fontWeight:'bold',
		  	color:'white',		  	
		  }}>Next</Text>		 
		 </Ripple>

		 </Animated.View>

		 
		 
          <LoadingModal ref={ref => this.loading = ref}/>
		</View>		
		)
	}
}

class GenderSlider extends React.Component {
	constructor(props){
		super(props)
		this.minMoveX = AndroidUtilities.wp("50%");
		this.maxMoveX = AndroidUtilities.wp("58.3564%");

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
          	if(this.hasMoved){
          		if(gestureState.moveX > half){
	            	Animated.timing(this.currentX, {
	            		toValue:this.maxMoveX,
	            		duration:200,
	            		useNativeDriver:false
	            	}).start();
	            	this.props.onChange('female');
	            }else{
	            	Animated.timing(this.currentX, {
	            		toValue:this.minMoveX,
	            		duration:200,
	            		useNativeDriver:false
	            	}).start();
	            	this.props.onChange('male');
	            }
          	}else{          		
          		if(gestureState.x0 > half){
	            	Animated.timing(this.currentX, {
	            		toValue:this.maxMoveX,
	            		duration:200,
	            		useNativeDriver:false
	            	}).start();
	            	this.props.onChange('female');
	            }else{
	            	Animated.timing(this.currentX, {
	            		toValue:this.minMoveX,
	            		duration:200,
	            		useNativeDriver:false
	            	}).start();
	            	this.props.onChange('male');
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
 	marginTop:AndroidUtilities.hp("2.5%")
  },
  dateInput:{
  	height:TextInputHeight*3,
 	width:TextInputWidth,
 	elevation:5,
 	backgroundColor:'white',
 	alignSelf:'center',
 	flexDirection:'row',
 	borderRadius:10,
 	marginTop:AndroidUtilities.hp("2.5%") 	
  },
})