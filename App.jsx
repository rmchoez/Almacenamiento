import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
//import { NativeBaseProvider } from 'native-base'; // Agregar NativeBaseProvider
//import { Provider as PaperProvider } from 'react-native-paper'; // Agregar PaperProvider

// Importar tus pantallas
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import UserScreen from './screens/UserScreen';
import TodoScreen from './screens/TodoScreen';
import UserDetailScreen from './screens/UserDetailScreen'; 
import RxdbUsersScreen from './screens/RxdbUsersScreen';
import NativeStyleScreen from './screens/NativeStyleScreen';
import RegisterScreen from './screens/Register';
import CartsScreen from './screens/CartsScreen';

// Crear el stack navigator
const Stack = createNativeStackNavigator();

const StackNavigator = () => (

      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Users" component={UserScreen} />
          <Stack.Screen name="Carts" component={CartsScreen} />
          <Stack.Screen name="Todo" component={TodoScreen} />
          <Stack.Screen name="UserDetailScreen" component={UserDetailScreen} />
          <Stack.Screen name="RxdbUsersScreen" component={RxdbUsersScreen} options={{ title: 'Usuarios Guardados' }} />
          <Stack.Screen name="NativeStyle" component={NativeStyleScreen} options={{ title: 'Native Style' }} />
        </Stack.Navigator>
      </NavigationContainer>
  
);

export default StackNavigator;
