import React, {Component} from 'react';
import {
	View,
	Text,	
	FlatList,
	Image,
	UIManager,
	LayoutAnimation,
	StyleSheet
} from 'react-native';
import {
	AndroidUtilities,
	UploadManager,
	request
} from 'ydc';
import Icon from './UI/Icon';
import WaveImage from './WaveImage';
import ProgressBar from './ProgressBar';
import s from './theme';
import Ripple from './UI/Ripple';
import constants from 'libs/constants';
const uploadItemWidth = constants.width2()/2;
const uploadItemHeight = AndroidUtilities.hps("12%");
export default class UploadBatch extends Component {
	constructor(props){
		super(props)
		this.state = {
			batchItems:[]
		}
	}
	componentDidMount(){
  	  UploadManager.retriveUploads(-1, batchItems => {
        this.setState({
          batchItems
        })
      });    
      this.startTracker()  
	}
	startTracker = () => {    
	    this.setState({mounted:true})
	    setTimeout(() => {
	      UploadManager.retriveUploads(-1, batchItems => {	        
	        this.setState({
	          batchItems
	        })
	      });
	      if(this.state.mounted)this.startTracker();
	    }, 1000);
	}
	removeTracker = () => {    
	    this.setState({mounted:false})    
	}
	removeItem = (index) => {
		if (Platform.OS === 'android') {
			UIManager.setLayoutAnimationEnabledExperimental(true);
	    }    
	    LayoutAnimation.configureNext(constants.LayoutLinear());
	    var batchItems = this.state.batchItems;
	    if(batchItems.length == 1){
	    	batchItems = [];
	    }else{
	    	batchItems.splice(index, 1);
	    }	    
		this.setState({batchItems:batchItems});
	}
	render(){
		const {
			batchItems
		} = this.state;
		return (
			<View style={{width:constants.width2(), alignSelf:'center'}}>
			<FlatList 
		     contentContainerStyle={{maxHeight:uploadItemHeight*2,flexDirection:'column',flexWrap:'wrap'}}
		     data={batchItems}	
		     extraData={batchItems}		     
		     showsHorizontalScrollIndicator={true}
		     horizontal={true}
		     renderItem={({item,index}) =>	{return(		
				<UploadItem data={item} index={index} selfDestruct={() => this.removeItem(index)} />				
			 )}}
			 keyExtractor={(item, index) => index.toString()}
			 />
			</View>
		)
	}
}
class UploadItem extends Component {
	constructor(props){
		super(props);
		this.state = {
			currentStatus:'waiting',
			prepareProgress:0,
			uploadProgress:0
		}
		this.talkWithDelay = this.talkWithDelay.bind(this);
	}	
	talkWithDelay = (reason) => {		
		UploadManager.removeListener(this.props.data.task_id);
		setTimeout(() => {			
			this.props.selfDestruct();
		}, 2000);		
	}
	componentWillUnmount(){
		UploadManager.removeListener(this.props.data.task_id);
	}	
	onCancelRequest = () => {
		var task_id = this.props.data.task_id;
		this.setState({currentStatus:"Cancling"});
		UploadManager.stopProcess(task_id);
	}
	render(){
		const {
			task_id,			
			uploaded,
			status,
			compress,
			main
		} = this.props.data;		
		return (
			<View style={sty.uploadItem}>
	              <View style={sty.uplItem}>
	               <Ripple onPress={this.onCancelRequest} >
	               <WaveImage
	                height={AndroidUtilities.fv(50)} 
	                style={{height:AndroidUtilities.fv(50),width:AndroidUtilities.fv(50),backgroundColor:'#9e9e9e',borderRadius:10}}
	                source={'file://'+main}
	                progress={compress/1000}
	               />	               
	               <View style={sty.crossCont}>
	                <View style={sty.crossIcon}>
	                 <Icon name='close' size={AndroidUtilities.fv(10)} color="white" />
	                </View>
	               </View>

	               </Ripple>
	              </View>
	              <View style={sty.txtCont}>
	               {<Text numberOfLines={1} style={sty.txt}>{request.getFileName(main)}</Text>}
	               {status == 0 
	               ? <ProgressBar
	                  color="blue"
					  width={uploadItemWidth*65/100}
				      height={AndroidUtilities.fv(2)}
			          progress={uploaded}
	                 />
	               : <Text numberOfLines={1} style={sty.txtSmall}>{request.decodeStatus(status)}</Text>}
	              </View>
		    </View>
		)
	}
}

const sty = StyleSheet.create({
	uplItem:{width:'30%',height:'100%',justifyContent:'center', alignItems:'center'},
	crossCont:{height:AndroidUtilities.fv(50),width:AndroidUtilities.fv(50),justifyContent:'center',alignItems:'center',position:'absolute'},
	crossIcon:{height:AndroidUtilities.fv(25),width:AndroidUtilities.fv(25),justifyContent:'center',alignItems:'center',backgroundColor:'#000000b4',borderRadius:100},
	uploadItem:{width:uploadItemWidth,height:uploadItemHeight,flexDirection:'row',padding:AndroidUtilities.fv(5)},
	txtCont:{width:'70%',height:'100%',justifyContent:'center',paddingLeft:4},
	txt:{fontSize:AndroidUtilities.fv(10),color:'black',paddingLeft:AndroidUtilities.fv(2)},
	txtSmall:{fontSize:AndroidUtilities.fv(8),color:'grey',paddingLeft:AndroidUtilities.fv(2)}

})