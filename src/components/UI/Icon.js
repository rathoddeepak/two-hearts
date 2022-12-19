import React from 'react';
import PropTypes from 'prop-types';
import {
	View	
} from 'react-native';
const l = "../../res/images/";
import FastImage from 'react-native-fast-image';
export default class Icon extends React.Component {
  render(){
  	const {
  		name,
  		style,
  		color,
  		size
  	} = this.props;
  	switch(name){
	  	case "send":
	  	return(<FastImage source={require(l+"send.png")} tintColor={color} style={[style, {width:size,height:size}]}/>)
	  	break;
	  	case "clear":
	  	return(<FastImage source={require(l+"clear.png")} tintColor={color} style={[style, {width:size,height:size}]}/>)
	  	break;
	  	case "bookmark":
	  	return(<FastImage source={require(l+"bookmark.png")} tintColor={color} style={[style, {width:size,height:size}]}/>)
	  	break;
	  	case "smile":
	  	return(<FastImage source={require(l+"smile.png")} tintColor={color} style={[style, {width:size,height:size}]}/>)
	  	break;
	  	case "attachment":
	  	return(<FastImage source={require(l+"attachment.png")} tintColor={color} style={[style, {width:size,height:size}]}/>)
	  	break;
	  	case "mic":
	  	return(<FastImage source={require(l+"mic.png")} tintColor={color} style={[style, {width:size,height:size}]}/>)
	  	break;
	  	case "gallery":
	  	return(<FastImage source={require(l+"gallery.png")} tintColor={color} style={[style, {width:size,height:size}]}/>)
	  	break;
	  	case "poll":
	  	return(<FastImage source={require(l+"poll.png")} tintColor={color} style={[style, {width:size,height:size}]}/>)
	  	break;
	  	case "song":
	  	return(<FastImage source={require(l+"song.png")} tintColor={color} style={[style, {width:size,height:size}]}/>)
	  	break;
	  	case "pause":
	  	return(<FastImage source={require(l+"pause.png")} tintColor={color} style={[style, {width:size,height:size}]}/>)
	  	break;
	  	case "play":
	  	return(<FastImage source={require(l+"play.png")} tintColor={color} style={[style, {width:size,height:size}]}/>)
	  	break;
	  	case "reset":
	  	return(<FastImage source={require(l+"reset.png")} tintColor={color} style={[style, {width:size,height:size}]}/>)
	  	break;
	    case "user":
	  	return(<FastImage source={require(l+"user.png")} tintColor={color} style={[style, {width:size,height:size}]}/>)
	  	break;	  	
	  	case "user_outline":
	  	return(<FastImage source={require(l+"user_outline.png")} tintColor={color} style={[style, {width:size,height:size}]}/>)
	  	break;
	  	case "lock":
	  	return(<FastImage source={require(l+"lock.png")} tintColor={color} style={[style, {width:size,height:size}]}/>)
	  	break;
        case "lock_outline":
	  	return(<FastImage source={require(l+"lock_outline.png")} tintColor={color} style={[style, {width:size,height:size}]}/>)
	  	break;
	  	case "heart":
	  	return(<FastImage source={require(l+"heart.png")} tintColor={color} style={[style, {width:size,height:size}]}/>)
	  	break;	
	  	case "cake":
	  	return(<FastImage source={require(l+"cake.png")} tintColor={color} style={[style, {width:size,height:size}]}/>)
	  	break;

	  	case "Home":
	  	return(<FastImage source={require(l+"Home.png")} tintColor={color} style={[style, {width:size,height:size}]}/>)
	  	break;
	  	case "Home_outline":
	  	return(<FastImage source={require(l+"Home_outline.png")} tintColor={color} style={[style, {width:size,height:size}]}/>)
	  	break;
	  	case "Albums":
	  	return(<FastImage source={require(l+"Albums.png")} tintColor={color} style={[style, {width:size,height:size}]}/>)
	  	break;	  	
	  	case "Albums_outline":
	  	return(<FastImage source={require(l+"Albums_outline.png")} tintColor={color} style={[style, {width:size,height:size}]}/>)
	  	break;
	  	case "Chat":
	  	return(<FastImage source={require(l+"Chat.png")} tintColor={color} style={[style, {width:size,height:size}]}/>)
	  	break;
	  	case "Chat_outline":
	  	return(<FastImage source={require(l+"Chat_outline.png")} tintColor={color} style={[style, {width:size,height:size}]}/>)
	  	break;
	  	case "Notification":
	  	return(<FastImage source={require(l+"Notification.png")} tintColor={color} style={[style, {width:size,height:size}]}/>)
	  	break;
	  	case "Notification_outline":
	  	return(<FastImage source={require(l+"Notification_outline.png")} tintColor={color} style={[style, {width:size,height:size}]}/>)
	  	break;
	  	case "Menu":
	  	return(<FastImage source={require(l+"Menu.png")} tintColor={color} style={[style, {width:size,height:size}]}/>)
	  	break;
	  	case "Menu2":
	  	return(<FastImage source={require(l+"Menu2.png")} tintColor={color} style={[style, {width:size,height:size}]}/>)
	  	break;
	  	case "Menu_outline":
	  	return(<FastImage source={require(l+"Menu_outline.png")} tintColor={color} style={[style, {width:size,height:size}]}/>)
	  	break;
	  	case "chevron_down":
	  	return(<FastImage source={require(l+"chevron_down.png")} tintColor={color} style={[style, {width:size,height:size}]}/>)
	  	break;
	    case "add_circle":
	  	return(<FastImage source={require(l+"add_circle.png")} tintColor={color} style={[style, {width:size,height:size}]}/>)
	  	break;
	  	case "back":
	  	return(<FastImage source={require(l+"back.png")} tintColor={color} style={[style, {width:size,height:size}]}/>)
	  	break;
	  	case "close":
	  	return(<FastImage source={require(l+"close.png")} tintColor={color} style={[style, {width:size,height:size}]}/>)
	  	break;
	    case "trash":
	  	return(<FastImage source={require(l+"trash.png")} tintColor={color} style={[style, {width:size,height:size}]}/>)
	  	break;
	    case "fav":
	  	return(<FastImage source={require(l+"fav.png")} tintColor={color} style={[style, {width:size,height:size}]}/>)
	  	break;
	  	case "add":
	  	return(<FastImage source={require(l+"add.png")} tintColor={color} style={[style, {width:size,height:size}]}/>)
	  	break;
	  	case "gift":
	  	return(<FastImage source={require(l+"gift.png")} tintColor={color} style={[style, {width:size,height:size}]}/>)
	  	break;
	  	case "album":
	  	return(<FastImage source={require(l+"album.png")} tintColor={color} style={[style, {width:size,height:size}]}/>)
	  	break;
	  	case "clock":
	  	return(<FastImage source={require(l+"clock.png")} tintColor={color} style={[style, {width:size,height:size}]}/>)
	  	break;
	  	case "calendar":
	  	return(<FastImage source={require(l+"calendar.png")} tintColor={color} style={[style, {width:size,height:size}]}/>)
	  	break;
	  	case "add_calendar":
	  	return(<FastImage source={require(l+"add_calendar.png")} tintColor={color} style={[style, {width:size,height:size}]}/>)
	  	break;
	  	case "magic":
	  	return(<FastImage source={require(l+"magic.png")} tintColor={color} style={[style, {width:size,height:size}]}/>)
	  	break;
	  	case "pin":
	  	return(<FastImage source={require(l+"pin.png")} tintColor={color} style={[style, {width:size,height:size}]}/>)
	  	break;
	  	case "fingerprint":
	  	return(<FastImage source={require(l+"fingerprint.png")} tintColor={color} style={[style, {width:size,height:size}]}/>)
	  	break;
	  	case "pattern":
	  	return(<FastImage source={require(l+"pattern.png")} tintColor={color} style={[style, {width:size,height:size}]}/>)
	  	break;

	  	case "diary":
	  	return(<FastImage source={require(l+"diary.png")} tintColor={color} style={[style, {width:size,height:size}]}/>)
	  	break;
	  	case "promises":
	  	return(<FastImage source={require(l+"promise.png")} tintColor={color} style={[style, {width:size,height:size}]}/>)
	  	break;
	  	case "notes":
	  	return(<FastImage source={require(l+"notes.png")} tintColor={color} style={[style, {width:size,height:size}]}/>)
	  	break;
	  	case "tick":
	  	return(<FastImage source={require(l+"tick.png")} tintColor={color} style={[style, {width:size,height:size}]}/>)
	  	break;

	  	case "undo":
	  	return(<FastImage source={require(l+"undo.png")} tintColor={color} style={[style, {width:size,height:size}]}/>)
	  	break;
	  	case "redo":
	  	return(<FastImage source={require(l+"redo.png")} tintColor={color} style={[style, {width:size,height:size}]}/>)
	  	break;
	  	case "palette":
	  	return(<FastImage source={require(l+"palette.png")} tintColor={color} style={[style, {width:size,height:size}]}/>)
	  	break;
	  	case "edit":
	  	return(<FastImage source={require(l+"edit.png")} tintColor={color} style={[style, {width:size,height:size}]}/>)
	  	break;
	  	case "phone":
	  	return(<FastImage source={require(l+"phone.png")} tintColor={color} style={[style, {width:size,height:size}]}/>)
	  	break;
	  	case "baby":
	  	return(<FastImage source={require(l+"baby.png")} tintColor={color} style={[style, {width:size,height:size}]}/>)
	  	break;
	  	

	  	default:
	  	return(<FastImage source={require(l+"album.png")} tintColor={color} style={[style, {width:size,height:size}]}/>)
	  	break;
  	}
  } 
}

Icon.propTypes = {
	name:PropTypes.string,
	style:PropTypes.object,
	size:PropTypes.number,
	color:PropTypes.string
}

Icon.defaultProps = {
	name:"send",	
	size:22,
	color:"black",
	style:{}
}