import React from 'react';
import {
	View,
	Text,
	Animated
} from 'react-native';
import s from '../theme';
import {AndroidUtilities} from 'ydc'
import * as Animatable from 'react-native-animatable';
const ProgressBarWidth = AndroidUtilities.wp("23%");
const StepSize = AndroidUtilities.wp("10.55%");

export default class StageAdapter extends React.Component {
	constructor(props){
		super(props)
		this.state = {
			currentIdx:this.props.currentIdx
		},
		this.stepActor = [];
		this.progressBar = [];
	}
	componentDidMount(){
		switch(this.props.currentIdx){
			case 0:
			 this.stepActor[0].showStep();
			 this.stepActor[1].showInstantDim();
             this.stepActor[2].showInstantDim();
			 break;
			case 1:
			 this.stepActor[0].showInstant();
			 this.stepActor[1].showStep();
			 this.progressBar[0].showbar();
			 break;
			case 2:
			 this.stepActor[0].showInstant();
			 this.stepActor[1].showInstant();
			 this.stepActor[2].showStep();
			 this.progressBar[0].showInstant()
			 this.progressBar[1].showbar()	
			 break;		 
		}
	}
	rollOut = (id) => {		
		
	}
	render(){
		const {
			height,
			width,
			currentIdx
		} = this.props;
		return (
			<Animatable.View animation="fadeIn" style={{width,height,	flexDirection:'row',justifyContent:'center',alignItems:'center'}}>			 
			 <StepActor currentIdx={currentIdx} idx={0} ref={ref => this.stepActor[0] = ref} />
			 <ProgressBar ref={ref => this.progressBar[0] = ref} />
			 <StepActor currentIdx={currentIdx} idx={1} ref={ref => this.stepActor[1] = ref} />
			 <ProgressBar ref={ref => this.progressBar[1] = ref} />
			 <StepActor currentIdx={currentIdx} idx={2} ref={ref => this.stepActor[2] = ref} />
			</Animatable.View>
		)
	}
}


class StepActor extends React.Component { 
	constructor(props){
		super(props)
		this.state = {
			opacity:new Animated.Value(0.5)
		}
	}
    showStep(){
    	Animated.timing(this.state.opacity, {
    		toValue:1,
    		duration:1000,
    		useNativeDriver:true
    	}).start();   	
    }
    showInstant(){
    	this.state.opacity.setValue(1);	
    }
    showInstantDim(){
    	this.state.opacity.setValue(0.5);	
    }
    hideStep(){
    	Animated.timing(this.state.opacity, {
    		toValue:0.5,
    		duration:1000,
    		useNativeDriver:true
    	}).start();
    }
	render(){
		return(
			<Animated.View style={{width:StepSize,height:StepSize,opacity:this.state.opacity,backgroundColor:'white',borderRadius:StepSize * 2,borderWidth:1,borderColor:s[config.theme_s].light,justifyContent:'center',alignItems:'center'}}>			 
				<Text style={{fontSize:AndroidUtilities.fv(18),color:s[config.theme_s].color}}>{this.props.idx + 1}</Text>
			</Animated.View>
		)
	}
}

class ProgressBar extends React.Component { 
	constructor(props){
		super(props)
		this.state = {
			progressBarWidth:new Animated.Value(0)
		}
	}
	showInstant = () => {
    	this.state.progressBarWidth.setValue(ProgressBarWidth);
    }
    showbar = () => {
    	Animated.timing(this.state.progressBarWidth, {
    		toValue:ProgressBarWidth,
    		duration:1000,
    		useNativeDriver:false
    	}).start();
    }

    hideBar = () => {
    	Animated.timing(this.state.progressBarWidth, {
    		toValue:0,
    		duration:1000,
    		useNativeDriver:false
    	}).start();
    }
	render(){
		const {
			progressBarWidth
		} = this.state;
		return(
			<View style={{
				width:ProgressBarWidth,
				height:2.5,
				backgroundColor:s[config.theme_s].dim
			}}>
				<Animated.View style={{
					width:progressBarWidth,
					height:2.5,
					backgroundColor:"#fff"
				}} />
			</View>
		)
	}
}