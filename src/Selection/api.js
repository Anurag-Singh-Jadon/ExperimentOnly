// api.js
import axios from 'axios';

// Simulate an API call with a delay
const fetchOptions = async () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([
        { id: '1', label: 'Reading', value: 'reading' },
        { id: '2', label: 'Traveling', value: 'traveling' },
        { id: '3', label: 'Cooking', value: 'cooking' },
        { id: '4', label: 'Sports', value: 'sports' },
        { id: '5', label: 'Gaming', value: 'gaming' },
        { id: '6', label: 'Music', value: 'music' },
      ]);
    }, 1000); // Simulate 1-second network delay
  });
};

export { fetchOptions };