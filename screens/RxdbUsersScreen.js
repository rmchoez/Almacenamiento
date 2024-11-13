// RxdbUsersScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import initializeDB, { userCollectionName } from '../database/rxdb';

const RxdbUsersScreen = () => {
  const [db, setDb] = useState(null);
  const [rxdbUsers, setRxdbUsers] = useState([]);

  useEffect(() => {
    const initDB = async () => {
      const DB = await initializeDB();
      setDb(DB);
    };

    initDB();
  }, []);

  useEffect(() => {
    const fetchRxdbUsers = async () => {
      if (db) {
        const users = await db[userCollectionName].find().exec();  // Usa la colección de usuarios
        setRxdbUsers(users.map((user) => user.toJSON()));
      }
    };

    fetchRxdbUsers();
  }, [db]);

  return (
    <View style={styles.container}>
      <FlatList
        data={rxdbUsers}
        keyExtractor={(item) => item?.id?.toString()}
        renderItem={({ item }) => (
          <View style={styles.userCard}>
            <Text style={styles.userName}>{item.firstName} {item.lastName}</Text>
            <Text style={styles.userDetails}>Edad: {item.age} - Género: {item.gender}</Text>
            <Text style={styles.userDetails}>Correo: {item.email}</Text>
          </View>
        )}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  listContainer: { paddingVertical: 20 },
  userCard: { backgroundColor: 'white', padding: 15, marginVertical: 8, borderRadius: 10, marginHorizontal: 20, elevation: 2 },
  userName: { fontSize: 16, fontWeight: 'bold', color:'#6200ea' },
  userDetails: { fontSize: 14, color: 'gray' },
});

export default RxdbUsersScreen;
