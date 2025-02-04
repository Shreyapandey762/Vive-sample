import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Splash from './components/SplashScreen';
import SignIn from './components/SignIn';

type RootStackParamList = {
  SplashScreen: undefined;
  SignIn: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="SplashScreen"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="SplashScreen" component={Splash} />
        <Stack.Screen name="SignIn" component={SignIn} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
