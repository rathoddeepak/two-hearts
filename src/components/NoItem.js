import React, { Component } from 'react';
import {Text} from 'react-native'
import LottieView from 'lottie-react-native';
import * as Animatable from 'react-native-animatable'
const anim = require('../res/anim/empty.json');
export default class NoItem extends Component {
	render(){
		const {
			entity,
			isInitial,
			end	
		} = this.props;		
		return (
			<Animatable.View animation="zoomIn" style={{height:isInitial ? 500 : 50,width:'100%',justifyContent:'center',alignItems:'center'}}>
			    {isInitial ?
			    	<LottieView	
				     loop	
				     autoPlay
				     resizeMode="contain"
				     style={{height:270,width:'100%'}}				     
				     source={anim}		     
				    />
			    : null}
			    <Text>{isInitial ? `${entity} not found!` : end != undefined ? end : 'You have reached to end!'}</Text>			    
		    </Animatable.View>
		)
	}
}