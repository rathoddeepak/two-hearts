import React, { Component, PureComponent} from 'react';
import {
	View,
	TouchableNativeFeedback,
	FlatList,
	StyleSheet,
	Text,
	Modal,
	TextInput,
	ActivityIndicator,
	RefreshControl,
	Alert
} from 'react-native';
import {
	Icon,
	Ripple,
	NoItem,
	Retry,
	Loading,
	LoadingModal
} from 'components';
import AndroidUtilities from 'ydc/AndroidUtilities';
import Dimensions from 'ydc/Dimensions';
import request from 'ydc/api';
import LinearGradient from 'react-native-linear-gradient';
import constants from 'libs/constants';
import * as Animatable from 'react-native-animatable';
import moment from 'moment';

import {
  MenuProvider,
  Menu,
  MenuTrigger,
  MenuOptions,
  MenuOption,
} from 'react-native-popup-menu';

const titleH = AndroidUtilities.hps("9.517");
const pItemW = AndroidUtilities.wp("89.72");
const pItemH = AndroidUtilities.hps("20.48");
const MessagingItemHolder = AndroidUtilities.hps("7.62%");
const cricle = MessagingItemHolder * 2;
const colorSize = pItemW/10;
const entity = "Promises";
const colors = constants.colors();
const color = "#C9C9C9";
export default class Promises extends Component {
	constructor(props) {
		super(props);
		this.state = {
			promises:[],			
			aP:false,						
			fetched:false,
			error:false,
			offset:0,
			creating:false,			
			noMore:false,

			sC:1,
			promise:'',
			id:-1			
		}
	}
	componentDidMount(){
		this.loadPromises();
	}
	loadPromises = async () => {
		if(this.state.noMore)return;	
		this.setState({error:false,fetched:false});
		var res = await request.perform('promise_handler', {
			request:'get',
			relation_code,
			offset:this.state.offset			
		},"prms", false);		
		if(res != 'fetch_error' && typeof res == 'object' && res.status == 200){
			this.setState({error:false,fetched:true});
			if(res.data.length == 0){
				this.setState({noMore:true});
				return;
			}
			if(res.data.length < 15)this.setState({noMore:true});				
			if(this.state.offset == 0){
				this.setState({promises:res.data,offset:res.data.length});
			}else{
				this.setState({promises:[...this.state.promises, res.data],offset:this.state.offset+res.data.length});
			}
		}else{
			this.setState({error:true,fetched:true})
		}
	}

	deletePromise = async (i) => {
		this.loading?.show();
		let promise = this.state.promises[i];
		var res = await request.perform('promise_handler', {
			request:'delete',
			relation_code:123456,
			id:promise['id']			
		},"prms", false);
		if(res)this.loading?.hide();		
		if(res != 'fetch_error' && typeof res == 'object' && res.status == 200){			
			let promises = this.state.promises;
			promises.splice(i, 1);
			this.setState({promises});
			request.pop('Promise deleted successfully!');
		}else{
			request.pop('Unable to delete promise!');
		}
	}
	createPromise = async () => {
		if(request.isBlank(this.state.promise) ){
			request.pop('Please enter promise!');
			return;
		}
		this.setState({creating:true});
		var editM = this.state.id != -1;			
		var promise = {color:this.state.sC,promise:this.state.promise};
		if(editM){
			var objectEdit = this.state.promises[this.state.id];
			promise['id'] = objectEdit['id'];			
		}
		var res = await request.perform('promise_handler', {
			request:editM ? 'update' : 'create',
			relation_code,
			user_id,
			offset:this.state.offset,
			...promise		
		},"prms", false);			
		if(res)this.setState({creating:false})
		if(res != 'fetch_error' && typeof res == 'object' && res.status == 200){			
			this.handleClose();
			let promises = this.state.promises;
			if(editM){
				promise['time'] = objectEdit['time'];
				promises[this.state.id] =  promise;
			}else{
				let id = res.data.id;
				let time = res.data.time;				
				promises.unshift({id,time,...promise});
			}		
			this.setState({promises,fetched:true,error:false})			
			this.setState({promise:''});
			request.pop(`Promise ${editM ? 'updated' : 'added'} successfully`);
		}else{
			request.pop(`Unable to ${editM ? 'update' : 'add'} promise`);
		}
	}
	handleChangeTxt = (promise) => {
		this.setState({promise});
	}
	addPromise = () => {
		setTimeout(() => {
			this.setState({id:-1,promise:'',sC:0}, () => {
				this.setState({aP:true})
			});
		})		
	}
	handleClose = () => {
		this.input?.zoomOut();
		this.colors?.zoomOut();
		setTimeout(() => {
			this.setState({aP:false,id:-1});
		}, 410)
	}
	onItemPress = (id) => {
		var objectEdit = this.state.promises[id];
		this.setState({promise:objectEdit['promise'],sC:objectEdit['color'],id}, () => {
			this.setState({aP:true})
		})
	}
	handleRefresh = () => {
		this.setState({offset:0,promises:[],noMore:false}, () => {
			this.loadPromises();
		})
	}
	handleMenuClick = (value, i) => {
		if(value == 0){
			this.onItemPress(i);
		}else{
			 Alert.alert(
		      "Delete Promise",
		      "Are you sure you want to delete promise",
		      [
		        {
		          text: "Cancel",		          
		          style: "cancel"
		        },
		        { text: "Yes", onPress:() => this.deletePromise(i)}
		      ]		      
		    );
		}
	}
	render() {
		const {						
			aP,			
			sC,
			creating,
			promise
		} = this.state;		
		return (
			<MenuProvider style={sty.containter}>			
				<View style={sty.title}>
					 <Text style={sty.ttT}>Promises</Text>
				</View>
				<FlatList
	    		   data={this.state.promises}
	    		   ListFooterComponent={this.renderFooterComponent}
	    		   keyExtractor={({item,index}) => index}
	    		   onEndReachedThreshold={0.01}
	    		   onEndReached={this.loadPromises}
	    		   refreshControl={<RefreshControl refreshing={false} onRefresh={this.handleRefresh} colors={colors} />}
	    		   renderItem={({item, index}) => {	    		   	
		    		   	return (
		    		   		<PromiseItem onMenuClick={val => this.handleMenuClick(val, index)} onPress={() => this.onItemPress(index)} item={item} />		    		   	
		    		    )}
	    		   }
	    		/>	    		
	    		<Ripple onPress={this.addPromise} rippleColor="#fff" rippleContainerBorderRadius={100} style={{position: 'absolute',alignItems:'center',bottom:20,left:'45%'}}>
		    		<LinearGradient colors={['#5E9BE3', '#BB1BC6']} style={{width:MessagingItemHolder,height:MessagingItemHolder,borderRadius:cricle, justifyContent:'center', alignItems:'center'}}>
						<Icon name="promises" color="#fff" size={30} />
				    </LinearGradient>
			    </Ripple>

			    <Modal onRequestClose={this.handleClose} visible={aP} animationType="fade" transparent>
			        <View style={{height:constants.maxHeight2(),width:constants.width(),backgroundColor:"#0009",justifyContent:"center"}}>			            
			            <Animatable.View duration={400} ref={ref => this.input = ref} animation="zoomIn" style={[sty.pItem2, {backgroundColor:colors[sC]}]}>
						  <TextInput multiline onSubmitEditing={this.createPromise} maxLength={227} placeholderTextColor={color + "b4"} placeholder="Write promise in two lines" numberOfLines={3} style={sty.prms} value={promise} onChangeText={this.handleChangeTxt} />						  
						</Animatable.View>
						<Animatable.View duration={400} ref={ref => this.colors = ref} animation="zoomIn" style={sty.colors}>
						 {colors.map((backgroundColor, i) => {
						 	return (
						 		<Ripple rippleContainerBorderRadius={100} onPress={() => this.setState({sC:i})}  style={[sty.color, {backgroundColor}, sC == i ? sty.clrS : {} ]} />
						 	)
						 })}
						</Animatable.View>
				        <Ripple rippleColor="#fff" onPress={this.createPromise} rippleContainerBorderRadius={100} style={{position: 'absolute',alignItems:'center',bottom:21.6,left:'45%'}}>
				    		<LinearGradient colors={['#5E9BE3', '#BB1BC6']} style={{width:MessagingItemHolder,height:MessagingItemHolder,borderRadius:cricle, justifyContent:'center', alignItems:'center'}}>
								{creating 
								? <ActivityIndicator color="#fff" size={30} />	
								: <Icon name="tick" color="#fff" size={30} />}
						    </LinearGradient>
					    </Ripple>
				    </View>
			    </Modal>
			    <LoadingModal ref={ref => this.loading = ref}/>
			</MenuProvider>
		)
	}
	renderFooterComponent = () => {
		const {
			error,
			fetched,
			offset,
			noMore,
			promises
		} = this.state;
		const isInitial = offset == 0;
		if(!error && !fetched) {
			return (<Loading isInitial={isInitial} />)
		}else if(error){
			return (<Retry onRetry={this.loadPromises} entity={entity} isInitial={isInitial} />)
		}else if(promises.length == 0 || noMore){
			return (<NoItem entity={entity} isInitial={isInitial} />)
		}else {
			return (<View />)
		}
	}
}

class PromiseItem extends PureComponent {	
	render() {
		const {
			promise,			
			color,
			time,			
		} = this.props.item;
		return (
			<TouchableNativeFeedback onPress={this.props.onPress}><Animatable.View animation="fadeIn" style={[sty.pItem, {backgroundColor:colors[color]}]}>
			  <Text numberOfLines={3} style={sty.prms}>{promise}</Text>			 
			  <Text numberOfLines={3} style={sty.dt}>{moment.unix(time).format("DD/MM/YY : hh:mm A")}</Text>			  
			    <Menu onSelect={this.props.onMenuClick} style={sty.icn}>
		          <MenuTrigger>
			          <Icon name="Menu" color="#fff" size={15} />
		          </MenuTrigger>
		          <MenuOptions>		            
		            <MenuOption value={0} text="Edit" />
		            <MenuOption value={1} text="Delete" />
		          </MenuOptions>
		        </Menu>

			</Animatable.View></TouchableNativeFeedback>
		)
	}
}
const sty = StyleSheet.create({
	title:{width:"100%",justifyContent:"center",alignItems:"center",marginVertical:Dimensions.get("STATUS_BAR_HEIGHT")},
	ttT:{fontSize:20,fontWeight:'bold',color:'black'},
	containter:{height:constants.maxHeight2(),width:constants.width(),backgroundColor:'white'},
	pItem:{width:pItemW,height:pItemH,alignSelf:'center',justifyContent:'center',alignItems:'center',borderRadius:7,marginBottom:20},
	pItem2:{width:pItemW,height:pItemH*1.5,alignSelf:'center',justifyContent:'center',alignItems:'center',borderRadius:7,marginBottom:20},
	prms:{textAlign:'center',fontSize:15,width:'80%',fontStyle:'italic',color},
	dt:{position:'absolute',right:5,bottom:3,fontSize:12,fontFamily:'serif',color},
	icn:{height:30,width:30,justifyContent:'center',alignItems:'center',position:'absolute',right:0,top:5},
	colors:{maxWidth:pItemW,alignSelf:'center',height:colorSize,flexDirection:'row',justifyContent:'center',alignItems:'center'},
	color:{width:colorSize,height:colorSize,borderRadius:colorSize*2,marginHorizontal:10},
	clrS:{borderWidth:2, borderColor:'#fff'},
})