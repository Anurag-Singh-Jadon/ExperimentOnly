// src/api/fakeApi.js

import * as Keychain from 'react-native-keychain';
import debounce from 'lodash.debounce';

// --- Simulate Database (In-Memory) ---
// IMPORTANT: Data stored here is VOLATILE and will reset on app restart.
// In a real application, this would be a persistent database (e.g., MongoDB, PostgreSQL).
const users = []; // Stores { id, username, email, password }
let nextUserId = 1;

// --- Helper to simulate network delay ---
const simulateNetworkDelay = (ms = 1000) => new Promise(resolve => setTimeout(resolve, ms));

// --- Fake Authentication Functions ---


export const loginUser = async (email, password) => {
  await simulateNetworkDelay(1500); // Simulate network latency

  const user = users.find(u => u.email === email);

  if (!user) {
    return { success: false, error: 'Invalid credentials. User not found.' };
  }

  // In a real backend, you'd compare hashed passwords (e.g., bcrypt.compare)
  if (user.password !== password) { // Simple string comparison for fake API
    return { success: false, error: 'Invalid credentials. Incorrect password.' };
  }

  // Simulate JWT token generation
  const fakeAccessToken = `fake_jwt_access_token_user_${user.id}_${Date.now()}`;
  const fakeRefreshToken = `fake_jwt_refresh_token_user_${user.id}_${Date.now()}`;

  // Store tokens securely on the device using react-native-keychain
  try {
    // For Keychain, we store a 'username' (which is just a key name) and the actual token as 'password'
    await Keychain.setGenericPassword('accessToken', fakeAccessToken, { service: 'appAuthTokens' });
    await Keychain.setGenericPassword('refreshToken', fakeRefreshToken, { service: 'appAuthTokens' });
    console.log('Tokens stored in Keychain (fake login)');
  } catch (e) {
    console.error("Failed to store tokens in Keychain:", e);
    return { success: false, error: 'Client storage error during login.' };
  }

  // Return limited user data (never send password or sensitive internal data to client)
  return {
    success: true,
    user: { id: user.id, username: user.username, email: user.email }
  };
};


export const registerUser = async (username, email, password) => {
  await simulateNetworkDelay(2000); // Simulate longer registration process

  if (users.some(u => u.email === email)) {
    return { success: false, error: 'This email is already registered.' };
  }
  if (users.some(u => u.username === username)) {
    return { success: false, error: 'This username is already taken.' };
  }

  const newUser = { id: nextUserId++, username, email, password }; // Store plain password (for fake API)
  users.push(newUser);
  console.log('Registered new user (fake):', newUser);

  // Simulate JWT token generation for new user
  const fakeAccessToken = `fake_jwt_access_token_user_${newUser.id}_${Date.now()}`;
  const fakeRefreshToken = `fake_jwt_refresh_token_user_${newUser.id}_${Date.now()}`;

  // Store tokens securely on the device
  try {
    await Keychain.setGenericPassword('accessToken', fakeAccessToken, { service: 'appAuthTokens' });
    await Keychain.setGenericPassword('refreshToken', fakeRefreshToken, { service: 'appAuthTokens' });
    console.log('Tokens stored in Keychain (fake registration)');
  } catch (e) {
    console.error("Failed to store tokens in Keychain:", e);
    return { success: false, error: 'Client storage error during registration.' };
  }

  return {
    success: true,
    user: { id: newUser.id, username: newUser.username, email: newUser.email }
  };
};


export const checkEmailAvailability = debounce(async (email) => {
  await simulateNetworkDelay(500); // Quick check
  return !users.some(u => u.email === email);
}, 500); // Debounce to prevent excessive checks

/**
 * Simulates user logout. Clears tokens from device.
 * @returns {Promise<void>}
 */
export const logoutUser = async () => {
  await simulateNetworkDelay(300); // Simulate quick logout process
  try {
    await Keychain.resetGenericPassword({ service: 'appAuthTokens' }); // Clear all credentials under this service
    console.log('Tokens cleared from Keychain (fake logout)');
  } catch (e) {
    console.error("Error clearing tokens from Keychain:", e);
  }
};

/**
 * Simulates fetching user profile (requires a "token").
 * @returns {Promise<{success: boolean, user?: object, error?: string}>}
 */
export const getUserProfile = async () => {
  await simulateNetworkDelay(700); // Simulate network delay for profile fetch

  try {
    // Retrieve the fake access token from Keychain
    const credentials = await Keychain.getGenericPassword({ service: 'appAuthTokens' });

    if (!credentials || !credentials.password) {
      return { success: false, error: 'Unauthorized: No access token found.' };
    }

    const fakeAccessToken = credentials.password;

    // In a real app, you'd send this token to your backend,
    // and the backend would validate it and return the user profile.
    // Here, we'll parse the user ID from our fake token.
    const userIdMatch = fakeAccessToken.match(/_user_(\d+)_/);
    const userId = userIdMatch ? parseInt(userIdMatch[1]) : null;

    if (!userId) {
      return { success: false, error: 'Unauthorized: Invalid token format.' };
    }

    const user = users.find(u => u.id === userId);

    if (user) {
      // Return a subset of user data, never the password!
      return { success: true, user: { id: user.id, username: user.username, email: user.email } };
    } else {
      return { success: false, error: 'User not found in fake database.' };
    }
  } catch (e) {
    console.error("Error fetching profile (fake):", e);
    return { success: false, error: 'Error fetching profile data.' };
  }
};