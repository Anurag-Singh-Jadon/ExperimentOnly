// Deep Dive: Object Destructuring in React Native

// 1. Renaming Properties
// Scenario: Avoiding naming conflicts or clarifying variable names
const userProfile = { id: 'user_123', name: 'Alice', email: 'alice@example.com' };
const { id: userId, name: userName, email } = userProfile;

console.log("User ID:", userId);   // user_123
console.log("User Name:", userName); // Alice
console.log("Email:", email);       // alice@example.com
// console.log(id); // ReferenceError: id is not defined (original name is not available)

// 2. Default Values with Object Destructuring
// Scenario: Optional properties in props or API responses
const product = { name: 'Smartphone', price: 699 };
const { name, price, stock = 10, material = 'Plastic' } = product;

console.log("Product Name:", name);     // Smartphone
console.log("Price:", price);           // 699
console.log("Stock:", stock);           // 10 (default applied)
console.log("Material:", material);     // Plastic (default applied)

const product2 = { name: 'Tablet', price: 499, stock: undefined, material: null };
const { name: n2, price: p2, stock: s2 = 10, material: m2 = 'Plastic' } = product2;
console.log("Product 2 Stock:", s2);     // undefined (default applied for explicit undefined)
console.log("Product 2 Material:", m2); // null (default not applied for null)



// 3. Rest Property with Object Destructuring
// Scenario: Extracting specific props and passing the rest to child components
// Or separating important data from metadata in an API response.
import React from 'react';
import { View, Text, Button } from 'react-native';

const MyButton = ({ title, onPress, style, ...restProps }) => {
  // 'title', 'onPress', 'style' are directly extracted
  // 'restProps' will contain any other props passed to MyButton (e.g., 'accessibilityLabel')
  return (
    <View style={style}>
      <Button title={title} onPress={onPress} {...restProps} />
      <Text>Custom Button Wrapper</Text>
    </View>
  );
};

// Usage (conceptual, not runnable in this snippet)
// <MyButton
//   title="Submit"
//   onPress={() => console.log('Submitting')}
//   style={{ backgroundColor: 'blue' }}
//   accessibilityLabel="Submit button for form"
//   testID="submitBtn"
// />

const apiResponse = {
  data: { id: 'item1', name: 'Widget', category: 'Tools', stock: 100 },
  metadata: { timestamp: '2023-10-27T10:00:00Z', status: 'success' }
};

const { data, ...otherResponseInfo } = apiResponse;
console.log("Product Data:", data);           // { id: 'item1', name: 'Widget', category: 'Tools', stock: 100 }
console.log("Other Response Info:", otherResponseInfo); // { metadata: { ... } }

// 4. Nested Object Destructuring
// Scenario: Complex API response or Redux state structure
const appState = {
  user: {
    profile: {
      firstName: 'Jane',
      lastName: 'Doe',
      address: {
        street: '123 Main St',
        city: 'Anytown',
        zip: '12345'
      }
    },
    settings: {
      theme: 'light',
      notifications: {
        email: true,
        sms: false
      }
    }
  },
  products: [],
  cart: {}
};

// Accessing deeply nested user info
const { user: { profile: { firstName, lastName, address: { city } }, settings: { notifications: { email: emailNotifications } } } } = appState;

console.log("User's First Name:", firstName);      // Jane
console.log("User's Last Name:", lastName);        // Doe
console.log("User's City:", city);                // Anytown
console.log("Email Notifications Enabled:", emailNotifications); // true

// You can also mix renaming with nesting:
const { user: { profile: { firstName: userFirstName, address: { street: userStreet } } } } = appState;
console.log("User First Name (renamed):", userFirstName); // Jane
console.log("User Street (renamed):", userStreet);       // 123 Main St

// 5. Destructuring with Computed Property Names
// Scenario: When the property name is determined at runtime
const dynamicKey = 'status';
const serverResponse = {
  id: 1,
  data: 'some data',
  status: 'active'
};

const { [dynamicKey]: currentStatus, id } = serverResponse;
console.log("ID:", id);               // 1
console.log("Current Status:", currentStatus); // active