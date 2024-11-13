import { addRxPlugin, createRxDatabase } from 'rxdb';
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
import { getRxStorageMemory } from 'rxdb/plugins/memory';
import { RxDBMigrationPlugin } from 'rxdb/plugins/migration';
import { RxDBQueryBuilderPlugin } from 'rxdb/plugins/query-builder';
import { RxDBUpdatePlugin } from 'rxdb/plugins/update';
import uuid from 'react-native-uuid';

addRxPlugin(RxDBMigrationPlugin);
addRxPlugin(RxDBUpdatePlugin);
addRxPlugin(RxDBQueryBuilderPlugin);

import { TodoSchema } from '../schema/TodoSchema';
import { UserSchema } from '../schema/UserSchema';

export const STORAGE = getRxStorageMemory();
const dbName = 'todosreactdatabase';
export const todoCollectionName = 'todo';
export const userCollectionName = 'user';

const isDevelopment =
  process.env.NODE_ENV !== 'production' || process.env.DEBUG_PROD === 'true';

// Variable para almacenar la instancia de la base de datos
let dbInstance = null;

const initializeDB = async () => {
  // Evitar agregar el plugin más de una vez
  if (isDevelopment && !dbInstance) {
    console.log('Base Rxdb no iniciada aún, vamos desde cero , agregando plugin devmode')
    addRxPlugin(RxDBDevModePlugin); // Solo agregar el plugin si la db no está creada
  }

  if (dbInstance) {
    console.log('Base Rxdb ya iniciada')
    return dbInstance; // Si la base de datos ya está inicializada, retornarla
  }

  try {
    // Crear la base de datos solo si no existe
    dbInstance = await createRxDatabase({
      name: dbName,
      storage: STORAGE,
      multiInstance: false,
      ignoreDuplicate: true,
    });
    console.log('Base Rxdb creada')
    
    await dbInstance.addCollections({
      [todoCollectionName]: { schema: TodoSchema },
      [userCollectionName]: { schema: UserSchema },
    });
 

    console.log('Colecciones creadas: TodoList y Users');

    // Insertar un register en cada collection
    await dbInstance[todoCollectionName].insert({
      id: `${Date.now()}`,
      title: 'Antibiotics',
      description: 'Bring Medicine from store',
      done: 'true',
    });

    await dbInstance[userCollectionName].insert({
      uuid: uuid.v4(), // Genera un UUID único
      id: 900,
      firstName: 'Richard',
      lastName: 'Choez',
      email: 'rmchoez@gmail.com',
      phone: '+81 965-431-3024',
    });
  } catch (err) {
    console.log('ERROR CREATING DATABASE', err);
  }

  return dbInstance;
};

export default initializeDB;
