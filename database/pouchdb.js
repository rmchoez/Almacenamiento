import PouchDB from 'pouchdb-react-native';
import PouchDBSqliteAdapter from 'pouchdb-adapter-react-native-sqlite';

// Registra el adaptador SQLite en PouchDB
PouchDB.plugin(PouchDBSqliteAdapter);

const db = new PouchDB('pouchdb_items', { adapter: 'react-native-sqlite' });

export const usePouchDB = () => {
  const [database, setDatabase] = React.useState(db);
  const [items, setItems] = React.useState([]);

  // Obtener todos los documentos
  React.useEffect(() => {
    const fetchItems = async () => {
      const result = await database.allDocs({ include_docs: true });
      setItems(result.rows.map(row => row.doc));
    };
    fetchItems();
  }, [database]);

  // Agregar un nuevo item
  const saveItem = async (item) => {
    const response = await database.put({
      _id: new Date().toISOString(),
      name: item.name,
    });
    setItems((prevItems) => [...prevItems, { _id: response.id, name: item.name }]);
  };

  return { database, items, saveItem };
};
