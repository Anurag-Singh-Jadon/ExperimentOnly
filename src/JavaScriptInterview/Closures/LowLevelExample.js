// a closure is a JavaScript feature where an inner function has access to the variables of its outer
//  (enclosing) function's scope chain, even after the outer function has finished executing.

// The outer function: 'greetCreator'
function greetCreator(greeting) {
  // 'greeting' is a variable in the outer function's scope

  // The inner function: 'greeter'
  function greeter(name) {
    // 'greeter' accesses 'greeting' from its outer scope
    console.log(`${greeting}, ${name}!`);
  }

  // The outer function returns the inner function
  return greeter;
}

// --- Usage ---

// 'sayHello' is now the 'greeter' function, but it "remembers" 'Hello'
const sayHello = greetCreator('Hello');

// 'sayHi' is another 'greeter' function, but it "remembers" 'Hi'
const sayHi = greetCreator('Hi');

sayHello('Alice'); // Output: Hello, Alice!
sayHi('Bob');     // Output: Hi, Bob!
sayHello('Charlie'); // Output: Hello, Charlie!

console.log('\n--- Low-Level Example End ---\n');