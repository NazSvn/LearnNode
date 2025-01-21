const fs = require('node:fs')

console.log('reading 1st file')

// reading synchronously

const text = fs.readFileSync('./file.txt', 'utf-8')

console.log(text)

console.log('----> doing something else while reading')

console.log('reading 2nd file')

const secondtext = fs.readFileSync('./file2.txt', 'utf-8')

console.log(secondtext)
