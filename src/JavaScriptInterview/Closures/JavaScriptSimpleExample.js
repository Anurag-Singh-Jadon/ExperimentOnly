// A closure is a function that allows access to variables from its outer function and global variables,
//  even after the outer function has finished executing. This enables functions to "remember" their
//   environment. Some of the features of the closures are mentioned below:

function outer() {
    let outerVar = "I'm in the outer scope!";
    function inner() {
        console.log(outerVar);
    }
    return inner;
}
const closure = outer(); 
closure();

// Output

// I'm in the outer scope!

function outer() {
    const outerVar = 'I am from outer';

    function inner() {
        console.log(outerVar);
  }

    return inner;
}

const newClosure = outer();
newClosure();

// Output

// I'm in the outer scope!


const counter = (function () {
    let count = 0;

    return {
        increment: function () {
            count++;
            console.log(count);
        },
        reset: function () {
            count = 0;
            console.log("Counter reset");
        },
    };
})();

counter.increment(); 
counter.increment(); 
counter.reset();    