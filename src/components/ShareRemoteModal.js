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
import RNFetchBlob from 'rn-fetch-blob';
import Share from 'react-native-share'
let task = null;
const err = "Unable to share media!";
export default class ShareRemoteModal extends React.Component {
	constructor(props){
		super(props)
		this.state = {
			showModal:false,
			progress:0,
			modelbg:new Animated.Value(0),
			viewScale:new Animated.Value(0)
		}
	}
	shareItem = async (url, type) => {
		  //url = "https://file-examples-com.github.io/uploads/2017/04/file_example_MP4_1920_18MG.mp4";
		  //type = "video";
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
	      if(url == undefined){
		  	ToastAndroid.show(err + ' 1', ToastAndroid.SHORT);
		  	return;
		  }else if(type == undefined){
		  	ToastAndroid.show(err + " 2 ", ToastAndroid.SHORT);
		  	return;
		  }
		  task = RNFetchBlob.config({
		      fileCache : true,
		      appendExt: type == "video" ? 'mp4' : "jpg",
		  }).fetch('GET', url);
		  
		  task.then(async (res) => {		    	  
		    const shareOptions = {
		      title: 'Share Media',
		      url: 'file://'+res.path(),
		      failOnCancel: false,
		    };
		    try {
		      const ShareResponse = await Share.open(shareOptions);	      
		    } catch (error) {
		    	ToastAndroid.show(err, ToastAndroid.SHORT);
		    	return;
		    }
		    this.hide();
		  }).catch((err) => {
		        console.log(err)
		  });
		  task.progress((received, total) => {		  	
		  	this.setState({progress:received/total})		        
		  })	          
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
	cancelPress = () => {
	   if(task != null)
	   	  task.cancel((err) => {});
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