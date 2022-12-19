import { StyleSheet, Platform } from 'react-native';
import s from '../theme';
export const styles = StyleSheet.create({
  thumbnail: {
    flex:1,
    backgroundColor:s["default_s"].color,
  },
  icon: {
    position: 'absolute',    
    justifyContent:'center',
    alignItems:'center'
  }  
});
