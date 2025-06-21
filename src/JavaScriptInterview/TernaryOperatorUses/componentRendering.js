import React, { useState } from 'react';
import { View, Text, ActivityIndicator, Button, Image, StyleSheet } from 'react-native';

export const ConditionalRenderingExample = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasNewMessages, setHasNewMessages] = useState(true);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Conditional Rendering</Text>

      {/* High-Level Use 1.1: Show Loader or Content */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Loading State:</Text>
        {isLoading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <Text style={styles.content}>Data has loaded!</Text>
        )}
      </View>

      {/* High-Level Use 1.2: Authenticated vs. Guest View */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Authentication State:</Text>
        {isLoggedIn ? (
          <View>
            <Text style={styles.content}>Welcome, User!</Text>
            <Button title="Logout" onPress={() => setIsLoggedIn(false)} />
          </View>
        ) : (
          <View>
            <Text style={styles.content}>Please log in.</Text>
            <Button title="Login" onPress={() => setIsLoggedIn(true)} />
          </View>
        )}
      </View>

      {/* High-Level Use 1.3: Show/Hide Elements (e.g., Badge) */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Message Badge:</Text>
        <View style={styles.iconContainer}>
          <Image source={{ uri: 'https://via.placeholder.com/50?text=Mail' }} style={styles.icon} />
          {hasNewMessages ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>3</Text>
            </View>
          ) : null}
        </View>
        <Button
          title={hasNewMessages ? "Mark as Read" : "New Message"}
          onPress={() => setHasNewMessages(!hasNewMessages)}
        />
      </View>
    </View>
  );
};