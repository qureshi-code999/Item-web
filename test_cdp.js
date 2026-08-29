const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/') reqPath = '/index.html';
  const filePath = path.join('c:/Users/ALICOM4/Desktop/ITEMS WEB/android/app/src/main/assets/public', reqPath);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath);
    let contentType = 'text/html';
    if (ext === '.js') contentType = 'application/javascript';
    if (ext === '.css') contentType = 'text/css';
    if (ext === '.png') contentType = 'image/png';
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(fs.readFileSync(filePath));
  } else {
    res.writeHead(404);
    res.end('Not found: ' + reqPath);
  }
});

server.listen(8999, () => {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const proc = exec(`"${edgePath}" --headless --remote-debugging-port=9222 http://localhost:8999/index.html`);
  
  setTimeout(() => {
    http.get('http://localhost:9222/json', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const pages = JSON.parse(data);
        const page = pages.find(p => p.url && p.url.includes('8999'));
        if (!page) {
          console.log('Page not found');
          cleanup();
          return;
        }
        
        // Connect websocket
        const WebSocket = (() => {
          try { return require('ws'); } catch(e) {
            // Write a simple raw WS or use CDP via fetch
            return null;
          }
        })();
        
        console.log('Target Page:', page.title, page.url);
        // Let's use CDP evaluate through chrome-remote-interface or direct HTTP if available
        cleanup();
      });
    });
  }, 2000);

  function cleanup() {
    server.close();
    proc.kill();
  }
});
