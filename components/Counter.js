// Counter.js
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { increment, decrement} from '../actions';

const Counter = () => {
  const count = useSelector((state) => state.count);
  const dispatch = useDispatch();

  return (
    <View style={styles.container}>
      <Text style={styles.counterText}>Contador: {count}</Text>
      
      <TouchableOpacity 
        style={styles.button}
        onPress={() => dispatch(increment())}
      >
        <Text style={styles.buttonText}>Incrementar</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, styles.decrementButton]}
        onPress={() => dispatch(decrement())}
      >
        <Text style={styles.buttonText}>Decrementar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6', // Color de fondo claro
  },
  counterText: {
    fontSize: 48, // Tamaño grande para el texto del contador
    fontWeight: 'bold',
    color: '#333', // Color de texto oscuro
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#4caf50', // Verde para el botón de incrementar
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 10,
  },
  decrementButton: {
    backgroundColor: '#f44336', // Rojo para el botón de decrementar
  },
  buttonText: {
    color: '#fff', // Texto blanco
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Counter;
