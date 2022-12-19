import React, { Component } from 'react';
import {
	View,
	Text,
	TouchableOpacity,	
	ScrollView,
	FlatList,
	StyleSheet,
	Animated
} from 'react-native';
import {
	Icon,
	ImageView,
	s,
	Ripple,
	NoItem
} from 'components';
import {
	CheckBoxT,
	WheelDatePicker,
	Dimensions,
	AndroidUtilities,
	DayNightSwitch,
	request
} from 'ydc';
import constants from 'libs/constants';
import ViewPager from '@react-native-community/viewpager';
import Datastore from 'react-native-local-mongodb';
import {
	GetToken,
	StoreToken,
	APPEND_FETCH,
	NEW_FETCH,
	FlushToken
} from 'components/token';
import moment from 'moment';
const SHWH = AndroidUtilities.wp("88.33%"); //SHolderWidthHorizontal
const SHWV = AndroidUtilities.wp("73.05%"); //SHolderWidthVertical
const SHHH = AndroidUtilities.hp("54.75%"); //SHolderHeightHorizontal
const SHHV = AndroidUtilities.hp("52.68%"); //SHolderHeightVertical

const IHWH = AndroidUtilities.wp("77.05%"); //ImageHolderWidthHorizontal
const IHWV = AndroidUtilities.wp("68.611%"); //ImageHolderWidthVertical
const IHH = AndroidUtilities.hp("18.06%"); //ImageHolderHeight

const TLHH = AndroidUtilities.hp("18.89%"); //TimeLineHeightHorizontal
const TLWV = AndroidUtilities.wp("24.72%"); //TimeLineWidthVertical
const TLHV = AndroidUtilities.hp("88.96%"); //TimeLineHeightVertical
const SPWH = AndroidUtilities.wp("75.28%"); //SpecialDayHolderWidthHorizontal

const SDHHH = AndroidUtilities.hp("49.24"); //SpecialDayHolderHeight 
const HH = AndroidUtilities.hp("7.31%"); //HeaderHeight
const CT = AndroidUtilities.hp("92.69%") //Container

const PHH = AndroidUtilities.hp("12.96%") //Indicator Height Horizontal
const PHH2 = AndroidUtilities.hp("12.30%") //Indicator Height Horizontal
const IC = AndroidUtilities.wp("40%");  //Indicator Width Horizontal
const SPW = AndroidUtilities.wp("80.05%"); //Indicator Width

const DAY = 0;
const NIGHT = 1;
const DC = 'white';
const NC = 'black';
const VHH = SHHH + TLHH; //viewpager height
const GRY = "#707070";
const VER = 0;
const HOR = 1;
//Vertical Indicator Extra
const VI = AndroidUtilities.wp("21.27%");
const VIH = AndroidUtilities.hp("22.48%");
const VIW = constants.width() - VI;
const VIM = AndroidUtilities.wp("3.61%");
const issuer = "sds";
const localDayDb = new Datastore({filename: 'sdsDB', autoload: true});
export default class SpecialDaysList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			theme:DAY,
			selectedIdx:0,
			mode:HOR,
			modeC:new Animated.Value(0),
			specailDays:[],
			isEmpty:false,
			mounted:true
		}
		this.indicator = [];
		this.isAtCurrentScreen = true;
	}
	componentDidMount() {
		//localDayDb.remove({}, { multi: true }, (err, numRemoved) => {});
	    //FlushToken();		
		GetToken(issuer, token => {
	        console.log("Token received :" + token);
	   	    this.setState({token});
			this.loadSpecialDays();
		    this.syncDb();
		    if(this.props.route.params?.addMode == true){
		    	this.handleAddDay();
		    	return;
		    }
		    if(this.props.route.params?.idx){
		     setTimeout(() => {
		     	this.changePage(this.props.route.params.idx)
		     }, 100)
		    }		    
	   });
	}
	handleInsertDay = (id, item, time) => {
		console.log("add item");
		item['_id'] = id;
		StoreToken(issuer, time);
		localDayDb.insert(item, (e, n) => {
			this.loadSpecialDays();
		});			
	}
	componentWillUnmount() {
		this.setState({mounted: false});
	}
	handleUpdateDay = (id, item, time) => {
		console.log("add item");
		item['_id'] = id;
		StoreToken(issuer, time);
		localDayDb.update({ _id: parseInt(id) }, { $set: item }, { multi: false }, (e, n) => {});
	}
	syncDb = async () => {     
        try{
			var res = await request.perform('specialdays_handler', {
				user_id,
				relation_code,
				store:"sds",
				request:"sync_z",				
				tk:this.state.token
			},"sds", false);				
			if(res != 'fetch_error'){
				if ('rs' in res){					
					localDayDb.remove({}, { multi: true }, (err, numRemoved) => {});
					this.setState({token:res.token});
					StoreToken(issuer, res.token);
					res.data.forEach(data => localDayDb.insert(data, (err, newDoc) => {}));					
					this.loadSpecialDays();
				}else if(res.length != 0){				        
				        StoreToken(issuer, res[0].tk);	    
						this.setState({token:res[0].tk}, () => {
							for (var i = 0; i < res.length; i++){							
								if(res[i].type == 'add_new'){
									localDayDb.insert(res[i]['new_data'], (e, n) => {});
								}else if(res[i].type == 'change'){						
									localDayDb.update({ _id: parseInt(res[i]._id) }, { $set: res[i].new_data }, { multi: false }, (e, n) => {});
								}else if(res[i].type == 'delete'){
									localDayDb.remove({ _id: parseInt(res[i]._id)}, {}, (e, n) => {});
								}else if(res[i].type == 'delete_multi'){
									res[i]._id.forEach(_id => localDayDb.remove({_id}, {}, (e, n) => {}));
								}
							}
							if (this.isAtCurrentScreen) {								      
				            	this.setState({loading:true,specailDays:[]}, () => {				            		
				            		this.loadSpecialDays()
				            	});				            	
				            }
							this.r();
						});				
						return;				
						
				}
				this.r();
				return;
			}else{
				this.r();
				return;
			}
		}catch(err) {			
			this.r();
		}        
    }

    r = () => {
		if(this.state.mounted)setTimeout(() => this.syncDb(), 5000);
	}

	loadSpecialDays = async (append = false) => {		
	    var offset = this.state.specailDays.length; 
	    if(append && offset == 0)
	    	return;	        	   
	    localDayDb.find({}).sort({ _id: -1 }).skip(append ? offset : 0).limit(30).exec((err, specailDays) => {	    	
	        if(specailDays.length == 0){
	        	if(offset == 0)this.setState({isEmpty:true});
	        	return;
	        }	           
            this.setState({loading:false})     	
        	if(offset == 0){        	        	    
        	    this.setState({specailDays});	        	    
        	}else{
        		if(append)
        			if(specailDays.length > 0)this.setState({specailDays:[...this.state.specailDays, ...specailDays],isEmpty:false})
        		else
        			this.setState({specailDays,isEmpty:false});        		
        	}        	
		}); 
	}

	dateSortPhotos(photos, checkDate = false, si, callback){		
	    let currentDate = {};	    
	    if(checkDate && this.state.photos.length > 0){
	    	if(this.state.photos[this.state.photos.length - 1]?.time != undefined)(currentDate = request.timeReadableObject(this.state.photos[this.state.photos.length - 1]?.time));
	    }	    
	    var todayObject = request.timeReadableObject();	    
	    var dateSorted = [];	      
	    for(var i = 0; i < photos.length; i++){	    	
	    	photos[i]['url'] = request.site_url()+photos[i]['url'];
 		    if(photos[i]['date'] != currentDate['date'] || photos[i]['month'] != currentDate['month'] || photos[i]['year'] != currentDate['year']){
		      currentDate = request.timeReadableObject(photos[i]['time']);
		      if(todayObject['date'] == photos[i]['date'] && todayObject['month'] == photos[i]['month'] && todayObject['year'] == photos[i]['year']){
		        dateSorted.push({type:'separator', title:'Today'});
		      }else if(todayObject['date'] - 1 == photos[i]['date'] && todayObject['month'] == photos[i]['month'] && todayObject['year'] == photos[i]['year']){
		        dateSorted.push({type:'separator', title:'Yesterday'});		        
		      } else {		      	
		        var title = `${request.ordinal(photos[i]['date'])} ${request.month(photos[i]['month'])} ${photos[i]['year']}`;
		        dateSorted.push({type:'separator', title:title});
		      }		      		      	      		      		     
		    }
		    dateSorted.push(photos[i]);
	    }	    	    
	    callback(dateSorted);	    
	}

	onPageSelected = ({nativeEvent}) => {
	   if(nativeEvent.position == -1 && this.state.specailDays.length > nativeEvent.position)return;
	   this.indicatorFL?.scrollToIndex({ animated: true, index: nativeEvent.position });
	   this.indicator[this.state.selectedIdx]?.deselect();
		this.setState({selectedIdx:nativeEvent.position}, () => {
			this.indicator[nativeEvent.position]?.select();
		})	
	}
	
	changePage(index){
		 this.viewPager.setPage(index);
	}

	changeView = () => {
		if(this.state.mode == VER){
			this.cv.hor();
			this.setState({mode:HOR})
		}else{
			this.cv.ver();
			this.setState({mode:VER})
		}
		setTimeout(() => {
			this.viewPager.setPage(0);
		}, 350)
	}
	changeTheme = () => {
		this.setState({theme:this.state.theme == DAY ? NIGHT : DAY}, () => {
			Animated.timing(this.state.modeC, {
				toValue:this.state.theme == DAY ? 0 : 10,
				useNativeDriver:false
			}).start()
		})		
	}
	handleAddDay = () => {
		this.props.navigation.navigate('AddSpecialDay', {
			onAddDay:this.handleInsertDay
		});
	}
	handleEditdDay(item){
		this.props.navigation.navigate('AddSpecialDay', {
			item,
			onAddDay:this.handleUpdateDay
		});
	}
	render() {
		const {
			theme,			
			selectedIdx,
			specailDays,
			mode,
			isEmpty
		} = this.state;
		var color = this.state.modeC.interpolate({
	        inputRange: [0, 10],
	        outputRange: ['#ffffff', '#000000']
	    });	    
		return (
			<Animated.View style={[sty.container, {backgroundColor:color}]}>			 
			 <View style={sty.header}>
			  <View style={sty.hd1}>
			   <Text style={[sty.title, {color:theme == DAY ? NC : DC}]}>Special Days</Text>
			  </View>
			  <View style={sty.hd2}>
			   
			   <TouchableOpacity onPress={this.handleAddDay} style={sty.icon}>
			    <Icon name="add" color={theme == DAY ? NC : DC} size={AndroidUtilities.fv(16)} />
			   </TouchableOpacity>

			   <View style={sty.icon}>
			    <CV
			     onPress={this.changeView}
			     color={theme == DAY ? NC : DC}
			     ref={ref => this.cv = ref}
			     disabled={isEmpty}
			     size={AndroidUtilities.fv(16)}
			    />			    
			   </View>
			   
			   <DayNightSwitch style={{width:AndroidUtilities.fv(60),height:AndroidUtilities.fv(30),marginRight:AndroidUtilities.fv(8)}} mode={this.state.theme} onChange={this.changeTheme}/>			   

			  </View>
			 </View>
			 {isEmpty ?
			 <NoItem entity="Special Days" isInitial={true} />:
			 <View>
			 {mode == VER ?
			 <View style={sty.holder2}>			    
			    <View style={sty.vph}>
			      <ViewPager ref={ref => this.viewPager = ref} orientation="vertical" style={{width:'100%',height:"100%"}} onPageSelected={this.onPageSelected}>
				    {specailDays.map((data, idx) => {return (
				    	<View key={idx} style={{height:'100%',width:"100%",justifyContent:'center'}}>
				          <View style={{borderColor:"#D5D5D5",width:SHWV,height:SHHV,borderWidth:1,borderRadius:5}}>
					        
					        <Text style={{fontSize:AndroidUtilities.fv(12),fontWeight:'bold',color:theme == DAY ? NC : DC,textAlign:"center",marginVertical:AndroidUtilities.fv(15)}} numberOfLines={3}>{data.tt}</Text>

					        <Text style={{fontSize:AndroidUtilities.fv(10),fontWeight:'bold',color:theme == DAY ? NC : DC,textAlign:"center",marginBottom:AndroidUtilities.fv(5)}} numberOfLines={1}>Whole Day</Text>					        
					        
					        <View style={{marginVertical:AndroidUtilities.fv(8),width:IHWV,height:IHH,justifyContent:'center',alignItems:'center',alignSelf:'center'}}>
					        <Text style={{fontSize:AndroidUtilities.fv(12),color:GRY,textAlign:"center",maxWidth:SPW}} numberOfLines={4}>{data.ab}</Text>					        
					        </View>

					        <View style={{flexDirection: 'row',width:'100%',flexWrap: 'wrap',marginVertical:AndroidUtilities.fv(10)}}>
					         
					         <View style={{flexDirection: 'row',width:'50%',justifyContent:'center',marginVertical:AndroidUtilities.fv(10)}}>
						         <Icon name="clock" color={GRY} size={AndroidUtilities.fv(16)} />
						         <Text numberOfLines={1} style={{fontSize:AndroidUtilities.fv(10),width:'57%',color:GRY,marginLeft:AndroidUtilities.fv(10)}}>While Day</Text>
					         </View>

					         <View style={{flexDirection: 'row',width:'50%',justifyContent:'center',marginVertical:AndroidUtilities.fv(10)}}>
						         <Icon name="calendar" color={GRY} size={AndroidUtilities.fv(16)} />
						         <Text numberOfLines={1} style={{fontSize:AndroidUtilities.fv(10),width:'57%',color:GRY,marginLeft:AndroidUtilities.fv(10)}}>{moment(parseInt(data.dt) * 1000).format('DD-MM-YYYY')}</Text>
					         </View>

					         <View style={{flexDirection: 'row',width:'50%',justifyContent:'center',marginVertical:AndroidUtilities.fv(10)}}>
						         <CheckBoxT
								  ref={ref => this.checkBox = ref}
								  onChange={bool => {}}
								  checked={this.state.selected}
								  type={7}

								  size={AndroidUtilities.fv(20)} 
								  count={this.state.count}
								  colorMap = {{
								    background:"#f2f2f2",
								    background2:"#00000000",
								    check:"#9e9e9e",
								    disabled:"yellow"
								  }}
								/> 
						         <Text numberOfLines={1} style={{fontSize:AndroidUtilities.fv(10),width:'57%',color:GRY,marginLeft:AndroidUtilities.fv(10)}} numberOfLines={3}>Repeat</Text>
					         </View>

					         <View style={{flexDirection: 'row',width:'50%',justifyContent:'center',marginVertical:AndroidUtilities.fv(10)}}>
						         <Icon name="add_calendar" color={GRY} size={AndroidUtilities.fv(16)} />
						         <Text numberOfLines={1} style={{fontSize:AndroidUtilities.fv(10),width:'57%',color:GRY,marginLeft:AndroidUtilities.fv(10)}}>Add to calendar</Text>
					         </View>					         

					        </View>

					        <Ripple rippleContainerBorderRadius={100} style={{
								  position:'absolute',
								  bottom:5,			  
								  borderRadius:100,
								  right:AndroidUtilities.fv(50),
								  backgroundColor:GRY + "21",
								  width:AndroidUtilities.fv(30),
								  height:AndroidUtilities.fv(30),
								  ...constants.center()
								 }}>
								  <Icon name="trash" color={GRY} size={AndroidUtilities.fv(14)} />
						   </Ripple>

						   <Ripple onPress={() => this.handleEditdDay(data)} rippleContainerBorderRadius={100} style={{
								  position:'absolute',
								  bottom:5,			  
								  borderRadius:100,
								  right:10,
								  backgroundColor:GRY + "21",
								  width:AndroidUtilities.fv(30),
								  height:AndroidUtilities.fv(30),
								  ...constants.center()
								 }}>
								  <Icon name="edit" color={GRY} size={AndroidUtilities.fv(14)} />
						   </Ripple>
						   
					      </View>	
				      </View>
				    )})}				      
				    </ViewPager>
			    </View>
			    <View style={sty.idh}>
			        <FlatList				     
				     data={specailDays}
				     ref={ref => this.indicatorFL = ref}
				     showsVerticalScrollIndicator={false}
				     keyExtractor={(item,index) => index.toString()}
				     renderItem={({item, index}) => 
				      <IndicatorV date={item.dt} title={item.tt} onPress={() => this.changePage(index)} ref={ref => this.indicator[index] = ref}  />				      
				     }
				    />			     
			    </View>
			 </View>
			 : <View style={sty.holder}>
			    <View style={{width:constants.width(),height:VHH}}>
				    <ViewPager ref={ref => this.viewPager = ref} orientation="horizontal" style={{width:constants.width(),height:SHHH}} onPageSelected={this.onPageSelected}>
				    {specailDays.map((data, idx) => {return (
				    	<View key={idx} style={{height:'100%',width:"100%",alignItems:'center'}}>
				          <View style={{borderColor:"#D5D5D5",width:SHWH,height:"100%",borderWidth:1,borderRadius:5}}>
					        
					        <Text style={{fontSize:AndroidUtilities.fv(14),fontWeight:'bold',color:theme == DAY ? NC : DC,textAlign:"center",marginVertical:AndroidUtilities.fv(15)}} numberOfLines={3}>{data.tt}</Text>

					        <Text style={{fontSize:AndroidUtilities.fv(12),fontWeight:'bold',color:theme == DAY ? NC : DC,textAlign:"center",marginBottom:AndroidUtilities.fv(5)}} numberOfLines={1}>Whole Day</Text>
					        <View style={{marginVertical:AndroidUtilities.fv(8),width:IHWH,alignSelf:'center',height:IHH,justifyContent:'center',alignItems:'center'}}>
					        <Text style={{fontSize:AndroidUtilities.fv(12),color:GRY,textAlign:"center",maxWidth:SPW}} numberOfLines={4}>{data.ab}</Text>					        
					        </View>
					        <View style={{flexDirection: 'row',width:'100%',flexWrap: 'wrap',marginVertical:AndroidUtilities.fv(10)}}>
					         
					         <View style={{flexDirection: 'row',width:'50%',justifyContent:'center',marginVertical:AndroidUtilities.fv(10)}}>
						         <Icon name="clock" color={GRY} size={AndroidUtilities.fv(16)} />
						         <Text numberOfLines={1} style={{fontSize:AndroidUtilities.fv(10),width:'57%',color:GRY,marginLeft:AndroidUtilities.fv(10)}}>Whole Day</Text>
					         </View>					         

					         <View style={{flexDirection: 'row',width:'50%',justifyContent:'center',marginVertical:AndroidUtilities.fv(10)}}>
						         <Icon name="calendar" color={GRY} size={AndroidUtilities.fv(16)} />
						         <Text numberOfLines={1} style={{fontSize:AndroidUtilities.fv(10),width:'57%',color:GRY,marginLeft:AndroidUtilities.fv(10)}}>{moment(parseInt(data.dt) * 1000).format('DD-M-YYYY')}</Text>
					         </View>

					         <View style={{flexDirection: 'row',width:'50%',justifyContent:'center',marginVertical:AndroidUtilities.fv(10)}}>
						         <Icon name="add_calendar" color={GRY} size={AndroidUtilities.fv(16)} />
						         <Text numberOfLines={1} style={{fontSize:AndroidUtilities.fv(10),width:'57%',color:GRY,marginLeft:AndroidUtilities.fv(10)}}>Add to calendar</Text>
					         </View>

					         {/*<View style={{flexDirection: 'row',width:'50%',justifyContent:'center',marginVertical:AndroidUtilities.fv(10)}}>
						         <CheckBoxT
								  ref={ref => this.checkBox = ref}
								  onChange={bool => {}}
								  checked={this.state.selected}
								  type={7}
								  size={AndroidUtilities.fv(20)} 
								  count={this.state.count}
								  colorMap = {{
								    background:"#f2f2f2",
								    background2:"#00000000",
								    check:"#9e9e9e",
								    disabled:"yellow"
								  }}
								/> 
						         <Text numberOfLines={1} style={{fontSize:AndroidUtilities.fv(10),width:'57%',color:GRY,marginLeft:AndroidUtilities.fv(10)}} numberOfLines={3}>Repeat</Text>
					         </View>*/}				        
					         					        
					        </View>

					        <Ripple rippleContainerBorderRadius={100} style={{
								  position:'absolute',
								  bottom:5,			  
								  borderRadius:100,
								  right:AndroidUtilities.fv(50),
								  backgroundColor:GRY + "21",
								  width:AndroidUtilities.fv(30),
								  height:AndroidUtilities.fv(30),
								  ...constants.center()
								 }}>
								  <Icon name="trash" color={GRY} size={AndroidUtilities.fv(14)} />
						   </Ripple>

						   <Ripple onPress={() => this.handleEditdDay(data)} rippleContainerBorderRadius={100} style={{
								  position:'absolute',
								  bottom:5,			  
								  borderRadius:100,
								  right:10,
								  backgroundColor:GRY + "21",
								  width:AndroidUtilities.fv(30),
								  height:AndroidUtilities.fv(30),
								  ...constants.center()
								 }}>
								  <Icon name="edit" color={GRY} size={AndroidUtilities.fv(14)} />
						   </Ripple>

					      </View>	
				      </View>
				    )})}				      
				    </ViewPager>
				    <View style={{width:constants.width(),height:TLHH}}>
				    <FlatList
				     horizontal
				     data={specailDays}
				     ref={ref => this.indicatorFL = ref}
				     showsHorizontalScrollIndicator={false}
				     keyExtractor={(item,index) => index.toString()}
				     renderItem={({item, index}) => 
				      <Indicator title={item.tt} date={item.dt} onPress={() => this.changePage(index)} ref={ref => this.indicator[index] = ref} />
				     }
				    />
				    </View>
			    </View>
			 </View>}
			 </View>}
			</Animated.View>
		)
	}
}
class CV extends Component {
	constructor(props) {
		super(props)
		this.state = {
			x:new Animated.Value(this.props.size/2.2),
			y:new Animated.Value(0),
		}
	}
	hor(){
		Animated.parallel([
			Animated.spring(this.state.x, {
				toValue:this.props.size/2.2,
				useNativeDriver:true
			}),
			Animated.spring(this.state.y, {
				toValue:0,
				useNativeDriver:true
			})
		]).start();
	}
	ver(){
		Animated.parallel([
			Animated.spring(this.state.x, {
				toValue:0,
				useNativeDriver:true
			}),
			Animated.spring(this.state.y, {
				toValue:-(this.props.size/2.2),
				useNativeDriver:true
			})
		]).start();
	}
	render() {
		const {
			color,
			size,
			onPress,
			disabled
		} = this.props;
		return (
			<TouchableOpacity disabled={disabled} activeOpacity={0.8} onPress={onPress}>
			 <Animated.View style={{width:AndroidUtilities.fv(1.5),height:size,backgroundColor:color,borderRadius:10,
			 	transform:[{translateX:this.state.x}],
			 	opacity:disabled ? 0.6 : 1
			 }} />
			 <Animated.View style={{width:size,height:AndroidUtilities.fv(1.5),backgroundColor:color,borderRadius:10,
			 	transform:[{translateY:this.state.y}],
			 	opacity:disabled ? 0.6 : 1
			 }} />
			</TouchableOpacity>
		)
	}
}
class IndicatorV extends Component {	
	constructor(props) {
		super(props)
		this.state = {
			selected:false,
			translateX:new Animated.Value(0),
			translateY:new Animated.Value(0),
			scale:new Animated.Value(1),
			scale2:new Animated.Value(0),
			scale3:new Animated.Value(1)
		}
	}	
	select = () => {
		this.setState({selected:true})
		Animated.parallel([
			Animated.timing(this.state.translateX, {
				toValue:0,
				duration:350,
				useNativeDriver:true
			}),
			Animated.timing(this.state.translateY, {
				toValue:AndroidUtilities.fv(-10),
				duration:350,
				useNativeDriver:true
			}),
			Animated.timing(this.state.scale2, {
				toValue:1,
				duration:350,
				useNativeDriver:true
			}),			
			Animated.timing(this.state.scale, {
				toValue:1.2,
				duration:350,
				useNativeDriver:true
			}),
		]).start()
	}
	deselect = () => {
		this.setState({selected:false})
		Animated.parallel([
			Animated.timing(this.state.translateX, {
				toValue:new Animated.Value(-VI),
				duration:150,
				useNativeDriver:true
			}),
			Animated.timing(this.state.translateY, {
				toValue:0,
				duration:150,
				useNativeDriver:true
			}),
			Animated.timing(this.state.scale2, {
				toValue:0,
				duration:350,
				useNativeDriver:true
			}),
			Animated.timing(this.state.scale3, {
				toValue:1,
				duration:350,
				useNativeDriver:true
			}),			
			Animated.timing(this.state.scale, {
				toValue:1,
				duration:150,
				useNativeDriver:true
			}),
		]).start()
	}
	render() {
		const {
			date,
			onPress,
			title
		} = this.props;
		return (
			<TouchableOpacity activeOpacity={0.8} onPress={onPress}><View style={{width:VIW,left:VIM,height:SHHV}} activeOpacity={0.7} onPress={onPress}>
		      <View style={{borderLeftWidth:1,borderColor:GRY,height:'100%',justifyContent:'center'}}>
		       <Animated.Text numberOfLines={2} style={{width:'75%',fontSize:this.state.selected ? AndroidUtilities.fv(8) : AndroidUtilities.fv(11),color:GRY,fontWeight:this.state.selected ? 'bold' : 'normal',marginLeft:AndroidUtilities.fv(7), 
		        transform:[		         
		         {translateY:this.state.translateY},
		         {scale:this.state.scale3},
		        ]
		       }}>{this.state.selected ? moment(parseInt(date) * 1000).format('DD-MM-YYYY') : title}</Animated.Text>
		      </View>	          

		      <Animated.View style={{width:VI,height:AndroidUtilities.fv(1),backgroundColor:GRY,borderRadius:100, top:'50%',position:'absolute',
		      transform:[
			      {translateX:this.state.translateX},
			      {scale:this.state.scale2},
		      ]
		      }} />

		       <Animated.View style={{width:AndroidUtilities.fv(10),height:AndroidUtilities.fv(10),backgroundColor:GRY,borderRadius:100,position:'absolute',top:'48.5%',
		      left:-AndroidUtilities.fv(5),
		      transform:[
			      {scale:this.state.scale}
		      ]
		      }} />
		     </View></TouchableOpacity>
		)
	}
}

class Indicator extends Component {	
	constructor(props) {
		super(props)
		this.state = {
			selected:false,
			translateY:new Animated.Value(PHH),
			scale:new Animated.Value(1),
			scale2:new Animated.Value(0),
		}
	}	
	select = () => {
		this.setState({selected:true})
		Animated.parallel([
			Animated.timing(this.state.translateY, {
				toValue:new Animated.Value(0),
				duration:350,
				useNativeDriver:true
			}),
			Animated.timing(this.state.scale2, {
				toValue:new Animated.Value(1),
				duration:350,
				useNativeDriver:true
			}),
			Animated.timing(this.state.scale, {
				toValue:new Animated.Value(1.2),
				duration:350,
				useNativeDriver:true
			}),
		]).start()
	}
	deselect = () => {
		this.setState({selected:false})
		Animated.parallel([
			Animated.timing(this.state.translateY, {
				toValue:new Animated.Value(PHH),
				duration:150,
				useNativeDriver:true
			}),
			Animated.timing(this.state.scale2, {
				toValue:new Animated.Value(0),
				duration:350,
				useNativeDriver:true
			}),
			Animated.timing(this.state.scale, {
				toValue:new Animated.Value(1),
				duration:150,
				useNativeDriver:true
			}),
		]).start()
	}
	render() {
		const {
			date,
			onPress,
			title
		} = this.props;
		return (
			<TouchableOpacity style={{width:IC}} activeOpacity={0.7} onPress={onPress}>
		      <Animated.View style={{width:AndroidUtilities.fv(1),height:PHH,backgroundColor:GRY,borderRadius:100, left:'54%',position:'absolute', 
		      transform:[
			      {translateY:this.state.translateY},
			      {scale:this.state.scale2},
		      ]
		      }} />		      
		      <View style={{paddingTop:AndroidUtilities.fv(12),borderTopWidth:1,borderColor:GRY,marginTop:PHH,alignItems:'center'}}>
		       <Text numberOfLines={1} style={{fontSize:AndroidUtilities.fv(11),color:GRY,fontWeight:this.state.selected ? 'bold' : 'normal'}}>{this.state.selected ? moment(parseInt(date) * 1000).format('DD-MM-YYYY') : title}</Text>
		      </View>	          
		      <Animated.View style={{width:AndroidUtilities.fv(10),height:AndroidUtilities.fv(10),backgroundColor:GRY,borderRadius:100,position:'absolute',top:PHH2, left:'50%',
		      transform:[
			      {scale:this.state.scale}
		      ]
		      }} />
		     </TouchableOpacity>
		)
	}
}

const sty = StyleSheet.create({
	container: {
		height:constants.maxHeight2(),
		width:constants.width()		
	},
	holder:{
	    height:CT,
		width:constants.width(),
		justifyContent:'center',
		alignItems:"center"
	},
	holder2:{
		height:CT,
		width:constants.width()		
	},
	idh:{		
		height:TLHV,
		width:AndroidUtilities.wp("70%"),
		position:'absolute',
		bottom:0,
		left:0			
	},
	vph:{
		width:SPWH,
		height:TLHV,
		left:TLWV			
	},
	header:{
		height:HH,
		width:constants.width(),
		flexDirection:'row',		
		marginTop:Dimensions.get("STATUS_BAR_HEIGHT")
	},
	title:{
		fontSize:AndroidUtilities.fv(18),
		fontWeight:'bold'		
	},
	hd1:{
		height:"100%",
		width:AndroidUtilities.wp("42%"),
		justifyContent:'center',
		alignItems:"center"
	},
	hd2:{
		height:"100%",
		width:AndroidUtilities.wp("57%"),
		justifyContent:'flex-end',
		alignItems:"center",
		flexDirection:'row'
	},
	icon:{
		width:AndroidUtilities.fv(30),
		height:AndroidUtilities.fv(30),		
		backgroundColor:"#9e9e9e21",
		borderRadius:50,
		justifyContent:'center',
		alignItems:"center",		
		marginRight:AndroidUtilities.fv(8)
	}	
});