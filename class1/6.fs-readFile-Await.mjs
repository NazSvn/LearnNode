import { readFile } from 'node:fs/promises';

console.log('reading 1st afile');
//reading Asynchronously
const text = await readFile('./file.txt', 'utf-8');
console.log('atext1:', text);

console.log('----> doing something else while reading');

console.log('reading 2nd afile');

const secondtext = await readFile('./file2.txt', 'utf-8');
console.log('atext2:', secondtext);
