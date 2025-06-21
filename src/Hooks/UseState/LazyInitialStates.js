import React, { useState } = 'react';
import { View, Text, StyleSheet } from 'react-native';

// Simulate an expensive computation
const computeInitialValue = () => {
  console.log('Computing initial heavy value...');
  let sum = 0;
  for (let i = 0; i < 100000000; i++) {
    sum += i;
  }
  return sum;
};

const LazyInitialStateExample = () => {
  // High-Level Use 3.1: Pass a function for lazy initialization
  // This function (computeInitialValue) will only run once on component mount.
  const [heavyValue, setHeavyValue] = useState(computeInitialValue);

  // If you did this, it would run on every re-render (inefficient):
  // const [anotherValue, setAnotherValue] = useState(computeInitialValue()); // DON'T DO THIS for heavy ops

  return (
    <View style={styles.section}>
      <Text style={styles.sectionHeader}>3. Lazy Initial State</Text>
      <View style={styles.exampleContainer}>
        <Text style={styles.statusText}>
          Computed Heavy Value (initialized once): {heavyValue}
        </Text>
        <Text style={styles.subSubHeader}>
          Check console logs: "Computing initial heavy value..." should appear only once.
        </Text>
        <Button title="Trigger Re-render" onPress={() => console.log('Re-rendered')} />
        {/* Just trigger a re-render to confirm computeInitialValue doesn't run again */}
      </View>
    </View>
  );
};