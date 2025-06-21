// Syntax: array.push(element1, element2, ..., elementN)

const fruits = ['apple', 'banana'];

// Example 1: Add a single element
const newLength1 = fruits.push('cherry');
console.log(fruits);      // Output: ['apple', 'banana', 'cherry']
console.log(newLength1);  // Output: 3

// Example 2: Add multiple elements
const colors = ['red', 'green'];
const newLength2 = colors.push('blue', 'yellow');
console.log(colors);      // Output: ['red', 'green', 'blue', 'yellow']
console.log(newLength2);  // Output: 4

// Example 3: Push elements from another array (using spread operator for effective 'concat')
const numbers1 = [1, 2];
const numbers2 = [3, 4, 5];
numbers1.push(...numbers2); // Spread numbers2 elements as individual arguments
console.log(numbers1);    // Output: [1, 2, 3, 4, 5]

// CAUTION: Pushing an array directly
const arrayToPush = ['x', 'y'];
const originalArray = [1, 2];
originalArray.push(arrayToPush);
console.log(originalArray); // Output: [1, 2, ['x', 'y']] - The array itself becomes an element
// This is usually not what you want for flattening or merging arrays. Use spread or concat instead.