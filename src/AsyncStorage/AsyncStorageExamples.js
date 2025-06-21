import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Button, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define keys for storage to avoid typos
const KEYS = {
  USERNAME: 'username',
  USER_SETTINGS: 'user_settings',
  RECENT_SEARCHES: 'recent_searches',
  LAST_APP_OPEN: 'last_app_open',
};

const AsyncStorageExamples = () => {
  // State for simple string storage
  const [storedUsername, setStoredUsername] = useState('');
  const [inputUsername, setInputUsername] = useState('');
  const [loadingUsername, setLoadingUsername] = useState(true);

  // State for object storage
  const [userPreferences, setUserPreferences] = useState({ theme: 'light', notifications: true });
  const [inputTheme, setInputTheme] = useState('');
  const [loadingPreferences, setLoadingPreferences] = useState(true);

  // State for array storage (recent searches)
  const [recentSearches, setRecentSearches] = useState([]);
  const [newSearchTerm, setNewSearchTerm] = useState('');
  const [loadingSearches, setLoadingSearches] = useState(true);

  // State for multi-get/multi-set demo
  const [loadedMultiData, setLoadedMultiData] = useState({});
  const [loadingMulti, setLoadingMulti] = useState(true);

  // --- High-Level Use 1: Saving & Retrieving Simple String Data ---
  const saveUsername = useCallback(async () => {
    try {
      if (inputUsername.trim() === '') {
        Alert.alert('Error', 'Username cannot be empty!');
        return;
      }
      await AsyncStorage.setItem(KEYS.USERNAME, inputUsername);
      setStoredUsername(inputUsername);
      Alert.alert('Success', `Username "${inputUsername}" saved!`);
      setInputUsername(''); // Clear input
    } catch (e) {
      console.error("Error saving username:", e);
      Alert.alert('Error', 'Failed to save username.');
    }
  }, [inputUsername]);

  const loadUsername = useCallback(async () => {
    try {
      setLoadingUsername(true);
      const value = await AsyncStorage.getItem(KEYS.USERNAME);
      if (value !== null) {
        setStoredUsername(value);
      } else {
        setStoredUsername('No username found');
      }
    } catch (e) {
      console.error("Error loading username:", e);
      setStoredUsername('Error loading username');
    } finally {
      setLoadingUsername(false);
    }
  }, []);

  const removeUsername = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(KEYS.USERNAME);
      setStoredUsername('No username found');
      Alert.alert('Success', 'Username removed!');
    } catch (e) {
      console.error("Error removing username:", e);
      Alert.alert('Error', 'Failed to remove username.');
    }
  }, []);


  // --- High-Level Use 2: Saving & Retrieving Objects (JSON) ---
  const saveUserPreferences = useCallback(async () => {
    try {
      const newPreferences = {
        ...userPreferences,
        theme: inputTheme.toLowerCase() === 'dark' ? 'dark' : 'light',
        // Example: toggle notifications
        notifications: !userPreferences.notifications,
      };
      await AsyncStorage.setItem(KEYS.USER_SETTINGS, JSON.stringify(newPreferences));
      setUserPreferences(newPreferences);
      Alert.alert('Success', `Preferences updated: ${JSON.stringify(newPreferences)}`);
      setInputTheme('');
    } catch (e) {
      console.error("Error saving preferences:", e);
      Alert.alert('Error', 'Failed to save preferences.');
    }
  }, [inputTheme, userPreferences]);

  const loadUserPreferences = useCallback(async () => {
    try {
      setLoadingPreferences(true);
      const jsonValue = await AsyncStorage.getItem(KEYS.USER_SETTINGS);
      // Parse JSON string back to object, provide default if null
      setUserPreferences(jsonValue != null ? JSON.parse(jsonValue) : { theme: 'light', notifications: true });
    } catch (e) {
      console.error("Error loading preferences:", e);
      Alert.alert('Error', 'Failed to load preferences.');
    } finally {
      setLoadingPreferences(false);
    }
  }, []);


  // --- High-Level Use 3: Saving & Retrieving Arrays (JSON) ---
  const addSearchTerm = useCallback(async () => {
    if (newSearchTerm.trim() === '') {
      Alert.alert('Error', 'Search term cannot be empty!');
      return;
    }
    try {
      const updatedSearches = [newSearchTerm.trim(), ...recentSearches.filter(s => s !== newSearchTerm.trim())];
      // Keep only last 5 searches for demo
      const slicedSearches = updatedSearches.slice(0, 5);
      await AsyncStorage.setItem(KEYS.RECENT_SEARCHES, JSON.stringify(slicedSearches));
      setRecentSearches(slicedSearches);
      Alert.alert('Success', `Search term "${newSearchTerm}" added.`);
      setNewSearchTerm('');
    } catch (e) {
      console.error("Error adding search term:", e);
      Alert.alert('Error', 'Failed to add search term.');
    }
  }, [newSearchTerm, recentSearches]);

  const loadRecentSearches = useCallback(async () => {
    try {
      setLoadingSearches(true);
      const jsonValue = await AsyncStorage.getItem(KEYS.RECENT_SEARCHES);
      setRecentSearches(jsonValue != null ? JSON.parse(jsonValue) : []);
    } catch (e) {
      console.error("Error loading searches:", e);
      Alert.alert('Error', 'Failed to load recent searches.');
    } finally {
      setLoadingSearches(false);
    }
  }, []);

  const clearRecentSearches = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(KEYS.RECENT_SEARCHES);
      setRecentSearches([]);
      Alert.alert('Success', 'Recent searches cleared!');
    } catch (e) {
      console.error("Error clearing searches:", e);
      Alert.alert('Error', 'Failed to clear recent searches.');
    }
  }, []);

  // --- High-Level Use 4: Multi-get, Multi-set, Multi-remove (Batch Operations) ---
  const saveMultiData = useCallback(async () => {
    try {
      // Data in format: [[key1, value1], [key2, value2]]
      const dataToSave = [
        ['@multi_key_1', 'Hello from Multi-Set'],
        ['@multi_key_2', JSON.stringify({ item: 'Multi Item', quantity: 10 })],
      ];
      await AsyncStorage.multiSet(dataToSave);
      Alert.alert('Success', 'Two items saved via multiSet.');
    } catch (e) {
      console.error("Error multi-setting data:", e);
      Alert.alert('Error', 'Failed to multi-set data.');
    }
  }, []);

  const loadMultiData = useCallback(async () => {
    try {
      setLoadingMulti(true);
      const keysToLoad = ['@multi_key_1', '@multi_key_2', KEYS.USERNAME]; // Also load username for demo
      const result = await AsyncStorage.multiGet(keysToLoad);
      const parsedData = {};
      result.forEach(([key, value]) => {
        try {
          parsedData[key] = value ? JSON.parse(value) : value; // Attempt to parse JSON
        } catch (e) {
          parsedData[key] = value; // If not JSON, use as string
        }
      });
      setLoadedMultiData(parsedData);
      Alert.alert('Success', 'Multi-Get completed!');
    } catch (e) {
      console.error("Error multi-getting data:", e);
      Alert.alert('Error', 'Failed to multi-get data.');
    } finally {
      setLoadingMulti(false);
    }
  }, []);

  const removeMultiData = useCallback(async () => {
    try {
      const keysToRemove = ['@multi_key_1', '@multi_key_2'];
      await AsyncStorage.multiRemove(keysToRemove);
      setLoadedMultiData({});
      Alert.alert('Success', 'Two items removed via multiRemove.');
    } catch (e) {
      console.error("Error multi-removing data:", e);
      Alert.alert('Error', 'Failed to multi-remove data.');
    }
  }, []);

  // --- High-Level Use 5: Clearing All Data ---
  const clearAllData = useCallback(async () => {
    Alert.alert(
      'Confirm Clear',
      'Are you sure you want to clear ALL data from AsyncStorage?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear All',
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              setStoredUsername('No username found');
              setUserPreferences({ theme: 'light', notifications: true });
              setRecentSearches([]);
              setLoadedMultiData({});
              Alert.alert('Success', 'All AsyncStorage data cleared!');
            } catch (e) {
              console.error("Error clearing all data:", e);
              Alert.alert('Error', 'Failed to clear all data.');
            }
          },
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  }, []);

  // Initial load of all data when component mounts
  useEffect(() => {
    // We can use multiGet to load several keys at once for initial state
    const initialLoad = async () => {
      setLoadingUsername(true);
      setLoadingPreferences(true);
      setLoadingSearches(true);
      setLoadingMulti(true);

      try {
        const keys = [
          KEYS.USERNAME,
          KEYS.USER_SETTINGS,
          KEYS.RECENT_SEARCHES,
          KEYS.LAST_APP_OPEN, // Example of reading a simple key not explicitly managed by UI
          '@multi_key_1', // To check if multi-set data exists
          '@multi_key_2', // To check if multi-set data exists
        ];
        const result = await AsyncStorage.multiGet(keys);

        let usernameValue = 'No username found';
        let userSettingsValue = { theme: 'light', notifications: true };
        let recentSearchesValue = [];
        let multiDataLoaded = {};
        let lastOpenTime = 'Never';

        result.forEach(([key, value]) => {
          switch (key) {
            case KEYS.USERNAME:
              usernameValue = value !== null ? value : 'No username found';
              break;
            case KEYS.USER_SETTINGS:
              userSettingsValue = value != null ? JSON.parse(value) : { theme: 'light', notifications: true };
              break;
            case KEYS.RECENT_SEARCHES:
              recentSearchesValue = value != null ? JSON.parse(value) : [];
              break;
            case KEYS.LAST_APP_OPEN:
              lastOpenTime = value || 'Never';
              break;
            case '@multi_key_1':
            case '@multi_key_2':
              try {
                multiDataLoaded[key] = value ? JSON.parse(value) : value;
              } catch (e) {
                multiDataLoaded[key] = value;
              }
              break;
          }
        });

        setStoredUsername(usernameValue);
        setUserPreferences(userSettingsValue);
        setRecentSearches(recentSearchesValue);
        setLoadedMultiData(multiDataLoaded);

        // Store last app open time
        await AsyncStorage.setItem(KEYS.LAST_APP_OPEN, new Date().toLocaleString());
        Alert.alert('App Init', `Last opened: ${lastOpenTime}`);

      } catch (e) {
        console.error("Error during initial load:", e);
        Alert.alert('Error', 'Failed to load initial data.');
      } finally {
        setLoadingUsername(false);
        setLoadingPreferences(false);
        setLoadingSearches(false);
        setLoadingMulti(false);
      }
    };

    initialLoad();
  }, []); // Run only once on component mount

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.mainHeader}>`AsyncStorage` High-Level Examples</Text>
      <Text style={styles.description}>
        Persist and retrieve data locally. Data remains even after app closes!
      </Text>

      {/* --- 1. Simple String Storage (Username) --- */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>1. String Storage (Username)</Text>
        <View style={styles.exampleContainer}>
          {loadingUsername ? (
            <ActivityIndicator size="small" color="#007bff" />
          ) : (
            <Text style={styles.statusText}>Stored Username: {storedUsername}</Text>
          )}
          <TextInput
            style={styles.textInput}
            placeholder="Enter username"
            value={inputUsername}
            onChangeText={setInputUsername}
          />
          <View style={styles.buttonGroup}>
            <Button title="Save Username" onPress={saveUsername} />
            <Button title="Load Username" onPress={loadUsername} color="#28a745" />
            <Button title="Remove Username" onPress={removeUsername} color="#dc3545" />
          </View>
        </View>
      </View>

      {/* --- 2. Object Storage (User Preferences) --- */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>2. Object Storage (Preferences)</Text>
        <View style={styles.exampleContainer}>
          {loadingPreferences ? (
            <ActivityIndicator size="small" color="#007bff" />
          ) : (
            <>
              <Text style={styles.statusText}>Theme: {userPreferences.theme}</Text>
              <Text style={styles.statusText}>Notifications: {userPreferences.notifications ? 'On' : 'Off'}</Text>
            </>
          )}
          <TextInput
            style={styles.textInput}
            placeholder="Type 'dark' or 'light' for theme"
            value={inputTheme}
            onChangeText={setInputTheme}
          />
          <View style={styles.buttonGroup}>
            <Button title="Save Preferences" onPress={saveUserPreferences} />
            <Button title="Load Preferences" onPress={loadUserPreferences} color="#28a745" />
          </View>
        </View>
      </View>

      {/* --- 3. Array Storage (Recent Searches) --- */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>3. Array Storage (Recent Searches)</Text>
        <View style={styles.exampleContainer}>
          {loadingSearches ? (
            <ActivityIndicator size="small" color="#007bff" />
          ) : (
            <>
              <Text style={styles.statusText}>Recent Searches:</Text>
              {recentSearches.length > 0 ? (
                recentSearches.map((term, index) => (
                  <Text key={index} style={styles.listItemText}>• {term}</Text>
                ))
              ) : (
                <Text style={styles.listItemText}>No recent searches.</Text>
              )}
            </>
          )}
          <TextInput
            style={styles.textInput}
            placeholder="Add search term"
            value={newSearchTerm}
            onChangeText={setNewSearchTerm}
            onSubmitEditing={addSearchTerm}
          />
          <View style={styles.buttonGroup}>
            <Button title="Add Search" onPress={addSearchTerm} />
            <Button title="Load Searches" onPress={loadRecentSearches} color="#28a745" />
            <Button title="Clear Searches" onPress={clearRecentSearches} color="#dc3545" />
          </View>
        </View>
      </View>

      {/* --- 4. Multi-get, Multi-set, Multi-remove (Batch Operations) --- */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>4. Batch Operations (Multi-set/get/remove)</Text>
        <View style={styles.exampleContainer}>
          {loadingMulti ? (
            <ActivityIndicator size="small" color="#007bff" />
          ) : (
            <Text style={styles.statusText}>
              Loaded Multi Data: {JSON.stringify(loadedMultiData, null, 2)}
            </Text>
          )}
          <View style={styles.buttonGroup}>
            <Button title="Multi-Set Data" onPress={saveMultiData} />
            <Button title="Multi-Get Data" onPress={loadMultiData} color="#28a745" />
            <Button title="Multi-Remove Data" onPress={removeMultiData} color="#dc3545" />
          </View>
        </View>
      </View>

      {/* --- 5. Clearing All Data --- */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>5. Clear All Storage</Text>
        <View style={styles.exampleContainer}>
          <Text style={styles.statusText}>
            This will wipe all data stored by your app in AsyncStorage.
          </Text>
          <Button title="CLEAR ALL ASYNCSTORAGE" onPress={clearAllData} color="#e63946" />
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
  exampleContainer: {
    backgroundColor: '#fefefe',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 15,
  },
  statusText: {
    fontSize: 15,
    color: '#555',
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 10,
  },
  listItemText: {
    fontSize: 14,
    color: '#444',
    marginLeft: 10,
    marginBottom: 3,
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
    flexWrap: 'wrap',
    marginTop: 10,
    gap: 10, // For spacing between buttons
  },
});

export default AsyncStorageExamples;