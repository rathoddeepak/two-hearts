import React, { useEffect, useState, useRef} from "react";
import { View, StyleSheet, Animated, Easing } from "react-native";

const randomIntFromInterval = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};
const ParticleBackground = ({
  particleSize,
  particleDispersion,
  particleColor,
  backgroundColor
}) => {
  const [particles, setParticles] = useState([]);
  const [componentDimensions, setComponentDimensions] = useState({
    width: 0,
    height: 0
  });

  const getParticles = () => {
    const currentParticles = [];
    const { width, height } = componentDimensions;
    const parentArea = width * height;
    const particleArea = Math.pow(particleSize + particleDispersion, 2);
    const estimatedParticleQuantity = Math.floor(parentArea / particleArea);

    for (let y = 0; y < estimatedParticleQuantity; y += 1) {
      const realY = randomIntFromInterval(0, height);
      const realX = randomIntFromInterval(0, width);
      currentParticles.push({
        y: realY,
        x: realX,
        size: particleSize
      });
    }
    return currentParticles;
  };

  const setDimensions = ({ nativeEvent }) => {
    const { width, height } = componentDimensions;
    if (!nativeEvent || height !== 0 || width !== 0) return;

    if (nativeEvent) {
      const { layout } = nativeEvent;
      const { width, height } = layout;
      setComponentDimensions({ width, height });
    }
  };

  useEffect(() => {
    const { width, height } = componentDimensions;
    if (height !== 0 || width !== 0) {
      requestAnimationFrame(() => {
        const generatedParticles = getParticles();
        setParticles(generatedParticles);
      });
    }
  }, [componentDimensions]);

  return (
    <View
      style={[styles.container, { backgroundColor }]}
      onLayout={setDimensions}
    >
      {particles.map(({ x, y, size }, index) => (
        <Particle
          parentWidth={componentDimensions.width}
          parentHeight={componentDimensions.height}
          color={particleColor}
          initialX={x}
          initialY={y}
          size={size}
          key={index}
        />
      ))}
    </View>
  );
};


const Particle = ({
  initialX,
  initialY,
  parentHeight,
  parentWidth,
  size,
  color
}) => {
  const animatedOpacity = useRef(
    new Animated.Value(randomIntFromInterval(0, 1))
  ).current;
  const animatedPosition = useRef(new Animated.Value(-1)).current;

  const animationTiming = randomIntFromInterval(800, 1800);

  const loopBouncingAnimate = () => {
    let reversed = false;
    setInterval(() => {
      reversed = !reversed;
      Animated.parallel([
        Animated.timing(animatedPosition, {
          toValue: reversed ? 0 : 1,
          duration: 20000,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true
        }),
        Animated.timing(animatedOpacity, {
          toValue: reversed ? 0 : 1,
          duration: animationTiming,
          useNativeDriver: true
        })
      ]).start();
    }, animationTiming);
  };

  /*  const runInitialAnimation = cb => {
    requestAnimationFrame(() => {
      Animated.timing(animatedPosition, {
        toValue: 0,
        duration: randomIntFromInterval(4000, 8000),
        easing: Easing.elastic(1),
        useNativeDriver: true
      }).start(cb);
    });
  }; */

  useEffect(() => {
    loopBouncingAnimate(loopBouncingAnimate);
  }, []);

  const topOffSet = parentHeight - initialY;
  const leftOffSet = parentWidth - initialX;

  let yOffset = topOffSet * Math.cos(randomIntFromInterval(0, 360));
  let xOffset = leftOffSet * Math.sin(randomIntFromInterval(0, 360));
  let translateY = animatedPosition.interpolate({
    inputRange: [0, 1],
    outputRange: [0, yOffset]
  });
  let translateX = animatedPosition.interpolate({
    inputRange: [0, 1],
    outputRange: [0, xOffset]
  });

  let opacity = animatedOpacity.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 1]
  });

  return (
    <Animated.View
      style={[
        {
          opacity,
          transform: [
            {
              translateY
            },
            { translateX }
          ]
        },
        styles.container,
        {
          top: initialY,
          left: initialX,
          width: size,
          height: size,
          backgroundColor: color
        }
      ]}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "black"
  },
  container2:{
	width: 20,
	height: 20,
	position: "absolute",
	borderRadius: 100
  }
});

export default ParticleBackground;