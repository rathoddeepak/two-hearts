import React from 'react';
import {
	View	
} from 'react-native';
import {
	s,
	Icon
} from 'components';
import WheelPicker from './wheelPicker';
import AndroidUtilities from './AndroidUtilities';
import PropTypes, {
 boolean,
 integer,
 string,
 array
} from 'prop-types';
export default class WheelDatePicker extends React.Component {
	constructor(props){
		super(props)
		this.state = {
			current: new Date(),
			currentMonth:6,
			currentYear:43,
			currentDay:6,			
			days:["1", "2", "3", "4", "5", "6", "7"],
			months:["January","February","March","April","May","June","July","August","September","October","November","December"],
			years:["1960"]
		}
	}
	componentDidMount(){		
		let years = [];
		let currentYear = this.state.current.getYear() + 1900;
		let year = this.props.dateOfAge ? currentYear - 10 : currentYear;

		for(var i = 1960; i <= year; i++){
			years.push(i+"");
		}		
		this.setState({years}, () => {
			this.setState({
				days:this.calculateDays().tempDays
			});


			this.day.setSelectedItem(6);
			this.month.setSelectedItem(6);
			this.year.setSelectedItem(43);
		});		
	}
	calculateDays = () => {
		const {
			currentMonth,
			currentYear,
			years,			
			days
		} = this.state;
		let tempDays = [];		
		var nummberOfDays = new Date(parseInt(years[currentYear]), currentMonth+1, 0).getDate(); 		
		for(var i = 1; i <= nummberOfDays; i++){
			tempDays.push(i+"");			
		}		
		return {tempDays,nummberOfDays};
	}
	onDaySelected = (position) => {		
		this.setState({currentDay:position});
		this.props.onChange({
			day:this.state.days[position],
			month:this.state.months[this.state.currentMonth],
			year:this.state.years[this.state.currentYear],
		});
	}
	onMonthSelected = (position) => {
		this.setState({currentMonth:position}, this.formatSelection);
	}
	onYearSelected = (position) => {
		this.setState({currentYear:position}, this.formatSelection);		
	}
	formatSelection = () => {
		const {nummberOfDays, tempDays} = this.calculateDays();
		let currentDay = this.state.currentDay;
		if((nummberOfDays - 1) != this.state.days.length){
			currentDay = 0;
			if(this.state.currentDay > (nummberOfDays - 1)){//leap Year
				this.setState({currentDay:0}, () => {
					this.setState({
						days:tempDays
					})
				});
			}else{
				this.setState({days:tempDays});
			}
		}		
		this.props.onChange({
			day:tempDays[currentDay],
			month:this.state.months[this.state.currentMonth],
			year:this.state.years[this.state.currentYear],
		});		
	}
	render(){
		const {
			hasIcon,
			textSize
		} = this.props;	
		return (
			<View {...this.props}>
			{hasIcon ? 
			<View
			 ref={ref => this.day = ref}
			 style={{
			 	height:'100%',
			 	width:'20%',
			 	justifyContent:'center',
			 	alignItems:'center'
			 }}
			> 
			<Icon name="cake" color="black" size={AndroidUtilities.fv(25)} />
			</View> : null}

			<WheelPicker
			 ref={ref => this.day = ref}
			 style={{
			 	height:'100%',
			 	width:'20%'
			 }}
			 data={this.state.days}
			 selectedItemPosition={this.state.currentDay}
			 onItemSelected={this.onDaySelected}
			 textSize={textSize}
			/>	

			<WheelPicker
			 ref={ref => this.month = ref}
			 style={{
			 	height:'100%',
			 	width:hasIcon ? '40%' : '50%'
			 }}
			 data={this.state.months}
			 selectedItemPosition={this.state.currentMonth}
			 selectedItemTextColor={s[config.theme_s].color}
			 itemTextColor={s[config.theme_s].light}
			 onItemSelected={this.onMonthSelected}
			 textSize={textSize}
			/>		
			
			<WheelPicker
			 ref={ref => this.year = ref}
			 style={{
			 	height:'100%',
			 	width:hasIcon ? '20%' : '30%'
			 }}
			 data={this.state.years}
			 selectedItemTextColor={s[config.theme_s].color}
			 itemTextColor={s[config.theme_s].light}
			 selectedItemPosition={this.state.currentYear}
			 onItemSelected={this.onYearSelected}
			 textSize={textSize}
			/>

			</View>
		)
	}
}

WheelDatePicker.propTypes = {  
	hasIcon:boolean,
	textSize:integer,
	dateOfAge:boolean
};

WheelDatePicker.defaultProps = {
 hasIcon:true,
 textSize:60,
 dateOfAge:true
}