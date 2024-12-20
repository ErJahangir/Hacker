import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from './Screens/Home';
import LoginScreen from './Screens/LoginScreen';
import SplashScreen from './Screens/SplashScreen';
import AddProduct from './Screens/AddProduct';
import {ProductProvider} from './Context/ProductContext';
import Toast from 'react-native-toast-message';

const App = () => {
  const stack = createNativeStackNavigator();
  return (
    <ProductProvider>
      <NavigationContainer>
        <stack.Navigator screenOptions={{headerShown: false}}>
          <stack.Screen name="splash" component={SplashScreen} />
          <stack.Screen name="login" component={LoginScreen} />
          <stack.Screen name="home" component={Home} />
          <stack.Screen name="add-product" component={AddProduct} />
        </stack.Navigator>
      </NavigationContainer>
      <Toast position="top" bottomOffset={20} visibilityTime={2000} />
    </ProductProvider>
  );
};

export default App;

const styles = StyleSheet.create({});
