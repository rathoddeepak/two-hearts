import React, { Component } from 'react';
import {
	View,
	PanResponder,
	StyleSheet,	
	Animated,
	Image,
	Text
} from 'react-native';
import constants from 'libs/constants';
import * as Animatable from 'react-native-animatable'
import InteractUser from 'ydc/InteractUser'
const RADIUS = 50;
export default class PictureLock extends Component {
	constructor(props) {
		super(props);
		this.state = {
			locations:[],
			tapCount:0,
			height:constants.maxHeight2(),
			width:constants.width()
		};		
		this.panResponder = PanResponder.create({		    
		    onStartShouldSetPanResponder: () => true,
		    onPanResponderStart: ({nativeEvent}) => {		      
		      this.handleTap({x:nativeEvent.pageX, y:nativeEvent.pageY});
		      return true;
		    }	    
		});
		this.tapBall = [];
	}
	componentDidMount(){
		InteractUser.getLockParams(data => {
		    try{	
				let json = JSON.parse(data);
				if(typeof json == 'object' && json?.loc){					
					this.setState({picture:json.pic,locations:json.loc});					
				}else {
					this.props.onError();
				}
			}catch(err){
				this.props.onError();
			}
		})
	}
	handleTap({x,y}){
		let tapCount = this.state.tapCount;
		const maxWidth = this.state.width;
		const maxHeight = this.state.height;
		const checkLocation = this.state.locations[tapCount];		
		
		const xLoc = checkLocation.x * maxWidth;
		const yLoc = checkLocation.y * maxHeight;
		
		const maxX = xLoc + RADIUS;
		const minX = xLoc - RADIUS;

		const maxY = yLoc + RADIUS;
		const minY = yLoc - RADIUS;

		let flag = 0;

		if(x >= minX && x <= maxX)flag++;					
		if(y >= minY && y <= maxY)flag++;

		if(flag == 2){
			tapCount++;
			if(tapCount == 3){
				this.props.onUnlock();
			}else{
				this.tapIndicator.show(tapCount, "#4caf50");
				this.setState({tapCount})
			}			
		}else{		    
			this.tapIndicator.show("!", "red");
			this.setState({tapCount:0}, () => {
				setTimeout(() => {
					this.tapIndicator.hide();
				}, 500)
			})
		}
	}
	dispatch = (locations) => {
		const w = this.state.width;
		const h = this.state.height;
		let counter = 0;
		locations.forEach(({x, y}) => {
			const xLoc = (x * w);
			const yLoc = (y * h);
			this.tapBall[counter]?.show({x: xLoc, y: yLoc});
			counter++;
		})		
	}
	render() {
		return (
			<View style={sty.container} onLayout={this.onLayout}  {...this.panResponder.panHandlers}>
			   <Image style={{flex:1}} source={{uri:this.state.picture}} />
			   <TapIndicator ref={ref => this.tapIndicator = ref} />
			   <TapBall ref={ref => this.tapBall[0] = ref} count={1} />
			   <TapBall ref={ref => this.tapBall[1] = ref} count={2} />
			   <TapBall ref={ref => this.tapBall[2] = ref} count={3} />
			</View>
		)
	}
}

class TapBall extends Component {	
	show = ({x , y}) => {					
		this.tb?.transitionTo({opacity:1,translateX:x - RADIUS/2, translateY:y - RADIUS/2, scale:1});
	}
	hide = () => {
		this.tb?.transitionTo({scale:0});
	}
	render() {
		return (
			<Animatable.View ref={ref => this.tb = ref} style={sty.tapBall}>
			 <Text style={sty.tapText}>{this.props.count}</Text>
			</Animatable.View>
		)
	}
}

class TapIndicator extends Component {
	constructor(props){
		super(props);
		this.state = {
			scale:new Animated.Value(0),
			text:"",
			bg:'transparent'
		}
	}
	show = (text, bg) => {
		this.setState({text,bg});		
		if(this.state.scale == 1){
			this.indicator?.zoomOut();
			setTimeout(() => {
				this.indicator?.zoomIn();
			}, 150);			
		}else{
			this.indicator?.zoomIn();
			this.setState({scale:1})
		}				
	}
	hide = () => {		
		this.indicator?.zoomOut();
		this.setState({scale:0})
	}
	render() {
		return (
			<Animatable.View ref={ref => this.indicator = ref} duration={150} style={{position:'absolute', top:40, right:40}}>
			 <View style={{backgroundColor:this.state.bg,width:30,height:30,borderRadius:60,justifyContent:'center',alignItems:'center',elvation:10}}>
			   <Text style={{fontSize:15,color:'white'}}>{this.state.text}</Text>
			 </View>
			</Animatable.View>
		)
	}
}
const sty = StyleSheet.create({
	container: {height:constants.maxHeight2(),width:constants.width()},	
	tapBall:{
		height:50,
		width:50,
		borderRadius:100,
		backgroundColor:'#1D3B8Db4',
		position:'absolute',
		justifyContent:'center',
		alignItems:'center',
		opacity:0
	}
})