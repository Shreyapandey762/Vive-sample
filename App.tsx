import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from 'react-redux';
import LandingScreen from './components/LandingScreen';
import NewTransactionScreen from './components/NewTransactionScreen';
import Splash from './components/SplashScreen'; 
import SignIn from './components/SignIn';
import { UserProvider } from './context/UserContext';
import UserProfile from './components/UserProfile';
import { store } from './store';

export type RootStackParamList = {
  LandingScreen: { newTransaction?: { title: string; subtitle: string; image: string } } | undefined;  
  NewTransactionScreen: { title: string };
  SplashScreen: undefined;
  SignIn: undefined;
  UserProfile: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <Provider store={store}>
      <UserProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="SplashScreen" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="SplashScreen" component={Splash} />
            <Stack.Screen name="SignIn" component={SignIn} />
            <Stack.Screen name="LandingScreen" component={LandingScreen} />
            <Stack.Screen name="NewTransactionScreen" component={NewTransactionScreen} />
            <Stack.Screen name="UserProfile" component={UserProfile} />
          </Stack.Navigator>
        </NavigationContainer>
      </UserProvider>
    </Provider>
  );
};

export default App;
