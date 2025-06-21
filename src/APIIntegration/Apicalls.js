// api.js
import axios from 'axios';

const API_BASE_URL = 'https://fakestoreapi.com'; // Centralize base URL for easier management

const getAllProducts = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/products`);
        return response.data;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};

const getAllCategories = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/products/categories`);
        return response.data;
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
};

const getAllUsers = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/users`);
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};

const getAllCarts = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/carts`);
        return response.data;
    } catch (error) {
        console.error('Error fetching carts:', error);
        throw error;
    }
};

const getAllOrders = async () => {
    // Note: FakeStoreAPI does not have a dedicated '/orders' endpoint.
    // I'm including this for demonstration purposes, but it will likely
    // return an error or an empty array from the actual API.
    // For a real app, you'd point this to your actual orders API.
    try {
        const response = await axios.get(`${API_BASE_URL}/orders`); // This URL is made up for example.
        return response.data;
    } catch (error) {
        console.error('Error fetching orders:', error);
        // It's good practice to re-throw the error or handle it specifically
        // if this API call is optional. For Promise.all, throwing will cause
        // the whole Promise.all to reject.
        throw error;
    }
};

// Function to call a subset of APIs concurrently
const getAllProductsWithCategories = async () => {
    try {
        const [products, categories] = await Promise.all([
            getAllProducts(),
            getAllCategories()
        ]);
        return { products, categories };
    } catch (error) {
        console.error('Error fetching products with categories:', error);
        throw error;
    }
};

// Function to call all 5 (or more) APIs concurrently
const getAllData = async () => {
    try {
        const [products, categories, users, carts, orders] = await Promise.all([
            getAllProducts(),
            getAllCategories(),
            getAllUsers(),
            getAllCarts(),
            getAllOrders() // This one might fail based on FakeStoreAPI structure
        ]);
        return { products, categories, users, carts, orders };
    } catch (error) {
        console.error('Error fetching all data:', error);
        throw error;
    }
};

export {
    getAllProducts,
    getAllCategories,
    getAllUsers,
    getAllCarts,
    getAllOrders,
    getAllProductsWithCategories,
    getAllData
};/*  */