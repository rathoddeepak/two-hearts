import React, { Component } from 'react';
import {
  requireNativeComponent,
  UIManager,  
  ViewPropTypes,
  TouchableWithoutFeedback
} from 'react-native';
import {
 boolean,
 integer,
 string,
 array
} from 'prop-types';

class CheckBoxSquare extends Component {

  constructor() {
    super();        
    this.state = {
      checked:false      
    };
  }
  componentWillMount(){
   const {
   	checked   	
   } = this.props;
   this.setState({
   	checked   	
   })
  }
  render() {
  	const {
		uncheckedColor,
		disabledColor,
		backgroundColor,
		checkColor,	
		disabled,
		cancel,
		size
  	} = this.props;
    return (
      <TouchableWithoutFeedback onPress={() => this.setState({
      	checked:!this.state.checked
      })}>
      <YDCCheckBoxSquare
			uncheckedColor={uncheckedColor}
			disabledColor={disabledColor}
			backgroundColor={backgroundColor}
			checkColor={checkColor}
			checked={this.state.checked}
			disabled={disabled}
			cancel={cancel}
			style={{
				width:size,
				height:size
			}}
      /></TouchableWithoutFeedback>
    );
  }
}

CheckBoxSquare.propTypes = {  
   uncheckedColor:string,
   disabledColor:string,
   backgroundColor:string,
   checkColor:string,
   checked:boolean,
   disabled:boolean,
   cancel:boolean,
   size:integer
};

CheckBoxSquare.defaultProps = {
	uncheckedColor:"white",
	disabledColor:"#f2f2f2",
	backgroundColor:"white",
	checkColor:"#5281B9",
	checked:true,
	disabled:false,
	cancel:false,
	size:25	  
}
const YDCCheckBoxSquare = requireNativeComponent('YDCCheckBoxSquare', CheckBoxSquare);

export default CheckBoxSquare;
