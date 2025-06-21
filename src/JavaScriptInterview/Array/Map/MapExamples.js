import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Button, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // For icons, if installed

// --- Data for Examples ---
const productsData = [
  { id: 'p1', name: 'Coffee Mug', price: 12.99, inStock: true, category: 'Home Goods' },
  { id: 'p2', name: 'Wireless Headphones', price: 99.99, inStock: false, category: 'Electronics' },
  { id: 'p3', name: 'Notebook', price: 5.50, inStock: true, category: 'Stationery' },
  { id: 'p4', name: 'Mechanical Keyboard', price: 149.99, inStock: true, category: 'Electronics' },
  { id: 'p5', name: 'Desk Lamp', price: 35.00, inStock: false, category: 'Home Goods' },
];

const usersData = [
  { id: 'u1', username: 'john_doe', role: 'user', isActive: true },
  { id: 'u2', username: 'admin_mary', role: 'admin', isActive: true },
  { id: 'u3', username: 'guest_user', role: 'guest', isActive: false },
];

const notificationSettingsData = [
  { id: 'n1', type: 'Email', enabled: true },
  { id: 'n2', type: 'Push Notifications', enabled: true },
  { id: 'n3', type: 'SMS', enabled: false },
];

const MapExamples = () => {
  const [products, setProducts] = useState(productsData);
  const [users, setUsers] = useState(usersData);
  const [notificationSettings, setNotificationSettings] = useState(notificationSettingsData);
  const [newProductName, setNewProductName] = useState('');
  const [nextProductId, setNextProductId] = useState(productsData.length + 1);

  // --- High-Level Use 1: Rendering a List of Components from Data ---
  const ProductItem = ({ product }) => (
    <View style={[styles.itemContainer, !product.inStock && styles.outOfStockItem]}>
      <Text style={styles.itemTitle}>{product.name}</Text>
      <Text style={styles.itemDetail}>${product.price.toFixed(2)}</Text>
      <Text style={styles.itemDetail}>Category: {product.category}</Text>
      <Text style={[styles.itemDetail, product.inStock ? styles.inStockText : styles.outOfStockText]}>
        {product.inStock ? 'In Stock' : 'Out of Stock'}
      </Text>
    </View>
  );

  // --- High-Level Use 2: Transforming Data for Display (with conditional rendering) ---
  const UserDisplay = ({ user }) => (
    <View style={[styles.itemContainer, !user.isActive && styles.inactiveItem]}>
      <View style={styles.userHeader}>
        <Text style={styles.itemTitle}>{user.username}</Text>
        <Text style={[styles.roleBadge, user.role === 'admin' && styles.adminBadge]}>
          {user.role.toUpperCase()}
        </Text>
      </View>
      <Text style={styles.itemDetail}>Status: {user.isActive ? 'Active' : 'Inactive'}</Text>
    </View>
  );

  // --- High-Level Use 3: Handling User Interaction within Mapped Items ---
  const NotificationSetting = ({ setting, onToggle }) => (
    <TouchableOpacity onPress={() => onToggle(setting.id)} style={styles.settingItem}>
      <Text style={styles.settingText}>{setting.type}</Text>
      <Icon
        name={setting.enabled ? 'toggle-on' : 'toggle-off'}
        size={30}
        color={setting.enabled ? '#4CAF50' : '#FF5722'}
      />
    </TouchableOpacity>
  );

  const toggleNotification = useCallback((id) => {
    setNotificationSettings(prevSettings =>
      prevSettings.map(setting =>
        setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
      )
    );
  }, []);

  // --- High-Level Use 4: Filtering and Mapping Simultaneously ---
  const InStockProductList = useCallback(() => {
    const inStockItems = products.filter(product => product.inStock);
    if (inStockItems.length === 0) {
      return <Text style={styles.statusText}>No products currently in stock.</Text>;
    }
    return (
      <View>
        {inStockItems.map(product => (
          <ProductItem key={product.id} product={product} />
        ))}
      </View>
    );
  }, [products]);

  // --- High-Level Use 5: Adding/Removing Items from a Mapped List ---
  const addProduct = useCallback(() => {
    if (newProductName.trim() === '') {
      Alert.alert('Error', 'Product name cannot be empty!');
      return;
    }
    const newProduct = {
      id: `p${nextProductId}`,
      name: newProductName.trim(),
      price: Math.floor(Math.random() * 100) + 10, // Random price for demo
      inStock: true,
      category: 'Misc',
    };
    setProducts(prevProducts => [...prevProducts, newProduct]);
    setNewProductName('');
    setNextProductId(prevId => prevId + 1);
    Alert.alert('Success', `Product "${newProduct.name}" added!`);
  }, [newProductName, nextProductId]);

  const removeLastProduct = useCallback(() => {
    if (products.length === 0) {
      Alert.alert('Info', 'No products to remove!');
      return;
    }
    setProducts(prevProducts => prevProducts.slice(0, prevProducts.length - 1));
    Alert.alert('Success', 'Last product removed!');
  }, [products]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.mainHeader}>`map()` High-Level Examples</Text>
      <Text style={styles.description}>
        Transforming data arrays into dynamic UI components in React Native.
      </Text>

      {/* 1. Rendering a List of Components from Data */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>1. Product List</Text>
        <Text style={styles.subSubHeader}>All Products:</Text>
        {products.map(product => (
          <ProductItem key={product.id} product={product} />
        ))}
      </View>

      {/* 2. Transforming Data for Display (with conditional rendering) */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>2. User List with Roles</Text>
        <Text style={styles.subSubHeader}>User Status & Roles:</Text>
        {users.map(user => (
          <UserDisplay key={user.id} user={user} />
        ))}
      </View>

      {/* 3. Handling User Interaction within Mapped Items */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>3. Toggle Notification Settings</Text>
        <Text style={styles.subSubHeader}>Interactive Settings:</Text>
        {notificationSettings.map(setting => (
          <NotificationSetting
            key={setting.id}
            setting={setting}
            onToggle={toggleNotification}
          />
        ))}
      </View>

      {/* 4. Filtering and Mapping Simultaneously */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>4. In-Stock Products Only</Text>
        <Text style={styles.subSubHeader}>Filtered List:</Text>
        <InStockProductList />
      </View>

      {/* 5. Adding/Removing Items from a Mapped List */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>5. Dynamic Product List</Text>
        <Text style={styles.subSubHeader}>Add/Remove Products:</Text>
        <TextInput
          style={styles.textInput}
          placeholder="New product name"
          value={newProductName}
          onChangeText={setNewProductName}
          onSubmitEditing={addProduct}
        />
        <View style={styles.buttonGroup}>
          <Button title="Add Product" onPress={addProduct} />
          <Button title="Remove Last Product" onPress={removeLastProduct} color="#dc3545" />
        </View>
        <View style={styles.dynamicListContainer}>
          {products.map(product => (
            <ProductItem key={product.id} product={product} />
          ))}
        </View>
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
  itemContainer: {
    backgroundColor: '#fefefe',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 10,
    flexDirection: 'column',
  },
  outOfStockItem: {
    opacity: 0.7,
    borderColor: '#dc3545',
    borderWidth: 2,
  },
  inactiveItem: {
    opacity: 0.6,
    backgroundColor: '#f5f5f5',
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  itemDetail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  inStockText: {
    color: '#28a745',
    fontWeight: 'bold',
  },
  outOfStockText: {
    color: '#dc3545',
    fontWeight: 'bold',
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  roleBadge: {
    backgroundColor: '#007bff',
    color: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 15,
    fontSize: 12,
    fontWeight: 'bold',
  },
  adminBadge: {
    backgroundColor: '#FFC107',
    color: '#333',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 10,
  },
  settingText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  statusText: {
    fontSize: 15,
    color: '#555',
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 10,
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
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
    gap: 10, // For spacing between buttons
  },
  dynamicListContainer: {
    marginTop: 15,
    maxHeight: 300, // To limit height of dynamic list for demonstration
  },
});

export default MapExamples;