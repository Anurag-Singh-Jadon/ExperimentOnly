import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Button, Alert } from 'react-native';

const PushExamples = () => {
  // State for managing a list of items
  const [todoList, setTodoList] = useState([]);
  const [newTodoText, setNewTodoText] = useState('');

  // Example 1: INCORRECT (Direct Mutation - Avoid for State)
  // This will add the item to the array, but React might NOT re-render
  // This is a high-level example of what NOT to do with state in React Native.
  const addTodoMutable = useCallback(() => {
    if (newTodoText.trim() === '') {
      Alert.alert('Error', 'Todo cannot be empty!');
      return;
    }
    // DANGER: Direct mutation
    todoList.push(newTodoText.trim());
    setTodoList(todoList); // React might not see this as a change, leading to no re-render
    setNewTodoText('');
    Alert.alert('Warning', 'Added Todo (Mutable): Check console and observe potential UI issue.');
    console.log('Mutable Todo List:', todoList);
  }, [newTodoText, todoList]); // `todoList` is in dependencies because we're directly accessing it

  // Example 2: CORRECT (Immutable Update with Spread Operator)
  // This is the recommended way to "push" to a state array.
  const addTodoImmutable = useCallback(() => {
    if (newTodoText.trim() === '') {
      Alert.alert('Error', 'Todo cannot be empty!');
      return;
    }
    const newItem = newTodoText.trim();
    setTodoList(prevTodoList => [...prevTodoList, newItem]); // Creates a NEW array
    setNewTodoText('');
    Alert.alert('Success', `Added Todo (Immutable): "${newItem}"`);
  }, [newTodoText]);

  // Example 3: Adding multiple items (simulated batch push)
  const addMultipleTodosImmutable = useCallback(() => {
    const itemsToAdd = ['Learn Hooks', 'Build an App', 'Deploy to Stores'];
    setTodoList(prevTodoList => [...prevTodoList, ...itemsToAdd]); // Spreads multiple items into new array
    Alert.alert('Success', `Added ${itemsToAdd.length} default todos.`);
  }, []);

  // Example 4: Using push in non-state-related contexts (e.g., building a temporary array)
  const processDataForDisplay = useCallback(() => {
    const rawData = [
      { id: 1, value: 10, type: 'A' },
      { id: 2, value: 20, type: 'B' },
      { id: 3, value: 15, type: 'A' },
    ];
    const processedReport = []; // A temporary array, not state

    rawData.forEach(item => {
      if (item.type === 'A') {
        processedReport.push(`Type A: ${item.value}`); // OK to push here
      } else {
        processedReport.push(`Type B (Special): ${item.value * 2}`); // OK to push here
      }
    });

    Alert.alert('Processed Report', processedReport.join('\n'));
    console.log('Processed Report (local array):', processedReport);
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.mainHeader}>`push()` Examples</Text>
      <Text style={styles.description}>
        Adding elements to arrays. Crucial distinction for React Native state.
      </Text>

      {/* --- Example 1: INCORRECT (Direct Mutation - AVOID for State) --- */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>1. 🚫 AVOID: Direct `push()` on State</Text>
        <Text style={styles.warningText}>
          Changing state arrays with `push()` directly will NOT reliably trigger re-renders.
          Open console to see the array mutate, but UI might not update without external triggers.
        </Text>
        <TextInput
          style={styles.textInput}
          placeholder="Add a todo (Avoid)"
          value={newTodoText}
          onChangeText={setNewTodoText}
        />
        <Button title="Add Todo (Mutable)" onPress={addTodoMutable} color="#dc3545" />
      </View>

      {/* --- Example 2: CORRECT (Immutable Update with Spread Operator) --- */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>2. ✅ RECOMMENDED: Immutable Update for State</Text>
        <Text style={styles.infoText}>
          Use spread operator (`...`) to create a new array. This is the correct way
          to "push" elements to a state array in React Native.
        </Text>
        <TextInput
          style={styles.textInput}
          placeholder="Add a todo (Recommended)"
          value={newTodoText}
          onChangeText={setNewTodoText}
          onSubmitEditing={addTodoImmutable} // Add on Enter key
        />
        <Button title="Add Todo (Immutable)" onPress={addTodoImmutable} />
        <Button title="Add Multiple Default Todos" onPress={addMultipleTodosImmutable} style={styles.buttonSpacing} />

        <Text style={styles.subSubHeader}>Current Todo List:</Text>
        {todoList.length > 0 ? (
          todoList.map((todo, index) => (
            <Text key={index} style={styles.listItemText}>• {todo}</Text>
          ))
        ) : (
          <Text style={styles.emptyListText}>No todos yet.</Text>
        )}
      </View>

      {/* --- Example 3: Using push in non-state-related contexts --- */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>3. OK: `push()` for Local/Temporary Arrays</Text>
        <Text style={styles.infoText}>
          It's perfectly fine to use `push()` when building temporary arrays or
          processing data that is not directly part of your component's React state.
        </Text>
        <Button title="Process Data Report" onPress={processDataForDisplay} color="#28a745" />
      </View>

      <View style={{ height: 50 }} />
    </ScrollView>
  );
};

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
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  warningText: {
    color: '#dc3545',
    marginBottom: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  infoText: {
    color: '#007bff',
    marginBottom: 10,
    textAlign: 'center',
  },
  buttonSpacing: {
    marginTop: 10,
  },
  listItemText: {
    fontSize: 15,
    color: '#444',
    marginLeft: 10,
    marginBottom: 5,
  },
  emptyListText: {
    textAlign: 'center',
    padding: 10,
    color: '#888',
    fontSize: 15,
  },
});

export default PushExamples;