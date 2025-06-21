// filter() is used when you want to select a subset of elements from an array based on specific criteria.

// Syntax: array.filter(callback(currentValue, index, array), thisArg)

const numbers = [10, 25, 30, 45, 50, 70];

// Example 1: Filter numbers greater than 40
const greaterThan40 = numbers.filter(number => number > 40);
// greaterThan40 will be [45, 50, 70]

// Example 2: Filter objects based on a property
const products = [
  { id: 1, name: 'Laptop', price: 1200, category: 'Electronics' },
  { id: 2, name: 'Chair', price: 300, category: 'Furniture' },
  { id: 3, name: 'Monitor', price: 400, category: 'Electronics' },
  { id: 4, name: 'Desk', price: 500, category: 'Furniture' },
];

const electronicsProducts = products.filter(product => product.category === 'Electronics');
/*
electronicsProducts will be:
[
  { id: 1, name: 'Laptop', price: 1200, category: 'Electronics' },
  { id: 3, name: 'Monitor', price: 400, category: 'Electronics' },
]
*/

// Example 3: Filter out null/undefined values (falsy values)
const mixedValues = [0, 'hello', null, 42, undefined, '', true];
const truthyValues = mixedValues.filter(value => value); // A simple way to filter out falsy values
// truthyValues will be ['hello', 42, true]