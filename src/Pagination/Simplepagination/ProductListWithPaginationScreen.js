// ProductListWithPaginationScreen.js
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Alert,
  RefreshControl,
  SafeAreaView,
  Platform,
} from 'react-native';
import { fetchPaginatedProducts } from './api'; // Import our new API function

const PAGE_SIZE = 10; // Number of items per page

const ProductListWithPaginationScreen = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(0); // Current page (0-indexed for skip)
  const [totalProducts, setTotalProducts] = useState(0); // Total number of products from API
  const [hasMore, setHasMore] = useState(true); // Flag to know if more data exists

  // Function to fetch data
  const loadProducts = useCallback(async (isRefreshing = false) => {
    if (loading || (loadingMore && !isRefreshing)) return; // Prevent multiple simultaneous fetches

    if (isRefreshing) {
      setRefreshing(true);
      setPage(0); // Reset to first page on refresh
      setHasMore(true); // Assume there's more on refresh
    } else if (page * PAGE_SIZE >= totalProducts && totalProducts > 0) {
      // If we know the total and have already fetched all, stop
      setHasMore(false);
      return;
    }

    const currentSkip = isRefreshing ? 0 : page * PAGE_SIZE;

    console.log(`Fetching page ${page + 1}, skip ${currentSkip}`);

    try {
      if (isRefreshing) {
        setLoading(true); // Show main loader for initial load/refresh
      } else {
        setLoadingMore(true); // Show footer loader for loading more
      }

      const data = await fetchPaginatedProducts(PAGE_SIZE, currentSkip);
      const newProducts = data.products || [];
      const apiTotal = data.total || 0; // Total count from API

      if (isRefreshing) {
        setProducts(newProducts);
      } else {
        setProducts(prevProducts => [...prevProducts, ...newProducts]);
      }

      setTotalProducts(apiTotal);
      setHasMore((currentSkip + newProducts.length) < apiTotal);
      setPage(prevPage => prevPage + 1); // Increment page for next fetch

    } catch (error) {
      console.error('Failed to load products:', error);
      Alert.alert('Error', 'Failed to load products. Please try again.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  }, [loading, loadingMore, page, totalProducts]);

  // Initial load on component mount
  useEffect(() => {
    loadProducts();
  }, []); // Empty dependency array means it runs once on mount

  // Handle pull-to-refresh
  const handleRefresh = useCallback(() => {
    setProducts([]); // Clear current products to show fresh data
    loadProducts(true); // Pass true to indicate refreshing
  }, [loadProducts]);

  // Handle reaching end of list (infinite scroll)
  const handleLoadMore = useCallback(() => {
    if (!loading && !loadingMore && hasMore) {
      loadProducts();
    }
  }, [loading, loadingMore, hasMore, loadProducts]);

  // Render product item
  const renderProductItem = useCallback(({ item }) => (
    <View style={styles.productCard}>
      <Text style={styles.productTitle}>{item.title}</Text>
      <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
      <Text numberOfLines={2} style={styles.productDescription}>{item.description}</Text>
    </View>
  ), []);

  const keyExtractor = useCallback((item, index) => `${item.id}-${index}`, []); // Include index as a fallback for keys if IDs aren't strictly unique across pages

  // Render footer for loading more indicator
  const renderListFooter = () => {
    if (!loadingMore) return null; // Don't show footer if not loading more
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#007bff" />
        <Text style={styles.footerText}>Loading more products...</Text>
      </View>
    );
  };

  if (loading && products.length === 0) { // Only show full screen loader if no products are loaded yet
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading initial products...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Paginated Products</Text>
      </View>

      <FlatList
        data={products}
        renderItem={renderProductItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.flatListContent}
        onEndReached={handleLoadMore} // Triggered when scroll reaches end
        onEndReachedThreshold={0.5} // When 50% of the list bottom is visible
        ListFooterComponent={renderListFooter} // Component to show at the bottom
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#007bff" // iOS loading spinner color
            colors={['#007bff']} // Android loading spinner color
          />
        }
        ListEmptyComponent={() => ( // Component to show if the list is empty
          !loading && !loadingMore && !refreshing && (
            <View style={styles.noResultsContainer}>
              <Text style={styles.noResultsText}>No products found.</Text>
            </View>
          )
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingHorizontal: 15,
    paddingTop: Platform.OS === 'android' ? 10 : 0, // Adjust for safe area
    paddingBottom: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  flatListContent: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  productPrice: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 5,
  },
  productDescription: {
    fontSize: 12,
    color: '#888',
  },
  footerLoader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#666',
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    minHeight: 200, // Ensure it's visible even if list is very short
  },
  noResultsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default ProductListWithPaginationScreen;