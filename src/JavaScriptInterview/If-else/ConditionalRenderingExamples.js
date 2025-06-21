import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, ActivityIndicator, Image, Alert, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Optional, if installed

const USER_ROLES = {
  GUEST: 'guest',
  USER: 'user',
  PREMIUM_USER: 'premium',
  ADMIN: 'admin',
};

const ConditionalRenderingExamples = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(USER_ROLES.GUEST); // Default guest
  const [notificationCount, setNotificationCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [apiStatus, setApiStatus] = useState('idle'); // 'idle', 'success', 'error'
  const [userAge, setUserAge] = useState('');

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Simulate a user being logged in as an admin for initial state
      setIsLoggedIn(true);
      setUserRole(USER_ROLES.ADMIN);
      setNotificationCount(5);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Simulate API call based on search query
  useEffect(() => {
    if (searchQuery.length > 2) {
      setApiStatus('loading');
      const apiTimer = setTimeout(() => {
        if (searchQuery.includes('error')) {
          setApiStatus('error');
        } else {
          setApiStatus('success');
        }
      }, 1000);
      return () => clearTimeout(apiTimer);
    } else {
      setApiStatus('idle');
    }
  }, [searchQuery]);

  // --- Helper function for dynamic role setting ---
  const changeUserRole = (role) => {
    setUserRole(role);
    setIsLoggedIn(role !== USER_ROLES.GUEST); // If not guest, assume logged in
    Alert.alert("Role Changed", `User role set to: ${role}`);
  };

  // --- High-Level Example 1: Basic If-Else for Loading State ---
  if (isLoading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Loading application data...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.mainHeader}>Conditional Rendering with `if-else`</Text>
      <Text style={styles.description}>
        Control UI display based on logic.
      </Text>

      {/* --- High-Level Example 2: If-Else for Authentication State --- */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>2. Authentication State</Text>
        {isLoggedIn ? (
          <View style={styles.loggedInBox}>
            <Icon name="check-circle" size={30} color="#28a745" />
            <Text style={styles.loggedInText}>You are logged in!</Text>
            <Button title="Logout" onPress={() => setIsLoggedIn(false)} color="#dc3545" />
          </View>
        ) : (
          <View style={styles.loggedOutBox}>
            <Icon name="account-circle" size={30} color="#6c757d" />
            <Text style={styles.loggedOutText}>Please log in to continue.</Text>
            <Button title="Login" onPress={() => setIsLoggedIn(true)} />
          </View>
        )}
      </View>

      {/* --- High-Level Example 3: Nested If-Else for User Roles & Permissions --- */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>3. Nested If-Else: User Roles & Permissions</Text>
        {/* Render buttons to change roles */}
        <View style={styles.roleButtons}>
          {Object.values(USER_ROLES).map(role => (
            <Button
              key={role}
              title={role.toUpperCase()}
              onPress={() => changeUserRole(role)}
              color={userRole === role ? '#007bff' : '#6c757d'}
            />
          ))}
        </View>

        <View style={styles.permissionBox}>
          {isLoggedIn ? ( // Outer if: Check if logged in
            <View>
              <Text style={styles.currentRoleText}>Current Role: {userRole.toUpperCase()}</Text>
              {userRole === USER_ROLES.ADMIN ? ( // Nested if-else for ADMIN
                <View style={styles.permissionLevel}>
                  <Icon name="security" size={24} color="#dc3545" />
                  <Text style={styles.permissionText}>Access to Admin Dashboard & User Management</Text>
                </View>
              ) : userRole === USER_ROLES.PREMIUM_USER ? ( // Nested else-if for PREMIUM
                <View style={styles.permissionLevel}>
                  <Icon name="star" size={24} color="#ffc107" />
                  <Text style={styles.permissionText}>Access to Premium Content & Ad-Free Experience</Text>
                </View>
              ) : userRole === USER_ROLES.USER ? ( // Nested else-if for standard USER
                <View style={styles.permissionLevel}>
                  <Icon name="person" size={24} color="#28a745" />
                  <Text style={styles.permissionText}>Basic User Features & Content Access</Text>
                </View>
              ) : ( // Nested else for GUEST (even if logged in somehow, or other undefined role)
                <View style={styles.permissionLevel}>
                  <Icon name="help-outline" size={24} color="#6c757d" />
                  <Text style={styles.permissionText}>Limited Access. Please upgrade your role.</Text>
                </View>
              )}
            </View>
          ) : ( // Outer else: Not logged in
            <View style={styles.permissionLevel}>
              <Icon name="lock" size={24} color="#6c757d" />
              <Text style={styles.permissionText}>Log in to view your permissions.</Text>
            </View>
          )}
        </View>
      </View>

      {/* --- High-Level Example 4: If-Else If-Else for Multiple States (e.g., API Status) --- */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>4. API Status Display (`if-else if-else`)</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Type to trigger API status (e.g., 'data' or 'error')"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {apiStatus === 'loading' ? (
          <View style={styles.apiStatusBox}>
            <ActivityIndicator size="small" color="#007bff" />
            <Text style={styles.apiStatusText}>Fetching data...</Text>
          </View>
        ) : apiStatus === 'success' ? (
          <View style={[styles.apiStatusBox, styles.apiSuccess]}>
            <Icon name="check-circle" size={24} color="#fff" />
            <Text style={[styles.apiStatusText, styles.apiSuccessText]}>Data loaded successfully!</Text>
          </View>
        ) : apiStatus === 'error' ? (
          <View style={[styles.apiStatusBox, styles.apiError]}>
            <Icon name="error" size={24} color="#fff" />
            <Text style={[styles.apiStatusText, styles.apiErrorText]}>Error loading data. Please try again.</Text>
          </View>
        ) : (
          <View style={styles.apiStatusBox}>
            <Text style={styles.apiStatusText}>Enter query to fetch data.</Text>
          </View>
        )}
      </View>

      {/* --- High-Level Example 5: Combining `if-else` with Ternary/Logical AND (`&&`) --- */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>5. Combine `if-else` with Ternary/Logical AND</Text>
        <Text style={styles.subSubHeader}>Notifications:</Text>
        {notificationCount > 0 ? ( // Ternary for conditional text
          <Text style={styles.notificationText}>You have {notificationCount} unread notifications.</Text>
        ) : (
          <Text style={styles.notificationText}>No new notifications.</Text>
        )}
        <Button title="Add Notification" onPress={() => setNotificationCount(prev => prev + 1)} />

        <Text style={styles.subSubHeader}>Profile Avatar (Logical AND):</Text>
        {isLoggedIn && ( // Logical AND for showing component only if true
          <Image
            source={{ uri: 'https://via.placeholder.com/100/FF0000/FFFFFF?text=User' }}
            style={styles.avatar}
          />
        )}
        {!isLoggedIn && (
          <Text style={styles.infoText}>Log in to see your avatar!</Text>
        )}
      </View>

      {/* --- High-Level Example 6: Conditional Styling based on conditions --- */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>6. Conditional Styling</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Enter age (e.g., 17, 25)"
          keyboardType="numeric"
          value={userAge}
          onChangeText={setUserAge}
        />
        <View style={[
          styles.ageBox,
          // If-else-like logic for styling
          userAge === '' ? styles.ageBoxDefault : // Default style
          parseInt(userAge) < 18 ? styles.ageBoxMinor : // If less than 18
          styles.ageBoxAdult // Otherwise (18 or more)
        ]}>
          <Text style={styles.ageText}>
            {userAge === '' ? 'Enter age' : parseInt(userAge) < 18 ? 'Under 18' : 'Adult'}
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
  center: {
    justifyContent: 'center',
    alignItems: 'center',
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
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: '#007bff',
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
  loggedInBox: {
    backgroundColor: '#e6ffe6',
    borderColor: '#28a745',
    borderWidth: 1,
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  loggedInText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#28a745',
    marginVertical: 10,
  },
  loggedOutBox: {
    backgroundColor: '#ffe6e6',
    borderColor: '#dc3545',
    borderWidth: 1,
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  loggedOutText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#dc3545',
    marginVertical: 10,
  },
  roleButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginBottom: 15,
    gap: 5,
  },
  permissionBox: {
    marginTop: 10,
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  currentRoleText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
  },
  permissionLevel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  permissionText: {
    marginLeft: 10,
    fontSize: 15,
    color: '#555',
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
  apiStatusBox: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
  },
  apiStatusText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#555',
    fontWeight: 'bold',
  },
  apiSuccess: {
    backgroundColor: '#28a745',
  },
  apiSuccessText: {
    color: '#fff',
  },
  apiError: {
    backgroundColor: '#dc3545',
  },
  apiErrorText: {
    color: '#fff',
  },
  notificationText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginVertical: 15,
    borderColor: '#007bff',
    borderWidth: 2,
  },
  infoText: {
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center',
  },
  ageBox: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  ageBoxDefault: {
    backgroundColor: '#f0f0f0',
    borderColor: '#ccc',
    borderWidth: 1,
  },
  ageBoxMinor: {
    backgroundColor: '#ffe0e0',
    borderColor: '#dc3545',
    borderWidth: 2,
  },
  ageBoxAdult: {
    backgroundColor: '#e0ffe0',
    borderColor: '#28a745',
    borderWidth: 2,
  },
  ageText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default ConditionalRenderingExamples;