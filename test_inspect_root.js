const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const baseDir = 'c:/Users/ALICOM4/Desktop/ITEMS WEB/www';

const server = http.createServer((req, res) => {
  let cleanUrl = req.url.split('?')[0];
  if (cleanUrl === '/') cleanUrl = '/index.html';
  const filePath = path.join(baseDir, cleanUrl);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath);
    let type = 'text/html';
    if (ext === '.js') type = 'application/javascript';
    if (ext === '.css') type = 'text/css';
    if (ext === '.png') type = 'image/png';
    res.writeHead(200, { 'Content-Type': type });
    res.end(fs.readFileSync(filePath));
  } else {
    res.writeHead(404);
    res.end('404');
  }
});

server.listen(8695, () => {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  exec(`"${edgePath}" --headless --disable-gpu --virtual-time-budget=6000 --dump-dom "http://localhost:8695/index.html"`, (err, stdout) => {
    const rootStart = stdout.indexOf('<div id="root">');
    console.log('--- ROOT CONTENT AFTER REACT 18 MOUNT ---');
    console.log(stdout.substring(rootStart, rootStart + 1200));
    server.close();
    process.exit(0);
  });
});
