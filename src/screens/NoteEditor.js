import React, { Component } from 'react';
import {
	View,
	StyleSheet,
	TextInput,
	Text,
	Keyboard,
	Animated,
	Modal,
	TouchableWithoutFeedback
} from 'react-native';
import {
	Ripple,
	Icon,
	LoadingModal,
	Switch
} from 'components'
import Dimensions from 'ydc/Dimensions';
import AndroidUtilities from 'ydc/AndroidUtilities';
import constants from 'libs/constants';
import moment from 'moment';
import UndoManager from 'libs/UndoManager';
import request from 'ydc/api';
import * as Animatable from 'react-native-animatable';
const IH = AndroidUtilities.hps("75%");
const AniTextInput = Animated.createAnimatedComponent(TextInput);
const colors = constants.colors();
export default class NodeEditor extends Component {
	constructor(props) {
		super(props);
		this.state = {
			note:'',
			title:'',
			sC:0,
			color:'#ffffff',
			inputHeight:new Animated.Value(IH),			
			bottom:new Animated.Value(0),
			canUndo:false,
			canRedo:false,
			edit:0
		},
		this.keyboardDidShowListener = null;
        this.keyboardDidHideListener = null;
	}	
	componentDidMount() {
		if(this.props.route.params.index != undefined){
			let note = this.props.route.params.note;			
			this.setState({
				note:note['note'],
				title:note['title'],
				sC:note['color'],
				edit:note['edit'],
				user_id:note['user_id'],
				noteObj:note,
				index:this.props.route.params.index
			})
		}
		this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
	}
	componentWillUnmount () {		
	    this.keyboardDidShowListener?.remove();
	    this.keyboardDidHideListener?.remove();
    }
    _keyboardDidShow = ({endCoordinates}) => {    	
    	Animated.parallel([
			Animated.timing(this.state.inputHeight, {
	    		toValue: (IH - endCoordinates.height),
	    		useNativeDriver:false,
	    		duration:300
	    	}),
	    	Animated.timing(this.state.bottom, {
	    		toValue:(constants.maxHeight2() - endCoordinates.screenY),
	    		useNativeDriver:false,
	    		duration:300
	    	})
		]).start();	
	}
	_keyboardDidHide = () => {		
		Animated.parallel([
			Animated.timing(this.state.inputHeight, {
	    		toValue:IH,
	    		useNativeDriver:false,
	    		duration:300
	    	}),
	    	Animated.timing(this.state.bottom, {
	    		toValue:0,
	    		useNativeDriver:false,
	    		duration:300
	    	})
		]).start();
	}
	handleChange = (note) => {		
		this.setState({note});
		if(UndoManager.current() !== note){
		    if ((note.length - UndoManager.current().length) > 1 || (note.length - UndoManager.current().length) < -1 || (note.length - UndoManager.current().length) === 0) {		      
		      UndoManager.record(note, true);		    
		    } else {		      
		      UndoManager.record(note);
		    }	
		}
		if(!this.state.canUndo)this.setState({canUndo:UndoManager.undo(true) != undefined});
		if(!this.state.canRedo)this.setState({canRedo:UndoManager.redo(true) != undefined});
	}
	handleTitleChange = (title) => {
		this.setState({title})
	}
	undo = () => {
		if(UndoManager.undo(true) !== undefined)this.setState({note:UndoManager.undo()}, () => {
			this.setState({
				canUndo:UndoManager.undo(true) != undefined,
				canRedo:UndoManager.redo(true) != undefined
			})
		});		
	};	
	redo = () => {
		if(UndoManager.redo(true) !== undefined)this.setState({note:UndoManager.redo()}, () => {
			this.setState({
				canUndo:UndoManager.undo(true) != undefined,
				canRedo:UndoManager.redo(true) != undefined
			})
		});		
	};
	handleShowColors =  () => {
		this.colorPicker.show();
	}
	colorSelect = (sC) => {
		this.setState({sC})
	}
	createNote = async () => {
		if(request.isBlank(this.state.title)){
			request.pop('Please enter title!');
			return;
		}else if(request.isBlank(this.state.note)){
			request.pop('Please enter note!');
			return;
		}else if(this.state.title.length == 1){
			request.pop('Titlte too short!');
			return;
		}
		this.loading?.show();
		var editM = this.state.noteObj != undefined;				
		var note = {
			color:this.state.sC,
		    note:this.state.note,
		    title:this.state.title,
		    edit:this.state.edit,
		    user_id:this.state.user_id == undefined ? user_id : this.state.user_id
	    };	    
		if(editM){
			var objectEdit = this.state.noteObj;			
			note['id'] = objectEdit['id'];		
		}
		var res = await request.perform('note_handler', {
			request:editM ? 'update' : 'create',
			relation_code,			
			offset:this.state.offset,
			...note		
		},"prms", false);			
		if(res)this.loading?.hide();
		if(res != 'fetch_error' && typeof res == 'object' && res.status == 200){
			if(editM){
				note['time'] = objectEdit['time'];				
				this.props.route.params?.onEdited(note, this.state.index);
				this.props.navigation.goBack();
			}else{
				let id = res.data.id;
				let time = res.data.time;				
				this.props.route.params?.onCreate({id,time,...note});
				this.props.navigation.goBack();
			}
			request.pop(`Note ${editM ? 'updated' : 'added'} successfully`);
		}else{
			request.pop(`Unable to ${editM ? 'update' : 'add'} note`);
		}
	}
	render() {
		const {
			title,
			note,
			color,
			sC,
			inputHeight,			
			bottom,
			canRedo,
			canUndo
		} = this.state;
		return (
			<View style={[sty.container, {backgroundColor:colors[sC]}]}>
			 <View style={sty.title}>
			     <Ripple rippleContainerBorderRadius={100} onPress={this.handleBack} style={sty.ttC2}>
				   <Icon name="back" color={color} size={25} />
				 </Ripple>				 
				 <View style={sty.ttB}>
				     <View style={{flexDirection: 'row'}}>
				      <Text style={{fontSize:16,color}}>Edit Lock   </Text>
				      <Switch value={this.state.edit} onSyncPress={b => this.setState({edit:b ? 1 : 0})}/>
				     </View>
					 <Ripple rippleContainerBorderRadius={100} onPress={this.handleShowColors} style={{...sty.ttC2,width:25,height:25,marginHorizontal:12}}>
					   <Icon name="palette" color={color} size={22} />
					 </Ripple>
					 <Ripple rippleContainerBorderRadius={100} onPress={this.createNote} style={{...sty.ttC2,width:25,height:25,marginHorizontal:12}}>
					   <Icon name="tick" color={color} size={25} />
					 </Ripple>
				 </View>
			 </View>

			 <TextInput			     
				 style={[sty.nt, {color}]} 
				 placeholder="Title"
				 showsVerticalScrollIndicator
				 placeholderTextColor={color + 'b4'} 
				 value={title}
				 maxLength={80}
				 onChangeText={this.handleTitleChange}
			 />
			 <AniTextInput			     
				 multiline 
				 style={[sty.prms, {color,height:inputHeight}]} 
				 placeholder="Note" 
				 placeholderTextColor={color + 'b4'} 
				 value={note}
				 maxLength={600}
				 onChangeText={this.handleChange}
			 />
			 <Animated.View style={[sty.bottomBar, {backgroundColor:colors[sC],bottom}]}>
				 <Ripple disabled={!canUndo} style={{marginHorizontal:10}} rippleColor="#fff" onPress={this.undo} rippleContainerBorderRadius={100}><Icon name="undo" size={30} color={canUndo ? color : color + 'b4'} /></Ripple>
				 <Ripple disabled={!canRedo} style={{marginHorizontal:10}} rippleColor="#fff" onPress={this.redo} rippleContainerBorderRadius={100}><Icon name="redo" size={30} color={canRedo ? color : color + 'b4'} /></Ripple>
			 </Animated.View>			 
			 <ColorPicker ref={ref => this.colorPicker = ref} onSelect={this.colorSelect}/>
			 <LoadingModal ref={ref => this.loading = ref}/>
			</View>
		)
	}
}

class ColorPicker extends Component {
	constructor(props){
		super(props);
		this.state = {			
			visible:false,
			sC:0
		}
	}
	show = () => {
		this.setState({visible:true})
	}
	hide = () => {
		this.colors.slideOutUp();
		setTimeout(() => {
			this.setState({visible:false})
		}, 420);	
	}
	selectColor = (sC) => {
		this.setState({sC})
		this.props.onSelect(sC);
	}
	render() {
		const {			
			visible,
			sC
		} = this.state;
		return (
			<Modal style={{flex:1}} onRequestClose={this.hide} transparent animationType="fade" visible={visible}>
			 <TouchableWithoutFeedback onPress={this.hide}><View style={sty.backLight}>
			  <Animatable.View duration={400} animation="slideInDown" ref={ref => this.colors = ref} style={sty.colors}>
			   {colors.map((backgroundColor, i) => {return(
			   	<Ripple rippleContainerBorderRadius={100} onPress={() => this.selectColor(i)} style={[sty.color, sC == i ? sty.clrS : {}, {backgroundColor}]} />
			   )})}
			  </Animatable.View>
			 </View></TouchableWithoutFeedback>
			</Modal>
		)
	}
}
const sty = StyleSheet.create({
	container:{height:constants.maxHeight2(),width:constants.width()},
	title:{height:AndroidUtilities.hps("12%"),paddingTop:Dimensions.get("STATUS_BAR_HEIGHT"),width:constants.width(),flexDirection:'row'},
	ttB:{flexDirection: 'row',height:AndroidUtilities.hps("12%")+Dimensions.get('STATUS_BAR_HEIGHT'),alignItems:'center',position:'absolute',right:0},
	ttC:{width:'70%',height:'100%',justifyContent:'center'},
	ttC2:{width:'15%',height:'100%',justifyContent:'center',alignItems:'center'},
	nt:{fontSize:24,width:'95%',fontFamily:'serif', alignSelf:'center'},
	prms:{fontSize:17,width:'95%',marginBottom:10, alignSelf:'center',textAlignVertical: 'top'},
	bottomBar:{position:'absolute',height:52,elevation:24,width:'100%',flexDirection:'row',justifyContent:'center',alignItems:'center'},
	backLight:{backgroundColor:'#000000b4',flex:1},
	colors:{width:'100%',height:40,flexDirection:'row',alignItems:'center',paddingTop:Dimensions.get("STATUS_BAR_HEIGHT")},	
	color:{width:40,height:40,borderRadius:100,marginHorizontal:10},
	clrS:{borderWidth:2, borderColor:'#fff'}
});