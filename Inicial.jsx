//npm install @react-native-async-storage/async-storage
//npm install react-native-reanimated
//npm install react-native-gesture-handler
/* module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: ['react-native-reanimated/plugin'],  // Agrega esta línea
};
 */

import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Inicial = () => {
  const [name, setName] = useState('');
  const [savedName, setSavedName] = useState('');

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

  return (
    <View>
      <TextInput
        placeholder="Ingresa tu nombre"
        value={name}
        onChangeText={setName}
      />
      <Button title="Guardar" onPress={handleSave} />
      {savedName ? <Text>Nombre guardado: {savedName}</Text> : null}
    </View>
  );
};

export default Inicial;