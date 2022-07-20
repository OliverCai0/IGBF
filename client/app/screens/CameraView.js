import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, SafeAreaView, Dimensions, Platform } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import * as ImagePicker from 'expo-image-picker';
import Draggable from './Draggable';
import DraggableUpdated from './DraggableUpdated';
import { Ionicons } from '@expo/vector-icons'; 
import { MaterialIcons } from '@expo/vector-icons'; 
import { Entypo } from '@expo/vector-icons'; 

export default function CameraView(props) {
  let cameraRef = useRef()
  let cachedImages = props.cachedImages
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(CameraType.back);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [image, setImage] = useState(null);
  const [cameraCoords, setCameraCoords] = useState(null);

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

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
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
      <View style={[styles.topBar, {
                                    backgroundColor: 'pink', 
                                    backgroundColor: 'black',
                                    justifyContent: 'space-between',
                                    }]}>
        <TouchableOpacity onPress={() => {props.setPage(0)}}>
        <Text style={[styles.againstBlack, {fontWeight: 'bold', paddingLeft: '2%'}]}>IGBF</Text>
        </TouchableOpacity>
        <View style={{
                      flex: 0,
                      width: '25%',
                      alignItems: 'center', 
                      justifyContent: 'center',
                      backgroundColor: 'black',
                      flexDirection: 'row'
                    }}>
            <TouchableOpacity style={[styles.button,
                                      {justifyContent: 'center'}
                                      ]}>
              <Ionicons name="flash" size={20}  color="#FF01A3" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button,
                                      {justifyContent: 'center'}
                                      ]} onPress={() => {showCachedImages()}}>
              <MaterialIcons name="navigate-next" size={35} color="#FF01A3" />
            </TouchableOpacity>
          </View>
      </View>
      <Camera style={[styles.camera]} 
              ref={cameraRef} type={type} onCameraReady={onCameraReady}
              onLayout={ event => {
                const layout = event.nativeEvent.layout;
                console.log('height:', layout.height);
                console.log('width:', layout.width);
                console.log('Camera x:', layout.x);
                console.log('Camera y:', layout.y);
                setCameraCoords({
                  min_x : 0,
                  min_y : 0,
                  max_x : layout.width,
                  max_y : layout.height
                })
              }}>
        { cameraCoords && image &&
          <DraggableUpdated x={0} y={0} width={cameraCoords.max_x} height={cameraCoords.max_y}
                            image={image}
                            setImage={setImage}></DraggableUpdated>
        }
      </Camera>
        <View style={[{backgroundColor: 'black', 
                       height: '10%', 
                       alignItems: 'center',
                       justifyContent: 'center'}]}>
            <View style={{
                borderRadius: 100,
                aspectRatio: 1,
                width: '18%',
                backgroundColor: 'white',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
            <View style={{
                borderRadius: 100,
                aspectRatio: 1,
                width: '85%',
                backgroundColor: 'black',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
            <TouchableOpacity
                style={{
                  borderRadius: 100,
                  aspectRatio: 1,
                  width: '95%',
                  backgroundColor: 'white',
                }}
                onPress={() => {
                  takePicture();
                }}>
            </TouchableOpacity>
            </View>
            </View>
        </View>
        <View style={{
                        backgroundColor: 'black',
                        height: '5%',
                        flexDirection: 'row',
                        justifyContent: 'space-between'
                      }}>
          <View style={{
            width: '20%',
            backgroundColor: 'black',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <TouchableOpacity style={{}} 
            onPress={()  => {
              pickImage();
            }}>
              {(image && 
              <TouchableOpacity 
              onPress={() => {pickImage();}}
              style={{
                borderColor: 'white',
                borderWidth: 1,
                width: '40%'
              }}>
              <Image source={{uri: image}} 
                     style={{
                             width :'100%',
                             aspectRatio : 1,
                             }}/>
              </TouchableOpacity>
              ) ||
              <Entypo name="images" size={24}  color="#FF01A3" />
              }
            </TouchableOpacity>
          </View>
          <View style={{
            width: '20%',
            backgroundColor: 'black',
            justifyContent: 'center',
            alignItems: 'center'
            }}>
            <TouchableOpacity
              style={{}}
              onPress={() => {
                setType(type === CameraType.back ? CameraType.front : CameraType.back);
              }}>
               <Ionicons name="camera-reverse" size={24} color="#FF01A3" />
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
  cameraBar: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'black',
    justifyContent: 'center',
  },
  cameraButton: {
    borderRadius: 100,
    aspectRatio: 1,
    width: '15%',
    backgroundColor: 'white',
  },
  commandBar: {
    flexDirection: 'row',
    flex: 1,
    alignSelf: 'flex-end',
    justifyContent: 'center',
  },
  buttonContainer: {
    flex: 1,
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
    flexDirection: 'row',
  }
});
