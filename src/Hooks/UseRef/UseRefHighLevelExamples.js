import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Button,
  FlatList,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

const UseRefHighLevelExamples = () => {
  // 1. Accessing Imperative UI Handles
  const textInputRef = useRef(null); // Ref for TextInput
  const flatListRef = useRef(null); // Ref for FlatList
  const [flatListData] = useState(Array.from({ length: 50 }, (_, i) => ({ id: String(i), text: `Item ${i}` })));

  // 2. Storing Mutable Values (that don't trigger re-renders)
  const timerIdRef = useRef(null); // To store setInterval ID
  const [timerCount, setTimerCount] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Example: Storing a flag to track if component is mounted
  const isMounted = useRef(false);

  // Example: Storing previous prop/state value
  const [currentValue, setCurrentValue] = useState(0);
  const previousValueRef = useRef();

  // 3. Preserving Values Across Re-renders
  // This value will maintain its reference across renders
  const functionCallCount = useRef(0);

  // --- Handlers for Imperative UI Handles ---
  const focusTextInput = useCallback(() => {
    // Calling an imperative method on the native TextInput component
    textInputRef.current?.focus();
    Alert.alert("Action", "TextInput focused!");
  }, []);

  const clearTextInput = useCallback(() => {
    // Calling an imperative method on the native TextInput component
    textInputRef.current?.clear();
    Alert.alert("Action", "TextInput cleared!");
  }, []);

  const scrollFlatListToTop = useCallback(() => {
    // Calling an imperative method on the native FlatList component
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    Alert.alert("Action", "FlatList scrolled to top!");
  }, []);

  const scrollFlatListToIndex = useCallback((index) => {
    // Calling an imperative method on the native FlatList component
    flatListRef.current?.scrollToIndex({ index, animated: true, viewPosition: 0.5 });
    Alert.alert("Action", `FlatList scrolled to index ${index}!`);
  }, []);

  // --- Handlers for Storing Mutable Values (Timers) ---
  const startTimer = useCallback(() => {
    if (!timerIdRef.current) { // Prevent multiple timers
      timerIdRef.current = setInterval(() => {
        setTimerCount(prevCount => prevCount + 1);
      }, 1000);
      setIsTimerRunning(true);
      Alert.alert("Timer", "Timer Started!");
    }
  }, []);

  const stopTimer = useCallback(() => {
    if (timerIdRef.current) {
      clearInterval(timerIdRef.current);
      timerIdRef.current = null; // Clear the ref value
      setIsTimerRunning(false);
      Alert.alert("Timer", "Timer Stopped!");
    }
  }, []);

  // --- useEffect for component mounted flag (isMounted.current) ---
  useEffect(() => {
    isMounted.current = true; // Set flag to true when component mounts
    console.log("Component mounted:", isMounted.current);

    return () => {
      isMounted.current = false; // Set flag to false when component unmounts
      console.log("Component unmounted:", isMounted.current);
      // This is useful to prevent "Can't perform a React state update on an unmounted component" warning
      // if you have async operations that might try to setState after unmount.
    };
  }, []);

  // --- useEffect for previousValueRef ---
  useEffect(() => {
    // Store the current value into the ref after each render
    previousValueRef.current = currentValue;
    console.log(`Current Value: ${currentValue}, Previous Value: ${previousValueRef.current}`);
  }, [currentValue]); // This effect runs whenever currentValue changes

  // --- Demo for functionCallCount ---
  const handleRandomAction = useCallback(() => {
    functionCallCount.current += 1; // Increment ref value, doesn't trigger re-render
    Alert.alert(
      "Action Triggered",
      `This button was clicked ${functionCallCount.current} times. (Check console for initial render value only)`
    );
    console.log(`Function Call Count (from ref): ${functionCallCount.current}`);
  }, []);

  // Initial console log for functionCallCount, demonstrating its persistence
  useEffect(() => {
    console.log("Initial functionCallCount.current on mount:", functionCallCount.current);
  }, []);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.container}>
        <Text style={styles.mainHeader}>`useRef` High-Level Examples</Text>
        <Text style={styles.description}>
          Observe how `useRef` interacts with native components and stores mutable values across renders without causing re-renders.
        </Text>

        {/* 1. Accessing Imperative UI Handles */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>1. Imperative UI Handles</Text>
          <View style={styles.exampleContainer}>
            <TextInput
              ref={textInputRef} // Assign ref to TextInput
              style={styles.textInput}
              placeholder="Type something here..."
            />
            <View style={styles.buttonGroup}>
              <Button title="Focus Input" onPress={focusTextInput} />
              <Button title="Clear Input" onPress={clearTextInput} color="#dc3545" />
            </View>
          </View>

          <View style={styles.exampleContainer}>
            <Text style={styles.subSubHeader}>FlatList Scroll:</Text>
            <View style={{ height: 150, borderWidth: 1, borderColor: '#eee', marginBottom: 10 }}>
              <FlatList
                ref={flatListRef} // Assign ref to FlatList
                data={flatListData}
                keyExtractor={item => item.id}
                renderItem={({ item }) => <Text style={styles.flatListItem}>{item.text}</Text>}
              />
            </View>
            <View style={styles.buttonGroup}>
              <Button title="Scroll to Top" onPress={scrollFlatListToTop} />
              <Button title="Scroll to Index 25" onPress={() => scrollFlatListToIndex(25)} />
            </View>
          </View>
        </View>

        {/* 2. Storing Mutable Values (no re-render) */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>2. Storing Mutable Values</Text>
          <View style={styles.exampleContainer}>
            <Text style={styles.statusText}>Timer: {timerCount} seconds</Text>
            <View style={styles.buttonGroup}>
              <Button title="Start Timer" onPress={startTimer} disabled={isTimerRunning} />
              <Button title="Stop Timer" onPress={stopTimer} disabled={!isTimerRunning} color="#dc3545" />
            </View>
            <Text style={styles.subContent}>
              (Timer count updates state, but timerIdRef itself changing doesn't cause re-render)
            </Text>
          </View>

          <View style={styles.exampleContainer}>
            <Text style={styles.subSubHeader}>Previous Value Tracker:</Text>
            <Text style={styles.statusText}>
              Current: {currentValue} | Previous (via useRef): {previousValueRef.current ?? 'N/A'}
            </Text>
            <Button title="Increment Value" onPress={() => setCurrentValue(prev => prev + 1)} />
            <Text style={styles.subContent}>
              (Previous value updates after current value, stored in ref)
            </Text>
          </View>

          <View style={styles.exampleContainer}>
            <Text style={styles.subSubHeader}>Component Mounted Flag:</Text>
            <Text style={styles.statusText}>
              Component is currently mounted: {isMounted.current ? 'True' : 'False'}
            </Text>
            <Text style={styles.subContent}>
              (This flag is set via useRef and useEffect on mount/unmount)
            </Text>
          </View>
        </View>

        {/* 3. Preserving Values Across Re-renders */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>3. Preserving Values Across Renders</Text>
          <View style={styles.exampleContainer}>
            <Text style={styles.statusText}>
              Function Call Count (via useRef): {functionCallCount.current}
            </Text>
            <Button title="Perform Random Action" onPress={handleRandomAction} />
            <Text style={styles.subContent}>
              (Incrementing `functionCallCount.current` does NOT cause a re-render. Only the alert is shown.)
            </Text>
          </View>
        </View>

        <View style={{ height: 50 }} />
      </ScrollView>
    </KeyboardAvoidingView>
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
  exampleContainer: {
    backgroundColor: '#fefefe',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 15,
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
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  flatListItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  statusText: {
    fontSize: 15,
    color: '#555',
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 10,
  },
  subContent: {
    fontSize: 13,
    color: '#888',
    textAlign: 'center',
    marginTop: 5,
  },
});

export default UseRefHighLevelExamples;