'use strict';

const http = require('http');
const chalk = require('chalk');

const hostname = '127.0.0.1';
const port = 3000;
const server = http.createServer((req, res) => {
  console.log("recibí solicitud de "+chalk.green.bold.inverse("datos"))
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.write('<h1>Hello World</h1>');
  res.write('<p>más html</p>');
  res.end();
})
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
})
