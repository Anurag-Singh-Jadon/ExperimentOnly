import React, { useState, useMemo, useCallback, memo } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, TextInput, FlatList } from 'react-native';

// --- Memoized Child Component (to demonstrate useMemo's effect) ---
// This component will only re-render if its props shallowly change.
const ProductList = memo(({ products, filterText, onProductPress }) => {
  console.log('ProductList: Rendered!');

  // --- Example 1: Memoizing filtered data (common use case) ---
  // The filtering operation can be expensive if `products` or `filterText` are large.
  // useMemo ensures this filtering only re-runs when `products` or `filterText` change.
  const filteredProducts = useMemo(() => {
    console.log('useMemo: Filtering products...');
    if (!filterText) {
      return products;
    }
    const lowerCaseFilter = filterText.toLowerCase();
    return products.filter(product =>
      product.name.toLowerCase().includes(lowerCaseFilter) ||
      product.category.toLowerCase().includes(lowerCaseFilter)
    );
  }, [products, filterText]); // Dependencies: only re-filter if products or filterText change

  const renderProductItem = ({ item }) => (
    <TouchableOpacity onPress={() => onProductPress(item)} style={styles.productItem}>
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productDetails}>Category: {item.category} | Price: ${item.price}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.productListContainer}>
      <Text style={styles.subSubHeader}>Filtered Products ({filteredProducts.length}):</Text>
      <FlatList
        data={filteredProducts}
        keyExtractor={item => item.id.toString()}
        renderItem={renderProductItem}
        ListEmptyComponent={<Text style={styles.infoText}>No products found.</Text>}
      />
    </View>
  );
});

// Mock Data
const ALL_PRODUCTS = [
  { id: 1, name: 'Laptop Pro', price: 1500, category: 'Electronics', rating: 4.8 },
  { id: 2, name: 'Ergo Chair', price: 350, category: 'Furniture', rating: 4.2 },
  { id: 3, name: 'External Monitor', price: 300, category: 'Electronics', rating: 4.5 },
  { id: 4, name: 'Gaming Desk', price: 450, category: 'Furniture', rating: 4.0 },
  { id: 5, name: 'Wireless Mouse', price: 50, category: 'Electronics', rating: 3.9 },
  { id: 6, name: 'Coffee Table', price: 120, category: 'Furniture', rating: 3.5 },
  { id: 7, name: 'Webcam HD', price: 80, category: 'Electronics', rating: 4.1 },
];

const UseMemoExamples = () => {
  const [counter, setCounter] = useState(0);
  const [productSearchTerm, setProductSearchTerm] = useState('');
  const [activeUsers, setActiveUsers] = useState(10);
  const [dataForHeavyComputation, setDataForHeavyComputation] = useState(1000000);

  // --- Example 2: Memoizing complex derived state/calculation ---
  // This value (average rating) is only re-calculated if ALL_PRODUCTS changes.
  const averageRating = useMemo(() => {
    console.log('useMemo: Calculating average rating...');
    if (ALL_PRODUCTS.length === 0) return 0;
    const totalRating = ALL_PRODUCTS.reduce((sum, product) => sum + product.rating, 0);
    return (totalRating / ALL_PRODUCTS.length).toFixed(2);
  }, [ALL_PRODUCTS]); // Dependency: only re-calculate if ALL_PRODUCTS array reference changes

  // --- Example 3: Memoizing an expensive computation (e.g., Fibonacci) ---
  // The Fibonacci calculation can be very expensive for large 'n'.
  // We only want to re-calculate it if `dataForHeavyComputation` changes.
  const fibonacci = useCallback((n) => {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
  }, []); // fibonacci function is memoized

  const memoizedFibValue = useMemo(() => {
    console.log(`useMemo: Calculating Fibonacci for ${dataForHeavyComputation}...`);
    // Simulating a slightly less heavy computation for demo speed
    // In a real scenario, this 'n' would be larger for real performance impact
    return fibonacci(Math.min(dataForHeavyComputation, 30)); // Cap for demo
  }, [dataForHeavyComputation, fibonacci]); // Re-calculate only if dataForHeavyComputation or fibonacci function changes

  // --- Example 4: Memoizing an object or array reference (to prevent child re-renders) ---
  // If `dashboardMetrics` was defined directly in the component body, it would be a new object
  // reference on every render, potentially causing child components to re-render.
  const dashboardMetrics = useMemo(() => ({
    totalProducts: ALL_PRODUCTS.length,
    activeUsersToday: activeUsers,
    revenueProjection: `$${(ALL_PRODUCTS.reduce(s => s + s.price, 0) * 1.2).toFixed(2)}`,
  }), [ALL_PRODUCTS.length, activeUsers]); // Dependencies: only re-create object if these change

  // --- Callback for ProductList ---
  const handleProductPress = useCallback((product) => {
    Alert.alert('Product Selected', `You selected: ${product.name}`);
  }, []); // No dependencies, so this function is created once

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.mainHeader}>`useMemo()` High-Level Examples</Text>
      <Text style={styles.description}>
        Memoizing expensive values for performance optimization.
      </Text>

      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Global Counter (Triggers Re-renders)</Text>
        <Text style={styles.currentValue}>Counter: {counter}</Text>
        <Button title="Increment Counter" onPress={() => setCounter(prev => prev + 1)} />
        <Text style={styles.infoText}>
          Incrementing this counter causes the parent component to re-render,
          but `useMemo` will prevent unnecessary recalculations/re-filters in child components.
        </Text>
      </View>

      {/* --- Example 1: Memoizing filtered data --- */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>1. Memoizing Filtered Data</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Filter products (name or category)"
          value={productSearchTerm}
          onChangeText={setProductSearchTerm}
        />
        <ProductList
          products={ALL_PRODUCTS} // Passed as a prop
          filterText={productSearchTerm} // Passed as a prop
          onProductPress={handleProductPress}
        />
        <Text style={styles.infoText}>
          "Filtering products..." logs only when you type in the search box,
          not when "Increment Counter" is pressed. This is `useMemo` at work inside `ProductList`.
        </Text>
      </View>

      {/* --- Example 2: Memoizing complex derived state/calculation --- */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>2. Memoizing Average Rating</Text>
        <Text style={styles.currentValue}>Overall Average Product Rating: {averageRating}</Text>
        <Text style={styles.infoText}>
          "Calculating average rating..." logs only once on initial render (since ALL_PRODUCTS is constant),
          not when the counter increments or search term changes.
        </Text>
      </View>

      {/* --- Example 3: Memoizing an expensive computation --- */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>3. Memoizing Expensive Computation (Fibonacci)</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Enter N for Fibonacci (e.g., 20)"
          keyboardType="numeric"
          value={dataForHeavyComputation.toString()}
          onChangeText={text => setDataForHeavyComputation(parseInt(text) || 0)}
        />
        <Text style={styles.currentValue}>Fibonacci Value (N={Math.min(dataForHeavyComputation, 30)}): {memoizedFibValue}</Text>
        <Text style={styles.infoText}>
          "Calculating Fibonacci..." logs only when you change the 'N' input value,
          not when the counter increments.
        </Text>
      </View>

      {/* --- Example 4: Memoizing an object or array reference --- */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>4. Memoizing Object/Array References</Text>
        <Text style={styles.subSubHeader}>Dashboard Metrics:</Text>
        <Text style={styles.listItemText}>Total Products: {dashboardMetrics.totalProducts}</Text>
        <Text style={styles.listItemText}>Active Users: {dashboardMetrics.activeUsersToday}</Text>
        <Text style={styles.listItemText}>Revenue Projection: {dashboardMetrics.revenueProjection}</Text>
        <Button title="Change Active Users" onPress={() => setActiveUsers(prev => prev + 1)} />
        <Text style={styles.infoText}>
          The `dashboardMetrics` object reference only changes when `activeUsers` state changes,
          not on every counter increment, preventing potential re-renders of child components
          that receive this object as a prop (if those children are `memo`ized).
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
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
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
  infoText: {
    fontSize: 13,
    color: '#6c757d',
    textAlign: 'center',
    marginTop: 5,
    fontStyle: 'italic',
  },
  productListContainer: {
    marginTop: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 10,
    maxHeight: 250, // For demo purposes
  },
  productItem: {
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  productDetails: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  listItemText: {
    fontSize: 15,
    color: '#444',
    marginLeft: 10,
    marginBottom: 5,
  },
});

export default UseMemoExamples;