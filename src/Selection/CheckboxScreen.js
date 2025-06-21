// App.js
import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, ScrollView, Alert } from 'react-native';
import SingleSelectCheckbox from './SingleSelectCheckbox';
import MultiSelectCheckbox from './MultiSelectCheckbox';
import { fetchOptions } from './api';

const CheckboxScreen = () => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedSingleValue, setSelectedSingleValue] = useState(null);
  const [selectedMultiValues, setSelectedMultiValues] = useState([]);

  useEffect(() => {
    const loadOptions = async () => {
      try {
        setLoading(true);
        const fetchedOptions = await fetchOptions();
        console.log('Fetched options:', fetchedOptions);
        setOptions(fetchedOptions);
      } catch (err) {
        console.error('Failed to fetch options:', err);
        setError('Failed to load options. Please try again.');
        Alert.alert('Error', 'Could not fetch options for checkboxes.');
      } finally {
        setLoading(false);
      }
    };

    loadOptions();
  }, []); // Empty dependency array means this runs once on mount

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading options...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.scrollViewContent}>
      <View style={styles.container}>
        <Text style={styles.pageTitle}>Checkbox Selection Demo</Text>

        {/* Single Select Checkboxes */}
        <SingleSelectCheckbox
          label="Select Your Favorite Hobby (Single Select)"
          options={options}
          selectedValue={selectedSingleValue}
          onValueChange={setSelectedSingleValue}
        />
        <Text style={styles.selectionDisplay}>
          Selected Single: {selectedSingleValue ? selectedSingleValue : 'None'}
        </Text>

        {/* Multi Select Checkboxes */}
        <MultiSelectCheckbox
          label="Select All Interests That Apply (Multi Select)"
          options={options}
          selectedValues={selectedMultiValues}
          onValueChange={setSelectedMultiValues}
        />
        <Text style={styles.selectionDisplay}>
          Selected Multi: {selectedMultiValues.length > 0 ? selectedMultiValues.join(', ') : 'None'}
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    backgroundColor: '#f9f9f9',
  },
  container: {
    padding: 20,
    paddingTop: 50, // To avoid status bar for standalone component
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#333',
  },
  selectionDisplay: {
    marginTop: 15,
    fontSize: 16,
    color: '#555',
    backgroundColor: '#e0e0e0',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default CheckboxScreen;