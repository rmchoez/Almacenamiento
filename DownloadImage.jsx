import React, { useEffect, useState } from 'react';
import { View, Image, Button, Text } from 'react-native';
import RNFS from 'react-native-fs';

const DownloadImage = () => {
  const [imagePath, setImagePath] = useState('');
  const [downloaded, setDownloaded] = useState(false);

  const imageUrl = 'https://unsplash.com/es/fotos/fotografia-de-angulo-bajo-de-arboles-durante-el-dia-4rDCa5hBlCs'; // URL de una imagen real
  const directoryPath = `${RNFS.DocumentDirectoryPath}/images`;
  const filePath = `${directoryPath}/downloaded-image.jpg`;

  // Verificar si la imagen ya existe al iniciar
  useEffect(() => {
    const checkFileExists = async () => {
      const exists = await RNFS.exists(filePath);
      if (exists) {
        console.log(directoryPath)
        setImagePath(filePath);
        setDownloaded(true);
      }
    };
    checkFileExists();
  }, []);

  // Descargar la imagen
  const downloadImage = async () => {
    try {
      await RNFS.mkdir(directoryPath); // Crear directorio 'images'
      console.log(directoryPath);
      const download = await RNFS.downloadFile({
        fromUrl: imageUrl,
        toFile: filePath,
      }).promise;
      
      if (download.statusCode === 200) {
        alert('Imagen descargada!');
        setImagePath(filePath);
        setDownloaded(true);
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  // Eliminar la imagen
  const deleteImage = async () => {
    try {
      await RNFS.unlink(filePath); // Eliminar el archivo
      setImagePath('');
      setDownloaded(false);
      alert('Imagen eliminada!');
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <View>
      {downloaded ? (
        <Image source={{ uri: `file://${imagePath}` }} style={{ width: 300, height: 300 }} />
      ) : (
        <Text>No hay imagen descargada</Text>
      )}

      {!downloaded ? (
        <Button title="Descargar Imagen" onPress={downloadImage} />
      ) : (
        <Button title="Eliminar Imagen" onPress={deleteImage} />
      )}
    </View>
  );
};

export default DownloadImage;
