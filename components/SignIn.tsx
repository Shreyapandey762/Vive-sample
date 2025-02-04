import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";

type RootStackParamList = {
  SplashScreen: undefined;
  SignIn: undefined;
  Home: undefined; // Add more screens as needed
};

type SignInScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, "SignIn">;
};

const SignIn: React.FC<SignInScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = () => {
    if (email === "test@example.com" && password === "password") {
      Alert.alert("Login Successful!");
      navigation.navigate("Home"); // Navigate to Home screen (if it exists)
    } else {
      Alert.alert("Invalid email or password");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Button title="Sign In" onPress={handleSignIn} />

      <Text style={styles.registerText} onPress={() => navigation.navigate("SplashScreen")}>
        Back to Splash
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  registerText: {
    marginTop: 15,
    color: "blue",
    textDecorationLine: "underline",
  },
});

export default SignIn;
