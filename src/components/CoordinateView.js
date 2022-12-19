import React from 'react';
import {
	View,
	findNodeHandle,
	UIManager,
	PixelRatio
} from 'react-native';
import {
	ImageView
} from 'ydc';
export default class CoordinateView extends React.Component {
	getCoordinates = (resolve) => {
		   var view = this.refs['ordinateMark'];
		   var handle = findNodeHandle(view);
		   UIManager.measure(handle, (x, y, width, height, pageX, pageY) => {
		      resolve({x, y, width, height, pageX, pageY})
		   })
	}
	dispatchCords = (index, padding) => {  
	 var view = this.refs['ordinateMark'];
	 var handle = findNodeHandle(view);     
	 UIManager.measure(handle, (x, y, width, height, pageX, pageY) => {	    
    	let data = {          
	      x:isNaN(x) ? 0 : PixelRatio.getPixelSizeForLayoutSize(pageX) - padding + 0.00,
	      y:isNaN(y) ? constants.maxHeight2() : PixelRatio.getPixelSizeForLayoutSize(pageY) + 0.00,          
	    }	    
	    ImageView.dispatchCords(index, data);	    
	 });      
	}
	setHere = (config, padding) => {  
	 var view = this.refs['ordinateMark'];
	 var handle = findNodeHandle(view);     
	 UIManager.measure(handle, (x, y, width, height, pageX, pageY) => {        
	    let data = {          
	      x:PixelRatio.getPixelSizeForLayoutSize(pageX) - padding,
	      y:PixelRatio.getPixelSizeForLayoutSize(pageY),          
	    }        
	    ImageView.showLayout(config['index'], config, data);	    
	 });      
	}
	render(){
		return (
			<View {...this.props} ref={"ordinateMark"} onLayout={({nativeEvent}) => {
                  var view = this.refs['ordinateMark'];
                  var handle = findNodeHandle(view);
                  UIManager.measure(handle, (x, y, width, height, pageX, pageY) => {
                    
                  })
                }}>
                {this.props.children}
			</View>
		)
	}
}