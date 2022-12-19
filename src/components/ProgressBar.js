import React from 'react';
import {
	View	
} from 'react-native';
import Animated from 'react-native-reanimated';
export default class ProgressBar extends React.Component {
	render(){		
		const {
			color,
			width,
			height,
			progress
		} = this.props;
		const translateX = Animated.interpolate(progress, {
			inputRange:[0, 100],
			outputRange:[-width, 0],
			useNativeDriver:true
		})
		return (
			<View style={{borderRadius:10,backgroundColor:'#9e9e9e',height,overflow:'hidden'}}>
			 <Animated.View style={{borderRadius:10,backgroundColor:color,height,width:width,transform:[{translateX:translateX}]}}></Animated.View>
			</View>
		)
	}
}