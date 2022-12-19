import * as React from "react"
import { View, Text, Image } from "react-native"
import Tab from './Tab'
import Animated from 'react-native-reanimated';
import H1 from './H1';
import s from './theme';
import {
  AndroidUtilities,
  Dimensions
} from 'ydc';
const girl = 'data:image/jpeg;base64,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';
const ComboHeight = AndroidUtilities.hps("12%");
const TNH = AndroidUtilities.hps("5.804%");
const HPH = AndroidUtilities.hps("5.796%");
const width = AndroidUtilities.wp("100%");
const tt = (TNH+1.4);
function decodeState(state){
  switch(state){
    case 0:
    return '';
    case 1:
    return 'Your Space';
    case 2:    
    return 'Chat';
    case 3:    
    return 'Notifications';
    case 4:    
    return 'Menu';
  }
}
const TabBar = (props) => {  
  const { navigationState, navigation, position } = props;    
  const focusAnim = Animated.interpolate(position, {
    inputRange: [0, 5],
    outputRange: [0, width],
    extrapolate:'clamp'
  }); 
    
  const opacity = Animated.interpolate(position, {
    inputRange: [0, 1, 2, 3, 4, 5],
    outputRange: [1,0,0,0,0,0],
    extrapolate:'clamp'
  });
  const translateY = Animated.interpolate(position, {
    inputRange: [0, 1, 2, 3, 4, 5],
    outputRange: [0, -tt, -tt, -tt, -tt, -tt],
    extrapolate:'clamp'
  });  
  return (
    <View style={{backgroundColor:'white'}}>
    <Animated.View style={{backgroundColor:'white',elevation:5,transform:[{translateY}]}}>    
    <View style={{
      height:Dimensions.get('STATUS_BAR_HEIGHT'),
      width:width,
      backgroundColor: '#f6f6f6'      
    }} />
  
    <View style={{
      height:ComboHeight,
      width:width,
      backgroundColor: '#f6f6f6'      
    }}>    
      
      <Animated.View style={{
        flexDirection:'row',
        height:HPH,
        opacity
      }}>
      
      <View style={{
        width:AndroidUtilities.wp("73.763%"),
        height:'100%'
      }}>
        <Text style={{
          color:s[config.theme_s].color,
          fontWeight:'bold',          
          paddingLeft:AndroidUtilities.wp("3.5%"),
          fontSize:AndroidUtilities.fv(20)
        }}>{config.appName}</Text>
      </View>

      <View style={{
        width:AndroidUtilities.wp("26.237%"),
        height:'100%',
        justifyContent:'center',
        flexDirection:'row',
        paddingRight:AndroidUtilities.wp("4%")
      }}>
        <Image 
         source={{
          uri:config.siteUrl+user['avatar']
         }}
         style={{width:AndroidUtilities.fv(31),height:AndroidUtilities.fv(31),borderRadius:100,backgroundColor: '#cccccc'}}
        />
        <Text style={{          
          paddingTop:AndroidUtilities.fv(8),
          paddingLeft:AndroidUtilities.wp("1.38%"),
          paddingRight:AndroidUtilities.wp("1.38%"),
          height:'100%',
          fontSize:AndroidUtilities.fv(8)
        }}>❤</Text>
        <Image 
         source={{
          uri:config.siteUrl+partner['avatar']
         }}
         style={{width:AndroidUtilities.fv(31),height:AndroidUtilities.fv(31),borderRadius:100,backgroundColor: '#cccccc'}}
        />
      </View>

      </Animated.View>

      <View style={{
        flexDirection:'row',
        height:TNH,        
      }}>
      {navigationState.routes.map((route, index) => {      
        return (
          <Tab
            key={route.key}          
            title={route.name}
            params={route.params}      
            currentIndex={navigationState.index == index ? true : false}
            onPress={() => navigation.navigate(route.name)}
          />
        )
      })}
      </View>
      <Animated.View style={{height:AndroidUtilities.hps("0.4%"),width:width/5,transform:[{translateX:focusAnim}]}}><View style={{width:'70%',height:'100%',alignSelf:'center',borderTopLeftRadius:20,borderTopRightRadius:20,backgroundColor:s[config.theme_s].color}}></View></Animated.View>
    </View>
    </Animated.View>
    <H1 text={decodeState(navigationState.index)} style={{position:'absolute',bottom:0}} />
    </View>
  )
}

export default TabBar