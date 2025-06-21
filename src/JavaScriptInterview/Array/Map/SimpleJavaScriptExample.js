// At a high level, map() creates a new array by calling a provided function on every element in the original array. It's a non-mutating method, meaning it doesn't change the original array.


// Syntax: array.map(callback(currentValue, index, array), thisArg)

const numbers = [1, 2, 3, 4, 5];

// Example 1: Double each number
const doubledNumbers = numbers.map(number => number * 2);
// doubledNumbers will be [2, 4, 6, 8, 10]

// Example 2: Transform objects in an array
const users = [
  { id: 1, name: 'Alice', active: true },
  { id: 2, name: 'Bob', active: false },
  { id: 3, name: 'Charlie', active: true },
];

const userNames = users.map(user => user.name);
// userNames will be ['Alice', 'Bob', 'Charlie']

const activeUsers = users.map(user => ({
  ...user, // Copy existing properties
  status: user.active ? 'Active' : 'Inactive' // Add a new property
}));
/*
activeUsers will be:
[
  { id: 1, name: 'Alice', active: true, status: 'Active' },
  { id: 2, name: 'Bob', active: false, status: 'Inactive' },
  { id: 3, name: 'Charlie', active: true, status: 'Active' },
]
*/