import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity, Modal, ActivityIndicator, Dimensions, ScrollView } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import initializeDB, { userCollectionName } from '../database/rxdb';
import uuid from 'react-native-uuid';

const RegisterScreen = ({ navigation }) => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [passwordConfirmVisible, setPasswordConfirmVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // Estado para el loader
    const [db, setDb] = useState(null);  // Estado local para almacenar la DB
    const [formHeight, setFormHeight] = useState(0);
    const screenHeight = Dimensions.get('window').height;
    const remainingHeight = screenHeight - formHeight;

    const handleFormLayout = (event) => {
        const { height } = event.nativeEvent.layout;
        setFormHeight(height);
    }

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
                break;
        }
        Alert.alert(title, message, [{ text: 'OK' }]);
    };

    const mapearUsuario = (registro) => {
        const { name, lastName, username, email, password } = registro;
        const [ apellidoPaterno, apellidoMaterno ] = lastName.split(' ');
        return {
            firstName: name,
            lastName: apellidoPaterno,
            maidenName: apellidoMaterno,
            username,
            email,
            password
        }
    }

    const existeUsuario = async (username) => {
        try {
            if (!db) throw new Error('Base de datos no inicializada');
            const userRx = await db[userCollectionName].findOne({selector:{username:{ $eq: username }}}).exec();
            const usersDum = await axios.get('https://dummyjson.com/users');
            return [...(userRx || []), ...usersDum.data.users].some(user => user.username === username);
        }catch (error) {
            throw new Error(error);
        }
    }

    const handleSignIn = async (values) => {
        setIsLoading(true); // Mostrar loader al inicio de la llamada
        try {
            const registro = mapearUsuario(values);
            if (await existeUsuario(registro.username)) {
                showAlert('warning', 'El usuario ya existe');
                return;
            }
            const response = await axios.post('https://dummyjson.com/users/add', registro);
            const result = response.data;
            if (result) {
                result.uuid = uuid.v4();
                await db[userCollectionName].insert(result);
                showAlert('success', 'Registro exitoso');
                navigation.navigate('Login');
            } else {
                showAlert('warning', 'Datos incorrectos');
            }
        } catch (error) {
            console.error(error);
            showAlert('error', `Fallo al registrar: ${error.message}`);
        } finally {
            setIsLoading(false); // Ocultar loader después de la respuesta
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
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
            
            <Icon
                name={'person-pin-circle'}
                size={remainingHeight * 0.25}
                color="gray"
                style={styles.icon}
            /> 

            <View style={styles.card} onLayout={handleFormLayout}>
                <Formik
                initialValues={{ username: '', password: '' }}
                validationSchema={Yup.object({
                    name: Yup.string().required('El nombre es obligatorio'),
                    lastName: Yup.string().required('El apellido es obligatorio'),
                    username: Yup.string().required('El usuario es obligatorio'),
                    email: Yup.string().required('El correo electronico es obligatorio'),
                    password: Yup.string().required('La contraseña es obligatoria'),
                    confirmPassword: Yup.string().required('La confirmación de contraseña es obligatoria').oneOf([Yup.ref('password'), null], 'Las contraseñas no coinciden'),
                })}
                onSubmit={handleSignIn}
                >
                    {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                    <>
                        <TextInput
                            placeholder="Nombre"
                            value={values.name}
                            onChangeText={handleChange('name')}
                            placeholderTextColor={'gray'}
                            onBlur={handleBlur('name')}
                            style={[styles.input, touched.name && errors.name ? styles.errorInput : null]}
                        />
                        {touched.name && errors.name && (
                            <Text style={styles.errorText}>{errors.name}</Text>
                        )}
                            
                        <TextInput
                            placeholder="Apellido"
                            value={values.lastName}
                            onChangeText={handleChange('lastName')}
                            placeholderTextColor={'gray'}
                            onBlur={handleBlur('lastName')}
                            style={[styles.input, touched.lastName && errors.lastName ? styles.errorInput : null]}
                        />
                        {touched.lastName && errors.lastName && (
                            <Text style={styles.errorText}>{errors.lastName}</Text>
                        )}
                        <TextInput
                            placeholder="Correo Electronico"
                            value={values.email}
                            onChangeText={handleChange('email')}
                            placeholderTextColor={'gray'}
                            onBlur={handleBlur('email')}
                            style={[styles.input, touched.email && errors.email ? styles.errorInput : null]}
                        />
                        {touched.email && errors.email && (
                            <Text style={styles.errorText}>{errors.email}</Text>
                        )}

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
                            <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)} style={styles.iconContainer}>
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
                        <View style={styles.passwordContainer}>
                            <TextInput
                            placeholder="Confirme Contraseña"
                            placeholderTextColor={'gray'}
                            secureTextEntry={!passwordConfirmVisible}
                            value={values.confirmPassword}
                            onChangeText={handleChange('confirmPassword')}
                            onBlur={handleBlur('confirmPassword')}
                            style={[styles.input, styles.passwordInput, touched.confirmPassword && errors.confirmPassword ? styles.errorInput : null]}
                            />
                            <TouchableOpacity onPress={() => setPasswordConfirmVisible(!passwordConfirmVisible)} style={styles.iconContainer}>
                                <Icon
                                    name={passwordConfirmVisible ? 'visibility' : 'visibility-off'}
                                    size={24}
                                    color="gray"
                                />
                            </TouchableOpacity>
                        </View>
                        {touched.confirmPassword && errors.confirmPassword && (
                            <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                        )}

                        <Button
                            title="Sign In"
                            onPress={handleSubmit}
                            color="#6200ea"
                        />
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
      justifyContent: 'center',
      padding: 20,
      backgroundColor: '#f4f4f9',
    },
    icon: {
        alignSelf: 'center',
        marginBottom: 20
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
      paddingRight: 40
    },
    passwordContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      position: 'relative',
    },
    passwordInput: {
      flex: 1,
    },
    iconContainer: {
      position: 'absolute',
      right: 10,
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

export default RegisterScreen;