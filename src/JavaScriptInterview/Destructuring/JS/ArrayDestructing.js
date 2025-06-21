// Basic Array Destructuring
const colors = ['red', 'green', 'blue'];
const [firstColor, secondColor, thirdColor] = colors;
console.log(firstColor); // red

// Basic Object Destructuring
const user = { id: 1, name: 'Alice', age: 30 };
const { name, age } = user;
console.log(name); // Alice

// Scenario: Getting specific items from a fixed-length array response
const sensorReadings = [10.5, 12.1, 9.8, 11.2, 13.0]; // [temperature, humidity, pressure, windSpeed, light]
const [temperature, , pressure, , light] = sensorReadings;
console.log("Temperature:", temperature); // 10.5
console.log("Pressure:", pressure);     // 9.8
console.log("Light:", light);           // 13.0

// 2. Rest Parameter with Array Destructuring
// Scenario: Processing a list where the first few items have special meaning
const productDetails = ['Laptop Pro', 1200, 'Electronics', 'Premium', 'New Model', 'Fast CPU'];
const [productName, price, category, ...features] = productDetails;

console.log("Product Name:", productName); // Laptop Pro
console.log("Price:", price);             // 1200
console.log("Category:", category);       // Electronics
console.log("Features:", features);       // ['Premium', 'New Model', 'Fast CPU']


// 3. Default Values
// Scenario: Handling optional props or data points
const notifications = ['New Message', , 'Unread Email']; // Imagine the middle one is optionally present
const [msg1, msg2 = 'No New Notification', msg3] = notifications;

console.log(msg1); // New Message
console.log(msg2); // No New Notification
console.log(msg3); // Unread Email

// Important: Default values only apply for `undefined`, not `null` or empty strings.
const scores = [100, null, undefined];
const [score1, score2 = 0, score3 = 0] = scores;
console.log(score1); // 100
console.log(score2); // null (default not applied for null)
console.log(score3); // 0 (default applied for undefined)

// 4. Nested Array Destructuring

// Scenario: Structured data like coordinates or grouped settings
const userPreferences = [
  ['theme', 'dark'],
  ['notifications', true],
  ['privacy', ['location', false]], // Nested array
];

const [
  [pref1Name, pref1Value],
  [pref2Name, pref2Value],
  [pref3Name, [locationSettingName, locationSettingValue]]
] = userPreferences;

console.log("Theme:", pref1Value);           // dark
console.log("Notifications:", pref2Value);   // true
console.log("Location Setting Name:", locationSettingName); // location
console.log("Location Setting Value:", locationSettingValue); // false


