import React, { Component } from 'react';
import {View,Dimensions} from 'react-native';
import Pattern from './Pattern';
import LinearGradient from "react-native-linear-gradient";
import InteractUser from "ydc/InteractUser";
import s from "components/theme";
const {width, height} = Dimensions.get('window');
const PATTERN_CONTAINER_HEIGHT = height / 2;
const PATTERN_CONTAINER_WIDTH = width;
const PATTERN_DIMENSION = 3;
export default class PatternLock extends Component {
	constructor(props) {
		super(props);
		this.state = {
			correctPattern:[]
		}
	}
	componentDidMount(){
		InteractUser.getLockParams(data => {
		    try{	
				let json = JSON.parse(data);
				if(typeof json == 'object')					
					this.setState({correctPattern:json.p});					
				else
					this.props.onError();				
			}catch(err){
				this.props.onError();
			}
		})
	}
	render() {
		return (
			<View style={{flex: 1,justifyContent: 'center',alignItems: 'center',backgroundColor:s[config.theme_s].color}}>
			    <Pattern
	              containerDimension={PATTERN_DIMENSION}
	              containerWidth={PATTERN_CONTAINER_WIDTH}
	              containerHeight={PATTERN_CONTAINER_HEIGHT}
	              correctPattern={this.state.correctPattern}
	              hint="Please Draw Your Pattern"
	              errorMessage="Wrong Pattern"
	              onPatternMatch={this.props.onUnlock}
	              onPatternNotMatch={() => {}}
	              lockMode
	              fromEditor={false}
	            />
			</View>
		)
	}
}