// TaskList.js
import React, { useState } from 'react';
import { View, FlatList, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { addTask, toggleTask, deleteTask } from '../actions';
import Ionicons from 'react-native-vector-icons/Ionicons';

const TaskList = () => {
  const tasks = useSelector((state) => state.tasks);
  const dispatch = useDispatch();
  const [newTask, setNewTask] = useState('');

  const handleAddTask = () => {
    if (newTask.trim()) {
      dispatch(addTask(newTask.trim()));
      setNewTask('');
    }
  };

  const handleToggleTask = (id) => {
    dispatch(toggleTask(id));
  };

  const handleDeleteTask = (id) => {
    dispatch(deleteTask(id));
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={newTask}
        onChangeText={setNewTask}
        placeholder="Nueva tarea"
        placeholderTextColor="#aaa"
      />
      <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
        <Text style={styles.addButtonText}>Agregar</Text>
      </TouchableOpacity>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={[styles.taskContainer, item.completed && styles.completedTask]}>
            <Text style={[styles.taskText, item.completed && styles.completedText]}>
              {item.text}
            </Text>
            <TouchableOpacity onPress={() => handleToggleTask(item.id)}>
              <Ionicons
                name="checkmark-circle-outline"
                size={24}
                color={item.completed ? 'green' : 'gray'}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDeleteTask(item.id)}>
                <Ionicons
                  name="trash-outline"
                  size={24}
                  color="red"
                />
              </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 10,
    color:'black',
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  taskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    marginVertical: 5,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  taskText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  completedTask: {
    backgroundColor: '#e0f7e9',
  },
  completedText: {
    color: 'green',
    textDecorationLine: 'line-through',
  },
});

export default TaskList;
