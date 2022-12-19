let Header = [
    {
        type: "HEADER",
        values: {
            toImage: "http://img.freeflagicons.com/thumb/glossy_wave_icon/singapore/singapore_640.png",
            fromImage: "http://img.freeflagicons.com/thumb/glossy_wave_icon/india/india_640.png"
        }
    }
];

let FlightData = [
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
];
export default Header.concat(FlightData);
