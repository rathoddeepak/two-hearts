import React, { Component, PureComponent } from 'react';
import {
	View,
	TouchableNativeFeedback,
	FlatList,
	StyleSheet,
	Text,	
	TouchableOpacity,
	RefreshControl,
	Alert,
	ScrollView,
	Modal
} from 'react-native';
import {
	Icon,
	Ripple,
	NoItem,
	Retry,
	Loading,
	LoadingModal
} from 'components';
import Dimensions from 'ydc/Dimensions';
import AndroidUtilities from 'ydc/AndroidUtilities';
import request from 'ydc/api';
import constants from 'libs/constants';
import moment from 'moment';
import * as Animatable from 'react-native-animatable';
import {
  MenuProvider,
  Menu,
  MenuTrigger,
  MenuOptions,
  MenuOption,
} from 'react-native-popup-menu';
const pItemW = AndroidUtilities.wp("89.72");
const entity = "Notes";
const color = "#C9C9C9";
const colors = constants.colors();
export default class Notes extends Component {
	constructor(props) {
		super(props);
		this.state = {			
			notes:[],
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
		this.loadNotes();
	}
	loadNotes = async () => {
		if(this.state.noMore)return;	
		this.setState({error:false,fetched:false});
		var res = await request.perform('note_handler', {
			request:'get',
			relation_code,
			user_id,
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
				this.setState({notes:res.data,offset:res.data.length});
			}else{
				this.setState({notes:[...this.state.notes, res.data],offset:this.state.offset+res.data.length});
			}
		}else{
			this.setState({error:true,fetched:true})
		}
	}	
	onItemPress = (index) => {
		this.mainReader.setNote(this.state.notes[index], index);		
	}
	handleEditNote = (index) => {
		this.props.navigation.navigate("NoteEditor", {
			note:this.state.notes[index],
			onEdited:this.handleDoneEdit,
			index
		});
	}
	handleAddNotes = () => {
		this.props.navigation.navigate("NoteEditor", {			
			onCreate:this.handleInsertNote
		});
	}
	handleInsertNote = (note) => {
		let notes = this.state.notes;		
		notes.unshift(note);
		this.setState({notes,fetched:true,error:false});
	}
	handleDoneEdit = (note, i) => {
		let notes = this.state.notes;		
		notes[i] =  note;
		this.setState({notes});
	}
	handleRefresh = () => {
		this.setState({offset:0,notes:[],noMore:false}, () => {
			this.loadNotes();
		})
	}
	deleteNote = async (i) => {
		this.loading?.show();
		let note = this.state.notes[i];
		//if(note['edit'] == 1 && loggedId != note['user_id']){
			//alert('Your Parntner has set edit lock, so you cannot delete and edit these note.');
			//return;
		//}
		var res = await request.perform('note_handler', {
			request:'delete',
			relation_code,
			user_id,
			id:note['id']			
		},"prms", false);
		if(res)this.loading?.hide();		
		if(res != 'fetch_error' && typeof res == 'object' && res.status == 200){			
			let notes = this.state.notes;
			notes.splice(i, 1);
			this.setState({notes});
			request.pop('Note deleted successfully!');
		}else{
			request.pop('Unable to delete note!');
		}
	}
	handleMenuClick = (value, i) => {
		if(value == 0){
			this.onItemPress(i);
		}else if(value == 1){
			//let note = this.state.notes[i];
			//if(note['edit'] == 1 && loggedId != note['user_id']){
				//alert('Your Parntner has set edit lock, so you cannot delete and edit these note.');
				//return;
			//}else{this.handleEditNote(i)}
			this.handleEditNote(i);
		}else{
			 Alert.alert(
		      "Delete Note",
		      "Are you sure you want to delete promise",
		      [
		        {
		          text: "Cancel",		          
		          style: "cancel"
		        },
		        { text: "Yes", onPress:() => this.deleteNote(i)}
		      ]		      
		    );
		}
	}
	render() {
		return (
			<MenuProvider style={sty.container}>
				<View style={sty.title}>
				 <TouchableOpacity onPress={this.handleBack} style={sty.ttC2}>
				   <Icon name="back" color="black" size={AndroidUtilities.fv(25)} />
				 </TouchableOpacity>
				 <View style={sty.ttC}>
				  <Text numberOfLines={1} style={sty.ttT}>Notes</Text>
				 </View>
				 <TouchableOpacity onPress={this.handleAddNotes} style={sty.ttC2}>
				   <Icon name="add" color="black" size={AndroidUtilities.fv(20)} />
				 </TouchableOpacity>			    
				</View>
				<FlatList
	    		   data={this.state.notes}	    		   
	    		   keyExtractor={({item,index}) => index}
	    		   ListFooterComponent={this.renderFooterComponent}
	    		   onEndReachedThreshold={0.01}
	    		   onEndReached={this.loadPromises}
	    		   refreshControl={<RefreshControl refreshing={false} onRefresh={this.handleRefresh} colors={['#000']} />}	   
	    		   renderItem={({item, index}) => {	    		   	
		    		   	return (
		    		   		<NoteItem onMenuClick={val => this.handleMenuClick(val, index)} onPress={() => this.onItemPress(index)} item={item} />		    		   	
		    		    )}
	    		   }
	    		/>
	    		<NoteReader ref={ref => this.mainReader = ref} onEdit={(i) => this.handleEditNote(i)} />
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
			notes
		} = this.state;
		const isInitial = offset == 0;
		if(!error && !fetched) {
			return (<Loading isInitial={isInitial} />)
		}else if(error){
			return (<Retry onRetry={this.loadNotes} entity={entity} isInitial={isInitial} />)
		}else if(notes.length == 0 || noMore){
			return (<NoItem entity={entity} isInitial={isInitial} />)
		}else {
			return (<View />)
		}
	}
}

class NoteItem extends PureComponent {	
	render() {
		const {
			note,			
			color,
			time,
			title		
		} = this.props.item;
		return (
			<TouchableNativeFeedback onPress={this.props.onPress}><View style={[sty.pItem, {backgroundColor:colors[color]}]}>
			  <Text numberOfLines={1} style={sty.nt}>{title}</Text>
			  <Text numberOfLines={3} style={sty.prms}>{note}</Text>
			  <Text numberOfLines={3} style={sty.dt}>{moment.unix(time).format("DD/MM/YY : hh:mm A")}</Text>

			    <Menu onSelect={this.props.onMenuClick} style={sty.icn}>
		          <MenuTrigger>
			          <Icon name="Menu" color="#fff" size={15} />
		          </MenuTrigger>
		          <MenuOptions>
		            <MenuOption value={0} text="See Full" />
		            <MenuOption value={1} text="Edit" />
		            <MenuOption value={2} text="Delete" />
		          </MenuOptions>
		        </Menu>

			</View></TouchableNativeFeedback>
		)
	}
}

class NoteReader extends PureComponent {
	constructor(props) {
		super(props)
		this.state = {
			note:{},
			reader:false,
			edit:true
		}
	}
	setNote = (note, i) => {
		this.setState({
			note,
			i
		}, () => {
			this.setState({reader:true})
		});
		var loggedId = 1;		
		if(note['edit'] == 1 && loggedId != note['user_id']){
			this.setState({edit:false})
		}
	}
	handleClose = (edit = true) => {
		this.reader?.zoomOut();
		setTimeout(() => {
			this.setState({note:{},reader:false});
			if(!edit)this.props.onEdit(this.state.i)			
		}, 400)
	}
	handleEdit = () => {
		this.handleClose(false)
	}	
	render() {
		const {
			note,			
			color,
			time,
			title		
		} = this.state.note;
		return (
			<Modal hardwareAccelerated animationType="fade" transparent visible={this.state.reader} onRequestClose={this.handleClose}>
			    <View style={{justifyContent:'center',backgroundColor:'#000000b4',flex:1}}>				
				<Animatable.View animation="zoomIn" duration={380} ref={ref => this.reader = ref} style={[sty.pItem, {backgroundColor:colors[color], maxHeight:'90%'}]}>
				  <Text style={[sty.nt,{fontSize:22}]}>{title}</Text>			  			  
				  <ScrollView style={{maxHeight:'90%'}}>
				    <Text style={[sty.prms, {fontSize:16}]}>{note}</Text>
				  </ScrollView>			  
				  <Text numberOfLines={3} style={[sty.dt,{fontSize:13}]}>{moment.unix(time).format("DD/MM/YY : hh:mm A")}</Text>
				  {this.state.edit ?
					<Ripple rippleColor="#fff" style={sty.icn} rippleContainerBorderRadius={60} onPress={this.handleEdit} >
					 <Icon name="edit" color="#fff" size={20} />
					</Ripple> :
				   <Text style={{fontSize:12,color:'#C9C9C9',position:'absolute',right:5,top:5}}>Your partner has set edit lock</Text>}
				</Animatable.View>
				</View>				
			</Modal>
		)
	}
}

const sty = StyleSheet.create({
	container:{height:constants.maxHeight2(),width:constants.width()},
	title:{height:AndroidUtilities.hps("12%"),paddingTop:Dimensions.get("STATUS_BAR_HEIGHT"),width:constants.width(),backgroundColor:'white',elevation:5,flexDirection:'row'},
	ttT:{fontSize:AndroidUtilities.fv(18),fontWeight:'500',color:'black'},
	ttC:{width:'70%',height:'100%',justifyContent:'center'},
	ttC2:{width:'15%',height:'100%',justifyContent:'center',alignItems:'center'},
	nt:{color,fontSize:20,width:'80%',fontFamily:'serif',marginVertical:5},
	prms:{color,fontSize:15,width:'90%',marginBottom:10,fontFamily:'sans-serif-light'},
	dt:{color,position:'absolute',right:5,bottom:3,fontSize:12,fontFamily:'serif'},
	pItem:{width:pItemW,padding:20,alignSelf:'center',borderRadius:7,marginVertical:10},
	icn:{height:30,width:30,justifyContent:'center',alignItems:'center',position:'absolute',right:0,top:5}
})