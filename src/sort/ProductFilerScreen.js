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
  Modal,
  PlatformColor // For native system colors if desired
} from 'react-native';
import Slider from '@react-native-community/slider';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { fetchProducts, fetchCategories } from '../Filter/api';
import MultiSelectFilter from '../Filter/MultiSelectFilter';

// Define sorting options
const SORT_OPTIONS = [
  { label: 'Default', value: 'default' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Name: A-Z', value: 'name_asc' },
  { label: 'Name: Z-A', value: 'name_desc' },
];

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

  // Sort State
  const [sortOrder, setSortOrder] = useState('default'); // Default sort order

  const [isFilterModalVisible, setFilterModalVisible] = useState(false);

  // State to hold filter/sort values temporarily in modal, before applying
  const [tempSearchText, setTempSearchText] = useState('');
  const [tempSelectedCategories, setTempSelectedCategories] = useState([]);
  const [tempCurrentMinPrice, setTempCurrentMinPrice] = useState(0);
  const [tempCurrentMaxPrice, setTempCurrentMaxPrice] = useState(0);
  const [tempSortOrder, setTempSortOrder] = useState('default'); // Temp sort order

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
        setAllProducts(productsData);
        setAllCategories(categoriesData.map(cat => ({ label: cat, value: cat })));
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

  // Filter and Sort Logic
  const filteredAndSortedProducts = useMemo(() => {
    if (!allProducts || allProducts.length === 0) return [];

    let processedProducts = [...allProducts]; // Create a mutable copy

    // 1. Filter by Search Text
    if (searchText) {
      const lowerCaseSearchText = searchText.toLowerCase();
      processedProducts = processedProducts.filter(product =>
        product.title.toLowerCase().includes(lowerCaseSearchText) ||
        product.description.toLowerCase().includes(lowerCaseSearchText)
      );
    }

    // 2. Filter by Categories
    if (selectedCategories.length > 0) {
      processedProducts = processedProducts.filter(product =>
        selectedCategories.includes(product.category)
      );
    }

    // 3. Filter by Price Range
    processedProducts = processedProducts.filter(product =>
      product.price >= currentMinPrice && product.price <= currentMaxPrice
    );

    // 4. Apply Sorting
    processedProducts.sort((a, b) => {
      switch (sortOrder) {
        case 'price_asc':
          return a.price - b.price;
        case 'price_desc':
          return b.price - a.price;
        case 'name_asc':
          return a.title.localeCompare(b.title);
        case 'name_desc':
          return b.title.localeCompare(a.title);
        case 'default':
        default:
          return 0; // Maintain original order or API default
      }
    });

    return processedProducts;
  }, [allProducts, searchText, selectedCategories, currentMinPrice, currentMaxPrice, sortOrder]);

  // Render item for FlatList
  const renderProductItem = useCallback(({ item }) => (
    <View style={styles.productCard}>
      <Text style={styles.productTitle}>{item.title}</Text>
      <Text style={styles.productCategory}>Category: {item.category}</Text>
      <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
      <Text numberOfLines={2} style={styles.productDescription}>{item.description}</Text>
    </View>
  ), []);

  const keyExtractor = useCallback((item) => String(item.id), []);

  // Function to apply filters and sort from modal
  const applyFiltersAndSort = () => {
    setSearchText(tempSearchText);
    setSelectedCategories(tempSelectedCategories);
    setCurrentMinPrice(tempCurrentMinPrice);
    setCurrentMaxPrice(tempCurrentMaxPrice);
    setSortOrder(tempSortOrder); // Apply temporary sort order
    setFilterModalVisible(false); // Close modal
  };

  // Function to reset all filters and sort
  const resetFiltersAndSort = () => {
    setTempSearchText('');
    setTempSelectedCategories([]);
    setTempCurrentMinPrice(minProductPrice);
    setTempCurrentMaxPrice(maxProductPrice);
    setTempSortOrder('default'); // Reset temp sort order
    // Apply reset to actual filters immediately
    setSearchText('');
    setSelectedCategories([]);
    setCurrentMinPrice(minProductPrice);
    setCurrentMaxPrice(maxProductPrice);
    setSortOrder('default'); // Reset actual sort order
    setFilterModalVisible(false); // Close modal
  };

  // Function to initialize temp states when opening modal
  const openFilterModal = () => {
    setTempSearchText(searchText);
    setTempSelectedCategories(selectedCategories);
    setTempCurrentMinPrice(currentMinPrice);
    setTempCurrentMaxPrice(currentMaxPrice);
    setTempSortOrder(sortOrder); // Initialize temp sort order
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
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Products</Text>
        <TouchableOpacity onPress={openFilterModal} style={styles.filterIcon}>
          <Ionicons name="filter" size={24} color="#333" />
        </TouchableOpacity>
        </View>

         {/* Main content with FlatList */}
              <Text style={styles.resultsCount}>
                Displaying {filteredAndSortedProducts.length} of {allProducts.length} products
              </Text>
              {filteredAndSortedProducts.length === 0 ? (
                <View style={styles.noResultsContainer}>
                  <Text style={styles.noResultsText}>No products match your filters.</Text>
                </View>
              ) : (
                <FlatList
                  data={filteredAndSortedProducts}
                  renderItem={renderProductItem}
                  keyExtractor={keyExtractor}
                  contentContainerStyle={styles.flatListContent}
                  initialNumToRender={10}
                  maxToRenderPerBatch={5}
                  windowSize={21}
                />
              )}
                {/* Filter/Sort Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={isFilterModalVisible}
        onRequestClose={() => setFilterModalVisible(false)} // For Android back button
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filter & Sort Products</Text>
            <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={styles.modalContent}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search products..."
              value={tempSearchText}
              onChangeText={setTempSearchText}
            />
            <MultiSelectFilter
              options={allCategories}
              selectedValues={tempSelectedCategories}
              onValueChange={setTempSelectedCategories}
              label="Select Categories"
            />
            <View style={styles.priceFilterContainer}>
              <Text style={styles.groupLabel}>Price Range</Text>
              <View style={styles.priceDisplay}>
                <Text>Min: ${tempCurrentMinPrice}</Text>
                <Text>Max: ${tempCurrentMaxPrice}</Text>
              </View>
              <View style={styles.twoSliderContainer}>
                <View style={styles.sliderWrapper}>
                  <Text style={styles.sliderLabel}>Min Price</Text>
                  <Slider
                    style={styles.slider}
                    minimumValue={minProductPrice}
                    maximumValue={maxProductPrice}
                    value={tempCurrentMinPrice}
                    onValueChange={(value) => setTempCurrentMinPrice(value)}
                    minimumTrackTintColor="#007bff"
                    maximumTrackTintColor="#ddd"
                  />
                  <Text style={styles.sliderValue}>${tempCurrentMinPrice}</Text>
                </View>
                <View style={styles.sliderWrapper}>
                  <Text style={styles.sliderLabel}>Max Price</Text>
                  <Slider
                    style={styles.slider}
                    minimumValue={minProductPrice}
                    maximumValue={maxProductPrice}
                    value={tempCurrentMaxPrice}
                    onValueChange={(value) => setTempCurrentMaxPrice(value)}
                    minimumTrackTintColor="#007bff"
                    maximumTrackTintColor="#ddd"
                  />
                  <Text style={styles.sliderValue}>${tempCurrentMaxPrice}</Text>
                </View>
              </View>
            </View>
            <View style={styles.sortContainer}>
              <Text style={styles.groupLabel}>Sort By</Text>
              <View style={styles.sortOptions}>
                {SORT_OPTIONS.map(option => 
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.sortOptionButton,
                      tempSortOrder === option.value && styles.selectedSortOption
                    ]}
                    onPress={() => setTempSortOrder(option.value)}
                  >
                    <Text style={[
                      styles.sortOptionText,
                      tempSortOrder === option.value && styles.selectedSortOptionText
                    ]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                )}
                </View>
               </View>
          </ScrollView>
        </View>
        <View style={styles.modalFooter}>
          <TouchableOpacity
            style={[styles.modalButton, styles.resetButton]}
            onPress={resetFiltersAndSort}
          >
            <Text style={styles.buttonText}>Reset</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modalButton, styles.applyButton]}
            onPress={applyFiltersAndSort}
          >
            <Text style={styles.buttonText}>Apply</Text>
          </TouchableOpacity>
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
  sortContainer: {
    marginTop: 20,
  },
  sortOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start', // Align left
  },
  sortOptionButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20, // Pill shape
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  selectedSortOption: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  sortOptionText: {
    fontSize: 14,
    color: '#333',
  },
  selectedSortOptionText: {
    color: '#fff',
    fontWeight: 'bold',
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