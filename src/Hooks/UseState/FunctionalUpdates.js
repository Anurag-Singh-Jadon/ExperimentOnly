import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const FunctionalUpdatesExample = () => {
  const [count, setCount] = useState(0);

  const increment = () => {
    // High-Level Use 4.1: Functional update for reliable increments
    setCount(prevCount => prevCount + 1);
  };

  const incrementTwiceBuggy = () => {
    // High-Level Use 4.2: BAD PRACTICE - potential race condition if not using functional update
    // If these run in quick succession, they might both read the same 'count' value
    // and both set it to count + 1, resulting in only +1 instead of +2.
    setCount(count + 1);
    setCount(count + 1);
  };

  const incrementTwiceCorrect = () => {
    // High-Level Use 4.3: Correct way to update multiple times in a single render cycle
    setCount(prevCount => prevCount + 1);
    setCount(prevCount => prevCount + 1);
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionHeader}>4. Functional Updates</Text>
      <View style={styles.exampleContainer}>
        <Text style={styles.statusText}>Count: {count}</Text>
        <Button title="Increment by 1" onPress={increment} />
        <Button title="Increment Twice (Buggy)" onPress={incrementTwiceBuggy} />
        <Button title="Increment Twice (Correct)" onPress={incrementTwiceCorrect} />
        <Button title="Reset Count" onPress={() => setCount(0)} />
      </View>
    </View>
  );
};