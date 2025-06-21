import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';

// --- High-Level Example: Spread Operator ---

// 1. Spreading Props to a Child Component
// Child component that accepts various props.
const CustomButton = ({ title, onPress, customStyle, ...otherButtonProps }) => {
  // The '...otherButtonProps' here is a REST operator, collecting all other props.
  // We'll use the SPREAD operator below to pass them to the native TouchableOpacity.
  return (
    <TouchableOpacity
      style={[styles.button, customStyle]}
      onPress={onPress}
      // Spread Operator: Passes all 'otherButtonProps' (e.g., testID, accessibilityLabel)
      // directly to the TouchableOpacity component.
      {...otherButtonProps}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

// 2. Merging Styles for Flexible Styling
const DynamicStyledText = ({ text, primary = false, large = false, center = false }) => {
  const baseStyle = styles.baseText;
  const conditionalStyles = StyleSheet.create({
    primary: { color: 'blue' },
    large: { fontSize: 24 },
    center: { textAlign: 'center' },
  });

  return (
    <Text style={[
      baseStyle,
      primary && conditionalStyles.primary, // Conditional styles are added if true
      large && conditionalStyles.large,
      center && conditionalStyles.center,
      // Spread Operator could also be used if styles were objects directly:
      // { ...(primary ? { color: 'blue' } : {}) }
    ]}>
      {text}
    </Text>
  );
};


// --- High-Level Example: Rest Operator ---

// 3. Destructuring Props (extracting specific ones, collecting the rest)
const UserProfileCard = ({ userId, userName, email, ...addressInfo }) => {
  // 'userId', 'userName', 'email' are explicitly extracted.
  // 'addressInfo' is a REST object containing { street, city, zipCode, country }
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{userName} (ID: {userId})</Text>
      <Text style={styles.cardText}>Email: {email}</Text>
      <Text style={styles.cardText}>Address:</Text>
      {Object.entries(addressInfo).map(([key, value]) => (
        <Text key={key} style={styles.cardAddressText}>  {key}: {value}</Text>
      ))}
    </View>
  );
};


// 4. Handling Variable Function Arguments (Rest Parameter in function definition)
const calculateTotal = (discountPercentage, ...prices) => {
  // 'prices' is a REST array containing all subsequent arguments.
  const subtotal = prices.reduce((sum, price) => sum + price, 0);
  const total = subtotal * (1 - discountPercentage / 100);
  return total.toFixed(2);
};


// --- Main Component to demonstrate ---
const SpreadRestOperatorsExamples = () => {
  const [cartItems, setCartItems] = useState([
    { id: 1, name: 'Item A', price: 10 },
    { id: 2, name: 'Item B', price: 20 },
  ]);

  const addOrUpdateItem = (newItem) => {
    // Spread Operator: Immutably update an array
    setCartItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(item => item.id === newItem.id);
      if (existingItemIndex > -1) {
        // Item exists, update it immutably
        return prevItems.map((item, index) =>
          index === existingItemIndex ? { ...item, ...newItem } : item // Spread to merge existing and new item properties
        );
      } else {
        // Item doesn't exist, add it immutably
        return [...prevItems, newItem]; // Spread to create new array with existing and new item
      }
    });
  };

  const updateProductPrice = (productId, newPrice) => {
    // Spread Operator: Immutably update an array of objects
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId
          ? { ...item, price: newPrice } // Spread to copy item, then override price
          : item
      )
    );
  };

  const removeLastItem = () => {
    // Spread Operator: Immutably remove an item from an array
    setCartItems(prevItems => prevItems.slice(0, -1)); // Or [...prevItems].slice(0, -1)
  };


  // Example of cloning/merging objects immutably
  const [appConfig, setAppConfig] = useState({
    theme: 'dark',
    notifications: { email: true, sms: false },
    language: 'en',
  });

  const updateTheme = useCallback((newTheme) => {
    // Spread Operator: Immutably update nested state objects
    setAppConfig(prevConfig => ({
      ...prevConfig, // Copy all existing properties
      theme: newTheme, // Override 'theme'
      notifications: { // Deep copy and update nested object
        ...prevConfig.notifications,
        email: newTheme === 'light' ? false : true // Example of nested update logic
      }
    }));
  }, []);

  useEffect(() => {
    console.log("--- Spread & Rest Operators High-Level Examples Output ---");
    console.log("\nCart Items State:", cartItems);
    console.log("\nApp Config State:", appConfig);
    console.log("--- End of State Logs ---");

    // Calling the function with rest parameter
    const totalWithDiscount = calculateTotal(10, 50, 75, 120); // 10% discount, prices are 50, 75, 120
    console.log("\nCalculated Total (10% discount on 50+75+120):", totalWithDiscount); // Expected: 220.50

  }, [cartItems, appConfig]); // Re-run effect when state changes to log updates

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Spread & Rest Operators</Text>
      <Text style={styles.subHeader}>Check your console for detailed output!</Text>

      {/* --- Spread Operator Examples --- */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>1. Spreading Props</Text>
        <CustomButton
          title="Click Me!"
          onPress={() => Alert.alert('Button Clicked!', 'You used a CustomButton with spread props.')}
          customStyle={{ backgroundColor: '#4CAF50', paddingVertical: 15 }}
          testID="myCustomButton"
          accessibilityLabel="A custom button for interaction"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionHeader}>2. Merging Styles</Text>
        <DynamicStyledText text="I am a base text." />
        <DynamicStyledText text="I am a primary text." primary />
        <DynamicStyledText text="I am large and centered." large center />
        <DynamicStyledText text="I am primary, large, and centered." primary large center />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionHeader}>3. Immutably Updating State (Spread for Arrays/Objects)</Text>
        <Text style={styles.stateText}>Current Cart Items: {JSON.stringify(cartItems)}</Text>
        <CustomButton
          title="Add New Item C"
          onPress={() => addOrUpdateItem({ id: 3, name: 'Item C', price: 30 })}
          customStyle={styles.actionButton}
        />
        <CustomButton
          title="Update Item A Price to 15"
          onPress={() => updateProductPrice(1, 15)}
          customStyle={styles.actionButton}
        />
        <CustomButton
          title="Remove Last Item"
          onPress={removeLastItem}
          customStyle={styles.actionButton}
        />

        <Text style={styles.stateText}>Current App Config: {JSON.stringify(appConfig)}</Text>
        <CustomButton
          title="Switch Theme to Light"
          onPress={() => updateTheme('light')}
          customStyle={styles.actionButton}
        />
        <CustomButton
          title="Switch Theme to Dark"
          onPress={() => updateTheme('dark')}
          customStyle={styles.actionButton}
        />
      </View>

      {/* --- Rest Operator Examples --- */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>4. Destructuring Props (Rest Object)</Text>
        <UserProfileCard
          userId="u001"
          userName="Alice Smith"
          email="alice@example.com"
          street="123 React Lane"
          city="Nativeville"
          zipCode="RN123"
          country="USA"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionHeader}>5. Variable Function Arguments (Rest Array)</Text>
        <Text style={styles.cardText}>
          Total for items (50, 75, 120) with 10% discount: ${calculateTotal(10, 50, 75, 120)}
        </Text>
        <Text style={styles.cardText}>
          Total for items (10, 5, 2.5) with 0% discount: ${calculateTotal(0, 10, 5, 2.5)}
        </Text>
      </View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  subHeader: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  section: {
    marginBottom: 30,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
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
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  baseText: {
    fontSize: 18,
    color: '#333',
    marginVertical: 5,
  },
  card: {
    backgroundColor: '#e9f5ff',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#b3e0ff',
    marginVertical: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#0056b3',
  },
  cardText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 3,
  },
  cardAddressText: {
    fontSize: 14,
    color: '#555',
    marginLeft: 10,
  },
  stateText: {
    fontSize: 14,
    color: '#333',
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  actionButton: {
    backgroundColor: '#6c757d',
    paddingVertical: 10,
    marginTop: 5,
  }
});

export default SpreadRestOperatorsExamples;