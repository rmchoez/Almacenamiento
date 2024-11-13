import React, { useState, useEffect } from 'react';
import SQLite from 'react-native-sqlite-2';

// Abre la base de datos de SQLite
const db = SQLite.openDatabase('shoppingcart.db', '1.0', '', 1, () => {}, (error) => console.log(error));

// Hook personalizado para manejar la base de datos de SQLite
export const useSQLiteDatabase = () => {
  const [database, setDatabase] = useState(db);  // Estado para almacenar la base de datos
  const [items, setItems] = useState([]);  // Estado para almacenar los items

  // Inicializar y obtener datos
  useEffect(() => {
    const fetchItems = () => {
      database.transaction((tx) => {
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS cart (id INTEGER PRIMARY KEY AUTOINCREMENT, product TEXT, price REAL);',
          [],
          () => {
            tx.executeSql('SELECT * FROM cart;', [], (tx, results) => {
              const rows = results.rows.raw();
              setItems(rows);
            });
          }
        );
      });
    };
    fetchItems();
  }, [database]);

  // Agregar un nuevo item al carrito
  const addItem = (item) => {
    database.transaction((tx) => {
      tx.executeSql('INSERT INTO cart (product, price) VALUES (?, ?);', [item.product, item.price], () => {
        fetchItems();  // Vuelve a obtener los items después de insertar uno nuevo
      });
    });
  };

  return { database, items, addItem };
};
