// api.js
import axios from 'axios';

const API_BASE_URL = 'https://fakestoreapi.com';

const fetchProducts = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/products`);
        return response.data;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};

const fetchCategories = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/products/categories`);
        return response.data;
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
};

export { fetchProducts, fetchCategories };