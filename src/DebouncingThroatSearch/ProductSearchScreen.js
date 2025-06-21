// This component will feature:

// A TextInput for the search query.
// State to manage the search query and the fetched results.
// Debouncing logic using useRef and useEffect.
// Loading indicators.
// A FlatList to display results.


// ProductSearchScreen.js
import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  Keyboard,
  TouchableOpacity,
} from 'react-native';
import { searchProducts } from './api';

const DEBOUNCE_DELAY = 500; // milliseconds (e.g., 500ms for debouncing search input)

const ProductSearchScreen = () => {
  const [searchTerm, setSearchTerm] = useState(''); // What the user is typing
  const [searchResults, setSearchResults] = useState([]); // Results from API
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false); // To show "No results" only after a search attempt

  // useRef to hold the debounce timer
  const debounceTimer = useRef(null);

  // Function to perform the actual API search
  const performSearch = useCallback(async (query) => {
    setError(null);
    setLoading(true);
    setHasSearched(true); // Mark that a search has been attempted

    try {
      const data = await searchProducts(query);
      setSearchResults(data.products);
    } catch (err) {
      console.error('Search failed:', err);
      setError('Failed to fetch search results. Please try again.');
      setSearchResults([]); // Clear results on error
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array because performSearch only depends on searchProducts (which is external)

  // Effect to debounce the search term
  useEffect(() => {
    // Clear any existing timer when searchTerm changes
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Don't search if searchTerm is empty (or just spaces)
    const trimmedSearchTerm = searchTerm.trim();
    if (trimmedSearchTerm.length === 0) {
      setSearchResults([]); // Clear results
      setHasSearched(false); // Reset search state
      setLoading(false); // Ensure loader is off
      return; // No need to debounce an empty query
    }

    // Set a new timer
    debounceTimer.current = setTimeout(() => {
      performSearch(trimmedSearchTerm);
    }, DEBOUNCE_DELAY);

    // Cleanup function: Clear the timer if the component unmounts or
    // if searchTerm changes again before the delay
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [searchTerm, performSearch]); // performSearch is a dependency because it's used inside useEffect

  // Render search result item
  const renderProductItem = useCallback(({ item }) => (
    <View style={styles.productCard}>
      <Text style={styles.productTitle}>{item.title}</Text>
      <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
      <Text numberOfLines={2} style={styles.productDescription}>{item.description}</Text>
    </View>
  ), []);

  const keyExtractor = useCallback((item, index) => `${item.id}-${index}`, []);

  const handleClearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
    setHasSearched(false);
    setError(null);
    Keyboard.dismiss(); // Dismiss keyboard when clearing
  };

  const renderListEmptyComponent = () => {
    if (loading) return null; // Don't show empty state if loading
    if (error) return null; // Error message is displayed elsewhere

    if (hasSearched) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No results found for "{searchTerm}".</Text>
        </View>
      );
    }
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Start typing to search for products.</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for products..."
          placeholderTextColor="#888"
          value={searchTerm}
          onChangeText={setSearchTerm}
          autoCorrect={false}
          autoCapitalize="none"
          returnKeyType="search"
          onSubmitEditing={() => performSearch(searchTerm.trim())} // Optional: allow immediate search on enter
        />
        {loading && <ActivityIndicator size="small" color="#007bff" style={styles.loadingIndicator} />}
        {searchTerm.length > 0 && !loading && (
          <TouchableOpacity onPress={handleClearSearch} style={styles.clearButton}>
            <Text style={styles.clearButtonText}>X</Text>
          </TouchableOpacity>
        )}
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <FlatList
        data={searchResults}
        renderItem={renderProductItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.flatListContent}
        ListEmptyComponent={renderListEmptyComponent}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#f9f9f9',
  },
  loadingIndicator: {
    marginLeft: 10,
  },
  clearButton: {
    marginLeft: 10,
    padding: 5,
    borderRadius: 15,
    backgroundColor: '#e0e0e0',
  },
  clearButtonText: {
    color: '#666',
    fontWeight: 'bold',
    fontSize: 14,
  },
  errorContainer: {
    padding: 15,
    backgroundColor: '#ffe0e0',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    textAlign: 'center',
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    minHeight: 150, // Ensure it has some height even if content is small
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default ProductSearchScreen;


// Explanation of Debouncing Logic:
// searchTerm State:

// const [searchTerm, setSearchTerm] = useState('');
// This state variable holds the raw text currently typed into the TextInput by the user.
// debounceTimer Ref:

// const debounceTimer = useRef(null);
// We use useRef to store the setTimeout ID. useRef is ideal here because its value persists across renders without causing re-renders when it changes. This is exactly what we want for a timer ID.
// performSearch Function (useCallback):

// const performSearch = useCallback(async (query) => { ... }, []);
// This is the actual function that makes the API call. It's wrapped in useCallback to ensure its reference is stable across renders, which is important because it's a dependency of the useEffect.
// useEffect for Debouncing:

// useEffect(() => { ... }, [searchTerm, performSearch]);
// Dependency Array: This useEffect runs whenever searchTerm changes (i.e., every time the user types) or performSearch changes (which it won't, due to useCallback).
// clearTimeout(debounceTimer.current): The first thing inside the useEffect is to clear any previous setTimeout that might be running. If the user types another character, the old timer is cancelled.
// Empty Query Check: if (trimmedSearchTerm.length === 0): If the search term becomes empty (e.g., user deletes all text), we immediately clear results, reset the search state, and stop the debounce process, avoiding an unnecessary API call for an empty query.
// debounceTimer.current = setTimeout(() => { ... }, DEBOUNCE_DELAY);: A new timer is set. The performSearch function will only be called after DEBOUNCE_DELAY milliseconds have passed without searchTerm changing again.
// Cleanup Function (return () => { ... }): This is crucial. When the component unmounts, or if the useEffect re-runs (because searchTerm changes again), this cleanup function is executed. It ensures that any pending setTimeout is cleared, preventing memory leaks or unwanted behavior.
// How to Observe Debouncing:
// Run the app on a device or emulator.
// Open your browser's developer tools (if using web) or your terminal where npx react-native start is running.
// Type rapidly into the search bar. You'll notice that the "Loading..." indicator (and the actual API call) only appears after you pause typing for half a second (DEBOUNCE_DELAY).
// If you type slowly, pausing after each letter, you'll see a loading indicator and API call for almost every letter, as the pause is longer than the debounce delay.
// This setup effectively debounces the search input, making your API calls more efficient and your app more responsive.