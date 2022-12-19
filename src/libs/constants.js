import {LayoutAnimation} from 'react-native';
import {
	AndroidUtilities,
	Dimensions
} from 'ydc';
const screenHeight = AndroidUtilities.hps("93.796%");
const screenHeight2 = AndroidUtilities.hp("100%");
const maxWidth     = Dimensions.get("REAL_WINDOW_WIDTH");
const maxHeight    = AndroidUtilities.hps("100%");
const maxHeight2   = AndroidUtilities.hp("100.2%");
const statusBar    = Dimensions.get("STATUS_BAR_HEIGHT");
const width2 = AndroidUtilities.wp("94.7%");

export default {
	center(){
		return {justifyContent: "center",alignItems:"center"}
	},
	colors(){
		return ["#333333","#5C1C4D", "#254917", "#161674", "#63230D", "#0D5263"];
	},
	vcenter(){
		return {justifyContent: "center"}
	},
	screenHeight(){
		return screenHeight;
	},
	screenHeight2(){
		return screenHeight2;
	},
	width(){
		return maxWidth;
	},
	statusBar(){
		return statusBar;
	},
	maxHeight(){
		return maxHeight
	},
	maxHeight2(){
		return maxHeight2
	},
	width2(){
		return width2
	},
	LayoutLinear(){ 
		return {
		  duration: 300,
		  create: {
		    type: LayoutAnimation.Types.linear,
		    property: LayoutAnimation.Properties.scaleXY,
		  },
		  update: {
		    type: LayoutAnimation.Types.linear,
		    property: LayoutAnimation.Properties.scaleXY,
		  },
		  delete: {
		    duration: 100,
		    type: LayoutAnimation.Types.linear,
		    property: LayoutAnimation.Properties.scaleX,
		  }
		}
	},
	OTHER1(){
		return 5
	}
}