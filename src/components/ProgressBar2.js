import React from 'react';
import PropTypes from 'prop-types';
import {
	View,
	Animated
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
const AniView = Animated.createAnimatedComponent(LinearGradient);
export default class ProgressBar2 extends React.Component {
	constructor(props) {
		super(props);
		this.translateX = new Animated.Value(-this.props.width)
	}
	set = (x) => {		
		Animated.timing(this.translateX, {
			toValue:x,	
			duration:250,
			useNativeDriver:false
		}).start();
	}	
	render(){		
		const {
			colors,
			width,
			height,			
			style
		} = this.props;
		const translateX = this.translateX.interpolate({
			inputRange:[0, 100],
			outputRange:[-width, 0],
			useNativeDriver:true
		})		
		return (
			<View style={{borderRadius:10,backgroundColor:'#D6D6D6',height,overflow:'hidden', ...style}}>
			 <AniView start={{x:0,y:0}} end={{x:1,y:0}} colors={colors} style={{borderRadius:10,height,width:width,transform:[{translateX:translateX}]}} />
			</View>
		)
	}
}

ProgressBar2.propTypes = {
	colors:PropTypes.any,
	width:PropTypes.any,
	height:PropTypes.any,
	style:PropTypes.any
}

ProgressBar2.defaultProps = {
	colors:["#B34796", "#649FE4"],
	width:100,
	height:4,
	style:{}
}