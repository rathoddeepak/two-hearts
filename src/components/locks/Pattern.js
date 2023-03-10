// @flow

import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Animated,
  PanResponder,
  Alert
} from 'react-native';
import Svg, {Line, Circle} from 'react-native-svg';

import {
  populateDotsCoordinate,
  getDotIndex,
  getIntermediateDotIndexes
} from './patternHelpers';

type Coordinate = {
  x: number,
  y: number
};

type Props = {
  containerDimension: number,
  containerWidth: number,
  containerHeight: number,
  correctPattern: Array<Coordinate>,
  hint: string,
  onPatternMatch: () => boolean
};

type State = {
  activeDotCoordinate: ?Coordinate,
  initialGestureCoordinate: ?Coordinate,
  pattern: Array<Coordinate>,
  showError: boolean,
  showHint: boolean
};

const DEFAULT_DOT_RADIUS = 5;
const SNAP_DOT_RADIUS = 10;
const SNAP_DURATION = 100;

export default class Pattern extends React.Component<Props, State> {
  _panResponder: {panHandlers: Object};
  _activeLine: ?Object;
  _dots: Array<Coordinate>;
  _dotNodes: Array<?Object>;
  _mappedDotsIndex: Array<Coordinate>;

  _snapAnimatedValues: Array<Animated.Value>;

  _resetTimeout: number;

  constructor() {
    super(...arguments);
    this.state = {
      initialGestureCoordinate: null,
      activeDotCoordinate: null,
      pattern: [],
      showError: false,
      fromEditor:this.props.fromEditor,
      showHint: true
    };

    let {containerDimension, containerWidth, containerHeight} = this.props;

    let {screenCoordinates, mappedIndex} = populateDotsCoordinate(
      containerDimension,
      containerWidth,
      containerHeight
    );
    this._dots = screenCoordinates;
    this._mappedDotsIndex = mappedIndex;
    this._dotNodes = [];

    this._snapAnimatedValues = this._dots.map((dot, index) => {
      let animatedValue = new Animated.Value(DEFAULT_DOT_RADIUS);
      animatedValue.addListener(({value}) => {
        let dotNode = this._dotNodes[index];
        dotNode && dotNode.setNativeProps({r: value.toString()});
      });
      return animatedValue;
    });

    this._panResponder = PanResponder.create({
      onMoveShouldSetResponderCapture: () => !this.state.showError,
      onMoveShouldSetPanResponderCapture: () => !this.state.showHint,
      onStartShouldSetPanResponder: () => true,
      onPanResponderStart: e => {
        let {locationX, locationY} = e.nativeEvent;

        let activeDotIndex = getDotIndex(
          {x: locationX, y: locationY},
          this._dots
        );

        if (activeDotIndex != null) {
          let activeDotCoordinate = this._dots[activeDotIndex];
          let firstDot = this._mappedDotsIndex[activeDotIndex];
          let dotWillSnap = this._snapAnimatedValues[activeDotIndex];
          this.setState(
            {
              activeDotCoordinate,
              initialGestureCoordinate: activeDotCoordinate,
              pattern: [firstDot]
            },
            () => {
              this._snapDot(dotWillSnap);
            }
          );
        }
        if(this.state.fromEditor)return true;
      },
      onPanResponderMove: (e, gestureState) => {
        let {dx, dy} = gestureState;
        let {
          initialGestureCoordinate,
          activeDotCoordinate,
          pattern
        } = this.state;

        if (activeDotCoordinate == null || initialGestureCoordinate == null) {
          return;
        }

        let endGestureX = initialGestureCoordinate.x + dx;
        let endGestureY = initialGestureCoordinate.y + dy;

        let matchedDotIndex = getDotIndex(
          {x: endGestureX, y: endGestureY},
          this._dots
        );

        let matchedDot =
          matchedDotIndex != null && this._mappedDotsIndex[matchedDotIndex];

        if (
          matchedDotIndex != null &&
          matchedDot &&
          !this._isAlreadyInPattern(matchedDot)
        ) {
          let newPattern = {
            x: matchedDot.x,
            y: matchedDot.y
          };

          let intermediateDotIndexes = [];

          if (pattern.length > 0) {
            intermediateDotIndexes = getIntermediateDotIndexes(
              pattern[pattern.length - 1],
              newPattern,
              this.props.containerDimension
            );
          }

          let filteredIntermediateDotIndexes = intermediateDotIndexes.filter(
            index => !this._isAlreadyInPattern(this._mappedDotsIndex[index])
          );

          filteredIntermediateDotIndexes.forEach(index => {
            let mappedDot = this._mappedDotsIndex[index];
            pattern.push({x: mappedDot.x, y: mappedDot.y});
          });

          pattern.push(newPattern);

          let animateIndexes = [
            ...filteredIntermediateDotIndexes,
            matchedDotIndex
          ];

          this.setState(
            {
              pattern,
              activeDotCoordinate: this._dots[matchedDotIndex]
            },
            () => {
              if (animateIndexes.length) {
                animateIndexes.forEach(index => {
                  this._snapDot(this._snapAnimatedValues[index]);
                });
              }
            }
          );
        } else {
          this._activeLine &&
            this._activeLine.setNativeProps({
              x2: endGestureX.toString(),
              y2: endGestureY.toString()
            });
        }
      },
      onPanResponderRelease: () => {
        let {pattern} = this.state;
        if(this.props?.lockMode){
          this.checkPattern(pattern);
        }else{
          this.dispatchPattern(pattern);
        }
      }      
    });
  }

  componentWillUnmount() {
    clearTimeout(this._resetTimeout);
  }
  dispatchPattern(pattern) {
    if (pattern.length < 4) {
      this.setState(
        {
          initialGestureCoordinate: null,
          activeDotCoordinate: null,
          showError: true,
          showHint: false
        },
        () => {
          this._resetTimeout = setTimeout(() => {
            this.setState({
              showHint: true,
              showError: false,
              pattern: []
            });
          }, 2000);
        }
      );
    }else{
      this.setState({initialGestureCoordinate: null,activeDotCoordinate: null,pattern: []}, () => {
        this.props.onPattern(pattern)
      });      
    }
  }
  checkPattern(pattern){
      if (pattern.length) {
          if (this._isPatternMatched(pattern)) {
            this.setState(
              {
                initialGestureCoordinate: null,
                activeDotCoordinate: null
              },
              () => {
               this.props?.onPatternMatch();
              }
            );
          } else {
            this.setState(
              {
                initialGestureCoordinate: null,
                activeDotCoordinate: null,
                showError: true
              },
              () => {
                this.props?.onPatternNotMatch()
                this._resetTimeout = setTimeout(() => {
                  this.setState({
                    showHint: true,
                    showError: false,
                    pattern: []
                  });
                }, 2000);
              }
            );
          }
        }
  }
  render() {
    let {containerHeight, containerWidth, hint, errorMessage} = this.props;
    let {
      initialGestureCoordinate,
      activeDotCoordinate,
      pattern,
      showError,
      showHint
    } = this.state;
    let message;
    if (showHint) {
      message = hint;
    } else if (showError) {
      message = errorMessage;
    }
    return (
      <View style={styles.container}>
        <View style={styles.hintContainer}>
          <Text style={styles.hintText}>{message}</Text>
        </View>
        <Animated.View {...this._panResponder.panHandlers}>
          <Svg height={containerHeight} width={containerWidth}>
            {this._dots.map((dot, i) => {
              let mappedDot = this._mappedDotsIndex[i];
              let isIncludedInPattern = pattern.find(
                dot => dot.x === mappedDot.x && dot.y === mappedDot.y
              );
              return (
                <Circle
                  ref={circle => (this._dotNodes[i] = circle)}
                  key={i}
                  cx={dot.x}
                  cy={dot.y}
                  r={DEFAULT_DOT_RADIUS}
                  fill={(showError && isIncludedInPattern && 'red') || 'white'}
                />
              );
            })}
            {pattern.map((startCoordinate, index) => {
              if (index === pattern.length - 1) {
                return;
              }
              let startIndex = this._mappedDotsIndex.findIndex(dot => {
                return (
                  dot.x === startCoordinate.x && dot.y === startCoordinate.y
                );
              });
              let endCoordinate = pattern[index + 1];
              let endIndex = this._mappedDotsIndex.findIndex(dot => {
                return dot.x === endCoordinate.x && dot.y === endCoordinate.y;
              });

              if (startIndex < 0 || endIndex < 0) {
                return;
              }

              let actualStartDot = this._dots[startIndex];
              let actualEndDot = this._dots[endIndex];

              return (
                <Line
                  key={`fixedLine${index}`}
                  x1={actualStartDot.x}
                  y1={actualStartDot.y}
                  x2={actualEndDot.x}
                  y2={actualEndDot.y}
                  stroke={showError ? 'red' : 'white'}
                  strokeWidth="2"
                />
              );
            })}
            {activeDotCoordinate ? (
              <Line
                ref={component => (this._activeLine = component)}
                x1={activeDotCoordinate.x}
                y1={activeDotCoordinate.y}
                x2={activeDotCoordinate.x}
                y2={activeDotCoordinate.y}
                stroke="white"
                strokeWidth="2"
              />
            ) : null}
          </Svg>
        </Animated.View>
      </View>
    );
  }

  _isAlreadyInPattern({x, y}: Coordinate) {
    let {pattern} = this.state;
    return pattern.find(dot => {
      return dot.x === x && dot.y === y;
    }) == null
      ? false
      : true;
  }

  _isPatternMatched(currentPattern: Array<Coordinate>) {
    let {correctPattern} = this.props;
    if (currentPattern.length !== correctPattern.length) {
      return false;
    }
    let matched = true;
    for (let index = 0; index < currentPattern.length; index++) {
      let correctDot = correctPattern[index];
      let currentDot = currentPattern[index];
      if (correctDot.x !== currentDot.x || correctDot.y !== currentDot.y) {
        matched = false;
        break;
      }
    }
    return matched;
  }

  _snapDot(animatedValue: Animated.Value) {
    Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: SNAP_DOT_RADIUS,
        duration: SNAP_DURATION,
        useNativeDriver:true
      }),
      Animated.timing(animatedValue, {
        toValue: DEFAULT_DOT_RADIUS,
        duration: SNAP_DURATION,
        useNativeDriver:true
      })
    ]).start();
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center'
  },
  hintContainer: {
    alignItems: 'center',
    paddingBottom: 10,
    height: 20,
    flexWrap: 'wrap'
  },
  hintText: {
    color: 'white',
    textAlign: 'center'
  }
});