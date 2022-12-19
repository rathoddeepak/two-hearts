import {StyleSheet} from 'react-native';
import {AsyncStorage} from 'react-native';

const s = [];
s["tw"] = StyleSheet.create({
	//padding
    p1:{padding:1},pr1:{paddingRight:1},pl1:{paddingLeft:1},pt1:{paddingTop:1},pb1:{paddingBottom:1},
	p2:{padding:2},pr2:{paddingRight:2},pl2:{paddingLeft:2},pt2:{paddingTop:2},pb2:{paddingBottom:2},
	p3:{padding:3},pr3:{paddingRight:3},pl3:{paddingLeft:3},pt3:{paddingTop:3},pb3:{paddingBottom:3},
	p4:{padding:4},pr4:{paddingRight:4},pl4:{paddingLeft:4},pt4:{paddingTop:4},pb4:{paddingBottom:4},
	p5:{padding:5},pr5:{paddingRight:5},pl5:{paddingLeft:5},pt5:{paddingTop:5},pb5:{paddingBottom:5},
	p6:{padding:6},pr6:{paddingRight:6},pl6:{paddingLeft:6},pt6:{paddingTop:6},pb6:{paddingBottom:6},
	p7:{padding:7},pr7:{paddingRight:7},pl7:{paddingLeft:7},pt7:{paddingTop:7},pb7:{paddingBottom:7},
	p8:{padding:8},pr8:{paddingRight:8},pl8:{paddingLeft:8},pt8:{paddingTop:8},pb8:{paddingBottom:8},
	p9:{padding:9},pr9:{paddingRight:9},pl9:{paddingLeft:9},pt9:{paddingTop:9},pb9:{paddingBottom:9},
	p10:{padding:10},pr10:{paddingRight:10}, pl10:{paddingLeft:10},pt10:{paddingTop:10},pb10:{paddingBottom:10},
	p15:{padding:15},pr15:{paddingRight:15}, pl15:{paddingLeft:15},pt15:{paddingTop:15},pb15:{paddingBottom:15},
	p20:{padding:20},pr20:{paddingRight:20}, pl20:{paddingLeft:20},pt20:{paddingTop:20},pb20:{paddingBottom:20},
	p25:{padding:25},pr25:{paddingRight:25}, pl25:{paddingLeft:25},pt25:{paddingTop:25},pb25:{paddingBottom:25},
	h100:{height:"100%"},
	w15:{width:"15%"},w20:{width:"20%"},w33:{width:"33.33%"},w100:{width:"100%"},
	centerItems:{justifyContent:"center",alignItems:'center'},selfCenter:{alignSelf:"center"},

	txdShd:{textShadowColor: 'black',textShadowOffset: { width: -1, height: 0 },textShadowRadius: 10}
});

s["default"] = StyleSheet.create({	
	//Colors
	color:{color:"#1da1f2"},
	bgColor:{backgroundColor:"#1da1f2"},

});
s["default_s"] = {
	blue:"#2E65C2",
	purple:"#9E37DD",
	orange:"#EF4D20",
	blue_light:"#EFDFFA",
	purple_light:"#1da1f2",
	orange_light:"#FDE2DB",	
	color:"#649FE4",
	light:"#A3C6F0",
	dim:"#B9D3F2",	
	grey:"#9e9e9e",
	selectionColor:"#649FE4b4",

};
export default s;