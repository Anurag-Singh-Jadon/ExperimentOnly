import { View, Text } from 'react-native'
import React from 'react'

const Hoisting = () => {
//     1. var Variable Hoisting
// With var, the declaration is hoisted, but the assignment (initialization) stays in place. The variable is initialized with undefined during the hoisting phase.
    // Low-Level Example 1: var variable hoisting

console.log("Value of 'a' before declaration:", a); // Output: undefined
var a = 10;
console.log("Value of 'a' after declaration:", a);  // Output: 10

/*
  Explanation:
  During compilation, the JavaScript engine conceptually transforms this code to:

  var a;                     // Declaration is hoisted and 'a' is initialized to undefined
  console.log("Value of 'a' before declaration:", a); // 'a' exists, but its value is undefined
  a = 10;                    // Assignment stays in place
  console.log("Value of 'a' after declaration:", a);

  
*/
// Low-Level Example 2: let and const (Temporal Dead Zone)

// console.log("Value of 'b' before declaration:", b); // ReferenceError: Cannot access 'b' before initialization
let b = 20;
console.log("Value of 'b' after declaration:", b); // Output: 20

// console.log("Value of 'c' before declaration:", c); // ReferenceError: Cannot access 'c' before initialization
const c = 30;
console.log("Value of 'c' after declaration:", c); // Output: 30

/*
  Explanation:
  'b' and 'c' are indeed hoisted to the top of their scope, but unlike 'var', they are not
  initialized to `undefined`. They remain in an uninitialized state (the TDZ) until their
  declaration line is executed. Any attempt to access them in the TDZ throws a ReferenceError.
  This makes 'let' and 'const' safer and generally preferred for variable declarations.
*/

// Low-Level Example 3: Function declaration hoisting

greet(); // Output: Hello from hoisted function!

function greet() {
  console.log("Hello from hoisted function!");
}

// Function Expression (assigned to a var variable) vs. Function Declaration
// console.log("Value of sayGoodbye before declaration:", sayGoodbye); // Output: undefined
// sayGoodbye(); // TypeError: sayGoodbye is not a function (because at this point, sayGoodbye is undefined)

var sayGoodbye = function() { // This is a function expression
  console.log("Goodbye!");
};

sayGoodbye(); // Output: Goodbye!

/*
  Explanation:
  - The `greet` function's entire declaration (name and body) is hoisted to the top.
    So, it's available for execution anywhere within its scope.
  - `sayGoodbye` is a function *expression* assigned to a `var` variable.
    Only the `var sayGoodbye;` part is hoisted, and `sayGoodbye` is initialized to `undefined`.
    The assignment (`= function() { ... }`) remains in place.
    Therefore, trying to call `sayGoodbye()` before its assignment is like calling `undefined()`, which results in a TypeError.
*/

// Medium-Level Example: Hoisting in Function Scopes and Closures

var globalVar = "I am global";

function outerFunction() {
  console.log("Inside outerFunction:");
  console.log("globalVar (from outer):", globalVar); // Output: I am global (accessible from outer scope)
  console.log("outerVar (before declaration):", outerVar); // Output: undefined (var hoisted within outerFunction's scope)

  var outerVar = "I am in outerFunction";

  function innerFunction() {
    console.log("\nInside innerFunction:");
    console.log("globalVar (from inner):", globalVar); // Output: I am global (accessible from outer scope)
    console.log("outerVar (from inner):", outerVar);   // Output: I am in outerFunction (accessible from parent scope)
    // console.log("innerVar (before declaration):", innerVar); // ReferenceError: Cannot access 'innerVar' before initialization

    let innerVar = "I am in innerFunction";
    console.log("innerVar (after declaration):", innerVar); // Output: I am in innerFunction

    // Inner function declaration is hoisted within innerFunction's scope
    callMeLater(); // Output: You called me!
    function callMeLater() {
      console.log("You called me!");
    }
  }

  innerFunction();
  // callMeLater(); // ReferenceError: callMeLater is not defined (it's hoisted only within innerFunction)
}

outerFunction();

/*
  Explanation:
  - `globalVar`: Declared outside any function, it's a global variable and accessible everywhere.
  - `outerVar`: Declared with `var` inside `outerFunction`. Its declaration is hoisted to the top of `outerFunction`'s scope,
    making it accessible (as `undefined`) before its assignment within `outerFunction`.
    It's also accessible in `innerFunction` due to closure.
  - `innerVar`: Declared with `let` inside `innerFunction`. It's hoisted to the top of `innerFunction`'s scope,
    but it's in the TDZ before its declaration line, hence the `ReferenceError` if accessed early.
  - `callMeLater`: This is a function *declaration* inside `innerFunction`. It is fully hoisted, but *only* within
    the `innerFunction`'s scope. Attempting to call it from `outerFunction` (or globally) would result in a `ReferenceError`.
    This demonstrates scope-specific hoisting.
*/

// High-Level Example: Hoisting with Best Practices and Common Pitfalls

// Pitfall 1: Unintended Global Variable (without strict mode)
// This happens if you forget to declare a variable (e.g., without var, let, const)
// This variable will become global even if assigned within a function.
function createGlobalWithoutDeclaration() {
  // bestPracticeVar = "I am an accidental global!"; // Will create a global variable without 'var', 'let', or 'const'
  // console.log("bestPracticeVar (global):", global.bestPracticeVar); // In Node.js or browser window
  // In a strict environment, this would throw a ReferenceError, which is good.
}
createGlobalWithoutDeclaration();

// console.log("bestPracticeVar (outside):", bestPracticeVar); // Works if not in strict mode

// Pitfall 2: Hoisting with `var` inside loops (leading to unexpected behavior)
// This is a classic `var` hoisting pitfall that `let` solves.
function loopWithVarHoisting() {
  console.log("\nLoop with var hoisting:");
  var functions = [];
  for (var i = 0; i < 3; i++) {
    functions[i] = function() {
      console.log("Index:", i); // All will output 3
    };
  }
  functions[0](); // Output: Index: 3
  functions[1](); // Output: Index: 3
  functions[2](); // Output: Index: 3
}
loopWithVarHoisting();

/*
  Explanation for Pitfall 2:
  The `var i` is hoisted to the top of `loopWithVarHoisting` function scope.
  By the time the inner functions are called, the loop has completed, and `i` is 3.
  All closures capture the *same* mutable `i` variable.
*/

// Best Practice: Use `let` in loops to avoid the closure problem
function loopWithLetBlockScoping() {
  console.log("\nLoop with let block scoping:");
  let functions = [];
  for (let j = 0; j < 3; j++) { // 'j' is block-scoped, a new 'j' for each iteration
    functions[j] = function() {
      console.log("Index:", j); // Output: Index: 0, Index: 1, Index: 2
    };
  }
  functions[0](); // Output: Index: 0
  functions[1](); // Output: Index: 1
  functions[2](); // Output: Index: 2
}
loopWithLetBlockScoping();


// Best Practice: IIFE (Immediately Invoked Function Expression) to create private scope
// This was a common pattern before `let`/`const` for creating private scopes and avoiding global pollution.
(function() {
  var privateVar = "I am private to this IIFE";
  // console.log(hiddenVar); // ReferenceError: hiddenVar is not defined (due to `let` in IIFE)
  let hiddenVar = "Another private var";

  console.log("\nInside IIFE:");
  console.log("privateVar:", privateVar); // Output: I am private to this IIFE
  console.log("hiddenVar:", hiddenVar);   // Output: Another private var

  function iifeFunction() {
    console.log("I am a function inside IIFE");
  }
  iifeFunction(); // Hoisted within IIFE's scope
})();

// console.log(privateVar); // ReferenceError: privateVar is not defined (IIFE created private scope)
// console.log(hiddenVar);  // ReferenceError: hiddenVar is not defined


// Best Practice: Function declaration vs. Function expression (modern preference)
console.log("\nFunction Declaration vs. Expression (Modern Preference):");

// Modernly, developers prefer defining all functions as const function expressions
// and defining them *before* they are called, even if function declarations are hoisted.
// This makes the code's execution flow more predictable and avoids relying on hoisting.

// const myUtilityFunction = () => { // If defined here, can't be called before this line
//   console.log("I am a utility function.");
// };

myBetterUtilityFunction(); // This works due to function declaration hoisting
function myBetterUtilityFunction() {
  console.log("I am a utility function declared with 'function'.");
}

const anotherUtility = function() { // This is a function expression assigned to const
  console.log("I am another utility function (expression).");
};
anotherUtility();

/*
  Explanation:
  - **Pitfall 1:** Demonstrates how undeclared variables (without `var`, `let`, `const`) become global in non-strict mode. Hoisting doesn't *prevent* this, but `strict mode` (recommended for all modern JS) would make it a `ReferenceError`.
  - **Pitfall 2 (`var` in loops):** Shows the classic closure problem with `var` due to its function-scope hoisting. All `i` in the `functions` array refer to the *same* `i` variable that ends up as `3` after the loop.
  - **`let` in loops:** Solves the above problem because `let` is block-scoped. A new `j` variable is created for each iteration of the loop, correctly capturing the current index.
  - **IIFE:** Illustrates how IIFEs were used (and still can be) to create private scopes and manage variable visibility *before* ES6 `let`/`const` provided native block-scoping. Variables inside the IIFE (even `var`) are hoisted *only* within that IIFE's scope, preventing global pollution.
  - **Modern Function Definition:** Highlights the current preference for `const` function expressions over function declarations in many codebases. While function declarations are fully hoisted, explicitly defining functions before their use makes the code easier to read and reason about, reducing reliance on implicit hoisting behavior.
*/
  return (
    <View>
      <Text>Hoisting</Text>
    </View>
  )
}

export default Hoisting