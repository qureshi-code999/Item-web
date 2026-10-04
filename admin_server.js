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
const SECTIONS_FILE = path.join(ROOT, 'purchasing_sections.json');
const PURCHASING_SHEETS_FILE = path.join(ROOT, 'purchasing_sheets.json');
const CAT_PRIORITIES_FILE = path.join(ROOT, 'category_priorities.json');

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
    const safeMsg = (message || 'Live update from Admin Panel').replace(/"/g, "'");
    const gitCmd = `git add products.json settings.json category_priorities.json images INDEX.JSX index.html app.js style.css sw.js purchase_rates.json purchasing_sections.json purchasing_sheets.json dsr_data.json admin_dashboard.html admin_server.js && git commit -m "${safeMsg}" && git push origin main`;
    exec(gitCmd, { cwd: ROOT }, (err, stdout, stderr) => {
      if (err) {
        if (err.message && err.message.includes('nothing to commit')) {
          console.log('ℹ️ Git status: Everything already up to date on GitHub.');
        } else {
          console.warn('⚠️ Cloud Sync Notice:', err.message);
        }
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
    // 1. Dashboard View (Root / Dashboard / Admin)
    if (pathname === '/' || pathname === '/dashboard' || pathname === '/admin' || pathname === '/admin_dashboard.html') {
      const dashboardPath = path.join(ROOT, 'admin_dashboard.html');
      if (fs.existsSync(dashboardPath)) {
        return sendFile(res, dashboardPath, 'text/html; charset=utf-8');
      }
      return sendJson(res, 404, { ok: false, error: 'admin_dashboard.html not found' });
    }

    // 1b. Customer Store Web (/index.html or /store or /shop)
    if (pathname === '/index.html' || pathname === '/store' || pathname === '/shop') {
      const indexPath = path.join(ROOT, 'index.html');
      if (fs.existsSync(indexPath)) {
        return sendFile(res, indexPath, 'text/html; charset=utf-8');
      }
    }

// Helper to sync single image to www and android assets immediately
function syncImageToTargets(fileName) {
  const src = path.join(IMAGES_DIR, fileName);
  if (!fs.existsSync(src)) return;
  const targets = [
    path.join(ROOT, 'www', 'images', fileName),
    path.join(ROOT, 'android', 'app', 'src', 'main', 'assets', 'public', 'images', fileName)
  ];
  targets.forEach(t => {
    try {
      const d = path.dirname(t);
      if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
      fs.copyFileSync(src, t);
    } catch (e) {}
  });
}

    // 2. API: System Stats
    if (pathname === '/api/stats' && req.method === 'GET') {
      const pj = fs.existsSync(PRODUCTS_JSON) ? JSON.parse(fs.readFileSync(PRODUCTS_JSON, 'utf8')) : { products: [] };
      const dsr = fs.existsSync(DSR_FILE) ? JSON.parse(fs.readFileSync(DSR_FILE, 'utf8')) : { orders: [], expenses: [] };
      const imagesCount = fs.existsSync(IMAGES_DIR) ? fs.readdirSync(IMAGES_DIR).filter(f => /^\d+\.(webp|png|jpg|jpeg)$/i.test(f)).length : 0;
      
      const today = new Date().toISOString().slice(0, 10);
      const todayOrders = (dsr.orders || []).filter(o => o.date === today);
      const todaySales = todayOrders.reduce((sum, o) => sum + (Number(o.totalSale) || 0), 0);
      const todayProfit = todayOrders.reduce((sum, o) => sum + (Number(o.totalProfit) || 0), 0);
      const todayExpenses = (dsr.expenses || []).filter(e => e.date === today).reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
      const todayNetProfit = todayProfit - todayExpenses;

      return sendJson(res, 200, {
        ok: true,
        totalProducts: pj.products ? pj.products.length : 0,
        totalCategories: pj.categories ? pj.categories.length : 0,
        totalImages: imagesCount,
        totalOrders: (dsr.orders || []).length,
        todaySales,
        todayProfit,
        todayExpenses,
        todayNetProfit
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

      // Handle image upload if provided (Always save as optimized WebP)
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
          fs.writeFileSync(path.join(IMAGES_DIR, `${newId}.webp`), imgBuffer);
          ext = 'webp';
        }
        syncImageToTargets(`${newId}.${ext}`);
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
        const prioNum = Number(body.priority);
        if (prioNum > 0) {
          if (/priority:\s*\d+/.test(updatedItemStr)) {
            updatedItemStr = updatedItemStr.replace(/priority:\s*\d+/, `priority: ${prioNum}`);
          } else {
            updatedItemStr = updatedItemStr.replace(/(\s*\})$/, `, priority: ${prioNum}$1`);
          }
        } else {
          // Remove priority if 0 or cleared
          updatedItemStr = updatedItemStr.replace(/,?\s*priority:\s*\d+/, '');
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

      // Handle image update if sent (Always save as optimized WebP)
      if (body.imageBase64) {
        const base64Data = body.imageBase64.replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, '');
        const imgBuffer = Buffer.from(base64Data, 'base64');
        let imgExt = 'webp';
        if (sharp) {
          await sharp(imgBuffer)
            .resize(500, 500, { fit: 'inside', withoutEnlargement: true })
            .webp({ quality: 82 })
            .toFile(path.join(IMAGES_DIR, `${id}.webp`));
          imgExt = 'webp';
        } else {
          fs.writeFileSync(path.join(IMAGES_DIR, `${id}.webp`), imgBuffer);
          imgExt = 'webp';
        }
        // Remove stale png if it existed
        try {
          const oldPng = path.join(IMAGES_DIR, `${id}.png`);
          if (fs.existsSync(oldPng)) fs.unlinkSync(oldPng);
        } catch(e) {}

        syncImageToTargets(`${id}.${imgExt}`);
      }

      delete require.cache[require.resolve('./export_products.js')];
      require('./export_products.js');
      try { execSync('node compile_jsx.js', { cwd: ROOT }); } catch(e) {}
      liveCloudSync('Admin updated product #' + id);

      return sendJson(res, 200, { ok: true, id });
    }

    // 5b. API: Products DELETE
    if (pathname.startsWith('/api/products/') && req.method === 'DELETE') {
      const id = parseInt(pathname.split('/').pop(), 10);
      if (!id) return sendJson(res, 400, { ok: false, error: 'Invalid product ID' });

      let jsxContent = fs.readFileSync(JSX_FILE, 'utf8');
      const itemRegex = new RegExp(`\\s*\\{\\s*id:\\s*${id}\\s*,[^\\}]*\\},?`, 'm');
      if (!itemRegex.test(jsxContent)) {
        return sendJson(res, 404, { ok: false, error: 'Product not found in INDEX.JSX' });
      }

      jsxContent = jsxContent.replace(itemRegex, '');
      fs.writeFileSync(JSX_FILE, jsxContent, 'utf8');

      // Also remove from purchase rates
      if (fs.existsSync(RATES_FILE)) {
        try {
          const rates = JSON.parse(fs.readFileSync(RATES_FILE, 'utf8'));
          if (rates.rates && rates.rates[String(id)]) {
            delete rates.rates[String(id)];
            fs.writeFileSync(RATES_FILE, JSON.stringify(rates, null, 2), 'utf8');
          }
        } catch(e) {}
      }

      delete require.cache[require.resolve('./export_products.js')];
      require('./export_products.js');
      try { execSync('node compile_jsx.js', { cwd: ROOT }); } catch(e) {}
      liveCloudSync('Admin deleted product #' + id);

      return sendJson(res, 200, { ok: true, deletedId: id });
    }

    // 5c. API: Category Priority PUT
    if (pathname.startsWith('/api/categories/') && pathname.endsWith('/priority') && req.method === 'PUT') {
      const parts = pathname.split('/');
      const catId = parts[3];
      const body = await parseBody(req);
      if (!catId) return sendJson(res, 400, { ok: false, error: 'Invalid category ID' });

      const prioNum = Number(body.priority) || 0;
      let priorities = {};
      if (fs.existsSync(CAT_PRIORITIES_FILE)) {
        try { priorities = JSON.parse(fs.readFileSync(CAT_PRIORITIES_FILE, 'utf8')); } catch(e) {}
      }

      if (prioNum > 0) {
        priorities[catId] = prioNum;
      } else {
        delete priorities[catId];
      }

      fs.writeFileSync(CAT_PRIORITIES_FILE, JSON.stringify(priorities, null, 2), 'utf8');

      // Update INDEX.JSX DEFAULT_CATEGORIES directly
      try {
        let jsx = fs.readFileSync(JSX_FILE, 'utf8');
        const catRegex = new RegExp(`(\\{\\s*id:\\s*"${catId}"[^\n\\}]*)(\\s*\\})`, 'm');
        if (catRegex.test(jsx)) {
          let updatedCatLine = jsx.match(catRegex)[0];
          if (prioNum > 0) {
            if (/priority:\s*\d+/.test(updatedCatLine)) {
              updatedCatLine = updatedCatLine.replace(/priority:\s*\d+/, `priority: ${prioNum}`);
            } else {
              updatedCatLine = updatedCatLine.replace(/(\s*\})$/, `, priority: ${prioNum}$1`);
            }
          } else {
            updatedCatLine = updatedCatLine.replace(/,?\s*priority:\s*\d+/, '');
          }
          jsx = jsx.replace(catRegex, updatedCatLine);
          fs.writeFileSync(JSX_FILE, jsx, 'utf8');
        }
      } catch(e) {
        console.warn('JSX category priority update notice:', e.message);
      }

      delete require.cache[require.resolve('./export_products.js')];
      require('./export_products.js');
      try { execSync('node compile_jsx.js', { cwd: ROOT }); } catch(e) {}
      liveCloudSync(`Admin updated category '${catId}' priority to ${prioNum > 0 ? prioNum : 'default'}`);

      let updatedCategories = [];
      try {
        const pj = JSON.parse(fs.readFileSync(PRODUCTS_JSON, 'utf8'));
        updatedCategories = pj.categories || [];
      } catch(e) {}

      return sendJson(res, 200, { ok: true, catId, priority: prioNum, categories: updatedCategories });
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
        paymentMethod: body.paymentMethod || 'cash',
        customerName: body.customerName || 'Walk-in Customer',
        customerPhone: body.customerPhone || '',
        items: body.items || [],
        totalSale: Number(body.totalSale) || 0,
        totalCost: Number(body.totalCost) || 0,
        totalProfit: Number(body.totalProfit) || 0
      };

      dsr.orders.unshift(orderRecord);
      fs.writeFileSync(DSR_FILE, JSON.stringify(dsr, null, 2), 'utf8');

      // Auto-update purchase rates from order items and/or updatedRates
      let rates = { rates: {} };
      if (fs.existsSync(RATES_FILE)) {
        try { rates = JSON.parse(fs.readFileSync(RATES_FILE, 'utf8')); } catch(e) {}
      }
      if (!rates.rates) rates.rates = {};
      let ratesChanged = false;

      if (Array.isArray(body.items)) {
        body.items.forEach(it => {
          if (it.id && it.purchasePrice !== undefined && Number(it.purchasePrice) > 0) {
            rates.rates[String(it.id)] = Number(it.purchasePrice);
            ratesChanged = true;
          }
        });
      }
      if (body.updatedRates && Object.keys(body.updatedRates).length > 0) {
        Object.assign(rates.rates, body.updatedRates);
        ratesChanged = true;
      }
      if (ratesChanged) {
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

    // 9. API: Purchase Rates GET & POST
    if (pathname === '/api/purchase-rates' && req.method === 'GET') {
      if (fs.existsSync(RATES_FILE)) {
        return sendFile(res, RATES_FILE, 'application/json; charset=utf-8');
      }
      return sendJson(res, 200, { rates: {} });
    }

    if (pathname === '/api/purchase-rates' && req.method === 'POST') {
      const body = await parseBody(req);
      let rates = { rates: {} };
      if (fs.existsSync(RATES_FILE)) {
        try { rates = JSON.parse(fs.readFileSync(RATES_FILE, 'utf8')); } catch(e) {}
      }
      if (!rates.rates) rates.rates = {};
      
      if (body.id !== undefined && body.rate !== undefined && Number(body.rate) >= 0) {
        rates.rates[String(body.id)] = Number(body.rate);
      }
      if (body.rates && typeof body.rates === 'object') {
        for (const [k, v] of Object.entries(body.rates)) {
          rates.rates[String(k)] = Number(v) || 0;
        }
      }
      rates.updatedAt = new Date().toISOString();
      fs.writeFileSync(RATES_FILE, JSON.stringify(rates, null, 2), 'utf8');
      return sendJson(res, 200, { ok: true, count: Object.keys(rates.rates).length, rates: rates.rates });
    }

    // 9b. API: DSR Order DELETE
    if (pathname.startsWith('/api/dsr/order/') && req.method === 'DELETE') {
      const orderId = pathname.replace('/api/dsr/order/', '').trim();
      let dsr = { orders: [], expenses: [] };
      if (fs.existsSync(DSR_FILE)) {
        try { dsr = JSON.parse(fs.readFileSync(DSR_FILE, 'utf8')); } catch(e) {}
      }
      const initialCount = (dsr.orders || []).length;
      dsr.orders = (dsr.orders || []).filter(o => String(o.id) !== String(orderId));
      if (dsr.orders.length < initialCount) {
        fs.writeFileSync(DSR_FILE, JSON.stringify(dsr, null, 2), 'utf8');
        return sendJson(res, 200, { ok: true, message: 'Order deleted successfully' });
      }
      return sendJson(res, 404, { error: 'Order not found' });
    }

    // 9c. API: DSR Expense DELETE
    if (pathname.startsWith('/api/dsr/expense/') && req.method === 'DELETE') {
      const expId = pathname.replace('/api/dsr/expense/', '').trim();
      let dsr = { orders: [], expenses: [] };
      if (fs.existsSync(DSR_FILE)) {
        try { dsr = JSON.parse(fs.readFileSync(DSR_FILE, 'utf8')); } catch(e) {}
      }
      const initialCount = (dsr.expenses || []).length;
      dsr.expenses = (dsr.expenses || []).filter(e => String(e.id) !== String(expId));
      if (dsr.expenses.length < initialCount) {
        fs.writeFileSync(DSR_FILE, JSON.stringify(dsr, null, 2), 'utf8');
        return sendJson(res, 200, { ok: true, message: 'Expense deleted successfully' });
      }
      return sendJson(res, 404, { error: 'Expense not found' });
    }

    // 9d. API: Purchasing Sections & Item Mappings GET
    if (pathname === '/api/purchasing/sections' && req.method === 'GET') {
      const defaults = {
        sections: ["AY", "Bahria Center", "Butt Center", "China 1", "China 2", "Condom", "General Market"],
        itemSections: {}
      };
      if (fs.existsSync(SECTIONS_FILE)) {
        try {
          const data = JSON.parse(fs.readFileSync(SECTIONS_FILE, 'utf8'));
          return sendJson(res, 200, { ok: true, ...defaults, ...data });
        } catch(e) {}
      }
      return sendJson(res, 200, { ok: true, ...defaults });
    }

    // 9e. API: Purchasing Sections & Item Mappings POST
    if (pathname === '/api/purchasing/sections' && req.method === 'POST') {
      const body = await parseBody(req);
      let current = {
        sections: ["AY", "Bahria Center", "Butt Center", "China 1", "China 2", "Condom", "General Market"],
        itemSections: {}
      };
      if (fs.existsSync(SECTIONS_FILE)) {
        try { current = JSON.parse(fs.readFileSync(SECTIONS_FILE, 'utf8')); } catch(e) {}
      }

      // Handle Rename Action
      if (body.action === 'rename') {
        const oldName = String(body.oldName || '').trim();
        const newName = String(body.newName || '').trim();
        if (oldName && newName && oldName !== newName) {
          const idx = current.sections.indexOf(oldName);
          if (idx !== -1) {
            current.sections[idx] = newName;
          } else if (!current.sections.includes(newName)) {
            current.sections.push(newName);
          }
          if (current.itemSections) {
            for (const [k, v] of Object.entries(current.itemSections)) {
              if (v === oldName) current.itemSections[k] = newName;
            }
          }
        }
      }
      // Handle Delete Action
      else if (body.action === 'delete') {
        const delName = String(body.sectionName || body.name || '').trim();
        if (delName) {
          current.sections = current.sections.filter(s => s !== delName);
          if (current.sections.length === 0) current.sections = ["General Market"];
          if (current.itemSections) {
            for (const [k, v] of Object.entries(current.itemSections)) {
              if (v === delName) current.itemSections[k] = 'General Market';
            }
          }
        }
      }
      // Handle setting full sections list
      else if (body.action === 'set_sections' && Array.isArray(body.sections)) {
        current.sections = Array.from(new Set(body.sections.map(s => String(s).trim()))).filter(Boolean);
      }
      else {
        if (Array.isArray(body.sections)) {
          current.sections = Array.from(new Set([...current.sections, ...body.sections])).filter(Boolean);
        }
        if (body.newSection && typeof body.newSection === 'string') {
          const s = body.newSection.trim();
          if (s && !current.sections.includes(s)) current.sections.push(s);
        }
        if (body.itemSections && typeof body.itemSections === 'object') {
          current.itemSections = { ...current.itemSections, ...body.itemSections };
        }
        if (body.itemId && body.section) {
          current.itemSections[String(body.itemId)] = String(body.section).trim();
        }
      }

      current.updatedAt = new Date().toISOString();
      fs.writeFileSync(SECTIONS_FILE, JSON.stringify(current, null, 2), 'utf8');
      return sendJson(res, 200, { ok: true, ...current });
    }

    // 9f. API: Purchasing Sheets GET
    if (pathname === '/api/purchasing/sheets' && req.method === 'GET') {
      if (fs.existsSync(PURCHASING_SHEETS_FILE)) {
        try {
          const data = JSON.parse(fs.readFileSync(PURCHASING_SHEETS_FILE, 'utf8'));
          return sendJson(res, 200, { ok: true, sheets: data.sheets || [] });
        } catch(e) {}
      }
      return sendJson(res, 200, { ok: true, sheets: [] });
    }

    // 9g. API: Purchasing Sheets POST (Save Sheet)
    if (pathname === '/api/purchasing/sheets' && req.method === 'POST') {
      const body = await parseBody(req);
      let data = { sheets: [] };
      if (fs.existsSync(PURCHASING_SHEETS_FILE)) {
        try { data = JSON.parse(fs.readFileSync(PURCHASING_SHEETS_FILE, 'utf8')); } catch(e) {}
      }
      const sheet = {
        id: 'PS-' + Date.now(),
        date: body.date || new Date().toISOString().slice(0, 10),
        title: body.title || 'Market Purchasing Sheet',
        marketName: body.marketName || 'Wholesale Market',
        items: Array.isArray(body.items) ? body.items : [],
        sections: Array.isArray(body.sections) ? body.sections : [],
        totalItems: Number(body.totalItems) || (Array.isArray(body.items) ? body.items.length : 0),
        totalQty: Number(body.totalQty) || (Array.isArray(body.items) ? body.items.reduce((s, it) => s + (parseFloat(it.qty || it.quantity) || 0), 0) : 0),
        totalAmount: Number(body.totalAmount) || (Array.isArray(body.items) ? body.items.reduce((s, it) => s + ((parseFloat(it.qty || it.quantity) || 0) * (parseFloat(it.purRate || it.rate) || 0)), 0) : 0),
        createdAt: new Date().toISOString()
      };
      if (!data.sheets) data.sheets = [];
      data.sheets.unshift(sheet);
      fs.writeFileSync(PURCHASING_SHEETS_FILE, JSON.stringify(data, null, 2), 'utf8');

      // Also persist purchase rates permanently if included
      if (body.updatedRates && typeof body.updatedRates === 'object') {
        let rates = { rates: {} };
        if (fs.existsSync(RATES_FILE)) {
          try { rates = JSON.parse(fs.readFileSync(RATES_FILE, 'utf8')); } catch(e) {}
        }
        if (!rates.rates) rates.rates = {};
        for (const [k, v] of Object.entries(body.updatedRates)) {
          if (v !== undefined && Number(v) >= 0) rates.rates[String(k)] = Number(v);
        }
        rates.updatedAt = new Date().toISOString();
        fs.writeFileSync(RATES_FILE, JSON.stringify(rates, null, 2), 'utf8');
      }

      // Also persist item sections permanently if included
      if (body.updatedItemSections && typeof body.updatedItemSections === 'object') {
        let secData = { sections: [], itemSections: {} };
        if (fs.existsSync(SECTIONS_FILE)) {
          try { secData = JSON.parse(fs.readFileSync(SECTIONS_FILE, 'utf8')); } catch(e) {}
        }
        if (!secData.itemSections) secData.itemSections = {};
        for (const [k, v] of Object.entries(body.updatedItemSections)) {
          if (v) secData.itemSections[String(k)] = String(v).trim();
        }
        secData.updatedAt = new Date().toISOString();
        fs.writeFileSync(SECTIONS_FILE, JSON.stringify(secData, null, 2), 'utf8');
      }

      return sendJson(res, 200, { ok: true, sheet });
    }

    // 9h. API: Purchasing Sheet DELETE
    if (pathname.startsWith('/api/purchasing/sheets/') && req.method === 'DELETE') {
      const sheetId = pathname.replace('/api/purchasing/sheets/', '').trim();
      let data = { sheets: [] };
      if (fs.existsSync(PURCHASING_SHEETS_FILE)) {
        try { data = JSON.parse(fs.readFileSync(PURCHASING_SHEETS_FILE, 'utf8')); } catch(e) {}
      }
      const initialCount = (data.sheets || []).length;
      data.sheets = (data.sheets || []).filter(s => String(s.id) !== String(sheetId));
      if (data.sheets.length < initialCount) {
        fs.writeFileSync(PURCHASING_SHEETS_FILE, JSON.stringify(data, null, 2), 'utf8');
        return sendJson(res, 200, { ok: true, message: 'Purchasing sheet deleted' });
      }
      return sendJson(res, 404, { error: 'Purchasing sheet not found' });
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
          execSync('git add products.json settings.json category_priorities.json images INDEX.JSX index.html app.js style.css sw.js purchase_rates.json purchasing_sections.json purchasing_sheets.json dsr_data.json admin_dashboard.html admin_server.js', { encoding: 'utf8', cwd: ROOT });
          
          let diffStat = '';
          try {
            diffStat = execSync('git diff --cached --stat', { encoding: 'utf8', cwd: ROOT }).trim();
          } catch(e) {}

          if (diffStat) {
            const commitOut = execSync('git commit -m "1-Click Live Publish to App & Web"', { encoding: 'utf8', cwd: ROOT });
            const pushOut = execSync('git push origin main', { encoding: 'utf8', cwd: ROOT });
            gitOut = commitOut + '\n' + pushOut;
          } else {
            try {
              const pushOut = execSync('git push origin main', { encoding: 'utf8', cwd: ROOT });
              gitOut = pushOut.trim() || 'Everything already committed and up-to-date on GitHub!';
            } catch(pErr) {
              gitOut = 'Everything already up-to-date on GitHub!';
            }
          }
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
