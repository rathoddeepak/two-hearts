import React, { Component } from 'react';
import {
	View,
	Text,
	Animated,
	StyleSheet,	
	Modal,
	TouchableWithoutFeedback,
	TouchableOpacity
} from 'react-native';
import Ripple from './UI/Ripple';
import Icon from './UI/Icon';
import s from './theme'
import {
	AndroidUtilities,	
} from 'ydc';
import constants from 'libs/constants';
import AndroidCircularReveal from 'ydc/AndroidCircularReveal';
import * as Animatable from 'react-native-animatable';

const FPointY = AndroidUtilities.hps("83%");
const FPointX = AndroidUtilities.wp("3%");
const FabSize = AndroidUtilities.fv(50);

const FPointX2 = AndroidUtilities.wp("81%");
const FPointY2 = AndroidUtilities.hps("88.8%");

const FabAniX = AndroidUtilities.wp("100%")/2.4;
const FabAniY = AndroidUtilities.hps("89%") - (AndroidUtilities.hps("35%")/3);

export default class Fab extends Component {
	constructor(props){
		super(props)
		this.state={
			modelVisible:false,
			aniFabX:new Animated.Value(FPointX2),
			aniFabY:new Animated.Value(FPointY2),
			aniFacO:new Animated.Value(1),
			fabVisible:true
		}
	}
	handleFabOpen = () => {
		this.aniFabMain.fadeOut();
		this.setState({modelVisible:true},
			() => {
				Animated.parallel([
					Animated.timing(this.state.aniFacO, {
						toValue:0,
						useNativeDriver:true,
						duration:1700
					}),
					Animated.spring(this.state.aniFabX, {
						toValue:FabAniX,
						useNativeDriver:true,
						friction:100
					}),								
					Animated.spring(this.state.aniFabY, {
						toValue:FabAniY,
						useNativeDriver:true,
						friction:100
					})
				]).start();
				setTimeout(() => {
					this.revelar.reveal(500);
				}, 400);
			}
		);
	}
	handleFabClose(fast = false){	
		this.revelar.hide(500);
		if(!fast){
			Animated.parallel([
				Animated.timing(this.state.aniFacO, {
					toValue:1,
					useNativeDriver:true,
					duration:100
				}),
				Animated.spring(this.state.aniFabX, {
					toValue:FPointX2,
					useNativeDriver:true,
					
				}),
				Animated.spring(this.state.aniFabY, {
					toValue:FPointY2,
					useNativeDriver:true,
					
				})
			]).start(() => {
				this.setState({modelVisible:false})
			});	
			setTimeout(() => {
				this.aniFabMain.fadeIn();
			}, 350)
		}else{
			setTimeout(() => {
				this.setState({modelVisible:false})
				this.aniFabMain.fadeIn();
			}, 200)
		}
					
	}
	render(){
		const {
			modelVisible,
			fabVisible
		} = this.state;
		return (
			<View style={sty.fabContainer}>			 			  
			  <Animatable.View duration={90} ref={ref => this.aniFabMain = ref} style={{
			  	height:FabSize,
			  	width:FabSize,
			  	backgroundColor:s[config.theme_s].color,			  	
			  	borderRadius:FabSize*2
			  }}>
			  <TouchableOpacity activeOpacity={0.8} onPress={this.handleFabOpen} rippleContainerBorderRadius={FabSize*2} style={{flex:1,justifyContent:'center',alignItems:'center'}}>
			   <Icon name="add" size={AndroidUtilities.fv(20)} color="white" />
			  </TouchableOpacity>
			  </Animatable.View>

			  <Modal visible={modelVisible} onRequestClose={() => this.handleFabClose(false)} transparent>
			   <TouchableWithoutFeedback  onPress={() => this.handleFabClose(false)}>
				   <View style={{flex:1}}>					    
					    <AndroidCircularReveal duration={5000} ref={ref => this.revelar = ref} style={{position:'absolute',bottom:0,backgroundColor:'transparent'}}>
						    <View style={{flex:1,elevation:24,backgroundColor:s[config.theme_s].color,height:AndroidUtilities.hps("35%"),width:constants.width(),flexDirection:'row'}}>
							     <TouchableOpacity onPress={() => {
							     	this.handleFabClose(true);
							     	this.props.onPhotosPress();
							     }} activeOpacity={0.7} style={{flex:1,justifyContent:'center',alignItems:'center'}}>
							       <Animatable.View animation="pulse" easing="ease-out" iterationCount="infinite" style={{height:AndroidUtilities.fv(40),width:AndroidUtilities.fv(40)}}>
							        <Icon name="album" size={AndroidUtilities.fv(40)} color="white" />
							       </Animatable.View>
							       <Text style={{paddingTop:10,fontSize:AndroidUtilities.fv(15),color:'white',fontWeight:'bold'}}>Photos</Text>
							     </TouchableOpacity>
							     <TouchableOpacity onPress={() => {
							     	this.handleFabClose(true);
							     	this.props.onSpecailDayPress();
							     }} activeOpacity={0.7} style={{flex:1,justifyContent:'center',alignItems:'center'}}>
							       <Animatable.View animation="pulse" easing="ease-out" iterationCount="infinite" style={{height:AndroidUtilities.fv(40),width:AndroidUtilities.fv(40)}}>
								       <Icon name="gift" size={AndroidUtilities.fv(40)} color="white" />
							       </Animatable.View>
							       <Text style={{paddingTop:10,fontSize:AndroidUtilities.fv(15),color:'white',fontWeight:'bold'}}>Special Days</Text>
							     </TouchableOpacity>
						    </View>				    
					    </AndroidCircularReveal>
					    <Animated.View pointerEvents="none" style={{
							  	height:FabSize,
							  	width:FabSize,
							  	opacity:this.state.aniFacO,
							  	backgroundColor:s[config.theme_s].color,							  	
								transform:[
									{translateX:this.state.aniFabX},
									{translateY:this.state.aniFabY},
								],							  	
							  	borderRadius:FabSize*2,
							  	justifyContent:'center',alignItems:'center'
							  }}>							  
							   <Icon name="add" size={AndroidUtilities.fv(20)} color="white" />							  
						</Animated.View>
				   </View>
			   </TouchableWithoutFeedback>
			  </Modal>
			</View>
		)
	}
}

const sty = StyleSheet.create({
	fabContainer:{		
		position:"absolute",
		top:FPointY,
		right:FPointX	
	}
})