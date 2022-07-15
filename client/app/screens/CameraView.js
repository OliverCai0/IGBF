import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';

export default function CameraView(props) {
  let cameraRef = useRef()
  let cachedImages = props.cachedImages
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(CameraType.back);
  const [isCameraReady, setIsCameraReady] = useState(false);

  const onCameraReady = () => {
    setIsCameraReady(true);
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
    for(let i = 0; i < cachedImages.length; i ++){
      console.log(cachedImages[i].uri)
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
      <Camera style={styles.camera} ref={cameraRef} type={type} onCameraReady={onCameraReady}></Camera>
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
  }
});
