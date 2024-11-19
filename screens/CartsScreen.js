import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, Button, Modal, Alert, ScrollView, Image } from 'react-native';
import axios from 'axios';
import initializeDB, { cartsCollectionName } from '../database/rxdb';
import uuid from 'react-native-uuid';
import FlashMessage, { showMessage } from 'react-native-flash-message';


const CartsScreen = () => {
  const [carts, setCarts] = useState([]);
  const [selectedCart, setSelectedCart] = useState(null);
  const [filters, setFilters] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [db, setDb] = useState(null);

  useEffect(() => {
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
    
    // Obtener datos de la API
    const fetchCartsData = async () => {
      try {
        const response = await axios.get('https://dummyjson.com/carts');
        console.log("Respuesta de la API:", response.data);  // Verifica la respuesta completa
        if (Array.isArray(response.data)) {
          setCarts(response.data);
        } else if (response.data.carts) {
          setCarts(response.data.carts.map(cart => ({...cart, uuid: uuid.v4()}))); // Si la respuesta tiene la propiedad 'carts'
        } else {
          console.error('La respuesta no contiene un arreglo de carritos');
          setCarts([]); // Si no contiene carritos, asignar un arreglo vacío
        }
      } catch (error) {
        console.error('Error fetching cart data:', error);
        setCarts([]); // Si hay error, asignar un arreglo vacío
      }
    };
    

    fetchCartsData();
    initDB();
  }, []);

  const handleSelectCart = async (cart) => {
    setSelectedCart(cart);
    // Guardar en RxDB
    const cartsCollection = db[cartsCollectionName];
    if (cartsCollection) {
      await cartsCollection.insert(cart);
      console.log('Guardado')
      showMessage({
        message: 'Usuarios guardados con éxito!',
        type: 'success',
        backgroundColor: 'green', // Color verde para éxito
      });
    }
  };

  const handleOpenModal = (cart) => {
    setSelectedCart(cart);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const filteredCarts = filters ?  carts.filter(cart => {
    return cart.userId == filters ;
  }) : [...carts];

  const renderCartItem = ({ item }) => (
    <View style={{ marginBottom: 20, borderBottomWidth: 1, paddingBottom: 10 }}>
      <Text>Usuario: {item.userId.toString()}</Text>
      <Text>Total: ${item.totalPrice}</Text>
      <Button title="Guardar" onPress={() => handleSelectCart(item)} />
      <Button title="Ver Detalles" onPress={() => handleOpenModal(item)} />
    </View>
  );

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <FlashMessage />
      {/* Filtros */}
      <View style={{ marginBottom: 20 }}>
        <TextInput
          style={{
            height: 40,
            borderColor: '#ccc',
            borderWidth: 1,
            paddingLeft: 10,
            borderRadius: 5
          }}
          value={filters}
          onChangeText={setFilters}
          placeholder="Filtrar por userId"
        />
      </View>

      {/* Lista de carritos */}
      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Carritos</Text>
        <FlatList
          data={filteredCarts}
          renderItem={renderCartItem}
          keyExtractor={item => item.uuid}
        />
      </View>

      {/* Modal para mostrar detalles del carrito */}
      {selectedCart && (
        <Modal
          visible={isModalOpen}
          onRequestClose={handleCloseModal}
          animationType="slide"
        >
          <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Detalle del Carrito</Text>
            <Text>ID Usuario: {selectedCart.userId.toString()}</Text>
            <Text>Total: ${selectedCart.totalPrice}</Text>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Productos:</Text>
            <FlatList
              data={selectedCart.products}
              keyExtractor={product => product.id.toString()}
              renderItem={({ item }) => (
                <View style={{ marginBottom: 10 }}>
                  <Text>Producto: {item.name}</Text>
                  <Text>Cantidad: {item.quantity}</Text>
                  <Text>Precio: ${item.price}</Text>
                  {item.thumbnail && <Image source={{ uri: item.thumbnail }} style={{ width: 100, height: 100 }} />}
                </View>
              )}
            />
            <Button title="Cerrar" onPress={handleCloseModal} />
          </View>
        </Modal>
      )}
    </ScrollView>
  );
};

export default CartsScreen;
