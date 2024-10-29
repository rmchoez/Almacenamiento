import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import RNFS from 'react-native-fs';

const FileApp = () => {
  const [text, setText] = useState('');
  const [fileContent, setFileContent] = useState('');

  const saveToFile = async () => {
    console.log('Directorio: ', RNFS.ExternalStorageDirectoryPath);
    const path = `${RNFS.ExternalStorageDirectoryPath}/Documents/notes` + '/ejemplo.txt';
    try {
      await RNFS.writeFile(path, text, 'utf8');
      // setFileContent(text);
    } catch (err) {
      console.error(err);
    }
  };

  const readFromFile = async () => {
    const path = `${RNFS.ExternalStorageDirectoryPath}/Documents/notes` + '/ejemplo.txt';
    console.log('FilePath: ' , path)
    try { 
      const content = await RNFS.readFile(path, 'utf8');
      setFileContent(content);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <View>
      <TextInput placeholder="Escribe una nota" value={text} onChangeText={setText} />
      <Button title="Guardar Nota" onPress={saveToFile} />
      <Button title="Leer Nota" onPress={readFromFile} />
      {fileContent ? <Text>Contenido del archivo: {fileContent}</Text> : null}
    </View>
  );
};

export default FileApp;
