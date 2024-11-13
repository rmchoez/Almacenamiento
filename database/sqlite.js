import SQLite from 'react-native-sqlite-2';

const db = SQLite.openDatabase('shoppingcart.db', '1.0', '', 1, () => {}, (error) => console.log(error));

export const useSQLiteDatabase = () => {
  const [database, setDatabase] = React.useState(db);
  const [items, setItems] = React.useState([]);

  // Inicializar y obtener datos
  React.useEffect(() => {
    const fetchItems = () => {
      database.transaction((tx) => {
        tx.executeSql('CREATE TABLE IF NOT EXISTS cart (id INTEGER PRIMARY KEY AUTOINCREMENT, product TEXT, price REAL);', [], () => {
          tx.executeSql('SELECT * FROM cart;', [], (tx, results) => {
            const rows = results.rows.raw();
            setItems(rows);
          });
        });
      });
    };
    fetchItems();
  }, [database]);

  // Agregar un nuevo item al carrito
  const addItem = (item) => {
    database.transaction((tx) => {
      tx.executeSql('INSERT INTO cart (product, price) VALUES (?, ?);', [item.product, item.price], () => {
        fetchItems();
      });
    });
  };

  return { database, items, addItem };
};
