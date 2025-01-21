const fs = require('node:fs/promises')

console.log('reading 1st file')
// reading synchronously
fs.readFile('./file.txt', 'utf-8').then((text) => {
  console.log(text)
})

console.log('----> doing something else while reading')

console.log('reading 2nd file')

fs.readFile('./file2.txt', 'utf-8').then((secondtext) => {
  console.log(secondtext)
})
