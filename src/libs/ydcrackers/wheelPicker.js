import React, { Component } from 'react';
import {
  requireNativeComponent,
  UIManager,  
  ViewPropTypes,
  findNodeHandle,
  TouchableWithoutFeedback
} from 'react-native';
import {
 boolean,
 integer,
 string,
 array
} from 'prop-types';

class WheelPicker extends Component {
  constructor() {
    super();        
    this.state = {
      currentItem:0
    };
  }
  componentDidMount(){
    this.setState({
      currentItem:this.props.selectedItemPosition
    });
    this.wheelPickerHandle = findNodeHandle(this.wheelPickerRef);
  }

  setSelectedItem(item) {
    UIManager.dispatchViewManagerCommand(this.wheelPickerHandle, 0, [item]);
  }

  getSize(){
    return this.props.data.length;
  }

  getCurrentPosition = () => {
    return this.state.currentItem;
  }

  _onItemSelected = ({nativeEvent}) => {    
    this.setState({
      currentItem:nativeEvent.position
    })
    if(this.props.onItemSelected){
      this.props.onItemSelected(nativeEvent.position);
    }
  }
  render() {
  	const {
      setCyclic,
      setCurved,
      selectedItemPosition,
      data,
      selectedItemTextColor,
      itemTextColor,
      indicator,
      indicatorSize,
      indicatorColor,
      curtain,
      atmospheric,
      textAlign,
      onItemSelected
  	} = this.props;
    return (
      <RCTWheelPicker
        ref={(mv) => this.wheelPickerRef = mv}
        {...this.props}
        setCyclic={setCyclic}
        setCurved={setCurved}
        selectedItemPosition={selectedItemPosition}
        data={data}
        selectedItemTextColor={selectedItemTextColor}
        itemTextColor={itemTextColor}
        indicator={indicator}
        indicatorSize={indicatorSize}
        indicatorColor={indicatorColor}
        curtain={curtain}
        onItemSelected={this._onItemSelected}
        atmospheric={atmospheric}
        textAlign={textAlign}
      />
    );
  }
}

WheelPicker.propTypes = {  
  setCyclic:boolean,
  setCurved:boolean,
  selectedItemPosition:integer,
  data:array,
  selectedItemTextColor:string,
  itemTextColor:string,
  indicator:boolean,
  indicatorSize:integer,
  indicatorColor:string,
  curtain:boolean,
  atmospheric:boolean,
  textAlign:string,
  textSize:integer
};

WheelPicker.defaultProps = {
  setCyclic:false,
  setCurved:true,
  selectedItemPosition:0,
  textSize:60,
  data:["1","2","3","4","5","6","7","8"],
  selectedItemTextColor:"#000000",
  itemTextColor:"#9e9e9e",
  indicator:false,
  indicatorSize:80,
  indicatorColor:"#9e9e9e",
  curtain:false,
  atmospheric:false,
  textAlign:"center"  
}

const RCTWheelPicker = requireNativeComponent('YDCWheelPicker', WheelPicker);

export default WheelPicker;
