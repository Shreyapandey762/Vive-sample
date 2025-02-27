import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {Provider} from 'react-redux';
import LandingScreen from './components/LandingScreen';
import NewTransactionScreen from './components/NewTransactionScreen';
import Splash from './components/SplashScreen';
import SignIn from './components/SignIn';
import {UserProvider} from './context/UserContext';
import UserProfile from './components/UserProfile';
import {store} from './store';
import {HomePrepTask, Transaction} from './store/transactionsSlice';
import ListingPlan from './components/ListingPlan';
import HomePrep from './components/HomePrep';
import HomePreptask from './components/HomePreptask';
import {LogBox} from 'react-native';

export type RootStackParamList = {
  LandingScreen: {newTransaction?: Transaction} | undefined;
  NewTransactionScreen: {transaction: Transaction};
  SplashScreen: undefined;
  SignIn: undefined;
  UserProfile: undefined;
  ListingPlan: undefined;
  HomePrep: {transaction: Transaction};
  HomePreptask: {task: HomePrepTask};
};

const Stack = createStackNavigator<RootStackParamList>();
LogBox.ignoreAllLogs();
const App = () => {
  return (
    <Provider store={store}>
      <UserProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="SplashScreen"
            screenOptions={{headerShown: false}}>
            <Stack.Screen name="SplashScreen" component={Splash} />
            <Stack.Screen name="SignIn" component={SignIn} />
            <Stack.Screen name="LandingScreen" component={LandingScreen} />
            <Stack.Screen
              name="NewTransactionScreen"
              component={NewTransactionScreen}
            />
            <Stack.Screen name="UserProfile" component={UserProfile} />
            <Stack.Screen name="ListingPlan" component={ListingPlan} />
            <Stack.Screen name="HomePrep" component={HomePrep} />
            <Stack.Screen name="HomePreptask" component={HomePreptask} />
          </Stack.Navigator>
        </NavigationContainer>
      </UserProvider>
    </Provider>
  );
};

export default App;
