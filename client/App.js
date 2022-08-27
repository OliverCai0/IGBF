import { StatusBar } from "expo-status-bar";
import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import CameraView from "./app/screens/CameraView";
import GalleryView from "./app/screens/GalleryView";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignUpScreen from "./app/screens/SignUpScreen";
import store from "./app/redux/configureStore";
import { Provider } from "react-redux";

const Stack = createNativeStackNavigator();

export default function App() {
  const [page, setPage] = useState(0);
  const [cachedImages, setCachedImages] = useState([]);
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            options={{ headerShown: false }}
            name="SignUp"
            component={SignUpScreen}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="Camera"
            component={CameraView}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="Gallery"
            component={GalleryView}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
