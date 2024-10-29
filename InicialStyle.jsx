
import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const InicialStyle = () => {
  const [name, setName] = useState('');
  const [savedName, setSavedName] = useState('');
  const [buttonAnimation] = useState(new Animated.Value(1)); // Estado para animación del botón

  useEffect(() => {
    // Recuperar el nombre al cargar la app
    const getData = async () => {
      try {
        const value = await AsyncStorage.getItem('userName');
        if (value !== null) {
          setSavedName(value);
        }
      } catch (e) {
        console.error(e);
      }
    };
    getData();
  }, []);

  const handleSave = async () => {
    try {
      await AsyncStorage.setItem('userName', name);
      setSavedName(name);  // Actualiza el estado para mostrar el nombre guardado
    } catch (e) {
      console.error(e);
    }
  };

  const animateButton = () => {
    Animated.sequence([
      Animated.timing(buttonAnimation, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonAnimation, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    handleSave(); // Guarda el nombre cuando se presiona el botón
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Ingresa tu nombre"
        value={name}
        onChangeText={setName}
        placeholderTextColor="#999"
      />
      <Animated.View style={{ transform: [{ scale: buttonAnimation }] }}>
        <TouchableOpacity style={styles.button} onPress={animateButton}>
          <Text style={styles.buttonText}>Guardar</Text>
        </TouchableOpacity>
      </Animated.View>
      {savedName ? <Text style={styles.savedName}>Nombre guardado: {savedName}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,  // Toma toda la pantalla
    justifyContent: 'center',  // Centrar verticalmente
    alignItems: 'center',  // Centrar horizontalmente
    backgroundColor: '#f0f0f0',
  },
  input: {
    height: 40,
    color: 'black',
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    width: '80%',
    marginBottom: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    elevation: 2, // Sombra en Android
    shadowColor: '#000',  // Sombra en iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  savedName: {
    marginTop: 20,
    fontSize: 16,
    color: '#333',
  },
});

export default InicialStyle;

