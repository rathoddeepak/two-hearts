import React, { Component } from 'react';
import {
	View,
	TextInput,
	Text,
	TouchableOpacity,
	ScrollView,
	StyleSheet,
	Animated,
	Image
} from 'react-native';
import moment from 'moment';
import constants from 'libs/constants';
import {
	CheckBoxT,
	WheelDatePicker,
	Dimensions,
	AndroidUtilities,
	WheelPicker,
	request
} from 'ydc';
import	{
	s,
	LoadingModal
} from 'components';
const OURSPECIAL = 1;
const PROPOSED = 3;
const MY_BIRTHDAY = 2;
const PARTNER_BIRTHDAY = 4;
const ANNIVERSARY = 5;
const OUR_FIRST_KISS = 6;
const ENGAGMENT = 7;
const WEDDING = 8;
const EXPECTINGBABY = 9;

const NONE = -1;
const ONDAY = 0;
const DAYBEFORE = 1;
const TWODAY = 2;
const WEEK = 7;
const TENDAY = 10;
const TWOWEEK = 14;

//Dimensions
const ABOVEGAP = AndroidUtilities.hp("7.03%");
const HWIDTH = AndroidUtilities.wp("87.22%"); //Holder Width
const INHEIGHT = AndroidUtilities.hp("6.24%");
const INHEIGHT2 = AndroidUtilities.hp("17.11%");
const INHEIGHT3 = AndroidUtilities.hp("14.11%");
const INHEIGHT4 = AndroidUtilities.hp("29.58%");
const MR = AndroidUtilities.hp("2.75%");
const C1 = "#F2F3F5";
const C2 = "#DDDDDF";
export default class AddSpecialDay extends Component {
	constructor(props) {
		super(props);
		this.state = {
			title:'',
			type:OURSPECIAL,
			about:'',
			_id:-1,
			types:[
			 {
			 	title:'Our Special Day',
			 	code:OURSPECIAL
			 },
			 {
			 	title:'Proposed',
			 	code:PROPOSED
			 },
			 {
			 	title:'My Birthday',
			 	code:MY_BIRTHDAY
			 },
			 {
			 	title:"Partner's Birthday",
			 	code:PARTNER_BIRTHDAY
			 },
			 {
			 	title:'Anniversary',
			 	code:ANNIVERSARY
			 },
			 {
			 	title:'Our First Kiss',
			 	code:OUR_FIRST_KISS
			 },
			 {
			 	title:'Engagment',
			 	code:ENGAGMENT
			 },
			 {
			 	title:'Wedding',
			 	code:WEDDING
			 },
			 {
			 	title:'Expecting a baby',
			 	code:EXPECTINGBABY
			 }
			],
			onHome:false,
			repeat:false,
			date:moment().unix(),
			alert:false,
			sendTo:[0,1],
			sendType:NONE,
			alertHeight:new Animated.Value(INHEIGHT),
			sendTypes:['On Day of event', 'One Day Before', 'Two Day Before', 'A Week Before', 'Ten Days Before', 'Two Weeks Before']
		}
	}

	componentDidMount () {
		if(this.props.route.params?.item) {
			const {
				tt,
				tp,
				ab,
				oh,
				rp,
				dt,
				al,
				st,
				_id
			} = this.props.route.params.item;
			this.setState({
				title:tt,
				type:tp,
				about:ab,
				onHome:oh,
				repeat:rp,
				date:dt,
				alert:al,
				sendType:st,
				_id
			})
		}
	}

	handleAlertChange = (alert) => {
		this.setState({alert});
		Animated.spring(this.state.alertHeight, {
			toValue:alert ? INHEIGHT4 : INHEIGHT,
			useNativeDriver:false
		}).start();
		if(alert)setTimeout(() =>this.scrollView.scrollToEnd(), 250);
	}

	handleSubmit = async () => {
		try{			
			const {
				title,
				type,
				about,
				onHome,
				repeat,
				date,
				alert,
				sendType
			} = this.state;
			if(request.isBlank(title)){
				request.pop("Title Can't be blank");
			    return;
			}else if(title.length <= 1){
				request.pop("Title too short");
			    return;
			}else if(title.length >= 150){
				request.pop("Title too long");return;
			}else if(request.isBlank(about)){
				request.pop("about Can't be blank");
			    return;
			}else if(about.length <= 20){
				request.pop("about too short");
			    return;
			}else if(about.length > 250){
				request.pop("about too long");
			    return;
			}else if(!repeat && date < moment().unix() && alert){
				request.pop("To make alert every year, turn on REPEAT");
			    return;		
			}
			var tm = moment().unix();		
			var sendObject = {
				tt:title,
				tp:type,
				ab:about,		
				oh:onHome,
				rp:repeat,
				dt:date,
				al:alert,
				st:sendType,
				store:'sds',				
				tm,
				user_id,
				relation_code,
			}
			if(this.state._id != -1){
				sendObject['request'] = 'update_day';
				sendObject['_id'] = this.state._id;
			}
			this.loading.show();	
			var res = await request.perform('specialdays_handler', {params:JSON.stringify(sendObject)},"sds", false);
			if(res)this.loading.hide();
			if(res != 'fetch_error' && typeof res == 'object' && res.status == 200){
				if(this.state._id == -1){
					request.pop("Special Day Created Successfully!!");
					this.props.route.params?.onAddDay(res.id, sendObject, tm);
			    }else{
			    	request.pop("Special Day Updated Successfully!!");
					this.props.route.params?.onEditDay(res.id, sendObject, tm);
			    }
				this.props.navigation.goBack();
			}else{
				if(this.state._id != -1)
					request.pop("Error while creating specail day!");
				else
					request.pop("Error while updating specail day!");
			}
		}catch(err){

			this.loading.hide();	
		}
	}

	render() {
		const {
			title,
			about,
			onHome,
			repeat,
			alertHeight,
			alert,
			sendTypes
		} = this.state;
		return (
			<View style={sty.container}>
			<ScrollView ref={ref => this.scrollView = ref}>
			 <View style={sty.holder}>
			 
			  <Text style={sty.title}>Special Days 🎉</Text>
			  <Text style={sty.subtitle}>Create special day that matter for you and your partner</Text>
			  
			  <TextInput placeholderTextColor="#9e9e9e" selectionColor="#9e9e9e21" onChangeText={title	=> this.setState({title})} value={title} placeholder="Title" style={sty.input} selectionColor={s[config.theme_s].color} />
              <TextInput placeholderTextColor="#9e9e9e" selectionColor="#9e9e9e21" onChangeText={about	=> this.setState({about})} value={about} multiline placeholder="Write fews lines about these day" style={sty.input} selectionColor={s[config.theme_s].color} />

              {/*<View style={sty.input2}>
               <Text style={sty.itxt}>Display on Home</Text> 
                <View style={sty.ps}><CheckBoxT
				  ref={ref => this.checkBox = ref}
				  onChange={onHome => this.setState({onHome})}
				  checked={onHome}
				  type={8}
				  size={AndroidUtilities.fv(22)}				  
				  colorMap = {{
				    background:s[config.theme_s].color,
				    background2:s[config.theme_s].color,
				    check:"#9e9e9e",
				    disabled:"yellow"
				  }}
				/> 
				</View>
              </View>

              <View style={sty.input2}>
               <Text style={sty.itxt}>Repeat Every Year</Text> 
                <View style={sty.ps}>
                <CheckBoxT
				  ref={ref => this.checkBox = ref}
				  onChange={repeat => this.setState({repeat})}
				  checked={repeat}
				  type={8}
				  size={AndroidUtilities.fv(22)}				  
				  colorMap = {{
				    background:s[config.theme_s].color,
				    background2:s[config.theme_s].color,
				    check:"#9e9e9e",
				    disabled:"yellow"
				  }}
				/> 
				</View>
              </View>*/}

              <View style={sty.input3}>               
               <WheelDatePicker style={{
	               	height:INHEIGHT3,
				 	width:HWIDTH,			 	
				 	alignSelf:'center',
				 	flexDirection:'row',
				 	borderRadius:10			 	
	            }}
	            dateOfAge={false}
                hasIcon={false}
                textSize={50}                
                onChange={data => {
				   	let birthDay = data.day+'-'+data.month+'-'+data.year;
				   	this.setState({
				   		birthDay:birthDay
				   	})
				 }}
               />
              </View>

              <Animated.View style={[sty.input2, {
              	height:alertHeight
              }]}>
               <Text style={sty.itxt}>Alert</Text> 
                <View style={sty.ps}><CheckBoxT				  
				  onChange={this.handleAlertChange}
				  checked={alert}
				  type={8}
				  size={AndroidUtilities.fv(22)}				  
				  colorMap = {{
				    background:s[config.theme_s].color,
				    background2:s[config.theme_s].color,
				    check:"#9e9e9e",
				    disabled:"yellow"
				  }}
				/> 
				</View>

				<WheelPicker				 
				 style={{
				 	height:INHEIGHT3,
				 	width:'100%',
				 	opacity:alert ? 1 : 0
				 }}
				 data={sendTypes}
				 textSize={45}
				 atmospheric
				 selectedItemPosition={0}
				 onItemSelected={sendType => this.setState({sendType})}
				/>

				<Text style={[sty.itxt, {opacity:alert ? 1 : 0}]}>Send to</Text> 
				
				<View style={{flexDirection:'row',opacity:alert ? 1 : 0}}>				 
				 <View style={{marginRight:10}}>
				  <Image source={{url:config.siteUrl+user['avatar']}} style={{width:AndroidUtilities.fv(45), height:AndroidUtilities.fv(45), backgroundColor:C2}} borderRadius={100} />
				  <View style={{position:'absolute',bottom:0,right:0}}>
				  <CheckBoxT				  
					  onChange={() => {}}
					  checked={true}
					  type={7}					  
					  size={AndroidUtilities.fv(15)}				  
					  colorMap = {{
					    background:s[config.theme_s].color,
					    background2:"white",
					    check:C1,
					    disabled:"yellow"
					  }}
					/> 
				 </View>
				 </View>
				 <View style={{marginRight:10}}>
				  <Image source={{url:config.siteUrl+partner['avatar']}} style={{width:AndroidUtilities.fv(45), height:AndroidUtilities.fv(45), backgroundColor:C2}} borderRadius={100} />
				  <View style={{position:'absolute',bottom:0,right:0}}>
				  <CheckBoxT				  
					  onChange={() => {}}					  
					  type={7}
					  checked={true}			  
					  size={15}				  
					  colorMap = {{
					    background:s[config.theme_s].color,
					    background2:"white",
					    check:C1,
					    disabled:"yellow"
					  }}
					/> 
				 </View>
				 </View>
				</View>				
              </Animated.View>
              
              <TouchableOpacity style={[sty.button, {backgroundColor:s[config.theme_s].color}]} activeOpacity={0.8} onPress={this.handleSubmit}>
               <Text style={sty.itxt2}>Done</Text>                 
              </TouchableOpacity>

			 </View>
			 </ScrollView>

			 <LoadingModal ref={ref => this.loading = ref}/>			
			</View>
		)
	}
}

const sty = StyleSheet.create({
	container: {
		height:constants.maxHeight2(),
		width:constants.width(),
		backgroundColor:'white'
	},
	holder:{
		width:HWIDTH,
		marginTop:ABOVEGAP,
		marginBottom:AndroidUtilities.hp("10%"),
		alignSelf:"center"
	},
	title:{
		fontSize:AndroidUtilities.fv(20),
		fontWeight:'bold',
		color:"black",
		textAlign:"center",
		width:'100%',
		marginBottom:AndroidUtilities.fv(10)
	},
	subtitle:{
		fontSize:AndroidUtilities.fv(15),		
		textAlign:"center",
		width:HWIDTH,
		marginBottom:MR
	},
	input:{
		height:INHEIGHT,
		width:HWIDTH,
		borderRadius:7,
		backgroundColor:C1,
		borderColor:C2,
		color:"#000",
		borderWidth:1,
		fontSize:AndroidUtilities.fv(12),
		marginBottom:MR,
		paddingLeft:AndroidUtilities.fv(10),
		paddingTop:AndroidUtilities.fv(10)
	},
	itxt:{
		fontSize:AndroidUtilities.fv(12),
		color:'#9e9e9e',
		marginRight:AndroidUtilities.fv(10)
	},
	ps:{
		position:'absolute',
		right:AndroidUtilities.fv(10),
		top:AndroidUtilities.fv(10),
	},
	input2:{
		height:INHEIGHT,
		width:HWIDTH,
		borderRadius:7,
		backgroundColor:C1,
		borderColor:C2,		
		borderWidth:1,		
		marginBottom:MR,
		paddingLeft:AndroidUtilities.fv(10),
		paddingTop:AndroidUtilities.fv(10)		
	},
	input3:{		
		width:HWIDTH,
		height:INHEIGHT2,
		justifyContent:'center',
		borderRadius:7,
		backgroundColor:C1,
		borderColor:C2,		
		borderWidth:1,
		marginBottom:MR,		
		paddingLeft:AndroidUtilities.fv(10),
		paddingTop:AndroidUtilities.fv(10)		
	},
	button:{
		height:INHEIGHT,
		width:HWIDTH,
		borderRadius:7,
		marginBottom:MR,
		justifyContent:'center'	
	},
	itxt2:{
		fontSize:AndroidUtilities.fv(13),
		color:'#fff',
		textAlign:"center",
		fontWeight:'bold',
		width:'100%'
	}
})