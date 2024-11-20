import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, Button, Modal, ScrollView, Image, Text } from 'react-native';
import axios from 'axios';
import initializeDB, { cartsCollectionName } from '../database/rxdb';
import uuid from 'react-native-uuid';
import FlashMessage, { showMessage } from 'react-native-flash-message';
import { stringify,parse } from 'flatted';

const CartsScreen = () => {
  const [carts, setCarts] = useState([]);
  const [selectedCart, setSelectedCart] = useState(null);
  const [filters, setFilters] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [db, setDb] = useState(null);
  const [isInCollection, setIsInCollection] = useState(false);
 

  useEffect(() => {
    const initDB = async () => {
      console.log('Iniciando base de datos...');
  
      try {
        const DB = await initializeDB();
      
        setDb(DB);
      } catch (error) {
        console.error('Error al inicializar la base de datos:', error);
        setDb(null); 
      }
    };

    const fetchCartsData = async () => {
      try {
        const response = await axios.get('https://dummyjson.com/carts');
      
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
      showMessage({
        message: 'Carrito guardado con éxito!',
        type: 'success',
        backgroundColor: 'green',
      });
    }
  };

  const handleOpenModal = async (cart) => {
   
    setEditedProductQuantities({}); // Resetear las cantidades editadas cuando se abre el modal

    if (db) {
      const cartsCollection = db[cartsCollectionName];
      const existingCart = await cartsCollection.findOne({ selector: { userId: cart.userId } }).exec();
      setIsInCollection(!!existingCart);
      if(existingCart){
        const recontruido = parse(stringify(existingCart));
         console.log('ver ' +recontruido );
        setSelectedCart(recontruido);
      }else{
         setSelectedCart(cart);
      }
    }

    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleEditCart = async () => {
    try {
      console.log('Carrito a guardar:', selectedCart);
      // Elimina propiedades cíclicas antes de guardar
      const sanitizedCart = parse(stringify(selectedCart)); // Esto elimina las referencias cíclicas
      console.log('Carrito antes de editar:', sanitizedCart);
  
      if (db) {
        const cartsCollection = db[cartsCollectionName];
        await cartsCollection.upsert(sanitizedCart);
  
        const updatedCart = await cartsCollection.findOne({selector:{userId: selectedCart.userId}  });
  
        if (updatedCart) {
          console.log('Carrito actualizado:', updatedCart);
          showMessage({
            message: 'Carrito editado con éxito!',
            type: 'success',
            backgroundColor: 'blue',
          });
        } else {
          console.log('El carrito no se actualizó correctamente');
          showMessage({
            message: 'Hubo un problema al editar el carrito',
            type: 'error',
            backgroundColor: 'red',
          });
        }
      }
    } catch (error) {
      console.error('Error al editar el carrito:', error);
      showMessage({
        message: 'Hubo un error al editar el carrito',
        type: 'error',
        backgroundColor: 'red',
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
    // Asegúrate de que selectedCart y selectedCart.products estén definidos
    if (!selectedCart?.products) {
      console.error('selectedCart o selectedCart.products no están definidos');
      return;
    }
    console.log(selectedCart)

  // Crear una nueva versión del carrito con el producto modificado
  const updatedCart = {
    ...selectedCart, // Copia el carrito existente
    products: selectedCart.products.map(pr => {
      if (pr.id === productId) {
        // Modificar solo el producto que coincide con el ID
        const updatedProduct = {
          ...pr, // Copia el producto
          quantity: operation === 'increment' ? pr.quantity + 1 : pr.quantity - 1,
          total: pr.price * (operation === 'increment' ? pr.quantity + 1 : pr.quantity - 1),
        };
        return updatedProduct; // Retorna el producto actualizado
      }
      return pr; // Retorna los otros productos sin cambios
    }),
    total: selectedCart.products.reduce((acc, pr) => acc + pr.total, 0),
    totalQuantity: selectedCart.products.reduce((acc, pr) => acc + pr.quantity, 0),
  };

  // Actualizar el estado con el carrito modificado
  setSelectedCart(updatedCart);

  };
  
  const filteredCarts = filters ? carts.filter(cart => cart.userId == filters) : [...carts];

  const renderCartItem = ({ item }) => (
    <View style={{ marginBottom: 10, borderBottomWidth: 1, paddingBottom: 10 }}>
      <TextInput style={styles.input}>Usuario: {item.userId.toString()}</TextInput>
      <TextInput style={styles.input}>Total: ${item.total}</TextInput>
      <Button title="Guardar" onPress={() => handleSelectCart(item)} />
      <Button title="Ver Detalles" onPress={() => handleOpenModal(item)} />
    </View>
  );

  return (
    <ScrollView contentContainerStyle={{ paddingLeft: 10 }}>
      <FlashMessage />
      {/* Filtros */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={filters}
          onChangeText={setFilters}
          placeholder="Filtrar por userId"
        />
      </View>

      {/* Lista de carritos */}
      <View style={{ marginBottom: 2 }}>
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
          <View style={styles.view}>
            <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Detalle del Carrito</Text>
            <TextInput style={styles.input}>ID Usuario: {selectedCart.userId?.toString()}</TextInput>
            <TextInput style={styles.input}>Total: ${selectedCart.total?.toString()}</TextInput>
            <TextInput style={styles.input}>Cantidad de Productos: {selectedCart.totalProducts?.toString()}</TextInput>
            <TextInput style={styles.input}>Unidades por Productos: {selectedCart.totalQuantity?.toString()}</TextInput>
            <TextInput style={{ fontSize: 18, fontWeight: 'bold' }}>Productos:</TextInput>
            <FlatList
              data={selectedCart.products}
              keyExtractor={product => product.id.toString()}
              renderItem={({ item }) => (
                <View style={{ marginBottom: 2 }}>
                  <Text style={styles.input}>Producto: {item.title}</Text>
                  <Text style={styles.input}>Precio: ${item.price}</Text>
                  <Text style={styles.input}>Total: ${item.total}</Text>

                  {/* Botones de incremento y decremento */}
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  {isInCollection && (
              <>
                    
                    <Button
                      title="-"
                      onPress={() => handleQuantityChange(item.id, 'decrement')}
                    />
                    <Text style={styles.input}>
                      Cantidad: {item.quantity}
                    </Text>
                    <Button
                      title="+"
                      onPress={() => handleQuantityChange(item.id, 'increment')}
                    />
                     </>
                  )}
                  {!isInCollection && (
                     <TextInput style={styles.input}>
                      Cantidad: {item.quantity}
                    </TextInput>
                  )}
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

const styles = {
  input: {
    height: 40,

   // borderColor: '#ccc',
  // borderWidth: 1,
    paddingLeft: 10,
    borderRadius: 5,
    marginBottom: 10, // Reducido el margen
  },
  inputContainer: {
    marginBottom: 20, // Un poco más de espacio entre los filtros
  },
  view:{ flex: 1, justifyContent: 'center', padding: 10 }
};

export default CartsScreen;
