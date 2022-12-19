import React, { Component } from 'react';
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	ScrollView,
	StyleSheet
} from 'react-native';
import {
	LoadingModal,
	s
} from 'components';
import request from 'ydc/api';
import moment from 'moment';
import AndroidUtilities from 'ydc/AndroidUtilities'
import constants from 'libs/constants';
import {
	GetToken,
	StoreToken,
	APPEND_FETCH,
	NEW_FETCH,
	FlushToken
} from 'components/token';
import Datastore from 'react-native-local-mongodb';
const ABOVEGAP = AndroidUtilities.hp("11.03%");
const INHEIGHT = AndroidUtilities.hp("6.24%");
const INHEIGHT2 = AndroidUtilities.hp("17.11%");
const INHEIGHT3 = AndroidUtilities.hp("14.11%");
const INHEIGHT4 = AndroidUtilities.hp("29.58%");
const HWIDTH = AndroidUtilities.wp("87.22%"); //Holder Width
const MR = AndroidUtilities.hp("2.75%");
const C1 = "#F2F3F5";
const C2 = "#DDDDDF";
const albums = new Datastore({filename: 'albumsDB', autoload: true});
export default class CreateAlbum extends Component {
	constructor(props) {
		super(props);
		this.state = {
			albumName:'',
			albumInfo:'',
			id:-1
		}
	}
	componentDidMount() {
		if(this.props.route.params?.id != undefined){
			alert("sdsasdasdasdasd");
			this.setState({
				albumName:this.props.route.params.albumName,
				albumInfo:this.props.route.params.albumInfo,
				id:this.props.route.params.id
			})
		}
	}
	createAlbum = async () => {
		this.loadingModal?.show();		
		try {
			var err_txt  = `Error while ${this.state.id == -1 ? 'creating' : 'updating' } album`;			
			let an = this.state.albumName;
			let ai = this.state.albumInfo;
			if(request.isBlank(an)){
				request.pop("Please enter album name");
				return;
			}else if(an.length < 2){
				request.pop("Album name too short");
				return;
			}
			var tm = moment().unix();
			var params = {
				user_id,
				relation_code,
				an,
				tm,
				ai,
				store:"albums",				
				request:"create_album"
			}			
			if(this.state.id != -1)params['id'] = this.state.id;
			var res = await request.perform('albums_handler', params, "albums", false);			
			if(res)this.loadingModal?.hide();
			if(res != 'fetch_error' && res.status == 200){						
					if(this.state.id == -1)
						albums.insert(res['data']['new_data'], (e, n) => {							
							StoreToken("albums", tm);
							this.props.route.params.onDone(n);
						});
					else
						albums?.update({ _id: parseInt(this.state.id) }, {$set:{an:an,tm,ai:ai}}, { multi: false }, (e, n) => {
							this.props.route.params.onDone({an,ai});
						});					
					   this.props.navigation.goBack();
			}else{
				request?.pop(err_txt);
			}
		}catch(err) {
			request?.pop(err);			
		}		
	}
	render(){
		const {
			albumName,
			albumInfo
		} = this.state;
		return (
			<View style={sty.container}>
			<LoadingModal 
    		   ref={ref => (this.loadingModal = ref)}
    		   cancelable={false}
    		/>
			<ScrollView ref={ref => this.scrollView = ref}>
			 <View style={sty.holder}>			 
			  <Text style={sty.title}>Create Album 🖼️</Text>
			  <Text style={sty.subtitle}>Create album, and organise your memories</Text>			  
			    <TextInput 
				  placeholderTextColor="#9e9e9e" 
				  selectionColor="#9e9e9e21" 
				  onChangeText={albumName	=> this.setState({albumName})}
				  value={albumName}
				  placeholder="Album Name*" 
				  style={sty.input} 
				  selectionColor={s[config.theme_s].color}
				/>
				<TextInput 
				  placeholderTextColor="#9e9e9e" 
				  selectionColor="#9e9e9e21" 
				  onChangeText={albumInfo	=> this.setState({albumInfo})}
				  value={albumInfo}
				  placeholder="Album Info (optional)" 
				  style={sty.input} 
				  selectionColor={s[config.theme_s].color}
				/>
				<TouchableOpacity 
	                style={[sty.button, {backgroundColor:s[config.theme_s].color}]} 
	                activeOpacity={0.8} 
	                onPress={this.createAlbum}>
	                <Text style={sty.itxt2}>Done</Text>                 
	            </TouchableOpacity>
			 </View>
			 </ScrollView>			 
			</View>
		)
	}
}

const sty = StyleSheet.create({
	container: {
		height:constants.maxHeight2(),
		width:constants.width(),
		backgroundColor:'white'
	},
	holder:{
		width:HWIDTH,
		marginTop:ABOVEGAP,
		marginBottom:AndroidUtilities.hp("10%"),
		alignSelf:"center"
	},
	title:{
		fontSize:AndroidUtilities.fv(20),
		fontWeight:'bold',
		color:"black",
		textAlign:"center",
		width:'100%',
		marginBottom:AndroidUtilities.fv(10)
	},
	subtitle:{
		fontSize:AndroidUtilities.fv(15),		
		textAlign:"center",
		width:HWIDTH,
		marginBottom:MR
	},
	input:{
		height:INHEIGHT,
		width:HWIDTH,
		borderRadius:7,
		backgroundColor:C1,
		borderColor:C2,
		color:"#000",
		borderWidth:1,
		fontSize:AndroidUtilities.fv(12),
		marginBottom:MR,
		paddingLeft:AndroidUtilities.fv(10),
		paddingTop:AndroidUtilities.fv(10)
	},
	itxt:{
		fontSize:AndroidUtilities.fv(12),
		color:'#9e9e9e',
		marginRight:AndroidUtilities.fv(10)
	},
	ps:{
		position:'absolute',
		right:AndroidUtilities.fv(10),
		top:AndroidUtilities.fv(10),
	},
	input2:{
		height:INHEIGHT,
		width:HWIDTH,
		borderRadius:7,
		backgroundColor:C1,
		borderColor:C2,		
		borderWidth:1,		
		marginBottom:MR,
		paddingLeft:AndroidUtilities.fv(10),
		paddingTop:AndroidUtilities.fv(10)		
	},
	input3:{		
		width:HWIDTH,
		height:INHEIGHT2,
		justifyContent:'center',
		borderRadius:7,
		backgroundColor:C1,
		borderColor:C2,		
		borderWidth:1,
		marginBottom:MR,		
		paddingLeft:AndroidUtilities.fv(10),
		paddingTop:AndroidUtilities.fv(10)		
	},
	button:{
		height:INHEIGHT,
		width:HWIDTH,
		borderRadius:7,
		marginBottom:MR,
		justifyContent:'center'	
	},
	itxt2:{
		fontSize:AndroidUtilities.fv(13),
		color:'#fff',
		textAlign:"center",
		fontWeight:'bold',
		width:'100%'
	}
})