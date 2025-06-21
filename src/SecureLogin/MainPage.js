// App.js

import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Keychain from 'react-native-keychain'; // Secure storage for React Native CLI
import { ActivityIndicator, View, Text, StyleSheet } from 'react-native';

// Import your screens
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';

// Import your fake API logout function
import { logoutUser } from './src/api/fakeApi';

const Stack = createNativeStackNavigator();

// --- Authentication Stack (Login/Register) ---
const AuthStack = ({ onAuthSuccess }) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login">
        {props => <LoginScreen {...props} onAuthSuccess={onAuthSuccess} />}
      </Stack.Screen>
      <Stack.Screen name="Register">
        {props => <RegisterScreen {...props} onAuthSuccess={onAuthSuccess} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

// --- Main Application Stack (Authenticated Screens) ---
const AppStack = () => {
  // HomeScreen handles its own logout, so no prop is needed here directly.
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      {/* Add other authenticated screens here */}
    </Stack.Navigator>
  );
};

// --- Main App Component ---
export default function MainPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Effect to check authentication status on app start
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Attempt to retrieve access token from Keychain
        const credentials = await Keychain.getGenericPassword({ service: 'appAuthTokens' });

        // If credentials exist and the password field (where we store the token) is not empty, user is authenticated
        setIsAuthenticated(!!credentials && !!credentials.password);
      } catch (error) {
        console.error('Failed to check auth status from Keychain:', error);
        setIsAuthenticated(false); // Assume not authenticated on error
      } finally {
        setIsLoading(false); // Stop loading regardless of outcome
      }
    };

    checkAuthStatus();
  }, []); // Runs only once on component mount

  // Callback for successful login/registration
  const handleAuthSuccess = async () => {
    // After login/registration, immediately set isAuthenticated to true.
    // The tokens are already securely stored by fakeApi.js.
    setIsAuthenticated(true);
  };

  // Callback for logout
  // This function needs to clear tokens AND update auth state
  const handleLogout = async () => {
    setIsLoading(true); // Show loading during logout process
    await logoutUser(); // Call the fake API logout (clears tokens from Keychain)
    setIsAuthenticated(false); // Update authentication state
    setIsLoading(false); // Hide loading
  };

  // Show a loading spinner while checking initial authentication status
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Checking authentication...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          // If authenticated, show the main app stack
          <Stack.Screen name="AppRoutes">
            {/* Render AppStack and pass handleLogout down */}
            {props => <AppStack {...props} onLogout={handleLogout} />}
          </Stack.Screen>
        ) : (
          // If not authenticated, show the authentication stack
          <Stack.Screen name="AuthRoutes">
            {/* Render AuthStack and pass handleAuthSuccess down */}
            {props => <AuthStack {...props} onAuthSuccess={handleAuthSuccess} />}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f7fa',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#3498db',
  },
});