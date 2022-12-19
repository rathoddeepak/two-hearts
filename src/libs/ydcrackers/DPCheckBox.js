import React, { Component } from 'react';
import {
  requireNativeComponent,
  UIManager,  
  ViewPropTypes,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import {
 boolean,
 integer,
 string,
 array
} from 'prop-types';
import CheckBoxT from './checkboxt'
class DPCheckBox extends Component {

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
      })}>
      <View>
	    <CheckBoxT
	     size={size}
	     type={9}
	     count={-1}
	     checked={this.state.selected}
	     colorMap = {{
	        background:borderColor,
	        background2:borderColor,
	        check:borderColor,
	        disabled:"green"
		  }}
	    />
	    <YDCCheckBox
          selected={this.state.selected}
          duration={duration}
          tickerColor={tickerColor}
          tickerWidth={tickerWidth}
          borderWidth={borderWidth}
          borderColor={borderColor}
          backgroundColor={backgroundColor}
      	  style={[{height:size,width:size,position:'absolute'}, this.props.style]}    		
      />
      </View>	    
	  </TouchableWithoutFeedback>
    );
  }
}

DPCheckBox.propTypes = {  
  selected:boolean,
  duration:integer,
  tickerColor:string,
  tickerWidth:integer,
  borderWidth:integer,
  borderColor:string,
  backgroundColor:string,
  size:integer
};

DPCheckBox.defaultProps = {
	selected: true,
	duration: 400,
	tickerColor:"black",
    tickerWidth:10,
    borderWidth:10,
    size:52,
    borderColor:"black",
    backgroundColor:"white"	  
}

const YDCCheckBox = requireNativeComponent('YDCCheckBox', DPCheckBox);
export default DPCheckBox;
