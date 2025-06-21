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
import DataDisplayScreen from './src/APIIntegration/DataDisplay';
import CheckboxScreen from './src/Selection/CheckboxScreen';
import ProductFilterScreen from './src/Filter/ProductFilterScreen';
import ProductFilterSortScreen from './src/sort/ProductFilerScreen';
import ProductListWithPaginationScreen from './src/Pagination/Simplepagination/ProductListWithPaginationScreen';
import ProductListWithComplexFiltersAndPagination from './src/Pagination/ComplexPagination/ProductListWithComplexFiltersAndPagination';
import ProductSearchScreen from './src/DebouncingThroatSearch/ProductSearchScreen';
import HoistingExamples from './src/JavaScriptInterview/Hoisting/HoistingExamples';
import ProductListDestructuring from './src/JavaScriptInterview/Destructuring/RN/ProductListDestructuring';
import ForEachExamples from './src/JavaScriptInterview/Array/ForEach/ForEachExamples';
import LogicalOperatorsExamples from './src/JavaScriptInterview/LogicalOperator/LogicalOperatorExample';
import TernaryOpearator from './src/JavaScriptInterview/TernaryOperatorUses/TernaryOpearator';
import { DynamicStylingExample } from './src/JavaScriptInterview/TernaryOperatorUses/DynamicStyling';
import { TodoListExample } from './src/JavaScriptInterview/TernaryOperatorUses/LogicArrayListItem';
import TernaryOperatorExamples from './src/JavaScriptInterview/TernaryOperatorUses/CombineAllType';

const Stack = createNativeStackNavigator();


const App = () => {

  // const LoginStatus = AsyncStorage.getItem('tokenId')

  //  const [token, setToken] = useState(AsyncStorage.getItem('tokenId') ?? null)
  // console.log('LoginStatus', login)
  return (
    // <Provider store={store}>
    // <NavigationContainer >
    //   <Stack.Navigator screenOptions={{ headerShown: false }}>
    //     <Stack.Screen name="Splash" component={Splash} />
    //     <Stack.Screen name="Login" component={Login} />
    //     <Stack.Screen name="Operations" component={Operations} />
    //     <Stack.Screen name="Signup" component={Signup} />
    //   </Stack.Navigator>
    // </NavigationContainer>
    // </Provider>
    // <ProductFilterScreen/>
    // <ProductSearchScreen/>
    // <HoistingExamples/>
    // <ProductListDestructuring/>
    // <ForEachExamples/>
    // <LogicalOperatorsExamples/>
    // <TernaryOpearator/>
    // <DynamicStylingExample />
  <TernaryOperatorExamples/>
  // <RNCamera/>
  );
}

export default App;