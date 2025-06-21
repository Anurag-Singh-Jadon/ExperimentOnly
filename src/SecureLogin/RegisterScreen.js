// src/screens/RegisterScreen.js

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
import { registerUser, checkEmailAvailability } from '../api/fakeApi'; // Import from fake API service

const RegisterScreen = ({ navigation, onAuthSuccess }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [generalError, setGeneralError] = useState('');

  const [loading, setLoading] = useState(false);
  const [emailChecking, setEmailChecking] = useState(false);

  // --- Client-Side Validation ---
  const validateForm = () => {
    let isValid = true;

    // Reset previous errors
    setUsernameError('');
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');
    setGeneralError('');

    // Username Validation
    if (!username.trim()) {
      setUsernameError('Username is required.');
      isValid = false;
    } else if (username.length < 3) {
      setUsernameError('Username must be at least 3 characters.');
      isValid = false;
    }

    // Email Validation (basic sync check)
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
    } else if (password.length < 8) { // Stronger min length for registration
      setPasswordError('Password must be at least 8 characters.');
      isValid = false;
    } else if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password) || !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      setPasswordError('Password must include uppercase, lowercase, number, and special character.');
      isValid = false;
    }

    // Confirm Password Validation
    if (!confirmPassword.trim()) {
      setConfirmPasswordError('Confirm password is required.');
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match.');
      isValid = false;
    }

    return isValid;
  };

  // --- Debounced Email Availability Check (Async Validation) ---
  const handleEmailChange = async (text) => {
    setEmail(text);
    if (text.trim() && EmailValidator.validate(text)) {
      setEmailChecking(true);
      const isAvailable = await checkEmailAvailability(text); // Debounced call
      setEmailChecking(false);
      if (!isAvailable) {
        setEmailError('This email is already registered.');
      } else {
        setEmailError(''); // Clear if email becomes available
      }
    } else if (!text.trim()) {
      setEmailError('Email is required.');
      setEmailChecking(false);
    } else if (!EmailValidator.validate(text)) {
      setEmailError('Invalid email format.');
      setEmailChecking(false);
    } else {
      setEmailError('');
    }
  };

  // --- Handle Registration Submission ---
  const handleRegister = async () => {
    // First, perform client-side validation
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please correct the errors in the form.');
      return;
    }

    // Also check if async email validation is still pending or failed
    if (emailChecking || emailError) {
      Alert.alert('Validation Error', 'Please wait for email check or fix email errors.');
      return;
    }

    setLoading(true); // Show loading indicator
    setGeneralError(''); // Clear any previous general errors

    // Call the fake API registration function
    const result = await registerUser(username, email, password);

    setLoading(false); // Hide loading indicator

    if (result.success) {
      Alert.alert('Registration Successful', 'Your account has been created!');
      onAuthSuccess(); // Notify App.js to change navigation state
    } else {
      // Display error message from fake API
      setGeneralError(result.error || 'An unexpected error occurred during registration.');
      Alert.alert('Registration Failed', result.error || 'Please try again.');
    }
  };

  const isFormInvalid =
    usernameError ||
    emailError ||
    passwordError ||
    confirmPasswordError ||
    generalError ||
    loading ||
    emailChecking ||
    !username.trim() || // Also disable if fields are empty
    !email.trim() ||
    !password.trim() ||
    !confirmPassword.trim();

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Text style={styles.title}>Join Us!</Text>
      <Text style={styles.subtitle}>Create your new account</Text>

      {/* Username Input */}
      <TextInput
        style={[styles.input, usernameError && styles.inputError]}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        onBlur={validateForm}
      />
      {usernameError ? <Text style={styles.errorText}>{usernameError}</Text> : null}

      {/* Email Input */}
      <TextInput
        style={[styles.input, emailError && styles.inputError]}
        placeholder="Email"
        value={email}
        onChangeText={handleEmailChange} // Use custom handler for debouncing
        keyboardType="email-address"
        autoCapitalize="none"
        onBlur={validateForm}
      />
      {emailChecking ? (
        <ActivityIndicator size="small" color="#3498db" style={styles.emailCheckIndicator} />
      ) : emailError ? (
        <Text style={styles.errorText}>{emailError}</Text>
      ) : null}

      {/* Password Input */}
      <TextInput
        style={[styles.input, passwordError && styles.inputError]}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        onBlur={validateForm}
      />
      {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

      {/* Confirm Password Input */}
      <TextInput
        style={[styles.input, confirmPasswordError && styles.inputError]}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        onBlur={validateForm}
      />
      {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}

      {/* General API Error */}
      {generalError ? <Text style={styles.errorText}>{generalError}</Text> : null}

      {/* Register Button */}
      <TouchableOpacity
        style={[styles.button, isFormInvalid && styles.buttonDisabled]}
        onPress={handleRegister}
        disabled={isFormInvalid}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Register</Text>
        )}
      </TouchableOpacity>

      {/* Link to Login */}
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.linkText}>Already have an account? <Text style={styles.linkTextHighlight}>Login here</Text></Text>
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
    backgroundColor: '#e8f4f8',
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
    borderColor: '#e74c3c',
    borderWidth: 2,
  },
  button: {
    width: '100%',
    height: 55,
    backgroundColor: '#2ecc71', // Green for register
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
    shadowColor: '#2ecc71',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonDisabled: {
    backgroundColor: '#a6e2bd',
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
  emailCheckIndicator: {
    alignSelf: 'flex-start',
    marginLeft: '5%',
    marginBottom: 8,
  },
  linkText: {
    marginTop: 30,
    color: '#7f8c8d',
    fontSize: 15,
  },
  linkTextHighlight: {
    color: '#2ecc71',
    fontWeight: 'bold',
  },
});

export default RegisterScreen;