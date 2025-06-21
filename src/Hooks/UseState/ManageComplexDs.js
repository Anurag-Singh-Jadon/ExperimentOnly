import React, { useState } from 'react';
import { View, Text, Button, FlatList, TextInput, StyleSheet } from 'react-native';

const ComplexDataStateExample = () => {
  // Managing an array of objects (e.g., a todo list)
  const [todos, setTodos] = useState([
    { id: '1', text: 'Learn React Native Hooks', completed: false },
    { id: '2', text: 'Build a demo app', completed: false },
  ]);
  const [newTodoText, setNewTodoText] = useState('');

  // Managing an object (e.g., user profile)
  const [userProfile, setUserProfile] = useState({
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'jane@example.com',
  });

  const addTodo = () => {
    if (newTodoText.trim() === '') return;
    const newTodo = {
      id: String(todos.length + 1), // Simple ID for demo
      text: newTodoText,
      completed: false,
    };
    // Immutable array update: create a new array with the new todo
    setTodos(prevTodos => [...prevTodos, newTodo]);
    setNewTodoText('');
  };

  const toggleTodoCompleted = (id) => {
    // Immutable array update: map to a new array, update the specific todo immutably
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const updateUserEmail = () => {
    // Immutable object update: create a new object with the updated email
    setUserProfile(prevProfile => ({
      ...prevProfile, // Copy all existing properties
      email: 'jane.new@example.com', // Override the email property
    }));
  };

  const renderTodoItem = ({ item }) => (
    <View style={styles.todoItem}>
      <Text
        style={[styles.todoText, item.completed && styles.todoCompleted]}
        onPress={() => toggleTodoCompleted(item.id)}
      >
        {item.text}
      </Text>
    </View>
  );

  return (
    <View style={styles.section}>
      <Text style={styles.sectionHeader}>2. Managing Complex Data Structures</Text>

      <View style={styles.exampleContainer}>
        <Text style={styles.subSubHeader}>Todo List:</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Add new todo"
          value={newTodoText}
          onChangeText={setNewTodoText}
          onSubmitEditing={addTodo}
        />
        <Button title="Add Todo" onPress={addTodo} />
        <FlatList
          data={todos}
          keyExtractor={item => item.id}
          renderItem={renderTodoItem}
          style={styles.todoList}
        />
      </View>

      <View style={styles.exampleContainer}>
        <Text style={styles.subSubHeader}>User Profile:</Text>
        <Text style={styles.statusText}>Name: {userProfile.firstName} {userProfile.lastName}</Text>
        <Text style={styles.statusText}>Email: {userProfile.email}</Text>
        <Button title="Update Email" onPress={updateUserEmail} />
      </View>
    </View>
  );
};