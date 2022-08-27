import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Dimensions,
  Platform,
} from "react-native";

export default function WelcomeView(props) {
  return (
    <View style={{ flex: 1, flexDirection: "column" }}>
      <SafeAreaView></SafeAreaView>
      <View
        style={{
          flex: 1,
          backgroundColor: "white",
          alignItems: "center",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            height: "25%",
            fontSize: 150,
            fontWeight: "bold",
          }}
        >
          IGBF
        </Text>
        <TouchableOpacity
          style={{
            height: "30%",
            width: "50%",
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => {
            props.setPage(1);
          }}
        >
          <Image source={require("../../assets/temp_tag_line.png")}></Image>
        </TouchableOpacity>
      </View>
      <SafeAreaView></SafeAreaView>
    </View>
  );
}
