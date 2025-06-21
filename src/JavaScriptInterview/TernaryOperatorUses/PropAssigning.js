import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

const PropAssignmentExample = () => {
  const [isEditable, setIsEditable] = useState(true);
  const [value, setValue] = useState('Edit me!');

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Prop Assignment</Text>

      {/* High-Level Use 3.1: Dynamic TextInput props */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Editable Input:</Text>
        <TextInput
          style={[
            styles.textInput,
            !isEditable && styles.readOnlyInput, // Apply read-only style if not editable
          ]}
          value={value}
          onChangeText={setValue}
          editable={isEditable ? true : false} // Ternary for boolean prop
          placeholder={isEditable ? "Type here..." : "Not editable"} // Ternary for string prop
          maxLength={isEditable ? 100 : 50} // Ternary for number prop
        />
        <Button
          title={isEditable ? "Make Read-Only" : "Make Editable"}
          onPress={() => setIsEditable(!isEditable)}
        />
      </View>
    </View>
  );
};