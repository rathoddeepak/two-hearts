 import React from 'react';
import {
	View,
	Text	
} from 'react-native';
import PropTypes from 'prop-types';
import {
	Ripple
} from 'components';
import s from 'components/theme';
export default class Button extends React.PureComponent {
	render() {
		const {
			text,
			style,
			height,
			width,
			minWidth,
			onPress  
		} = this.props;
		return (
			<Ripple onPress={onPress}  rippleContainerBorderRadius={10} style={{height:height, width:width, minWidth:minWidth}}>
			<View style={{flex:1,borderRadius:10, backgroundColor:s[config.theme_s].color, justifyContent: 'center', alignItems: 'center', ...style}}>
			 <Text numberOfLines={1} style={{fontSize:15,color:"white"}}>{text}</Text>
			</View>
			</Ripple>
		)
	}
}

Button.propTypes = {
	text:PropTypes.any,
	style:PropTypes.any,
	height:PropTypes.any,
	height:PropTypes.width
}

Button.defaultProps = {
	text:"Add",
	style:{},
	height:40,
	width:'70%',
	minWidth:70
}