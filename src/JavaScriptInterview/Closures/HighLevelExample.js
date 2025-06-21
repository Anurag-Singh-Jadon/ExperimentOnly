console.log('--- High-Level Example 1: Event Listeners in a Loop ---');

// Simulate DOM elements (in a real browser, these would be actual buttons)
const buttonData = ['Button 0', 'Button 1', 'Button 2'];

// --- Problematic Code (demonstrates closure pitfall) ---
console.log('\nProblematic Example (classic loop closure bug):');
for (var i = 0; i < buttonData.length; i++) {
  // `var` creates function-scoped 'i'.
  // By the time the click handler runs, the loop has finished, and 'i' is `buttonData.length`.
  setTimeout(function() { // Using setTimeout to simulate async event handler
    console.log(`(Problematic) You clicked: ${buttonData[i]} - Index: ${i}`);
  }, 100); // Small delay to show async nature
}
// Expected: Button 0, Button 1, Button 2
// Actual (will likely be): Undefined, Undefined, Undefined (due to i being 3 for all)

// --- Solution 1: Using an IIFE (Immediately Invoked Function Expression) ---
// The IIFE creates a new scope for each iteration, capturing the current 'i' value.
console.log('\nSolution 1 (IIFE):');
for (var j = 0; j < buttonData.length; j++) {
  (function(currentIndex) { // 'currentIndex' is a new variable for each iteration
    setTimeout(function() {
      console.log(`(IIFE Solution) You clicked: ${buttonData[currentIndex]} - Index: ${currentIndex}`);
    }, 100);
  })(j); // Pass current 'j' into the IIFE
}

// --- Solution 2: Using 'let' in the loop (Modern JavaScript) ---
// 'let' creates a new block-scoped variable for each iteration of the loop.
console.log('\nSolution 2 (Using "let"):');
for (let k = 0; k < buttonData.length; k++) {
  setTimeout(function() {
    console.log(`(let Solution) You clicked: ${buttonData[k]} - Index: ${k}`);
  }, 100);
}

// --- Solution 3: Using .forEach (Modern JavaScript) ---
console.log('\nSolution 3 (Using .forEach):');
buttonData.forEach((data, index) => {
  setTimeout(function() {
    console.log(`(forEach Solution) You clicked: ${data} - Index: ${index}`);
  }, 100);
});

console.log('\n--- High-Level Example 1 End ---\n');

