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

class WaveImage extends Component {  
  constructor(props){
    super(props)
    this.state = {
      level:1000
    }
  }
  setLevel = (level) => {
    this.setState({level})
  }
  render() {
    const {
        source,
        amplitude,
        level,
        waveLength,
        speed,
        indeterminate,
        style,
        resizeMode
    } = this.props;
    return (
      <View style={[style, {overflow:'hidden'}]}>
      <YDCWaveImage
          style={{flex:1}}
          source={source}          
          level={this.state.level}          
      />
      </View>
    );
  }
}


WaveImage.propTypes = {  
  amplitude:integer,
  level:integer,
  waveLength:integer,
  speed:integer,
  indeterminate:boolean
};

WaveImage.defaultProps = {
  amplitude:5,
  level:1000,
  waveLength:5,
  speed:5,
  indeterminate:false    
}
const YDCWaveImage = requireNativeComponent('WaveImage', WaveImage);

export default WaveImage;
