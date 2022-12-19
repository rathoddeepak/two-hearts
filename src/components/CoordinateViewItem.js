import React from 'react';
import {
	View,
	findNodeHandle,
	UIManager,
	PixelRatio,
	Animated,
	TouchableWithoutFeedback,
	Image
} from 'react-native';
import {	
	CheckBoxT,
	AndroidUtilities
} from 'ydc';
import constants from 'libs/constants';
import {ImageView, s, HeartStateViewer} from 'components';
import ImageViewer from 'ydc/imageview';
import * as Animtable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
export default class CoordinateViewItem extends React.Component {
	constructor(props){
		super(props)
		this.state = {
			scale:new Animated.Value(1),
			selected:false,
			heartState:this.props.heartState,
			cover:this.props.cover,
			count:-1		
		}
	}
	toggle  = () => {
		if(this.state.selected){
			this.deselect();
		}else{
			this.select();
		}
	}
	select = () => {				
		Animated.timing(this.state.scale, {
			toValue:0.8,
			duration:300,
			useNativeDriver:true
		}).start();
		this.setState({selected:true});		
		this.checkBox?.select();
	}
	setHeart = (heartState) => {				
		this.setState({heartState})
	}
	deselect = (manual = false) => {		
		Animated.timing(this.state.scale, {
			toValue:1,
			duration:300,
			useNativeDriver:true
		}).start();
		this.setState({selected:false,count:-1});		
		if(manual)this.checkBox?.deselect();
	}
	onCheckPress(selected){
		this.setState({selected});
		this.toggle();
		this.props.checkBoxPress(selected);
	}
	onSelectionAttempt = () => {
		if(!this.state.selected){			
			this.setState({selected:true})
			this.select();
			this.props.onSelectionAttempt();
		}
	}
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
	    ImageViewer.dispatchCords(index, data);	    
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
	    ImageViewer.showLayout(config['index'], config, data);	    
	 });      
	}
	addC = () => {
		this.setState({cover: true});
	}
	removeC = () => {
		console.log('remove C called ->' + this.props.index);
		this.setState({cover: false});
	}
	render(){
		const {
			scale,
			heartState,
			cover
		} = this.state;
		const {
			width,
			height,
			borderRadius,
			url,			
			blurHash,
			selectionEnabled,
			index,
			type			
		} = this.props;
		const source = type == "video" ? url.replace("mp4", "jpg") : url;
		return (
			<View {...this.props} ref={"ordinateMark"} onLayout={({nativeEvent}) => {
                  var view = this.refs['ordinateMark'];
                  var handle = findNodeHandle(view);
                  UIManager.measure(handle, (x, y, width, height, pageX, pageY) => {});
                }}>
                <TouchableWithoutFeedback delayLongPress={200} rippleContainerBorderRadius={borderRadius} onPress={this.props.onPress} onLongPress={this.onSelectionAttempt} >
				<View><Animated.View style={[{
					width,
					height,
					borderRadius,
					backgroundColor:'white',
					transform:[
					 	{scale:scale}
				 	]
				}, this.props.style]}>
				<ImageView
				 borderRadius={borderRadius}
				 source={source}
				 blurHash={blurHash}
				 borderRadius={0}
				 style={{
				 	flex:1			 	
				 }}
				/>		
				</Animated.View>
				
				<Animtable.View ref={ref => this.checkButton = ref} style={{
					position:'absolute',
					right:7,
					top:7
				}}>			
				<CheckBoxT
				  onChange={bool => this.onCheckPress(bool)}
				  checked={this.state.selected}
				  type={6} 
				  ref={ref => (this.checkBox) = ref}
				  size={AndroidUtilities.fv(23)} 					
				  colorMap = {{
				    background:s[config.theme_s].color,
				    background2:"#00000000",
				    check:"white",
				    disabled:"yellow"
				  }}
				/>
				</Animtable.View>
				
				</View></TouchableWithoutFeedback>				
				{heartState != 3 ? 
					<View style={{
						height:35,width:35,
						position:'absolute',
						bottom:0,
						flexDirection:'row',
						right:0,
						alignItems:'center',
						justifyContent:'center',
						backgroundColor:'#000000b4',
						borderTopLeftRadius:10,
						borderTopRightRadius:10,
						borderBottomLeftRadius:10
					}}>
					 <HeartStateViewer
					  heartState={heartState}					  
                      csize={40}
                      size={25}
					 />
					</View>
				: null}
				{cover ? 
					<View style={{
						height:35,width:35,
						position:'absolute',
						bottom:0,
						flexDirection:'row',
						left:35,
						alignItems:'center',
						justifyContent:'center',
						backgroundColor:'#000000b4',
						borderTopLeftRadius:10,
						borderTopRightRadius:10						
					}}>
					 <View style={{width:40,height:40,justifyContent:"center",alignItems:"center"}}>
						 <Image style={{width:20,height:20}} source={require("res/images/bookmark.png")} tintColor={"#fff"} />
					 </View>
					</View>
				: null}
				{type == "video" ?
					<View style={{
						height:35,width:35,
						position:'absolute',
						bottom:0,
						flexDirection:'row',
						alignItems:'center',
						justifyContent:'center',
						backgroundColor:'#000000b4',
						borderTopLeftRadius:10,
						borderTopRightRadius:10,
						borderBottomRightRadius:10						
					}}>
						<View style={{width:40,height:40,justifyContent:"center",alignItems:"center"}}>
						 <Image style={{width:20,height:20}} source={require("res/images/video.png")} tintColor={"#fff"} />
						</View>
					</View>
				: null}				
			</View>
		)
	}
}