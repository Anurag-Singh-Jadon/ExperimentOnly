import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Dimensions } from 'react-native';

const { width } = Dimensions.get('window'); // Destructuring Dimensions API

const productsData = [
  { id: 'p1', name: 'Gaming Mouse', price: 49.99, category: 'Electronics', imageUrl: 'https://via.placeholder.com/150/FF5733/FFFFFF?text=Mouse' },
  { id: 'p2', name: 'Mechanical Keyboard', price: 129.00, category: 'Electronics', imageUrl: 'https://via.placeholder.com/150/33FF57/FFFFFF?text=Keyboard' },
  { id: 'p3', name: 'Monitor 4K', price: 399.50, category: 'Electronics', imageUrl: 'https://via.placeholder.com/150/3357FF/FFFFFF?text=Monitor' },
  { id: 'p4', name: 'Desk Lamp', price: 25.00, category: 'Home', imageUrl: 'https://via.placeholder.com/150/F7DC6F/000000?text=Lamp' },
  { id: 'p5', name: 'Ergonomic Chair', price: 299.00, category: 'Office', imageUrl: 'https://via.placeholder.com/150/8E44AD/FFFFFF?text=Chair' },
];

// --- Example Component ---
const ProductCard = React.memo(({ product, onAddToCart, currencySymbol = '$' }) => {
  // Deep Object Destructuring of the 'product' prop
  const { id, name, price, category, imageUrl } = product;

  // Function to handle add to cart, using a default value for currencySymbol
  const handleAddToCartPress = useCallback(() => {
    onAddToCart({ productId: id, productName: name, quantity: 1, currency: currencySymbol });
  }, [id, name, onAddToCart, currencySymbol]); // Dependencies for useCallback

  return (
    <TouchableOpacity style={styles.productCard} onPress={handleAddToCartPress}>
      <Image source={{ uri: imageUrl }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{name}</Text>
        <Text style={styles.productPrice}>{currencySymbol}{price.toFixed(2)}</Text>
        <Text style={styles.productCategory}>{category}</Text>
      </View>
    </TouchableOpacity>
  );
});

const ProductListDestructuring = () => {
  // Array destructuring from useState hook
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Object destructuring from Context API (conceptual)
  // Assume a hypothetical UserContext provides { user: { id, name }, settings: { theme } }
  // const { user: { name: userName }, settings: { theme } } = useContext(UserContext);

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setProducts(productsData);
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleAddToCart = useCallback((itemDetails) => {
    // Deep object destructuring in function arguments
    const { productId, productName, quantity, currency } = itemDetails;
    console.log(`Added ${quantity} of ${productName} (ID: ${productId}) for ${currency}${productName} to cart.`);
    // In a real app, you'd dispatch an action, update state, etc.
  }, []);

  // Array destructuring for FlatList renderItem arguments
  const renderProductItem = useCallback(({ item, index }) => ( // item is the product object, index is its position
    <ProductCard product={item} onAddToCart={handleAddToCart} currencySymbol="€" />
  ), [handleAddToCart]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading products...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Our Products</Text>
      {/* Example: Using a rest parameter for FlatList props */}
      <FlatList
        data={products}
        keyExtractor={item => item.id}
        renderItem={renderProductItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={() => <Text>No products found.</Text>}
        // Any other props for FlatList can be spread if they came from higher up
        // {...extraFlatListProps}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    paddingTop: 40, // For SafeAreaView effect
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  listContent: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: width - 20, // Example of using destructured width
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 10,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  productPrice: {
    fontSize: 14,
    color: '#007bff',
    marginTop: 5,
  },
  productCategory: {
    fontSize: 12,
    color: '#888',
    marginTop: 3,
  },
});

export default ProductListDestructuring;