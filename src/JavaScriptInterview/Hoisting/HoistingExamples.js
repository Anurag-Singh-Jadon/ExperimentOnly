import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const HoistingExamples = () => {

  useEffect(() => {
    // Wrap all examples in a useEffect with an empty dependency array
    // to ensure they run only once when the component mounts.
    console.log("--- Starting Hoisting Examples ---");

    // 1. Low-Level Examples (Pure JavaScript Hoisting)
    console.log("\n--- Low-Level Examples ---");
    demonstrateVarHoisting();
    demonstrateLetConstHoisting();
    demonstrateFunctionHoisting();

    // 2. Medium-Level Example (Hoisting in Function Scopes and Closures)
    console.log("\n--- Medium-Level Example ---");
    outerFunction();

    // 3. High-Level Example (Hoisting with Best Practices and Common Pitfalls)
    console.log("\n--- High-Level Example ---");
    // Note: Some high-level examples are designed to show errors or specific behaviors
    // that might require uncommenting to observe directly.
    createGlobalWithoutDeclaration(); // Call this to observe potential global variable creation (in non-strict mode)
    loopWithVarHoisting();
    loopWithLetBlockScoping();
    demonstrateIIFE(); // Call the IIFE wrapper function
    demonstrateModernFunctionDefinition();

    console.log("\n--- Hoisting Examples Finished ---");

  }, []); // Empty dependency array ensures this effect runs only once on mount

  // --- Low-Level Examples ---

  function demonstrateVarHoisting() {
    console.log("\n--- Low-Level: var Variable Hoisting ---");
    console.log("Value of 'a' before declaration:", a); // Output: undefined
    var a = 10;
    console.log("Value of 'a' after declaration:", a); // Output: 10
  }

  function demonstrateLetConstHoisting() {
    console.log("\n--- Low-Level: let and const (Temporal Dead Zone) ---");
    try {
      // console.log("Value of 'b' before declaration:", b); // This line would throw a ReferenceError
      console.log("// Uncomment above line to see: ReferenceError: Cannot access 'b' before initialization");
    } catch (e) {
      console.error(e.message);
    }
    let b = 20;
    console.log("Value of 'b' after declaration:", b); // Output: 20

    try {
      // console.log("Value of 'c' before declaration:", c); // This line would throw a ReferenceError
      console.log("// Uncomment above line to see: ReferenceError: Cannot access 'c' before initialization");
    } catch (e) {
      console.error(e.message);
    }
    const c = 30;
    console.log("Value of 'c' after declaration:", c); // Output: 30
  }

  function demonstrateFunctionHoisting() {
    console.log("\n--- Low-Level: Function Declaration Hoisting ---");
    greet(); // Output: Hello from hoisted function!

    function greet() {
      console.log("Hello from hoisted function!");
    }

    try {
      // console.log("Value of sayGoodbye before declaration:", sayGoodbye); // Output: undefined
      // sayGoodbye(); // TypeError: sayGoodbye is not a function (because at this point, sayGoodbye is undefined)
      console.log("// Uncomment above lines to see: TypeError: sayGoodbye is not a function");
    } catch (e) {
      console.error(e.message);
    }

    var sayGoodbye = function() { // This is a function expression
      console.log("Goodbye!");
    };
    sayGoodbye(); // Output: Goodbye!
  }

  // --- Medium-Level Example ---

  function outerFunction() {
    console.log("\n--- Medium-Level: Hoisting in Function Scopes and Closures ---");
    var globalVar = "I am global"; // Defined here for demonstration within this function

    console.log("Inside outerFunction:");
    console.log("globalVar (from outer):", globalVar); // Output: I am global (accessible from outer scope)
    console.log("outerVar (before declaration):", outerVar); // Output: undefined (var hoisted within outerFunction's scope)

    var outerVar = "I am in outerFunction";

    function innerFunction() {
      console.log("\nInside innerFunction:");
      console.log("globalVar (from inner):", globalVar); // Output: I am global (accessible from outer scope)
      console.log("outerVar (from inner):", outerVar);   // Output: I am in outerFunction (accessible from parent scope)
      
      try {
        // console.log("innerVar (before declaration):", innerVar); // ReferenceError: Cannot access 'innerVar' before initialization
        console.log("// Uncomment above line to see: ReferenceError: Cannot access 'innerVar' before initialization");
      } catch (e) {
        console.error(e.message);
      }
      
      let innerVar = "I am in innerFunction";
      console.log("innerVar (after declaration):", innerVar); // Output: I am in innerFunction

      callMeLater(); // Output: You called me!
      function callMeLater() {
        console.log("You called me!");
      }
    }

    innerFunction();
    try {
      // callMeLater(); // ReferenceError: callMeLater is not defined (it's hoisted only within innerFunction)
      console.log("// Uncomment above line to see: ReferenceError: callMeLater is not defined");
    } catch (e) {
      console.error(e.message);
    }
  }

  // --- High-Level Examples ---

  function createGlobalWithoutDeclaration() {
    console.log("\n--- High-Level: Unintended Global Variable (without strict mode) ---");
    // In React Native (which uses strict mode by default in modules), this will generally throw an error.
    // If you were in a non-strict environment (like an old browser script tag without 'use strict'),
    // 'accidentalGlobalVar' would become a global variable.
    try {
      // accidentalGlobalVar = "I am an accidental global!";
      // console.log("Uncomment 'accidentalGlobalVar' assignment to see potential error in strict mode.");
      // console.log("If this were non-strict mode, accidentalGlobalVar would be global:", accidentalGlobalVar);
      console.log("Note: In React Native, modules are strict by default. Undeclared variables will throw a ReferenceError.");
    } catch (e) {
      console.error("Caught error for accidental global variable:", e.message);
    }
  }

  function loopWithVarHoisting() {
    console.log("\n--- High-Level: `var` in Loops (Classic Pitfall) ---");
    var functions = [];
    for (var i = 0; i < 3; i++) {
      functions[i] = function() {
        console.log("Index (var):", i); // All will output 3
      };
    }
    functions[0](); // Output: Index: 3
    functions[1](); // Output: Index: 3
    functions[2](); // Output: Index: 3
  }

  function loopWithLetBlockScoping() {
    console.log("\n--- High-Level: `let` for Block Scoping in Loops (Best Practice) ---");
    let functions = [];
    for (let j = 0; j < 3; j++) { // 'j' is block-scoped, a new 'j' for each iteration
      functions[j] = function() {
        console.log("Index (let):", j); // Output: Index: 0, Index: 1, Index: 2
      };
    }
    functions[0](); // Output: Index: 0
    functions[1](); // Output: Index: 1
    functions[2](); // Output: Index: 2
  }

  function demonstrateIIFE() {
    console.log("\n--- High-Level: IIFE for Private Scope (Historical Best Practice) ---");
    (function() {
      var privateVar = "I am private to this IIFE";
      let hiddenVar = "Another private var (let in IIFE)";

      console.log("Inside IIFE:");
      console.log("privateVar:", privateVar);
      console.log("hiddenVar:", hiddenVar);

      function iifeFunction() {
        console.log("I am a function inside IIFE");
      }
      iifeFunction(); // Hoisted within IIFE's scope
    })();

    try {
      // console.log("privateVar outside IIFE:", privateVar); // ReferenceError
      console.log("// Uncomment above line to see: ReferenceError: privateVar is not defined");
    } catch (e) {
      console.error(e.message);
    }
    try {
      // console.log("hiddenVar outside IIFE:", hiddenVar); // ReferenceError
      console.log("// Uncomment above line to see: ReferenceError: hiddenVar is not defined");
    } catch (e) {
      console.error(e.message);
    }
  }

  function demonstrateModernFunctionDefinition() {
    console.log("\n--- High-Level: Function Declaration vs. Expression (Modern Preference) ---");

    myBetterUtilityFunction(); // This works due to function declaration hoisting
    function myBetterUtilityFunction() {
      console.log("I am a utility function declared with 'function'.");
    }

    // Attempting to call 'myUtilityFunction' here would result in a ReferenceError
    try {
      // myUtilityFunction();
      console.log("// Uncomment above line to see: ReferenceError: myUtilityFunction is not defined");
    } catch (e) {
      console.error(e.message);
    }

    const myUtilityFunction = () => { // Function expression assigned to const
      console.log("I am a utility function (expression assigned to const).");
    };
    myUtilityFunction(); // This now works after its definition

    const anotherUtility = function() { // Another function expression assigned to const
      console.log("I am another utility function (expression assigned to const).");
    };
    anotherUtility();
  }


  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>JavaScript Hoisting Examples</Text>
      <Text style={styles.description}>
        Open your Metro Bundler terminal or browser console to see the output logs.
        Some commented lines demonstrate errors; uncomment them one by one to observe the behavior.
      </Text>
      <Text style={styles.note}>
        In React Native, each file is a module, and modules run in 'strict mode' by default.
        This means some behaviors (like creating accidental global variables) are prevented
        by throwing errors, which is generally a good thing for robust code.
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },
  description: {
    fontSize: 16,
    marginBottom: 15,
    color: '#555',
    textAlign: 'center',
  },
  note: {
    fontSize: 14,
    color: '#888',
    fontStyle: 'italic',
    marginTop: 10,
    padding: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
  },
});

export default HoistingExamples;