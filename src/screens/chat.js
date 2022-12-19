import React, {Component} from 'react';
import {
  TouchableNativeFeedback,
  View,
  Text,
  TextInput,
  TouchableOpacity,  
  Image,
  Animated,
  Platform,
  UIManager,
  LayoutAnimation,
  Keyboard,
  ImageBackground,
  FlatList,
  StyleSheet
} from 'react-native';
import {Ripple, Icon, s, ImageView} from 'components'
import {Dimensions,AndroidUtilities,request,MessagesList} from 'ydc';
import constants from 'libs/constants';
import FastImage from 'react-native-fast-image';
import moment from 'moment';
import * as Animatable from 'react-native-animatable';
import Swipeable from "react-native-gesture-handler/Swipeable";
import { RectButton } from "react-native-gesture-handler";
import {RecyclerListView,BaseItemAnimator,LayoutProvider,DataProvider} from "recyclerlistview";
import FlightCard from "./flights/FlightCard";
const headerHeight = AndroidUtilities.hps("7%") + constants.statusBar();
let ChatScreenHeight2 = constants.screenHeight2() - (headerHeight + AndroidUtilities.hps("7%"));
const avatar = "data:image/jpeg;base64,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"
const fontSize = AndroidUtilities.fv(13);

let dataCloner = new DataProvider((r1, r2) => {return r1 !== r2});

export default class Chat extends React.PureComponent {
  constructor(props){
    super(props);
    this.state = {
      //isTyping:false,
      text:'',
      typing:false,
      addData:false,
      keyboardHeight:new Animated.Value(0),
      ChatScreenHeight:ChatScreenHeight2,
      dataProvider:dataCloner.cloneWithRows(chatDataList),
      chatList:chatDataList,
      marginTop:0
    }    
    this.keyboardHeight = 100;
    this.replyActivate = [];
  }  
  /* 
  componentDidMount(){    
    
    this.socket = io("http://192.168.43.250:2020/", {
      transports: ['websocket']    
    });
    
    this.socket.emit(this.dot("join room"), roomCode);  
    
    

    this.socket.on(this.dot("new message"), msg => {
      var chatObject = [{     
            _id:this.state.messages.length + 4,
            createdAt:new Date(),
            text:msg,
            user: {
              _id: 2,
              name: 'React Native',
              avatar: 'https://placeimg.com/140/140/any',
            }
      }];
      this.setState(previousState => ({
       messages: GiftedChat.append(previousState.messages, chatObject),
      }))
    })

    this.socket.on(this.dot("typing"), typing => {
      this.chat.setIsTypingDisabled(typing); 
    });
    
  }

  dot(key){
    var val;
    switch(key){
      case 'join room':
      val = 'jr';
      break;      
      case 'send message':
      val = 'sm';
      break;
      case 'new message':
      val = 'nm';
      break;
      case 'typing':
      val = 'ty';
      break;
      default:
      return;
    }
    return val;
  }
  onSend(messages = []) {
    var chatObject = [{
          _id: this.state.messages.length + 4,
          text: this.state.text,
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
          },
    }]    
          this.setState(previousState => ({
       messages: GiftedChat.append(previousState.messages, messages),
      }))
    this.socket.emit(this.dot("send message"), this.state.text);
  }*/
  componentDidMount(){
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
  }
  componentWillUnmount(){    
    Keyboard.removeListener('keyboardDidShow', this._keyboardDidShow);
    Keyboard.removeListener('keyboardDidHide', this._keyboardDidHide);
  }
  _keyboardDidShow = ({endCoordinates}) => {    
    let temp = ChatScreenHeight2 - (endCoordinates.height+42);
    this.setState({ChatScreenHeight:temp,marginTop:0});
    this.keyboardHeight = endCoordinates.height;
    Animated.timing(this.state.keyboardHeight, {
      toValue:endCoordinates.height+42,
      duration:200,
      useNativeDriver: true
    }).start();    
  }
  _keyboardDidHide = (e) => {
    this.setState({ChatScreenHeight:ChatScreenHeight2,marginTop:0}); 
    Animated.timing(this.state.keyboardHeight, {
      toValue:0, 
      duration:200,     
      useNativeDriver: true
    }).start();
  }
  render(){
    const sendAdjustY = this.state.keyboardHeight.interpolate({
      inputRange:[0, this.keyboardHeight],
      outputRange:[0, -this.keyboardHeight]      
    });
    const {      
      addData,
      ChatScreenHeight,
      marginTop
    } = this.state;
    return (
      <View style={{backgroundColor:"white",width:constants.width(),height:constants.maxHeight2()}}>
      <ActionBar />      
       <ImageBackground style={{height:ChatScreenHeight2,width:'100%'}} source={{uri:"https://i.pinimg.com/originals/51/ed/c0/51edc046eb80046ee4755ee71d0f19ca.jpg"}}>
       <MessagesList
        style={{width:'100%',height:ChatScreenHeight,marginTop:marginTop}}
        ref={ref => this.messagesList = ref}
       />       
       </ImageBackground>      
      <TextInputSender
       keyboardAjust={sendAdjustY}
       sendText={this.dipatchMessage}
       onAttachmentPress={() => this.props.navigation.navigate('MediaPicker')}
      />      
      </View>
    )
  }
  dipatchMessage = (text) => {
    this.messagesList.addToStart(text);
    setTimeout(() => {    
     this.setState({
        ChatScreenHeight:this.state.ChatScreenHeight+0.6,
        marginTop:this.state.marginTop-0.6
     })
    })
  }
}

class ActionBar extends Component {
  render(){    
    return (
      <View style={{height:headerHeight,width:'100%',elevation:2,backgroundColor:'white',}}>       
       <View style={{flexDirection:'row',height:headerHeight - constants.statusBar(), marginTop:constants.statusBar()}}> 
         
         <View style={{width:AndroidUtilities.wp("85%"),height:'100%',alignItems:'center',paddingLeft:AndroidUtilities.fv(8),flexDirection:'row'}}>
          <ImageView
           source={avatar}
           style={{width:AndroidUtilities.fv(40),height:AndroidUtilities.fv(40),borderRadius:100,marginRight:AndroidUtilities.fv(10)}}
          />
          <Text style={{fontSize:AndroidUtilities.fv(13),color:'black'}} numberOfLines={2}>PagalNato{"\n"}
          <Text style={{fontSize:AndroidUtilities.fv(10),color:'grey'}} numberOfLines={1}>connecting...</Text>
          </Text>          
         </View>

         <View style={{width:AndroidUtilities.wp("15%"),height:'100%',justifyContent:'center',alignItems:'center'}}>
          <Icon name="Menu" color="grey" size={18}/>
         </View>
       </View>
      </View>
    )
  }
}
class TextInputSender extends Component {
  constructor(props){
    super(props);
    this.state = {
      //isTyping:false,
      text:'',
      //messages: []
    }
  }
  hide = () => {
    this.setState({typing:false});
    this.attach.show();
    this.mic.show();
    this.sendIcon.hide();
  }
  show = () => {
    this.setState({typing:true});
    this.sendIcon.show();
    this.attach.hide();
    this.mic.hide();
  }
  handleChange = text =>{
    this.setState({text});
    if(request.isBlank(text) && this.sendIcon.isShowing()){
      this.hide();
    }else if(this.sendIcon.isHidden()){
      this.show();
    }    
  }
  handleSend = async (text) => {                
    if(!request.isBlank(text)){          
      this.hide();
      this.props.sendText(text);      
    }    
  }
  render(){
    const {
      typing,
      text
    } = this.state;
    const {
      keyboardAjust
    } = this.props;
    const fv50 = AndroidUtilities.fv(47);
    const fv53 = AndroidUtilities.hps("7%");
    const fv30 = AndroidUtilities.fv(28);
    return(
      <Animated.View style={{
        flexDirection:'row',
        width:constants.width(),
        overflow:'hidden',
        minHeight:fv53,
        maxHeight:AndroidUtilities.fv(80),
        backgroundColor:"white",
        elevation:7,
        position:'absolute',
        bottom:0,
        transform:[{translateY:keyboardAjust}]
      }}>      
      <AniIcon
        name="smile" 
        viewWidth={fv50}
        viewHeight={fv53}
        ref={ref => this.mic = ref}       
        color={s[config.theme_s].grey}
        size={fv30}
       />
      <TextInput
        underlineColorAndroid="transparent"
        selectionColor="#03a9f4"
        placeholder="Feelings"
        value={this.state.text}        
        //onSubmitEditing={this.handleSendData}
        //onFocus={this.onFocus}
        placeholderTextColor="#9e9e9e"
        onChangeText={this.handleChange}
        multiline
        style={{fontSize:fontSize, color:'#333',width:typing ? constants.width() - 70 : constants.width() - 150, maxHeight:80}}
        clearButtonMode="while-editing"
      />    
       <View style={{position:'absolute',right:0}}><AniIcon
        onPress={() => {this.setState({text:''});this.handleSend(text)}}
        name="send"
        showing={false}
        viewWidth={fv50}
        viewHeight={fv53}
        ref={ref => this.sendIcon = ref}
        color={s[config.theme_s].color}
        size={fv30}
       /></View>
       <AniIcon
        name="attachment"
        viewWidth={fv50}
        viewHeight={fv53}
        onPress={this.props.onAttachmentPress}
        ref={ref => this.attach = ref}
        color={s[config.theme_s].grey}
        size={fv30}
       />       
       <AniIcon
        name="mic" 
        viewWidth={fv50}
        viewHeight={fv53}
        ref={ref => this.mic = ref}       
        color={s[config.theme_s].grey}
        size={fv30}
       />
      </Animated.View>
    )
  }
}

class AniIcon extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      showing:true
    }
  }
  show = () => {     
     this.setState({showing:true}, () => {
      if(this.icon != null){
        this.icon.zoomIn();
       }
     })   
  }
  componentDidMount(){
    this.setState({
      showing:this.props.showing == undefined ? true : this.props.showing
    })
  }
  hide = () => {     
     if(this.icon != null){
      this.icon.zoomOut();
     }
     setTimeout(() => {      
      this.setState({showing:false});
     }, 150);   
  }  
  isHidden(){
    return !this.state.showing;
  }
  isShowing(){
    return this.state.showing;
  }
  render(){
    const {
      color,
      size,
      name,
      viewWidth,
      viewHeight,
      onPress
    } = this.props;
    return (
      <TouchableOpacity onPress={onPress}>
      {this.state.showing ?
        <Animatable.View 
          duration={150}
          style={{width:viewWidth,height:viewHeight, justifyContent:'center',alignItems:'center'}}
          useNativeDriver={true} 
          ref={ref => this.icon = ref}>

          <Icon 
            name={name}
            color={color}
            size={size}
           />
        </Animatable.View>
      : null}
      </TouchableOpacity>
    )
  }
}

const sty = StyleSheet.create({
  chatItem:{
    padding:10,    
    borderRadius:20,    
    maxWidth:"70%",    
    flexDirection:'row',
    elevation:0.5
  }
})

const chatDataList = [
        {
            id:1,
            type:'text',
            text:'Hii, baby good morning!',
            time:1592056412
        },
        {
          id:2,
          type:'text',
          text:'hii baby',
          time:1592056412,
          owner:0
        },
        {
          id:3,
          type:'text',
          text:'kay karet aahes',
          time:1592056412,          
        },
        {
          id:4,
          type:'text',
          text:'tuza wait..',
          time:1592056412,
          owner:0
        },
        {
          id:5,
          type:'text',
          text:'Asa kay i miss u yar',
          time:1592056412          
        },
        {
          id:6,
          type:'text',
          text:'Hamesha tuzay sobat',
          time:1592109187,
          owner:0      
        },
        {
          id:7,
          type:'text',
          text:'khup aatvan yet aahe re tuzi khare',
          time:1592056412          
        },  
        {
          id:8,
          type:'text',
          text:'i miss u baby, plzz asa sad raho nako mazi pillu mala kasa ter vatat re shona plzzz',
          time:1592056412          
        },
        {
          id:9,
          type:'text',
          text:'Ithaj aaahre re pagal',
          time:1592056412,
          owner:0      
        },
        { 
          id:10,
          type:'text',
          text:'kota janar tula sodun',
          time:1592056412,
          owner:0      
        }

]