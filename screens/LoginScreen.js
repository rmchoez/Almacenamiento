import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import initializeDB, { userCollectionName } from '../database/rxdb';

const LoginScreen = ({ navigation }) => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Estado para el loader
  const [db, setDb] = useState(null);

  useEffect(() => {
    const initDB = async () => {
        console.log('Iniciando base de datos...');
    
        try {
          const DB = await initializeDB();
          
          // Verifica si la base de datos fue inicializada correctamente
          //console.log('Base de datos inicializada:', DB);
    
          // Si la base de datos fue inicializada correctamente, establece el estado
          setDb(DB);
        } catch (error) {
          console.error('Error al inicializar la base de datos:', error);
          setDb(null); // Asegúrate de que el estado se maneje correctamente en caso de error
        }
      };
    initDB();
    
  }, []);

  const showAlert = (type, message) => {
    let title = '';
    switch (type) {
      case 'success':
        title = 'Success';
        break;
      case 'error':
        title = 'Error';
        break;
      default:
        title = 'Alert';
    }
    Alert.alert(title, message, [{ text: 'OK' }]);
  };
  const buscarUsuaruarioAPI = async(values) => {
    
    const response = await axios.post('https://dummyjson.com/auth/login', values);
    const result = response.data;
    return !!result.accessToken
  }

  const handleLogin = async (values) => {
    setIsLoading(true); // Mostrar loader al inicio de la llamada
    try {
      let user = null;
      const userCollection = db[userCollectionName];
      if (userCollection) {
        // Asegúrate de que la consulta sea correcta
        user = await userCollection
          .findOne({
            selector: {
              username: { $eq: values.username },
              password: { $eq: values.password },
            },
          })
          .exec();
      }
      console.log('result', user);
      
      if (user || await buscarUsuarioAPI(values)) {
        showAlert('success', 'Login successful');
        navigation.navigate('Home');
      } else {
        showAlert('warning', 'Invalid credentials');
      }
    } catch (error) {
      console.error(error);
      showAlert('error', `Failed to login: ${error.message}`);
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
                  placeholder="Password"
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
                title="Login"
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
