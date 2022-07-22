import React, { useState, useRef } from "react";
import { Animated, View, StyleSheet, PanResponder, Text, Image, TouchableOpacity } from "react-native";
import { Feather } from '@expo/vector-icons'; 
import { FontAwesome } from '@expo/vector-icons'; 

const DraggableUpdated = (props) => {
  const width = props.width;
  const height = props.height;
  const image = props.image;
  const startingHeight = 150;
  // console.log(height)
  const [x, setX] = useState(props.x);
  const [y, setY] = useState(props.y);

  const pan = useRef(new Animated.ValueXY()).current;
  const panZoom = useRef(new Animated.ValueXY()).current;

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
      pan.setOffset({
        x: panZoom.x._value,
        y: panZoom.y._value
      });
    },
    onPanResponderMove: (e, gestureState) => {
      // The most recent move distance is gestureState.move{X,Y}
      // The accumulated gesture distance since becoming responder is
      // gestureState.d{x,y}
      Animated.event([null, {dx: panZoom.x, dy: panZoom.y}], {useNativeDriver: false})(e, gestureState)
      //console.log('size pan', panZoom);
    },
    onPanResponderTerminationRequest: (evt, gestureState) =>
      true,
    onPanResponderRelease: (evt, gestureState) => {
      // The user has released all touches while this view is the
      // responder. This typically means a gesture has succeeded
      panZoom.flattenOffset();
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
        // console.log('Pan',pan);
        // console.log('Pan-y', pan.y)
        // console.log('Pan-y-offset', pan.y._value)
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
        // console.log('flattened')
        pan.flattenOffset();
        // console.log('Flattened Pan: ', pan)
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
        width: 150,
        transform: [{ translateX: pan.x }, { translateY: pan.y }, 
          {scaleX: panZoom.x.interpolate({inputRange: [0,100], outputRange: [1,2]})}, 
          {scaleY: panZoom.y.interpolate({inputRange: [0,100], outputRange: [1,2]})}
                    ],
        flexDirection: 'column',
      }}>
      <TouchableOpacity style={{
        position: 'absolute', 
        zIndex: 3,
        transform: [
          {scaleX: panZoom.x.interpolate({inputRange: [0,100], outputRange: [1,.5]})}, 
          {scaleY: panZoom.y.interpolate({inputRange: [0,100], outputRange: [1,.5]})}
        ]
      }}
      onPress={() => {
        // console.log('pressed');
        props.setImage(null);
        }}>
          <Feather name="x-circle" size={20} color="white" />
      </TouchableOpacity>
      <Animated.View
        style={{
          left: 0,
          top: 0,
          width: 150,
        //   transform: [
        //     {scaleX: panZoom.x.interpolate({inputRange: [0,100], outputRange: [1,4]})}, 
        //   {scaleY: panZoom.y.interpolate({inputRange: [0,100], outputRange: [1,2]})}
        // ]
        }}
        {...panResponder.panHandlers}
      >
        <Image style={styles.box} source={{uri : image}}/>
      </Animated.View>
      <Animated.View style={{
                              position: 'absolute', 
                              backgroundColor: 'white', 
                              aspectRatio: 1, 
                              width: 18,
                              top: 140,
                              left: 140,
                              borderRadius: 100,
                              alignSelf: 'flex-end',
                              justifyContent: 'center',
                              alignItems: 'center',
                              transform: [
                              {scaleX: panZoom.x.interpolate({inputRange: [0,100], outputRange: [1,.5]})}, 
                              {scaleY: panZoom.y.interpolate({inputRange: [0,100], outputRange: [1,.5]})} ]
                                      }}
                        {...expandResponder.panHandlers}>
                          <FontAwesome name="expand" size={16} color="black" />
                        </Animated.View>
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
    opacity: .5
  }
});

export default DraggableUpdated;