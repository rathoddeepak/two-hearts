import React, { Component } from 'react';
import {
	View,
	Text,
	StyleSheet,	
	ToastAndroid
} from 'react-native';
import s from 'components/theme';
import Pattern from './Pattern';
import LinearGradient from 'react-native-linear-gradient';
import Ripple from 'components/UI/Ripple';
import constants from 'libs/constants';
import InteractUser from 'ydc/InteractUser';
import ViewPager from '@react-native-community/viewpager';
const PATTERN_CONTAINER_HEIGHT = constants.maxHeight2() / 2;
const PATTERN_CONTAINER_HEIGHT2 = constants.maxHeight2()/1.5;
const PATTERN_CONTAINER_WIDTH = constants.width();
const PATTERN_DIMENSION = 3;
const SET = "Please Draw New Pattern";
export default class PictureLockEditor extends Component {
	constructor(props) {
		super(props);
		this.state = {
			pattern:[]
		}
	}
	handlePattern = (pattern) => {
		this.setState({pattern}, () => {
			this.pager.setPage(1);
		})
	}
	notMatchPattern = () => {
		this.setState({pattern:[]}, () => {
			ToastAndroid.show("Please Reset Your Pattern", ToastAndroid.SHORT);
			this.pager.setPage(0);
		})
	}
	handleMatch = () => {
		InteractUser.setCurrentLock(1);
		InteractUser.setLockParams(JSON.stringify({p:this.state.pattern}));
		ToastAndroid.show("Pattern Lock Added Successfully!", ToastAndroid.SHORT);
		this.props.navigation.goBack();
	}
	render() {		
		return (
		<View style={[sty.container, {backgroundColor:s[config.theme_s].color}]}>
		    <ViewPager style={{width:constants.width(),height:PATTERN_CONTAINER_HEIGHT2}} scrollEnabled={false} ref={ref => this.pager = ref}>
		        <View style={sty.viewPager}>
			    <Pattern
	              containerDimension={PATTERN_DIMENSION}
	              containerWidth={PATTERN_CONTAINER_WIDTH}
	              containerHeight={PATTERN_CONTAINER_HEIGHT}	              
	              hint="Please Draw New Pattern"
	              errorMessage="Connect at least 4 dots"
	              onPattern={this.handlePattern}
	              fromEditor
	              lockMode={false}
	            />
	            </View>
	            <Pattern
	              containerDimension={PATTERN_DIMENSION}
	              containerWidth={PATTERN_CONTAINER_WIDTH}
	              containerHeight={PATTERN_CONTAINER_HEIGHT}
	              correctPattern={this.state.pattern}
	              errorMessage=""
	              hint="Please Confirm Your Pattern"
	              errorMessage="Wrong Pattern"
	              onPatternMatch={this.handleMatch}
	              fromEditor
	              onPatternNotMatch={this.notMatchPattern}
	              lockMode
	            />
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
		height:PATTERN_CONTAINER_HEIGHT2,		
		alignItems:'center',
		justifyContent:'center'
	}
})