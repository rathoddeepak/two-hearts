import React from 'react';
import {
	View,
	Text,	
	Animated,
	Modal,
	ProgressBarAndroid,
	TouchableOpacity,
	ToastAndroid
} from 'react-native';
export default class ProgressModel extends React.Component {
	constructor(props){
		super(props)
		this.state = {
			showModal:false,
			progress:0,
			modelbg:new Animated.Value(0),
			viewScale:new Animated.Value(0)
		}
	}	
	progress = (val) => {
	   this.setState({progress:val})
	}
	hide = () => {
       Animated.parallel([
       	   Animated.timing(this.state.modelbg,{
	       	toValue:0,
	       	useNativeDriver:false
	       }),
	       Animated.spring(this.state.viewScale,{
	       	toValue:0,
	       	friction:10,
	       	useNativeDriver:false
	       })
       ]).start(() => {
       	this.setState({showModal:false});
       });
	}
	show = () => {
      this.setState({showModal:true,progress:0})
      Animated.parallel([
       	   Animated.timing(this.state.modelbg,{
	       	toValue:1,
	       	useNativeDriver:false
	       }),
	       Animated.spring(this.state.viewScale,{
	       	toValue:1,
	       	friction:10,
	       	useNativeDriver:false
	       })
      ]).start();
	}
	cancelPress = () => {
	   this.props.onCancel();
	}
	render(){
	    const {progress} = this.state;
		const {			
			title
		} = this.props;
		var color = this.state.modelbg.interpolate({
	        inputRange: [0, 1],
	        outputRange: ['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.3)']
	    });
		return( 
		   <View>			
			<Modal transparent visible={this.state.showModal}>		
				<Animated.View style={{flex:1,backgroundColor:color, justifyContent:'center', alignItems:'center'}}>
				<Animated.View style={{borderRadius:10,elevation:10, justifyContent:'center', alignItems:'center',width:"80%",backgroundColor:'white',opacity:this.state.viewScale,transform:[{scale:this.state.viewScale}]}}>
	            <Text numberOfLines={1} style={{fontSize:16,width:"90%",marginTop:10,color:'#000',fontWeight:'bold',padding:5}}>Preparing Media</Text>
	                <ProgressBarAndroid
			          styleAttr="Horizontal"
			          indeterminate={progress > 0.1 ? false : true}
			          color="#0277BD"
			          progress={progress}
			          style={{width:'90%'}}
			        />
	             <Text numberOfLines={1} style={{fontSize:12,width:'90%',marginTop:5,color:'grey',padding:5}}>{parseInt(this.state.progress*100)}%</Text>
	             
	             <View style={{padding:10,width:"100%",alignItems:"flex-end", justifyContent:"flex-end",marginTop:5}}>
	              <TouchableOpacity style={{borderRadius:10,backgroundColor:'#DDE4F3',padding:10,margin:5}} onPress={this.cancelPress}>
	               <Text style={{fontSize:14,color:'#0277BD',fontWeight:'bold'}}>Cancel</Text>
	              </TouchableOpacity>
	             </View>
				</Animated.View>
				</Animated.View>	
			</Modal>		
		</View>	
		)
	}
}