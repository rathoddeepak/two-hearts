/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import Animated, { interpolate, Extrapolate } from 'react-native-reanimated';
import { transformOrigin } from 'react-native-redash';
import type { StickyItemContentProps } from '@gorhom/sticky-item';
import { styles } from './stickyItemStyles';
import { View } from 'react-native';
import Icon from './Icon';
const StickyItem = ({
  x,
  threshold,
  itemWidth,
  itemHeight,
  stickyItemWidth,
  stickyItemHeight,
  separatorSize,
  borderRadius,
  isRTL,
}: StickyItemContentProps) => {
  const stickyScaleX = stickyItemWidth / itemWidth;

  //#region icon
  const animatedIconTranslateX = interpolate(x, {
    inputRange: [0, threshold],
    outputRange: [
      itemWidth / 2 - stickyItemWidth / 2,
      itemWidth - separatorSize * 2 - stickyItemWidth / 2,
    ],
    extrapolate: Extrapolate.CLAMP,
  });
  const animatedIconTranslateY = interpolate(x, {
    inputRange: [0, threshold],
    outputRange: [itemHeight/1.7 - separatorSize, itemHeight / 3],
    extrapolate: Extrapolate.CLAMP,
  });
  const animatedIconScale = interpolate(x, {
    inputRange: [0, threshold],
    outputRange: [1.5, 1],
    extrapolate: Extrapolate.CLAMP,
  });
  const iconStyle = [
    styles.icon,
    {
      borderRadius: stickyItemWidth,
      width: stickyItemWidth,
      height: stickyItemWidth,
      transform: transformOrigin(
        { x: 0, y: 0 },
        {
          translateX: animatedIconTranslateX,
          translateY: animatedIconTranslateY,
          scale: animatedIconScale,
        }
      ) as Animated.AnimatedTransform,
    },
  ];
  //#endregion

  return (
    <>            
      <Animated.View style={iconStyle}>
       <Icon name="add_circle" color="white" size={stickyItemWidth} />
      </Animated.View>
    </>
  );
};

export default StickyItem;
