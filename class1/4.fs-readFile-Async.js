const fs = require('node:fs')

console.log('reading 1st afile')
//reading Asynchronously
fs.readFile('./file.txt', 'utf-8', (err, text) => {
  console.log('atext1:', text)
})

console.log('----> doing something else while reading')

console.log('reading 2nd afile')

fs.readFile('./file2.txt', 'utf-8', (err, secondtext) => {
  console.log('atext2:', secondtext)
})
