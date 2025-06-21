// Function that creates a simple counter with private state
function createCounter() {
  let count = 0; // This 'count' is private to each counter instance

  return {
    increment: function() {
      count++;
      return count;
    },
    decrement: function() {
      count--;
      return count;
    },
    getCount: function() {
      return count;
    },
    reset: function() {
      count = 0;
      return count;
    }
  };
}

// --- Usage ---

const myCounter = createCounter();
const anotherCounter = createCounter(); // Independent counter

console.log('My Counter:');
console.log(myCounter.increment()); // Output: 1
console.log(myCounter.increment()); // Output: 2
console.log(myCounter.getCount());  // Output: 2

console.log('\nAnother Counter:');
console.log(anotherCounter.increment()); // Output: 1
console.log(anotherCounter.increment()); // Output: 2
console.log(anotherCounter.decrement()); // Output: 1

console.log('\nMy Counter (after anotherCounter actions):');
console.log(myCounter.getCount()); // Output: 2 (Unaffected by anotherCounter)

myCounter.reset();
console.log(myCounter.getCount()); // Output: 0

// You cannot directly access myCounter.count, it's truly private!
// console.log(myCounter.count); // Undefined

console.log('\n--- Medium-Level Example End ---\n');