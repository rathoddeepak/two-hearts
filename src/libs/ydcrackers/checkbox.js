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
 string
} from 'prop-types';

class CheckBox extends Component {

  constructor() {
    super();        
    this.state = {
      selected:false      
    };
  }
  componentDidMount(){
   const {
   	selected   	
   } = this.props;
   this.setState({
   	selected   	
   })
  }
  render() {
  	const {
      duration,
      tickerColor,
      tickerWidth,
      borderWidth,
      borderColor,
      backgroundColor,
      size
  	} = this.props;
    return (
      <TouchableWithoutFeedback onPress={() => this.setState({
      	selected:!this.state.selected
      })}><YDCCheckBox
          selected={true}
          duration={duration}
          tickerColor={tickerColor}
          tickerWidth={tickerWidth}
          borderWidth={borderWidth}
          borderColor={borderColor}
          backgroundColor={backgroundColor}
      		style={[{height:size,width:size}, this.props.style]}
    		
      /></TouchableWithoutFeedback>
    );
  }
}

CheckBox.propTypes = {
  selected:boolean,
  duration:integer,
  tickerColor:string,
  tickerWidth:integer,
  borderWidth:integer,
  borderColor:string,
  backgroundColor:string,
  size:integer
};

CheckBox.defaultProps = {
	  selected: true,
	  duration: 400,
	  tickerColor:"black",
    tickerWidth:10,
    borderWidth:10,
    size:52,
    borderColor:"black",
    backgroundColor:"white"
}
const YDCCheckBox = requireNativeComponent('YDCCheckBox', CheckBox);

export default CheckBox;
