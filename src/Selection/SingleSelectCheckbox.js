// SingleSelectCheckbox.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import CheckBox from '@react-native-community/checkbox';

const SingleSelectCheckbox = ({ options, selectedValue, onValueChange, label }) => {
    console.log('SingleSelectCheckbox rendered with options:', options, 'selectedValue:', selectedValue);
  return (
    <View style={styles.container}>
      {label && <Text style={styles.groupLabel}>{label}</Text>}
      {options.map((option) => (
        <TouchableOpacity
          key={option.id}
          style={styles.checkboxContainer}
          onPress={() => onValueChange(option.value)}
        >
          <CheckBox
            disabled={false}
            value={selectedValue === option.value} // Only true if this option is selected
            onValueChange={() => onValueChange(option.value)}
            tintColors={{ true: '#007bff', false: '#000' }} // Customize checkbox color
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

export default SingleSelectCheckbox;