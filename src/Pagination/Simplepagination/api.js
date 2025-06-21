// api.js
import axios from 'axios';

const API_BASE_URL = 'https://dummyjson.com'; // Using DummyJSON API

const fetchPaginatedProducts = async (limit = 10, skip = 0) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/products?limit=${limit}&skip=${skip}`);
        return response.data; // DummyJSON returns { products: [], total: X, skip: Y, limit: Z }
    } catch (error) {
        console.error('Error fetching paginated products:', error);
        throw error;/*  */
    }
};

export { fetchPaginatedProducts };