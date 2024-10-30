import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchData } from '../features/data/dataActions';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, Modal, Button } from 'react-native';

const DataDisplay = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.data);

  // Estado para el modal y el item seleccionado
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    dispatch(fetchData());
  }, [dispatch]);

  // Función para manejar la apertura del modal con el item seleccionado
  const openModal = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
  if (error) return <Text style={styles.error}>Error: {error}</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Results API</Text>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item} onPress={() => openModal(item)}>
            <Text style={styles.itemTitle}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Modal para mostrar detalles del item seleccionado */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Detalles del Item</Text>
            {selectedItem && (
              <Text style={styles.modalText}>ID: {selectedItem.id}</Text>
            )}
            {selectedItem && (
              <Text style={styles.modalText}>Title: {selectedItem.title}</Text>
            )}
            <Button title="Cerrar" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0', // Fondo gris claro
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color:'blue',
  },
  item: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2, // Sombra para Android
  },
  itemTitle: {
    fontSize: 16,
    color: '#333',
  },
  error: {
    color: 'red',
    fontSize: 18,
  },
  // Estilos del modal
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo semitransparente
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default DataDisplay;
