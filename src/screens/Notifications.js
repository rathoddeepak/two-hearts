import React, { Component } from 'react';
import {
	View,
	Text,
	FlatList,
	StyleSheet
} from 'react-native';
import {
	Ripple,
	NoItem,
	Icon
} from 'components';
import {request, InteractUser,AndroidUtilities} from 'ydc';
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';
import constants from 'libs/constants';
const ScreenHeight = AndroidUtilities.hps("93.796%");
function decodeIcon(){
	return 'a';
}
function decode(loading, error){
	if(loading && !error){
		return {
			text:'Updating',
			color:'#649FE4'
		}
	}else if(error){
		return {
			text:'Retrying',
			color:'red'
		}
	}else if(!loading && !error){
		return {
			text:'Upto date',
			color:'green'
		}
	}
}
export default class Notifications extends Component {
	constructor(props){
		super(props);
		this.state = {
			notifications:[],
			mounted:true,
			lastread:0,
			loading:false,
			err:false
		}
		this._unsubscribe = this.props.navigation.addListener('focus', this.startTracker);
	    this._unsubscribe2 = this.props.navigation.addListener('blur', this.removeTracker);
	}
	
	componentDidMount(){		
		InteractUser.getLastNotifyRead(lastread => {			
		    this.setState({lastread}, () => {
		    	this.startLoopCheck()
		    	this.setState({mounted:false})
		    })
		})
		InteractUser.getNotifyUnread(count => {
			if(count > 0)this.props.navigation?.setParams({
				typing:false,
				count
			});
		})
	}

	startLoopCheck = async () => {
		this.setState({loading:true,err:false})
		try{
			var res = await request.perform('notification_handler', {user_id,relation_code,last_read:this.state.lastread},"albums", false);						
			if(res)this.setState({loading:false});
			if(res != 'fetch_error'){			
				if(res?.status == 200){
					const n = res.data;					
					if(n.length > 0){					    	
						this.setState({notifications:[...this.state.notifications, ...n], lastread:n[0].time})
						InteractUser.setLastNotifyRead(parseInt(n[0].time));							
					}					
					if(!this.state.mounted && n.length > 0){		
						InteractUser.setNotifyUnread(n.length)
						this.props.navigation?.setParams({typing:false,count:n.length});
					}
			    }
			    this.r();
			}else{			
				this.setState({err:true,loading:false});	
				this.r();
			}
		}catch(err){
			alert(err)			
			this.setState({err:true,loading:false});	
			this.r();
		}
	}

	r = () => {
		setTimeout(() => this.startLoopCheck(), 5000);
	}

    startTracker = (e) => {      
      this.props.navigation?.setParams({typing:false,count:0});
      InteractUser.setNotifyUnread(0);
	  this.setState({mounted:true});
	}

	removeTracker = () => {	  	  
	  this.setState({mounted:false})	  	
	}	

	renderHeader = () => {
		return(<StatusRender loading={this.state.loading} err={this.state.err}/>)
	}

	renderEmpty = () => {
		return <NoItem end={"No New Notifications"} isInitial={false} />
	}

	renderItem = ({item,index}) => {		
		return (
			<Item item={item} />
		)
	}
	render() {
		return (
			<View style={sty.container}>
			<FlatList
			 data={this.state.notifications}
			 ListEmptyComponent={this.renderEmpty}
			 ListHeaderComponent={this.renderHeader}
			 renderItem={this.renderItem}
			 style={{backgroundColor:'white'}}
			/>
			</View>
		)
	}
}
class StatusRender extends Component {
	render() {
		const {loading,error} = this.props
		const {text,color} = decode(loading,error);
		return (
			<View style={{height:25,width:'100%',justifyContent:'center',alignItems:'center',backgroundColor:color}}>
			 <Text style={{fontSize:13,color:'white'}}>{text}</Text>
			</View>
		)
	}
}
class Item extends Component {	
	render() {
		const {
			type,
			title,
			time				
		} = this.props.item;
		const name = decodeIcon(type);		
		return (
			<View style={sty.item}>
			 <View style={[sty.typeC, {borderRadius:100}]}>
			  <Icon name={name} color="#649FE4" size={30} />
			 </View>
			 <View style={sty.bodyC}>
			  <Text numberOfLines={3} style={sty.body}>{title}</Text>
			 </View>			
			</View>
		)
	}
}

const sty = StyleSheet.create({
	container:{
		height:ScreenHeight,
		width:constants.width()
	},
	item:{
		flexDirection: 'row',		
		alignItems: 'center'
	},
	typeC:{
		height:50,
		width:50,
		justifyContent: 'center',
		alignItems: 'center',
		margin:7
	},
	bodyC:{		
		width:"75%"		
	},
	body:{
		fontSize:14	
	}
})