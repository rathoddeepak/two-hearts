import React from 'react';
import { Text } from 'react-native';
import { useTheme } from './CountryTheme';
import AndroidUtilities from 'ydc/AndroidUtilities'
export const CountryText = (props) => {    
    return (React.createElement(Text, Object.assign({}, props, { style: { fontSize:AndroidUtilities.fv(12), fontWeight:'bold', color: 'black' } })));
};
//# sourceMappingURL=CountryText.js.map