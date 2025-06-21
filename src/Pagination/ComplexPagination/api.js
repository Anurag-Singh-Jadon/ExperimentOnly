// api.js
import axios from 'axios';

const DUMMY_API_PRODUCTS_URL = 'https://dummyjson.com/products';
const FAKE_STORE_API_CATEGORIES_URL = 'https://fakestoreapi.com/products/categories';


const fetchAllProducts = async () => {
    try {
        const response = await axios.get(`${DUMMY_API_PRODUCTS_URL}?limit=100`); // Fetches all 100 dummy products
        return response.data.products;
    } catch (error) {
        console.error('Error fetching all products:', error);
        throw error;
    }
};

const fetchCategories = async () => {
    try {
        const response = await axios.get(`${FAKE_STORE_API_CATEGORIES_URL}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
};

export { fetchAllProducts, fetchCategories };