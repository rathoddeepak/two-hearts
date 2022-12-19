import React, {Component} from 'react';
import {
	View,
	Text,
	StatusBar,
	Image,
	DeviceEventEmitter,
	BackHandler,
	StyleSheet,	
} from 'react-native';
import {
	AndroidUtilities,	
	UploadManager,
	request,
	InteractUser
} from 'ydc';
import FastImage from 'react-native-fast-image';
import {
	s,
	Ripple,
	Icon,
	ImageView,
	ProgressBar
} from 'components';
import constants from 'libs/constants';
import moment from 'moment';
import Datastore from 'react-native-local-mongodb';
import * as Animatable from 'react-native-animatable';
const uploadItemWidth = constants.width2()/2;
const uploadItemHeight = AndroidUtilities.hps("8%");
const HomeScreenHeight = AndroidUtilities.hps("88%");
const HomeProfilerHeight = AndroidUtilities.hps("5.796%");
const ScreenHeight = AndroidUtilities.hps("93.796%");
const width = AndroidUtilities.wp("100%");
const btnHeight = AndroidUtilities.hp('4.5%');
const btnWidth = AndroidUtilities.wp('40.22%');
export default class Home extends Component {
	constructor(props){
		super(props)
		this._unsubscribe = this.props.navigation.addListener('focus', this.startTracker);
	    this._unsubscribe2 = this.props.navigation.addListener('blur', this.removeTracker);    		
	    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
	    this.state = {
	    	isOpened:false,
	    	mounted:true,
	    	image:'default',
	    	himg:'',
	    	resizedHeight:0
	    }
	}

	handleBackButtonClick() {		
		if(this.state.isOpened){
			this.setState({isOpened:false});
			InteractUser.closeEdit();
			return true;
		}else{
			return false;
		}
	}

	componentDidMount() {
	    InteractUser.startServices()
	    InteractUser.getPartnerId(id => {          
	      InteractUser.setupPartner({
	          uid:partner['fire_id'],
	          name:partner['full_name'],
	          profileThumb:"",
	          profileImage:config.siteUrl+partner['avatar'],
	          phoneNumber:partner['phone_no']
	      });
	    })	
	    StatusBar.setHidden(true);	    	
		InteractUser.getUserHome(homeData => {
			if(homeData.length > 0){
				const data = JSON.parse(homeData);
				const resizedHeight = data.height * (width/data.width);
				console.log()
				this.setState({
					himg:data.himg,
				    image:data.image,
				    resizedHeight:parseInt(resizedHeight)
				});
			}
		});
		UploadManager.initialCheck();
		BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);		
	}
	
	componentWillUnmount() {
	    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
	}

	startTracker = (e) => {	  
	  if(this.props.route.name == "Home")this.homeUploader?.startTracker();	  	  
	  this.setState({mounted:true}, () => {	  	
	  	this.checkHome();
	  });
	}

	checkHome = async () => {		
		if(this.state.isOpened && this.state.mounted)return;		
		try {			
			var res = await request.perform('home_handler', {params:JSON.stringify({
				user_id:user_id,
				relation_code:relation_code,
				request:"get_home"
			})},"albums", false);			
			if(res != 'fetch_error'){			
				if(res?.status == 200 && res.data.himg != this.state.himg){
					const resizedHeight = res.data.height * (width/res.data.width);
					this.setState({
						himg:res.data.himg,
					    image:res.data.image,
					    resizedHeight
					})					
					InteractUser.setUserHome(JSON.stringify(res.data))
			    }
			    this.r();
			}else{
				this.r();
			}
		}catch(err) {			   
			this.r();
		}
	}

	r = () => {
		if(this.state.mounted)setTimeout(() => this.checkHome(), 5000);
	}


	removeTracker = () => {	  
	  this.homeUploader?.removeTracker();
	  this.setState({mounted:false})	  	
	}	

	componentWillUnmount() {
	  this._unsubscribe();
	  this._unsubscribe2();
	}

	handePicker = () => {
		this.setState({isOpened:true}, () => {
			InteractUser.showBottomSheet({			
				hasOnlyContent:false,
				hideCameraTile:false,
				spanCount:3,
				alsoEdit:1,
				dontDismissOnSelect:true
			}).then(callback => {
			    this.setState({isOpened:false});
				this.handleUpload(callback);				
			});
		})	
	}

	handleUpload = (source) => {
	    //console.log("task_created for upload");
		var time = moment().unix();
		var itm = {
			server_params:`{"relation_code":${relation_code},"user_id":${user_id},"time":${time}}`,
			server_url:`${request.api_url()}home_handler`,
			source,
			width:0,
			height:0,
			type:0
		};		
		UploadManager.addProcess(itm);	
		setTimeout(() => {
			UploadManager.startProcess()
			this.r();
		});
	}

	render(){
	    const {
	    	image,
	    	himg,
	    	resizedHeight
	    } = this.state;
		return (
			<View style={{height:HomeScreenHeight,width,backgroundColor:"white"}}>
			{image == 'default' ? 
			<DHome addHome={this.handePicker} />
			:
			<ImageView
			  style={{
			  	height:HomeScreenHeight,			  	
			  	width,
			  	...constants.center()			  
			  }}
			  source={request.site_url()+image}
			  blurHash={himg}			  
			  imageHeight={resizedHeight}
			  backgroundColor='white'
			  resizeMode={'contain'}
			/>}
			 <Ripple onPress={this.handePicker} rippleContainerBorderRadius={100} style={{
			  position:'absolute',
			  bottom:3,
			  right:AndroidUtilities.fv(8),
			  borderRadius:100,
			  backgroundColor:s[config.theme_s].dim,
			  width:AndroidUtilities.fv(36),
			  height:AndroidUtilities.fv(36),
			  ...constants.center()
			 }}>
			  <Icon name="edit" color="white" size={AndroidUtilities.fv(18)} />
			 </Ripple>			 
			 <HomeUploader ref={ref => this.homeUploader = ref} />		 
			</View>
		)
	}
}

class DHome extends Component {
	render() {
		return (
			<View style={{width,height:HomeScreenHeight- 100,justifyContent:'center',alignItems:'center'}}>
			 <Animatable.View animation="tada" easing="ease-out" iterationCount="infinite">
			 <Icon name="heart" color="red" size={45} />
			 </Animatable.View>
			 <Text style={{fontSize:AndroidUtilities.fv(16),textAlign:'center',marginTop:AndroidUtilities.hp("4%"),alignSelf:'center'}}>
				 Let's upload your first Home
			 </Text>
			 <Text style={{fontSize:AndroidUtilities.fv(12),textAlign:'center',marginTop:AndroidUtilities.hp("1%"),width:'80%',alignSelf:'center'}}>
				Welcome to TwoHearts, this is your home, Home is a place where you upload your best image, with you partner.
			 </Text>

			 <Ripple rippleContainerBorderRadius={10} onPress={this.props.addHome} style={{width:btnWidth,height:btnHeight,borderRadius:10,alignItems:'center',justifyContent:'center',alignSelf:'center',marginTop:AndroidUtilities.hp("2%"),backgroundColor:s[config.theme_s].light}}>
			  <Text style={{
			  	fontSize:AndroidUtilities.fv(14),
			  	fontWeight:'bold',
			  	color:'white',		  	
			  }}>Upload Home</Text>
			 </Ripple>

			</View>
		)
	}
}
class HomeUploader extends Component {
	constructor(props){
		super(props)
		this.state = {
			uploadItem:{},
			mounted:false,
		    isUploading:false,
		    currentStatus:'waiting',
			prepareProgress:0,
			uploadProgress:0
		}
	}
	componentDidMount(){
  	  UploadManager.retriveUploads(0, uploadItems => {
        this.setState({
          isUploading:uploadItems.length > 0,
          uploadItem:uploadItems[0]
        })
      });
	}
	onCancelRequest = () => {
		var task_id = this.state.uploadItem.task_id;
		//console.log("delete")
		UploadManager.stopProcess(task_id);
	}
	startTracker = () => {		
	    this.setState({mounted:true})
	    setTimeout(() => {
	      UploadManager.retriveUploads(0, uploadItems => {	      	
	      	if(uploadItems.length > 0)
	      		this.setState({isUploading:true,uploadItem:uploadItems[0]})
	      	else
	      		this.setState({isUploading:false})
	      });
	      if(this.state.mounted)this.startTracker();
	    }, 1000);
	}
	removeTracker = () => {    
	    this.setState({mounted:false})    
	}	
	render(){
		const {
			batchItems,
			isUploading
		} = this.state;		
		if(isUploading){
			const {
				task_id,				
				uploaded,
				status,
				compress,
				main
			} = this.state.uploadItem;			
			return (
				<View style={{width:constants.width2(), alignSelf:'center',position:'absolute',bottom:0}}>
				<View style={sty.uploadItem}>
		              <View style={sty.uplItem}>
		               <Ripple onPress={this.onCancelRequest} >
		               <FastImage		               
		                style={{height:AndroidUtilities.fv(50),width:AndroidUtilities.fv(50),backgroundColor:'#9e9e9e',borderRadius:10}}
		                source={{uri:'file://'+main, cache:FastImage.cacheControl.web}}	                
		               />	               
		               <View style={sty.crossCont}>
		                <View style={sty.crossIcon}>
		                 <Icon name='close' size={AndroidUtilities.fv(10)} color="white" />
		                </View>
		               </View>
		               </Ripple>
		              </View>
		              <View style={sty.txtCont}>
		               {<Text numberOfLines={1} style={sty.txt}>Uploadating Home</Text>}
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
				</View>
			)
		}else{
			return (<View></View>)
		}
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