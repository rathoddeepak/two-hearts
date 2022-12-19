import React, { Component } from 'react';
import {Modal,BackHandler,TouchableOpacity,View} from 'react-native';
import InteractUser from 'ydc/InteractUser';
import {
	PinLock,
	PatternLock,
	PictureLock
} from 'components/locks'
import contants from 'libs/constants';
export default class LockModal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			model:false,
			lockMode:-1
		}
	}
	componentDidMount(){
		this.addListener();
		InteractUser.onShakeToggle((add) => {
			if(add)this.addListener();
			else InteractUser.removeOnShake();
	    });
	}
	show = () => {
		InteractUser.removeOnShake();
		this.setState({model:true});
	}
	close = () => {
		this.addListener();
		this.setState({model:false});
	}
	addListener = () => {
		InteractUser.onShake((mode) => {
	      if(mode == -1){
	      	InteractUser.removeOnShake();
	      	return;
	      }else{
	      	this.setState({mode}, () => {
	      		this.setState({model:true});
	      	})
	      }	      
	    });
	}
	closeApp = () => {
		BackHandler.exitApp();
	}
	
	render() {
		const mode = this.state.mode;
		return (
			<Modal visible={this.state.model} animationType="fade" statusBarTranslucent={mode != 0} onRequestClose={this.closeApp}>
			 {mode == 0 ?
			 	<PictureLock onUnlock={this.close} />
			 : null}
			 {mode == 1 ?
			 	<PatternLock onUnlock={this.close} />
			 : null}
			 {mode == 2 ?
			 	<PinLock onUnlock={this.close} lockMode={2} text="TwoHearts" />
			 : null}
			</Modal>
		)
	}
}