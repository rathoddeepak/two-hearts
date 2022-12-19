import React from 'react';
import {
	Modal,
	View,
	Animated,
	Easing,
	TouchableWithoutFeedback
} from 'react-native';
import LottieView from 'lottie-react-native';
import {
	AndroidUtilities,	
} from 'ydc';
import request from 'ydc/request';
export default class LoadingModel extends React.Component {
	constructor(props){
		super(props)
		this.state = {
			showing:false,			
			animation:new Animated.Value(0.6)
		}
	}
	show = () => {
		this.setState({
			showing:true			
		}, () => {
			Animated.timing(this.state.animation, {
				toValue:1,
				useNativeDriver:true
			}).start()
		})
	}
	hide = () => {
		this.setState({showing:false}, () => {
			this.state.animation.setValue(0.6)
		});
	}
	requestClose = () => {
	    if(this.props.cancelable){
	    	this.hide();
	    }		
	}
	render(){
		const {
			showing
		} = this.state;		
		return (
			<Modal visible={showing} onRequestClose={this.requestClose} animationType="fade" transparent>			 
			<TouchableWithoutFeedback onPress={this.requestClose}>
			 <Animated.View style={{
			 	height:AndroidUtilities.hp('100%'),
			 	width:AndroidUtilities.wp('100%'),
			 	justifyContent:'center',
			 	alignItems:'center',
			 	backgroundColor:'#00000021'
			 }}>
			  <Animated.View style={{
			  	height:AndroidUtilities.hp('10%'),
			  	width:AndroidUtilities.hp('10%'),
			  	justifyContent:'center',
			  	alignItems:'center',
			  	backgroundColor:'#ffffffb4',			  	
			  	borderRadius:10,
			  	transform:[{scale:this.state.animation}]
			  }}>			   
			    <View style={{width:'95%',height:'95%'}}>
				    <LottieView	
				     loop	
				     autoPlay
				     resizeMode="cover"				     
				     style={{height:120,width:120,transform:[{translateX:-20},{translateY:-10}]}}				     
				     source={require('../res/anim/loading.json')}		     
				    />
			    </View>
			  </Animated.View>
			 </Animated.View>
			 </TouchableWithoutFeedback>
			</Modal>
		)
	}
}