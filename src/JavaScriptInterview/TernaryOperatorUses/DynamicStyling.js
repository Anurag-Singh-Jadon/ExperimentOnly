import React, { useState } from 'react';
import { View, Text, Button, StyleSheet,TouchableOpacity } from 'react-native';

export const DynamicStylingExample = () => {
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState('pending'); // 'pending', 'approved', 'rejected'

  const getStatusColor = () => {
    return status === 'approved'
      ? 'green'
      : status === 'rejected'
        ? 'red'
        : 'orange'; // default for pending
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Dynamic Styling</Text>

      {/* High-Level Use 2.1: Changing background/border based on state */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Active State:</Text>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            isActive ? styles.activeButton : styles.inactiveButton, // Ternary for style object
          ]}
          onPress={() => setIsActive(!isActive)}
        >
          <Text style={styles.buttonText}>{isActive ? 'Active' : 'Inactive'}</Text>
        </TouchableOpacity>
      </View>

      {/* High-Level Use 2.2: Dynamic Text Color based on status */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Status Indicator:</Text>
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
  section: {
    marginBottom: 30,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  toggleButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: 'green',
  },
  inactiveButton: {
    backgroundColor: 'gray',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  statusText: {
    fontSize: 16,
    marginVertical: 10,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});