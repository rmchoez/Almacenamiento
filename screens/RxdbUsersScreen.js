// RxdbUsersScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, Alert, Modal, ActivityIndicator } from 'react-native';
import initializeDB, { productCollectionName } from '../database/rxdb';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';
import EditProduct from './EditProduct';
import { useNavigation } from '@react-navigation/native';


const RxdbUsersScreen = () => {
  const [db, setDb] = useState(null);
  const [rxdbProducts, setRxdbProducts] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Estado para el loader
  const navigation = useNavigation();

  useEffect(() => {
    const initDB = async () => {
      const DB = await initializeDB();
      setDb(DB);
    };

    initDB();
  }, []);

  const fetchRxdbProducts = async () => {
    if (db) {
      const products = await db[productCollectionName].find().exec();  // Usa la colección de usuarios
      setRxdbProducts(products.map((product) => product.toJSON()));
    }
  };

  useEffect(() => {
    try {
      setIsLoading(true);
      fetchRxdbProducts();
    }catch (error) {
      Toast.show({type: 'error', text1: 'Error al obtener los productos', text2: String(error)});
    } finally {
      setIsLoading(false);
    }
  }, [db]);

  const openEditModal = (item) => {
    setCurrentProduct(item);
    setIsModalVisible(true);
  };

  const closeEditModal = () => {
    setIsModalVisible(false);
    setCurrentProduct(null);
  };

  const saveChanges = async (editedItem) => {
    try {
      setIsLoading(true);
      await db[productCollectionName].upsert(editedItem);
      Toast.show({ type: 'success', text1: 'Producto Actualizado' });
      await fetchRxdbProducts();
      closeEditModal();
    }catch (error) {
      console.log('Error al guardar los cambios:', error);
      Toast.show({type: 'error', text1: 'Error al guardar los cambios', text2: String(error)});
    } finally {
      setIsLoading(false);
    }
  };

  const removeProduct = async (product) => {
    Alert.alert(
      'Eliminar Producto',
      `¿Estás seguro de que deseas eliminar ${product.title}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          onPress: async () => {
            setIsLoading(true);
            const pro = await db[productCollectionName].findOne({
              selector: { uuid: product.uuid }
            });
            await pro.remove();
            setRxdbProducts((prevProducts) => prevProducts.filter((p) => p.uuid !== product.uuid));
            setIsLoading(false);
            Toast.show({ type: 'success', text1: 'Exito', text2: 'Producto Eliminado' });
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={rxdbProducts}
        keyExtractor={(item) => item?.uuid}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.productCard}
            onLongPress={() => navigation.navigate('ProductDetail', {product: item })}
          >
            <View style={styles.imageContainer}>
              { item.images && item.images.length > 0 ?
              (<Image source={{ uri: item.images[0] }} style={styles.productImage} />) :
              (<Icon name="image-off-outline" size={80} color="#b0bec5" />)
              }
            </View>
          
            <View style={styles.infoContainer}>
              <Text style={styles.userName}>{item.title}</Text>
              <Text style={styles.userDetails}>Precio: {item.price}</Text>
              <Text style={styles.userDetails}>Categoria: {item.category}</Text>
            </View>
            <View style={styles.iconsContainer}>
              <TouchableOpacity onPress={() => openEditModal(item)}>
              <Icon
                  name="pencil-outline"  // Lápiz para editar
                  size={30}
                  color="#6200ea"  // Color del icono
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => removeProduct(item)}>
              <Icon
                  name="trash-can-outline"  // Papelera para eliminar
                  size={30}
                  color="#6200ea"  // Color del icono
                />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )} 
        contentContainerStyle={styles.listContainer}
      />
            
      <EditProduct
      isVisible={isModalVisible}
      onClose={closeEditModal}
      item={currentProduct}
      onSave={saveChanges}
      />
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  listContainer: { paddingVertical: 20 },
  productCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    marginHorizontal: 20,
    elevation: 2,
    alignItems: 'center', // Centra verticalmente todos los elementos
  },
  imageContainer: {
    marginRight: 15,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  infoContainer: {
    flex: 1, // Toma el espacio restante entre la imagen y los íconos
    justifyContent: 'center',
  },
  userName: { fontSize: 16, fontWeight: 'bold', color: '#6200ea' },
  userDetails: { fontSize: 14, color: 'gray', marginTop: 4 },
  iconsContainer: {
    justifyContent: 'space-around', // Distribuye uniformemente los íconos
    alignItems: 'center',
  },
});

export default RxdbUsersScreen;
