import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, Alert } from 'react-native';

const PopExamples = () => {
  // State for managing a list of items
  const [historyStack, setHistoryStack] = useState(['Home', 'Profile', 'Settings']);
  const [currentItem, setCurrentItem] = useState('Settings');

  // Example 1: INCORRECT (Direct Mutation - Avoid for State)
  // This will remove the item from the array, but React might NOT re-render reliably
  // This is a high-level example of what NOT to do with state in React Native.
  const goBackMutable = useCallback(() => {
    if (historyStack.length <= 1) {
      Alert.alert('Info', 'History stack is empty or has only one item.');
      return;
    }
    // DANGER: Direct mutation
    const removedItem = historyStack.pop(); // Mutates the array
    setCurrentItem(historyStack[historyStack.length - 1] || 'Home'); // Update current item
    setHistoryStack(historyStack); // React might not see this as a change
    Alert.alert(
      'Warning',
      `Popped "${removedItem}" (Mutable): Check console and observe potential UI issue. Current: ${currentItem}`
    );
    console.log('Mutable History Stack:', historyStack);
  }, [historyStack, currentItem]); // `historyStack` is in dependencies because we're directly accessing it

  // Example 2: CORRECT (Immutable Update with slice())
  // This is the recommended way to "pop" from a state array.
  const goBackImmutable = useCallback(() => {
    if (historyStack.length <= 1) {
      Alert.alert('Info', 'History stack is empty or has only one item.');
      return;
    }
    // Correct way: Create a NEW array without the last element
    const newHistoryStack = historyStack.slice(0, historyStack.length - 1);
    const removedItem = historyStack[historyStack.length - 1]; // Get item before slicing
    setHistoryStack(newHistoryStack);
    setCurrentItem(newHistoryStack[newHistoryStack.length - 1] || 'Home');
    Alert.alert(
      'Success',
      `Popped "${removedItem}" (Immutable). Current: ${newHistoryStack[newHistoryStack.length - 1] || 'Home'}`
    );
  }, [historyStack]);

  const addPageToHistory = useCallback(() => {
    const pages = ['Dashboard', 'Analytics', 'Reports', 'Users'];
    const nextPage = pages[Math.floor(Math.random() * pages.length)];
    setHistoryStack(prevStack => [...prevStack, nextPage]); // Use spread for immutable push
    setCurrentItem(nextPage);
    Alert.alert('Added Page', `Added "${nextPage}" to history.`);
  }, []);

  // Example 3: Using pop in non-state-related contexts (e.g., processing a queue)
  const processQueue = useCallback(() => {
    const messageQueue = ['Order 123', 'Payment Failed', 'New User Registered', 'Email Sent'];
    const processedMessages = [];

    Alert.alert('Processing Queue', 'Starting to process messages...');
    const intervalId = setInterval(() => {
      if (messageQueue.length > 0) {
        const nextMessage = messageQueue.pop(); // OK to pop here
        processedMessages.push(`Processed: ${nextMessage}`); // OK to push here
        console.log(`Processing: ${nextMessage}. Remaining in queue: ${messageQueue.length}`);
      } else {
        clearInterval(intervalId);
        Alert.alert('Queue Empty', `All messages processed:\n${processedMessages.join('\n')}`);
        console.log('Final Processed Messages (local array):', processedMessages);
      }
    }, 1000);
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.mainHeader}>`pop()` Examples</Text>
      <Text style={styles.description}>
        Removing the last element from arrays. Critical distinction for React Native state.
      </Text>

      {/* --- Current State Display --- */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Current Navigation State</Text>
        <Text style={styles.statusText}>Current Page: {currentItem}</Text>
        <Text style={styles.statusText}>
          History Stack: {historyStack.length > 0 ? historyStack.join(' -> ') : 'Empty'}
        </Text>
        <Button title="Add Random Page to History" onPress={addPageToHistory} />
      </View>

      {/* --- Example 1: INCORRECT (Direct Mutation - AVOID for State) --- */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>1. 🚫 AVOID: Direct `pop()` on State</Text>
        <Text style={styles.warningText}>
          Changing state arrays with `pop()` directly will NOT reliably trigger re-renders.
          Open console to see the array mutate, but UI might not update without external triggers.
        </Text>
        <Button title="Go Back (Mutable Pop)" onPress={goBackMutable} color="#dc3545" />
      </View>

      {/* --- Example 2: CORRECT (Immutable Update with slice()) --- */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>2. ✅ RECOMMENDED: Immutable Update for State</Text>
        <Text style={styles.infoText}>
          Use `slice()` to create a new array without the last element. This is the correct way
          to "pop" elements from a state array in React Native.
        </Text>
        <Button title="Go Back (Immutable Pop)" onPress={goBackImmutable} />
      </View>

      {/* --- Example 3: Using pop in non-state-related contexts --- */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>3. OK: `pop()` for Local/Temporary Arrays</Text>
        <Text style={styles.infoText}>
          It's perfectly fine to use `pop()` when processing data from local,
          temporary arrays or queues that are not directly part of your React state.
        </Text>
        <Button title="Process Message Queue" onPress={processQueue} color="#28a745" />
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
  statusText: {
    fontSize: 15,
    color: '#555',
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 10,
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
});

export default PopExamples;