import React, { Component } from 'react';
import {Text} from 'react-native'
import Ripple from 'components/UI/Ripple';
import * as Animatable from 'react-native-animatable'
import s from 'components/theme';
export default class Retry extends Component {
	render(){
		const {
			entity,
			isInitial
		} = this.props;
		return (
			<Animatable.View animation="zoomIn" style={{height:isInitial ? 350 : 100,width:'100%',justifyContent:'center',alignItems:'center'}}>
			    {isInitial ? <Text style={{fontSize:15,marginBottom:20}}>Unable to load {entity}</Text> : null}
			 	<Ripple onPress={this.props.onRetry} style={{width:70,height:35,backgroundColor:s[config.theme_s].color,borderRadius:5,justifyContent:'center'}}>
			 	 <Text style={{textAlign:'center',color:'#fff',fontSize:15}}>Retry</Text>
			 	</Ripple>
		    </Animatable.View>
		)
	}
}