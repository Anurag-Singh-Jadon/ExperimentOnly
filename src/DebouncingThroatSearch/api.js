// api.js
import axios from 'axios';

const API_BASE_URL = 'https://dummyjson.com';

/**
 * Fetches products based on a search query.
 * DummyJSON's search endpoint: https://dummyjson.com/products/search?q={query}
 * It also supports limit and skip, but for this example, we'll keep it simple
 * and fetch a reasonable limit of results per search.
 */
const searchProducts = async (query, limit = 20) => {
    try {
        if (!query) {
            // If query is empty, return an empty array to avoid unnecessary API calls
            return { products: [], total: 0 };
        }
        const response = await axios.get(`${API_BASE_URL}/products/search?q=${query}&limit=${limit}`);
        return response.data; // DummyJSON returns { products: [], total: X, skip: Y, limit: Z }
    } catch (error) {
        console.error/*  */('Error searching products:', error);
        throw error;
    }
};

export { searchProducts };