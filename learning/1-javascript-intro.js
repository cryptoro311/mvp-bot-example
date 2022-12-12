//
// Basic Javascript Intro
// A few things that are just helpful to know when reading the "bot" files
//

// Storing variables

const a = 'test' // "const" means "set this once and it cannot be overwritten
let b = 'test' // "let" means "at any point you can playground `b = 'something' again` and overwrite it

// Types of data

const exampleString = 'example' // string – some sort of text
const exampleObject = { foo: 'bar' } // object – structured data
const exampleArray = ['one', 'two', 'three'] // array – group of other data types (strings, arrays, etc.)

// Functions

const run = () => {
  // This is the inside of a function
  console.log("We're inside!")
}

run()

// Promises

const fetchSomeRemoteData = () => {
  return new Promise((resolve, reject) => {
    try {
      setTimeout(() => {
        resolve('We made it!')
      }, 2000)
    } catch (err) {
      reject()
    }
  })
}

// Async/Await

const runAsync = async () => {
  // This is the inside of a function
  console.log('This will run immediately...')
  const responseMessage = await fetchSomeRemoteData()
  console.log("This will run after we've fetched the data", responseMessage)
}

runAsync()
