import React, {PureComponent} from "react";
import PropTypes from 'prop-types';
import { View, ViewPropTypes, StyleSheet, Image, Animated, Text} from 'react-native';
import Icon from 'components/UI/Icon';
import AndroidUtilities from 'ydc/AndroidUtilities';
import Swipeable from "react-native-gesture-handler/Swipeable";
import { RectButton } from "react-native-gesture-handler";
import constants from 'libs/constants';

const fontSize = AndroidUtilities.fv(13);
const small = AndroidUtilities.fv(8);
export default class MessageImageContent extends PureComponent {
  rendeRightActions = (progress, dragX) => {
    const trans = dragX.interpolate({
      inputRange: [0, 50],
      outputRange: [0, 0.3],
      
    });
    return (
      <RectButton  style={{justifyContent: 'center',alignItems:'center'}}>
        <Animated.View style={{padding:10,borderRadius:100,backgroundColor:'#000000b4',transform:[{scale:trans},{rotate:'180deg'}]}}>
          <Icon name="Notification" color="white" size={30} />
        </Animated.View>
      </RectButton>
    );
  };
  handleReplyAction = (index) => {
    this.dipatchMessage("hii guys");
    AndroidUtilities.vibrate(150);
  }
  render() {
   const {
    message
   } = this.props;
   if(message.owner != 0){//You
      return (
        <View style={{width:constants.width(),transform:[{scaleY:-1}]}}>
        <Swipeable overshootFriction={100} directRelease friction={3} renderRightActions={this.rendeRightActions} onSwipeableOpen={() => this.handleReplyAction()}>
         <View style={[{alignSelf:'flex-end',backgroundColor:'#f2f2f2'}, sty.chatItem]}>
         <Text style={{fontSize,color:'black',alignSelf:'flex-end',maxWidth:'80%'}}>{message.text} </Text>         
         {/*<Text style={{fontSize:small,color:'grey',alignSelf:'flex-end'}}>{time}</Text>*/}
        </View></Swipeable></View>
      )
    }else{//Partner
      return (
        <View style={{width:constants.width(),transform:[{scaleY:-1}]}}>
        <Swipeable overshootFriction={100} directRelease friction={3} renderRightActions={this.rendeRightActions} onSwipeableOpen={() => this.handleReplyAction()}>
         <View style={[{alignSelf:'flex-start',backgroundColor:'#fff'}, sty.chatItem]}>
         <Text style={{fontSize,color:'black',maxWidth:'80%'}}>{message.text} </Text>
         {/*<Text style={{fontSize:small,color:'grey',alignSelf:'flex-end'}}>{time}</Text>*/}
        </View></Swipeable></View>
      )
    }    
  }
}  


const sty = StyleSheet.create({
  chatItem: {
    margin:5,
    padding:10,    
    borderRadius:15,    
    maxWidth:'80%',
    flexDirection:'row',
    elevation:0.5
  }
})
