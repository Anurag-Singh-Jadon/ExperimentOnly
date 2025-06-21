// ProductFilterScreen.js
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Platform,
  Alert,
  ScrollView,
  Modal, // Import Modal
} from 'react-native';
import Slider from '@react-native-community/slider';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Import Ionicons for filter icon
import { fetchProducts, fetchCategories } from './api';
import MultiSelectFilter from './MultiSelectFilter';

const ProductFilterScreen = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter States
  const [searchText, setSearchText] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [minProductPrice, setMinProductPrice] = useState(0); // Actual min from data
  const [maxProductPrice, setMaxProductPrice] = useState(1000); // Actual max from data
  const [currentMinPrice, setCurrentMinPrice] = useState(0); // Slider min value
  const [currentMaxPrice, setCurrentMaxPrice] = useState(1000); // Slider max value

  const [isFilterModalVisible, setFilterModalVisible] = useState(false); // State for modal visibility

  // State to hold filter values temporarily in modal, before applying
  const [tempSearchText, setTempSearchText] = useState('');
  const [tempSelectedCategories, setTempSelectedCategories] = useState([]);
  const [tempCurrentMinPrice, setTempCurrentMinPrice] = useState(0);
  const [tempCurrentMaxPrice, setTempCurrentMaxPrice] = useState(0);

  // Determine actual min/max prices from fetched data for slider
  useEffect(() => {
    if (allProducts.length > 0) {
      const prices = allProducts.map(p => p.price);
      const fetchedMin = Math.floor(Math.min(...prices));
      const fetchedMax = Math.ceil(Math.max(...prices));
      setMinProductPrice(fetchedMin);
      setMaxProductPrice(fetchedMax);
      setCurrentMinPrice(fetchedMin); // Initialize current with actual min/max
      setCurrentMaxPrice(fetchedMax);
      setTempCurrentMinPrice(fetchedMin); // Initialize temp too
      setTempCurrentMaxPrice(fetchedMax);
    }
  }, [allProducts]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [productsData, categoriesData] = await Promise.all([
          fetchProducts(),
          fetchCategories(),
        ]);
        console.log('Fetched Products:', productsData);
        console.log('Fetched Categories:', categoriesData);
        setAllProducts(productsData);
        console.log('categoriesData.map(cat => ({ label: cat, value: cat }))',categoriesData.map(cat => ({ label: cat, value: cat })))
        setAllCategories(categoriesData.map(cat => ({ label: cat, value: cat })));
        //Mtlb isme categories ko label aur value dono same rakhna hai
        // [{"label": "electronics", "value": "electronics"}, {"label": "jewelery", "value": "jewelery"}, {"label": "men's clothing", "value": "men's clothing"}, {"label": "women's clothing", "value": "women's clothing"}]
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError('Failed to load products or categories. Please try again.');
        Alert.alert('Error', 'Could not fetch data.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Filter logic
  const filteredProducts = useMemo(() => {
    if (!allProducts || allProducts.length === 0) return [];

    let filtered = allProducts;

    // 1. Filter by Search Text
    if (searchText) {
      const lowerCaseSearchText = searchText.toLowerCase();
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(lowerCaseSearchText) ||
        product.description.toLowerCase().includes(lowerCaseSearchText)
      );
      console.log('filtered by search text:', filtered);
      // If no products match search, return empty array
    }

    // 2. Filter by Categories
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(product =>
        selectedCategories.includes(product.category)
      );
    }

    // 3. Filter by Price Range
    filtered = filtered.filter(product =>
      product.price >= currentMinPrice && product.price <= currentMaxPrice
    );

    return filtered;
  }, [allProducts, searchText, selectedCategories, currentMinPrice, currentMaxPrice]);

  // Render item for FlatList
  const renderProductItem = useCallback(({ item }) => (
    <View style={styles.productCard}>
      <Text style={styles.productTitle}>{item.title}</Text>
      <Text style={styles.productCategory}>Category: {item.category}</Text>
      <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
      <Text numberOfLines={2} style={styles.productDescription}>{item.description}</Text>
    </View>
  ), []);

  const keyExtractor = useCallback((item) => String(item.id), []); // Use id for unique keys

  // Function to apply filters from modal
  const applyFilters = () => {
    setSearchText(tempSearchText);
    setSelectedCategories(tempSelectedCategories);
    setCurrentMinPrice(tempCurrentMinPrice);
    setCurrentMaxPrice(tempCurrentMaxPrice);
    setFilterModalVisible(false); // Close modal
  };

  // Function to reset all filters
  const resetFilters = () => {
    setTempSearchText('');
    setTempSelectedCategories([]);
    setTempCurrentMinPrice(minProductPrice);
    setTempCurrentMaxPrice(maxProductPrice);
    // Apply reset to actual filters immediately
    setSearchText('');
    setSelectedCategories([]);
    setCurrentMinPrice(minProductPrice);
    setCurrentMaxPrice(maxProductPrice);
    setFilterModalVisible(false); // Close modal
  };

  // Function to initialize temp states when opening modal
  const openFilterModal = () => {
    setTempSearchText(searchText);
    setTempSelectedCategories(selectedCategories);
    setTempCurrentMinPrice(currentMinPrice);
    setTempCurrentMaxPrice(currentMaxPrice);
    setFilterModalVisible(true);
  };

  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading products and categories...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Product Listing</Text>
        <TouchableOpacity onPress={openFilterModal} style={styles.filterIcon}>
          <Ionicons name="filter-outline" size={24} color="#007bff" />
        </TouchableOpacity>
      </View>

      {/* Main content with FlatList */}
      <Text style={styles.resultsCount}>
        Displaying {filteredProducts.length} of {allProducts.length} products
      </Text>
      {filteredProducts.length === 0 ? (
        <View style={styles.noResultsContainer}>
          <Text style={styles.noResultsText}>No products match your filters.</Text>
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          renderItem={renderProductItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.flatListContent}
          initialNumToRender={10}
          maxToRenderPerBatch={5}
          windowSize={21}
        />
      )}

      {/* Filter Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={isFilterModalVisible}
        onRequestClose={() => setFilterModalVisible(false)} // For Android back button
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Apply Filters</Text>
            <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
              <Ionicons name="close-circle-outline" size={28} color="#999" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalContent}>
            {/* Search Input */}
            <TextInput
              style={styles.searchInput}
              placeholder="Search by title or description..."
              value={tempSearchText}
              onChangeText={setTempSearchText}
              clearButtonMode="while-editing" // iOS
              placeholderTextColor="#888"
            />

            {/* Category Filter */}
            <MultiSelectFilter
              label="Filter by Categories"
              options={allCategories}
              selectedValues={tempSelectedCategories}
              onValueChange={setTempSelectedCategories}
            />

            {/* Price Range Slider */}
            <View style={styles.priceFilterContainer}>
              <Text style={styles.groupLabel}>Price Range:</Text>
              <View style={styles.priceDisplay}>
                <Text>${tempCurrentMinPrice.toFixed(0)}</Text>
                <Text>-</Text>
                <Text>${tempCurrentMaxPrice.toFixed(0)}</Text>
              </View>
              <View style={styles.twoSliderContainer}>
                <View style={styles.sliderWrapper}>
                  <Text style={styles.sliderLabel}>Min Price:</Text>
                  <Slider
                    style={styles.slider}
                    minimumValue={minProductPrice}
                    maximumValue={maxProductPrice}
                    step={1}
                    value={tempCurrentMinPrice}
                    onValueChange={setTempCurrentMinPrice}
                    minimumTrackTintColor="#007bff"
                    maximumTrackTintColor="#d3d3d3"
                    thumbTintColor={Platform.OS === 'ios' ? '#007bff' : '#007bff'}
                  />
                  <Text style={styles.sliderValue}>${tempCurrentMinPrice.toFixed(0)}</Text>
                </View>
                <View style={styles.sliderWrapper}>
                  <Text style={styles.sliderLabel}>Max Price:</Text>
                  <Slider
                    style={styles.slider}
                    minimumValue={minProductPrice}
                    maximumValue={maxProductPrice}
                    step={1}
                    value={tempCurrentMaxPrice}
                    onValueChange={setTempCurrentMaxPrice}
                    minimumTrackTintColor="#007bff"
                    maximumTrackTintColor="#d3d3d3"
                    thumbTintColor={Platform.OS === 'ios' ? '#007bff' : '#007bff'}
                  />
                  <Text style={styles.sliderValue}>${tempCurrentMaxPrice.toFixed(0)}</Text>
                </View>
              </View>
            </View>
          </ScrollView>
          <View style={styles.modalFooter}>
            <TouchableOpacity onPress={resetFilters} style={[styles.modalButton, styles.resetButton]}>
              <Text style={styles.buttonText}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={applyFilters} style={[styles.modalButton, styles.applyButton]}>
              <Text style={styles.buttonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: Platform.OS === 'android' ? 25 : 50,
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
  },
  filterIcon: {
    padding: 5,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  resultsCount: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
    color: '#333',
  },
  flatListContent: {
    paddingHorizontal: 15,
    paddingBottom: 20,
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
  productCategory: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
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
  errorText: {
    color: 'red',
    fontSize: 18,
    textAlign: 'center',
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noResultsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },

  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: Platform.OS === 'android' ? 25 : 50,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  modalContent: {
    flex: 1,
    padding: 15,
  },
  searchInput: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fff',
  },
  groupLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  priceFilterContainer: {
    marginTop: 15,
  },
  priceDisplay: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
    fontSize: 14,
    color: '#666',
  },
  twoSliderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  sliderWrapper: {
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  sliderLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  sliderValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 5,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
  },
  resetButton: {
    backgroundColor: '#f8f8f8',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  applyButton: {
    backgroundColor: '#007bff',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProductFilterScreen;