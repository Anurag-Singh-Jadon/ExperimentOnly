// MultiSelectFilter.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import CheckBox from '@react-native-community/checkbox'; // Changed for RN CLI

const MultiSelectFilter = ({ options, selectedValues, onValueChange, label }) => {

  const handleCheckboxToggle = (value) => {
    const newSelectedValues = selectedValues.includes(value)
      ? selectedValues.filter((item) => item !== value) // Remove if already selected
      : [...selectedValues, value]; // Add if not selected
    onValueChange(newSelectedValues);
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.groupLabel}>{label}</Text>}
      {options.map((option, index) => (
        <TouchableOpacity
          key={option.value || index} // Use value or index as key
          style={styles.checkboxContainer}
          onPress={() => handleCheckboxToggle(option.value)}
          activeOpacity={0.7}
        >
          <CheckBox
            disabled={false}
            value={selectedValues.includes(option.value)}
            onValueChange={() => handleCheckboxToggle(option.value)}
            tintColors={{ true: '#28a745', false: '#000' }} // Customize checkbox color
            boxType="square" // Explicitly square for consistency
            animationDuration={0.2}
            // For Android, tintColors apply to the box and checkmark
            // For iOS, tintColor applies to the box, onCheckColor to the checkmark
            // This behavior can be tricky, test on both.
            // On iOS, sometimes tintColor and onFillColor are better.
            // tintColor is the border, onFillColor is the background when checked.
            // onCheckColor is the checkmark color.
          />
          <Text style={styles.label}>{option.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  groupLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  label: {
    marginLeft: 8,
    fontSize: 14,
    color: '#333',
  },
});

export default MultiSelectFilter;