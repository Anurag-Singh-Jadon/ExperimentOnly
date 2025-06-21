// DataDisplayScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, ScrollView, Alert } from 'react-native';
import { getAllData, getAllProductsWithCategories } from './Apicalls'; // Adjust path if needed

const DataDisplayScreen = () => {
    const [allData, setAllData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null); // Clear previous errors

                // Call the function that performs concurrent API calls
                const fetchedData = await getAllData();
                setAllData(fetchedData);

                // Example of calling a subset:
                // const { products, categories } = await getAllProductsWithCategories();
                // console.log("Products and categories:", products, categories);

            } catch (err) {
                console.error("Failed to fetch all data:", err);
                setError("Failed to load data. Please check your network or try again.");
                // Optionally show an alert for the user
                Alert.alert("Error", "Could not fetch all data.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []); // Empty dependency array ensures this runs once on mount

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Loading all data concurrently...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>{error}</Text>
                <Text style={styles.errorText}>Try refreshing the app.</Text>
            </View>
        );
    }

    // Display the fetched data
    return (
        <ScrollView style={styles.scrollView}>
            <View style={styles.dataContainer}>
                <Text style={styles.heading}>All Data Fetched Concurrently:</Text>

                <Text style={styles.subHeading}>Products ({allData.products?.length || 0}):</Text>
                <Text style={styles.jsonText}>{JSON.stringify(allData.products?.slice(0, 2), null, 2)}</Text>
                {allData.products && allData.products.length > 2 && <Text>...and {allData.products.length - 2} more products.</Text>}

                <Text style={styles.subHeading}>Categories ({allData.categories?.length || 0}):</Text>
                <Text style={styles.jsonText}>{JSON.stringify(allData.categories, null, 2)}</Text>

                <Text style={styles.subHeading}>Users ({allData.users?.length || 0}):</Text>
                <Text style={styles.jsonText}>{JSON.stringify(allData.users?.slice(0, 2), null, 2)}</Text>
                 {allData.users && allData.users.length > 2 && <Text>...and {allData.users.length - 2} more users.</Text>}

                <Text style={styles.subHeading}>Carts ({allData.carts?.length || 0}):</Text>
                <Text style={styles.jsonText}>{JSON.stringify(allData.carts?.slice(0, 2), null, 2)}</Text>
                 {allData.carts && allData.carts.length > 2 && <Text>...and {allData.carts.length - 2} more carts.</Text>}


                <Text style={styles.subHeading}>Orders ({allData.orders?.length || 0}):</Text>
                {/* Note: FakeStoreAPI doesn't have an /orders endpoint, so this will likely be empty or undefined */}
                <Text style={styles.jsonText}>{JSON.stringify(allData.orders, null, 2)}</Text>
                {!allData.orders || allData.orders.length === 0 && <Text style={styles.noteText}>(Orders might be empty or undefined as fakestoreapi.com does not have this endpoint)</Text>}

            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        backgroundColor: '#f8f8f8',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    dataContainer: {
        padding: 20,
    },
    heading: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
        textAlign: 'center',
    },
    subHeading: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 20,
        marginBottom: 10,
        color: '#555',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: 5,
    },
    jsonText: {
        fontSize: 12,
        backgroundColor: '#eef',
        padding: 10,
        borderRadius: 5,
        fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace', // Better for JSON display
    },
    errorText: {
        color: 'red',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 10,
    },
    noteText: {
        fontSize: 12,
        color: '#888',
        fontStyle: 'italic',
        marginTop: 5,
    }
});

export default DataDisplayScreen;