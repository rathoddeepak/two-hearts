import React, { Component} from 'react';
import {
	View,
	Text,
	ScrollView,
	StyleSheet,
	TouchableNativeFeedback,
	ImageBackground,
	TextInput,
	Keyboard,
	BackHandler
} from 'react-native';
import {
	Icon,
	Ripple,
	s,
	ProgressModel
} from 'components';
import {
	request,
	Dimensions,
	InteractUser,
	UploadManager	
} from 'ydc';
import constants from 'libs/constants';
import GlobalHandler from 'res/GlobalHandler'
const lightColor = "#649FE421";
const screenHeight = constants.maxHeight2();
export default class EditProfile extends Component {
	constructor(props) {
		super(props);
		this.state = {
			full_name:user['full_name'],
			about:user['about'],
			avatar:request.site_url()+user['avatar'],
			cover:request.site_url()+user['cover'],
			editScreen:screenHeight,
			uploadId:-1,
			isOpened:false
		}
		this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
	}	
	componentDidMount () {
	    UploadManager.addListener("MediaGlobal", (res) => {	    	
	    	console.log(res)
			if(this.state.uploadId != -1 && res?.task_id == this.state.uploadId){
			  switch(res.type){
			  	case "progress":
			  	 this.progressModel.progress(res.progress/100);
			  	break;
			  	case "error":
			  	 this.progressModel.hide();
			  	 request.pop('Error while updating!');
			  	break;
			  	case "completed":
			  	 this.progressModel.hide();
			  	 this.checkResponse(res.response_message);
			  	break;
			  	case "cancled":
			  	 this.progressModel.hide();
			  	break;
			  }
			}
		})   	
		this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
	    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
	    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
	}
	componentWillUnmount(){    
		Keyboard.removeListener('keyboardDidShow', this._keyboardDidShow);
		Keyboard.removeListener('keyboardDidHide', this._keyboardDidHide);
		if(this.state.uploadId != -1)UploadManager.removeListener(this.state.uploadId);	
		BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
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
	_keyboardDidShow = ({endCoordinates}) => {    
		let temp = screenHeight - endCoordinates.height;
		this.setState({editScreen:temp})
	}
	_keyboardDidHide = (e) => {	
		this.setState({editScreen:screenHeight})
	}
	handlePick = (alsoEdit) => {
	    this.setState({isOpened:true}, () => {
	    	InteractUser.showBottomSheet({			
				hasOnlyContent:false,
				hideCameraTile:false,
				spanCount:3,
				alsoEdit,
				dontDismissOnSelect:true
			}).then(callback => {
			    this.setState({isOpened:false});
				this.handleUpload(callback, alsoEdit == 2);
			});	
		})			
	}
	handleUpload = (url, isAvatar) => {
		this.progressModel.show();
		var obj = {width:0,height:0,type:constants.OTHER1()};
		var request = isAvatar ? "update_avatar" : "update_cover";
		obj["source"] = url;
		obj["server_params"] = `{"request":"${request}","caption":"a","relation_code":${relation_code},"user_id":${user_id}}`;
		obj["server_url"] = `${config.apiUrl}user_profile`;
		UploadManager.addProcessCallback(obj, uploadId => {			
			this.setState({uploadId:uploadId + "cb"})
			UploadManager.startProcess();			
		});
	}
	handleCancel = () => {
		UploadManager.stopProcess(this.state.uploadId);
		this.progressModel.hide();
	}
	checkResponse = (response) => {
		var err = "Error while updating";
		try {
			var res = JSON.parse(response);
			var data = res.data;
			if(res?.status == 200){
				let usr = user;
				if(data?.cover){
					usr.cover = data.cover;
					usr.hcover = data.hcover;
					GlobalHandler.setUser2(usr);
					this.setState({cover:request.site_url()+data.cover})
				}
				if(data?.avatar){
					usr.avatar = data.avatar;
					usr.hprofile = data.hprofile;
					GlobalHandler.setUser2(usr);
					this.setState({avatar:request.site_url()+data.avatar})
				}				
			}else{				
				request.pop(err);
			}
		} catch (e) {		    
			request.pop(err);		
		}
	}

	updateData = async () => {		
		let full_name = request.removeSpaces(this.state.full_name);
		let about = this.state.about;		
		if(!request.isValidName(full_name)){			
			request.pop("Please enter valid name!");
			return;
		}else if(request.countWords(full_name) < 2){
			request.pop("Please enter your surname!");
			return;
		}else if(this.state.about.length > 150){
			request.pop("About too long!");
			return;
		}
		this.loading?.show();
		var res = await request.perform('user_handler', {			
			user_id,
			relation_code,
			about,
			full_name,
			request:"update_user"
		},"prms", false);
		if(res)this.loading?.hide();		
		if(res != 'fetch_error' && typeof res == 'object' && res.status == 200){						
			let usr = user;
			usr.full_name = full_name;
			usr.about = about;
			GlobalHandler.setUser2(usr);
			request.pop('User updated successfully!');
		}else{
			request.pop('Unable to update user!');
		}
	}
	render() {
		const {
			full_name,
			about,
			avatar,
			cover,
			editScreen
		} = this.state;
		return (
			<View style={[sty.container, {height:editScreen}]}><ScrollView>
			    <View style={sty.header}>
		          <View style={{height:'100%',justifyContent:'center'}}>      
		              <View style={{width:'70%',flexDirection:'row'}}>
		                <Ripple onPress={() => this.props.navigation.goBack()}>
		                 <Icon name="back" size={30} color="#5281B9" style={s.p5} />
		                </Ripple>
		                 <Text style={{fontFamily:'sans-serif-light',fontSize:22,fontWeight:'bold',paddingLeft:10}}>Edit User</Text>
		              </View>                                     
		          </View>
		          <View style={{position:'absolute',top:0,height:60,right:0}}>
		            <View style={{height:60,width:60,alignItems:'flex-end',justifyContent:'center'}}>          
		             <Ripple onPress={this.updateData}><View style={{width:40,height:40,borderRadius:100,justifyContent:'center',alignItems:'center',backgroundColor:lightColor}}>
		               <Icon name="tick" size={23} color="#5281B9" />
		                 </View></Ripple>
		            </View>
		          </View>
		        </View>
				<View style={sty.cover}>
	                 <ImageBackground                 
	                  source={{uri:cover}}
	                  style={sty.image}
	                 >
	                 <TouchableNativeFeedback onPress={() => this.handlePick(3)}><View style={sty.coverO}>
	                 <Text style={sty.text}>Change Cover</Text>
	                 </View></TouchableNativeFeedback>
	                 </ImageBackground>
	            </View>

	            <View style={sty.avatar}>
	                 <ImageBackground           
	                  borderRadius={10}      
	                  source={{uri:avatar}}
	                  style={sty.avtI}
	                 >
	                 <TouchableNativeFeedback onPress={() => this.handlePick(2)}><View style={sty.avatarO}>
	                 <Text style={sty.text}>Change Avatar</Text>
	                 </View></TouchableNativeFeedback>
	                 </ImageBackground>
	            </View>

	            <TextInput
	                style={sty.input}
	                placeholderColor="#f1f1f1"
	                placeholder="Full Name"                               
	                selectionColor="#0000003d"
	                autoCapitalize="none"
	                onChangeText={full_name => this.setState({full_name})}
	                value={full_name}
	            />

	            <TextInput
	                style={[sty.input, {textAlignVertical: 'top'}]}
	                placeholderColor="#f1f1f1"
	                placeholder="About"
	                multiline
	                numberOfLines={4}
	                maxLength={350}
	                selectionColor="#0000003d"
	                onChangeText={about => this.setState({about})}
	                value={about}
	            />

	            <TextInput
	                style={[sty.input, {backgroundColor:'#f2f2f2'}]}
	                placeholderColor="#f1f1f1"
	                placeholder="Phone number"
	                selectionColor="#0000003d"
	                disabled
	                autoCapitalize="none"	                
	                value={user['phone_no']}
	            />         
	            <ProgressModel ref={ref => this.progressModel = ref} onCancel={this.handleCancel} />

			</ScrollView></View>
		)
	}
}

const sty = StyleSheet.create({
  container:{width:constants.width(),backgroundColor:'white'},
  input:{fontWeight:'bold',color:'black',fontSize:16,padding:10,margin:10,width:'80%',alignSelf:'center',borderRadius:8,borderColor:'#f2f2f2',borderWidth:1},
  header:{marginTop:Dimensions.get("STATUS_BAR_HEIGHT"),height:60,width:'97%',alignSelf:'center'},
  coverO:{backgroundColor:'#0000003d',width:'100%',height:'100%',justifyContent:'center',alignItems:'center'},
  cover:{width:'100%',justifyContent:'center',alignItems:'center',height:200},
  image:{width:"100%",height:"100%",backgroundColor:'grey'},  
  text:{fontWeight:'bold',color:'white',fontSize:14},
  avatar:{width:'100%',alignItems:'center',height:140},
  avtI:{width:120,height:120,backgroundColor:'grey',borderRadius:10, marginTop:10},
  avatarO:{backgroundColor:'#0000003d',borderRadius:10,width:120,height:120,justifyContent:'center',alignItems:'center'}
})