import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const VarLetConstExamples = () => {

  useEffect(() => {
    // Wrap all examples in a useEffect with an empty dependency array
    // to ensure they run only once when the component mounts.
    console.log("--- Starting var, let, const Examples ---");

    // 1. Low-Level Examples: Basic Scoping and Hoisting
    console.log("\n--- Low-Level Examples ---");
    demonstrateVarScopeHoisting();
    demonstrateLetScopeTDZ();
    demonstrateConstScopeTDZImmutability();

    // 2. Medium-Level Examples: Closures and Loops
    console.log("\n--- Medium-Level Examples ---");
    varLoopClosure();
    letLoopClosure();
    constLoopClosure();

    // 3. High-Level Examples: Modern JavaScript Patterns and Best Practices
    console.log("\n--- High-Level Examples ---");
    createGlobalInNonStrictMode(); // Demonstrates a pitfall in non-strict mode (but will error in RN modules)
    processUserData({ name: "Alice", isAdmin: true });
    processUserData({ name: "Bob", isAdmin: false });
    demonstrateConstImmutability();

    console.log("\n--- var, let, const Examples Finished ---");

  }, []); // Empty dependency array ensures this effect runs only once on mount

  // --- Low-Level Examples ---

  const demonstrateVarScopeHoisting = () => {
    console.log("\n--- Low-Level: var ---");

    // Example 1.1: Function Scope
    function innerVarScope() {
      var x = 10;
      if (true) {
        var y = 20; // 'y' is also function-scoped, not block-scoped
        console.log("Inside if block (var) - x:", x);
        console.log("Inside if block (var) - y:", y);
      }
      console.log("Outside if block (var) - x:", x);
      console.log("Outside if block (var) - y:", y); // Still accessible!
    }
    innerVarScope();

    // Example 1.2: Hoisting (with undefined initialization)
    console.log("Before var declaration (hoisting):", myVar); // Output: undefined
    var myVar = "Hello var!";
    console.log("After var declaration:", myVar); // Output: Hello var!

    // Example 1.3: Redeclaration is allowed
    var a = 1;
    var a = 2; // No error
    console.log("Redeclared var 'a':", a); // Output: 2
  };

  const demonstrateLetScopeTDZ = () => {
    console.log("\n--- Low-Level: let ---");

    // Example 2.1: Block Scope
    function innerLetScope() {
      let x = 10;
      if (true) {
        let y = 20; // 'y' is block-scoped
        console.log("Inside if block (let) - x:", x);
        console.log("Inside if block (let) - y:", y);
      }
      console.log("Outside if block (let) - x:", x);
      // console.log("Outside if block (let) - y:", y); // ReferenceError: y is not defined
      console.log("// Uncomment above line to see: ReferenceError: y is not defined");
    }
    innerLetScope();

    // Example 2.2: Temporal Dead Zone (TDZ)
    try {
      // console.log("Before let declaration (TDZ):", myLet); // ReferenceError: Cannot access 'myLet' before initialization
      console.log("// Uncomment above line to see TDZ ReferenceError (myLet).");
    } catch (e) {
      console.error("TDZ Error (myLet):", e.message);
    }
    let myLet = "Hello let!";
    console.log("After let declaration:", myLet);

    // Example 2.3: Redeclaration is NOT allowed
    let b = 1;
    try {
      // let b = 2; // SyntaxError: 'b' has already been declared
      console.log("// Uncomment 'let b = 2;' to see SyntaxError for redeclaration.");
    } catch (e) {
      console.error("Redeclaration Error (b):", e.message);
    }
    console.log("Let 'b' after attempted redeclaration:", b);
  };

  const demonstrateConstScopeTDZImmutability = () => {
    console.log("\n--- Low-Level: const ---");

    // Example 3.1: Block Scope
    function innerConstScope() {
      const x = 10;
      if (true) {
        const y = 20; // 'y' is block-scoped
        console.log("Inside if block (const) - x:", x);
        console.log("Inside if block (const) - y:", y);
      }
      console.log("Outside if block (const) - x:", x);
      // console.log("Outside if block (const) - y:", y); // ReferenceError: y is not defined
      console.log("// Uncomment above line to see: ReferenceError: y is not defined");
    }
    innerConstScope();

    // Example 3.2: Temporal Dead Zone (TDZ) - Same as let
    try {
      // console.log("Before const declaration (TDZ):", myConst); // ReferenceError: Cannot access 'myConst' before initialization
      console.log("// Uncomment above line to see TDZ ReferenceError (myConst).");
    } catch (e) {
      console.error("TDZ Error (myConst):", e.message);
    }
    const myConst = "Hello const!";
    console.log("After const declaration:", myConst);

    // Example 3.3: Reassignment is NOT allowed
    const c = 1;
    try {
      // c = 2; // TypeError: Assignment to constant variable.
      console.log("// Uncomment 'c = 2;' to see TypeError for reassignment.");
    } catch (e) {
      console.error("Reassignment Error (c):", e.message);
    }
    console.log("Const 'c' after attempted reassignment:", c);

    // Example 3.4: Const with Objects/Arrays (reference is constant, content is mutable)
    const myObject = { name: "Alice" };
    myObject.name = "Bob"; // This is allowed! (Mutating the object, not reassigning the reference)
    console.log("Mutated const object:", myObject);

    try {
      // myObject = { name: "Charlie" }; // This is NOT allowed! (Reassigning the reference)
      console.log("// Uncomment 'myObject = { ... };' to see TypeError for object reassignment.");
    } catch (e) {
      console.error("Object Reassignment Error (myObject):", e.message);
    }
  };

  // --- Medium-Level Examples ---

  const varLoopClosure = () => {
    console.log("\n--- Medium-Level: var & Closures in Loops (Classic Pitfall) ---");
    var functions = [];
    for (var i = 0; i < 3; i++) {
      functions[i] = function() {
        console.log("var loop - Index:", i); // All will output 3
      };
    }
    console.log("Calling functions from var loop:");
    functions[0]();
    functions[1]();
    functions[2]();
  };

  const letLoopClosure = () => {
    console.log("\n--- Medium-Level: let in Loops (Block Scoping) ---");
    let functions = [];
    for (let j = 0; j < 3; j++) { // A new 'j' is created for each iteration
      functions[j] = function() {
        console.log("let loop - Index:", j);
      };
    }
    console.log("Calling functions from let loop:");
    functions[0]();
    functions[1]();
    functions[2]();
  };

  const constLoopClosure = () => {
    console.log("\n--- Medium-Level: const in Loops ---");
    let functions = [];
    for (let k = 0; k < 3; k++) {
      const value = k; // Const within the loop body, new for each iteration
      functions[k] = function() {
        console.log("const loop - Index:", value);
      };
    }
    console.log("Calling functions from const loop:");
    functions[0]();
    functions[1]();
    functions[2]();
  };

  // --- High-Level Examples ---

  const createGlobalInNonStrictMode = () => {
    console.log("\n--- High-Level: Modules and Strict Mode ---");
    // In React Native (which uses strict mode by default in modules),
    // undeclared variables will throw a ReferenceError.
    try {
      // accidentalGlobal = "Oops! I'm a global!"; // Uncomment to see ReferenceError
      // console.log("Attempted accidental global:", accidentalGlobal);
      console.log("In modern JS modules (like RN), undeclared variables cause a ReferenceError.");
    } catch (e) {
      console.error("Error creating accidental global (expected in strict mode):", e.message);
    }
  };

  const processUserData = (user) => {
    console.log(`\n--- High-Level: Block Scoping for Data Privacy (${user.name}) ---`);
    if (user.isAdmin) {
      const adminToken = "secretAdminToken"; // Exists ONLY within this 'if' block
      let adminLog = []; // Exists ONLY within this 'if' block
      adminLog.push(`Admin login for ${user.name}`);
      console.log("Admin actions permitted. Token:", adminToken);
      console.log("Admin log:", adminLog);
    } else {
      try {
        // console.log(adminToken); // ReferenceError: adminToken is not defined
        console.log("// Uncomment 'console.log(adminToken);' above to see ReferenceError.");
      } catch (e) {
        console.error("Attempt to access adminToken (expected error):", e.message);
      }
      console.log(`${user.name} is not an admin. No admin tokens here.`);
    }
  };

  const demonstrateConstImmutability = () => {
    console.log("\n--- High-Level: Immutability with const ---");

    const config = {
      appName: "MyAwesomeApp",
      version: "1.0.0"
    };

    // Attempt to change config reference:
    try {
      // config = { appName: "NewApp" }; // TypeError: Assignment to constant variable.
      console.log("// Uncomment 'config = {...};' to see TypeError for const object reassignment.");
    } catch (e) {
      console.error("Config reassignment error:", e.message);
    }

    // Mutating a const object's properties is allowed:
    config.version = "1.1.0"; // Allowed!
    console.log("Updated config version (mutation allowed):", config.version);

    // For true immutability (preventing property mutation too), use Object.freeze()
    const immutableConfig = Object.freeze({
      theme: "dark",
      settings: { notifications: true }
    });

    try {
      // immutableConfig.theme = "light"; // This will be silently ignored in non-strict, or throw TypeError in strict
      console.log("// Uncomment 'immutableConfig.theme = \"light\";' to see potential error (in strict mode) or silent failure.");
      immutableConfig.settings.notifications = false; // This is a shallow freeze, nested objects can still be mutated
    } catch (e) {
      console.error("Attempt to mutate frozen object (theme):", e.message);
    }

    console.log("Immutable config theme (after attempt):", immutableConfig.theme);
    console.log("Immutable config settings notifications (shallow freeze):", immutableConfig.settings.notifications);
  };


  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>`var`, `let`, `const` Examples</Text>
      <Text style={styles.description}>
        Open your Metro Bundler terminal or browser console to see the output logs.
        Some commented lines demonstrate errors; uncomment them one by one to observe the behavior.
      </Text>
      <Text style={styles.note}>
        In React Native, each JavaScript file is treated as a module, which automatically enables
        'strict mode'. This means some behaviors (like creating accidental global variables
        without `var`, `let`, or `const`) are prevented by throwing `ReferenceError`s,
        which is a good modern JavaScript practice.
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

export default VarLetConstExamples;