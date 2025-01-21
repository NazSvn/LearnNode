const path = require('node:path');

// space bar according to SO
console.log(path.sep);

// to join paths with path.join

const filePath = path.join('content', 'subfolder', 'test.txt');

console.log(filePath);

const base = path.basename('/tmp/emp/files/password.txt');

console.log(base);

const fileName = path.basename('/tmp/emp/files/password.txt', '.txt');

console.log(fileName);

const extension = path.extname('/tmp/emp/files/password.txt');

console.log(extension);
