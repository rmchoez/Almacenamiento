import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, Animated, Modal, ActivityIndicator, Image } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import initializeDB, { productCollectionName } from '../database/rxdb';
import { showMessage } from 'react-native-flash-message';
import uuid from 'react-native-uuid';
import Toast from 'react-native-toast-message';

const ProductScreen = () => {
  const [db, setDb] = useState(null);  // Estado local para almacenar la DB
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]); // Nuevo estado para selección de usuarios
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [category, setCategory] = useState('');
  const slideAnim = useState(new Animated.Value(-300))[0];
  const dotsAnim = useState(new Animated.Value(0))[0];
  const navigation = useNavigation();

  useEffect(() => {
    fetchProducts();
    startDotsAnimation();
  }, []);

  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        const DB = await initializeDB();
        setDb(DB);
      } catch (error) {
        console.error('Error inicializando la base de datos:', error);
      }
    };
    initializeDatabase();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('https://dummyjson.com/products');
      setProducts(response.data.products);
      setFilteredProducts(response.data.products);
    } catch (error) {
      console.error('Error obteniendo productos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectProduct = (productId) => {
    setSelectedProducts(prevSelected => {
      if (prevSelected.includes(productId)) {
        return prevSelected.filter(id => id !== productId);
      } else {
        return [...prevSelected, productId];
      }
    });
  };

  const handleSaveSelected = async () => {
    try {
   
      const productsToSave = products
      .filter(product => selectedProducts.includes(product.id))
      .map(product => ({
        ...product,
        uuid: uuid.v4(),  // Genera un UUID como string
      }));
     
      console.log('Inicia Proceso de guardar....')

      if (db) {
        await db[productCollectionName].bulkInsert(productsToSave); // bulkInsert para manejar múltiples
        console.log("Productos guardados en RxDB");
        Toast.show({type: 'success', text1: 'Productos guardados con éxito!'});
        setSelectedProducts([]); // Limpia la selección
        fetchProducts();
      }
      else{
        console.log("No hay base de datos")
      }
    } catch (error) {
      console.log("Error guardando productsToSave en RxDB:", error);
      showMessage({
        message: `Error al guardar usuarios: ${String(error)}`,
        type: 'danger',
        backgroundColor: 'red', // Color rojo para error
      });
    }
  };

  const startDotsAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(dotsAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(dotsAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
      ])
    ).start();
  };

  const applyFilters = () => {
    let tempProducts = products;
    if (searchText) {
        tempProducts = tempProducts.filter(product =>
        `${product.title}`.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    if (minPrice || maxPrice) {
        tempProducts = tempProducts.filter(user => (
        (!minPrice || user.price >= parseFloat(minPrice)) &&
        (!maxPrice || user.price <= parseFloat(maxPrice))
      ));
    }
    if (category) {
        tempProducts = tempProducts.filter(user => user.category === category);
    }
    setFilteredProducts(tempProducts);
    toggleFilterPanel();
  };

  const toggleFilterPanel = () => {
    Animated.timing(slideAnim, {
      toValue: showFilters ? -300 : 0,
      duration: 300,
      useNativeDriver: true
    }).start(() => setShowFilters(!showFilters));
  };

  const navigateToProductDetail = (product) => {
    navigation.navigate('ProductDetail', { product });
  };
  
  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => handleSelectProduct(item.id)}
      onLongPress={() => navigateToProductDetail(item)}
      style={[styles.userCard, selectedProducts.includes(item.id) && styles.selectedUserCard]}
    >
      {/* Contenedor para la imagen del producto */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.images[0] }} style={styles.productImage} />
        
        {/* Si el producto tiene un descuento, mostrar el badge */}
        {item.discountPercentage > 0 && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>-{item.discountPercentage}%</Text>
          </View>
        )}
      </View>
      
      {/* Detalles del producto */}
      <View style={styles.productDetails}>
        <Text style={styles.userName}>{item.title}</Text>
        <Text style={styles.userDetails}>Precio: {item.price} - Categoria: {item.category}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleFilterPanel} style={styles.filterButton}>
        <Icon name="filter-list" size={24} color="white" />
      </TouchableOpacity>

      {loading && (
        <Modal transparent animationType="fade">
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="white" />
            <Animated.Text style={[styles.loadingText, { opacity: dotsAnim }]}>
              Cargando...
            </Animated.Text>
          </View>
        </Modal>
      )}

      <Animated.View style={[styles.filterPanel, { transform: [{ translateX: slideAnim }] }]}>
        <Text style={styles.filterTitle}>Filtros</Text>
        <TextInput
          style={styles.input}
          placeholder="Buscar por nombre de producto"
          placeholderTextColor="gray"
          value={searchText}
          onChangeText={setSearchText}
        />
        <TextInput
          style={styles.input}
          placeholder="Precio Minimo"
          keyboardType="numeric"
          placeholderTextColor="gray"
          value={minPrice}
          onChangeText={setMinPrice}
        />
        <TextInput
          style={styles.input}
          placeholder="Precio máximo"
          keyboardType="numeric"
          placeholderTextColor="gray"
          value={maxPrice}
          onChangeText={setMaxPrice}
        />
        <TextInput
          style={styles.input}
          placeholder="Categoria"
          placeholderTextColor="gray"
          value={category}
          onChangeText={setCategory}
        />
        <TouchableOpacity onPress={applyFilters} style={styles.applyButton}>
          <Text style={styles.applyButtonText}>Aplicar Filtros</Text>
        </TouchableOpacity>
      </Animated.View>

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        numColumns={2}      
      />

      {/* Mostrar el botón de guardar solo si hay usuarios seleccionados */}
      {selectedProducts.length > 0 && (
        <TouchableOpacity onPress={handleSaveSelected}
          style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Guardar Seleccionados</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  filterButton: { position: 'absolute', top: 10, right: 10, zIndex: 10, backgroundColor: '#6200ea', borderRadius: 30, padding: 10 },
  filterPanel: { position: 'absolute', top: 0, left: 0, width: 300, height: '100%', backgroundColor: '#ffffff', padding: 20, zIndex: 5 },
  filterTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  input: { height: 40, borderColor: '#ddd', borderWidth: 1, borderRadius: 5, paddingHorizontal: 10, marginVertical: 5, color: 'black' },
  applyButton: { backgroundColor: '#6200ea', padding: 10, borderRadius: 5, marginTop: 10 },
  applyButtonText: { color: 'white', textAlign: 'center' },
  listContainer: { paddingVertical: 20 },
  userCard: { 
    backgroundColor: 'white', 
    padding: 15, 
    marginVertical: 8, 
    borderRadius: 10, 
    marginHorizontal: 10, 
    elevation: 2, 
    width: '45%', // Establece un tamaño fijo para las tarjetas
  },
  selectedUserCard: { backgroundColor: '#f0e6ff' }, // Color más claro para selección
  saveButton: { backgroundColor: '#6200ea', padding: 15, borderRadius: 5, margin: 20 },
  saveButtonText: { color: 'white', textAlign: 'center', fontWeight: 'bold' },
  userName: { fontSize: 16, fontWeight: 'bold', color: '#6200ea' },
  userDetails: { fontSize: 14, color: 'gray' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  loadingText: { color: 'white', fontSize: 18, marginTop: 10 },
  productImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    resizeMode: 'contain', // Ajusta la imagen para que sea completamente visible
  },
  productDetails: { marginTop: 10 },
  imageContainer: {
    position: 'relative', // Necesario para posicionar el badge sobre la imagen
  },
  discountBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'red',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    zIndex: 1,
  },
  discountText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ProductScreen;
