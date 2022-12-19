import React, {Component} from "react";
import {RecyclerListView, LayoutProvider, DataProvider} from "recyclerlistview";
import {View, Dimensions, Text, Image} from "react-native";
import FlightCard from "./FlightCard";
import FlightData from "./FlightData";
import HotelCard from "./HotelCard";
import TopWidget from "./TopWidget";
let {height, width} = Dimensions.get('window');
let tempChat = [];
let dataSource = new DataProvider((r1, r2) => {return r1 !== r2});
export default class FlightsPage extends Component {
    constructor(args) {
        super(args);
        this.state = {
            data:[
               {
                type: "FL_ITEM",
                values: {
                    imgUrl: "https://upload.wikimedia.org/wikipedia/commons/9/9a/Green_circle.png",
                    startTime: "5:45",
                    endTime: "8:35",
                    cost: "₹9,434",
                    duration: "2hr 45min",
                    stops: "Non Stop"
                }
               }
            ],
            dataProvider: dataSource.cloneWithRows(FlightData)
        };
        this._layoutProvider = new LayoutProvider((i) => {
            return this.state.dataProvider.getDataForIndex(i).type;
        }, (type, dim) => {
            switch (type) {
                case "HOTEL_ITEM":
                    dim.width = width;
                    dim.height = 83;
                    break;
                case "FL_ITEM":
                    dim.width = width;
                    dim.height = 80;
                    break;
                case "HEADER":
                    dim.width = width;
                    dim.height = 300;
                    break;
                default:
                    dim.width = width;
                    dim.height = 0;

            }
        });
        this._renderRow = this._renderRow.bind(this);
    }

    addItem = () => {        
        let odata = this.state.data;
        var data = {
        type: "FL_ITEM",
        values: {
            imgUrl: "https://upload.wikimedia.org/wikipedia/commons/9/9a/Green_circle.png",
            startTime: "5:45",
            endTime: "8:35",
            cost: "₹9,434",
            duration: "2hr 45min",
            stops: Math.random()
        }};
        odata.push(data)        
        this.setState({
            dataProvider:dataSource.cloneWithRows(odata)
        });
        if(this._listRef != null){
            this._listRef.scrollToEnd(true);
            console.log('asd')
        }  
    }

    removeItem = () => {
        let odata = this.state.data;
        if(odata.length > 0){
            odata.pop();
            this.setState({
                dataProvider:dataSource.cloneWithRows(odata)
            });
        }        
    }

    _renderRow(type, data) {
        switch (type) {
            case "HOTEL_ITEM":
                return <HotelCard/>
            case "FL_ITEM":
                return <FlightCard data={data}/>;
            case "HEADER":
                return <TopWidget data={data}/>;
            default:
                return null;

        }
    }    
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerText} onPress={this.addItem}>Add</Text>
                    <Text style={styles.headerText} onPress={this.removeItem}>Remove</Text>
                </View>
                <RecyclerListView 
                  ref={ref => this._listRef = ref }
                  rowRenderer={this._renderRow} 
                  dataProvider={this.state.dataProvider}
                  layoutProvider={this._layoutProvider}
                  onEndReached={this.handleEnd}
                />
            </View>
        )
    }
}
const styles = {
    container: {
        flex: 1,

    },
    header:{
        height: 65,
        backgroundColor:'orange',
        alignItems:"center",
        flexDirection:"row",
        elevation:4
    },
    headerText:{
        color:'white',
        fontSize:18,
        marginLeft: 16,
        paddingBottom:3
    },
    backIcon:{
        height:23,
        width:23,
        marginLeft:16

    }
}