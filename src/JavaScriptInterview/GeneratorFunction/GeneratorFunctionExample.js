// What is a Generator Function?
// At a high level, a generator function is a special type of function that can pause its execution,
//  yield (return) a value, and then resume its execution from where it left off. This makes them 
//  incredibly powerful for tasks like:

// Iterators: Creating custom, iterable sequences of values.
// Asynchronous Programming: Managing asynchronous operations in a more sequential and readable way 
// (though async/await has largely superseded this for most everyday async tasks).
// Lazy Evaluation: Generating values only when they are needed, rather than computing them all at once.
// Infinite Sequences: Representing sequences that could theoretically go on forever
//  (e.g., an infinite Fibonacci sequence).

function* simpleCounter() {
  yield 1; // Pause 1
  yield 2; // Pause 2
  yield 3; // Pause 3
  // Function implicitly finishes here, or you could add a return
}

// 1. Call the generator function to get a generator object (iterator)
const counterGenerator = simpleCounter();

console.log(counterGenerator.next()); // { value: 1, done: false }
console.log(counterGenerator.next()); // { value: 2, done: false }
console.log(counterGenerator.next()); // { value: 3, done: false }
console.log(counterGenerator.next()); // { value: undefined, done: true } (Generator finished)
console.log(counterGenerator.next()); // { value: undefined, done: true } (Still finished)

Sure, let's break down the concept of Generator Functions in JavaScript.

What is a Generator Function?
At a high level, a generator function is a special type of function that can pause its execution, yield (return) a value, and then resume its execution from where it left off. This makes them incredibly powerful for tasks like:

Iterators: Creating custom, iterable sequences of values.
Asynchronous Programming: Managing asynchronous operations in a more sequential and readable way (though async/await has largely superseded this for most everyday async tasks).
Lazy Evaluation: Generating values only when they are needed, rather than computing them all at once.
Infinite Sequences: Representing sequences that could theoretically go on forever (e.g., an infinite Fibonacci sequence).
Key Characteristics and Syntax
function* syntax: A generator function is declared with an asterisk * after the function keyword (e.g., function* myGenerator() { ... }).
yield keyword: This is the core of generator functions.
When yield is encountered, the generator function pauses execution and the value after yield is returned.
The generator's internal state is saved.
When the generator is "resumed" (by calling next()), it continues execution from immediately after the yield statement.
next() method: Calling a generator function does not execute its body immediately. Instead, it returns a Generator Object (also known as an iterator). To execute the generator function's code, you call the next() method on this generator object.
next() returns an object with two properties:
value: The value yielded by the generator.
done: A boolean indicating whether the generator has finished executing (true) or if there are more yield expressions to come (false).
return in generators: A return statement in a generator function marks the generator as done: true and the value property of the last next() call will be the returned value. If there's no return, done becomes true and value is undefined when the function fully completes.
Low-Level Example: Simple Counter
Let's start with a very basic example to illustrate the pause/resume nature.

JavaScript

function* simpleCounter() {
  yield 1; // Pause 1
  yield 2; // Pause 2
  yield 3; // Pause 3
  // Function implicitly finishes here, or you could add a return
}

// 1. Call the generator function to get a generator object (iterator)
const counterGenerator = simpleCounter();

console.log(counterGenerator.next()); // { value: 1, done: false }
console.log(counterGenerator.next()); // { value: 2, done: false }
console.log(counterGenerator.next()); // { value: 3, done: false }
console.log(counterGenerator.next()); // { value: undefined, done: true } (Generator finished)
console.log(counterGenerator.next()); // { value: undefined, done: true } (Still finished)
// Explanation:

// simpleCounter() is called, but nothing prints immediately. It returns counterGenerator.
// counterGenerator.next() executes the code until the first yield 1. It then pauses and returns { value: 1, done: false }.
// The second next() call resumes from after yield 1, executes until yield 2, pauses, and returns { value: 2, done: false }.
// This continues until yield 3.
// After yield 3, there are no more yield statements, so the generator finishes. The final next() call returns { value: undefined, done: true }.

//Medium-level example

function* fibonacciGenerator() {
  let a = 0;
  let b = 1;
  while (true) { // An infinite loop! But safe due to yield
    yield a;
    [a, b] = [b, a + b]; // Destructuring assignment to update a and b
  }
}

const fibGen = fibonacciGenerator();

console.log(fibGen.next().value); // 0
console.log(fibGen.next().value); // 1
console.log(fibGen.next().value); // 1
console.log(fibGen.next().value); // 2
console.log(fibGen.next().value); // 3
console.log(fibGen.next().value); // 5
console.log(fibGen.next().value); // 8
console.log(fibGen.next().value); // 13

// We can iterate over them using `for...of` (generators are iterable!)
console.log("\nUsing for...of loop for first 10 Fibonacci numbers:");
const fibForOf = fibonacciGenerator();
for (let i = 0; i < 10; i++) {
  console.log(fibForOf.next().value);
}

// If you want to stop a for...of loop early, you need to add a condition inside
// or break out.

//High-level example
function* processInput() {
  console.log("Generator started.");
  let input1 = yield "Please enter your name:"; // Pause, yield prompt

  console.log(`Received name: ${input1}`);
  let input2 = yield `Hello, ${input1}! What's your age?`; // Pause, yield personalized prompt

  console.log(`Received age: ${input2}`);
  yield `Thank you, ${input1}, you are ${input2} years old.`; // Pause, yield final message
  console.log("Generator finished.");
}

const inputProcessor = processInput();

// First call: starts execution, yields the first prompt
let step1 = inputProcessor.next();
console.log(step1.value); // "Please enter your name:"

// Second call: resumes execution, sends "Alice" as the value of 'input1'
let step2 = inputProcessor.next("Alice");
console.log(step2.value); // "Hello, Alice! What's your age?"

// Third call: resumes execution, sends "30" as the value of 'input2'
let step3 = inputProcessor.next("30");
console.log(step3.value); // "Thank you, Alice, you are 30 years old."

// Fourth call: generator is now finished
let step4 = inputProcessor.next();
console.log(step4.value); // undefined (and "Generator finished." logged internally)
console.log(step4.done);  // true