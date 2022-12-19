import React from 'react';
import StickyItemFlatList from '@gorhom/sticky-item';
import {
	View,
	Text,
	Animated,
	ScrollView,
	FlatList,
	ImageBackground,
	Alert,
	ToastAndroid
} from 'react-native';
import {
	s,
	Ripple,
	ImageView,
	ImageGridLimited,
	UploadBatch,
	Fab,
	CoordinateView,
	LoadingModal,
	SyncView,
	H1,
	Icon,
	ShareRemoteModal
} from 'components';
import {
	AndroidUtilities,
	Dimensions,
	UploadManager,
	request,
	SharedPreferences,
	InteractUser
} from 'ydc';
import Downloader from 'ydc-rn-downloader';
import StickyItem from 'components/UI/StickyItem';
import LinearGradient from 'react-native-linear-gradient';
import socket from 'libs/socket';
import Datastore from 'react-native-local-mongodb';
import moment from 'moment';
import {
	GetToken,
	StoreToken,
	APPEND_FETCH,
	NEW_FETCH,
	FlushToken
} from 'components/token';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  MenuProvider
} from 'react-native-popup-menu';
const ImageHolderWidth = AndroidUtilities.wp("95.277%");
const ImageHolderHeight = AndroidUtilities.hp("25.277%");
const btnHeight = AndroidUtilities.hp('4.5%');
const btnWidth = AndroidUtilities.wp('40.22%');
const ScreenHeight = AndroidUtilities.hps("93.796%");
const ImageHolderSize = AndroidUtilities.fv(95);
const ImagePadding = AndroidUtilities.hps("2.777%");
const MAX_WIDTH = Dimensions.get("REAL_WINDOW_WIDTH");
const STORY_WIDTH = AndroidUtilities.wp("38.88%");
const STORY_HEIGHT = AndroidUtilities.hps("8%");
const SEPARATOR_SIZE = AndroidUtilities.wp("3.88%");
const ICON_SIZE = AndroidUtilities.wp("5.33%");
const ImageSize = ImageHolderWidth/3;

const sdsDB = new Datastore({filename: "sdsDB", autoload: true});
const photoDB = new Datastore({filename: "galleryDB", autoload: true});
const albumsDB = new Datastore({filename: "albumsDB", autoload: true});
const issuer1 = "albums";
const issuer2 = "photos";
const issuer3 = "sds";
export default class Albums extends React.Component {
	constructor(props){
		super(props)
		this.state = {
			mounted:true,
			viewMode:1,			
			specialDays:[{type:'m'}],
		    recentPhotos:[],        
	        albums:[],
	        c1:1,
			c2:1,
			c3:1,
			t1:0,
			t2:0,
			t3:0,
		},
		this.conn_status = false;
		this.imageHandle = [];
		this.loading;
		this.alreadyPressed = false;
		this._unsubscribe = this.props.navigation.addListener('focus', this.startTracker);
	    this._unsubscribe2 = this.props.navigation.addListener('blur', this.removeTracker);
	}
	componentDidMount(){	  
	   SharedPreferences.getItem("scrntwo", val => {	   	
	   	if(val != "y")
	   		this.startSyncMode();
	    else
	   		this.loadMainView();	   	
	   });

	   setTimeout(() => {
	   	this.loadGalleryPhotos();
	   }, 3 * 1000)
	}
	handleSyncFinish = () => {		
		SharedPreferences.setItem("scrntwo", "y");
		this.loadMainView();
	}
	loadMainView = () => {
		//StoreToken(issuer1, 0);
		//StoreToken(issuer2, 0);
		//StoreToken(issuer3, 0);
		//sdsDB.remove({}, {multi:true}, (e, n) => {});
		//photoDB.remove({}, {multi:true}, (e, n) => {});
		//albumsDB.remove({}, {multi:true}, (e, n) => {});
		GetToken(issuer1, t1 => this.setState({t1}));
		GetToken(issuer2, t2 => this.setState({t2}));
		GetToken(issuer3, t3 => {			
			this.setState({t3,viewMode:2});	   				
	   		setTimeout(() => {this.loadCombo()})
	   		setTimeout(() => {this.sync()})					
		});
	}
	startSyncMode = () => {
		SharedPreferences.setItem("scrntwo", "n");
		this.setState({viewMode:0,albums:[],specialDays:[],recentPhotos:[]});   		
	}
	startTracker = (e) => {	  
	  this.sync()
	  this.setState({mounted:true})
	}
	removeTracker = (e) => {	  	  
	  this.setState({mounted:false})
	}
	loadCombo = () => {		
		if(this.state.c1 == 1)
			albumsDB.find({}).sort({ _id: -1 }).exec((err, albums) => this.setState({albums}))
		if(this.state.c2 == 1)
			photoDB.find({}).sort({ _id: -1 }).limit(7).exec((err, recentPhotos) => {
				if(recentPhotos.length > 6){
					let tempPhotos = recentPhotos;
					photoDB.count({}, (err, count) => {					    						
						tempPhotos = recentPhotos.slice(0, 5);						
						tempPhotos.push({
							type:'m',
							url:recentPhotos[5]['url'],
							photosCount:count-6
						})						
						this.setState({recentPhotos:tempPhotos})				  
					});
				}else{
					this.setState({recentPhotos})
				}
			})
		if(this.state.c3 == 1)
			sdsDB.find({}).sort({ _id: -1 }).exec((err, specialDays) => {				
				let sDsMore = specialDays.length > 5;
				specialDays = specialDays.slice(0, 5);
				specialDays.push({type:'m'})									
				this.setState({specialDays})
			})
	}	
	sync = async () => {
	    this.setState({c1:0,c2:0,c3:0})	    
		try{
			var res = await request.perform(`download_sync&user_id=${user_id}&relation_code=${relation_code}&storex=sync_sz`, {				
				t1:this.state.t1,
				t2:this.state.t2,
				t3:this.state.t3
			},"albums", false);
				if(res != 'fetch_error'){
					if('rs' in res){		
						this.startSyncMode();
					}else{					
						if(res['albumsDB'].length != 0){
							StoreToken(issuer1, res['albumsDB'][0].tk);
							this.setState({t1:res['albumsDB'][0].tk, c1:1})						
							res['albumsDB'].forEach(data => {		
								if(data.type == 'add_new'){
									albumsDB.insert(data['new_data'], (e, n) => {});
								}else if(data.type == 'change'){						
									albumsDB.update({ _id: parseInt(data._id) }, { $set: data.new_data }, { multi: false }, (e, n) => {});
								}else if(data.type == 'delete'){
									albumsDB.remove({ _id: parseInt(data._id)}, {}, (e, n) => {});
								}else if(data.type == 'delete_multi'){
									albumsDB.remove({_id: { $in: res[i]._id }}, {multi: true}, (e, n) => {});
								}
							});
						}
						if(res['photoDB'].length != 0){
							StoreToken(issuer2, res['photoDB'][0].tk);
							this.setState({t2:res['photoDB'][0].tk, c2:1})
							res['photoDB'].forEach(data => {		
								if(data.type == 'add_new'){
									photoDB.insert(data['new_data'], (e, n) => {});
								}else if(data.type == 'change'){						
									photoDB.update({ _id: parseInt(data._id) }, { $set: data.new_data }, { multi: false }, (e, n) => {});
								}else if(data.type == 'delete'){
									photoDB.remove({ _id: parseInt(data._id)}, {}, (e, n) => {});
								}else if(data.type == 'delete_multi'){									
									photoDB.remove({_id: { $in: res[i]._id }}, {multi: true}, (e, n) => {});
								}
							});
						}
						if(res['sdsDB'].length != 0){
							StoreToken(issuer3, res['sdsDB'][0].tk);
							this.setState({t3:res['sdsDB'][0].tk, c3:1})
							res['sdsDB'].forEach(data => {		
								if(data.type == 'add_new'){
									sdsDB.insert(data['new_data'], (e, n) => {});
								}else if(data.type == 'change'){						
									sdsDB.update({ _id: parseInt(data._id) }, { $set: data.new_data }, { multi: false }, (e, n) => {});
								}else if(data.type == 'delete'){
									sdsDB.remove({_id: parseInt(data._id)}, {}, (e, n) => {});
								}else if(data.type == 'delete_multi'){
									sdsDB.remove({_id: { $in: res[i]._id }}, {multi: true}, (e, n) => {});
								}
							});							
						}
						this.loadCombo();
					}							
				this.r()
			}else{
				this.r()
			}
		}catch(err) {			
			this.r()
		}
	}
	r = () => {
		if(this.state.mounted)setTimeout(() => this.sync(), 5000);
	}

	startProcess = () => {	   
	    this.props.navigation.navigate("SpecialDaysList", {
	    	addMode: true
	    })
	}

	showDay(idx){	    
	    this.props.navigation.navigate("SpecialDaysList", {
	    	idx
	    })
	}

	handlePhotosSelected = (data) => {
		var time = moment().unix();		
		for (var i = 0; i < data.length; i++) {
			var obj = {width:0,height:0};
			obj["source"] = data[i];
		 	obj["server_params"] = `{"request":"upload_media","caption":"a","relation_code":${relation_code},"store":"photos","user_id":${user_id},"time":${time}}`;
		 	obj["server_url"] = `${config.apiUrl}media_handler`;
		 	UploadManager.addProcess(obj);
		}
		if(data.length > 0){
			UploadManager.startProcess();			
		}
	}    

	loadGalleryPhotos = () => {
		this.props.navigation.navigate("PhotosView");
	}

	deleteAlbum = (index) => {
		let album = this.state.albums[index];
		Alert.alert(
		      "Delete Album "+album['an'],
		      "Are you sure you want to delete album",
		      [
		        {
		          text: "Cancel",		          
		          style: "cancel"
		        },
		        { text: "Yes", onPress:() => this.finalDelete(index, album['_id'])}
		      ]		      
		    );
	}
	async finalDelete(i, aid){
		this.loading?.show();		
		const tm = moment().unix();
		var res = await request.perform('albums_handler', {
			request:'delete_album',
			relation_code,
			user_id,
			store:'albums',
			tm,
			aid	
		},"prms", false);
		if(res)this.loading?.hide();		
		if(res != 'fetch_error' && typeof res == 'object' && res.status == 200){			
			let albums = this.state.albums;
			albums.splice(i, 1);						
            this.setState({t1:tm, c1:1,albums});
            StoreToken(issuer1, tm);
            albumsDB.remove({ _id: parseInt(i)}, {}, (e, n) => {});
			request.pop('Album deleted successfully!');
		}else{
			request.pop('Unable to delete album!');
		}
	}
	renderItem = ({ item, index}) => {
		if(item.type == 'm'){
		 return(
			<Ripple onPress={() => this.props.navigation.navigate("SpecialDaysList")}><View		      
		      style={{	        
		        width: STORY_WIDTH,
		        height: STORY_HEIGHT,
		        borderRadius:10,
		        justifyContent:'center',
		        alignItems:'center',
		        backgroundColor:s[config.theme_s].dim 
		      }}
		    >
		    <Text numberOfLines={2} style={{
		    	fontSize:AndroidUtilities.fv(10),
		    	fontWeight:'bold',
		    	textAlign:'center',
		    	color:'white',	    	
		    }}>See All</Text>
		    </View></Ripple>)
		}
		return (		
		    <Ripple onPress={() => this.showDay(index)}><LinearGradient
		      start={{ x: 0.0, y: 0.5 }}
		      end={{ x: 1.0, y: 0.5 }}
		      key={index}
		      colors={["#d02dcb","#dd2960"]}
		      style={{	        
		        width: STORY_WIDTH,
		        height: STORY_HEIGHT,
		        borderRadius:10,
		        justifyContent:'center',
		        alignItems:'center'
		      }}
		    >
		    <Text numberOfLines={2} style={{
		    	fontSize:AndroidUtilities.fv(10),
		    	fontWeight:'bold',
		    	textAlign:'center',
		    	color:'white',	    	
		    }}>{item.tt}</Text>
		    </LinearGradient></Ripple>
		)
    }

    handlePhotosPress = () => {
		InteractUser.showBottomSheet({			
				hasOnlyContent:false,
				multiSelect:true,
				hideCameraTile:false,
				spanCount:3,
				alsoEdit:-1,
				dontDismissOnSelect:true
			}).then(callback => {
				this.handlePhotosSelected(callback)
			});		
	}	
	editAlbum = (index, album) => {
		this.props.navigation.navigate('CreateAlbum', {
			albumName:album['an'],
			albumInfo:album['ai'],
			id:album['_id'],
			onDone:(n) => this.handleUpdateAlbum(index, n)
		});
	}
	handleUpdateAlbum = (i, a) => {		
		let albums = this.state.albums;
		albums[i]['an'] = a['an'];
		albums[i]['ai'] = a['ai'];
		this.setState({albums})
	}
 	aboveAlbums = () => {
		const {
			state,
			specialDays,
			recentPhotos			
		} = this.state;
		return (
			<View>				
			 <View style={{backgroundColor: 'white',height:STORY_HEIGHT}}>			    
			    <StickyItemFlatList
		          itemWidth={STORY_WIDTH}
		          itemHeight={STORY_HEIGHT}
		          separatorSize={SEPARATOR_SIZE}
		          borderRadius={10}
		          stickyItemWidth={ICON_SIZE}
		          stickyItemHeight={ICON_SIZE}
		          stickyItemBackgroundColors={[s[config.theme_s].color, s[config.theme_s].color]}	      
			      stickyItemContent={StickyItem}
			      onStickyItemPress={this.startProcess}
			      data={specialDays}
			      renderItem={this.renderItem}
			    />
			 </View> 
			 <UploadBatch />

			 {recentPhotos.length > 0 ?
    		 <View style={{width:ImageHolderWidth,alignSelf:'center',flexWrap:'wrap',flexDirection:'row', marginTop:10}}>
	    		 {recentPhotos.map((itm, idx) => {
		    		 	if(itm.type == 'm'){
		    		 	    return (<View style={{width:ImageSize,padding:10,height:ImageSize}}>
						 		 <ImageView
						 		  thumbnail={request.site_url()+itm.url+'_thumb'}
						 		  source={request.site_url()+itm.url}
						 		  style={{flex:1}}
						 		  borderRadius={10}
						 		 />
						 		 <View style={{width:ImageSize,height:ImageSize,padding:10,position:'absolute'}}>
						 		 <Ripple rippleContainerBorderRadius={10} style={{flex:1,borderRadius:10,backgroundColor:'#0000003d',justifyContent:'center',alignItems:'center'}} onPress={this.loadGalleryPhotos}>
						 		  <Text numberOfLines={1} style={{color:'#fff',fontWeight:'bold',fontSize:AndroidUtilities.fv(18)}}>+{itm.photosCount}</Text>
						 		 </Ripple>
						 		 </View>
					 		 </View>)    		 
		    		 	}else{
		    		 		return (
			    		 		<CoordinateView ref={ref => this.imageHandle[idx] = ref} style={{width:ImageSize,height:ImageSize,padding:10}}>
			    		 		 <Ripple rippleContainerBorderRadius={10} onPress={this.loadGalleryPhotos}  style={{flex:1}}>
			    		 		 <ImageView
			    		 		  thumbnail={request.site_url()+itm.url+'_thumb'}
			    		 		  source={request.site_url()+itm.url}
			    		 		  style={{flex:1,borderWidth:0.3,borderColor:'#9e9e9e'}}
			    		 		  borderRadius={10}
			    		 		 /></Ripple>
			    		 		</CoordinateView>
			    		 	)
		    		 	}
		    		 })}	    		 
	    		  </View>
	    		  :
	    		  <View style={{width:ImageHolderWidth,height:200,alignSelf:'center',justifyContent:'center',alignItems:'center'}}>
					 <Text style={{fontSize:AndroidUtilities.fv(16),textAlign:'center',marginTop:AndroidUtilities.hp("4%"),alignSelf:'center'}}>
						 Let's upload Images
					 </Text>
					 <Text style={{fontSize:AndroidUtilities.fv(12),textAlign:'center',marginTop:AndroidUtilities.hp("1%"),width:'80%',alignSelf:'center'}}>
						From here you can upload, your videos and photos
					 </Text>

					 <Ripple rippleContainerBorderRadius={10} onPress={this.handlePhotosPress} style={{width:btnWidth,height:btnHeight,borderRadius:10,alignItems:'center',justifyContent:'center',alignSelf:'center',marginTop:AndroidUtilities.hp("2%"),backgroundColor:s[config.theme_s].light}}>
					  <Text style={{
					  	fontSize:AndroidUtilities.fv(14),
					  	fontWeight:'bold',
					  	color:'white',		  	
					  }}>Upload</Text>
					 </Ripple>
			
	    		  </View>
    		  }
    		  <H1 text="Albums" />
    		  </View>
		)
	}
	render(){
		const {
			viewMode
		} = this.state;
		if(viewMode == 0){
			return (
				<SyncView onDoneSync={this.handleSyncFinish} title="Loading Albums" desc={`Please wait, we are downloading some data for you "it wont take long time"`} />
			)
		}else if(viewMode == 1){
			return (
				<View></View>
			)
		}else{
			return (
				<MenuProvider style={{height:ScreenHeight,width:MAX_WIDTH,backgroundColor:'white'}}>			 
	    		  <FlatList
	    		   data={this.state.albums}
	    		   ListHeaderComponent={this.aboveAlbums}
	    		   keyExtractor={({item,index}) => index}
	    		   contentContainerStyle={{flexGrow:1}}	    		   
	    		   renderItem={({item, index}) => {	    		   	
	    		   	return (
	    		   	 <AlbumItem 
	    		   	  item={item} 
	    		   	  onPressItem={() => this.goToAlbum(item)}
	    		   	  onAttemptDelete={() => this.deleteAlbum(index)}
	    		   	  onEditAlbum={() => this.editAlbum(index, item)}
	    		   	 />
	    		   )}}
	    		  /> 
	    		  <Fab
	    		   onPhotosPress={this.handlePhotosPress}
	    		   onSpecailDayPress={this.handleCreateAlbum}
	    		  />
	    		  <LoadingModal ref={ref => this.loading = ref}/>	
	    		  <ShareRemoteModal
	    		   ref={ref => (this.shareRemoteModal = ref)}
	    		  />    		  
				</MenuProvider>
			);
		}		
	}
	handleCreateAlbum = () => {
		this.props.navigation.navigate('CreateAlbum', {
			onDone:this.handleInsertAlbum
		});
	}
	goToAlbum(album){
		this.props.navigation.navigate("AlbumView", {
			album
		})
	}
	handleInsertAlbum = (item) => {
		alert(JSON.stringify(item));
		//this.setState({t1:item['tm'],albums:[item, ...this.state.albums]});		
	}
	handleUpdateAlbum(item){
		this.props.navigation.navigate('CreateAlbum');
	}
}
class AlbumItem extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			cover:''
		}
	}
	componentDidMount(){
		this.loadCover();
	}
	loadCover = async () => {
		const tempCover = 'uploads/albums.png';
		if(this.props.item.cover == undefined || this.props.item.cover == -1){
			this.setState({cover:tempCover});
			return;
		}
		await photoDB.findOne({ _id: parseInt(this.props.item.cover)}, (err, doc) => {		  
		  if(err == null && doc != null){
		    this.setState({cover:doc['url']})		    		  	
		  }else{
		  	this.setState({cover:tempCover})
		  }		  
		});	
	}
	render(){
		const {
			item
		} = this.props;
		return (
		    <View>		    
			<Ripple onPress={this.props.onPressItem} rippleContainerBorderRadius={10} style={{width:ImageHolderWidth,height:ImageHolderHeight,alignSelf:'center',marginTop:20}}>			     
    		   	<ImageBackground source={{uri:request.site_url() + this.state.cover }} borderRadius={10} style={{flex:1}}>    		   	
    		   	<LinearGradient colors={['transparent','black']} style={{width:'100%',borderRadius:10,borderWidth:0.5,borderColor:'#9e9e9e',height:'100%',justifyContent:'flex-end'}}>    		   	 
    		   	 <Text numberOfLines={1} style={{fontSize:AndroidUtilities.fv(13),width:'90%',color:'white',fontWeight:'bold',paddingTop:AndroidUtilities.fv(8),paddingLeft:AndroidUtilities.fv(8)}}>{item.an}</Text>
    		   	 {item.ai.length != 0 ?  <Text numberOfLines={2} style={{fontSize:AndroidUtilities.fv(11),width:'90%',color:'#f2f2f2',paddingLeft:AndroidUtilities.fv(8)}}>{item.ai}</Text> : null} 
    		   	 <Text numberOfLines={1} style={{fontSize:AndroidUtilities.fv(10),width:'90%',color:'#f2f2f2',paddingLeft:AndroidUtilities.fv(8)}}>Created on {moment.unix(item.tm).format("DD-MM-Y")}</Text>	    		   	 
    		   	 <Text numberOfLines={1} style={{fontSize:AndroidUtilities.fv(10),width:'90%',color:'#f2f2f2',paddingLeft:AndroidUtilities.fv(8),paddingBottom:AndroidUtilities.fv(8)}}>{item.md?.length ? item.md.length : 0} photos and videos</Text>
    		   	</LinearGradient>			    
    		   	</ImageBackground>    		   	
		   	</Ripple>	
		   	    <Menu style={{height:30,width:30,justifyContent:'center',alignItems:'center',position:'absolute',right:8,top:20}}>
			      <MenuTrigger>
			        <Icon name="Menu" color="#fff" size={18} />
			      </MenuTrigger>
			      <MenuOptions customStyles={{optionsContainer:{marginTop:-ImageHolderHeight/1.6,backgroundColor:'white'}}}>
			        <MenuOption onSelect={this.props.onPressItem} text='Open' />
			        <MenuOption onSelect={this.props.onEditAlbum} text='Edit' />			        
			        <MenuOption onSelect={this.props.onAttemptDelete} >
			          <Text style={{color: 'red'}}>Delete</Text>
			        </MenuOption>			        
			      </MenuOptions>
			    </Menu>
		   	</View>	   	
		)
	}
}