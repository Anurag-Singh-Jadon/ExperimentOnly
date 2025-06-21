import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Button, ActivityIndicator, Image, Alert,FlatList } from 'react-native';

const TernaryOperatorExamples = () => {
  // State for ConditionalRenderingExample
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasNewMessages, setHasNewMessages] = useState(true);

  // State for DynamicStylingExample
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState('pending'); // 'pending', 'approved', 'rejected'

  // State for PropAssignmentExample
  const [isEditable, setIsEditable] = useState(true);
  const [inputValue, setInputValue] = useState('Edit me!');

  // Data for TodoListExample
  const todos = [
    { id: '1', task: 'Buy groceries', completed: false },
    { id: '2', task: 'Walk the dog', completed: true },
    { id: '3', task: 'Pay bills', completed: false },
    { id: '4', task: 'Call Mom', completed: true },
  ];

  // Effect for ConditionalRenderingExample's loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Helper for DynamicStylingExample
  const getStatusColor = useCallback(() => {
    return status === 'approved'
      ? 'green'
      : status === 'rejected'
        ? 'red'
        : 'orange'; // default for pending
  }, [status]);

  // renderItem for TodoListExample
  const renderTodoItem = useCallback(({ item }) => (
    <View style={styles.todoItem}>
      <Text style={item.completed ? styles.completedTask : styles.pendingTask}>
        {item.task}
      </Text>
      <Text style={styles.statusBadge}>
        {item.completed ? 'DONE' : 'PENDING'}
      </Text>
    </View>
  ), []);


  return (
    <ScrollView style={styles.container}>
      <Text style={styles.mainHeader}>Ternary Operator High-Level Uses</Text>
      <Text style={styles.description}>
        Observe how the UI changes dynamically based on state using the ternary operator.
      </Text>

      {/* --- 1. Conditional Rendering --- */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>1. Conditional Rendering</Text>

        {/* 1.1: Show Loader or Content */}
        <Text style={styles.subSubHeader}>Loading State:</Text>
        <View style={styles.exampleContainer}>
          {isLoading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <Text style={styles.content}>Data has loaded!</Text>
          )}
        </View>

        {/* 1.2: Authenticated vs. Guest View */}
        <Text style={styles.subSubHeader}>Authentication State:</Text>
        <View style={styles.exampleContainer}>
          {isLoggedIn ? (
            <View style={styles.authContainer}>
              <Text style={styles.content}>Welcome, User!</Text>
              <Button title="Logout" onPress={() => setIsLoggedIn(false)} />
            </View>
          ) : (
            <View style={styles.authContainer}>
              <Text style={styles.content}>Please log in.</Text>
              <Button title="Login" onPress={() => setIsLoggedIn(true)} />
            </View>
          )}
        </View>

        {/* 1.3: Show/Hide Elements (e.g., Badge) */}
        <Text style={styles.subSubHeader}>Message Badge:</Text>
        <View style={styles.exampleContainer}>
          <View style={styles.iconContainer}>
            <Image source={{ uri: 'https://via.placeholder.com/50?text=Mail' }} style={styles.icon} />
            {hasNewMessages ? (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>3</Text>
              </View>
            ) : null}
          </View>
          <Button
            title={hasNewMessages ? "Mark as Read" : "New Message"}
            onPress={() => setHasNewMessages(!hasNewMessages)}
          />
        </View>
      </View>

      {/* --- 2. Dynamic Styling --- */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>2. Dynamic Styling</Text>

        {/* 2.1: Changing background/border based on state */}
        <Text style={styles.subSubHeader}>Active State:</Text>
        <View style={styles.exampleContainer}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              isActive ? styles.activeButton : styles.inactiveButton,
            ]}
            onPress={() => setIsActive(!isActive)}
          >
            <Text style={styles.buttonText}>{isActive ? 'Active' : 'Inactive'}</Text>
          </TouchableOpacity>
        </View>

        {/* 2.2: Dynamic Text Color based on status */}
        <Text style={styles.subSubHeader}>Status Indicator:</Text>
        <View style={styles.exampleContainer}>
          <Text style={[styles.statusText, { color: getStatusColor() }]}>
            Current Status: {status.toUpperCase()}
          </Text>
          <View style={styles.buttonGroup}>
            <Button title="Pending" onPress={() => setStatus('pending')} />
            <Button title="Approved" onPress={() => setStatus('approved')} />
            <Button title="Rejected" onPress={() => setStatus('rejected')} />
          </View>
        </View>
      </View>

      {/* --- 3. Prop Assignment --- */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>3. Prop Assignment</Text>

        {/* 3.1: Dynamic TextInput props */}
        <Text style={styles.subSubHeader}>Editable Input:</Text>
        <View style={styles.exampleContainer}>
          <TextInput
            style={[
              styles.textInput,
              !isEditable && styles.readOnlyInput,
            ]}
            value={inputValue}
            onChangeText={setInputValue}
            editable={isEditable ? true : false}
            placeholder={isEditable ? "Type here..." : "Not editable"}
            maxLength={isEditable ? 100 : 50}
          />
          <Button
            title={isEditable ? "Make Read-Only" : "Make Editable"}
            onPress={() => setIsEditable(!isEditable)}
          />
        </View>
      </View>

      {/* --- 4. Inline Logic for Array/List Items --- */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>4. Inline Logic for List Items</Text>
        <Text style={styles.subSubHeader}>Todo List:</Text>
        <View style={styles.exampleContainer}>
          <FlatList
            data={todos}
            keyExtractor={item => item.id}
            renderItem={renderTodoItem}
            contentContainerStyle={styles.listContent}
          />
        </View>
      </View>

      <View style={{ height: 50 }} />{/* Spacer at bottom */}
    </ScrollView>
  );
};


// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    padding: 20,
    paddingTop: 50,
  },
  mainHeader: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  description: {
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  section: {
    marginBottom: 30,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
    color: '#444',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 5,
  },
  subSubHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 10,
    color: '#555',
  },
  exampleContainer: {
    backgroundColor: '#fefefe',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 15,
  },
  content: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  authContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  icon: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: 0,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  toggleButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  activeButton: {
    backgroundColor: '#28a745', // Green
  },
  inactiveButton: {
    backgroundColor: '#dc3545', // Red
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 10,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  readOnlyInput: {
    backgroundColor: '#f0f0f0',
    color: '#888',
  },
  listContent: {
    paddingBottom: 10,
  },
  todoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fdfdfd',
    padding: 12,
    borderRadius: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 8,
  },
  pendingTask: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  completedTask: {
    fontSize: 16,
    color: '#888',
    textDecorationLine: 'line-through',
    flex: 1,
  },
  statusBadge: {
    fontSize: 12,
    fontWeight: 'bold',
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    marginLeft: 10,
    color: '#555',
  },
});

export default TernaryOperatorExamples;