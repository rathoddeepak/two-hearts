"use strict";

import React, {
    Component,    
} from 'react';
import PropTypes from 'prop-types';
import {
    requireNativeComponent,
    View,
    UIManager,
    findNodeHandle
} from 'react-native';

export default class AndroidCircularReveal extends Component {
    props: {
        animationDuration ? : number
    };

    static propTypes = {
        ...View.propTypes,
        animationDuration: PropTypes.number
    };

    reveal = (positionFromRight) => {
        UIManager.dispatchViewManagerCommand(
            findNodeHandle(this),
            UIManager.CircularReveal.Commands.REVEAL,
            [positionFromRight]
        );
    };

    hide = (positionFromRight) => {
        UIManager.dispatchViewManagerCommand(
            findNodeHandle(this),
            UIManager.CircularReveal.Commands.HIDE,
            [positionFromRight]
        );
    };

    render() {
        return (
            <RCTCircularRevealLayout
		        {...this.props}
		        style={this.props.style}>
		        {this.props.children}
		    </RCTCircularRevealLayout>
        );
    }
}

let RCTCircularRevealLayout = requireNativeComponent('CircularReveal', AndroidCircularReveal, {
    nativeOnly: {}
});

module.exports = AndroidCircularReveal;
