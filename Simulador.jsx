import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, TouchableOpacity, FlatList, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';  // Importar el componente Picker

export default function SimuladorCredito() {
  const [monto, setMonto] = useState('');
  const [cuotas, setCuotas] = useState('');
  const [tipoCredito, setTipoCredito] = useState('consumo');  // Estado para tipo de crédito
  const [interes, setInteres] = useState(16);  // Tasa de interés inicial (por defecto "Crédito Consumo")
  const [cuotasGuardadas, setCuotasGuardadas] = useState([]);

  // Cargar cuotas almacenadas al iniciar la app
  useEffect(() => {
    loadCuotas();
  }, []);

  // Actualizar la tasa de interés según el tipo de crédito seleccionado
  useEffect(() => {
    switch (tipoCredito) {
      case 'consumo':
        setInteres(16);
        break;
      case 'hipotecario':
        setInteres(10);
        break;
      case 'biess':
        setInteres(9);
        break;
      default:
        setInteres(16);
    }
  }, [tipoCredito]); // Escucha cambios en tipoCredito y actualiza la tasa

  // Guardar la cuota en AsyncStorage
  const saveCuota = async () => {
    const cuotaMensual = calcularCuota(monto, interes, cuotas);

    const nuevaCuota = {
      id: Date.now().toString(), // Generar un ID único
      monto: parseFloat(monto),
      interes: parseFloat(interes),
      cuotas: parseInt(cuotas),
      cuotaMensual,
    };

    try {
      const cuotasPrevias = await AsyncStorage.getItem('cuotas');
      const cuotasActuales = cuotasPrevias ? JSON.parse(cuotasPrevias) : [];
      const nuevasCuotas = [...cuotasActuales, nuevaCuota];

      await AsyncStorage.setItem('cuotas', JSON.stringify(nuevasCuotas));
      setCuotasGuardadas(nuevasCuotas); // Actualizar el estado
      limpiarCampos(); // Limpiar los campos después de guardar
    } catch (e) {
      console.error(e);
    }
  };

  // Cargar las cuotas desde AsyncStorage
  const loadCuotas = async () => {
    try {
      const cuotasCargadas = await AsyncStorage.getItem('cuotas');
      if (cuotasCargadas !== null) {
        setCuotasGuardadas(JSON.parse(cuotasCargadas));
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Calcular el valor de la cuota mensual
  const calcularCuota = (monto, interes, cuotas) => {
    const tasaMensual = parseFloat(interes) / 100 / 12;
    const cuota =(monto * tasaMensual) / (1 - Math.pow(1 + tasaMensual, -cuotas));
    return cuota.toFixed(2);
  };

  // Eliminar una cuota
  const eliminarCuota = async (id) => {
    try {
      const nuevasCuotas = cuotasGuardadas.filter((item) => item.id !== id);
      await AsyncStorage.setItem('cuotas', JSON.stringify(nuevasCuotas));
      setCuotasGuardadas(nuevasCuotas); // Actualizar la lista en pantalla
    } catch (e) {
      console.error(e);
    }
  };

  // Confirmar eliminación
  const confirmarEliminacion = (id) => {
    Alert.alert('Eliminar cuota', '¿Estás seguro de eliminar esta cuota?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', onPress: () => eliminarCuota(id) },
    ]);
  };

  // Limpiar campos de entrada
  const limpiarCampos = () => {
    setMonto('');
    setCuotas('');
  };

  // Renderizar cuota individual
  const renderCuota = ({ item }) => (
    <View
      style={{
        padding: 10,
        marginVertical: 5,
        backgroundColor: '#d1e8e2',
        borderRadius: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}
    >
      <View>
        <Text style={{ fontWeight: 'bold',color:'#22a6b3' }}>Monto: ${item.monto}</Text>
        <Text style={{ fontWeight: 'bold',color:'#22a6b3' }}>Tasa de interés: {item.interes}%</Text>
        <Text style={{ fontWeight: 'bold',color:'#22a6b3' }}>Cuotas: {item.cuotas}</Text>
        <Text style={{ fontWeight: 'bold',color:'#22a6b3' }}>Cuota mensual: ${item.cuotaMensual}</Text>
      </View>
      <TouchableOpacity
        style={{
          backgroundColor: '#ff4d4d',
          paddingHorizontal: 10,
          justifyContent: 'center',
          borderRadius: 5,
        }}
        onPress={() => confirmarEliminacion(item.id)}
      >
        <Text style={{ color: 'white' }}>Eliminar</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: '#f5f5f5' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center',color:'#22a6b3' }}>
        Simulador de Crédito
      </Text>

      <TextInput
        style={{
          borderWidth: 1,
          borderColor: '#ddd',
          padding: 10,
          marginVertical: 10,
          borderRadius: 5,
          color:'black'
        }}
        placeholder="Monto del crédito"
        placeholderTextColor={'gray'}
        keyboardType="numeric"
        value={monto}
        onChangeText={setMonto}
      />

      <Picker
        selectedValue={tipoCredito}
        style={{ height: 50, width: '100%', marginVertical: 10 ,color:'black'}}
        onValueChange={(itemValue) => setTipoCredito(itemValue)}
      >
        <Picker.Item label="Crédito de Consumo - 16%" value="consumo" />
        <Picker.Item label="Crédito Hipotecario - 10%" value="hipotecario" />
        <Picker.Item label="Crédito BIESS - 9%" value="biess" />
      </Picker>

      <Text>Tasa de Interés Aplicada: {interes}%</Text>

      <TextInput
        style={{
          borderWidth: 1,
          borderColor: '#ddd',
          padding: 10,
          marginVertical: 10,
          borderRadius: 5,
           color:'black'
        }}
        placeholder="Número de cuotas"
        placeholderTextColor={'gray'}
        keyboardType="numeric"
        value={cuotas}
        onChangeText={setCuotas}
      />

      <TouchableOpacity
        style={{
          backgroundColor: '#22a6b3',
          padding: 15,
          borderRadius: 5,
          alignItems: 'center',
          marginVertical: 10,
        }}
        onPress={saveCuota}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Calcular y Guardar</Text>
      </TouchableOpacity>

      <FlatList
        data={cuotasGuardadas}
        keyExtractor={(item) => item.id}
        renderItem={renderCuota}
        style={{ marginTop: 20 }}
      />
    </View>
  );
}
