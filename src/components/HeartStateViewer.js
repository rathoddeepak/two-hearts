import React, { Component } from 'react';
import {
	View,
	Image
} from 'react-native';
const MALELIKED = 1, FEMALELIKED = 2, NONLIKED = 3, BOTHLIKED = 4, image = "res/images/", color = "#f44336";
export default class HeartStateViewer extends Component {
	render() {
		const {
			heartState,			
			csize,
			size			
		} = this.props;				
		switch (heartState){
			case MALELIKED:								
				return (
					<View style={{width:csize,height:csize,justifyContent:"center",alignItems:"center"}}>
					 <Image style={{width:size,height:size}} source={require(image+"heart_half.png")} tintColor={color} />
					</View>
				)
				break;
			case FEMALELIKED:
				return (
					<View style={{width:csize,height:csize,justifyContent:"center",alignItems:"center"}}>
					 <Image style={{width:size,height:size, transform:[
					 	 {scaleX: -1}
					 	]}} source={require(image+"heart_half.png")} tintColor={color} />
					</View>
				);
				break;
			case BOTHLIKED:
				return (
					<View style={{width:csize,height:csize,justifyContent:"center",alignItems:"center"}}>
					 <Image style={{width:size,height:size}} source={require(image+"heart.png")} tintColor={color} />
					</View>
				);
				break;						
		}
	}
}