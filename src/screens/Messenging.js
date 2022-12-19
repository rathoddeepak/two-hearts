import React, { Component } from 'react';
import {
	View,
	Text,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
	TouchableNativeFeedback
} from 'react-native';
import {
	ImageView,
	s,
	Icon
} from 'components';
import TypingAnimation from 'components/indicator';
import {	
	InteractUser,
	AndroidUtilities
} from 'ydc';
import constants from 'libs/constants';
import LinearGradient from 'react-native-linear-gradient';
const ScreenHeight = AndroidUtilities.hps("93.796%");
const MessagingItemHolder = AndroidUtilities.hps("7.62%");
const StatusItemHeight = AndroidUtilities.hps("15.79%");
const StatusItemWidth = AndroidUtilities.wp("25.05%");
const paddingCommon = AndroidUtilities.wp("3.88%");
const cricle = MessagingItemHolder*2;
function decodeIcon (icon) {
	switch (icon){
		case 0:
		return 'Image';
		case 1:
		return 'Video';
		case 2:
		return 'Voice';
		case 3:
		return 'Audio';
		case 4:
		return 'Contact';
		case 5:
		return 'Location';
		case 6:
		return 'File';
	}
}
export default class Messenging extends Component {	
	constructor(props) {
		super(props);
		this.state = {			
			messageCount:0,
			typing:false,
			message:{}	
		};
		this._unsubscribe = this.props.navigation.addListener('focus', this.startTracker);
	    this._unsubscribe2 = this.props.navigation.addListener('blur', this.removeTracker);
		this.onCurrentScreen = false;
	}
	startTracker = (e) => {	  
	  this.onCurrentScreen = true;
	  this.props.navigation?.setParams({typing:false,count:0});
	}
	removeTracker = (e) => {		
	  this.onCurrentScreen = false;	  
	}
	componentDidMount() {
		InteractUser.startListener();
		InteractUser.getMessage();

		InteractUser.onTyping((data) => {			
			this.setState({typing:true});
			if(!this.onCurrentScreen)this.props.navigation?.setParams({typing:true});
		})

		InteractUser.onNotTyping((data) => {			
			this.setState({typing:false});			
			if(!this.onCurrentScreen)this.props.navigation?.setParams({typing:false});
		})

		InteractUser.onMessageChange((message) => {
			this.setState({message});
			if(!this.onCurrentScreen){
				this.props.navigation?.setParams({
					typing:false,count:message.unreadCount
				});
			}

		})
	}
	startChat = () => {
		let message = this.state.message;
		message['unreadCount'] = 0;
		this.setState({message})		
		InteractUser.startChatActivity();
	}
	showPromises = () => {
		this.props.navigation.navigate("Promises");
	}
	showNotes = () => {
		this.props.navigation.navigate("Notes");	
	}
	render() {
		const {
			typing			
		} = this.state;
		const {			
			typingString,
			time,
			hasMessage,
			messageIcon,
			message,
			tickState,
			unreadCount
		} = this.state.message;
		const media = messageIcon == -1 ? false : decodeIcon(messageIcon);
		const media2 = media ? media.toLowerCase() : "";
		const avatar = config.siteUrl + partner['avatar'];
		return (
			<View style={{width: constants.width(), height: ScreenHeight, backgroundColor:'white'}}>			 			
			 <View style={{width:constants.width(),height:StatusItemHeight,marginBottom:paddingCommon, flexDirection:'row'}}>
			 	
			 	<View style={[sty.statusItem, {backgroundColor:s[config.theme_s].color}]}>

			 	</View>

			 	<View style={[sty.statusItem, {backgroundColor:s[config.theme_s].color}]}>

			 	</View>

			 </View>

			 <TouchableNativeFeedback onPress={this.startChat}>
				 <View style={sty.item}>
				     <View style={sty.avatar}>
					 <ImageView
					  source={avatar}
					  borderRadius={cricle}
					  style={{width:MessagingItemHolder,height:MessagingItemHolder}}
					 />
					 </View>					
					 <View style={{justifyContent:'center', width:'65%'}}>
						 <Text numberOfLines={1} style={sty.title}>{partner['full_name']}</Text>
						 {typing ?
						  <TypingAnimation
					        dotColor={s[config.theme_s].color}
					        dotMargin={5}
					        dotAmplitude={3}
					        dotSpeed={0.1}
					        style={{height:18}}
					        dotRadius={2.5}
					        dotX={12}
					        dotY={7}
					      />
						 :
						 <View>
							 {media 
							 	?<View style={{flexDirection:'row'}}>
							 	  <Icon name={media2} size={18} />
							 	  <Text numberOfLines={1} style={sty.caption}>  {media}</Text>
							 	 </View>
							 	:<Text numberOfLines={1} style={sty.caption}>{message}</Text>
							 }
						 </View>
						}
					 </View>
					 {unreadCount > 0 ? 
					 <View style={sty.badgedC}>
					  <View style={[sty.badged, {backgroundColor:s[config.theme_s].color}]}><Text style={sty.badgedT}>{unreadCount}</Text></View>
					 </View> : null}
				 </View>
			 </TouchableNativeFeedback>

			 <TouchableNativeFeedback onPress={this.showPromises}>
				 <View style={sty.item}>
					 <LinearGradient colors={['#5E9BE3', '#BB1BC6']} style={{...sty.avatar, borderRadius:cricle, justifyContent:'center', alignItems:'center'}}>
						 <Icon name="promises" color="#fff" size={30} />
					 </LinearGradient>					 		
					 <View style={{justifyContent:'center', width:'65%'}}>
					 <Text numberOfLines={1} style={sty.title}>Promises</Text>
					 <Text numberOfLines={1} style={sty.caption}>Your promises are here</Text>					
					 </View>
				 </View>
			 </TouchableNativeFeedback>

			 <TouchableNativeFeedback onPress={this.showNotes}>
				 <View style={sty.item}>
					 <LinearGradient colors={['#5E9BE3', '#7048DF']} style={{...sty.avatar, borderRadius:cricle, justifyContent:'center', alignItems:'center'}}>
						 <Icon name="notes" color="#fff" size={30} />
					 </LinearGradient>					 		
					 <View style={{justifyContent:'center', width:'65%'}}>
					 <Text numberOfLines={1} style={sty.title}>Notes</Text>
					 <Text numberOfLines={1} style={sty.caption}>Save your notes</Text>					
					 </View>
				 </View>
			 </TouchableNativeFeedback>

			 {/*<TouchableNativeFeedback onPress={this.showNotes}>
				 <View style={sty.item}>
					 <LinearGradient colors={['#5E9BE3', '#7048DF']} style={{...sty.avatar, borderRadius:cricle, justifyContent:'center', alignItems:'center'}}>
						 <Icon name="diary" color="#fff" size={30} />
					 </LinearGradient>					 		
					 <View style={{justifyContent:'center', width:'65%'}}>
					 <Text numberOfLines={1} style={sty.title}>Dairy</Text>
					 <Text numberOfLines={1} style={sty.caption}>Write your amazing day</Text>					
					 </View>
				 </View>
			 </TouchableNativeFeedback>*/}

			</View>
		)
	}
}

const sty = StyleSheet.create({
	statusItem:{width:StatusItemWidth, height:StatusItemHeight, borderRadius:10, justifyContent:'center', alignItems:'center', marginLeft:paddingCommon},
	item:{height:MessagingItemHolder,width:constants.width(),marginVertical:paddingCommon,flexDirection:'row',backgroundColor:'white'},
	avatar:{width:MessagingItemHolder,height:MessagingItemHolder,marginHorizontal:paddingCommon},
	title:{fontSize:15,fontWeight:'bold',color:'#000'},
	caption:{fontSize:14,color:'grey'},
	badgedT:{color:'white',fontSize:14},
	badgedC:{height:'100%',width:20,justifyContent:'center'},
	badged:{height:25,width:25,borderRadius:50,justifyContent:'center',alignItems:'center'},
});