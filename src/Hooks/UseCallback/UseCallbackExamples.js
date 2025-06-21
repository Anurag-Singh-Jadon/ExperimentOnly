// The useCallback hook in React Native(and React generally) is a powerful tool for performance optimization.It's used to memoize functions, meaning it returns a memoized version of the callback function that only changes if one of its dependencies has changed.

import React, { useState, useCallback, memo } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, Alert, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Optional

// --- Memoized Child Component (Crucial for seeing useCallback's effect) ---
// This component will only re-render if its props shallowly change.
const MemoizedButton = memo(({ title, onPress, buttonStyle, textStyle }) => {
    console.log(`MemoizedButton: "${title}" rendered!`);
    return (
        <Button title={title} onPress={onPress} color={buttonStyle?.backgroundColor || '#007bff'} />
    );
});

const MemoizedTextDisplay = memo(({ label, value, textStyle }) => {
    console.log(`MemoizedTextDisplay: "${label}" rendered!`);
    return (
        <View style={styles.memoizedDisplay}>
            <Text style={styles.memoizedDisplayLabel}>{label}:</Text>
            <Text style={[styles.memoizedDisplayText, textStyle]}>{value}</Text>
        </View>
    );
});


const UseCallbackExamples = () => {
    const [count, setCount] = useState(0);
    const [inputValue, setInputValue] = useState('');
    const [isActive, setIsActive] = useState(false);
    const [randomData, setRandomData] = useState([]);

    // --- Example 1: Preventing unnecessary re-renders of child components ---
    // Without useCallback, handlePress would be recreated on every render,
    // causing MemoizedButton to re-render even if its parent's 'count' state changes.
    const handlePress = useCallback(() => {
        setCount(prevCount => prevCount + 1);
        Alert.alert('Button Pressed', `Count increased to ${count + 1}`);
    }, [count]); // Dependency array: recreate handlePress only if 'count' changes

    // Compare with a non-memoized function:
    const handleNonMemoizedPress = () => {
        Alert.alert('Non-Memoized', 'This function is recreated on every render.');
    };

    // --- Example 2: Optimizing event handlers with stable references ---
    // This function is stable, so child components receiving it as a prop won't re-render
    // unnecessarily when other state in this parent component changes.
    const toggleActiveStatus = useCallback(() => {
        setIsActive(prev => !prev);
        Alert.alert('Status Toggled', `Active status is now: ${!isActive}`);
    }, [isActive]); // Dependency: recreate only if isActive changes

    // --- Example 3: Expensive calculation that depends on input value ---
    // This function might perform heavy computation. We only want to re-run it
    // and recreate the `processedValue` if `inputValue` actually changes.
    const calculateExpensiveValue = useCallback(() => {
        console.log('Calculating expensive value...');
        // Simulate heavy computation
        let result = inputValue.split('').reverse().join('');
        for (let i = 0; i < 1000000; i++) {
            result = result + 'x';
        }
        return result.substring(0, 50); // Just a snippet
    }, [inputValue]); // Only recalculate if inputValue changes

    // --- Example 4: Callback for fetching data (depends on other states) ---
    const fetchData = useCallback(async (url) => {
        console.log(`Fetching data from: ${url}`);
        // Simulate API call
        try {
            // In a real app, this would be an actual fetch call
            // const response = await fetch(url);
            // const data = await response.json();
            const mockData = Array.from({ length: 3 }, (_, i) => ({ id: i + 1, value: `Data-${i + 1}` }));
            setRandomData(mockData);
            Alert.alert('Data Fetched', `Fetched ${mockData.length} items from ${url}`);
        } catch (error) {
            console.error('Fetch error:', error);
            Alert.alert('Fetch Error', 'Failed to fetch data.');
        }
    }, []); // No dependencies for this example, so it's created once

    // --- Example 5: Callback for handling form submissions/multiple inputs ---
    const handleSubmitForm = useCallback(() => {
        // This function depends on both count and inputValue
        Alert.alert('Form Submitted', `Count: ${count}, Input: ${inputValue}`);
        // In a real app, you might send this data to a server
    }, [count, inputValue]); // Recreate only if count or inputValue changes

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.mainHeader}>`useCallback()` High-Level Examples</Text>
            <Text style={styles.description}>
                Memoizing functions for performance optimization.
            </Text>

            {/* --- Example 1: Preventing unnecessary re-renders of child components --- */}
            <View style={styles.section}>
                <Text style={styles.sectionHeader}>1. Optimize Child Component Re-renders</Text>
                <Text style={styles.currentValue}>Count: {count}</Text>
                <TextInput
                    style={styles.textInput}
                    placeholder="Type something to cause parent re-render"
                    value={inputValue}
                    onChangeText={setInputValue}
                />
                <View style={styles.buttonGroup}>
                    {/* This button receives a memoized function */}
                    <MemoizedButton
                        title="Increment Count (useCallback)"
                        onPress={handlePress}
                    />
                    {/* This button receives a new function on every render of this parent component */}
                    <MemoizedButton
                        title="Non-Memoized Function"
                        onPress={handleNonMemoizedPress}
                        buttonStyle={{ backgroundColor: '#6c757d' }}
                    />
                </View>
                <Text style={styles.infoText}>
                    Observe console logs for "MemoizedButton rendered!" to see when it re-renders.
                    Type in the input field to trigger parent re-renders.
                </Text>
            </View>

            {/* --- Example 2: Optimizing event handlers with stable references --- */}
            <View style={styles.section}>
                <Text style={styles.sectionHeader}>2. Stable Event Handlers</Text>
                <Text style={styles.currentValue}>Active Status: {isActive ? 'ON' : 'OFF'}</Text>
                <MemoizedButton
                    title={`Toggle Status (${isActive ? 'ON' : 'OFF'})`}
                    onPress={toggleActiveStatus}
                    buttonStyle={{ backgroundColor: isActive ? '#28a745' : '#ffc107' }}
                />
                <Text style={styles.infoText}>
                    `toggleActiveStatus` is memoized. When `inputValue` changes,
                    this button's `onPress` prop reference remains stable.
                </Text>
            </View>

            {/* --- Example 3: Expensive computation --- */}
            <View style={styles.section}>
                <Text style={styles.sectionHeader}>3. Memoizing Expensive Functions</Text>
                <MemoizedTextDisplay
                    label="Processed Value"
                    value={calculateExpensiveValue()} // Call the memoized function
                    textStyle={{ color: '#007bff' }}
                />
                <Text style={styles.infoText}>
                    Check console for "Calculating expensive value..." message. It should only appear
                    when you type in the input field above, not when `count` changes.
                </Text>
            </View>

            {/* --- Example 4: Callback for fetching data --- */}
            <View style={styles.section}>
                <Text style={styles.sectionHeader}>4. Stable Data Fetching Callback</Text>
                <MemoizedButton
                    title="Fetch Data"
                    onPress={() => fetchData('https://api.example.com/data')}
                    buttonStyle={{ backgroundColor: '#17a2b8' }}
                />
                <Text style={styles.subSubHeader}>Fetched Data:</Text>
                {randomData.length > 0 ? (
                    randomData.map(item => (
                        <Text key={item.id} style={styles.listItemText}>ID: {item.id}, Value: {item.value}</Text>
                    ))
                ) : (
                    <Text style={styles.infoText}>No data fetched yet.</Text>
                )}
                <Text style={styles.infoText}>
                    `fetchData` function is memoized and doesn't recreate on parent re-renders,
                    ensuring stability if passed to a `memo`ized child that triggers fetch.
                </Text>
            </View>

            {/* --- Example 5: Callback for handling form submissions/multiple inputs --- */}
            <View style={styles.section}>
                <Text style={styles.sectionHeader}>5. Form Submission Handler</Text>
                <MemoizedButton
                    title="Submit Form Data"
                    onPress={handleSubmitForm}
                    buttonStyle={{ backgroundColor: '#ffc107' }}
                />
                <Text style={styles.infoText}>
                    `handleSubmitForm` only re-creates if `count` or `inputValue` change,
                    useful for forms where multiple fields affect the submission logic.
                </Text>
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
    },/*  */
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
    currentValue: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
        color: '#333',
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
    buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        gap: 10,
        marginBottom: 10,
    },
    infoText: {
        fontSize: 13,
        color: '#6c757d',
        textAlign: 'center',
        marginTop: 5,
        fontStyle: 'italic',
    },
    memoizedDisplay: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        backgroundColor: '#f9f9f9',
        borderRadius: 5,
        marginBottom: 10,
    },
    memoizedDisplayLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 5,
        color: '#555',
    },
    memoizedDisplayText: {
        fontSize: 16,
        color: '#333',
    },
    listItemText: {
        fontSize: 14,
        color: '#444',
        marginLeft: 10,
        marginBottom: 3,
    },
});

export default UseCallbackExamples;