import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Image, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Assuming you have react-native-vector-icons installed

// To install react-native-vector-icons:
// npm install react-native-vector-icons
// npx react-native link react-native-vector-icons
// Then follow post-installation steps for iOS/Android in their README.md

const LogicalOperatorsExamples = () => {
  // State for Logical AND (&&) examples
  const [showContent, setShowContent] = useState(true);
  const [userLoggedIn, setUserLoggedIn] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const [loadingData, setLoadingData] = useState(true);

  // State for Logical OR (||) examples
  const [userName, setUserName] = useState(''); // Will be empty initially
  const [profilePicUrl, setProfilePicUrl] = useState(''); // Will be empty initially
  const [userSettings, setUserSettings] = useState(null); // Null initially

  // State for Logical NOT (!) examples
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setLoadingData(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleAddToCart = useCallback(() => {
    setCartCount(prevCount => prevCount + 1);
  }, []);

  const clearCart = useCallback(() => {
    setCartCount(0);
  }, []);

  const toggleLogin = useCallback(() => {
    setUserLoggedIn(prev => !prev);
    setUserName(prev => prev ? '' : 'John Doe'); // Set name when logging in
  }, []);

  const toggleProfilePic = useCallback(() => {
    setProfilePicUrl(prev => prev ? '' : 'https://via.placeholder.com/150/007bff/FFFFFF?text=User');
  }, []);

  const toggleAdminStatus = useCallback(() => {
    setIsAdmin(prev => !prev);
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.mainHeader}>Logical Operators (`&&`, `||`, `!`) Examples</Text>
      <Text style={styles.description}>
        Observe how UI elements and values change based on conditions.
      </Text>

      {/* --- 1. Logical AND (&&) for Conditional Rendering --- */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>1. Logical AND (`&&`)</Text>
        <Text style={styles.subSubHeader}>1.1: Render if true (simple visibility)</Text>
        <View style={styles.exampleContainer}>
          {showContent && <Text style={styles.content}>This text appears because `showContent` is true.</Text>}
          <TouchableOpacity
            style={styles.toggleButton}
            onPress={() => setShowContent(!showContent)}
          >
            <Text style={styles.buttonText}>{showContent ? 'Hide Content' : 'Show Content'}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.subSubHeader}>1.2: Render based on user authentication</Text>
        <View style={styles.exampleContainer}>
          {userLoggedIn && (
            <View>
              <Text style={styles.content}>Welcome, {userName || 'Guest'}!</Text>
              <Text style={styles.subContent}>You have access to exclusive features.</Text>
            </View>
          )}
          <TouchableOpacity
            style={styles.toggleButton}
            onPress={toggleLogin}
          >
            <Text style={styles.buttonText}>{userLoggedIn ? 'Logout' : 'Login'}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.subSubHeader}>1.3: Render badge/indicator when count > 0</Text>
        <View style={styles.exampleContainer}>
          <View style={styles.iconContainer}>
            <Icon name="shopping-cart" size={40} color="#007bff" />
            {cartCount > 0 && ( // Renders only if cartCount is positive
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{cartCount}</Text>
              </View>
            )}
          </View>
          <TouchableOpacity style={styles.toggleButton} onPress={handleAddToCart}>
            <Text style={styles.buttonText}>Add to Cart</Text>
          </TouchableOpacity>
          {cartCount > 0 && ( // Renders only if cartCount is positive
            <TouchableOpacity style={[styles.toggleButton, styles.clearButton]} onPress={clearCart}>
              <Text style={styles.buttonText}>Clear Cart</Text>
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.subSubHeader}>1.4: Render content after loading</Text>
        <View style={styles.exampleContainer}>
          {loadingData && <ActivityIndicator size="large" color="#0000ff" />}
          {!loadingData && <Text style={styles.content}>Data loaded successfully!</Text>}
        </View>
      </View>

      {/* --- 2. Logical OR (||) for Default Values / Fallbacks --- */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>2. Logical OR (`||`)</Text>

        <Text style={styles.subSubHeader}>2.1: Default user name/display name</Text>
        <View style={styles.exampleContainer}>
          <Text style={styles.content}>Display Name: {userName || 'Guest User'}</Text>
          <TouchableOpacity style={styles.toggleButton} onPress={toggleLogin}>
            <Text style={styles.buttonText}>{userName ? 'Clear Name' : 'Set Name (Login)'}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.subSubHeader}>2.2: Fallback for missing images</Text>
        <View style={styles.exampleContainer}>
          <Image
            source={{ uri: profilePicUrl || 'https://via.placeholder.com/150/cccccc/000000?text=No+Pic' }}
            style={styles.profileImage}
          />
          <TouchableOpacity style={styles.toggleButton} onPress={toggleProfilePic}>
            <Text style={styles.buttonText}>{profilePicUrl ? 'Remove Pic' : 'Set Pic'}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.subSubHeader}>2.3: Providing default for potentially null/undefined objects</Text>
        <View style={styles.exampleContainer}>
          <Text style={styles.content}>
            User Theme: {(userSettings && userSettings.theme) || 'default_theme_fallback'}
            {/* Shorter alternative for nullish coalescing (??) but || works for any falsy value */}
          </Text>
          <TouchableOpacity style={styles.toggleButton} onPress={() => setUserSettings({ theme: 'custom' })}>
            <Text style={styles.buttonText}>Set Custom Theme</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.toggleButton, styles.clearButton]} onPress={() => setUserSettings(null)}>
            <Text style={styles.buttonText}>Clear Settings</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* --- 3. Logical NOT (!) for Negation / Toggling --- */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>3. Logical NOT (`!`)</Text>

        <Text style={styles.subSubHeader}>3.1: Toggling boolean states</Text>
        <View style={styles.exampleContainer}>
          <Text style={styles.content}>Dark Mode is: {isDarkMode ? 'ON' : 'OFF'}</Text>
          <TouchableOpacity style={styles.toggleButton} onPress={() => setIsDarkMode(!isDarkMode)}>
            <Text style={styles.buttonText}>Toggle Dark Mode</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.subSubHeader}>3.2: Conditional rendering based on negation</Text>
        <View style={styles.exampleContainer}>
          {/* Render this only if user is NOT an admin */}
          {!isAdmin && (
            <Text style={styles.content}>You are a regular user. Admin features are locked.</Text>
          )}
          {/* Render this only if user IS an admin */}
          {isAdmin && (
            <Text style={styles.content}>Welcome, Admin! You have full access.</Text>
          )}
          <TouchableOpacity style={styles.toggleButton} onPress={toggleAdminStatus}>
            <Text style={styles.buttonText}>{isAdmin ? 'Revoke Admin' : 'Grant Admin'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ height: 50 }} />{/* Spacer at bottom */}
    </ScrollView>
  );
};

// --- Styles ---
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
  content: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  subContent: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  toggleButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 5,
  },
  clearButton: {
    backgroundColor: '#dc3545',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: '40%', // Adjust positioning based on icon size
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
});

export default LogicalOperatorsExamples;