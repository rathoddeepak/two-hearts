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

class CheckBoxT extends Component {
  constructor(props) {
    super();        
    this.state = {
      checked:false,
      size:0
    };
  }
  componentDidMount(){
   const {
   	checked
   } = this.props;
   this.setState({
   	checked
   })
  }
  onChange = () =>{
    this.setState({
      checked:!this.state.checked
    }, () => this.props.onChange(this.state.checked));
  }  
  deselect = () => {
    this.setState({checked:false})
  }
  select = () => {
    if(!this.state.checked)this.setState({checked:true});
  }
  render() {
  	const {
      disabled,
      count,
      type,
      size,
      colorMap,
  	} = this.props;
    return (
      <TouchableWithoutFeedback onPress={() => this.onChange()}>
      <YDCCheckBox
          checked={this.state.checked}		
      		count={count}      		
      		disabled={disabled}
      		style={{
      			height:this.props.size,
      			width:this.props.size,
            opacity:disabled ? 0.8 : 1,
      			background:"transparent",
            elevation:5
      		}}      		      		
      		size={22}     
          type={type} 		
      		colorMap={colorMap}
      /></TouchableWithoutFeedback>
    );
  }
}

CheckBoxT.propTypes = {  
  checked: boolean,
  disabled: boolean,
  count: integer,  
  drawUnchecked:boolean,
  type:integer,  
  colorMap:array
};

CheckBoxT.defaultProps = {
	  checked: true,
	  disabled: false,
	  count: -1,
    drawUnchecked:false,
	  type:8,
	  colorMap:{
      background:"#5281B9",
      background2:"#5281B9",
      check:"#5281B9",
      disabled:"#5281B9"
    }	  	
}
const YDCCheckBox = requireNativeComponent('YDCCheckBoxT', CheckBoxT);

export default CheckBoxT;
