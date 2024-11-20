import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, Button, Modal, ScrollView, Image } from 'react-native';
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
  const [isInCollection, setIsInCollection] = useState(false);
  const [editedProductQuantities, setEditedProductQuantities] = useState({});

  useEffect(() => {
    const initDB = async () => {
      console.log('Iniciando base de datos...');
  
      try {
        const DB = await initializeDB();
        console.log('Base de datos inicializada:', DB);
        setDb(DB);
      } catch (error) {
        console.error('Error al inicializar la base de datos:', error);
        setDb(null); 
      }
    };

    const fetchCartsData = async () => {
      try {
        const response = await axios.get('https://dummyjson.com/carts');
        console.log("Respuesta de la API:", response.data);
        if (Array.isArray(response.data)) {
          setCarts(response.data);
        } else if (response.data.carts) {
          setCarts(response.data.carts.map(cart => ({...cart, uuid: uuid.v4()})));
        } else {
          console.error('La respuesta no contiene un arreglo de carritos');
          setCarts([]);
        }
      } catch (error) {
        console.error('Error fetching cart data:', error);
        setCarts([]);
      }
    };

    fetchCartsData();
    initDB();
  }, []);

  const handleSelectCart = async (cart) => {
    setSelectedCart(cart);
    const cartsCollection = db[cartsCollectionName];
    if (cartsCollection) {
      await cartsCollection.insert(cart);
      console.log('Guardado');
      showMessage({
        message: 'Carrito guardado con éxito!',
        type: 'success',
        backgroundColor: 'green',
      });
    }
  };

  const handleOpenModal = async (cart) => {
    setSelectedCart(cart);
    setEditedProductQuantities({}); // Resetear las cantidades editadas cuando se abre el modal

    if (db) {
      const cartsCollection = db[cartsCollectionName];
      const existingCart = await cartsCollection.findOne({ selector: { uuid: cart.uuid } }).exec();
      setIsInCollection(!!existingCart);
    }

    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleEditCart = () => {
    if (db) {
      const cartsCollection = db[cartsCollectionName];
      cartsCollection.upsert(selectedCart);
      showMessage({
        message: 'Carrito editado con éxito!',
        type: 'success',
        backgroundColor: 'blue',
      });
    }
    handleCloseModal();
  };

  const handleDeleteCart = async () => {
    if (db) {
      const cartsCollection = db[cartsCollectionName];
      await cartsCollection.findOne({ selector: { uuid: selectedCart.uuid } }).remove();
      showMessage({
        message: 'Carrito eliminado con éxito!',
        type: 'success',
        backgroundColor: 'red',
      });
      setIsModalOpen(false);
    }
  };

  const handleQuantityChange = (productId, operation) => {
    // Cambiar la cantidad de acuerdo con la operación (incrementar o decrementar)
    setEditedProductQuantities(prevState => {
      const updatedQuantities = { ...prevState };
      const currentQuantity = updatedQuantities[productId] || selectedCart.products.find(p => p.id === productId)?.quantity || 0;
      const newQuantity = operation === 'increment' ? currentQuantity + 1 : Math.max(0, currentQuantity - 1);

      updatedQuantities[productId] = newQuantity;

      // Actualizar el carrito con la nueva cantidad
      const updatedProducts = selectedCart.products.map(product => {
        if (product.id === productId) {
          return { ...product, quantity: newQuantity, total: newQuantity * product.price }; // Recalcular el total
        }
        return product;
      });

      setSelectedCart(prevCart => ({
        ...prevCart,
        products: updatedProducts,
      }));

      return updatedQuantities;
    });
  };

  const filteredCarts = filters ? carts.filter(cart => cart.userId == filters) : [...carts];

  const renderCartItem = ({ item }) => (
    <View style={{ marginBottom: 10, borderBottomWidth: 1, paddingBottom: 10 }}>
      <TextInput>Usuario: {item.userId.toString()}</TextInput>
      <TextInput>Total: ${item.total}</TextInput>
      <Button title="Guardar" onPress={() => handleSelectCart(item)} />
      <Button title="Ver Detalles" onPress={() => handleOpenModal(item)} />
    </View>
  );

  return (
    <ScrollView contentContainerStyle={{ padding: 10 }}>
      <FlashMessage />
      {/* Filtros */}
      <View style={{ marginBottom: 5 }}>
        <TextInput
          style={{
            height: 40,
            borderColor: '#ccc',
            borderWidth: 1,
            paddingLeft: 10,
            borderRadius: 5,
          }}
          value={filters}
          onChangeTextInput={setFilters}
          placeholder="Filtrar por userId"
        />
      </View>

      {/* Lista de carritos */}
      <View style={{ marginBottom: 2 }}>
        <TextInput style={{ fontSize: 18, fontWeight: 'bold' }}>Carritos</TextInput>
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
          <View style={{ flex: 1, justifyContent: 'center', padding: 10 }}>
            <TextInput style={{ fontSize: 24, fontWeight: 'bold' }}>Detalle del Carrito</TextInput>
            <TextInput>ID Usuario: {selectedCart.userId.toString()}</TextInput>
            <TextInput>Total: ${selectedCart.total}</TextInput>
            <TextInput>Cantidad de Productos: {selectedCart.totalProducts}</TextInput>
            <TextInput>Unidades por Productos: {selectedCart.totalQuantity}</TextInput>
            <TextInput style={{ fontSize: 18, fontWeight: 'bold' }}>Productos:</TextInput>
            <FlatList
              data={selectedCart.products}
              keyExtractor={product => product.id.toString()}
              renderItem={({ item }) => (
                <View style={{ marginBottom: 2 }}>
                  <TextInput>Producto: {item.title}</TextInput>
                  <TextInput>Precio: ${item.price}</TextInput>
                  <TextInput>Total: ${item.total}</TextInput>
                 
                  {/* Botones de incremento y decremento */}
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                 
                    <Button
                      title="-"
                      onPress={() => handleQuantityChange(item.id, 'decrement')}
                    />
                    <TextInput style={{ marginHorizontal: 10 }}>
                    Cantidad: {editedProductQuantities[item.id] || item.quantity}
                    </TextInput>
                    <Button
                      title="+"
                      onPress={() => handleQuantityChange(item.id, 'increment')}
                    />
                  </View>

                  {item.thumbnail && <Image source={{ uri: item.thumbnail }} style={{ width: 100, height: 100 }} />}
                </View>
              )}
            />
            {isInCollection && (
              <>
                <Button title="Editar" onPress={handleEditCart} />
                <Button title="Eliminar" onPress={handleDeleteCart} />
              </>
            )}
            <Button title="Cerrar" onPress={handleCloseModal} />
          </View>
        </Modal>
      )}
    </ScrollView>
  );
};

export default CartsScreen;
