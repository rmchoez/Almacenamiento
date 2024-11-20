import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import initializeDB, { userCollectionName } from '../database/rxdb';
import uuid from 'react-native-uuid';

const RegisterScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false); // Para mostrar el loading
  const [userData, setUserData] = useState(null); // Para almacenar la info obtenida de la API
  const [currentStep, setCurrentStep] = useState(1); // Para gestionar los pasos del formulario
  const [db, setDb] = useState(null);

  useEffect(() => {
    // Obtener los datos del usuario desde la API
    const fetchUserData = async () => {
      try {
        const response = await axios.get('https://dummyjson.com/users/2');
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    const initDB = async () => {
        console.log('Iniciando base de datos...');
    
        try {
          const DB = await initializeDB();
          
          // Verifica si la base de datos fue inicializada correctamente
          console.log('Base de datos inicializada:', DB);
    
          // Si la base de datos fue inicializada correctamente, establece el estado
          setDb(DB);
        } catch (error) {
          console.error('Error al inicializar la base de datos:', error);
          setDb(null); // Asegúrate de que el estado se maneje correctamente en caso de error
        }
      };
      
  
    fetchUserData();
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

  const handleRegister = async (values) => {
    if (!db) {
      console.error('Error: la base de datos no está inicializada');
      showAlert('error', 'Database not initialized');
      return;
    }
  
    try {
      const response = await axios.post('https://dummyjson.com/users/add', values);
      
      if (response.data?.id !== 0) {
        // Verifica que la colección exista antes de intentar usarla
        const userCollection = db[userCollectionName];
        if (userCollection) {
          console.log('Colección de usuarios encontrada:', userCollection);
  
          await userCollection.insert({
            uuid: uuid.v4(),
            id: 900,
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            phone: values.phone,
            username: values.username,
            password: values.password,
          });
  
          showAlert('success', 'Registration successful');
          navigation.navigate('Login');
        } else {
          
          showAlert('error', 'User collection not found');
        }
      } else {
        showAlert('error', 'Failed to register');
      }
    } catch (error) {
      console.error('Error during registration:', error);
      showAlert('error', 'Failed to register: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };
  

  // Si los datos del usuario aún no se han cargado, mostrar un loader
  if (!userData) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#6200ea" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <ActivityIndicator
        animating={isLoading}
        size="large"
        color="#6200ea"
        style={styles.loader}
      />

      <View style={styles.card}>
        <Formik
          initialValues={{
            id:userData.id,
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            email: userData.email || '',
            phone: userData.phone || '',
            username: userData.username || '',
            password: '',
            address: userData.address.address || '',
          }}
          validationSchema={Yup.object({
            firstName: Yup.string().required('First name is required'),
            lastName: Yup.string().required('Last name is required'),
            email: Yup.string().email('Invalid email').required('Email is required'),
            phone: Yup.string().required('Phone is required'),
            username: Yup.string().required('Username is required'),
            password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
            address: Yup.string().required('Address is required'),
          })}
          onSubmit={handleRegister}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <>
              {/* Paso 1: Información básica */}
              {currentStep === 1 && (
                <>
              
                  <TextInput
                    placeholder="First Name"
                    value={values.firstName}
                    onChangeText={handleChange('firstName')}
                    onBlur={handleBlur('firstName')}
                    style={[styles.input, touched.firstName && errors.firstName ? styles.errorInput : null]}
                  />
                  {touched.firstName && errors.firstName && <Text style={styles.errorText}>{errors.firstName}</Text>}

                  <TextInput
                    placeholder="Last Name"
                    value={values.lastName}
                    onChangeText={handleChange('lastName')}
                    onBlur={handleBlur('lastName')}
                    style={[styles.input, touched.lastName && errors.lastName ? styles.errorInput : null]}
                  />
                  {touched.lastName && errors.lastName && <Text style={styles.errorText}>{errors.lastName}</Text>}

                  <TextInput
                    placeholder="Email"
                    value={values.email}
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    style={[styles.input, touched.email && errors.email ? styles.errorInput : null]}
                  />
                  {touched.email && errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

                  <TextInput
                    placeholder="Phone"
                    value={values.phone}
                    onChangeText={handleChange('phone')}
                    onBlur={handleBlur('phone')}
                    style={[styles.input, touched.phone && errors.phone ? styles.errorInput : null]}
                  />
                  {touched.phone && errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}

                  <TouchableOpacity
                    style={styles.nextButton}
                    onPress={() => setCurrentStep(2)}
                  >
                    <Text style={styles.nextText}>Next</Text>
                  </TouchableOpacity>
                </>
              )}

              {/* Paso 2: Información adicional */}
              {currentStep === 2 && (
                <>
                  <TextInput
                    placeholder="Username"
                    value={values.username}
                    onChangeText={handleChange('username')}
                    onBlur={handleBlur('username')}
                    style={[styles.input, touched.username && errors.username ? styles.errorInput : null]}
                  />
                  {touched.username && errors.username && <Text style={styles.errorText}>{errors.username}</Text>}

                  <TextInput
                    placeholder="Password"
                    secureTextEntry
                    value={values.password}
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    style={[styles.input, touched.password && errors.password ? styles.errorInput : null]}
                  />
                  {touched.password && errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

                  <TextInput
                    placeholder="Address"
                    value={values.address}
                    onChangeText={handleChange('address')}
                    onBlur={handleBlur('address')}
                    style={[styles.input, touched.address && errors.address ? styles.errorInput : null]}
                  />
                  {touched.address && errors.address && <Text style={styles.errorText}>{errors.address}</Text>}

                  <View style={styles.buttonsContainer}>
                    <TouchableOpacity
                      style={styles.prevButton}
                      onPress={() => setCurrentStep(1)}
                    >
                      <Text style={styles.prevText}>Back</Text>
                    </TouchableOpacity>

                    <Button title="Register" onPress={handleSubmit} color="#6200ea" />
                  </View>
                </>
              )}
            </>
          )}
        </Formik>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  errorInput: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  nextButton: {
    backgroundColor: '#6200ea',
    padding: 10,
    borderRadius: 5,
    marginTop: 15,
  },
  nextText: {
    color: 'white',
    textAlign: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  prevButton: {
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 5,
  },
  prevText: {
    color: 'white',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f4f9',
  },
});

export default RegisterScreen;
