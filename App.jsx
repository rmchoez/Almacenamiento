import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';

import UserScreen from './screens/UserScreen';
import TodoScreen from './screens/TodoScreen';
import UserDetailScreen from './screens/UserDetailScreen'; // Importa UserDetailScreen
import SQLiteScreen from './screens/SQLiteScreen';
import RxdbUsersScreen from './screens/RxdbUsersScreen';


const Stack = createNativeStackNavigator();

const StackNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Users" component={UserScreen} />
      <Stack.Screen name="Todo" component={TodoScreen} />
      <Stack.Screen name="UserDetailScreen" component={UserDetailScreen} />
      <Stack.Screen name="SQLite" component={SQLiteScreen} />
      <Stack.Screen name="RxdbUsersScreen" component={RxdbUsersScreen} options={{ title: 'Usuarios Guardados' }} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default StackNavigator;
