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

class MessagesList extends Component {  
  constructor(props){
    super(props)
    this.state = {      
      addToStart:{insert:false},
      backgroundColor:"white"
    }
  }
  addToStart = (text) => {    
    this.setState({addToStart:{insert:true,text}})
  }
  render() {
    const {
        initialize
    } = this.props;
    const {
      addToStart,
      backgroundColor
    } = this.state;
    return (      
      <YdcMessagesList
        {...this.props}        
        addToStart={addToStart}          
        initialize={initialize}
      />         
    );
  }
}


MessagesList.propTypes = {  
  initialize:string
};

MessagesList.defaultProps = {
  initialize:"sdfsf"
}
const YdcMessagesList = requireNativeComponent('MessagesList', MessagesList);

export default MessagesList;
