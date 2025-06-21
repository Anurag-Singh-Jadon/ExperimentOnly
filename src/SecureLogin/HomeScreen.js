// src/screens/HomeScreen.js

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { getUserProfile, logoutUser } from '../api/fakeApi'; // Import from fake API service

const HomeScreen = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [profileError, setProfileError] = useState('');

  // --- Fetch User Profile on Mount ---
  useEffect(() => {
    const fetchProfile = async () => {
      setLoadingProfile(true);
      setProfileError('');
      const result = await getUserProfile(); // Call fake API to get profile

      if (result.success) {
        setUserData(result.user);
      } else {
        setProfileError(result.error || 'Failed to load profile data.');
        Alert.alert('Profile Load Failed', result.error || 'Please try logging in again.');
        // If profile fails to load after initial auth, it might indicate a token issue.
        // We could force a logout here, but letting the user try again might be better for UX.
      }
      setLoadingProfile(false);
    };

    fetchProfile();
  }, []); // Empty dependency array means this runs once on mount

  // --- Handle Logout ---
  const handleLogout = async () => {
    setLoadingProfile(true); // Show loading while logging out
    await logoutUser(); // Clear tokens from Keychain
    setLoadingProfile(false);
    // After logout, navigation will automatically redirect to AuthStack (handled in App.js)
  };

  if (loadingProfile) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Loading your profile...</Text>
      </View>
    );
  }

  if (profileError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {profileError}</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout & Re-login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, {userData?.username || 'Valued User'}!</Text>
      <Text style={styles.subtitle}>Your Email: {userData?.email || 'N/A'}</Text>
      <Text style={styles.infoText}>You are securely logged in.</Text>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ecf0f1',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ecf0f1',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#3498db',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fbe9e7', // Light red background
  },
  errorText: {
    fontSize: 18,
    color: '#c0392b',
    textAlign: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#2c3e50',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#34495e',
    textAlign: 'center',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  logoutButton: {
    backgroundColor: '#e74c3c', // Red for logout
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    shadowColor: '#e74c3c',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;