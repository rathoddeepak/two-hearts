import React, { Component } from 'react';
import PropTypes from 'prop-types';
import LottieView from 'lottie-react-native';
import * as Animatable from 'react-native-animatable'
const anim = require('../res/anim/loading.json');
export default class Loading extends Component {
	render(){
		return (
			<Animatable.View animation="slideInDown" style={{height:350,width:200,alignSelf: 'center', alignItems:'center',justifyContent:'center'}}>
			 	<LottieView	
			     loop	
			     autoPlay
			     resizeMode="cover"				     
			     style={{height:200,}}				     
			     source={anim}		     
			    />
		    </Animatable.View>
		)
	}
}