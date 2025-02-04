import React, { useEffect } from "react";
import { View, Button, StyleSheet, Text, TouchableOpacity } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import SplashScreen from "react-native-splash-screen";
import Vive from "../assets/Vive"

type RootStackParamList = {
  SplashScreen: undefined;
  SignIn: undefined;
};

type SplashScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, "SplashScreen">;
};

const Splash: React.FC<SplashScreenProps> = ({ navigation }) => {

  useEffect(()=>{
    setTimeout(()=>{
      SplashScreen.hide();
    },500)
  },[])

  return (
    <View style={styles.container}>
      <Vive />
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("SignIn")}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "crimson",
  },
  button: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#ffffff",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 80,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default Splash;
