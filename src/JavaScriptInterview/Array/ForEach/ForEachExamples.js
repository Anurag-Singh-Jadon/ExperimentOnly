import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, Alert, ActivityIndicator } from 'react-native';

// --- Data for Examples ---
const productRatings = [
  { productId: 'p1', rating: 4.5, reviews: 120 },
  { productId: 'p2', rating: 3.8, reviews: 75 },
  { productId: 'p3', rating: 5.0, reviews: 200 },
  { productId: 'p4', rating: 4.2, reviews: 90 },
];

const userActions = [
  { userId: 'u1', action: 'viewed_profile', timestamp: Date.now() - 3600000 },
  { userId: 'u2', action: 'added_to_cart', timestamp: Date.now() - 1800000 },
  { userId: 'u1', action: 'favorited_item', timestamp: Date.now() - 600000 },
];

const featuresToToggle = [
  { name: 'Dark Mode', key: 'darkMode', enabled: false },
  { name: 'Analytics Tracking', key: 'analytics', enabled: true },
  { name: 'Beta Features', key: 'betaFeatures', enabled: false },
];

const ForEachExamples = () => {
  // State for Example 1: Summing up ratings
  const [totalRatingsSum, setTotalRatingsSum] = useState(0);
  const [totalReviewsCount, setTotalReviewsCount] = useState(0);
  const [averageRating, setAverageRating] = useState(0);

  // State for Example 2: Processing user actions
  const [processedActionsLog, setProcessedActionsLog] = useState([]);
  const [processingStatus, setProcessingStatus] = useState('Idle');

  // State for Example 3: Initializing user settings (conceptually)
  const [appSettings, setAppSettings] = useState({});
  const [settingsInitialized, setSettingsInitialized] = useState(false);

  // --- High-Level Use 1: Aggregating Data / Performing Calculations ---
  // Use useEffect to run this calculation on mount or when productRatings change
  useEffect(() => {
    let sum = 0;
    let reviews = 0;
    productRatings.forEach(item => {
      sum += item.rating;
      reviews += item.reviews;
    });
    setTotalRatingsSum(sum);
    setTotalReviewsCount(reviews);
    setAverageRating(productRatings.length > 0 ? (sum / productRatings.length) : 0);
    console.log("FOREACH: Aggregated product ratings.");
  }, []); // Empty dependency array means runs once on mount

  // --- High-Level Use 2: Iterating and Triggering Side Effects (e.g., logging, API calls) ---
  const processUserActions = useCallback(() => {
    setProcessingStatus('Processing...');
    const log = [];
    let processedCount = 0;

    userActions.forEach((action, index) => {
      // Simulate an asynchronous operation (e.g., sending action to analytics server)
      setTimeout(() => {
        const message = `[${new Date(action.timestamp).toLocaleTimeString()}] User ${action.userId} performed: ${action.action}`;
        log.push(message);
        console.log(`FOREACH: Processing action ${index + 1}: ${message}`);
        processedCount++;
        if (processedCount === userActions.length) {
          setProcessedActionsLog(log);
          setProcessingStatus('Completed');
          Alert.alert('Processing', 'All user actions processed!');
        }
      }, index * 300); // Simulate delay for each action
    });
  }, []);

  // --- High-Level Use 3: Initializing/Updating Non-UI Config/State ---
  useEffect(() => {
    console.log("FOREACH: Initializing app settings...");
    const initialSettings = {};
    featuresToToggle.forEach(feature => {
      initialSettings[feature.key] = feature.enabled;
    });
    setAppSettings(initialSettings);
    setSettingsInitialized(true);
  }, []); // Runs once on mount

  const toggleAppSetting = useCallback((key) => {
    setAppSettings(prevSettings => {
      const newSettings = {
        ...prevSettings,
        [key]: !prevSettings[key],
      };
      console.log(`FOREACH: Toggled setting '${key}' to ${newSettings[key]}`);
      Alert.alert('Setting Toggled', `${key} is now ${newSettings[key] ? 'ON' : 'OFF'}`);
      return newSettings;
    });
  }, []);


  return (
    <ScrollView style={styles.container}>
      <Text style={styles.mainHeader}>`forEach()` High-Level Examples</Text>
      <Text style={styles.description}>
        Iterating over arrays for side effects, calculations, and data processing.
      </Text>

      {/* 1. Aggregating Data / Performing Calculations */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>1. Data Aggregation (Product Ratings)</Text>
        <View style={styles.exampleContainer}>
          <Text style={styles.statusText}>Total Products: {productRatings.length}</Text>
          <Text style={styles.statusText}>Sum of Ratings: {totalRatingsSum.toFixed(2)}</Text>
          <Text style={styles.statusText}>Total Reviews: {totalReviewsCount}</Text>
          <Text style={styles.statusText}>Average Rating: {averageRating.toFixed(2)}</Text>
          <Text style={styles.subContent}>
            (Calculated once on mount using `forEach` in `useEffect`)
          </Text>
        </View>
      </View>

      {/* 2. Iterating and Triggering Side Effects */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>2. Processing User Actions</Text>
        <View style={styles.exampleContainer}>
          <Button title="Process All User Actions" onPress={processUserActions} />
          <Text style={styles.statusText}>Status: {processingStatus}</Text>
          {processingStatus === 'Processing...' && <ActivityIndicator size="small" color="#007bff" />}
          <Text style={styles.subSubHeader}>Processed Log:</Text>
          {processedActionsLog.length > 0 ? (
            processedActionsLog.map((logEntry, index) => (
              <Text key={index} style={styles.listItemText}>• {logEntry}</Text>
            ))
          ) : (
            <Text style={styles.listItemText}>No actions processed yet.</Text>
          )}
          <Text style={styles.subContent}>
            (Each action triggers a simulated async log via `forEach` and `setTimeout`)
          </Text>
        </View>
      </View>

      {/* 3. Initializing/Updating Non-UI Config/State */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>3. App Settings Initialization</Text>
        <View style={styles.exampleContainer}>
          {settingsInitialized ? (
            <>
              <Text style={styles.statusText}>Current App Settings:</Text>
              {Object.entries(appSettings).map(([key, value]) => (
                <View key={key} style={styles.settingRow}>
                  <Text style={styles.settingText}>{key}:</Text>
                  <Text style={styles.settingValue}>{value ? 'Enabled' : 'Disabled'}</Text>
                  <Button title={value ? "Disable" : "Enable"} onPress={() => toggleAppSetting(key)} />
                </View>
              ))}
            </>
          ) : (
            <ActivityIndicator size="small" color="#007bff" />
          )}
          <Text style={styles.subContent}>
            (Settings initialized from array using `forEach` on mount. Individual toggles use `useState`.)
          </Text>
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
  subContent: {
    fontSize: 13,
    color: '#888',
    textAlign: 'center',
    marginTop: 5,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    flex: 2,
  },
  settingValue: {
    fontSize: 16,
    color: '#666',
    flex: 1,
    textAlign: 'right',
    marginRight: 10,
  },
});

export default ForEachExamples;