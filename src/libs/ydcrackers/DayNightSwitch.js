import React, { Component } from 'react';
import {
  requireNativeComponent,
  UIManager,  
  ViewPropTypes,
  TouchableWithoutFeedback
} from 'react-native';
import {
 boolean,
} from 'prop-types';

class DayNightSwitch extends Component {
  constructor() {
    super();        
    this.state = {
      selected:false
    };
  } 
  componentDidMount(){
    if(this.props.mode == 0){
      this.setState({selected:true});
    }    
  }
  render() {
    const {
      onChange,
      selected,
      style
    } = this.props;
    return (
      <TouchableWithoutFeedback onPress={onChange}>
      <RNDayNightSwitch
          style={style}
          selected={this.state.selected}
      /></TouchableWithoutFeedback>
    );
  }
}

DayNightSwitch.propTypes = {    
  selected:boolean,
  mode:0
};

DayNightSwitch.defaultProps = {
  selected:true,
  mode:0
}
const RNDayNightSwitch = requireNativeComponent('DayNightSwitch', DayNightSwitch);

export default DayNightSwitch;
