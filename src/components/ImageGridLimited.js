import React, {Component} from 'react';
import { 
  StyleSheet,
  Text,
  View    
} from 'react-native';
import FastImage from 'react-native-fast-image';
import constants from 'libs/constants';
import ImageView from './ImageView';
import { 
  AndroidUtilities
} from 'ydc';
const MAX_WIDTH = constants.width2();
const MAX_HEIGHT = AndroidUtilities.hps("35.103%");
const MAX_H2 = AndroidUtilities.hps("34%");

export default class ImageGridLimited extends Component {
  getImageDimension(idx){    
    const currentMatrix = this.props.photos.length - 1;      
    return matrix[currentMatrix][idx][0];
  }
  render(){
    return (
      <View style={sty.wrapper}>
       {this.props.photos.map((item, index) => {
        const {width, height} = this.getImageDimension(index);
        return (
          <ImageView
           borderRadius={0}
           style={{width,height}}
           source={item.url}
           thumbnail={item.thumbnail}
          />
        )
       })}
      </View>
    )
  }
}

const sty = StyleSheet.create({
  wrapper: {    
    flexWrap:'wrap',
    flexDirection:'row',
    width:'100%',    
    borderTopLeftRadius:10,
    borderTopRightRadius:10,
    overflow:'hidden'
  }
});

const matrix = [
       [
          [{width:MAX_WIDTH, height:MAX_HEIGHT}]
       ],
       [
         [{width:MAX_WIDTH/2, height:MAX_HEIGHT}],
         [{width:MAX_WIDTH/2, height:MAX_HEIGHT}]
       ],
       [
         [{width:MAX_WIDTH, height:MAX_HEIGHT/2}],
         [{width:MAX_WIDTH/2, height:MAX_HEIGHT/2}],
         [{width:MAX_WIDTH/2, height:MAX_HEIGHT/2}]
       ],
       [
         [{width:MAX_WIDTH, height:MAX_HEIGHT/2}],
         [{width:MAX_WIDTH/3, height:MAX_HEIGHT/3}],
         [{width:MAX_WIDTH/3, height:MAX_HEIGHT/3}],
         [{width:MAX_WIDTH/3, height:MAX_HEIGHT/3}]         
       ],
       [
         [{width:MAX_WIDTH/2, height:MAX_HEIGHT/2}],
         [{width:MAX_WIDTH/2, height:MAX_HEIGHT/2}],
         [{width:MAX_WIDTH/3, height:MAX_HEIGHT/3}],
         [{width:MAX_WIDTH/3, height:MAX_HEIGHT/3}],
         [{width:MAX_WIDTH/3, height:MAX_HEIGHT/3}]         
       ],
       [
         [{width:MAX_WIDTH, height:MAX_H2/3}],
         [{width:MAX_WIDTH/3, height:MAX_H2/3}],
         [{width:MAX_WIDTH/1.5, height:MAX_H2/3}],
         [{width:MAX_WIDTH/3, height:MAX_H2/3}],
         [{width:MAX_WIDTH/3, height:MAX_H2/3}],
         [{width:MAX_WIDTH/3, height:MAX_H2/3}]         
       ],
       [
         [{width:MAX_WIDTH/2, height:MAX_H2/3}],
         [{width:MAX_WIDTH/2, height:MAX_H2/3}],
         [{width:MAX_WIDTH/2, height:MAX_H2/3}],
         [{width:MAX_WIDTH/2, height:MAX_H2/3}],
         [{width:MAX_WIDTH/3, height:MAX_H2/3}],
         [{width:MAX_WIDTH/3, height:MAX_H2/3}],
         [{width:MAX_WIDTH/3, height:MAX_H2/3}],                  
       ],
       [
         [{width:MAX_WIDTH/1.5, height:MAX_H2/3}],
         [{width:MAX_WIDTH/3, height:MAX_H2/3}],
         [{width:MAX_WIDTH/3, height:MAX_H2/3}],
         [{width:MAX_WIDTH/3, height:MAX_H2/3}],
         [{width:MAX_WIDTH/3, height:MAX_H2/3}],
         [{width:MAX_WIDTH/3, height:MAX_H2/3}],
         [{width:MAX_WIDTH/3, height:MAX_H2/3}],
         [{width:MAX_WIDTH/3, height:MAX_H2/3}]                    
       ],
       [
         [{width:MAX_WIDTH/3, height:MAX_H2/3}],
         [{width:MAX_WIDTH/1.5, height:MAX_H2/3}],
         [{width:MAX_WIDTH/3, height:MAX_H2/3}],
         [{width:MAX_WIDTH/3, height:MAX_H2/3}],
         [{width:MAX_WIDTH/3, height:MAX_H2/3}],
         [{width:MAX_WIDTH/4, height:MAX_H2/3}],
         [{width:MAX_WIDTH/4, height:MAX_H2/3}],
         [{width:MAX_WIDTH/4, height:MAX_H2/3}],
         [{width:MAX_WIDTH/4, height:MAX_H2/3}]         
       ],
       [
         [{width:MAX_WIDTH/3, height:MAX_H2/3}],
         [{width:MAX_WIDTH/1.5, height:MAX_H2/3}],
         [{width:MAX_WIDTH/4, height:MAX_H2/3}],
         [{width:MAX_WIDTH/4, height:MAX_H2/3}],
         [{width:MAX_WIDTH/4, height:MAX_H2/3}],
         [{width:MAX_WIDTH/4, height:MAX_H2/3}],
         [{width:MAX_WIDTH/4, height:MAX_H2/3}],
         [{width:MAX_WIDTH/4, height:MAX_H2/3}],
         [{width:MAX_WIDTH/4, height:MAX_H2/3}],
         [{width:MAX_WIDTH/4, height:MAX_H2/3}]           
       ],
       [
         [{width:MAX_WIDTH/3, height:MAX_H2/3}],
         [{width:MAX_WIDTH/3, height:MAX_H2/3}],
         [{width:MAX_WIDTH/3, height:MAX_H2/3}],
         [{width:MAX_WIDTH/4, height:MAX_H2/3}],
         [{width:MAX_WIDTH/4, height:MAX_H2/3}],
         [{width:MAX_WIDTH/4, height:MAX_H2/3}],
         [{width:MAX_WIDTH/4, height:MAX_H2/3}],
         [{width:MAX_WIDTH/4, height:MAX_H2/3}],
         [{width:MAX_WIDTH/4, height:MAX_H2/3}],
         [{width:MAX_WIDTH/4, height:MAX_H2/3}],
         [{width:MAX_WIDTH/4, height:MAX_H2/3}]           
       ],
       [
         [{width:MAX_WIDTH/4, height:MAX_H2/3}],       
         [{width:MAX_WIDTH/4, height:MAX_H2/3}],
         [{width:MAX_WIDTH/4, height:MAX_H2/3}],
         [{width:MAX_WIDTH/4, height:MAX_H2/3}],
         [{width:MAX_WIDTH/4, height:MAX_H2/3}],
         [{width:MAX_WIDTH/4, height:MAX_H2/3}],
         [{width:MAX_WIDTH/4, height:MAX_H2/3}],
         [{width:MAX_WIDTH/4, height:MAX_H2/3}],
         [{width:MAX_WIDTH/4, height:MAX_H2/3}],
         [{width:MAX_WIDTH/4, height:MAX_H2/3}],
         [{width:MAX_WIDTH/4, height:MAX_H2/3}],
         [{width:MAX_WIDTH/4, height:MAX_H2/3}]           
       ],       
]