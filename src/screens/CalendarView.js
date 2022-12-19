import React, { Component } from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	FlatList,
	StyleSheet,
	Animated,
	ActivityIndicator
} from 'react-native';
import ViewPager from '@react-native-community/viewpager';
import constants from 'libs/constants';
import {
	Icon,	
	s
} from 'components';
import {
	CheckBoxT,
	Dimensions,
	AndroidUtilities,
	DayNightSwitch	
} from 'ydc';
import * as Animtable from 'react-native-animatable';
const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAY = 0;
const NIGHT = 1;
const DC = 'white';
const NC = 'black';
const HH = AndroidUtilities.hp("7.31%");  //HeaderHeight
const CT = AndroidUtilities.hp("92.69%"); //Container
const WD = AndroidUtilities.wp("94.16%"); //Width Major
const OIW = WD / 7                        //One Item Width
const DSW = AndroidUtilities.wp("43.05%"); //Date Swipe Width
const DSF = AndroidUtilities.fv(20);
const VPH = (5 * OIW);
//Indicator Utilities
const IW = AndroidUtilities.wp("11.38%"); //Indicator width
const ML = AndroidUtilities.wp("3.88%");  //Indicator Margin
const SH = AndroidUtilities.hp("4.55%");  //Separator height
const IH = AndroidUtilities.hp("13.79%"); //Item Height
const EW = AndroidUtilities.wp("77.77%"); //Item Width
const ITP = ML + IW;
const GRY = "#707070";
const ITEMEVENTH = AndroidUtilities.hp("13.88%");
const MAXMONTH = 11;

function getCalendarForMonth(index, year){	
    var firstDay = new Date(year, index, 1).getDay();
    var lastDate = new Date(year, index + 1, 0).getDate();
    var dates = [];
    for(var i = 0; i < firstDay; i++)
    	dates.push('');

    for(var i = 1; i <= lastDate; i++)
    	dates.push(i);
    
    return dates;
}
export default class CalendarView extends Component {
	constructor(props) {
		super(props);
		this.state = {
			theme:DAY,
			modeC:new Animated.Value(0),
			events:[{type:"separator", text:"Loading Events..."}],
			calendar:[['...']],
			stickyHeaderIndices:[0],
			eSelectedIdx:1,
			currentYear:new Date().getFullYear(),
			eventLoading:false
		};
		this.indicator = [];
		this.date = [];
	}
	componentDidMount() {
		//Start Loading Events;			
		this.setState({
			events:eventDemo
		}, () => {
			let i = 0;
			let stickyHeaderIndices = [];
			this.state.events.forEach((event) => {
				if(event.type == 'separator')
					stickyHeaderIndices.push(i);
				i++;
			})
			this.setState({stickyHeaderIndices})
		})
		
	}
	changeTheme = () => {
		this.setState({theme:this.state.theme == DAY ? NIGHT : DAY}, () => {
			Animated.timing(this.state.modeC, {
				toValue:this.state.theme == DAY ? 0 : 10,
				useNativeDriver:false
			}).start()
		})		
	}
	changePage = (i) => {
		this.indicator[i].select();
		this.indicatorList?.scrollToIndex({ animated: true, index: i });		
	}
	onPageSelected = async ({nativeEvent}) => {	   
		this.setState({eventLoading:true})
	   this.dateSwipe.scroll(nativeEvent.position);
	   setTimeout(() => {
	   	   
	   	   let currentYear = this.state.currentYear;
		   const calendar = this.state.calendar;
		   const len = calendar.length;	   
		   if(nativeEvent.position == 0 && len == 1) {//Add First Current
			   	this.setState({calendar:[getCalendarForMonth(0,currentYear)]}, () => {
				   	setTimeout(() => {
				   		this.setState({calendar:[...this.state.calendar, getCalendarForMonth(1,currentYear)]});
				   	}, 2000)
				})
		    }else if((len - 1) < MAXMONTH){		   	
		   	this.setState({calendar:[...this.state.calendar, getCalendarForMonth(len, currentYear)]}, () => {	   
			   	if((len + 1) < MAXMONTH){
			   		this.setState({calendar:[...this.state.calendar, getCalendarForMonth(len + 1, currentYear)]});
			   	}
			 })				
		    }		   
		    let j = 0;
		    for (let i = 0; i < eventDemo.length; i++) {
				if (eventDemo[i].type != 'separator' && eventDemo[i].month == nativeEvent.position && eventDemo[i].year == currentYear){
					if(j==0)
						this.handleEventDate(i)			
					this.date[`${eventDemo[i].month}${eventDemo[i].day}`]?.dipatchEvents(eventDemo[i].color, i);
					j++;
				}
			}
			this.setState({eventLoading:false})
	   })
	}
	handleYearChange = (rector) => {		
		var currentYear = rector == 1 ? this.state.currentYear+1 : this.state.currentYear-1;
		setTimeout(() => {
			this.setState({currentYear,calendar:[]}, () => {
				this.onPageSelected({nativeEvent:{position:0}})
			});
		})		
	}

	handleEventDate = (eventIdx) => {
		this.indicator[this.state.eSelectedIdx]?.deselect();
		this.indicator[eventIdx].select();		
		this.indicatorList?.scrollToIndex({ animated: true, index: eventIdx });	
		this.setState({eSelectedIdx:eventIdx});
	}
	render() {	
		const {
			theme,
			events,
			stickyHeaderIndices,
			calendar,
			currentYear
		} = this.state;
		var color = this.state.modeC.interpolate({
	        inputRange: [0, 10],
	        outputRange: ['#ffffff', '#000000']
	    });
		return (
			<Animated.View style={[sty.container, {backgroundColor:color}]}>			 
			 <Animated.View style={{width:constants.width(),elevation:2,backgroundColor:color}}>
			 
			 <View style={sty.header}>
			  <View style={sty.hd1}>
			   <Text style={[sty.title, {color:theme == DAY ? NC : DC}]}>Calendar</Text>
			  </View>
			  <View style={sty.hd2}>
			   
			   <TouchableOpacity onPress={this.handleAddDay} style={sty.icon}>
			    <Icon name="add" color={theme == DAY ? NC : DC} size={AndroidUtilities.fv(16)} />
			   </TouchableOpacity>

			   <DayNightSwitch style={{width:AndroidUtilities.fv(60),height:AndroidUtilities.fv(30),marginRight:AndroidUtilities.fv(8)}} mode={this.state.theme} onChange={this.changeTheme}/>			   

			  </View>
			 </View>

			 <View style={sty.sep} />

			 <DateSwipe 
			   ref={ref => (this.dateSwipe = ref)} 
			   year={currentYear} 
			   color={theme == DAY ? NC : DC}
			   onYearChange={this.handleYearChange}
			 />
			 
			 <View style={sty.dayH}>
			  {days.map((day, id) => {
			  	return (
			  		<View style={sty.itm} key={id}>
					   <Text style={sty.itmt}>{day}</Text>
					</View>
			  	)
			  })}			  
			 </View>
			</Animated.View>

			<ViewPager ref={ref => this.viewPager = ref} onPageSelected={this.onPageSelected} style={{width:constants.width(),height:VPH}}>			
			{calendar.map((dates, month) => {
				return (
					<View key={month} style={{width:constants.width()}}>
						<View style={sty.dtsH}>
						  {dates.map((day, date) => {						  	
						  	if(day != '')
						  		return <DateItem onEvent={this.handleEventDate} date={day} ref={ref => this.date[`${month}${day}`] = ref} key={date}/>
						  	else
						  	    return <View style={sty.itm} />						  	
						    
						  })}			  
						</View>
					</View>
				)
			})}			
			</ViewPager>

			<FlatList
			 data={events}
			 keyExtractor={(item, index) => index.toString()}
			 stickyHeaderIndices={stickyHeaderIndices}
			 ref={ref => this.indicatorList = ref}			 
			 renderItem={({item, index}) => {
			 	if(item.type == 'separator'){
				 	return (
				 		<View style={[sty.flatSep, {backgroundColor:"#F7F7F7"}]}>
				 		 <Text style={sty.flatSt}>{item.text}  </Text>
				 		 {this.state.eventLoading ?  <ActivityIndicator size="small" color={GRY} /> : null}
						</View>
				 	)
				}else{
					return (
						<Indicator
						  title={item.title}
						  fromt={item.from}
						  to={item.to}
						  color={item.color}
						  onPress={() => this.changePage(index)}
						  ref={ref => this.indicator[index] = ref}
						/>
					)
				}
			 }}
			/>
		    </Animated.View>
		)
	}
}

class DateItem extends Component {
	constructor(props) {
		super(props);
		this.state = {
			events:[],
			indexes:[]
		}
	}
	dipatchEvents = (event, index) => {
		if(this.state.indexes.indexOf(index) == -1)
			this.setState({events:[...this.state.events, event],indexes:[...this.state.indexes, index]})
	}
	handleDatePress = () => {
		if(this.state.indexes.length > 0) {
			this.props.onEvent(this.state.indexes[0]);			
		}
	}
	render() {
		const {
			date
		} = this.props;
		return (
			<TouchableOpacity onPress={this.handleDatePress}><View style={sty.itm}>
			   <Text style={[sty.itmt, {paddingLeft:AndroidUtilities.fv(5)}]}>{date}</Text>
			   <View style={{position:'absolute',left:AndroidUtilities.fv(6),top:AndroidUtilities.fv(35),height:AndroidUtilities.fv(3),width:OIW,alignItems:'center',flexDirection:'row'}}>
			    {this.state.events.map((backgroundColor) => {
			    	return (			    		
			    		<Animtable.View animation="fadeIn" style={{width:AndroidUtilities.fv(5),height:AndroidUtilities.fv(5),backgroundColor,marginRight:1,borderRadius:10}} />			    					    		
			    	)
			    })}
			   </View>
			</View></TouchableOpacity>
		)
	}
}
class Indicator extends Component {
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
			Animated.timing(this.state.scale2, {
				toValue:1,
				duration:350,
				useNativeDriver:true
			}),			
			Animated.timing(this.state.scale, {
				toValue:1.2,
				duration:350,
				useNativeDriver:true
			})
		]).start()
	}
	deselect = () => {
		this.setState({selected:false})
		Animated.parallel([
			Animated.timing(this.state.translateX, {
				toValue:new Animated.Value(-IW),
				duration:150,
				useNativeDriver:true
			}),
			Animated.timing(this.state.scale2, {
				toValue:0,
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
			onPress,
			fromt,
			to,
			title,
			color
		} = this.props;
		return (
			<TouchableOpacity onPress={onPress} activeOpacity={0.8}>
			<Animtable.View animation='fadeIn' style={sty.itmE}>
	 		 <Animated.View style={{width:IW,height:AndroidUtilities.fv(1),backgroundColor:GRY,borderRadius:100, top:'54%',position:'absolute',
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
		      <View style={sty.itemEvent}>		       
		       <View style={{height:ITEMEVENTH,width:'100%',flexDirection:'row', ...constants.vcenter()}}>		        		        
		        <View style={{borderRadius:5,width:AndroidUtilities.fv(35),height:AndroidUtilities.fv(35),marginRight:AndroidUtilities.fv(15),backgroundColor:color,top:ITEMEVENTH/3}}/>
		        <View style={{width:'90%',height:'100%',...constants.vcenter()}}>
		         <Text numberOfLines={2} style={{fontSize:AndroidUtilities.fv(12)}}>{title}</Text>
		         <Text numberOfLines={1} style={{fontSize:AndroidUtilities.fv(10), color:GRY}}>{fromt} - {to}</Text>
		        </View>
		       </View>
		      </View>
			</Animtable.View></TouchableOpacity>
		)
	}
}
class DateSwipe extends Component {
	constructor(props){
		super(props);
		this.state = {
			idx:0,
			month:months			
		}
	}	
	scroll = (idx) => {
		this.flatList?.scrollToIndex({ animated: true, index: idx });		
	}
	render() {
		const {
			color,
			year
		} = this.props;
		return (
			<View style={{width:'100%',flexDirection:'row', justifyContent:'space-between',paddingHorizontal:AndroidUtilities.fv(12),marginBottom:AndroidUtilities.fv(5)}}>
			 
			 <TouchableOpacity style={{justifyContent:'center'}} onPress={() => this.props.onYearChange(-1)}>
			  <Text style={{fontSize:AndroidUtilities.fv(10),color}}>{'◄ '+(year-1)}</Text>
			 </TouchableOpacity>

			 <View style={{width:DSW}}>
			 <FlatList
			  horizontal
			  scrollEnabled={false}
			  showsHorizontalScrollIndicator={false}
			  ref={ref => this.flatList = ref}
			  data={this.state.month}
			  keyExtractor={(item, index) => index.toString()}
			  renderItem={({item}) => {return (
				  <View style={{width:DSW}}>
				  	<Text style={{fontSize:DSF,textAlign:'center',color}}>{item +' '+ year}</Text>
				  </View>
			  )}}
			 />
			 </View>

			 <TouchableOpacity style={{justifyContent:'center'}} onPress={() => this.props.onYearChange(1)}>
			  <Text style={{fontSize:AndroidUtilities.fv(10),color}}>{(year+1)+' ►'}</Text>
			 </TouchableOpacity>

			</View>
		)
	}
}
const sty = StyleSheet.create({
	itemEvent:{
		paddingLeft:ITP,
		height:'100%',
		justifyContent:'center',
		width:EW,
		flexDirection:'row'
	},
	container: {
		height:constants.maxHeight2(),
		width:constants.width()		
	},
	flatSep:{
		width:constants.width(),
		height:SH,
		alignItems:"center",
		flexDirection:'row'
	},
	itmE:{
		height:IH,
		paddingLeft:ML,
		width:AndroidUtilities.wp("94.44%"),
		borderLeftWidth:1,
		borderColor:GRY,
		alignSelf:'flex-end'		
	},
	flatSt:{
		fontSize:AndroidUtilities.fv(12),
		paddingLeft:AndroidUtilities.fv(12),
		fontWeight:'100',
		fontFamily:'sans-serif-light'

	},
	sep:{
		marginVertical:AndroidUtilities.fv(5),
		width:WD,
		alignSelf:'center',
		backgroundColor:'#EBEBEB',
		height:AndroidUtilities.fv(0.7)
	},
	header:{
		height:HH,
		width:constants.width(),
		flexDirection:'row',
		marginTop:Dimensions.get("STATUS_BAR_HEIGHT")
	},
	hd1:{
		height:"100%",
		width:AndroidUtilities.wp("42%"),
		justifyContent:'center',		
		paddingLeft:AndroidUtilities.fv(12)
	},
	hd2:{
		height:"100%",
		width:AndroidUtilities.wp("57%"),
		justifyContent:'flex-end',
		alignItems:"center",
		flexDirection:'row',
	},
	icon:{
		width:AndroidUtilities.fv(30),
		height:AndroidUtilities.fv(30),		
		backgroundColor:"#9e9e9e21",
		borderRadius:50,
		justifyContent:'center',
		alignItems:"center",		
		marginRight:AndroidUtilities.fv(8)
	},
	title:{
		fontSize:AndroidUtilities.fv(18),
		fontWeight:'bold'		
	},
	dayH:{		
		flexDirection:'row',
		width:WD,
		alignSelf:'center',
		marginLeft:AndroidUtilities.fv(12)
	},
	dtsH:{		
		flexDirection:'row',
		width:WD,
		alignSelf:'center',
		flexWrap:'wrap',
		marginLeft:AndroidUtilities.fv(12)
	},
	itm:{
		width:OIW,
		height:OIW,
		justifyContent:"center"			
	},	
	itmt:{
		fontSize:AndroidUtilities.fv(12),
		color:GRY
	}
})

const eventDemo = [
 {type:'separator', text:'Jan - Dec 2020 Events'},
 
 {title:'Coming Back to home',color:'#649FE4',type:0,from:1598596260, to:1598596269, day:16, month:0, year:2020},
 {title:'Our Engagment Very Excited',color:'#D364E4',type:0,from:1598596260, to:1598596269, day:22, month:0, year:2020},
 {title:'Marriage',color:'#8664E4',type:0,from:1598596260, to:1598596269, day:5, month:0, year:2020},
 {title:'Our Baby',color:'#B9E464',type:0,from:1598596260, to:1598596269, day:8, month:0, year:2020},
 
 {title:'Coming Back to home',color:'#649FE4',type:0,from:1598596260, to:1598596269, day:8, month:1, year:2020},
 {title:'Our Engagment Very Excited',color:'#D364E4',type:0,from:1598596260, to:1598596269, day:23, month:1, year:2020},
 {title:'Marriage',color:'#8664E4',type:0,from:1598596260, to:1598596269, day:10, month:1, year:2020},
 {title:'Our Baby',color:'#B9E464',type:0,from:1598596260, to:1598596269, day:7, month:1, year:2020},

 {title:'Coming Back to home',color:'#649FE4',type:0,from:1598596260, to:1598596269, day:7, month:2, year:2020},
 {title:'Our Engagment Very Excited',color:'#D364E4',type:0,from:1598596260, to:1598596269, day:7, month:2, year:2020},
 {title:'Marriage',color:'#8664E4',type:0,from:1598596260, to:1598596269, day:11, month:2, year:2020},
 {title:'Our Baby',color:'#B9E464',type:0,from:1598596260, to:1598596269, day:8, month:2, year:2020},

 {title:'Coming Back to home',color:'#649FE4',type:0,from:1598596260, to:1598596269, day:8, month:3, year:2020},
 {title:'Our Engagment Very Excited',color:'#D364E4',type:0,from:1598596260, to:1598596269, day:8, month:3, year:2020},
 {title:'Marriage',color:'#8664E4',type:0,from:1598596260, to:1598596269, day:11, month:3, year:2020},
 {title:'Our Baby',color:'#B9E464',type:0,from:1598596260, to:1598596269, day:8, month:3, year:2020},

]