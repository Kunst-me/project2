//function greet (name) {
//    console.log ('hello', name);
// }

//const greeting = greet ('Tim')

//console.log(greeting);

//true if amount of characters is even, false if it is odd

function isNumberOfLettersEven (name) {
    if (name.length % 2 === 0) {
        return true
    } else {return false} 
}

//console.log (isNumberOfLettersEven('timi'));

function capitalize (name) {
    return name[0].toUpperCase () + name.slice(1)
}

// console.log (capitalize('timi'))

function greeting (message, name) {
    return `${greeting} ${capitalize(name)}`
}

console.log (greeting('hello','tim'));