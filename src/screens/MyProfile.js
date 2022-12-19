import React, { Component } from 'react';
import {
	View,
	Text,
	StyleSheet,
	TouchableNativeFeedback,
	TouchableOpacity,
	ScrollView
} from 'react-native';

import {
	Ripple,
	s,
	Icon,
	ImageView
} from 'components';

import {
	AndroidUtilities,
	request
} from 'ydc';
import constants from 'libs/constants';

export default class MyProfile extends Component {
	handleOpenAvatar = () => {
		console.log('asd')
	}
	render() {
		const cover = request.site_url()+user.cover;
		const avatar = request.site_url()+user.avatar;
		return (
			<View style={sty.container}><ScrollView>
				<View style={sty.mc}>	               
	                <View style={sty.profile}>                
	                    <TouchableNativeFeedback onPress={this.handleOpenCover}>
		                <View style={{flex:1}}>
		                <ImageView
		                 source={cover}
		                 blurHash={user.hcover}
		                 style={{width:'100%', height:'100%'}}
		                /></View></TouchableNativeFeedback>

		               
		                <View style={sty.name}>
		                 <Text numberOfLines={1}  style={sty.uname}>{user.full_name}</Text>
		                 <Text numberOfLines={3} style={sty.about} >{user.about != '' ? user.about : 'Write something about you!'}</Text>		                                 
	                    </View> 

	                    <View style={{position:'absolute',left:0,padding:10,top:20}}>
	                     <Ripple onPress={() => this.props.navigation.goBack()}>
	                      <Icon name="back" style={sty.txtShd} color="#fff" size={30} />
	                     </Ripple>
	                    </View>
	                    	                    
	                    <View style={{position:'absolute',right:0,padding:10,top:20}}>
	                     <Ripple onPress={() => this.props.navigation.navigate('EditProfile')}>
	                     <Icon name="edit" style={sty.txtShd} color="#fff" size={30} />
	                     </Ripple>
	                    </View>	                    

	                </View>
	                 <View style={sty.avatar}>
		                    <Ripple rippleContainerBorderRadius={4} onPress={this.handleOpenAvatar} style={{elevation:2,width:90,height:90}}>
			                    <ImageView
			                     borderRadius={4}
				                 source={avatar}
				                 blurHash={user.hprofile}		                     
				                 style={{width:90,height:90}}
				                />
			                </Ripple>
		                </View>
	               </View>


	              <View style={[sty.mcd, {marginTop:20,padding:10}]}>
				    <Text style={sty.stopic}>About you</Text>
				    <Text numberOfLines={3} style={sty.sbtopic}>use pin, password, biometrics and our special magic lock to open app</Text>
				    <Section name="In love with" b={partner['full_name']} hb icon="heart" />
				    <Section name="Your are" b={user['gender']} hb icon="user"  />
				    <Section name="Phone number" b={user['phone_no']} hb icon="phone"  />
				    <Section name="Born" b={user['born']} hb icon="baby"  />				    
			      </View>

			      <View style={[sty.mcd, {marginTop:20,padding:10}]}>
				    <Text style={sty.stopic}> Your Partner</Text>
				    <Text numberOfLines={3} style={sty.sbtopic}>use pin, password, biometrics and our special magic lock to open app</Text>
				    <Section name={`${partner.gender == "male" ? "His" : "Her"} name is `} b={partner['full_name']} hb icon="user" />
				    <Section name="In love with" b={user['full_name']} hb icon="heart" />
				    <Section name="Phone number" b={partner['phone_no']} hb icon="phone"  />
				    <Section name="Born" b={partner['born']} hb icon="baby"  />				    
			      </View>
			      <Ripple style={[sty.mcd, {marginTop:20,padding:10,justifyContent:'center',alignItems:'center'}]}>
			       <Text style={{fontSize:AndroidUtilities.fv(12),color:'red'}}>DISCONNECT PARTNER</Text>
			      </Ripple>
			      <View style={{height:70}}/>

			</ScrollView></View>
		)
	}
}

class Section extends Component {
	render() {
		const {
			name,
			icon,
			selected,
			hb,
			b
		} = this.props;
		return (
			<Ripple style={sty.itm}>
			 <View style={sty.itm1}>
			  <Icon name={icon} size={30} color="#B5BECF" />
			 </View>
			 <View style={sty.itm2}>
			  <Text style={sty.itxt}>{name} {hb ? <Text style={{fontWeight:'bold'}}>{b}</Text> : null}</Text>
			 </View>
			</Ripple>
		)
	}
}

const sty = StyleSheet.create({
	container:{height:constants.maxHeight2(),width:constants.width()},
	mc:{backgroundColor:'white',elevation:1,height:350},
	profile:{height:250,width:'100%',backgroundColor:'white'},
	name:{width:constants.width()-155,left:120,position:'absolute',bottom:-100,height:100,padding:10},
	uname:{fontSize:16,fontFamily:'sans-serif-medium',color:'#000'},
	about:{fontSize:12,fontFamily:'sans-serif-light',color:'grey'},
	txtShd:{textShadowColor: 'rgba(0, 0, 0, 0.75)',textShadowOffset: {width: -1, height: 1},textShadowRadius: 10},txtShd2:{textShadowColor: 'rgba(0, 0, 0, 0.4)',textShadowOffset: {width: -1, height: 1},textShadowRadius: 10},
	avatar:{position:'absolute',backgroundColor:"white",height:100,width:100,justifyContent:"center",alignItems:"center",bottom:15,left:10,borderRadius:4},

	stopic:{fontSize:AndroidUtilities.fv(13),fontWeight:'bold',color:'#000'},
	sbtopic:{fontSize:AndroidUtilities.fv(10),color:'#000',width:'90%',fontFamily:'sans-serif-light'},
	mcd:{width:'100%',paddingLeft:10,paddingBottom:10,backgroundColor:'white',elevation:1},
	itm:{height:50,flexDirection:'row',width:'100%'},
	itm1:{justifyContent:'center',alignItems:'center',width:30,height:50},
	itm2:{justifyContent:'center',height:50},
	itxt:{fontSize:AndroidUtilities.fv(12),color:'#000',paddingLeft:10}	
})