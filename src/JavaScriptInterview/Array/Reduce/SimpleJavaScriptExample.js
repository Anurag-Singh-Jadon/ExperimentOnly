// Syntax: array.reduce(callback(accumulator, currentValue, currentIndex, array), initialValue)

// Parameters:
// - accumulator: The accumulated value from the previous callback invocation.
// - currentValue: The current element being processed in the array.
// - currentIndex (optional): The index of the current element being processed.
// - array (optional): The array `reduce` was called upon.
// - initialValue (optional): A value to use as the first argument to the first call of the callback.

const numbers = [1, 2, 3, 4, 5];

// Example 1: Sum all numbers in an array (common use case)
const sum = numbers.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
// sum will be 15 (0 + 1 + 2 + 3 + 4 + 5)

// Example 2: Flatten an array of arrays
const arrayOfArrays = [[1, 2], [3, 4], [5, 6]];
const flattenedArray = arrayOfArrays.reduce((accumulator, currentValue) => accumulator.concat(currentValue), []);
// flattenedArray will be [1, 2, 3, 4, 5, 6]

// Example 3: Count occurrences of elements in an array
const fruits = ['apple', 'banana', 'apple', 'orange', 'banana', 'apple'];
const fruitCounts = fruits.reduce((counts, fruit) => {
  counts[fruit] = (counts[fruit] || 0) + 1;
  return counts;
}, {});
/*
fruitCounts will be:
{
  apple: 3,
  banana: 2,
  orange: 1
}
*/

// Example 4: Group objects by a property
const people = [
  { name: 'Alice', age: 30, city: 'New York' },
  { name: 'Bob', age: 25, city: 'London' },
  { name: 'Charlie', age: 30, city: 'New York' },
  { name: 'David', age: 35, city: 'London' },
];

const peopleByCity = people.reduce((groups, person) => {
  const city = person.city;
  if (!groups[city]) {
    groups[city] = [];
  }
  groups[city].push(person);
  return groups;
}, {});
/*
peopleByCity will be:
{
  'New York': [
    { name: 'Alice', age: 30, city: 'New York' },
    { name: 'Charlie', age: 30, city: 'New York' }
  ],
  'London': [
    { name: 'Bob', age: 25, city: 'London' },
    { name: 'David', age: 35, city: 'London' }
  ]
}
*/