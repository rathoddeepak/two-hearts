import React, {Component} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {
  StatusBar,
  YellowBox
} from 'react-native';
import { createStackNavigator,TransitionPresets } from '@react-navigation/stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import {
  Dimensions,
  request,
  InteractUser
} from 'ydc';
import GlobalHandler from 'res/GlobalHandler';
import PictureLockEditor from 'components/locks/PictureLockEditor';
import PatternLockEditor from 'components/locks/PatternLockEditor';
import PinLockEditor from 'components/locks/PinLockEditor';
import LockModal from 'components/locks/LockModal';
//Register Stack
import Login from 'screens/Login';
import ForgotPassword from 'screens/ForgotPassword';
import UpdatePassword from 'screens/UpdatePassword';
import Register from 'screens/Register';
import UpdateDetails from 'screens/UpdateDetails';
import MaleVerification from 'screens/MaleVerification';
import FemaleVerification from 'screens/FemaleVerification';
import Welcome from 'screens/Welcome';
//Chat Stack
import Chat from 'screens/chat';
import MediaPicker from 'screens/mediaPicker';

//Home Stack 
import Home from 'screens/Home';
import Messenging from 'screens/Messenging';
import CalendarView from 'screens/CalendarView';
//Album Stack
import Albums from 'screens/Albums';
import PhotosView from 'screens/PhotosView';
import SpecialDaysList from 'screens/SpecialDaysList';
import AddSpecialDay from 'screens/AddSpecialDay';
import CreateAlbum from 'screens/CreateAlbum';
import AlbumView from 'screens/AlbumView';
import GallerySelector from 'screens/GallerySelector';
import PhotoSelector from 'screens/PhotoSelector';
import Promises from 'screens/Promises';
import Notes from 'screens/Notes';
import NoteEditor from 'screens/NoteEditor';
import Menu from 'screens/Menu';
import MyProfile from 'screens/MyProfile';
import EditProfile from 'screens/EditProfile';
import Notifications from 'screens/Notifications';
import TabBar from './src/components/TabBar';

const Stack = createStackNavigator();
const Tab = createMaterialTopTabNavigator();

function ChatStack() {
  return (
    <Stack.Navigator
      initialRouteName="ChatScreen"
      screenOptions={{ gestureEnabled: false }}
      mode="modal"
      headerMode="none"
      screenOptions={{
        gestureEnabled: true,        
        cardOverlayEnabled: true,
        ...TransitionPresets.ModalPresentationIOS,
      }}
    >
    <Stack.Screen name="ChatScreen" component={Chat} />
    <Stack.Screen name="MediaPicker" component={MediaPicker} />
    <Stack.Screen name="PhotoSelector" component={PhotoSelector} />
   </Stack.Navigator>
  );
}

function RegisterStack() {
  return (
    <Stack.Navigator
      initialRouteName="Register"
      screenOptions={{ gestureEnabled: false }}
      mode="modal"
      headerMode="none"
      screenOptions={{
        gestureEnabled: true,        
        cardOverlayEnabled: true,
        ...TransitionPresets.SlideFromRightIOS
      }}
    >
    <Stack.Screen name="Register" component={Register} />
    <Stack.Screen name="UpdateDetails" component={UpdateDetails} />
    <Stack.Screen name="Verification" component={FemaleVerification} />
    <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
    <Stack.Screen name="UpdatePassword" component={UpdatePassword} />
    <Stack.Screen name="Welcome" component={Welcome} />
    
   </Stack.Navigator>
  );
}

function AlbumsStack() {
  return (
    <Stack.Navigator
      initialRouteName="Albums"
      screenOptions={{ gestureEnabled: false }}
      mode="modal"
      headerMode="none"
      screenOptions={{
        gestureEnabled: true,        
        cardOverlayEnabled: true,
        ...TransitionPresets.ModalPresentationIOS
      }}
    >
    <Stack.Screen name="Albums" component={Albums} />
    <Stack.Screen name="PhotoSelector" component={PhotoSelector} />   
    <Stack.Screen name="CreateAlbum" component={CreateAlbum} />   

   </Stack.Navigator>
  );
}

function HomeStack() {  
  return (
        <Tab.Navigator
          initialRouteName="Home"
          screenOptions={{ gestureEnabled: false }}          
          headerMode="none"          
          tabBar={TabBar}
        >
          <Tab.Screen name="Home" component={Home} />
          <Tab.Screen name="Albums" component={AlbumsStack} />          
          <Tab.Screen name="Chat" component={Messenging} />
          <Tab.Screen name="Notification" component={Notifications} />
          <Tab.Screen name="Menu2" component={Menu} />
       </Tab.Navigator>
  )
}

function MainStack() {
  return (
    <Stack.Navigator
      initialRouteName="HomeScreen"
      screenOptions={{ gestureEnabled: false }}
      mode="modal"
      headerMode="none"
      screenOptions={{
        gestureEnabled: true,        
        cardOverlayEnabled: true,
        ...TransitionPresets.ModalPresentationIOS
      }}
    >    
    <Stack.Screen name="HomeScreen" component={HomeStack} />                     
   </Stack.Navigator>
  );
}

export default class App extends Component {
  UNSAFE_componentWillMount() {    
    GlobalHandler.init();
  }
  render() {
    return (    
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Splash"
            screenOptions={{ gestureEnabled: false }}
            headerMode="none"         
          >
            <Stack.Screen name="Splash" component={Splash} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="PhotosView" component={PhotosView} />
            <Stack.Screen name="RegisterAcitivty" component={RegisterStack} />
            <Stack.Screen name="ChatActivity" component={ChatStack} />
            <Stack.Screen name="HomeActivity" component={HomeStack} />
            <Stack.Screen name="PhotoSelector" component={PhotoSelector} /> 
            <Stack.Screen name="CreateAlbum" component={CreateAlbum} /> 
            <Stack.Screen name="AlbumView" component={AlbumView} />
            <Stack.Screen name="GallerySelector" component={GallerySelector} />
            <Stack.Screen name="SpecialDaysList" component={SpecialDaysList} />
            <Stack.Screen name="AddSpecialDay" component={AddSpecialDay} />
            <Stack.Screen name="CalendarView" component={CalendarView} />       
            <Stack.Screen name="Promises" component={Promises} />
            <Stack.Screen name="Notes" component={Notes} />
            <Stack.Screen name="NoteEditor" component={NoteEditor} />
            <Stack.Screen name="MyProfile" component={MyProfile} />
            <Stack.Screen name="EditProfile" component={EditProfile} />            
            <Stack.Screen name="PatternLockEditor" component={PatternLockEditor} />                                
            <Stack.Screen name="PictureLockEditor" component={PictureLockEditor} />            
            <Stack.Screen name="PinLockEditor" component={PinLockEditor} />               
         </Stack.Navigator>
       </NavigationContainer>   
    )
  }
}


class Splash extends Component {  
  componentDidMount(){        
    YellowBox.ignoreWarnings([
      'Unrecognized WebSocket connection option(s) `agent`, `perMessageDeflate`, `pfx`, `key`, `passphrase`, `cert`, `ca`, `ciphers`, `rejectUnauthorized`. Did you mean to put these under `headers`?',
      '`flexWrap: `wrap`` is not supported with the `VirtualizedList` components.Consider using `numColumns` with `FlatList` instead.'
    ]);
    const nav = this.props.navigation;    
    setTimeout(() => {
      switch(log_state){
        case -1:
          nav.navigate('Login');
        break;
        case 1:
          nav.navigate("RegisterAcitivty", {screen:"UpdateDetails"})
        break;  
        case 2:
          nav.navigate("RegisterAcitivty", {screen:"Verification"})
        break;
        case 3:
          // InteractUser.initListener();
          global.relation_code = "dasf"
          setTimeout(() => nav.navigate('HomeActivity'), 100);          
        break;
        case 4:
          nav.navigate("UpdateApp");
        break;
        case 5:
          nav.navigate("RegisterAcitivty", {screen:"UpdatePassword"})
        break;
      }  
    })
  }
  render(){
    return(
      <>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />      
      <LockModal />
      </>
    )
  }
}