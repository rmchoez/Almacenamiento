import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import initializeDB, { userCollectionName } from '../database/rxdb';

const LoginScreen = ({ navigation }) => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Estado para el loader
  const [db, setDb] = useState(null);  // Estado local para almacenar la DB

  useEffect(() => {
    const initDB = async () => {
      try {
        const DB = await initializeDB();  // Inicializa la base de datos
        setDb(DB);  // Guarda el db cuando se inicializa
      } catch (error) {
        console.log('Error inicializando la BD:', error);
      }
    };

    initDB();
  }, []);

  const buscarUsuarioRx = async ({username, password}) => {
    try {
      if (!db) throw new Error('Base de datos no inicializada');
      return await db[userCollectionName].findOne({
        selector: {
          $and: [
            { username: {$eq: username} },
            { password: {$eq: password} }
          ]
        }
      }).exec();
    }catch (error) {
      throw new Error(error);
    }
  }

  const showAlert = (type, message) => {
    let title = '';
    switch (type) {
      case 'success':
        title = 'Exito';
        break;
      case 'error':
        title = 'Error';
        break;
      default:
        title = 'Alerta';
    }
    Alert.alert(title, message, [{ text: 'OK' }]);
  };

  const revisarLogin = async (values) => {
    try {
      const response = await axios.post('https://dummyjson.com/user/login', values);
      const result = response.data;
      return !!result.accessToken;
    } catch (error) {
      throw new Error(error.response?.data?.message);
    }
  }

  const handleLogin = async (values) => {
    setIsLoading(true); // Mostrar loader al inicio de la llamada
    try {
      const userRx = await buscarUsuarioRx(values);
      if (!!userRx || await revisarLogin(values)) {
        showAlert('success', 'Inicio de Sesion Exitoso');
        navigation.navigate('Home');
      } else {
        showAlert('warning', 'Credenciales Invalidas');
      }
    } catch (error) { 
      if (error.message === 'Invalid credentials') {
        showAlert('warning', 'Credenciales Invalidas');
      } else {
        console.error(error);
        showAlert('error', `Fallo al iniciar sesion: ${error.message}`);
      }
    } finally {
      setIsLoading(false); // Ocultar loader después de la respuesta
    }
  };

  return (
    <View style={styles.container}>
      <Modal
        transparent={true}
        animationType="fade"
        visible={isLoading}
      >
        <View style={styles.modalBackground}>
          <View style={styles.activityIndicatorContainer}>
            <ActivityIndicator size="large" color="#6200ea" />
            <Text style={styles.loadingText}>Cargando...</Text>
          </View>
        </View>
      </Modal>

      <View style={styles.card}>
        <Formik
          initialValues={{ username: '', password: '' }}
          validationSchema={Yup.object({
            username: Yup.string().required('Username is required'),
            password: Yup.string().required('Password is required'),
          })}
          onSubmit={handleLogin}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <>
              <TextInput
                placeholder="Username"
                value={values.username}
                onChangeText={handleChange('username')}
                placeholderTextColor={'gray'}
                onBlur={handleBlur('username')}
                style={[styles.input, touched.username && errors.username ? styles.errorInput : null]}
              />
              {touched.username && errors.username && (
                <Text style={styles.errorText}>{errors.username}</Text>
              )}

              <View style={styles.passwordContainer}>
                <TextInput
                  placeholder="Contraseña"
                  placeholderTextColor={'gray'}
                  secureTextEntry={!passwordVisible}
                  value={values.password}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  style={[styles.input, styles.passwordInput, touched.password && errors.password ? styles.errorInput : null]}
                />
                <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
                  <Icon
                    name={passwordVisible ? 'visibility' : 'visibility-off'}
                    size={24}
                    color="gray"
                  />
                </TouchableOpacity>
              </View>
              {touched.password && errors.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
              )}

              <Button
                title="Iniciar Sesion"
                onPress={handleSubmit}
                color="#6200ea"
              />

              <Text style={styles.registerText}>
                Don't have an account?{' '}
                <Text
                  style={styles.linkText}
                  onPress={() => navigation.navigate('Register')}
                >
                  Register
                </Text>
              </Text>
            </>
          )}
        </Formik>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f4f4f9',
  },
  card: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
    color: 'black',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordInput: {
    flex: 1,
  },
  errorInput: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  registerText: {
    textAlign: 'center',
    marginTop: 10,
    color: 'black',
  },
  linkText: {
    color: '#6200ea',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo semitransparente
  },
  activityIndicatorContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#6200ea',
  },
});

export default LoginScreen;
