import { PermissionsAndroid } from 'react-native';

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
