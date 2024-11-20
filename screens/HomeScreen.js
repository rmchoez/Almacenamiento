import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';  // Importamos los íconos de MaterialIcons

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Bienvenidos a Home Screen!</Text>
      <View style={styles.buttonContainer}>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.buttonWrapper}
            onPress={() => navigation.navigate('Users')}
          >
            <Icon name="group" size={30} color="white" />
            <Text style={styles.buttonText}>Users</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonWrapper}
            onPress={() => navigation.navigate('Todo')}
          >
            <Icon name="check-box" size={30} color="white" />
            <Text style={styles.buttonText}>Todo</Text>
          </TouchableOpacity>         

       
        </View>
        <View style={styles.buttonRow}>
        <TouchableOpacity
            style={styles.buttonWrapper}
            onPress={() => navigation.navigate('NativeStyle')}
          >
            <Icon name="palette" size={30} color="white" />
            <Text style={styles.buttonText}>Native Style</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.buttonWrapper}
            onPress={() => navigation.navigate('RxdbUsersScreen')}
          >
            <Icon name="cloud" size={30} color="white" />
            <Text style={styles.buttonText}>RxdbUsersScreen</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.buttonWrapper}
            onPress={() => navigation.navigate('Carts')}
          >
            <Icon name="shopping-cart" size={30} color="white" />
            <Text style={styles.buttonText}>Carts</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,

  },
  headerText: {
    textAlign: 'center',
    fontSize: 30,
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#6200ea',  // Texto blanco
  },
  buttonContainer: {
    width: '100%',
    padding: 10,
    alignItems: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    width: '100%',
  },
  buttonWrapper: {
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
    backgroundColor: '#6200ea',
    padding: 10,
    borderRadius: 10,
    elevation: 5,  // Agregar sombra para el efecto visual
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    marginTop: 5,
  },
});

export default HomeScreen;
