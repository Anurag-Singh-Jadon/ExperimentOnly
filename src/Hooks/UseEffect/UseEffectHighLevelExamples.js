import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Button,
  Alert,
  Keyboard,
  AppState,
  Dimensions,
} from 'react-native';

const UseEffectHighLevelExamples = () => {
  // State for Data Fetching Example
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for Subscription/Event Listener Example
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [appState, setAppState] = useState(AppState.currentState);

  // State for Dependency Array Example
  const [query, setQuery] = useState('react');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  // State for Cleanup Example
  const [timerCount, setTimerCount] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);

  // State for Direct Native Interaction (Conceptual)
  const myViewRef = useRef(null);
  const [viewColor, setViewColor] = useState('lightblue');

  // --- 1. Data Fetching on Component Mount (Empty Dependency Array) ---
  useEffect(() => {
    console.log("EFFECT: 1. Fetching user data... (Runs once on mount)");
    const fetchUserData = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        // Simulate a successful response
        setUserData({ id: 1, name: 'Alice Johnson', email: 'alice@example.com' });
        setError(null);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load user data.");
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();

    // Cleanup function: If component unmounts before fetch completes
    return () => {
      console.log("CLEANUP: 1. User data fetch cleanup (e.g., abort controller)");
      // In a real app, you might use an AbortController here
    };
  }, []); // Empty array: Runs only once on mount and cleans up on unmount

  // --- 2. Setting up Subscriptions / Event Listeners (with Cleanup) ---
  useEffect(() => {
    console.log("EFFECT: 2. Setting up keyboard listeners...");
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setKeyboardVisible(false)
    );

    const appStateSubscription = AppState.addEventListener('change', nextAppState => {
      console.log("App State changed to:", nextAppState);
      setAppState(nextAppState);
    });

    // Cleanup function: Remove listeners when component unmounts
    return () => {
      console.log("CLEANUP: 2. Removing keyboard and AppState listeners...");
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
      appStateSubscription.remove();
    };
  }, []); // Empty array: Setup once, cleanup once on unmount

  // --- 3. Running Effects on Specific Prop/State Changes (Dependency Array) ---
  useEffect(() => {
    console.log(`EFFECT: 3. Running search for query: "${query}" (Runs when 'query' changes)`);
    if (!query) {
      setSearchResults([]);
      return;
    }

    setSearchLoading(true);
    const searchApi = async () => {
      // Simulate API call for search
      await new Promise(resolve => setTimeout(resolve, 800));
      const mockResults = [
        `Result for "${query}" - Item 1`,
        `Result for "${query}" - Item 2`,
        `Result for "${query}" - Item 3`,
      ];
      setSearchResults(mockResults);
      setSearchLoading(false);
    };

    const debounceTimer = setTimeout(searchApi, 500); // Debounce search input

    // Cleanup function: Cancel previous search if query changes rapidly
    return () => {
      console.log(`CLEANUP: 3. Cancelling previous search for "${query}"`);
      clearTimeout(debounceTimer);
    };
  }, [query]); // Effect runs only when 'query' changes

  // --- 4. Cleaning Up Timers / Intervals ---
  useEffect(() => {
    console.log("EFFECT: 4. Setting up timer...");
    if (!timerRunning) {
      setTimerCount(0); // Reset on stop
      return;
    }

    const intervalId = setInterval(() => {
      console.log("Timer ticking:", timerCount);
      setTimerCount(prevCount => prevCount + 1);
    }, 1000);

    // Cleanup function: Clear the interval to prevent memory leaks
    return () => {
      console.log("CLEANUP: 4. Clearing timer interval...");
      clearInterval(intervalId);
    };
  }, [timerRunning]); // Effect runs when 'timerRunning' changes

  // --- 5. Logging and Debugging (No Dependency Array / Specific Dependencies) ---
  // This version logs on every render (less common, but useful for debugging all re-renders)
  // useEffect(() => {
  //   console.log("EFFECT: 5. Component rendered or re-rendered (no dependency array).");
  // });

  // This version logs only when specific state changes
  useEffect(() => {
    console.log(`EFFECT: 5. User Login Status Changed: ${userLoggedIn}`);
  }, [userLoggedIn]); // Logs when userLoggedIn state changes

  // --- 6. Direct Native/DOM Manipulation (Conceptual in RN) ---
  // In React Native, direct "DOM manipulation" is less common because you work with components.
  // However, you might use useRef with useEffect to interact with a Native Module's methods
  // or a third-party UI component's imperative API.
  useEffect(() => {
    // Conceptual example: Changing native view properties imperatively
    console.log(`EFFECT: 6. Simulating direct native view color change to: ${viewColor}`);
    if (myViewRef.current) {
      // This is highly conceptual. In a real scenario, you'd use a Native Module
      // or a specific prop on a UI component to change its appearance.
      // E.g., myViewRef.current.setNativeProps({ style: { backgroundColor: viewColor } });
      // Or a Native Module method: NativeColorModule.changeViewColor(myViewRef.current, viewColor);
    }
  }, [viewColor]); // Runs when viewColor changes

  // Callbacks for UI
  const handleQueryChange = useCallback((text) => {
    setQuery(text);
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.mainHeader}>`useEffect` High-Level Examples</Text>
      <Text style={styles.description}>
        Observe console logs for effect and cleanup cycles. Interact with buttons.
      </Text>

      {/* --- 1. Data Fetching on Component Mount --- */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>1. Data Fetching (on Mount)</Text>
        <View style={styles.exampleContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : (
            <View>
              <Text style={styles.statusText}>User Data Loaded:</Text>
              <Text style={styles.content}>Name: {userData.name}</Text>
              <Text style={styles.content}>Email: {userData.email}</Text>
            </View>
          )}
        </View>
      </View>

      {/* --- 2. Subscriptions / Event Listeners --- */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>2. Event Listeners (Keyboard, AppState)</Text>
        <View style={styles.exampleContainer}>
          <Text style={styles.statusText}>
            Keyboard is: {keyboardVisible ? 'Visible' : 'Hidden'} (Try opening keyboard)
          </Text>
          <Text style={styles.statusText}>
            App State: {appState} (Try backgrounding/foregrounding app)
          </Text>
        </View>
      </View>

      {/* --- 3. Running Effects on Specific Prop/State Changes --- */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>3. Search with Debounce (on `query` change)</Text>
        <View style={styles.exampleContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Search query..."
            value={query}
            onChangeText={handleQueryChange}
          />
          {searchLoading ? (
            <ActivityIndicator size="small" color="#007bff" />
          ) : (
            searchResults.length > 0 ? (
              searchResults.map((result, index) => (
                <Text key={index} style={styles.content}>{result}</Text>
              ))
            ) : (
              <Text style={styles.content}>No search results. Type something!</Text>
            )
          )}
        </View>
      </View>

      {/* --- 4. Cleaning Up Timers / Intervals --- */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>4. Timer Cleanup</Text>
        <View style={styles.exampleContainer}>
          <Text style={styles.statusText}>Timer Count: {timerCount}</Text>
          <Button title={timerRunning ? "Stop Timer" : "Start Timer"} onPress={() => setTimerRunning(!timerRunning)} />
        </View>
      </View>

      {/* --- 5. Logging and Debugging --- */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>5. Logging for Debugging</Text>
        <View style={styles.exampleContainer}>
          <Text style={styles.statusText}>
            User Login Status: {userLoggedIn ? 'Logged In' : 'Logged Out'}
          </Text>
          <Button title={userLoggedIn ? "Log Out" : "Log In"} onPress={() => setUserLoggedIn(!userLoggedIn)} />
          <Text style={styles.subContent}>
            (Check console for logs when login status changes)
          </Text>
        </View>
      </View>

      {/* --- 6. Direct Native/DOM Manipulation (Conceptual) --- */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>6. Direct Native Interaction (Conceptual)</Text>
        <View style={styles.exampleContainer}>
          <View ref={myViewRef} style={[styles.coloredBox, { backgroundColor: viewColor }]} />
          <Button title="Change Box Color" onPress={() => setViewColor(viewColor === 'lightblue' ? 'lightcoral' : 'lightblue')} />
          <Text style={styles.subContent}>
            (Conceptual: `useRef` + `useEffect` to imperatively change native view properties)
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
  content: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 5,
  },
  subContent: {
    fontSize: 13,
    color: '#888',
    textAlign: 'center',
    marginTop: 5,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
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
  coloredBox: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 10,
    borderRadius: 10,
  },
});

export default UseEffectHighLevelExamples;