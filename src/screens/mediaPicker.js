import * as React from 'react';
import { View, StyleSheet, Dimensions, Text, TouchableOpacity } from 'react-native';
import { TabView, SceneMap, ScrollPager } from 'react-native-tab-view';
import ViewPager from '@react-native-community/viewpager'
import Animated from 'react-native-reanimated';
import {
  Icon,
  Ripple
} from 'components'
const {
  width,
  height
} = Dimensions.get('window');
import {interpolate, Extrapolate} from 'react-native-reanimated';

const initialLayout = { width: Dimensions.get('window').width };

export default class MediaPicker extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      routes: [
       {key:1, title:'Gallery',icon:'gallery',bgRgb:[221,230,240],bgColor:'#DDE6F5',color:'#2E65C2'},
       {key:2, title:'Songs',icon:'song',bgRgb:[239,233,250],bgColor:'#EFDFFA',color:'#9E37DD'},
       {key:3, title:'Poll',icon:'poll',bgRgb:[253,226,219],bgColor:'#FDE2DB',color:'#EF4D20'}
     ],
     index:0
    }
  }
  setIndex = (index) => {
    this.setState({index})
  }
  _renderScene = ({ route }) => {
    switch (route.key) {
      case 1:
      return <View style={{flex:1, backgroundColor:route.bgColor}}></View>;
      break;
      case 2:
       return <View style={{flex:1, backgroundColor:route.bgColor}}></View>;
      break;
      case 3:
       return <View style={{flex:1, backgroundColor:route.bgColor}}></View>;
      break;      
      default:
      return null;
    }
  }

 _renderTabBar = props => {
    const inputRange = props.navigationState.routes.map((x, i) => i);

    return (
      <View style={{height:55,width:"100%",elevation:10,flexDirection:'row',backgroundColor:"white"}}>   
        {props.navigationState.routes.map((route, i) => {
          const color = Animated.color(
            route.bgRgb[0],
            route.bgRgb[1],
            route.bgRgb[2],
            
              Animated.interpolate(props.position, {
                inputRange,
                outputRange: inputRange.map(inputIndex =>
                  inputIndex === i ? 1 : 0
                ),
              })
            
          );

          const scale = Animated.interpolate(props.position, {
            inputRange,
            outputRange: inputRange.map(inputIndex =>
              inputIndex === i ? 1 : 0
            ),
          })

         const translateX = Animated.interpolate(props.position, {
            inputRange,
            outputRange: inputRange.map(inputIndex =>
              inputIndex === i ? 1 : 50
            ),
          })

          return (
            <Ripple key={route.key} rippleContainerBorderRadius={100} onPress={() => this.setState({
              index:i
            })}><View style={{
                  width:width/3,
                  height:"100%",
                  justifyContent:"center",
                  alignItems:"center"
                }}>
                <Animated.View style={{padding:8,backgroundColor:color,borderRadius:30,flexDirection:'row'}}>
                <Animated.View style={{transform:[{translateX}]}}><Icon 
                 name={route.icon}          
                 color={route.color}
                 size={24}
                /></Animated.View>
                <Animated.View  style={{transform:[{scale}]}}><Text style={{            
                  color:route.color,
                  fontSize:14,
                  paddingLeft:5,
                  paddingRight:5,
                  fontWeight:'bold',
                  overflow:'hidden'
                }}>{route.title}</Text></Animated.View>
                </Animated.View>
              </View></Ripple>
          );
        })}
      </View>
    );
  };
  _renderPager = props => <ScrollPager {...props} />;
  render(){
    return (
      <TabView
        navigationState={this.state}
        renderScene={this._renderScene}
        //renderPager={this._renderPager} 
        onIndexChange={this.setIndex}
        renderTabBar={this._renderTabBar}
        tabBarPosition={"bottom"}
        
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    paddingTop: 24,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
  },
});
