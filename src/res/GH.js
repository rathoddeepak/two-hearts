import {AsyncStorage} from 'react-native';
const KEY = "globalSpec";
const preConfig = {	
    theme_s:'default_s',
    theme:'default',
    appName:'TwoHearts',
    socketUrl:'http://192.168.43.250:2021',
    apiUrl:'http://192.168.43.250/TwoHearts/app_api.php?application=phone&type=',
    siteUrl:'http://192.168.43.250/TwoHearts/'
}
export default class GlobalHandler {
	init = () => {		
		global.config = preConfig;		
		AsyncStorage.getItem(KEY).then((value) => {				
		    if(null == value || value == '-1') {		    	
		    	global.loggedIn = false;		    	
		    	global.log_state = -1;	    	
		    }else{
		    	value = JSON.parse(value);		    	
		    	global.log_state = value['log_state'];		    	
		    	if(value['log_state'] == 1){//User Details
		    		global.loggedIn = true;
		    		global.fire_id = value['fire_id'];	    		
		    		global.phone_no = value['phone_no'];
		    	}else if(value['log_state'] == 2){//Partner Setup
		    		global.loggedIn = true;
					global.user_id = value['user']['id'];
					global.fire_id = value['fire_id'];
					global.user = value['user'];
					global.relation_code = value['user']['relation_code'];
					global.phone_no = value['phone_no'];
					global.tcode = value['user']['tcode'];
		    	}else if(value['log_state'] == 3){//Logged State
		    		global.loggedIn = true;
			    	global.user_id = value['user']['id'];
			    	global.partner_id = value['partner']['id'];
			    	global.fire_id = value['fire_id'];
			    	global.partner_fire_id = value['partner']['fire_id'];
			    	global.partner = value['partner'];
			    	global.user = value['user'];
			    	
			    	if(value['user']['relation_code'].length != 6){
			    		global.relation_code = value['partner']['relation_code'];
			    		user['relation_code'] = value['partner']['relation_code'];
			    		this.setUser2(user);
			    	}else{
			    		global.relation_code = value['user']['relation_code'];
			    	}

			    	global.phone_no = value['phone_no'];
		    	}else if(value['log_state'] == 5){		    		
		    		global.loggedIn = true;
		    		global.fire_id = value['fire_id'];	    		
		    		global.phone_no = value['phone_no'];
		    	}
		    }
		});		
	}

	setLaunchPage = (e) => {
		this.setAsyncData('launch_page', e);
		global.launch_page = e;
	}

	setPartner = (e) => {
		this.setAsyncData('partner', e);
		global.partner = e;
	}

	setUser = (e, connected) => {
		global.user_id = e['id'];
		if(connected)
			global.relation_code = e['relation_code'];
		else
			global.tcode = e['tcode'];
	}

	setUser2 = (e) => {
		this.setAsyncData('user', e);
		global.user = e;
	}

	setPartner = (e) => {
		global.partner_id = e['id'];
		global.partner_fire_id = e['fire_id']			
	}

	setPhoneNumber = (e) => {
		this.setAsyncData('phone_no', e);
		global.phone_no = e;
	}

	setFireId = (e) => {
		this.setAsyncData('fire_id', e);
		global.fire_id = e;
	}

	setPartnerFireId = (e) => {
		this.setAsyncData('partner_fire_id', e);
		global.partner_fire_id = e;
	}

	setLogState = (e) => {
		this.setAsyncData('log_state', e);		
		global.log_state = e;
	}

	setAsyncData = async (key, e) => {		
		await AsyncStorage.getItem(KEY).then((value) => {			
		    if(null == value || value == '-1') {		         
		    	value = {}
		    	value[key] = e;
		    }else{		    	
		    	value = JSON.parse(value);		    			    	
				var pair = {};pair[key] = e;
				value = {...value, ...pair};		    	
		    }		    
		    AsyncStorage.setItem(KEY, JSON.stringify(value))
		});
	}

	setMultiAsyncData = async (multiData) => {	    	    
		await AsyncStorage.getItem(KEY).then((value) => {			
		    if(null == value || value == '-1') {		         
		    	value = multiData;		    	
		    }else{		    	
		    	value = JSON.parse(value);		    			    	
				Object.keys(multiData).forEach(key => {
					global[key] = multiData[key];
					value[key] = multiData[key];					
				});	
		    }
		    AsyncStorage.setItem(KEY, JSON.stringify(value))
		});
		
	}

	logout = () => {
		AsyncStorage.setItem(KEY, '-1');		
	}
}