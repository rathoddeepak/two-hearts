import React, { Component } from 'react';
import {
	View,
	Text,
	StyleSheet,
	Modal
} from 'react-native';
import {
	Ripple,
	Icon,
	Switch,
	s
} from 'components';
import InteractUser from 'ydc/InteractUser';
import constants from 'libs/constants';
import AndroidUtilities from 'ydc/AndroidUtilities';
const btnHeight = AndroidUtilities.hp('4.5%');
const btnWidth = AndroidUtilities.wp('27.22%')
function decode(type){
	switch(type){
		case 0:
		return {
			title:'Picture Lock',
			note:'Use your gallery image as password, tap three time on different locations and remember.\nTip : Use screenshot of other apps',
			icon:'piclock'
		}
		case 1:
		return {
			title:'Pattern Lock',
			note:'Use your gallery image as password, tap three time on different locations and remember.\nTip : Use screenshot of other apps',
			icon:'pattern'
		}
		case 2:
		return {
			title:'Pin Lock',
			note:'Use your gallery image as password, tap three time on different locations and remember.\nTip : Use screenshot of other apps',
			icon:'pin'
		}
		case -1:
		return {
			title:'',
			note:'',
			icon:''
		}
	}
}
export default class LockOperator extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isEnabled:false,
			type:-1,
			modal:false
		}
	}		
	handleChange = (set) => {
		if(set){
			this.navigatType();
		}else{
			InteractUser.setCurrentLock(-1);
			InteractUser.setLockParams("");
			ToastAndroid.show("All Lock Removed", ToastAndroid.SHORT)
		}	
	}

	navigatType = () => {
		this.setState({modal:false});
		switch (this.state.type){
			case 0:
			this.props.navigation.navigate("PictureLockEditor")
			break;
			case 1:
			this.props.navigation.navigate("PatternLockEditor")
			break;
			case 2:
			this.props.navigation.navigate("PinLockEditor")
			break;
		}
	}

	close = () => {
		this.setState({modal:false});		
	}

	show = (type) => {
		this.setState({type}, () => {
			InteractUser.getCurrentLock(lock => {
				this.setState({isEnabled:lock == this.state.type}, () => {
					this.setState({modal:true})
				})
			})		
		})
	}
	render(){		
		const {
			title,
			note,
			icon
		} = decode(this.state.type);	
		const {isEnabled,modal} = this.state;	
		return (
			<Modal visible={modal} animationType="slide" onRequestClose={this.close}>
			<View style={sty.container}>
			 <Icon name="piclock" size={60} color="#B5BECF" />
			 <Text style={sty.title}>{title}</Text>
			 <Text style={sty.note}>{note}</Text>
			 <View style={sty.disable}>
			  <Text style={sty.note2}>{isEnabled ? 'Enabled' : 'Disabled'}</Text>
			  <Switch value={isEnabled} onSyncPress={this.handleChange}/>
			 </View>
			 {isEnabled ?
			 	<Ripple rippleContainerBorderRadius={10} onPress={this.navigatType} style={sty.btn}>
				  <Text style={{
				  	fontSize:14,
				  	fontWeight:'bold',
				  	color:'white',		  	
				  }}>Change</Text>
				</Ripple>
			 : null}
			</View>
			</Modal>
		)
	}
}

const sty = StyleSheet.create({
	container: {
		width:constants.width(),
		height:constants.maxHeight2(),
		justifyContent: 'center',
		alignItems: 'center'
	},
	title:{
		fontSize:17,
		fontWeight:'bold',
		color:'black',
		marginVertical:15
	},
	note:{
		fontSize:14,		
		color:'black',
		marginVertical:9,
		textAlign:'center',
		width:'80%'
	},
	disable:{
		flexDirection:'row',
		justifyContent:'center',
		alignItems:'center',
		width:'70%',		
	},
	note2:{
		fontSize:14,		
		color:'black',
		marginRight:9,
		textAlign:'center',		
	},
	btn:{
		width:btnWidth,height:btnHeight,borderRadius:10,alignItems:'center',justifyContent:'center',marginTop:8,backgroundColor:'#B5BECF'
	}
})