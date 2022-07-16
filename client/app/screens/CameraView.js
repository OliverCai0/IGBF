import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, SafeAreaView, Dimensions, Platform } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';

export default function CameraView(props) {
  let cameraRef = useRef()
  let cachedImages = props.cachedImages
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(CameraType.back);
  const [isCameraReady, setIsCameraReady] = useState(false);

  const [imagePadding, setImagePadding] = useState(0);
  const [ratio, setRatio] = useState('4:3');  // default is 4:3
  const { height, width } = Dimensions.get('window');
  const screenRatio = height / width;
  const [isRatioSet, setIsRatioSet] =  useState(false);

  const onCameraReady = async() => {
    setIsCameraReady(true);
    if (!isRatioSet) {
      await prepareRatio();
    }
  };

  // set the camera ratio and padding.
  // this code assumes a portrait mode screen
  const prepareRatio = async () => {
    let desiredRatio = '4:3';  // Start with the system default
    // This issue only affects Android
    if (Platform.OS === 'android') {
      const ratios = await camera.getSupportedRatiosAsync();

      // Calculate the width/height of each of the supported camera ratios
      // These width/height are measured in landscape mode
      // find the ratio that is closest to the screen ratio without going over
      let distances = {};
      let realRatios = {};
      let minDistance = null;
      for (const ratio of ratios) {
        const parts = ratio.split(':');
        const realRatio = parseInt(parts[0]) / parseInt(parts[1]);
        realRatios[ratio] = realRatio;
        // ratio can't be taller than screen, so we don't want an abs()
        const distance = screenRatio - realRatio; 
        distances[ratio] = realRatio;
        if (minDistance == null) {
          minDistance = ratio;
        } else {
          if (distance >= 0 && distance < distances[minDistance]) {
            minDistance = ratio;
          }
        }
      }
      // set the best match
      desiredRatio = minDistance;
      //  calculate the difference between the camera width and the screen height
      const remainder = Math.floor(
        (height - realRatios[desiredRatio] * width) / 2
      );
      // set the preview padding and preview ratio
      setImagePadding(remainder);
      setRatio(desiredRatio);
      // Set a flag so we don't do this 
      // calculation each time the screen refreshes
      setIsRatioSet(true);
    }
  };

  const takePicture = async () => {
    console.log('picture taken');
    let options = {
      quality: 1,
      base64: true,
      exif: false
    };
    
    let newPhoto = await cameraRef.current.takePictureAsync(options);
    var cachedImagesCopy = props.cachedImages.slice()
    cachedImagesCopy.push(newPhoto)
    props.setCachedImages(cachedImagesCopy)
  };

  const showCachedImages = () => {
    for(let i = 0; i < props.cachedImages.length; i ++){
      console.log(props.cachedImages[i].uri)
    }
    props.setPage(2);
  }

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeAreaView}></SafeAreaView>
      <View style={styles.topBar}>
        <Text style={styles.againstBlack}>IGBF</Text>
      </View>
      <Camera style={[styles.camera, {marginTop: imagePadding, marginBottom: imagePadding}]} ref={cameraRef} type={type} onCameraReady={onCameraReady}></Camera>
        <View style={styles.commandBar}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                setType(type === CameraType.back ? CameraType.front : CameraType.back);
              }}>
              <Text style={styles.text}> Flip </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  takePicture();
                }}>
            <Text style={styles.text}> Take Picture </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={() => {showCachedImages()}}>
                <Text style={styles.text}>Show Cached</Text>
              </TouchableOpacity>
          </View>
        </View>
        <SafeAreaView style={styles.safeAreaView}></SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  againstBlack : {
    color: 'white',
    fontSize: 50,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  camera: {
    flex: 10,
  },
  commandBar: {
    flexDirection: 'row',
    flex: 1,
    alignSelf: 'flex-end',
    justifyContent: 'center',
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'black',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    flex: 1,
    alignItems: 'center',
  },
  safeAreaView:{
    backgroundColor: 'black',
  },
  text: {
    fontSize: 18,
    color: 'white',
    flex: 1,
    textAlign: 'center',
  },
  topBar: {
    flex: 1,
    backgroundColor: 'black',
  }
});
