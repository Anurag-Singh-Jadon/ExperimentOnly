// MultiSelectCheckbox.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import CheckBox from '@react-native-community/checkbox';

const MultiSelectCheckbox = ({ options, selectedValues, onValueChange, label }) => {

    console.log('MultiSelectCheckbox rendered with options:', options, 'selectedValues:', selectedValues);
  const handleCheckboxToggle = (value) => {
    console.log('Toggling checkbox for value:', value);
    console.log('Current selected values:', selectedValues);
    console.log('selectedValues.includes(value)---',selectedValues.includes(value))
    const newSelectedValues = selectedValues.includes(value)
      ? selectedValues.filter((item) => item !== value) // Remove if already selected
      : [...selectedValues, value]; // Add if not selected
    onValueChange(newSelectedValues);
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.groupLabel}>{label}</Text>}
      {options.map((option) => (
        <TouchableOpacity
          key={option.id}
          style={styles.checkboxContainer}
          onPress={() => handleCheckboxToggle(option.value)}
        >
          <CheckBox
            disabled={false}
            value={selectedValues.includes(option.value)} // True if value is in selectedValues array
            onValueChange={() => handleCheckboxToggle(option.value)}
            tintColors={{ true: '#28a745', false: '#000' }} // Customize checkbox color
          />
          <Text style={styles.label}>{option.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
  },
  groupLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
});

export default MultiSelectCheckbox;