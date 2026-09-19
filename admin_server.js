// ZS MART - UNIFIED MASTER ADMIN SERVER
// High performance native Node.js HTTP Server
const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec, execSync } = require('child_process');
const url = require('url');

const PORT = 8888;
const ROOT = __dirname;
const JSX_FILE = path.join(ROOT, 'INDEX.JSX');
const HTML_FILE = path.join(ROOT, 'index.html');
const PRODUCTS_JSON = path.join(ROOT, 'products.json');
const DSR_FILE = path.join(ROOT, 'dsr_data.json');
const RATES_FILE = path.join(ROOT, 'purchase_rates.json');
const SETTINGS_FILE = path.join(ROOT, 'settings.json');
const IMAGES_DIR = path.join(ROOT, 'images');

// Optional sharp for WebP compression
let sharp = null;
try {
  sharp = require('./node_modules/sharp');
} catch (e) {
  try { sharp = require('sharp'); } catch (e2) {}
}

function sendJson(res, statusCode, data) {
  const body = JSON.stringify(data);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
  });
  res.end(body);
}

function sendFile(res, filePath, contentType) {
  if (!fs.existsSync(filePath)) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
    return;
  }
  const stat = fs.statSync(filePath);
  res.writeHead(200, {
    'Content-Type': contentType,
    'Content-Length': stat.size,
    'Cache-Control': 'no-cache'
  });
  fs.createReadStream(filePath).pipe(res);
}

function getMimeType(file) {
  const ext = path.extname(file).toLowerCase();
  switch (ext) {
    case '.html': return 'text/html; charset=utf-8';
    case '.css': return 'text/css; charset=utf-8';
    case '.js': return 'application/javascript; charset=utf-8';
    case '.json': return 'application/json; charset=utf-8';
    case '.png': return 'image/png';
    case '.jpg':
    case '.jpeg': return 'image/jpeg';
    case '.webp': return 'image/webp';
    case '.svg': return 'image/svg+xml';
    case '.ico': return 'image/x-icon';
    default: return 'application/octet-stream';
  }
}


// ── LIVE CLOUD SYNC HELPER (Pushes instantly to GitHub & Vercel) ──
function liveCloudSync(message) {
  try {
    const gitCmd = `git add products.json settings.json images/ INDEX.JSX index.html app.js www/ style.css && git commit -m "${message || 'Live update from Admin Panel'}" && git push origin main`;
    exec(gitCmd, { cwd: ROOT }, (err, stdout, stderr) => {
      if (err) {
        console.warn('⚠️ Cloud Sync Notice (Local changes saved, cloud sync skipped):', err.message);
      } else {
        console.log('🚀 LIVE CLOUD SYNC SUCCESS: Updated GitHub & Vercel CDN for all phones & web!');
        if (stdout) console.log(stdout.trim());
      }
    });
  } catch(e) {
    console.warn('Sync error:', e.message);
  }
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        resolve({ raw: body });
      }
    });
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
    });
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${pathname}`);

  try {
    // 1. Dashboard View
    if (pathname === '/' || pathname === '/dashboard' || pathname === '/index.html') {
      const dashboardPath = path.join(ROOT, 'admin_dashboard.html');
      if (fs.existsSync(dashboardPath)) {
        return sendFile(res, dashboardPath, 'text/html; charset=utf-8');
      }
      return sendFile(res, path.join(ROOT, 'item_upload_portal.html'), 'text/html; charset=utf-8');
    }

    // 2. API: System Stats
    if (pathname === '/api/stats' && req.method === 'GET') {
      const pj = fs.existsSync(PRODUCTS_JSON) ? JSON.parse(fs.readFileSync(PRODUCTS_JSON, 'utf8')) : { products: [] };
      const dsr = fs.existsSync(DSR_FILE) ? JSON.parse(fs.readFileSync(DSR_FILE, 'utf8')) : { orders: [], expenses: [] };
      const imagesCount = fs.existsSync(IMAGES_DIR) ? fs.readdirSync(IMAGES_DIR).filter(f => /^d+./.test(f)).length : 0;
      
      const today = new Date().toISOString().slice(0, 10);
      const todayOrders = (dsr.orders || []).filter(o => o.date === today);
      const todaySales = todayOrders.reduce((sum, o) => sum + (Number(o.totalSale) || 0), 0);
      const todayProfit = todayOrders.reduce((sum, o) => sum + (Number(o.totalProfit) || 0), 0);

      return sendJson(res, 200, {
        ok: true,
        totalProducts: pj.products ? pj.products.length : 0,
        totalCategories: pj.categories ? pj.categories.length : 0,
        totalImages: imagesCount,
        totalOrders: (dsr.orders || []).length,
        todaySales,
        todayProfit
      });
    }

    // 3. API: Products GET
    if (pathname === '/api/products' && req.method === 'GET') {
      if (fs.existsSync(PRODUCTS_JSON)) {
        return sendFile(res, PRODUCTS_JSON, 'application/json; charset=utf-8');
      }
      return sendJson(res, 200, { products: [] });
    }

    // 4. API: Products POST (Add New Item)
    if (pathname === '/api/products' && req.method === 'POST') {
      const body = await parseBody(req);
      if (!body.name || body.price === undefined) {
        return sendJson(res, 400, { ok: false, error: 'Product name and price are required' });
      }

      // Read current products to calculate next ID
      const pj = JSON.parse(fs.readFileSync(PRODUCTS_JSON, 'utf8'));
      const maxId = pj.products.reduce((max, p) => Math.max(max, Number(p.id) || 0), 0);
      const newId = maxId + 1;

      const newProduct = {
        id: newId,
        name: String(body.name).trim().toUpperCase(),
        price: Number(body.price),
        categoryId: String(body.categoryId || 'general').trim(),
        categoryName: String(body.categoryName || 'General Items').trim()
      };
      if (body.priority) newProduct.priority = Number(body.priority);
      if (body.filterName) newProduct.filterName = String(body.filterName).trim();

      // Handle image upload if provided
      let ext = 'webp';
      if (body.imageBase64) {
        const base64Data = body.imageBase64.replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, '');
        const imgBuffer = Buffer.from(base64Data, 'base64');
        if (sharp) {
          await sharp(imgBuffer)
            .resize(500, 500, { fit: 'inside', withoutEnlargement: true })
            .webp({ quality: 82 })
            .toFile(path.join(IMAGES_DIR, `${newId}.webp`));
          ext = 'webp';
        } else {
          fs.writeFileSync(path.join(IMAGES_DIR, `${newId}.png`), imgBuffer);
          ext = 'png';
        }
      }

      // Append to INDEX.JSX
      let jsxContent = fs.readFileSync(JSX_FILE, 'utf8');
      const prodMatch = jsxContent.match(/(?:const|var)\s+PRODUCTS\s*=\s*\[/);
      if (prodMatch) {
        const insertIdx = prodMatch.index + prodMatch[0].length;
        const prioStr = newProduct.priority ? `, priority: ${newProduct.priority}` : '';
        const filterStr = newProduct.filterName ? `, filterName: "${newProduct.filterName}"` : '';
        const newLine = `\n      { id: ${newProduct.id}, name: "${newProduct.name.replace(/"/g, '\\"')}", price: ${newProduct.price}, categoryId: "${newProduct.categoryId}", categoryName: "${newProduct.categoryName}"${prioStr}${filterStr} },`;
        jsxContent = jsxContent.slice(0, insertIdx) + newLine + jsxContent.slice(insertIdx);
        fs.writeFileSync(JSX_FILE, jsxContent, 'utf8');
      }

      // Save purchase rate if provided
      if (body.purchasePrice !== undefined) {
        let rates = { rates: {} };
        if (fs.existsSync(RATES_FILE)) {
          try { rates = JSON.parse(fs.readFileSync(RATES_FILE, 'utf8')); } catch(e) {}
        }
        if (!rates.rates) rates.rates = {};
        rates.rates[String(newId)] = Number(body.purchasePrice);
        rates.updatedAt = new Date().toISOString();
        fs.writeFileSync(RATES_FILE, JSON.stringify(rates, null, 2), 'utf8');
      }

      // Run export_products to sync products.json and index.html
      delete require.cache[require.resolve('./export_products.js')];
      require('./export_products.js');
      try { execSync('node compile_jsx.js', { cwd: ROOT }); } catch(e) {}
      liveCloudSync('Admin added new product #' + newId + ' (' + newProduct.name + ')');

      return sendJson(res, 200, { ok: true, product: newProduct });
    }

    // 5. API: Products PUT (Edit Existing Item)
    if (pathname.startsWith('/api/products/') && req.method === 'PUT') {
      const id = parseInt(pathname.split('/').pop(), 10);
      const body = await parseBody(req);
      if (!id) return sendJson(res, 400, { ok: false, error: 'Invalid product ID' });

      let jsxContent = fs.readFileSync(JSX_FILE, 'utf8');
      const itemRegex = new RegExp(`\\{\\s*id:\\s*${id}\\s*,[^\\}]*\\}`, 'm');
      const match = jsxContent.match(itemRegex);

      if (!match) {
        return sendJson(res, 404, { ok: false, error: 'Product not found in INDEX.JSX' });
      }

      const currentItemStr = match[0];
      let updatedItemStr = currentItemStr;

      if (body.name) {
        updatedItemStr = updatedItemStr.replace(/name:\s*"[^"]*"/, `name: "${body.name.trim().replace(/"/g, '\\"')}"`);
      }
      if (body.price !== undefined) {
        updatedItemStr = updatedItemStr.replace(/price:\s*\d+/, `price: ${Number(body.price)}`);
      }
      if (body.categoryId) {
        updatedItemStr = updatedItemStr.replace(/categoryId:\s*"[^"]*"/, `categoryId: "${body.categoryId.trim()}"`);
      }
      if (body.categoryName) {
        updatedItemStr = updatedItemStr.replace(/categoryName:\s*"[^"]*"/, `categoryName: "${body.categoryName.trim()}"`);
      }
      if (body.priority !== undefined) {
        if (/priority:\s*\d+/.test(updatedItemStr)) {
          updatedItemStr = updatedItemStr.replace(/priority:\s*\d+/, `priority: ${Number(body.priority)}`);
        } else {
          updatedItemStr = updatedItemStr.replace(/(\s*\})$/, `, priority: ${Number(body.priority)}$1`);
        }
      }

      jsxContent = jsxContent.replace(currentItemStr, updatedItemStr);
      fs.writeFileSync(JSX_FILE, jsxContent, 'utf8');

      // Update purchase rate
      if (body.purchasePrice !== undefined) {
        let rates = { rates: {} };
        if (fs.existsSync(RATES_FILE)) {
          try { rates = JSON.parse(fs.readFileSync(RATES_FILE, 'utf8')); } catch(e) {}
        }
        if (!rates.rates) rates.rates = {};
        rates.rates[String(id)] = Number(body.purchasePrice);
        rates.updatedAt = new Date().toISOString();
        fs.writeFileSync(RATES_FILE, JSON.stringify(rates, null, 2), 'utf8');
      }

      // Handle image update if sent
      if (body.imageBase64) {
        const base64Data = body.imageBase64.replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, '');
        const imgBuffer = Buffer.from(base64Data, 'base64');
        if (sharp) {
          await sharp(imgBuffer)
            .resize(500, 500, { fit: 'inside', withoutEnlargement: true })
            .webp({ quality: 82 })
            .toFile(path.join(IMAGES_DIR, `${id}.webp`));
        } else {
          fs.writeFileSync(path.join(IMAGES_DIR, `${id}.png`), imgBuffer);
        }
      }

      delete require.cache[require.resolve('./export_products.js')];
      require('./export_products.js');
      try { execSync('node compile_jsx.js', { cwd: ROOT }); } catch(e) {}
      liveCloudSync('Admin updated product #' + id);

      return sendJson(res, 200, { ok: true, id });
    }

    // 6. API: DSR Sales GET
    if (pathname === '/api/dsr' && req.method === 'GET') {
      if (fs.existsSync(DSR_FILE)) {
        return sendFile(res, DSR_FILE, 'application/json; charset=utf-8');
      }
      return sendJson(res, 200, { orders: [], expenses: [] });
    }

    // 7. API: DSR Order POST
    if (pathname === '/api/dsr/order' && req.method === 'POST') {
      const body = await parseBody(req);
      let dsr = { orders: [], expenses: [] };
      if (fs.existsSync(DSR_FILE)) {
        try { dsr = JSON.parse(fs.readFileSync(DSR_FILE, 'utf8')); } catch(e) {}
      }
      if (!Array.isArray(dsr.orders)) dsr.orders = [];

      const orderId = body.id || 'ORD-' + Date.now();
      const orderRecord = {
        id: orderId,
        date: body.date || new Date().toISOString().slice(0, 10),
        time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
        channel: body.channel || 'shop',
        customerName: body.customerName || 'Walk-in Customer',
        customerPhone: body.customerPhone || '',
        items: body.items || [],
        totalSale: Number(body.totalSale) || 0,
        totalCost: Number(body.totalCost) || 0,
        totalProfit: Number(body.totalProfit) || 0
      };

      dsr.orders.unshift(orderRecord);
      fs.writeFileSync(DSR_FILE, JSON.stringify(dsr, null, 2), 'utf8');

      // Update purchase rates if provided
      if (body.updatedRates && Object.keys(body.updatedRates).length > 0) {
        let rates = { rates: {} };
        if (fs.existsSync(RATES_FILE)) {
          try { rates = JSON.parse(fs.readFileSync(RATES_FILE, 'utf8')); } catch(e) {}
        }
        if (!rates.rates) rates.rates = {};
        Object.assign(rates.rates, body.updatedRates);
        rates.updatedAt = new Date().toISOString();
        fs.writeFileSync(RATES_FILE, JSON.stringify(rates, null, 2), 'utf8');
      }

      return sendJson(res, 200, { ok: true, order: orderRecord });
    }

    // 8. API: DSR Expense POST
    if (pathname === '/api/dsr/expense' && req.method === 'POST') {
      const body = await parseBody(req);
      let dsr = { orders: [], expenses: [] };
      if (fs.existsSync(DSR_FILE)) {
        try { dsr = JSON.parse(fs.readFileSync(DSR_FILE, 'utf8')); } catch(e) {}
      }
      if (!Array.isArray(dsr.expenses)) dsr.expenses = [];

      const expense = {
        id: 'EXP-' + Date.now(),
        date: body.date || new Date().toISOString().slice(0, 10),
        title: body.title || 'General Expense',
        amount: Number(body.amount) || 0,
        category: body.category || 'misc'
      };

      dsr.expenses.unshift(expense);
      fs.writeFileSync(DSR_FILE, JSON.stringify(dsr, null, 2), 'utf8');
      return sendJson(res, 200, { ok: true, expense });
    }

    // 9. API: Purchase Rates GET
    if (pathname === '/api/purchase-rates' && req.method === 'GET') {
      if (fs.existsSync(RATES_FILE)) {
        return sendFile(res, RATES_FILE, 'application/json; charset=utf-8');
      }
      return sendJson(res, 200, { rates: {} });
    }

    // 9b. API: Settings GET
    if (pathname === '/api/settings' && req.method === 'GET') {
      const defaults = { deliveryFee: 150, freeDeliveryThreshold: 2000, deliveryTiming: 'Delivery Timing: 10:00 AM – 10:00 PM', whatsapp: '923368945775', storeName: 'ZS Mart', announcement: '' };
      if (fs.existsSync(SETTINGS_FILE)) {
        try {
          const stored = JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf8'));
          return sendJson(res, 200, { ok: true, ...defaults, ...stored });
        } catch(e) {}
      }
      return sendJson(res, 200, { ok: true, ...defaults });
    }

    // 9c. API: Settings POST (Save)
    if (pathname === '/api/settings' && req.method === 'POST') {
      const body = await parseBody(req);
      let current = { deliveryFee: 150, freeDeliveryThreshold: 2000, deliveryTiming: 'Delivery Timing: 10:00 AM – 10:00 PM', whatsapp: '923368945775', storeName: 'ZS Mart', announcement: '' };
      if (fs.existsSync(SETTINGS_FILE)) {
        try { current = JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf8')); } catch(e) {}
      }
      const newSettings = { ...current };
      if (body.deliveryFee !== undefined) newSettings.deliveryFee = Number(body.deliveryFee);
      if (body.freeDeliveryThreshold !== undefined) newSettings.freeDeliveryThreshold = Number(body.freeDeliveryThreshold);
      if (body.deliveryTiming !== undefined) newSettings.deliveryTiming = String(body.deliveryTiming).trim();
      if (body.whatsapp !== undefined) newSettings.whatsapp = String(body.whatsapp).trim();
      if (body.announcement !== undefined) newSettings.announcement = String(body.announcement).trim();
      fs.writeFileSync(SETTINGS_FILE, JSON.stringify(newSettings, null, 2), 'utf8');

      // Also copy settings.json to www/ and android assets so app picks it up
      const wwwSettings = path.join(ROOT, 'www', 'settings.json');
      const apkSettings = path.join(ROOT, 'android', 'app', 'src', 'main', 'assets', 'public', 'settings.json');
      try { fs.copyFileSync(SETTINGS_FILE, wwwSettings); } catch(e) {}
      try { fs.copyFileSync(SETTINGS_FILE, apkSettings); } catch(e) {}

      delete require.cache[require.resolve('./export_products.js')];
      require('./export_products.js');
      try { execSync('node compile_jsx.js', { cwd: ROOT }); } catch(e) {}
      liveCloudSync('Admin updated store delivery settings');

      console.log('Settings saved and synced live:', newSettings);
      return sendJson(res, 200, { ok: true, settings: newSettings });
    }

    // 10. API: 1-Click LIVE PUBLISH
    if (pathname === '/api/publish' && req.method === 'POST') {
      console.log('Publish triggered! Compiling JSX, updating products.json & syncing to GitHub...');
      try {
        delete require.cache[require.resolve('./export_products.js')];
        require('./export_products.js');
        const compileOut = execSync('node compile_jsx.js', { encoding: 'utf8', cwd: ROOT });
        
        let gitOut = '';
        try {
          gitOut = execSync('git add products.json settings.json images/ INDEX.JSX index.html app.js www/ style.css && git commit -m "1-Click Live Publish to App & Web" && git push origin main', { encoding: 'utf8', cwd: ROOT });
        } catch(gitErr) {
          gitOut = (gitErr.stdout || '') + '\n' + (gitErr.stderr || '') + '\n' + gitErr.message;
        }

        const fullLog = compileOut + '\n\n================================================================\n' +
                        '🚀 CLOUD LIVE SYNC TO GITHUB & VERCEL:\n' +
                        (gitOut.trim() || 'Everything up-to-date on GitHub!') + '\n' +
                        '================================================================\n' +
                        '✅ ALL PHONES & WEB USERS WILL RECEIVE THESE UPDATES INSTANTLY!';
        return sendJson(res, 200, { ok: true, output: fullLog });
      } catch (err) {
        console.error('Publish error:', err.message);
        return sendJson(res, 500, { ok: false, error: err.message, output: err.stdout || err.stderr });
      }
    }

    // 11. API: Build Android APK
    if (pathname === '/api/build-apk' && req.method === 'POST') {
      console.log('APK build requested...');
      exec('cmd.exe /c BUILD_ANDROID_APK.bat', { cwd: ROOT });
      return sendJson(res, 200, { ok: true, message: 'Android APK build started in background. Check Desktop in ~2 minutes!' });
    }

    // 12. Static Assets (Images, styles, fonts)
    const filePath = path.join(ROOT, pathname);
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      return sendFile(res, filePath, getMimeType(filePath));
    }

    // Default 404
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');

  } catch (err) {
    console.error('Server error:', err);
    sendJson(res, 500, { ok: false, error: err.message });
  }
});

server.listen(PORT, () => {
  console.log('================================================================');
  console.log(`  ZS MART UNIFIED MASTER DASHBOARD RUNNING ON:`);
  console.log(`  👉 http://localhost:${PORT}/`);
  console.log('================================================================');
  try {
    exec(`start http://localhost:${PORT}/`);
  } catch(e) {}
});
