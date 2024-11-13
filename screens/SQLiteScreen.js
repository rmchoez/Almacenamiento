import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import { useSQLiteDatabase } from '../database/sqlite'; // Asumimos que tienes una función de conexión a SQLite

const SQLiteScreen = () => {
  const [cart, setCart] = useState([]);
  const db = useSQLiteDatabase();

  useEffect(() => {
    const fetchCartItems = async () => {
      const items = await db.getItems();
      setCart(items);
    };
    fetchCartItems();
  }, [db]);

  const addItemToCart = async () => {
    await db.addItem({ product: 'Laptop', price: 1000 });
    alert('Item added to cart!');
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Shopping Cart (SQLite):</Text>
      {cart.map((item, index) => (
        <Text key={index}>
          {item.product} - ${item.price}
        </Text>
      ))}
      <Button title="Add Item" onPress={addItemToCart} />
    </View>
  );
};

export default SQLiteScreen;
