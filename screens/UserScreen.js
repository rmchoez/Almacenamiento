import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, Animated, Modal, ActivityIndicator } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import initializeDB, { userCollectionName } from '../database/rxdb';

const UserScreen = () => {
  const [db, setDb] = useState(null);  // Estado local para almacenar la DB
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]); // Nuevo estado para selección de usuarios
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [minAge, setMinAge] = useState('');
  const [maxAge, setMaxAge] = useState('');
  const [gender, setGender] = useState('');
  const slideAnim = useState(new Animated.Value(-300))[0];
  const dotsAnim = useState(new Animated.Value(0))[0];
  const navigation = useNavigation();

  useEffect(() => {
    fetchUsers();
    startDotsAnimation();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('https://dummyjson.com/users');
      setUsers(response.data.users);
      setFilteredUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectUser = (userId) => {
    setSelectedUsers(prevSelected => {
      if (prevSelected.includes(userId)) {
        return prevSelected.filter(id => id !== userId);
      } else {
        return [...prevSelected, userId];
      }
    });
  };

  const handleSaveSelected = async () => {
    try {
      const DB = await initializeDB();
      setDb(DB);
      const usersToSave = users.filter(user => selectedUsers.includes(user.id));


      if (db) {
        await db[userCollectionName].insert(usersToSave);
        console.log("Usuarios guardados en RxDB");
      }
    } catch (error) {
      console.log("Error guardando usuarios en RxDB:", error);
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
    let tempUsers = users;
    if (searchText) {
      tempUsers = tempUsers.filter(user =>
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    if (minAge || maxAge) {
      tempUsers = tempUsers.filter(user => (
        (!minAge || user.age >= parseInt(minAge)) &&
        (!maxAge || user.age <= parseInt(maxAge))
      ));
    }
    if (gender) {
      tempUsers = tempUsers.filter(user => user.gender === gender);
    }
    setFilteredUsers(tempUsers);
    toggleFilterPanel();
  };

  const toggleFilterPanel = () => {
    Animated.timing(slideAnim, {
      toValue: showFilters ? -300 : 0,
      duration: 300,
      useNativeDriver: true
    }).start(() => setShowFilters(!showFilters));
  };

  const navigateToUserDetail = (user) => {
    navigation.navigate('UserDetailScreen', { user });
  };

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
          placeholder="Buscar por nombre o apellido"
          placeholderTextColor="gray"
          value={searchText}
          onChangeText={setSearchText}
        />
        <TextInput
          style={styles.input}
          placeholder="Edad mínima"
          keyboardType="numeric"
          placeholderTextColor="gray"
          value={minAge}
          onChangeText={setMinAge}
        />
        <TextInput
          style={styles.input}
          placeholder="Edad máxima"
          keyboardType="numeric"
          placeholderTextColor="gray"
          value={maxAge}
          onChangeText={setMaxAge}
        />
        <TextInput
          style={styles.input}
          placeholder="Género (male/female)"
          placeholderTextColor="gray"
          value={gender}
          onChangeText={setGender}
        />
        <TouchableOpacity onPress={applyFilters} style={styles.applyButton}>
          <Text style={styles.applyButtonText}>Aplicar Filtros</Text>
        </TouchableOpacity>
      </Animated.View>

      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleSelectUser(item.id)}
            onLongPress={() => navigateToUserDetail(item)}
            style={[styles.userCard, selectedUsers.includes(item.id) && styles.selectedUserCard]}
          >
            <Text style={styles.userName}>{item.firstName} {item.lastName}</Text>
            <Text style={styles.userDetails}>Edad: {item.age} - Género: {item.gender}</Text>
            <Text style={styles.userDetails}>Correo: {item.email}</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContainer}
      />

      {/* Mostrar el botón de guardar solo si hay usuarios seleccionados */}
      {selectedUsers.length > 0 && (
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
  userCard: { backgroundColor: 'white', padding: 15, marginVertical: 8, borderRadius: 10, marginHorizontal: 20, elevation: 2 },
  selectedUserCard: { backgroundColor: '#f0e6ff' }, // Color más claro para selección
  saveButton: { backgroundColor: '#6200ea', padding: 15, borderRadius: 5, margin: 20 },
  saveButtonText: { color: 'white', textAlign: 'center', fontWeight: 'bold' },
  userName: { fontSize: 16, fontWeight: 'bold', color: '#6200ea' },
  userDetails: { fontSize: 14, color: 'gray' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  loadingText: { color: 'white', fontSize: 18, marginTop: 10 }
});

export default UserScreen;
