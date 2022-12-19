import React, {Component} from 'react';
import {
  Animated,

  View,
  PanResponder,
  TouchableOpacity,
  StyleSheet,
  Image,
  ToastAndroid,
  DeviceEventEmitter,
  Text,
} from 'react-native';
import GestureDetector from 'res/GestureDetector';
import LottieView from 'lottie-react-native';
import {AndroidUtilities,Dimensions} from 'ydc';
import {	s	} from 'components';
import AndroidCircularReveal from 'ydc/AndroidCircularReveal'

export default class Welcome extends Component {
  constructor(props){
    super(props)
    this.state = {
      native:true 
    }
  }
  componentDidMount(){
    setTimeout(() => {
       this.animatedContainer.reveal(AndroidUtilities.wp("100%"));     
    }, 100);
    setTimeout(() => {
        this.twohearts.play();   
    }, 1200)
    setTimeout(() => {
        this.props.navigation.navigate("HomeActivity")
    }, 2000)
  }
  render() {
    return (
      
        <AndroidCircularReveal style={{        
        width: AndroidUtilities.wp("100%"),
        height:AndroidUtilities.hp("100%"),        
        backgroundColor:s[config.theme_s].color,
        }} ref={ref => this.animatedContainer = ref} animationDuration={1500}>
        <View style={{
        	height:AndroidUtilities.hp("100%"),
        	width:AndroidUtilities.wp("100%"),
        	backgroundColor:'white',
        	justifyContent:'center'
        }}>
         <LottieView ref={ref => this.twohearts = ref} resizeMode="contain" style={{height:AndroidUtilities.hp("100%")/2,width:AndroidUtilities.wp("100%")}}  source={require('../res/anim/twohearts.json')} loop={false} />
         </View>
        </AndroidCircularReveal>
       
     )
  }

}