import React, { Component } from 'react'; 
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
export default class StopWatch extends Component {
 
  constructor(props) {
    super(props);
 
    this.state = {
      timer: null,
      minutes_Counter: '00',
      seconds_Counter: '00',
      startDisable: false
    }
  }
 
  componentWillUnmount() {
    clearInterval(this.state.timer);
  }
 
  start = () => {
 
    let timer = setInterval(() => {
 
      var num = (Number(this.state.seconds_Counter) + 1).toString(),
        count = this.state.minutes_Counter;
 
      if (Number(this.state.seconds_Counter) == 59) {
        count = (Number(this.state.minutes_Counter) + 1).toString();
        num = '00';
      }
 
      this.setState({
        minutes_Counter: count.length == 1 ? '0' + count : count,
        seconds_Counter: num.length == 1 ? '0' + num : num
      });
    }, 1000);
    this.setState({ timer });
 
    this.setState({startDisable : true})
  }
 
 
  stop = () => {
    clearInterval(this.state.timer);
    this.setState({startDisable : false})
  }
 
 
  clear = () => {
    this.setState({
      timer: null,
      minutes_Counter: '00',
      seconds_Counter: '00',
    });
  }

  destroy = () => {
    this.clear();
    this.stop();
  }
 
  render() {
 
    return (
      <View {...this.props}>
        <Text style={{fontSize:12,fontWeight:'bold',color:'grey'}}>{this.state.minutes_Counter} : {this.state.seconds_Counter}</Text>
      </View>
 
    );
  }
}