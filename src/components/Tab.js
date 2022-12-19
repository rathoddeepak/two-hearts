import * as React from "react"
import { View, TouchableOpacity, Text } from "react-native"
import {
  Icon,
  s
} from 'components';
import {
  AndroidUtilities
} from 'ydc'
import Animated2 from 'react-native-reanimated';
import TypingAnimation from 'components/indicator';
const Tab = ({title, onPress, currentIndex, params }) => {
  let typing = false;
  let count = 0;
  if(title == 'Chat'){
    typing = params?.typing;    
  }
  if(params != undefined){
    count = params?.count;
  }
  return (      
      <View
        style={{
          height:'100%',
          width:'20%',
          justifyContent:'center',
          alignItems:'center'
        }}
      >
      <Icon name={title} color={currentIndex ? s[config.theme_s].color : "#c9c9c9"} size={25} />
      {typing ?
        <View style={{backgroundColor:s[config.theme_s].color,elevation:2,borderRadius:40,width:20,height:20,position:'absolute',right:10}}>
          <TypingAnimation
            dotColor="#fff"        
            dotAmplitude={3}
            dotSpeed={0.1}          
            dotRadius={1.5}
            dotX={9}
            dotY={7}
          />
        </View>
      : null}

      {!typing && count > 0 ?
        <View style={{backgroundColor:'#db4343',elevation:2,borderRadius:40,width:20,height:20,position:'absolute',right:10,justifyContent:'center',alignItems:'center'}}>
          <Text style={{fontSize:10,fontWeight:'bold',color:'white'}}>{count}</Text>
        </View>
      : null}
      </View>

  )
}

export default Tab