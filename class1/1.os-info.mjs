import {
  platform,
  release,
  hostname,
  arch,
  cpus,
  freemem,
  totalmem,
  uptime
} from 'node:os'

console.log('Operative System Information')
console.log('_____________________________')

console.log('Operative System', platform())
console.log('Operative System version', release())
console.log('Host name', hostname())
console.log('Architecture', arch())
console.log('CPUs', cpus())
console.log('Free memory', freemem() / 1024 / 1024)
console.log('Memory', totalmem() / 1024 / 1024)
console.log('Uptime', uptime() / 60 / 60)
