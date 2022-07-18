import React, { useState, useRef } from "react";
import { Animated, View, StyleSheet, PanResponder, Text, Image, TouchableOpacity } from "react-native";

const DraggableUpdated = (props) => {
  const width = props.width;
  const height = props.height;
  const image = props.image;
  console.log(height)
  const [x, setX] = useState(props.x);
  const [y, setY] = useState(props.y);

  const pan = useRef(new Animated.ValueXY()).current;
  const panZoom = useRef({size: 150});

  const computeBoundsX = (x_move) => {
    console.log(x);
    if (x + x_move < 0) {
        return 0;
    }
    if (x + x_move > width) {
        return 0;
    }
    setX(x + x_move);
    return x_move
  }

  const expandResponder = useRef(PanResponder.create({
    // Ask to be the responder:
    onStartShouldSetPanResponder: (evt, gestureState) => true,
    onStartShouldSetPanResponderCapture: (evt, gestureState) =>
      true,
    onMoveShouldSetPanResponder: (evt, gestureState) => true,
    onMoveShouldSetPanResponderCapture: (evt, gestureState) =>
      true,

    onPanResponderGrant: (evt, gestureState) => {
      // The gesture has started. Show visual feedback so the user knows
      // what is happening!
      // gestureState.d{x,y} will be set to zero now
    },
    onPanResponderMove: (evt, gestureState) => {
      // The most recent move distance is gestureState.move{X,Y}
      // The accumulated gesture distance since becoming responder is
      // gestureState.d{x,y}
    },
    onPanResponderTerminationRequest: (evt, gestureState) =>
      true,
    onPanResponderRelease: (evt, gestureState) => {
      // The user has released all touches while this view is the
      // responder. This typically means a gesture has succeeded
    },
    onPanResponderTerminate: (evt, gestureState) => {
      // Another component has become the responder, so this gesture
      // should be cancelled
    },
    onShouldBlockNativeResponder: (evt, gestureState) => {
      // Returns whether this component should block native components from becoming the JS
      // responder. Returns true by default. Is currently only supported on android.
      return true;
    }
  })
).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        console.log('grant y:', pan.y._value)
        pan.setOffset({
          x: pan.x._value,
          y: (pan.y._value < 0) ? 0 : pan.y._value
        });
      },
      onPanResponderMove: (e, gestureState) => {
        // console.log('Gesture',gestureState);
        console.log('Pan',pan);
        console.log('Pan-y', pan.y)
        console.log('Pan-y-offset', pan.y._value)
        if(pan.y < 0){
            Animated.event(
                [
                null,
                { dx: pan.x}
                ],
                {useNativeDriver : false}
            )(e, gestureState);
        }
        else{
            Animated.event(
            [
            null,
            { dx: pan.x, dy: pan.y }
            ],
            {useNativeDriver : false}
        )(e, gestureState)}
        },
      onPanResponderRelease: () => {
        console.log('flattened')
        pan.flattenOffset();
        console.log('Flattened Pan: ', pan)
        if(pan.y._value < 0){
            pan.y.setValue(0);
        }
        if(pan.y._value > height - 150){
            pan.y.setValue(height - 150);
        }
        if(pan.x._value > width - 165){
            pan.x.setValue(width - 165);
        }
        if(pan.x._value < 0){
            pan.x.setValue(0);
        }
      }
    })
  ).current;

  return (
    <Animated.View style={{
        left: 0,
        top: 0,
        transform: [{ translateX: pan.x }, { translateY: pan.y }],
        backgroundColor: 'black',
        width: 150,
        height: 150
      }}>
      <Animated.View
        style={{
          left: 0,
          top: 0,
        //   transform: [{ translateX: pan.x }, { translateY: pan.y }]
        }}
        {...panResponder.panHandlers}
      >
        <Image style={styles.box} source={{uri : image}}/>
      </Animated.View>
      <TouchableOpacity style={{position: 'absolute', 
                                      backgroundColor: 'white', 
                                      aspectRatio: 1, 
                                      width: 15,
                                      borderRadius: 100,
                                      left: 150,
                                      top: 150,
                                      }}
                        {...expandResponder.panHandlers}></TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleText: {
    fontSize: 14,
    lineHeight: 24,
    fontWeight: "bold"
  },
  box: {
    height: 150,
    width: 150,
    opacity: .5,
    borderRadius: 5
  }
});

export default DraggableUpdated;