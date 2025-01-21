const fs = require('node:fs/promises')
//reading synchronously

Promise.all([
  fs.readFile('./file.txt', 'utf-8'),
  fs.readFile('./file2.txt', 'utf-8'),
]).then(([text, secondtext]) => {
  console.log(text)
  console.log(secondtext)
})
