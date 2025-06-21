// src/screens/LoginScreen.js

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import * as EmailValidator from 'email-validator';
import { loginUser } from '../api/fakeApi'; // Import from fake API service

const LoginScreen = ({ navigation, onAuthSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');

  // --- Client-Side Validation ---
  const validateForm = () => {
    let isValid = true;

    // Reset previous errors
    setEmailError('');
    setPasswordError('');
    setGeneralError('');

    // Email Validation
    if (!email.trim()) {
      setEmailError('Email is required.');
      isValid = false;
    } else if (!EmailValidator.validate(email)) {
      setEmailError('Invalid email format.');
      isValid = false;
    }

    // Password Validation
    if (!password.trim()) {
      setPasswordError('Password is required.');
      isValid = false;
    } else if (password.length < 6) { // Minimum length for UX hint
      setPasswordError('Password must be at least 6 characters.');
      isValid = false;
    }

    return isValid;
  };

  // --- Handle Login Submission ---
  const handleLogin = async () => {
    // First, perform client-side validation
    if (!validateForm()) {
      return; // Stop if validation fails
    }

    setLoading(true); // Show loading indicator
    setGeneralError(''); // Clear any previous general errors

    // Call the fake API login function
    const result = await loginUser(email, password);

    setLoading(false); // Hide loading indicator

    if (result.success) {
      Alert.alert('Login Successful', 'Welcome back!');
      onAuthSuccess(); // Notify App.js to change navigation state
    } else {
      // Display error message from fake API
      setGeneralError(result.error || 'An unexpected error occurred during login.');
      Alert.alert('Login Failed', result.error || 'Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Text style={styles.title}>Welcome Back!</Text>
      <Text style={styles.subtitle}>Sign in to continue</Text>

      {/* Email Input */}
      <TextInput
        style={[styles.input, emailError && styles.inputError]}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        onBlur={validateForm} // Validate on blur
      />
      {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

      {/* Password Input */}
      <TextInput
        style={[styles.input, passwordError && styles.inputError]}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry // Hides password characters
        onBlur={validateForm} // Validate on blur
      />
      {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

      {/* General API Error */}
      {generalError ? <Text style={styles.errorText}>{generalError}</Text> : null}

      {/* Login Button */}
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={loading} // Disable button while loading
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>

      {/* Link to Registration */}
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.linkText}>Don't have an account? <Text style={styles.linkTextHighlight}>Register here</Text></Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 25,
    backgroundColor: '#f5f7fa',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2c3e50',
  },
  subtitle: {
    fontSize: 18,
    color: '#7f8c8d',
    marginBottom: 40,
  },
  input: {
    width: '100%',
    height: 55,
    borderColor: '#dcdcdc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 18,
    marginBottom: 10,
    backgroundColor: '#ffffff',
    fontSize: 16,
    color: '#34495e',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  inputError: {
    borderColor: '#e74c3c', // Red border for error
    borderWidth: 2,
  },
  button: {
    width: '100%',
    height: 55,
    backgroundColor: '#3498db',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
    shadowColor: '#3498db',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonDisabled: {
    backgroundColor: '#9ad3f6',
  },
  buttonText: {
    color: '#fff',
    fontSize: 19,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#e74c3c',
    marginBottom: 8,
    alignSelf: 'flex-start',
    marginLeft: '5%',
    fontSize: 13,
    fontWeight: '500',
  },
  linkText: {
    marginTop: 30,
    color: '#7f8c8d',
    fontSize: 15,
  },
  linkTextHighlight: {
    color: '#3498db',
    fontWeight: 'bold',
  },
});

export default LoginScreen;