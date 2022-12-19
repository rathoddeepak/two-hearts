import React, { Component, useRef } from "react"
import Icon from "components/UI/Icon"
import s from "components/theme";
import { ImageBackground, SafeAreaView, StatusBar, Text, View } from "react-native";
import Pin from "./Pin";
import InteractUser from "ydc/InteractUser";
export default class PinLockEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      enteredPin:'',      
      showRemoveButton:false,
      clear:-1,
      toCompare:''
    }
  }
  componentDidMount(){
    if(this.props.lockMode == 2){
      InteractUser.getLockParams(data => {
          try{  
            let json = JSON.parse(data);
            if(typeof json == 'object')          
              this.setState({toCompare:json.p});         
            else
              this.props.onError();       
          }catch(err){
            this.props.onError();
          }
      })
    }    
  }
  setEnteredPin = (enteredPin) => {
    if (enteredPin.length > 0)this.setState({showRemoveButton:true})
    else this.setState({showRemoveButton:false});
    if(enteredPin.length === 6){
      if(this.props.lockMode == 2){        
        if(enteredPin == this.state.toCompare)
          this.props.onUnlock();          
        else
          this.setState({clear:this.state.clear == 2 ? 3 : 2});
      } else if(this.props.lockMode == true){
        this.props.onCompare(enteredPin == this.props.toCompare);
        this.setState({clear:this.state.clear == 2 ? 3 : 2});
      }else{
        this.setState({clear:this.state.clear == 2 ? 3 : 2});
        this.props.onPinEntered(enteredPin);
      }
    }
    this.setState({enteredPin})
  }
  render() {
    const {
      lockMode,
      text
    } = this.props;
    return (          
          <View          
            style={{ flex: 1, justifyContent: "center", alignItems: "center",backgroundColor:s[config.theme_s].color }}>
            <Text
              style={{
                paddingTop: 24,
                paddingBottom: 48,
                color: "rgba(255,255,255,0.7)",
                fontSize: lockMode == 2 ? 48 : 20,
              }}>
              {text}
            </Text>
            <Pin
              inputSize={24}
              ref={ref => this.pin = ref}
              pinLength={6}
              buttonSize={60}
              onValueChange={this.setEnteredPin}
              buttonAreaStyle={{
                marginTop: 24,
              }}
              inputAreaStyle={{
                marginBottom: 24,
              }}
              inputViewEmptyStyle={{
                backgroundColor: "transparent",
                borderWidth: 1,
                borderColor: "#FFF",
              }}
              inputViewFilledStyle={{
                backgroundColor: "#FFF",
              }}
              buttonViewStyle={{
                borderWidth: 1,
                borderColor: "#FFF",
              }}
              buttonTextStyle={{
                color: "#FFF",
              }}
              onButtonPress={key => {
                if (key === "custom_left") {
                  this.setState({clear:this.state.clear == 0 ? 1 : 0})
                }              
              }}
              clearText={this.state.clear}
              customLeftButton={this.state.showRemoveButton ? <Icon name="clear" size={36} color="#FFF" /> : undefined}            
            />
          </View>    
    )
  }  
}
