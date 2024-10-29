import React, { useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import RNFS from 'react-native-fs';
import { PermissionsAndroid } from 'react-native';

const FileHandling = () => {
  const [textInput1, setTextInput1] = useState('');
  const [textInput2, setTextInput2] = useState('');
  const [fileContent, setFileContent] = useState('');

  const directoryPath = `${RNFS.ExternalStorageDirectoryPath}/Documents/notes`;
  const filePath = `${directoryPath}/ejemplo.txt`;

  const requestPermissionAndCreateFile = async () => {
    const hasPermission = await requestStoragePermission();
    if (hasPermission) {
      createFile();
    } else {
      alert('Permiso denegado para acceder al almacenamiento');
    }
  };

  const requestStoragePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Permiso de almacenamiento',
          message: 'Esta aplicación necesita acceso a tu almacenamiento para guardar archivos.',
          buttonNeutral: 'Preguntar más tarde',
          buttonNegative: 'Cancelar',
          buttonPositive: 'Aceptar',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const createFile = async () => {
    try {
      const exists = await RNFS.exists(directoryPath);
      if (!exists) {
        await RNFS.mkdir(directoryPath, { recursive: true });
      }

      const fileContent = `${textInput1}\n${textInput2}`;
      await RNFS.writeFile(filePath, fileContent, 'utf8');
      alert('Archivo creado!');
    } catch (err) {
      console.log('Error al crear el archivo o directorio:', err.message);
    }
  };

  const readFile = async () => {
    try {
      const content = await RNFS.readFile(filePath, 'utf8');
      setFileContent(content);
    } catch (err) {
      console.log(err.message);
    }
  };

  const updateFile = async () => {
    try {
      await RNFS.appendFile(filePath, ' - Esta es una actualización de la nota', 'utf8');
      alert('Archivo actualizado!');
    } catch (err) {
      console.log(err.message);
    }
  };

  const deleteFile = async () => {
    try {
      await RNFS.unlink(filePath);
      await RNFS.unlink(directoryPath);
      setFileContent('');
      alert('Archivo y directorio eliminados!');
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gestión de Archivos</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Escribe el primer texto"
        placeholderTextColor={'gray'}
        multiline
        numberOfLines={4}
        onChangeText={text => setTextInput1(text)}
        value={textInput1}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Escribe el segundo texto"
        placeholderTextColor={'gray'}
        multiline
        numberOfLines={4}
        onChangeText={text => setTextInput2(text)}
        value={textInput2}
      />

      <TouchableOpacity style={styles.button} onPress={requestPermissionAndCreateFile}>
        <Text style={styles.buttonText}>Crear archivo</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.button} onPress={readFile}>
        <Text style={styles.buttonText}>Leer archivo</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.button} onPress={updateFile}>
        <Text style={styles.buttonText}>Actualizar archivo</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.button} onPress={deleteFile}>
        <Text style={styles.buttonText}>Eliminar archivo y directorio</Text>
      </TouchableOpacity>

      <Text style={styles.fileContent}>{fileContent}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    width: '100%',
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  fileContent: {
    marginTop: 20,
    fontSize: 16,
    color: '#333',
  },
});

export default FileHandling;
