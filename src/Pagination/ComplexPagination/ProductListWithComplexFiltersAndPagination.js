// ProductListWithComplexFiltersAndPagination.js
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Platform,
  Alert,
  ScrollView,
  Modal,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import Slider from '@react-native-community/slider';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { fetchAllProducts, fetchCategories } from './api';
import MultiSelectFilter from './MultiSelectFilter';

const SORT_OPTIONS = [
  { label: 'Default', value: 'default' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Name: A-Z', value: 'name_asc' },
  { label: 'Name: Z-A', value: 'name_desc' },
];

const PAGE_SIZE = 10;

const ProductListWithComplexFiltersAndPagination = () => {
  const [allOriginalProducts, setAllOriginalProducts] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [error, setError] = useState(null);

  const [activeSearchText, setActiveSearchText] = useState('');
  const [activeSelectedCategories, setActiveSelectedCategories] = useState([]);
  const [activeMinPrice, setActiveMinPrice] = useState(0);
  const [activeMaxPrice, setActiveMaxPrice] = useState(1000);
  const [activeSortOrder, setActiveSortOrder] = useState('default');

  const [tempSearchText, setTempSearchText] = useState('');
  const [tempSelectedCategories, setTempSelectedCategories] = useState([]);
  const [tempMinPrice, setTempMinPrice] = useState(0);
  const [tempMaxPrice, setTempMaxPrice] = useState(0);
  const [tempSortOrder, setTempSortOrder] = useState('default');

  const [isFilterModalVisible, setFilterModalVisible] = useState(false);

  const [displayProducts, setDisplayProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMorePages, setHasMorePages] = useState(true);

  const minProductPriceRef = useRef(0);
  const maxProductPriceRef = useRef(1000);

  // --- Data Fetching Effect (Initial Load) ---
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoadingInitial(true);
        setError(null);
        const [productsData, categoriesData] = await Promise.all([
          fetchAllProducts(),
          fetchCategories(),
        ]);
        setAllOriginalProducts(productsData);
        console.log('Fetched All Original Products:', productsData.length); // DEBUG
        setAllCategories(categoriesData.map(cat => ({ label: cat, value: cat })));

        if (productsData.length > 0) {
          const prices = productsData.map(p => p.price);
          const fetchedMin = Math.floor(Math.min(...prices));
          const fetchedMax = Math.ceil(Math.max(...prices));
          minProductPriceRef.current = fetchedMin;
          maxProductPriceRef.current = fetchedMax;

          setActiveMinPrice(fetchedMin);
          setActiveMaxPrice(fetchedMax);
          setTempMinPrice(fetchedMin);
          setTempMaxPrice(fetchedMax);
        } else {
          minProductPriceRef.current = 0;
          maxProductPriceRef.current = 1000;
          setActiveMinPrice(0);
          setActiveMaxPrice(1000);
          setTempMinPrice(0);
          setTempMaxPrice(1000);
        }

      } catch (err) {
        console.error('Failed to fetch initial data:', err);
        setError('Failed to load products or categories. Please try again.');
        Alert.alert('Error', 'Could not fetch initial data.');
      } finally {
        setLoadingInitial(false);
      }
    };
    loadInitialData();
  }, []);

  // --- Filtering and Sorting Logic (Memoized) ---
  const processedProducts = useMemo(() => {
    if (!allOriginalProducts || allOriginalProducts.length === 0) return [];

    let filtered = [...allOriginalProducts];

    if (activeSearchText) {
      const lowerCaseSearchText = activeSearchText.toLowerCase();
      filtered = filtered.filter(product =>
        (product.title && product.title.toLowerCase().includes(lowerCaseSearchText)) ||
        (product.description && product.description.toLowerCase().includes(lowerCaseSearchText))
      );
    }

    if (activeSelectedCategories.length > 0) {
      filtered = filtered.filter(product =>
        activeSelectedCategories.includes(product.category)
      );
    }

    filtered = filtered.filter(product =>
      product.price >= activeMinPrice && product.price <= activeMaxPrice
    );

    filtered.sort((a, b) => {
      switch (activeSortOrder) {
        case 'price_asc':
          return a.price - b.price;
        case 'price_desc':
          return b.price - a.price;
        case 'name_asc':
          return (a.title || '').localeCompare(b.title || '');
        case 'name_desc':
          return (b.title || '').localeCompare(a.title || '');
        case 'default':
        default:
          return 0;
      }
    });
    console.log('Processed Products (after filters/sort):', filtered.length); // DEBUG
    return filtered;
  }, [allOriginalProducts, activeSearchText, activeSelectedCategories, activeMinPrice, activeMaxPrice, activeSortOrder]);

  // --- Load More Products Function (handles subsequent loads) ---
  const loadMoreProducts = useCallback(() => {
    console.log('loadMoreProducts called. CurrentPage:', currentPage, 'hasMorePages:', hasMorePages, 'loadingMore:', loadingMore, 'refreshing:', refreshing); // DEBUG
    if (loadingMore || refreshing || !hasMorePages) {
      console.log('Skipping loadMoreProducts:', { loadingMore, refreshing, hasMorePages }); // DEBUG
      return;
    }

    setLoadingMore(true);
    const startIndex = currentPage * PAGE_SIZE;

    // Check if there are actually more items in the processed list
    if (startIndex >= processedProducts.length) {
      setHasMorePages(false);
      setLoadingMore(false);
      console.log('No more items in processedProducts to load.'); // DEBUG
      return;
    }

    const newItems = processedProducts.slice(startIndex, startIndex + PAGE_SIZE);

    if (newItems.length > 0) {
      setDisplayProducts(prev => [...prev, ...newItems]);
      setCurrentPage(prev => prev + 1);
      setHasMorePages((startIndex + newItems.length) < processedProducts.length);
      console.log('Loaded new items:', newItems.length, 'New displayProducts length:', (displayProducts.length + newItems.length)); // DEBUG
    } else {
      setHasMorePages(false); // No new items were found, even if startIndex was valid (e.g., end of list)
      console.log('newItems is empty, setting hasMorePages to false.'); // DEBUG
    }
    setLoadingMore(false);
  }, [currentPage, loadingMore, refreshing, hasMorePages, processedProducts, displayProducts.length]);

  // --- Effect to trigger first page load when processedProducts changes ---
  useEffect(() => {
    console.log('useEffect: processedProducts changed. Resetting pagination.'); // DEBUG
    setCurrentPage(0); // Reset to page 0
    setDisplayProducts([]); // Clear displayed products

    // Directly load the first page of the new processedProducts
    const firstPageItems = processedProducts.slice(0, PAGE_SIZE);
    setDisplayProducts(firstPageItems);
    setCurrentPage(1); // Set next page to 1 for subsequent loads
    setHasMorePages(firstPageItems.length === PAGE_SIZE && processedProducts.length > PAGE_SIZE);
    console.log('Initial display set:', firstPageItems.length, 'items. Next page:', 1, 'Has more:', firstPageItems.length === PAGE_SIZE && processedProducts.length > PAGE_SIZE); // DEBUG

  }, [processedProducts]); // This effect runs when filters/sort change OR when initial data loads

  // --- Pull-to-Refresh Handler ---
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    setError(null);

    try {
      const productsData = await fetchAllProducts();
      setAllOriginalProducts(productsData);

      setActiveSearchText('');
      setActiveSelectedCategories([]);
      if (productsData.length > 0) {
        const prices = productsData.map(p => p.price);
        minProductPriceRef.current = Math.floor(Math.min(...prices));
        maxProductPriceRef.current = Math.ceil(Math.max(...prices));
      } else {
        minProductPriceRef.current = 0;
        maxProductPriceRef.current = 1000;
      }
      setActiveMinPrice(minProductPriceRef.current);
      setActiveMaxPrice(maxProductPriceRef.current);
      setActiveSortOrder('default');

      setTempSearchText('');
      setTempSelectedCategories([]);
      setTempMinPrice(minProductPriceRef.current);
      setTempMaxPrice(maxProductPriceRef.current);
      setTempSortOrder('default');

      // Pagination will automatically reset via the processedProducts useEffect
    } catch (err) {
      console.error('Failed to re-fetch data on refresh:', err);
      setError('Failed to refresh data. Please try again.');
      Alert.alert('Refresh Error', 'Could not refresh data.');
    } finally {
      setRefreshing(false);
    }
  }, []);

  // --- Modal Control Functions ---
  const applyFiltersAndSort = useCallback(() => {
    setActiveSearchText(tempSearchText);
    setActiveSelectedCategories(tempSelectedCategories);
    setActiveMinPrice(tempMinPrice);
    setActiveMaxPrice(tempMaxPrice);
    setActiveSortOrder(tempSortOrder);
    setFilterModalVisible(false);
  }, [tempSearchText, tempSelectedCategories, tempMinPrice, tempMaxPrice, tempSortOrder]);

  const resetFiltersAndSort = useCallback(() => {
    setTempSearchText('');
    setTempSelectedCategories([]);
    setTempMinPrice(minProductPriceRef.current);
    setTempMaxPrice(maxProductPriceRef.current);
    setTempSortOrder('default');

    setActiveSearchText('');
    setActiveSelectedCategories([]);
    setActiveMinPrice(minProductPriceRef.current);
    setActiveMaxPrice(maxProductPriceRef.current);
    setActiveSortOrder('default');

    setFilterModalVisible(false);
  }, []);

  const openFilterModal = useCallback(() => {
    setTempSearchText(activeSearchText);
    setTempSelectedCategories(activeSelectedCategories);
    setTempMinPrice(activeMinPrice);
    setTempMaxPrice(activeMaxPrice);
    setTempSortOrder(activeSortOrder);
    setFilterModalVisible(true);
  }, [activeSearchText, activeSelectedCategories, activeMinPrice, activeMaxPrice, activeSortOrder]);

  // --- Render Functions ---
  const renderProductItem = useCallback(({ item }) => (
    <View style={styles.productCard}>
      <Text style={styles.productTitle}>{item.title}</Text>
      <Text style={styles.productCategory}>Category: {item.category || 'N/A'}</Text>
      <Text style={styles.productPrice}>${item.price?.toFixed(2) || 'N/A'}</Text>
      <Text numberOfLines={2} style={styles.productDescription}>{item.description}</Text>
    </View>
  ), []);

  const keyExtractor = useCallback((item, index) => `${item.id}-${index}-${item.title}`, []);

  const renderListFooter = () => {
    if (!loadingMore && !hasMorePages) return null; // No loader if no more pages and not currently loading
    if (!loadingMore && hasMorePages) return null; // Only show loader if actively loading
    if (loadingMore) { // Actively loading
      return (
        <View style={styles.footerLoader}>
          <ActivityIndicator size="small" color="#007bff" />
          <Text style={styles.footerText}>Loading more products...</Text>
        </View>
      );
    }
    return null;
  };

  if (loadingInitial && allOriginalProducts.length === 0) {
    return (
      <SafeAreaView style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading initial data...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.centeredContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={handleRefresh} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Complex Product List</Text>
        <TouchableOpacity onPress={openFilterModal} style={styles.filterIcon}>
          <Ionicons name="options-outline" size={24} color="#007bff" />
        </TouchableOpacity>
      </View>

      <Text style={styles.resultsCount}>
        Displaying {displayProducts.length} of {processedProducts.length} filtered products
      </Text>
      <FlatList
        data={displayProducts}
        renderItem={renderProductItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.flatListContent}
        onEndReached={hasMorePages ? loadMoreProducts : null} // Only call if hasMorePages is true
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderListFooter}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#007bff"
            colors={['#007bff']}
          />
        }
        ListEmptyComponent={() => (
          !loadingInitial && !refreshing && !loadingMore && displayProducts.length === 0 && (
            <View style={styles.noResultsContainer}>
              <Text style={styles.noResultsText}>No products match your current filters.</Text>
            </View>
          )
        )}
      />

      {/* Filter/Sort Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={isFilterModalVisible}
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filter & Sort</Text>
            <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
              <Ionicons name="close-circle-outline" size={28} color="#999" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalContent}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search by title or description..."
              value={tempSearchText}
              onChangeText={setTempSearchText}
              clearButtonMode="while-editing"
              placeholderTextColor="#888"
            />

            <MultiSelectFilter
              label="Filter by Categories"
              options={allCategories}
              selectedValues={tempSelectedCategories}
              onValueChange={setTempSelectedCategories}
            />

            <View style={styles.priceFilterContainer}>
              <Text style={styles.groupLabel}>Price Range:</Text>
              <View style={styles.priceDisplay}>
                <Text>${tempMinPrice.toFixed(0)}</Text>
                <Text style={styles.priceSeparator}>-</Text>
                <Text>${tempMaxPrice.toFixed(0)}</Text>
              </View>
              <View style={styles.twoSliderContainer}>
                <View style={styles.sliderWrapper}>
                  <Text style={styles.sliderLabel}>Min Price:</Text>
                  <Slider
                    style={styles.slider}
                    minimumValue={minProductPriceRef.current}
                    maximumValue={maxProductPriceRef.current}
                    step={1}
                    value={tempMinPrice}
                    onValueChange={setTempMinPrice}
                    minimumTrackTintColor="#007bff"
                    maximumTrackTintColor="#d3d3d3"
                    thumbTintColor={Platform.OS === 'ios' ? '#007bff' : '#007bff'}
                  />
                  <Text style={styles.sliderValue}>${tempMinPrice.toFixed(0)}</Text>
                </View>
                <View style={styles.sliderWrapper}>
                  <Text style={styles.sliderLabel}>Max Price:</Text>
                  <Slider
                    style={styles.slider}
                    minimumValue={minProductPriceRef.current}
                    maximumValue={maxProductPriceRef.current}
                    step={1}
                    value={tempMaxPrice}
                    onValueChange={setTempMaxPrice}
                    minimumTrackTintColor="#007bff"
                    maximumTrackTintColor="#d3d3d3"
                    thumbTintColor={Platform.OS === 'ios' ? '#007bff' : '#007bff'}
                  />
                  <Text style={styles.sliderValue}>${tempMaxPrice.toFixed(0)}</Text>
                </View>
              </View>
            </View>

            <View style={styles.sortContainer}>
              <Text style={styles.groupLabel}>Sort By:</Text>
              <View style={styles.sortOptions}>
                {SORT_OPTIONS.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.sortOptionButton,
                      tempSortOrder === option.value && styles.selectedSortOption,
                    ]}
                    onPress={() => setTempSortOrder(option.value)}
                  >
                    <Text
                      style={[
                        styles.sortOptionText,
                        tempSortOrder === option.value && styles.selectedSortOptionText,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>
          <View style={styles.modalFooter}>
            <TouchableOpacity onPress={resetFiltersAndSort} style={[styles.modalButton, styles.resetButton]}>
              <Text style={styles.buttonText}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={applyFiltersAndSort} style={[styles.modalButton, styles.applyButton]}>
              <Text style={styles.buttonText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

// ... (Styles remain the same)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: Platform.OS === 'android' ? 10 : 0, // SafeAreaView will handle iOS top
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
  retryButton: {
    marginTop: 20,
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
    minHeight: 200,
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
    alignItems: 'center',
  },
  priceSeparator: {
    fontSize: 14,
    color: '#666',
    marginHorizontal: 5,
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
    justifyContent: 'flex-start',
  },
  sortOptionButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
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

export default ProductListWithComplexFiltersAndPagination;