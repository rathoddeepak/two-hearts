import React from 'react';
import {
	View
} from 'react-native';
import {Dimensions,AndroidUtilities} from 'ydc'
export default class Hr extends React.Component {
	render(){
		return (
			<View style={{
				height:0.7,
				backgroundColor:'#f1f1f1',
				opacity:0.5,				
				marginTop:this.props.marginTop,
				alignSelf:'center',
				width:AndroidUtilities.wp('88.5%')
			}} />
		)
	}
}
