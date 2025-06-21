import React, { useReducer, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, TextInput, Alert, Switch, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

// --- Example 1: Simple Counter (demonstrates basic useReducer vs useState) ---
// Reducer function for the counter
const counterReducer = (state, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 };
    case 'DECREMENT':
      return { count: state.count - 1 };
    case 'RESET':
      return { count: 0 };
    case 'SET':
      return { count: action.payload };
    default:
      return state; // Always return state if action not recognized
  }
};
const initialCounterState = { count: 0 };

// --- Example 2: Form Management (complex state with multiple fields) ---
const formReducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return {
        ...state,
        [action.field]: action.value,
      };
    case 'TOGGLE_AGREEMENT':
      return {
        ...state,
        agreedToTerms: !state.agreedToTerms,
      };
    case 'RESET_FORM':
      return initialFormState;
    default:
      return state;
  }
};
const initialFormState = {
  username: '',
  email: '',
  password: '',
  agreedToTerms: false,
};

// --- Example 3: Async Data Fetching State (managing multiple loading/error states) ---
const dataFetchReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null, data: null };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, error: null, data: action.payload };
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload, data: null };
    default:
      return state;
  }
};
const initialDataFetchState = {
  loading: false,
  data: null,
  error: null,
};

// --- Example 4: Shopping Cart Management (array of objects with complex updates) ---
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM':
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          ),
        };
      }
      return { ...state, items: [...state.items, action.payload] };

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload.id),
      };

    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: Math.max(1, action.payload.quantity) } // Ensure quantity is at least 1
            : item
        ),
      };
    case 'CLEAR_CART':
      return { ...state, items: [] };
    default:
      return state;
  }
};
const initialCartState = {
  items: [
    { id: 'p1', name: 'Smart TV', price: 500, quantity: 1 },
    { id: 'p2', name: 'Soundbar', price: 150, quantity: 2 },
  ],
};


const UseReducerExamples = () => {
  // Use Reducer Hooks
  const [counterState, dispatchCounter] = useReducer(counterReducer, initialCounterState);
  const [formState, dispatchForm] = useReducer(formReducer, initialFormState);
  const [dataFetchState, dispatchDataFetch] = useReducer(dataFetchReducer, initialDataFetchState);
  const [cartState, dispatchCart] = useReducer(cartReducer, initialCartState);

  // --- Example 1: Simple Counter ---
  const handleIncrement = useCallback(() => {
    dispatchCounter({ type: 'INCREMENT' });
  }, []);
  const handleDecrement = useCallback(() => {
    dispatchCounter({ type: 'DECREMENT' });
  }, []);
  const handleReset = useCallback(() => {
    dispatchCounter({ type: 'RESET' });
  }, []);

  // --- Example 2: Form Management ---
  const handleFormChange = useCallback((field, value) => {
    dispatchForm({ type: 'UPDATE_FIELD', field, value });
  }, []);
  const handleToggleAgreement = useCallback(() => {
    dispatchForm({ type: 'TOGGLE_AGREEMENT' });
  }, []);
  const handleSubmitForm = useCallback(() => {
    Alert.alert('Form Submitted', JSON.stringify(formState, null, 2));
    dispatchForm({ type: 'RESET_FORM' });
  }, [formState]); // Dependency on formState to show current data

  // --- Example 3: Async Data Fetching ---
  const simulateDataFetch = useCallback(async (shouldError = false) => {
    dispatchDataFetch({ type: 'FETCH_START' });
    try {
      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, 1500));
      if (shouldError) {
        throw new Error('Failed to fetch data from API.');
      }
      const fetchedData = { message: 'Data fetched successfully!', timestamp: new Date().toISOString() };
      dispatchDataFetch({ type: 'FETCH_SUCCESS', payload: fetchedData });
    } catch (err) {
      dispatchDataFetch({ type: 'FETCH_ERROR', payload: err.message });
    }
  }, []);

  // --- Example 4: Shopping Cart Management ---
  const calculateCartTotal = useCallback(() => {
    return cartState.items.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  }, [cartState.items]); // Only recalculate if cart items change

  const handleAddItem = useCallback(() => {
    const newItem = {
      id: `p${Math.floor(Math.random() * 1000) + 3}`, // New random ID
      name: `Product ${Math.floor(Math.random() * 100)}`,
      price: Math.floor(Math.random() * 200) + 50,
      quantity: 1,
    };
    dispatchCart({ type: 'ADD_ITEM', payload: newItem });
    Alert.alert('Item Added', `${newItem.name} added to cart!`);
  }, []);

  const handleRemoveLastItem = useCallback(() => {
    if (cartState.items.length > 0) {
      const lastItem = cartState.items[cartState.items.length - 1];
      dispatchCart({ type: 'REMOVE_ITEM', payload: { id: lastItem.id } });
      Alert.alert('Item Removed', `${lastItem.name} removed.`);
    } else {
      Alert.alert('Cart Empty', 'No items to remove.');
    }
  }, [cartState.items]);

  const handleUpdateFirstItemQuantity = useCallback(() => {
    if (cartState.items.length > 0) {
      const firstItem = cartState.items[0];
      const newQuantity = firstItem.quantity + 1;
      dispatchCart({ type: 'UPDATE_QUANTITY', payload: { id: firstItem.id, quantity: newQuantity } });
      Alert.alert('Quantity Updated', `${firstItem.name} quantity to ${newQuantity}`);
    } else {
      Alert.alert('Cart Empty', 'No items to update.');
    }
  }, [cartState.items]);

  const handleClearCart = useCallback(() => {
    dispatchCart({ type: 'CLEAR_CART' });
    Alert.alert('Cart Cleared', 'All items removed from cart.');
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.mainHeader}>`useReducer()` High-Level Examples</Text>
      <Text style={styles.description}>
        Managing complex state logic with a reducer function.
      </Text>

      {/* --- Example 1: Simple Counter --- */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>1. Simple Counter</Text>
        <Text style={styles.currentValue}>Count: {counterState.count}</Text>
        <View style={styles.buttonRow}>
          <Button title="Increment" onPress={handleIncrement} />
          <Button title="Decrement" onPress={handleDecrement} color="#dc3545" />
          <Button title="Reset" onPress={handleReset} color="#6c757d" />
        </View>
        <Button title="Set to 10" onPress={() => dispatchCounter({ type: 'SET', payload: 10 })} />
        <Text style={styles.infoText}>
          (Actions: INCREMENT, DECREMENT, RESET, SET)
        </Text>
      </View>

      {/* --- Example 2: Form Management --- */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>2. Complex Form Management</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Username"
          value={formState.username}
          onChangeText={text => handleFormChange('username', text)}
        />
        <TextInput
          style={styles.textInput}
          placeholder="Email"
          value={formState.email}
          onChangeText={text => handleFormChange('email', text)}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.textInput}
          placeholder="Password"
          value={formState.password}
          onChangeText={text => handleFormChange('password', text)}
          secureTextEntry
        />
        <View style={styles.agreementRow}>
          <Switch
            value={formState.agreedToTerms}
            onValueChange={handleToggleAgreement}
          />
          <Text style={styles.agreementText}>I agree to terms</Text>
        </View>
        <Text style={styles.infoText}>Current Form State: {JSON.stringify(formState.username, null, 2)}</Text>
        <Button
          title="Submit Form"
          onPress={handleSubmitForm}
          disabled={!formState.agreedToTerms}
        />
        <Text style={styles.infoText}>
          (Actions: UPDATE_FIELD, TOGGLE_AGREEMENT, RESET_FORM)
        </Text>
      </View>

      {/* --- Example 3: Async Data Fetching State --- */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>3. Async Data Fetching Status</Text>
        <View style={styles.dataFetchStatus}>
          {dataFetchState.loading && <ActivityIndicator size="small" color="#007bff" />}
          {dataFetchState.data && (
            <View style={styles.successBox}>
              <Icon name="check-circle" size={24} color="#28a745" />
              <Text style={styles.statusText}>Data fetched: {dataFetchState.data.message}</Text>
            </View>
          )}
          {dataFetchState.error && (
            <View style={styles.errorBox}>
              <Icon name="error" size={24} color="#dc3545" />
              <Text style={styles.statusText}>Error: {dataFetchState.error}</Text>
            </View>
          )}
          {!dataFetchState.loading && !dataFetchState.data && !dataFetchState.error && (
            <Text style={styles.statusText}>Idle</Text>
          )}
        </View>
        <View style={styles.buttonRow}>
          <Button title="Fetch Data (Success)" onPress={() => simulateDataFetch(false)} />
          <Button title="Fetch Data (Error)" onPress={() => simulateDataFetch(true)} color="#ffc107" />
        </View>
        <Text style={styles.infoText}>
          (Actions: FETCH_START, FETCH_SUCCESS, FETCH_ERROR)
        </Text>
      </View>

      {/* --- Example 4: Shopping Cart Management --- */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>4. Shopping Cart Management</Text>
        <Text style={styles.subSubHeader}>Cart Items:</Text>
        {cartState.items.length > 0 ? (
          cartState.items.map(item => (
            <View key={item.id} style={styles.cartItem}>
              <Text style={styles.cartItemName}>{item.name}</Text>
              <Text style={styles.cartItemDetails}>
                ${item.price.toFixed(2)} x {item.quantity} = ${((item.price * item.quantity)).toFixed(2)}
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.infoText}>Cart is empty.</Text>
        )}
        <Text style={styles.cartTotal}>Total: ${calculateCartTotal()}</Text>
        <View style={styles.buttonGrid}>
          <Button title="Add Random Item" onPress={handleAddItem} />
          <Button title="Remove Last Item" onPress={handleRemoveLastItem} color="#ff7f50" />
          <Button title="Update First Qty" onPress={handleUpdateFirstItemQuantity} color="#4682b4" />
          <Button title="Clear Cart" onPress={handleClearCart} color="#a0522d" />
        </View>
        <Text style={styles.infoText}>
          (Actions: ADD_ITEM, REMOVE_ITEM, UPDATE_QUANTITY, CLEAR_CART)
        </Text>
      </View>

      <View style={{ height: 50 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    padding: 20,
    paddingTop: 50,
  },
  mainHeader: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  description: {
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  section: {
    marginBottom: 30,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
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
  subSubHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 10,
    color: '#555',
  },
  currentValue: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
    gap: 5,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  agreementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  agreementText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  infoText: {
    fontSize: 13,
    color: '#6c757d',
    textAlign: 'center',
    marginTop: 5,
    fontStyle: 'italic',
  },
  dataFetchStatus: {
    minHeight: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  statusText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginTop: 5,
  },
  successBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e6ffe6',
    padding: 10,
    borderRadius: 5,
    borderColor: '#28a745',
    borderWidth: 1,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffe6e6',
    padding: 10,
    borderRadius: 5,
    borderColor: '#dc3545',
    borderWidth: 1,
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: '#eee',
  },
  cartItemName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
  },
  cartItemDetails: {
    fontSize: 14,
    color: '#666',
  },
  cartTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'right',
    marginTop: 10,
    marginBottom: 15,
    color: '#007bff',
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    gap: 10,
    marginTop: 10,
  },
});

export default UseReducerExamples;