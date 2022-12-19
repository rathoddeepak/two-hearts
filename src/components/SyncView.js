import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
	View,
	Text,
	StyleSheet
} from 'react-native';
import Ripple from './UI/Ripple';
import Icon from './UI/Icon';
import ProgressBar2 from './ProgressBar2';
import {
	GetToken,
	StoreToken,
	APPEND_FETCH,
	NEW_FETCH,
	FlushToken
} from './token';
import AndroidUtilities from 'ydc/AndroidUtilities';
import request from 'ydc/api';
import Downloader from 'ydc-rn-downloader';
import Datastore from 'react-native-local-mongodb';
const width = AndroidUtilities.wp("80%");
const ALL = -1;
const DOWNLOADING = 0;
const PAUSED = 1;
const COMPLETED = 2;
const ERROR = 3;
const IDLE = 4;
const NEEDACTION = 5;

const issuer1 = "sds";
const issuer2 = "photos";
const issuer3 = "albums";
const sdsDB = new Datastore({filename: "sdsDB", autoload: true});
const photosDB = new Datastore({filename: "galleryDB", autoload: true});
const albumsDB = new Datastore({filename: "albumsDB", autoload: true});

export default class SyncView extends Component {
	constructor(props) {
		super(props);		
		this.state = {
			progress:0,
			status:0,
			mounted:true,
			dest:'',
			stoped:false
		}		
	}
	componentDidMount() {		
		StoreToken(issuer1, 0);
		StoreToken(issuer2, 0);
		StoreToken(issuer3, 0);
		sdsDB.remove({}, { multi: true }, (err, numRemoved) => {});
		photosDB.remove({}, { multi: true }, (err, numRemoved) => {});
		albumsDB.remove({}, { multi: true }, (err, numRemoved) => {});		
		this.startDownload()
	}
	componentWillUnmount() {
		this.setState({mounted:false})
	}	
	startDownload = () => {
		this.resetDownload();
		this.readProgres();
		this.setState({status: DOWNLOADING, stoped:false});	
	}
	stopDownload = () => {
		Downloader.retriveDownloads(5, 0, downloads => {	      	      	
      		for(var i = 0; i < downloads.length; i++)Downloader.deleteTask(downloads[i].id + "", downloads[i].dest);
      	});
		this.stopRead();
		this.setState({status: ERROR, stoped: true});
	}	
	resetDownload = () => {
		Downloader.addToDownloads("scrntwo", request.api_url()+`download_sync&storex=scrntwo&user_id=${user_id}&relation_code=${relation_code}`, "twd", "-1", {
			type:0,
			data_id:-1
		});
	}
	handleControl = () => {	    
		if(this.state.status == DOWNLOADING || this.state.status == IDLE){
		    this.stopDownload();							
		}else if(this.state.status == ERROR){			
			this.startDownload()				
		}		
	}
	readProgres = () => {
		this.setState({mounted:true});
	    setTimeout(() => {
	      Downloader.retriveDownloads(5, 0, downloads => {	      	
	      	if(downloads.length > 0){	      		
	      		this.setState({
	      			id:downloads[0].id,
	      			progress:this.state.progress + 1,
	      			status:downloads[0].status,
	      			dest:downloads[0].dest
	      		}, () => {
	      			this.progress.set(this.state.progress);
	      		});
	      		if(downloads[0].status == COMPLETED){
	      			this.progress.set(97);
	      		   this.stopRead();
	      		   this.readLocalStore();	      		
	      		}else if(downloads[0].status == ERROR){
	      		   alert(JSON.stringify(downloads))
	      		   this.progress.set(0);
	      		   this.stopDownload();	      		         	
	      		}
	      	}	      	
	      });
	      if(this.state.mounted)this.readProgres();
	    }, 1000);
	}
	stopRead = () => {
		this.setState({mounted:false});
	}
	readLocalStore = () => {
		Downloader
		.readFile(this.state.dest)
		.then(string => {			
			this.writeLocalStore(string);
		})
		.catch(err => {
			alert(err)
			this.setState({
				status:ERROR,
				stoped:true
			})
		})
	}
	writeLocalStore = (string) => {	
	    alert(string)	
		const JSONDATA = JSON.parse(string);
		const a = JSONDATA['sds'];		
		const b = JSONDATA['photos'];		
		const c = JSONDATA['albums'];
		StoreToken(issuer1, JSONDATA['sds_tk']);
		StoreToken(issuer2, JSONDATA['photos_tk']);
		StoreToken(issuer3, JSONDATA['albums_tk']);
		var i = 0;
		a.forEach(j => sdsDB.insert(j, (e, n) => {}))
		b.forEach(k => photosDB.insert(k, (e, n) => {}))
		c.forEach(l => albumsDB.insert(l, (e, n) => {}))		
		this.stopDownload();		
		this.progress.set(100);
		setTimeout(() => {
			this.props.onDoneSync()
		}, 2000)		
	}
	render(){
		const {
			title,
			desc			
		} = this.props;
		return (
			<View style={sty.container}> 
			  <View style={sty.comp}>
			   <Text style={sty.t1}>{title}</Text>
			   <Text style={sty.t2}>{desc}</Text>
			   <ProgressBar2 width={width} height={7} ref={ref => this.progress = ref} style={{marginVertical:20}}/>
			   <View style={sty.btns}>			   	
			   	<Ripple onPress={this.handleControl} rippleContainerBorderRadius={100} style={sty.btn}>
			   	 <Icon name={this.state.stoped ? "play" : "close"} size={20} color="#649FE4" />
			   	</Ripple>
			   </View>
			  </View>
			</View>
		)
	}
}
const sty = StyleSheet.create({
	container:{
		backgroundColor:'white',
		flex:1,
		justifyContent:'center',
		alignItems:'center'
	},
	comp:{
		width:width
	},
	t1:{
		marginBottom:5,
		fontSize:16,
		color:'#000',
		fontWeight:'bold',
		textAlign:'center'
	},
	t2:{
		marginBottom:5,
		fontSize:14,
		color:'#000',
		textAlign:'center'
	},
	btns:{
		flexDirection:'row',
		height:70,
		width:'100%',
		justifyContent:'center'
	},
	btn:{
		flexDirection:'row',
		height:40,
		width:40,
		marginHorizontal:4,
		borderRadius:100,
		alignItems:'center',
		backgroundColor:"#F1F1F1",
		justifyContent:'center'
	}
})
