// src/screens/TodoScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet,Alert } from 'react-native';
import initializeDB, { todoCollectionName } from '../database/rxdb';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomAlert from '../components/CustomAlert';


const Notification = ({ message, type, visible }) => {
  const backgroundColors = {
    success: '#d4edda',
    warning: '#fff3cd',
    error: '#f8d7da',
    info: '#d1ecf1',
  };
  
  const color = backgroundColors[type] || backgroundColors.info;
  
  return visible ? (
    <Animated.View style={[styles.notification, { backgroundColor: color }]}>
      <Text style={styles.notificationText}>{message}</Text>
    </Animated.View>
  ) : null;
};


const TodoScreen = () => {
  const [db, setDb] = useState(null);  // Estado local para almacenar la DB
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [todoList, setTodoList] = useState([]);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [notification, setNotification] = useState({ message: '', type: '', visible: false });

  const showNotification = (message, type) => {
    setNotification({ message, type, visible: true });
    setTimeout(() => setNotification({ ...notification, visible: false }), 3000);
  };


  useEffect(() => {
    const initDB = async () => {
      try {
        const DB = await initializeDB();  // Inicializa la base de datos
        setDb(DB);  // Guarda el db cuando se inicializa
      } catch (error) {
        console.log('Error initializing DB:', error);
      }
    };

    initDB();
  }, []);

  useEffect(() => {
    const fetchTodos = async () => {
      if (db) {
        const todos = await db[todoCollectionName].find().exec();  // Obtén los todos de la base de datos
        console.log('Obteniendo los todos de la base de datos RxDB')
        setTodoList(todos);
      }
    };

    fetchTodos();
  }, [db]);

  const addTodo = async () => {
    if (db) {
      const todos = {
        id: `${Date.now()}`,
        title,
        description,
        done: false,
      };
      await db[todoCollectionName].insert(todos);
      setTodoList([...todoList, todos]);
      setTitle('');
      setDescription('');
      showNotification('Todo added successfully!', 'success');
    }
  };

  const updateTodo = async () => {
    const todo = {
      id: selectedTodo?.id,
      title,
      description,
      done: false,
    };
    await db[todoCollectionName].upsert(todo);
    setSelectedTodo(null);
    setTitle('');
    setDescription('');
    showNotification('Todo updated successfully!', 'info');
  };

  const selectTodo = todo => {
    setSelectedTodo(todo);
    setTitle(todo.title);
    setDescription(todo.description);
  };

  const removeTodo = async (todos) => {
    Alert.alert(
      'Delete Todo?',
      `Are you sure you want to delete ${todos.title}`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          style: 'destructive',
          onPress: async () => {
            const doc = db[todoCollectionName].findOne({
              selector: {
                id: todos.id,
                title: todos.title,
                description: todos.description,
              },
            });
            await doc.remove();
            setTodoList(todoList.filter(item => item.id !== todos.id));  // Actualizar la lista
            showNotification('Todo deleted successfully!', 'error');
          },
        },
      ],
    );
  };

  if (!db) {
    return <Text>Loading...</Text>;  // Si la DB no está lista, muestra un mensaje de carga
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={(name) => setTitle(name)}
        placeholder="Title"
        placeholderTextColor={'gray'}
      />
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={(des) => setDescription(des)}
        placeholder="Description"
        placeholderTextColor={'gray'}
      />
      <TouchableOpacity style={styles.button} disabled={!title} onPress={() => {
        !selectedTodo ? addTodo() : updateTodo();
      }}>
        <Text style={styles.buttonText}>  {!selectedTodo ? 'Add Item' : 'Update Item'}</Text>
      </TouchableOpacity>

      <ScrollView>
        {todoList.length === 0 && (
          <>
            <Text style={styles.noTodoStyle}>{'No Todo Items'}</Text>
            <Text style={styles.noTodoStyle}>{'Add one to create'}</Text>
          </>
        )}
        {todoList.map((item, index) => (
          <View style={styles.cardTodo} key={index}>
            <View key={item.id} style={styles.todoItem}>
              <Text style={styles.textlist}>{item.title}</Text>
              <Text style={styles.textlist}>{item.description}</Text>
            </View>
            <View style={styles.alignRight}>
              <TouchableOpacity onPress={() => selectTodo(item)}>
              <Icon
                  name="pencil-outline"  // Lápiz para editar
                  size={30}
                  color="#6200ea"  // Color del icono
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => removeTodo(item)}>
              <Icon
                  name="trash-can-outline"  // Papelera para eliminar
                  size={30}
                  color="#6200ea"  // Color del icono
                />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    color: 'black'
  },
  button: {
    backgroundColor: '#6200ea',
    padding: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  todoItem: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#f4f4f4',
    color: 'black'

  },
  textlist: {
    color: 'black'
  },
  cardTodo: {
    flex: 1,
    marginHorizontal: 12,
    paddingVertical: 15,
    borderBottomColor: 'grey',
    borderBottomWidth: 0.5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  noTodoStyle: { marginTop: 5, textAlign: 'center', color: '#838383' },
  alignRight: {
    marginLeft: 'auto',
    flexDirection: 'row',
  },
  deleteImage: {
    width: 30,
    height: 30,
    marginRight: 15,
  },
});


export default TodoScreen;
