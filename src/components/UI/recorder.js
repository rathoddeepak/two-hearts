import React, {Component} from 'react';
import {
  Animated,
  Dimensions,
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
import {AndroidUtilities, AndroidCircularReveal} from 'ydc';
import {Icon} from 'components';
import {StopWatch} from 'components/Util'
import * as Animatable from 'react-native-animatable';
const leftRight = {
  from: {
    translateX: 130,
  },
  to: {
    translateX: 140,
  },
};
const circleRadius = 40;
const {
  width
} = Dimensions.get('window');
function isValidSwipe(
  velocity,
  velocityThreshold,
  directionalOffset,
  directionalOffsetThreshold
) {
  return (
    Math.abs(velocity) > velocityThreshold &&
    Math.abs(directionalOffset) < directionalOffsetThreshold
  );
}
const swipeDirections = {
  SWIPE_UP: "up",
  SWIPE_DOWN: "down",
  SWIPE_LEFT: "left",
  SWIPE_RIGHT: "right"
};
const TAG = 'TW:'
export default class Recorder extends Component {
  constructor(props){
    super(props)
    this.state = {
      isRecording:true,
      isLocked:false,
      currentTime:0,      
      swipeOnlyIn:'none',      
      posX:new Animated.Value(width-75),
      posY:new Animated.Value(0),
      amplitude:new Animated.Value(0),
      lockMovement:new Animated.Value(0),
      commonMovement:new Animated.Value(0)      
    },
    this.swipeConfig  = {
      velocityThreshold:0.3,
      directionalOffsetThreshold:80
    },
    this.lockedRecording = false;
    this.shouldRecieve = false;    
    this._panResponder = PanResponder.create({
          // Ask to be the responder:
          onStartShouldSetPanResponder: (evt, gestureState) => true,
          onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
          onMoveShouldSetResponderCapture: () => true,
          onMoveShouldSetPanResponder: (evt, gestureState) => true,
          onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
          onPanResponderGrant: (evt, gestureState) => {
            this.onLongPressTimeout = setTimeout(() => {
              if(!this.lockedRecording){
                this.handleStartRecording();
              }              
              clearTimeout(this.onLongPressTimeout);
            }, 300);
          },
          onPanResponderMove: (evt, gestureState) => {
            clearTimeout(this.onLongPressTimeout);
            if(!this.shouldRecieve){
              return true;
            }
            if(this.state.swipeOnlyIn == 'none'){
              const direction = this._getSwipeDirection(gestureState);              
              if(direction == "left" || direction == 'up'){
                this.setState({swipeOnlyIn:direction})
                console.log(TAG+" Swiping In "+direction)
              }
            }else{
              if(this.state.swipeOnlyIn == 'left'){                
                this.state.posX.setValue(gestureState.moveX);
                if(gestureState.moveX < 140){
                 this.stopTerminateRecording(true);
                }else if(gestureState.moveX >= width-75){
                  this.setState({
                    swipeOnlyIn:'none'
                  })
                }
              }else{                              
                this.state.lockMovement.setValue(gestureState.dy);
                if(gestureState.dy < -80){                         
                 this.shouldRecieve = false;
                 this.lockedRecording = true;
                 this.stopTerminateRecording(false)
                }else if(gestureState.dy >= 0){
                  console.log(gestureState.dy) 
                  this.setState({
                    swipeOnlyIn:'none'
                  })
                }
              }
            }            
          },
          onPanResponderTerminationRequest: (evt, gestureState) => true,
          onPanResponderRelease: (evt, gestureState) => {
            this.stopTerminateRecording(false)
          },
          onPanResponderTerminate: (evt, gestureState) => {
            this.stopTerminateRecording(true);
          },
          onShouldBlockNativeResponder: (evt, gestureState) => {
            // Returns whether this component should block native components from becoming the JS
            // responder. Returns true by default. Is currently only supported on android.
            return false;
          },
        });
  }

  componentDidMount(){
    setTimeout(() => {
        this.animatedContainer.reveal(40);     
    }, 100);    
  }
  rollOut = () => {
    this.animatedContainer.hide(80);
  }
  _getSwipeDirection(gestureState) {
    const { SWIPE_LEFT, SWIPE_RIGHT, SWIPE_UP, SWIPE_DOWN } = swipeDirections;
    const { dx, dy } = gestureState;
    if (this._isValidHorizontalSwipe(gestureState)) {
      return dx > 0 ? SWIPE_RIGHT : SWIPE_LEFT;
    } else if (this._isValidVerticalSwipe(gestureState)) {
      return dy > 0 ? SWIPE_DOWN : SWIPE_UP;
    }
    return null;
  }

  _isValidHorizontalSwipe(gestureState) {
    const { vx, dy } = gestureState;
    const { velocityThreshold, directionalOffsetThreshold } = this.swipeConfig;
    return isValidSwipe(vx, velocityThreshold, dy, directionalOffsetThreshold);
  }

  _isValidVerticalSwipe(gestureState) {
    const { vy, dx } = gestureState;
    const { velocityThreshold, directionalOffsetThreshold } = this.swipeConfig;
    return isValidSwipe(vy, velocityThreshold, dx, directionalOffsetThreshold);
  }
  handleStartRecording = () => {
    console.log("Recieving");
    this.stopWatch.start();
    AndroidUtilities.vibrate(50)
    AndroidUtilities.addListener('onAmplitude', this.handleAmplitude);
    AndroidUtilities.addListener('onHaltResume', this.handleHostResume)
    AndroidUtilities.startAudioRecording(err => {      
      console.log("Error while recording!");
      ToastAndroid.show("Error while recording!", ToastAndroid.SHORT);
      this.shouldRecieve = false;
      return;
    });
    this.shouldRecieve = true;
    this.lockedRecording = false;
    this.state.commonMovement.setValue(0);
  }
  handleAmplitude = ({amplitude}) => {
      this.state.amplitude.setValue(amplitude)
      //console.log(amplitude);    
  }
  handleHostResume = ({path}) => {
    DeviceEventEmitter.removeListener("onAmplitude");
    DeviceEventEmitter.removeListener("onHaltResume");
    console.log(path);
  } 
  stopTerminateRecording = (deleteRecording) => {    
    try{
      if(this.shouldRecieve || this.lockedRecording){
            if(deleteRecording){      
              this.trash.play();
              AndroidUtilities.vibrate(50)
            }
            if(!this.lockedRecording){
              this.stopWatch.destroy();
              DeviceEventEmitter.removeListener("onAmplitude", this.handleAmplitude);
              DeviceEventEmitter.removeListener("onHaltResume", this.handleHostResume);
              AndroidUtilities.stopAudioRecording(deleteRecording)
              .then(file => {
                console.log(file);
              })
              .catch(err => {
                console.log(err);
              })
            }
            if(!this.lockedRecording){
              Animated.parallel([
                  Animated.spring(this.state.amplitude, {toValue:0,friction:100,useNativeDriver:false}),
                  Animated.spring(this.state.posX, {toValue:width-75,friction:100,useNativeDriver:false}),        
                  Animated.spring(this.state.lockMovement, {toValue:0,friction:100,useNativeDriver:false}),                  
              ]).start();
              setTimeout(() => {
                this.animatedContainer.hide(80);
              }, 300);
            }else{              
              this.state.posX.setValue(width-75)
              Animated.spring(this.state.commonMovement, {toValue:80,friction:3000,useNativeDriver:true}).start();              
            }       
            this.shouldRecieve = false;           
            this.setState({swipeOnlyIn:'none'})
      }
      clearTimeout(this.onLongPressTimeout);      
    }catch(err){
      alert(err)
    }
  }  
  cancelRecording = () =>{ 
    this.stopWatch.destroy();   
    DeviceEventEmitter.removeListener("onAmplitude", this.handleAmplitude);
    DeviceEventEmitter.removeListener("onHaltResume", this.handleHostResume);
    AndroidUtilities.vibrate(50);
    AndroidUtilities.stopAudioRecording(true)
    .then(file => {
      console.log(file);
    })
    .catch(err => {
      console.log(err);
    });
    this.lockedRecording = false;
    this.state.commonMovement.setValue(0);
    this.shouldRecieve = true;
    this.setState({swipeOnlyIn:'none'});
    clearTimeout(this.onLongPressTimeout);    
    Animated.parallel([
      Animated.spring(this.state.amplitude, {toValue:0,friction:100,useNativeDriver:false}),
      Animated.spring(this.state.posX, {toValue:width-75,friction:100,useNativeDriver:false}),        
      Animated.spring(this.state.lockMovement, {toValue:0,friction:100,useNativeDriver:false}),      
    ]).start();
    setTimeout(() => {
      this.animatedContainer.hide(80);
    }, 300);
  }

  render() {
  
    //const lT1  = !this.lockedRecording ?  : ;
    //const lT2  = this.lockedRecording ? -140 : -100;

    const lH1  = !this.lockedRecording ? 30 : 60;
    const lH2  = this.lockedRecording ? 30 : 60;

    
    const lA2  = !this.lockedRecording ? '0deg' : '5deg';
       
    const lockHeight = this.state.lockMovement.interpolate({inputRange:[-80, 0],outputRange:[30, 60],extrapolate:'clamp'});
    const customLockHeight = 30;

    const lockAngle =  this.state.lockMovement.interpolate({inputRange:[-80, 0],outputRange:['5deg', '0deg'],extrapolate:'clamp'});
    const lockNob = this.state.lockMovement.interpolate({inputRange:[-80, 0],outputRange:['0deg','-50deg'],extrapolate:'clamp'});
    const lockNobT = this.state.lockMovement.interpolate({inputRange:[-80, 0],outputRange:[0, -3],extrapolate:'clamp'});
    const lockTranslate =  this.state.lockMovement.interpolate({inputRange:[-80, 0],outputRange:[-140, -100],extrapolate:'clamp'});


 
    const afterLockAngle =  this.state.commonMovement.interpolate({inputRange:[0, 80],outputRange:['5deg', '0deg'],extrapolate:'clamp'});    
    const afterLockTranslate =  this.state.commonMovement.interpolate({inputRange:[0, 80],outputRange:[-140, -100],extrapolate:'clamp'});

    const amplitudeAni = this.state.amplitude.interpolate({inputRange:[0, 3000],outputRange:[1.3, 2],extrapolate:'clamp'});
    const hideCancel = this.state.posX.interpolate(
      {
        inputRange:[width - 140, width],
        outputRange:[0, 1],
        extrapolate:'clamp'
      }
    );
    const {
      isRecording,
      animatedContainer
    } = this.state;
    return (
      <View style={sty.full}>
       <AndroidCircularReveal style={{        
        flex: 0,
        width: width,
        height: 400,
        position: 'absolute',
        bottom: 0,
        zIndex: 4}} ref={ref => this.animatedContainer = ref} animationDuration={600}>
        <Animated.View style={{width:'100%',position:'absolute',bottom:0,left:0,height:300,backgroundColor:'transparent'}}>
        <View style={[sty.recordContainer]}>
          
          <View style={sty.bin}>
           <LottieView speed={1} ref={ref => this.trash = ref} source={require('../res/anim/trash.json')} loop={false} resizeMode="contain" style={{height:100,width:100}} />
          </View>

          <StopWatch ref={ref => this.stopWatch = ref} style={{
            height:'100%',
            justifyContent:'center',
            position:'absolute',
            transform:[
            {
              translateX:60
            }]
          }}/>

           {!this.lockedRecording ?
            <Animated.View style={{
              height:'100%',
              position:'absolute',
              justifyContent:'center',
              opacity:hideCancel
            }}>
            <Animatable.Text animation={leftRight} iterationCount={"infinite"} direction="alternate" style={{fontSize:13, color:'grey'}}>{"< Slide to cancel"}</Animatable.Text>
           </Animated.View> :
           <Animated.View style={{
              height:'100%',
              position:'absolute',
              justifyContent:'center',
              translateX:width/2.5,
              opacity:hideCancel
            }}>
            <Animatable.Text animation="zoomIn" onPress={this.cancelRecording} style={{fontSize:16,color:"#42a5f5", fontWeight:'bold'}}>Cancel</Animatable.Text>
           </Animated.View> 
          }

           

          <View {...this._panResponder.panHandlers} style={{
            height: circleRadius * 2,
            width:"100%",
            justifyContent: 'center',
          }}>
          <Animated.View                      
            style={{
              position:'absolute', opacity:hideCancel,borderRadius: circleRadius, height: circleRadius * 2, width: circleRadius * 2,
              transform: [{translateX: this.state.posX},{translateY: -10},{scale: amplitudeAni}]
            }}
          >
          <LottieView source={require('../res/anim/blob.json')} loop autoPlay resizeMode="contain" style={{flex:1}} />
          </Animated.View>
            
            <Animated.View                      
              style={[{
                  backgroundColor: '#42a5f5',position:'absolute', borderRadius: circleRadius, height: circleRadius * 2, width: circleRadius * 2,
                }, {
                  transform: [
                  {translateX: this.state.posX},
                  {translateY: -10},
                ]
                }]}
            >
            </Animated.View>   

           </View>    
           <Animated.View                      
            style={[{
                backgroundColor: '#42a5f5', borderRadius: circleRadius, 
                height:this.lockedRecording ? customLockHeight : lockHeight, width: 33,
                justifyContent:'center',
                alignItems:'center',    
                position:'absolute',  
                elevation:2          
              }, {
                transform: [
                {translateX: width-50},
                {rotate: this.lockedRecording ? afterLockAngle : lockAngle},
                {translateY: this.lockedRecording ? afterLockTranslate : lockTranslate}]
              }]}
            >
            {!this.lockedRecording ?
            <Animated.Image 
             resizeMode="cover"
             source={require('../res/images/nob.png')}
             style={{width:18,height:10,transform:[{translateX:lockNobT},{rotate:lockNob}]}}
             tintColor="#fff"
            />: null}
            <View style={{
              height:15,
              width:18,
              borderRadius:2,
              backgroundColor:'#fff'
            }} />
            </Animated.View>
        </View>
        </Animated.View>
        </AndroidCircularReveal>
      </View>
    );
  }
}

const sty = StyleSheet.create({
  full:{flex:1},
  bin:{position:'absolute',transform:[{translateX:-22},{translateY:-22}]},
  recordContainer:{backgroundColor:"white",height:55,width:'100%',position:'absolute',bottom:0,left:0,elevation:10}
})