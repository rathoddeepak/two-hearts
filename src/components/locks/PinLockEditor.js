import React, { Component } from 'react';
import {
	View,
	Text,
	StyleSheet,	
	ToastAndroid
} from 'react-native';
import s from 'components/theme';
import PinLock from './PinLock';
import LinearGradient from 'react-native-linear-gradient';
import constants from 'libs/constants';
import InteractUser from 'ydc/InteractUser';
import ViewPager from '@react-native-community/viewpager';

export default class PictureLockEditor extends Component {
	constructor(props) {
		super(props);
		this.state = {
			pin:''			
		}
	}
	handleSave = (pin) => {
		this.setState({pin}, () => {
			this.pager.setPage(1);
		})
	}
	handleDone = (match) => {
		if(match){
			InteractUser.setCurrentLock(2);
			InteractUser.setLockParams(JSON.stringify({p:this.state.pin}));
			ToastAndroid.show("PIN Lock Added Successfully!", ToastAndroid.SHORT);
			this.props.navigation.goBack();
		}else{
			this.setState({pin:''}, () => {
				ToastAndroid.show("Wrong PIN", ToastAndroid.SHORT);
				this.pager.setPage(0);
			})
		}		
	}	
	render() {
		const {
			picture,
			taskName,
			record,
			taskTwo,
			disable
		} = this.state;		
		return (
		<View style={[sty.container, {backgroundColor:s[config.theme_s].color}]}>
		    <ViewPager style={{width:constants.width(),height:constants.maxHeight2()}} scrollEnabled={false} ref={ref => this.pager = ref}>
		        <View style={sty.viewPager}>
				    <PinLock
		              lockMode={false}
					  text="Please Enter Your New PIN"				  
					  onPinEntered={this.handleSave}					  
		            />
	            </View>
	            <View style={sty.viewPager}>
		            <PinLock
		             lockMode={true}
					 text="Please Confirm Your PIN"
					 toCompare={this.state.pin}
					 onCompare={this.handleDone}					 
		            />
	            </View>
            </ViewPager>
		</View>
		)
	}
}

const sty = StyleSheet.create({	
	container: {		
		alignItems:'center',
		justifyContent:'center',
		height:constants.maxHeight2(),
		width:constants.width()		
	},
	viewPager:{
		width:constants.width(),
		height:constants.maxHeight2(),		
		alignItems:'center',
		justifyContent:'center',
	}
})