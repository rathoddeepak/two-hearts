import React from 'react';
import {
	View,	
	Image,
	StyleSheet,
	Animated,
	Text
} from 'react-native';
import PropTypes from 'prop-types';
import FastImage from 'react-native-fast-image';
import { Blurhash } from 'react-native-blurhash';
export default class ImageView extends React.PureComponent {
	constructor(props){
		super(props)
		this.state = {			
			imageLoaded:false,
			hideBlur:false,
			error:false,
			blurOpacity:new Animated.Value(1)
		}
	}
	onError = (nativeEvent) => {
		this.setState({
			error:true,
			hideBlur:false			
		})
	}
	onLoadEnd = () => {
		if(!this.state.error){
			Animated.timing(this.state.blurOpacity, {
				toValue:0,
				duration:200,
				useNativeDriver:false
			}).start(() => {
				this.setState({hideBlur:true});
			});
		}
	}
	render(){
		const {
			thumbnail,
			blurHash,
			source,
			style,
			borderRadius,
			imageHeight,
			backgroundColor,
			resizeMode,
			cache
		} = this.props;
		const {
			imageLoaded,
			blurOpacity,
			error,
			hideBlur
		} = this.state;	
		let br = borderRadius === undefined ? 0 : borderRadius;
		return (
			<View style={[{backgroundColor:backgroundColor,overflow:'hidden',borderRadius:br},style]}>			
			  <FastImage
				//onLoadStart={this.onLoadStart}
				//onLoad={this.onLoad}
				onError={this.onError}
				resizeMode={resizeMode}
				onLoadEnd={this.onLoadEnd}			  
				style={[style,{
				    height:'100%',width:'100%',	position: "relative",overflow: "hidden"
				}]}
				source={{uri:source, cache,}}
			 />
			 {hideBlur ? null :
			 	<Animated.View style={{height:'100%',width:'100%',backgroundColor:backgroundColor,justifyContent:'center',position:"absolute",overflow: "hidden",top:0,opacity:blurOpacity}}>
				 <Blurhash
			      blurhash={blurHash}
			      decodeAsync
			      style={{height:imageHeight,width:'100%'}}
			     />		 
			    </Animated.View>}
			 {error ? 
			 	<View style={[{height:'100%',width:'100%',	position: "absolute",overflow: "hidden",zIndex:10,justifyContent:"center",alignItems:"center"}], style}>
				    <Text style={{fontSize:12,color:"#fff", width:'100%',textAlign:"center"}}>Error loading!</Text>
			 	</View>
			 : null}
			</View>
		)
	}
}
ImageView.propTypes = {
	thumbnail:PropTypes.string,
	blurHash:PropTypes.string,
	source:PropTypes.string.isRequired,
	style:PropTypes.object,
	borderRadius:PropTypes.integer,
	resizeMode:PropTypes.string,
	imageHeight:PropTypes.any,
	cache:PropTypes.any,
	backgroundColor:PropTypes.string
}

ImageView.defaultProps = {
	thumbnail:'',
	blurHash:'LEHV6nWB2yk8pyo0adR*.7kCMdnj',	
	style:{},
	borderRadius:0,
	resizeMode:'cover',
	imageHeight:'100%',
	cache:FastImage.cacheControl.immutable,
	backgroundColor:'#f2f2f2'
}

const styles = StyleSheet.create({
	fix1: {
	    position: "relative"
	},
	fix2: {
	    position: "absolute",
	    borderWidth: StyleSheet.hairlineWidth,
	    borderColor: "transparent",
	    width: "100%",
	    height: "100%",	    
	    zIndex: 4
	}
})