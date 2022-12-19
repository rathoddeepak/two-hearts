import React, { Component } from 'react';
import {
	View,
	Text,
	ScrollView,
	StyleSheet
} from 'react-native';
import {
	Ripple,
	Icon,
	ImageView,
	s,
	LockOperator
} from 'components';
import {
	AndroidUtilities,
	Dimensions,
	request,
	InteractUser
} from 'ydc';
import constants from 'libs/constants';
const ScreenHeight = AndroidUtilities.hps("93.796%");
const MAX_WIDTH = Dimensions.get("REAL_WINDOW_WIDTH");
export default class Menu extends Component {
	constructor(props) {
		super(props);
		this.state = {
			currentLock:-1
		}	
	}
	componentDidMount() {
		this.invalidate();
	}
	invalidate = ()	=> {
		InteractUser.getCurrentLock(lock => {
			this.setState({
				currentLock: lock
			})
		})
	}
	lock = (type) => {
		this.lockOperator.show(type);
	}
	render() {
		const {
			currentLock
		} = this.state;
		const source = request.site_url() + user['avatar'];		
		return (
		    <View style={{height:ScreenHeight,width:MAX_WIDTH}}>
		    <ScrollView>
		      <View style={sty.mc}>
			    <Ripple onPress={() => this.props.navigation.navigate('MyProfile', {
		              user_id:user.user_id
		            })}>
		          <View style={{flexDirection:'row'}}>
		          <ImageView
		            imageHeight={100}
		            borderRadius={10}
		            source={source}
		            blurHash={user['hprofile']}
		            style={sty.pimage}
			      />
		          <View>
		  	        <Text numberOfLines={1} style={sty.uname}>   {user.full_name}</Text>
		  	        {/*<Text numberOfLines={1} style={sty.cp}>    {user.gender.toUpperCase()}, {user.phone_no}</Text>*/}
		  	        <Text numberOfLines={1} style={sty.cp}>    Male, 7020814070</Text>
		            <Text style={sty.op} onPress={() => this.props.navigation.navigate('MyProfile', {
		              user_id:user.user_id
		            })}>    Open Profile</Text>
		          </View></View>
		        </Ripple>
		      </View>  

		      <View style={[sty.mc, {marginTop:20,padding:10}]}>
			    <Text style={sty.stopic}>Password</Text>
			    <Text numberOfLines={3} style={sty.sbtopic}>use pin, password, our special picture lock to open app</Text>
			      <Section 
			       name="Picture Lock" icon="magic"
			       selected={currentLock == 0}
			       onPress={() => this.lock(0)}
			      />
			      <Section 
			       name="Pattern Lock" icon="pattern"
			       selected={currentLock == 1}
			       onPress={() => this.lock(1)}
			      />
			      <Section 
			       name="Pin Lock" icon="pin"
			       selected={currentLock == 2}
			       onPress={() => this.lock(2)}
			      />			   			    
		      </View>

		      <View style={[sty.mc, {marginTop:20,padding:10}]}>
			    <Text style={sty.stopic}>Notifications</Text>
			    <Text numberOfLines={3} style={sty.sbtopic}>use pin, password, biometrics and our special magic lock to open app</Text>
			    <Section name="Preview Profile Photo" icon="user" selected enabled />
			    <Section name="Preview messages" icon="Chat"  enabled />			    
		      </View>

		      <View style={{height:60,width:'100%'}}/></ScrollView>
		      <LockOperator {...this.props} ref={ref => (this.lockOperator = ref)} />
		    </View>
		)
	}
}

class Section extends Component {
	render() {
		const {
			name,
			icon,
			selected,
			onPress
		} = this.props;
		return (
			<Ripple style={sty.itm} onPress={onPress}>
			 <View style={sty.itm1}>
			  <Icon name={icon} size={30} color="#B5BECF" />
			 </View>
			 <View style={sty.itm2}>
			  <Text numberOfLines={1} style={sty.txt}>{name}</Text>
			 </View>
			 {selected ? 
			 <View style={[sty.itm1, {position: 'absolute',right:0}]}>
			  <Icon name='tick' size={30} color={s[config.theme_s].color} />
			 </View> : null}
			</Ripple>
		)
	}
}
const sty = StyleSheet.create({
	mc:{width:'100%',paddingLeft:10,paddingBottom:10,backgroundColor:'white',elevation:1},
	pimage:{width:100,height:100},
	uname:{color:'#000',fontSize:16,fontFamily:'sans-serif-medium',marginTop:7},
	cp:{marginTop:5,fontSize:12},
	op:{marginTop:5,fontSize:12,fontWeight:'bold',color:'grey'},
	stopic:{fontSize:AndroidUtilities.fv(18),fontWeight:'bold',color:'#000'},
	sbtopic:{fontSize:AndroidUtilities.fv(13),color:'#000',width:'90%',fontFamily:'sans-serif-light'},
	itm:{height:60,flexDirection:'row',width:'100%'},
	itm1:{justifyContent:'center',alignItems:'center',width:50,height:60},
	itm2:{justifyContent:'center',height:60},
	itxt:{fontSize:AndroidUtilities.fv(14),color:'#000',fontFamily:'sans-serif-light',width:'70%'}	
})