import React, { useState, useRef, useEffect } from "react";
import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import DraggableUpdated from "./DraggableUpdated";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { TapGestureHandler } from "react-native-gesture-handler";
import { Camera, useCameraDevices } from "react-native-vision-camera";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { addPhoto } from "../redux/ducks/photos";

export default function CameraView(props) {
  let camera = useRef();
  const dispatch = useDispatch();
  const navigator = useNavigation();
  const [showBack, setShowBack] = useState(false);
  const [hasPermission, setHasPermission] = useState(true);
  const [image, setImage] = useState(null);
  const [cameraCoords, setCameraCoords] = useState(null);
  const [flash, setFlash] = useState(false);
  const { height, width } = Dimensions.get("window");

  const devices = useCameraDevices();
  const device = showBack ? devices.back : devices.front;

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (result && !result.cancelled) {
      console.log("Photo", result.uri);
      setImage(result.uri);
    }
  };

  const onPressFocus = async (nativeEvent) => {
    console.log("Pressed", Object.keys(nativeEvent));
    console.log("Value", nativeEvent.nativeEvent);
    if (device.supportsFocus) {
      await camera.current.focus({ x: 0, y: 0 });
    }
  };

  const takePicture = async () => {
    console.log("picture taken");
    let options = {
      quality: 1,
      base64: true,
      exif: false,
      flash: flash ? "on" : "off",
    };

    let newPhoto = await camera.current.takePhoto(options);
    dispatch(addPhoto(newPhoto));
    console.log("Photo", newPhoto);
  };

  const showCachedImages = () => {
    navigator.navigate("Gallery");
  };

  useEffect(() => {
    (async () => {
      Camera.getCameraPermissionStatus().then((authorization) => {
        if (authorization === "authorized") {
          console.log("Authorization", authorization);
          setHasPermission(true);
        }
      });
    })();
  }, []);

  if (hasPermission === null || device === undefined) {
    return <Text>No access to camera</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeAreaView}></SafeAreaView>
      <View
        style={[
          styles.topBar,
          {
            backgroundColor: "pink",
            backgroundColor: "black",
            justifyContent: "space-between",
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => {
            navigator.navigate("SignUp");
          }}
        >
          <Text
            style={[
              styles.againstBlack,
              { fontWeight: "bold", paddingLeft: "2%" },
            ]}
          >
            IGBF
          </Text>
        </TouchableOpacity>
        <View
          style={{
            flex: 0,
            width: "25%",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "black",
            flexDirection: "row",
          }}
        >
          <TouchableOpacity
            style={[styles.button, { justifyContent: "center" }]}
            onPress={() => {
              setFlash(flash == "off" ? FlashMode.on : FlashMode.off);
            }}
          >
            <Ionicons name="flash" size={20} color="#FF01A3" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { justifyContent: "center" }]}
            onPress={() => {
              showCachedImages();
            }}
          >
            <MaterialIcons name="navigate-next" size={35} color="#FF01A3" />
          </TouchableOpacity>
        </View>
      </View>
      <TapGestureHandler
        style={[styles.camera]}
        onHandlerStateChange={onPressFocus}
      >
        <Camera
          ref={camera}
          device={device}
          isActive={true}
          style={[styles.camera]}
          enableZoomGesture={true}
          photo={true}
          onLayout={(event) => {
            const layout = event.nativeEvent.layout;
            setCameraCoords({
              min_x: 0,
              min_y: 0,
              max_x: layout.width,
              max_y: layout.height,
            });
          }}
        >
          {cameraCoords && image && (
            <DraggableUpdated
              x={0}
              y={0}
              width={cameraCoords.max_x}
              height={cameraCoords.max_y}
              image={image}
              setImage={setImage}
            ></DraggableUpdated>
          )}
        </Camera>
      </TapGestureHandler>
      <View
        style={[
          {
            backgroundColor: "black",
            height: "10%",
            alignItems: "center",
            justifyContent: "center",
          },
        ]}
      >
        <View
          style={{
            borderRadius: 100,
            aspectRatio: 1,
            width: "18%",
            backgroundColor: "white",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              borderRadius: 100,
              aspectRatio: 1,
              width: "85%",
              backgroundColor: "black",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              style={{
                borderRadius: 100,
                aspectRatio: 1,
                width: "95%",
                backgroundColor: "white",
              }}
              onPress={() => {
                takePicture();
              }}
            ></TouchableOpacity>
          </View>
        </View>
      </View>
      <View
        style={{
          backgroundColor: "black",
          height: "5%",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            width: "20%",
            backgroundColor: "black",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            style={{}}
            onPress={() => {
              pickImage();
            }}
          >
            {(image && (
              <TouchableOpacity
                onPress={() => {
                  pickImage();
                }}
                style={{
                  borderColor: "white",
                  borderWidth: 1,
                  width: "40%",
                }}
              >
                <Image
                  source={{ uri: image }}
                  style={{
                    width: "100%",
                    aspectRatio: 1,
                  }}
                />
              </TouchableOpacity>
            )) || <Entypo name="images" size={24} color="#FF01A3" />}
          </TouchableOpacity>
        </View>
        <View
          style={{
            width: "20%",
            backgroundColor: "black",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            style={{}}
            onPress={() => {
              setShowBack(showBack ? false : true);
            }}
          >
            <Ionicons name="camera-reverse" size={24} color="#FF01A3" />
          </TouchableOpacity>
        </View>
      </View>
      <SafeAreaView style={styles.safeAreaView}></SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  againstBlack: {
    color: "white",
    fontSize: 50,
  },
  container: {
    flex: 1,
    flexDirection: "column",
  },
  camera: {
    flex: 10,
  },
  cameraBar: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "black",
    justifyContent: "center",
  },
  cameraButton: {
    borderRadius: 100,
    aspectRatio: 1,
    width: "15%",
    backgroundColor: "white",
  },
  commandBar: {
    flexDirection: "row",
    flex: 1,
    alignSelf: "flex-end",
    justifyContent: "center",
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    flex: 1,
    alignItems: "center",
  },
  safeAreaView: {
    backgroundColor: "black",
  },
  text: {
    fontSize: 18,
    color: "white",
    flex: 1,
    textAlign: "center",
  },
  topBar: {
    flex: 1,
    backgroundColor: "black",
    flexDirection: "row",
  },
});
