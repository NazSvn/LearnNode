const os = require('node:os');

console.log('Operative System Information');
console.log('_____________________________');

console.log('Operative System', os.platform());
console.log('Operative System version', os.release());
console.log('Host name', os.hostname());
console.log('Architecture', os.arch());
console.log('CPUs', os.cpus());
console.log('Free memory', os.freemem() / 1024 / 1024);
console.log('Memory', os.totalmem() / 1024 / 1024);
console.log('Uptime', os.uptime() / 60 / 60);
