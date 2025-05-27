import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Operations from './src/FakeStore/Operations';
import Login from './src/FakeStore/Login';
import Signup from './src/FakeStore/Signup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Splash from './src/FakeStore/Splash';
import { Provider } from 'react-redux';
import store from './src/FakeStore/Redux/store';


const Stack = createNativeStackNavigator();


const App = () => {

  // const LoginStatus = AsyncStorage.getItem('tokenId')

  //  const [token, setToken] = useState(AsyncStorage.getItem('tokenId') ?? null)
  // console.log('LoginStatus', login)
  return (
    <Provider store={store}>
    <NavigationContainer >
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={Splash} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Operations" component={Operations} />
        <Stack.Screen name="Signup" component={Signup} />
      </Stack.Navigator>
    </NavigationContainer>
    </Provider>
  );
}

export default App;