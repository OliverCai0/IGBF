import {
  Keyboard,
  KeyboardAvoidingView,
  SafeAreaView,
  StyleSheet,
  Text,
  Touchable,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { TextInput } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { signupUser } from "../redux/ducks/user";
import { MaterialIcons } from "@expo/vector-icons";

const SignUpScreen = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (Object.keys(user).length != 0) {
      navigation.navigate("Camera");
    }
  }, [user]);

  const handleSignUp = () => {
    dispatch(signupUser({ email, password }));
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1, width: "100%", justifyContent: "flex-end" }}>
        <View style={{ flex: 1 }}></View>
        <Text
          style={{ fontWeight: "bold", fontSize: 70, flex: 1, padding: 20 }}
        >
          sign up
        </Text>
      </View>
      <KeyboardAvoidingView
        style={{
          flex: 1,
          width: "100%",
          justifyContent: "space-evenly",
          alignItems: "center",
        }}
      >
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
          style={{ width: "80%", height: "20%", borderWidth: 1, padding: 5 }}
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={(text) => setPassword(text)}
          secureTextEntry
          style={{ width: "80%", height: "20%", borderWidth: 1, padding: 5 }}
        />
      </KeyboardAvoidingView>
      <View
        style={{
          flex: 1,
          width: "100%",
          alignItems: "center",
          justifyContent: "space-evenly",
        }}
      >
        <TouchableOpacity
          onPress={handleSignUp}
          style={{
            height: "15%",
            width: "50%",
            borderWidth: 1,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 15,
            flexDirection: "row",
          }}
        >
          <Text>Register/Login</Text>
          <MaterialIcons name="navigate-next" size={35} color="#FF01A3" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("Camera")}
          style={{
            height: "15%",
            width: "50%",
            borderWidth: 1,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 15,
            flexDirection: "row",
          }}
        >
          <Text>Skip Login: Camera</Text>
          <MaterialIcons name="navigate-next" size={35} color="#FF01A3" />
        </TouchableOpacity>
        {/* <TouchableOpacity onPress={() => navigation.navigate('Gallery')}>
          <Text>Debugging: Go To Gallery</Text>
        </TouchableOpacity> */}
      </View>
    </SafeAreaView>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
});
