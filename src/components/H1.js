import React, { Component } from 'react'
import {
	Text
} from 'react-native';
import PropTypes from 'prop-types';
import AndroidUtilities from 'ydc/AndroidUtilities';
export default class H1 extends React.Component {
	render(){
		const {
			text,
			style
		} = this.props;
		return (
			<Text style={[{fontSize:AndroidUtilities.fv(18),fontWeight:'bold',color:'black',padding:AndroidUtilities.fv(9)}, style]}>
			 {text}
			</Text>
		)
	}
}
H1.propTypes = {
	text: PropTypes.string,
	style: PropTypes.object
}
H1.defaultProps = {
	text: '',
	style: {}
}