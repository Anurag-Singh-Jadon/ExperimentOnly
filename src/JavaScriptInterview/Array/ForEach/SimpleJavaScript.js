// Syntax: array.forEach(callback(currentValue, index, array), thisArg)

const numbers = [1, 2, 3];

// Example 1: Log each number
numbers.forEach(number => {
  console.log(number);
});
// Output:
// 1
// 2
// 3

// Example 2: Update an external variable (side effect)
let sum = 0;
numbers.forEach(number => {
  sum += number;
});
console.log(sum); // Output: 6

// Example 3: Accessing index and the array itself
const fruits = ['apple', 'banana', 'cherry'];
fruits.forEach((fruit, index, arr) => {
  console.log(`Fruit at index ${index}: ${fruit} (Total fruits: ${arr.length})`);
});
// Output:
// Fruit at index 0: apple (Total fruits: 3)
// Fruit at index 1: banana (Total fruits: 3)
// Fruit at index 2: cherry (Total fruits: 3)