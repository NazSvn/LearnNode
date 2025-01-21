const http = require('node:http')
const fs = require('node:fs')
const { availablePort } = require('./findOpenPort.js')

const desiredPort = process.env.PORT ?? 3000

const processRequest = (req, res) => {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8')

  if (req.url === '/') {
    res.statusCode = 200
    res.end('Hi there! cómo estas hoy?')
  } else if (req.url === '/contact') {
    res.statusCode = 200
    res.end('<h1>contact</h1>')
  } else if (req.url === '/image.png') {
    fs.readFile('./this.png', (err, data) => {
      if (err) {
        res.statusCode = 500
        res.end('500 Internal Server Error')
      } else {
        res.setHeader('Content-Type', 'image/png')
        res.end(data)
      }
    })
  } else {
    res.statusCode = 404
    res.end('<h1>404</h1>')
  }
}

const server = http.createServer(processRequest)

/* server.listen(0, () => {
  console.log(
    `server listening on port http://localhost:${server.address().port}`
  )
})
 */

availablePort(desiredPort).then((port) => {
  server.listen(port, () => {
    console.log(`server listening on port http://localhost:${port}`)
  })
})
