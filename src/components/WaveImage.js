import React from 'react';
import {
	View,
	Image,	
} from 'react-native';
import WaveView from './WaveView';
import Animated from 'react-native-reanimated';
export default class WaveImage extends React.Component {
	render(){
		const {
			style,
			source,
			progress,
			height
		} = this.props;
		const aniProgress = Animated.interpolate(progress, {
			inputRange:[0, 10],
			outputRange:[0, -height]					
		})
		return (
			<View style={[style, {overflow:'hidden'}]}>			 
			 <Image
			  source={{
			  	uri:source
			  }}
			  style={{flex:1}}
			 />
			 <Animated.View style={{overflow:'hidden',position:'absolute',width:'100%',height:'100%',transform:[{translateY:aniProgress}]}}>
				 <WaveView style={[{flex:1,overflow:'hidden'}, {transform:[
				 	{rotate:'180deg'}
				    ]}]} waveParams={[
				            {A: 10, T: 180, fill: '#000000b4'}				            
				        ]} H={height} animated={true} />
			 </Animated.View>
			</View>
		)
	}
}