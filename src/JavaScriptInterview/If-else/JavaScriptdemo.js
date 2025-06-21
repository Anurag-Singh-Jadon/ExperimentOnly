// Basic if-else
let temperature = 25;
if (temperature > 30) {
  console.log("It's very hot!");
} else {
  console.log("It's a pleasant day.");
}
// Output: "It's a pleasant day."

// if-else if-else (for multiple conditions)
let score = 85;
if (score >= 90) {
  console.log("Grade: A");
} else if (score >= 80) {
  console.log("Grade: B");
} else if (score >= 70) {
  console.log("Grade: C");
} else {
  console.log("Grade: F");
}
// Output: "Grade: B"

// Nested if-else
let isLoggedIn = true;
let userRole = 'admin';

if (isLoggedIn) {
  console.log("User is logged in.");
  if (userRole === 'admin') {
    console.log("Welcome, Administrator!");
  } else if (userRole === 'editor') {
    console.log("Welcome, Editor!");
  } else {
    console.log("Welcome, User!");
  }
} else {
  console.log("Please log in to access the system.");
}
/*
Output:
User is logged in.
Welcome, Administrator!
*/

// Another nested example: checking multiple criteria
let age = 18;
let hasDrivingLicense = true;

if (age >= 18) {
  console.log("User is eligible to drive based on age.");
  if (hasDrivingLicense) {
    console.log("User can drive legally.");
  } else {
    console.log("User needs a driving license to drive legally.");
  }
} else {
  console.log("User is not old enough to drive.");
}
/*
Output:
User is eligible to drive based on age.
User can drive legally.
*/