import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

const todos = [
  { id: '1', task: 'Buy groceries', completed: false },
  { id: '2', task: 'Walk the dog', completed: true },
  { id: '3', task: 'Pay bills', completed: false },
  { id: '4', task: 'Call Mom', completed: true },
];

export const TodoListExample = () => {
  const renderItem = ({ item }) => (
    <View style={styles.todoItem}>
      <Text style={item.completed ? styles.completedTask : styles.pendingTask}>
        {item.task}
      </Text>
      <Text style={styles.statusBadge}>
        {item.completed ? 'DONE' : 'PENDING'} {/* Ternary for text content */}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Todo List</Text>
      <FlatList
        data={todos}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
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
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  todoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    marginVertical: 5,
    borderRadius: 5,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
  },
  completedTask: {
    color: 'green',
    textDecorationLine: 'line-through',
  },
  pendingTask: {
    color: 'orange',
  },
  statusBadge: {
    fontWeight: 'bold',
    color: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    backgroundColor: '#007bff', // Bootstrap primary color
  },
});