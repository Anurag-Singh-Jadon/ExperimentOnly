import React, { useState } from 'react';
import { View, Text, Switch, TextInput, Button, StyleSheet } from 'react-native';

const UIControlStateExample = () => {
  // Toggle Switch state
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);

  // TextInput value
  const [username, setUsername] = useState('');

  // Button interaction state (e.g., submission success/failure)
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = () => {
    // In a real app, this would involve API calls or complex logic
    console.log('Username:', username);
    console.log('Notifications Enabled:', isNotificationsEnabled);
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000); // Reset after 3 seconds
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionHeader}>1. Managing UI Element States</Text>

      <View style={styles.exampleContainer}>
        <Text style={styles.subSubHeader}>Notifications:</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Enable Notifications:</Text>
          <Switch
            onValueChange={setIsNotificationsEnabled}
            value={isNotificationsEnabled}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={isNotificationsEnabled ? '#f5dd4b' : '#f4f3f4'}
          />
        </View>
        <Text style={styles.statusText}>
          Notifications are: {isNotificationsEnabled ? 'Enabled' : 'Disabled'}
        </Text>
      </View>

      <View style={styles.exampleContainer}>
        <Text style={styles.subSubHeader}>Username Input:</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Enter username"
          value={username}
          onChangeText={setUsername}
        />
        <Text style={styles.statusText}>Current Username: {username || '[Empty]'}</Text>
      </View>

      <View style={styles.exampleContainer}>
        <Text style={styles.subSubHeader}>Form Submission:</Text>
        <Button title="Submit Data" onPress={handleSubmit} />
        {isSubmitted && <Text style={styles.successMessage}>Data Submitted!</Text>}
      </View>
    </View>
  );
};