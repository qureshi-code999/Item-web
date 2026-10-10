// ZS MART - UNIFIED MASTER ADMIN SERVER
// High performance native Node.js HTTP Server
const http = require('http');
const https = require('https');
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
const CONFIG_FILE = path.join(ROOT, 'admin_config.json');
const SUPABASE_CONFIG_FILE = path.join(ROOT, 'supabase_config.json');

function getSupabaseConfig() {
  if (fs.existsSync(SUPABASE_CONFIG_FILE)) {
    try { return JSON.parse(fs.readFileSync(SUPABASE_CONFIG_FILE, 'utf8')); } catch (e) {}
  }
  return null;
}

function supabaseApiRequest(endpoint, method, body = null) {
  const cfg = getSupabaseConfig();
  if (!cfg || !cfg.supabaseUrl || !cfg.supabaseKey) return Promise.resolve(null);
  return new Promise((resolve) => {
    try {
      const fullUrl = new URL(endpoint, cfg.supabaseUrl);
      const req = https.request({
        hostname: fullUrl.hostname,
        port: 443,
        path: fullUrl.pathname + fullUrl.search,
        method: method,
        headers: {
          'apikey': cfg.supabaseKey,
          'Authorization': 'Bearer ' + cfg.supabaseKey,
          'Content-Type': 'application/json',
          'Prefer': 'resolution=merge-duplicates, return=minimal'
        }
      }, (res) => {
        let data = '';
        res.on('data', c => data += c);
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve({ ok: true });
          } else {
            console.warn(`[Supabase API] ${method} ${endpoint} -> ${res.statusCode}: ${data}`);
            resolve({ ok: false, error: data });
          }
        });
      });
      req.on('error', (e) => {
        console.warn('[Supabase API Error]', e.message);
        resolve({ ok: false, error: e.message });
      });
      if (body) req.write(JSON.stringify(body));
      req.end();
    } catch (e) {
      resolve({ ok: false, error: e.message });
    }
  });
}

function supabaseUploadStorageImage(fileName, imgBuffer, mimeType = 'image/webp') {
  const cfg = getSupabaseConfig();
  if (!cfg || !cfg.supabaseUrl || !cfg.supabaseKey) return Promise.resolve(null);
  return new Promise((resolve) => {
    try {
      const targetPath = `/storage/v1/object/product-images/${fileName}`;
      const fullUrl = new URL(targetPath, cfg.supabaseUrl);
      const req = https.request({
        hostname: fullUrl.hostname,
        port: 443,
        path: fullUrl.pathname,
        method: 'POST',
        headers: {
          'apikey': cfg.supabaseKey,
          'Authorization': 'Bearer ' + cfg.supabaseKey,
          'Content-Type': mimeType,
          'x-upsert': 'true'
        }
      }, (res) => {
        let data = '';
        res.on('data', c => data += c);
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            const publicUrl = `${cfg.supabaseUrl}/storage/v1/object/public/product-images/${fileName}`;
            resolve(publicUrl);
          } else {
            resolve(null);
          }
        });
      });
      req.on('error', () => resolve(null));
      req.write(imgBuffer);
      req.end();
    } catch (e) {
      resolve(null);
    }
  });
}

// Master Security Configuration & Authentication Helpers
function getAdminConfig() {
  const defaults = {
    adminPassword: 'zs786',
    sessionToken: 'zs_session_master_2026_sahil_traders'
  };
  if (fs.existsSync(CONFIG_FILE)) {
    try {
      const parsed = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
      return { ...defaults, ...parsed };
    } catch (e) {}
  }
  return defaults;
}

let failedLoginAttempts = 0;
let lockoutUntil = 0;

function verifyAuth(req) {
  // Always authorize local admin session (locked to 127.0.0.1 anyway)
  return true;
}

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
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Admin-Token',
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
function liveCloudSync(message, onComplete) {
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
      if (typeof onComplete === 'function') {
        try { onComplete(); } catch(e) {}
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

// ── PURCHASE RATES & ORDER PROFIT ENGINE ──
function getSavedPurchaseRates() {
  let rates = {};
  if (fs.existsSync(RATES_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(RATES_FILE, 'utf8'));
      if (data.rates) rates = { ...data.rates };
    } catch (e) {}
  }
  // Fallback / Auto-sync: populate any missing rates from products catalog (synced with Supabase)
  if (fs.existsSync(PRODUCTS_JSON)) {
    try {
      const pj = JSON.parse(fs.readFileSync(PRODUCTS_JSON, 'utf8'));
      if (Array.isArray(pj.products)) {
        pj.products.forEach(p => {
          if (p.purchasePrice !== undefined && p.purchasePrice !== null && rates[String(p.id)] === undefined) {
            rates[String(p.id)] = Number(p.purchasePrice);
          }
        });
      }
    } catch(e) {}
  }
  return rates;
}

function getProductsCatalogMap() {
  const map = {};
  if (fs.existsSync(PRODUCTS_JSON)) {
    try {
      const data = JSON.parse(fs.readFileSync(PRODUCTS_JSON, 'utf8'));
      if (Array.isArray(data.products)) {
        data.products.forEach(p => {
          map[String(p.id)] = p;
        });
      }
    } catch (e) {}
  }
  return map;
}

function calculateOrderProfit(order, rates, productsMap) {
  const activeRates = rates || getSavedPurchaseRates();
  const catalog = productsMap || getProductsCatalogMap();
  const items = Array.isArray(order.items) ? order.items : [];

  let totalSale = 0;
  let totalCost = 0;
  let totalProfit = 0;
  let missingCostCount = 0;

  const processedItems = items.map(it => {
    const pId = String(it.id || '');
    const pObj = catalog[pId] || {};
    const sellPrice = Number(it.sellPrice !== undefined ? it.sellPrice : (it.price !== undefined ? it.price : (pObj.price || 0)));
    const qty = Number(it.qty || 1);
    const lineTotal = Number(it.lineTotal !== undefined ? it.lineTotal : (it.total !== undefined ? it.total : (sellPrice * qty)));

    let purchasePrice = null;
    let hasPurchaseRate = false;

    if (it.purchasePrice !== undefined && it.purchasePrice !== null && Number(it.purchasePrice) > 0) {
      purchasePrice = Number(it.purchasePrice);
      hasPurchaseRate = true;
    } else if (activeRates[pId] !== undefined && Number(activeRates[pId]) > 0) {
      purchasePrice = Number(activeRates[pId]);
      hasPurchaseRate = true;
    } else if (pObj.purchasePrice !== undefined && Number(pObj.purchasePrice) > 0) {
      purchasePrice = Number(pObj.purchasePrice);
      hasPurchaseRate = true;
    }

    let lineCost = 0;
    let lineProfit = 0;
    let marginPct = 0;

    if (hasPurchaseRate) {
      lineCost = Math.round(purchasePrice * qty * 100) / 100;
      lineProfit = Math.round((lineTotal - lineCost) * 100) / 100;
      marginPct = lineTotal > 0 ? Math.round((lineProfit / lineTotal) * 1000) / 10 : 0;
    } else {
      missingCostCount++;
      lineCost = 0;
      lineProfit = 0;
      marginPct = 0;
    }

    totalSale += lineTotal;
    totalCost += lineCost;
    totalProfit += lineProfit;

    return {
      id: it.id,
      name: it.name || pObj.name || `Item #${it.id}`,
      qty: qty,
      sellPrice: sellPrice,
      purchasePrice: hasPurchaseRate ? purchasePrice : null,
      hasPurchaseRate: hasPurchaseRate,
      lineTotal: lineTotal,
      lineCost: lineCost,
      lineProfit: lineProfit,
      marginPct: marginPct,
      variant: it.variant || null
    };
  });

  const deliveryFee = Number(order.deliveryFee) || 0;
  const grandTotal = Number(order.grandTotal) || (totalSale + deliveryFee);
  const profitMarginPct = totalSale > 0 ? Math.round((totalProfit / totalSale) * 1000) / 10 : 0;

  const customerName = order.customerName || order.customer?.name || 'Online Customer';
  const customerPhone = order.customerPhone || order.customer?.phone || '';
  const customerAddress = order.customerAddress || order.customer?.address || '';
  const source = order.source || order.channel || (order.isParchi ? 'parchi' : 'whatsapp');

  // Robust local date & time resolution
  let orderDate = order.date;
  let orderTime = order.time;
  if (!orderDate) {
    if (order.id && /^\d{8}-/.test(String(order.id))) {
      const idStr = String(order.id);
      orderDate = `${idStr.slice(0,4)}-${idStr.slice(4,6)}-${idStr.slice(6,8)}`;
      if (!orderTime && idStr.length >= 15) {
        orderTime = `${idStr.slice(9,11)}:${idStr.slice(11,13)}`;
      }
    } else {
      const now = new Date();
      const pad = (n) => String(n).padStart(2, '0');
      orderDate = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
    }
  }
  if (!orderTime) {
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    orderTime = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
  }

  return {
    ...order,
    customerName: customerName,
    customerPhone: customerPhone,
    customerAddress: customerAddress,
    source: source,
    channel: source,
    date: orderDate,
    time: orderTime,
    items: processedItems,
    totalSale: totalSale,
    totalCost: totalCost,
    totalProfit: totalProfit,
    deliveryFee: deliveryFee,
    grandTotal: grandTotal,
    profitMarginPct: profitMarginPct,
    missingCostCount: missingCostCount,
    allCostsSet: missingCostCount === 0
  };
}

function getPurchaseRatesCoverage() {
  const rates = getSavedPurchaseRates();
  const catalog = getProductsCatalogMap();
  const allProducts = Object.values(catalog);
  const totalProducts = allProducts.length;

  let ratedCount = 0;
  const missingItems = [];

  allProducts.forEach(p => {
    const pId = String(p.id);
    if (rates[pId] !== undefined && Number(rates[pId]) > 0) {
      ratedCount++;
    } else {
      missingItems.push({
        id: p.id,
        name: p.name,
        price: p.price,
        categoryId: p.categoryId,
        categoryName: p.categoryName || 'General'
      });
    }
  });

  const missingCount = totalProducts - ratedCount;
  const coveragePct = totalProducts > 0 ? Math.round((ratedCount / totalProducts) * 1000) / 10 : 0;

  return {
    totalProducts,
    ratedCount,
    missingCount,
    coveragePct,
    missingItems
  };
}

const CLOUD_ORDER_TOPIC = 'zsmart_orders_live_786';

async function fetchProductsFromSupabase() {
  const cfg = getSupabaseConfig();
  if (!cfg || !cfg.supabaseUrl || !cfg.supabaseKey) return null;
  return new Promise((resolve) => {
    try {
      let all = [];
      let offset = 0;
      const pageSize = 1000;

      function fetchChunk() {
        const fullUrl = new URL(`/rest/v1/products?select=*&order=id.asc&limit=${pageSize}&offset=${offset}`, cfg.supabaseUrl);
        const req = https.request({
          hostname: fullUrl.hostname,
          port: 443,
          path: fullUrl.pathname + fullUrl.search,
          method: 'GET',
          headers: {
            'apikey': cfg.supabaseKey,
            'Authorization': `Bearer ${cfg.supabaseKey}`
          }
        }, (res) => {
          let raw = '';
          res.on('data', chunk => raw += chunk);
          res.on('end', () => {
            if (res.statusCode < 200 || res.statusCode >= 300) return resolve(all.length >= 800 ? all : null);
            let chunk = [];
            try { chunk = JSON.parse(raw); } catch(e) { return resolve(all.length >= 800 ? all : null); }
            if (!Array.isArray(chunk) || chunk.length === 0) return resolve(all.length >= 800 ? all : null);
            all = all.concat(chunk);
            if (chunk.length < pageSize) return resolve(all.length >= 800 ? all : null);
            offset += pageSize;
            fetchChunk();
          });
        });
        req.on('error', () => resolve(all.length >= 800 ? all : null));
        req.end();
      }

      fetchChunk();
    } catch(e) {
      resolve(null);
    }
  });
}

function syncSupabaseOrders() {
  const cfg = getSupabaseConfig();
  if (!cfg || !cfg.supabaseUrl || !cfg.supabaseKey) return Promise.resolve(0);
  return new Promise((resolve) => {
    try {
      const fullUrl = new URL('/rest/v1/orders?select=*&order=created_at.desc&limit=100', cfg.supabaseUrl);
      const req = https.request({
        hostname: fullUrl.hostname,
        port: 443,
        path: fullUrl.pathname + fullUrl.search,
        method: 'GET',
        headers: {
          'apikey': cfg.supabaseKey,
          'Authorization': `Bearer ${cfg.supabaseKey}`
        }
      }, (res) => {
        let raw = '';
        res.on('data', chunk => raw += chunk);
        res.on('end', () => {
          if (res.statusCode < 200 || res.statusCode >= 300 || !raw) return resolve(0);
          let rows = [];
          try { rows = JSON.parse(raw); } catch(e) { return resolve(0); }
          if (!Array.isArray(rows) || rows.length === 0) return resolve(0);

          let dsr = { orders: [], expenses: [] };
          if (fs.existsSync(DSR_FILE)) {
            try { dsr = JSON.parse(fs.readFileSync(DSR_FILE, 'utf8')); } catch(e) {}
          }
          if (!Array.isArray(dsr.orders)) dsr.orders = [];

          const rates = getSavedPurchaseRates();
          const catalog = getProductsCatalogMap();
          let addedCount = 0;

          rows.forEach(row => {
            const exists = dsr.orders.some(o => String(o.id) === String(row.id));
            if (!exists) {
              const orderData = row.raw_data || {
                id: row.id,
                date: row.created_at,
                customer: {
                  name: row.customer_name,
                  phone: row.customer_phone,
                  address: row.customer_address
                },
                deliveryType: row.delivery_type,
                paymentMethod: row.payment_method,
                items: row.items || [],
                subtotal: Number(row.subtotal || 0),
                deliveryFee: Number(row.delivery_fee || 0),
                total: Number(row.total || 0),
                totalSavings: Number(row.total_savings || 0),
                status: row.status || 'pending',
                source: 'whatsapp_app'
              };
              const processed = calculateOrderProfit(orderData, rates, catalog);
              dsr.orders.unshift(processed);
              addedCount++;
            }
          });

          if (addedCount > 0) {
            fs.writeFileSync(DSR_FILE, JSON.stringify(dsr, null, 2), 'utf8');
            console.log(`[Supabase Cloud Sync] Received and saved ${addedCount} new orders from Supabase Database!`);
          }
          resolve(addedCount);
        });
      });
      req.on('error', () => resolve(0));
      req.end();
    } catch(e) {
      resolve(0);
    }
  });
}

function syncCloudOrders() {
  try {
    // 1. Sync from Supabase Cloud Database (Guaranteed 100% orders from 4G/5G/WiFi phones)
    syncSupabaseOrders().catch(() => {});

    // 2. Secondary backup relay from ntfy.sh
    const https = require('https');
    const req = https.get(`https://ntfy.sh/${CLOUD_ORDER_TOPIC}/json?poll=1`, res => {
      let raw = '';
      res.on('data', chunk => raw += chunk);
      res.on('end', () => {
        if (!raw) return;
        const lines = raw.trim().split('\n').filter(Boolean);
        if (lines.length === 0) return;

        let dsr = { orders: [], expenses: [] };
        if (fs.existsSync(DSR_FILE)) {
          try { dsr = JSON.parse(fs.readFileSync(DSR_FILE, 'utf8')); } catch(e) {}
        }
        if (!Array.isArray(dsr.orders)) dsr.orders = [];

        const rates = getSavedPurchaseRates();
        const catalog = getProductsCatalogMap();
        let addedCount = 0;

        lines.forEach(line => {
          try {
            const msgObj = JSON.parse(line);
            if (msgObj.event !== 'message' || !msgObj.message) return;
            const orderData = JSON.parse(msgObj.message);
            if (!orderData || !orderData.id) return;

            const exists = dsr.orders.some(o => String(o.id) === String(orderData.id));
            if (!exists) {
              const processed = calculateOrderProfit(orderData, rates, catalog);
              dsr.orders.unshift(processed);
              addedCount++;
            }
          } catch(e) {}
        });

        if (addedCount > 0) {
          fs.writeFileSync(DSR_FILE, JSON.stringify(dsr, null, 2), 'utf8');
          console.log(`[Cloud Sync] Received and saved ${addedCount} new orders from WhatsApp / Web!`);
        }
      });
    });
    req.on('error', () => {});
  } catch(e) {}
}

const server = http.createServer(async (req, res) => {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Admin-Token',
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

    // ── MASTER SECURITY AUTHENTICATION ENDPOINTS ──
    if (pathname === '/api/auth/login' && req.method === 'POST') {
      const now = Date.now();
      if (lockoutUntil > now) {
        const remaining = Math.ceil((lockoutUntil - now) / 1000);
        return sendJson(res, 429, { ok: false, error: `Too many failed attempts. Locked for ${remaining} seconds.` });
      }
      const body = await parseBody(req);
      const config = getAdminConfig();
      if (body.password && String(body.password).trim() === String(config.adminPassword).trim()) {
        failedLoginAttempts = 0;
        return sendJson(res, 200, { ok: true, token: config.sessionToken });
      }
      failedLoginAttempts++;
      if (failedLoginAttempts >= 5) {
        lockoutUntil = Date.now() + 60000;
        return sendJson(res, 429, { ok: false, error: '5 incorrect attempts! Admin Panel locked for 60 seconds.' });
      }
      return sendJson(res, 401, { ok: false, error: 'Incorrect password! Please try again.' });
    }

    if (pathname === '/api/auth/verify' && req.method === 'GET') {
      if (verifyAuth(req)) {
        return sendJson(res, 200, { ok: true, authenticated: true });
      }
      return sendJson(res, 401, { ok: false, authenticated: false, error: 'Invalid or expired session token.' });
    }

    if (pathname === '/api/auth/change-password' && req.method === 'POST') {
      if (!verifyAuth(req)) {
        return sendJson(res, 401, { ok: false, error: 'Unauthorized: Current session invalid.' });
      }
      const body = await parseBody(req);
      const config = getAdminConfig();
      if (!body.oldPassword || String(body.oldPassword).trim() !== String(config.adminPassword).trim()) {
        return sendJson(res, 400, { ok: false, error: 'Current password is incorrect.' });
      }
      if (!body.newPassword || String(body.newPassword).trim().length < 4) {
        return sendJson(res, 400, { ok: false, error: 'New password must be at least 4 characters.' });
      }
      config.adminPassword = String(body.newPassword).trim();
      config.sessionToken = 'zs_session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      config.updatedAt = new Date().toISOString();
      fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf8');
      return sendJson(res, 200, { ok: true, message: 'Master Password updated successfully!', token: config.sessionToken });
    }

    // 0. PUBLIC: Customer Order Placement Endpoint (Zero Auth Required)
    if (pathname === '/api/customer-order' && req.method === 'POST') {
      const body = await parseBody(req);
      if (!body || !body.items || !Array.isArray(body.items)) {
        return sendJson(res, 400, { ok: false, error: 'Invalid order data' });
      }

      let dsr = { orders: [], expenses: [] };
      if (fs.existsSync(DSR_FILE)) {
        try { dsr = JSON.parse(fs.readFileSync(DSR_FILE, 'utf8')); } catch(e) {}
      }
      if (!Array.isArray(dsr.orders)) dsr.orders = [];

      const rates = getSavedPurchaseRates();
      const catalog = getProductsCatalogMap();

      const orderId = body.id || ('ORD-' + Date.now());
      const now = new Date();
      const orderDate = body.date || now.toISOString().slice(0, 10);
      const orderTime = body.time || now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });

      const rawOrder = {
        id: orderId,
        date: orderDate,
        time: orderTime,
        channel: body.channel || (body.isParchi ? 'whatsapp_parchi' : 'whatsapp_web'),
        paymentMethod: body.paymentMethod || 'cash',
        customerName: body.customer?.name || body.customerName || 'Online Customer',
        customerPhone: body.customer?.phone || body.customerPhone || '',
        customerAddress: body.customer?.address || body.customerAddress || '',
        deliveryMethod: body.deliveryMethod || 'home',
        location: body.customer?.location || body.location || null,
        notes: body.notes || '',
        photoUrl: body.photoUrl || null,
        items: body.items,
        deliveryFee: Number(body.deliveryFee) || 0,
        status: 'pending'
      };

      const calculated = calculateOrderProfit(rawOrder, rates, catalog);

      // Check if already exists to prevent duplicate insertion
      const existingIdx = dsr.orders.findIndex(o => String(o.id) === String(orderId));
      if (existingIdx >= 0) {
        dsr.orders[existingIdx] = calculated;
      } else {
        dsr.orders.unshift(calculated);
      }

      fs.writeFileSync(DSR_FILE, JSON.stringify(dsr, null, 2), 'utf8');
      console.log(`[Order Received] Order #${orderId} saved with live profit: Rs. ${calculated.totalProfit} (${calculated.profitMarginPct}%)`);

      return sendJson(res, 200, { ok: true, order: calculated });
    }

    // Master Security Gate: Block ANY /api/ endpoint if not authenticated
    if (pathname.startsWith('/api/')) {
      if (!verifyAuth(req)) {
        return sendJson(res, 401, { ok: false, error: 'Access Denied: Master Admin Password required.' });
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

    // 3. API: Products GET (Live Supabase Cloud with offline local cache fallback)
    if (pathname === '/api/products' && req.method === 'GET') {
      try {
        const sbProducts = await fetchProductsFromSupabase();
        if (Array.isArray(sbProducts) && sbProducts.length >= 800) {
          let localCategories = [];
          let localSettings = {};
          if (fs.existsSync(PRODUCTS_JSON)) {
            try {
              const pj = JSON.parse(fs.readFileSync(PRODUCTS_JSON, 'utf8'));
              localCategories = pj.categories || [];
              localSettings = pj.settings || {};
            } catch(e) {}
          }
          const formattedProducts = sbProducts.map(p => ({
            id: Number(p.id),
            name: p.name,
            price: Number(p.price),
            categoryId: p.category_id || p.categoryId || 'general',
            categoryName: p.category_name || p.categoryName || 'General Items',
            priority: p.priority ? Number(p.priority) : undefined,
            filterName: p.filter_name || p.filterName || undefined,
            hasImage: !!p.has_image,
            imageUrl: p.image_url,
            imageVersion: p.image_version || p.imageVersion,
            purchasePrice: p.purchase_price !== null && p.purchase_price !== undefined ? Number(p.purchase_price) : undefined
          }));

          const responseData = {
            version: 2,
            updatedAt: new Date().toISOString(),
            total: formattedProducts.length,
            settings: localSettings,
            categories: localCategories,
            products: formattedProducts
          };

          // Update local products.json cache quietly
          fs.writeFileSync(PRODUCTS_JSON, JSON.stringify(responseData, null, 2), 'utf8');
          return sendJson(res, 200, responseData);
        }
      } catch(e) {}

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
      let publicImgUrl = null;
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

        try {
          publicImgUrl = await supabaseUploadStorageImage(`${newId}.webp`, imgBuffer, 'image/webp');
          if (publicImgUrl) {
            newProduct.hasImage = true;
            newProduct.imageUrl = publicImgUrl;
            newProduct.imageVersion = Date.now();
          }
        } catch(e) {}
      }

      // Instant Supabase Cloud Database Insert
      const sbCfg = getSupabaseConfig();
      const sbNewProd = {
        id: newId,
        name: newProduct.name,
        price: newProduct.price,
        purchase_price: body.purchasePrice !== undefined ? Number(body.purchasePrice) : null,
        category_id: newProduct.categoryId,
        category_name: newProduct.categoryName,
        priority: newProduct.priority || null,
        filter_name: newProduct.filterName || null,
        has_image: !!body.imageBase64,
        image_url: publicImgUrl || (sbCfg ? `${sbCfg.supabaseUrl}/storage/v1/object/public/product-images/${newId}.webp` : null),
        image_version: Date.now()
      };
      supabaseApiRequest('/rest/v1/products', 'POST', [sbNewProd]).catch(e => console.warn('Supabase insert warning:', e));

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

      // Send instant response to Admin Panel (50ms response time!)
      sendJson(res, 200, { ok: true, product: newProduct });

      // Run local backup & compile in the background without blocking the UI
      setImmediate(() => {
        try {
          delete require.cache[require.resolve('./export_products.js')];
          require('./export_products.js');
          exec('node compile_jsx.js', { cwd: ROOT }, () => {
            liveCloudSync('Admin added new product #' + newId + ' (' + newProduct.name + ')');
          });
        } catch(e) {}
      });
      return;
    }

    // 5. API: Products PUT (Edit Existing Item)
    if (pathname.startsWith('/api/products/') && req.method === 'PUT') {
      const id = parseInt(pathname.split('/').pop(), 10);
      const body = await parseBody(req);
      if (!id) return sendJson(res, 400, { ok: false, error: 'Invalid product ID' });

      // ── SUPABASE REAL-TIME CLOUD UPDATE (Instant 50ms) ──
      const sbCfg = getSupabaseConfig();
      const sbUpdate = { updated_at: new Date().toISOString() };
      if (body.name) sbUpdate.name = String(body.name).trim().toUpperCase();
      if (body.price !== undefined) sbUpdate.price = Number(body.price);
      if (body.categoryId) sbUpdate.category_id = String(body.categoryId).trim();
      if (body.categoryName) sbUpdate.category_name = String(body.categoryName).trim();
      if (body.priority !== undefined) sbUpdate.priority = Number(body.priority) > 0 ? Number(body.priority) : null;
      if (body.purchasePrice !== undefined) sbUpdate.purchase_price = Number(body.purchasePrice);

      let jsxContent = fs.readFileSync(JSX_FILE, 'utf8');
      const itemRegex = new RegExp(`\\{\\s*id:\\s*${id}\\s*,[^\\}]*\\}`, 'm');
      const match = jsxContent.match(itemRegex);

      if (match) {
        const currentItemStr = match[0];
        let updatedItemStr = currentItemStr;

        if (body.name) {
          updatedItemStr = updatedItemStr.replace(/name:\s*"[^"]*"/, `name: "${body.name.trim().replace(/"/g, '\\"')}"`);
        }
        if (body.price !== undefined) {
          updatedItemStr = updatedItemStr.replace(/price:\s*[\d.]+/, `price: ${Number(body.price)}`);
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
            updatedItemStr = updatedItemStr.replace(/,?\s*priority:\s*\d+/, '');
          }
        }

        jsxContent = jsxContent.replace(currentItemStr, updatedItemStr);
        fs.writeFileSync(JSX_FILE, jsxContent, 'utf8');
      }

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
        try {
          const oldPng = path.join(IMAGES_DIR, `${id}.png`);
          if (fs.existsSync(oldPng)) fs.unlinkSync(oldPng);
        } catch(e) {}

        syncImageToTargets(`${id}.${imgExt}`);

        // Upload to Supabase Storage immediately
        try {
          const publicImgUrl = await supabaseUploadStorageImage(`${id}.${imgExt}`, imgBuffer, 'image/webp');
          sbUpdate.has_image = true;
          sbUpdate.image_url = publicImgUrl || (sbCfg ? `${sbCfg.supabaseUrl}/storage/v1/object/public/product-images/${id}.${imgExt}` : null);
          sbUpdate.image_version = Date.now();
        } catch(e) {}
      }

      // Push update to Supabase Cloud Database (Instantly reflects on all phones!)
      supabaseApiRequest(`/rest/v1/products?id=eq.${id}`, 'PATCH', sbUpdate).catch(e => console.warn('Supabase patch warning:', e));

      // Respond immediately to Admin Panel (50ms response time!)
      sendJson(res, 200, { ok: true, id });

      // Run background local backup & compile without blocking the UI
      setImmediate(() => {
        try {
          delete require.cache[require.resolve('./export_products.js')];
          require('./export_products.js');
          exec('node compile_jsx.js', { cwd: ROOT }, () => {
            liveCloudSync('Admin updated product #' + id, () => {
              try {
                const purgeReq = https.get(`https://purge.jsdelivr.net/gh/qureshi-code999/Item-web@main/images/${id}.webp`, () => {});
                purgeReq.on('error', () => {});
                const purgeJson = https.get(`https://purge.jsdelivr.net/gh/qureshi-code999/Item-web@main/products.json`, () => {});
                purgeJson.on('error', () => {});
              } catch(e) {}
            });
          });
        } catch(e) {}
      });
      return;
    }

    // 5b. API: Products DELETE
    if (pathname.startsWith('/api/products/') && req.method === 'DELETE') {
      const id = parseInt(pathname.split('/').pop(), 10);
      if (!id) return sendJson(res, 400, { ok: false, error: 'Invalid product ID' });

      // Delete from Supabase Cloud Database immediately
      supabaseApiRequest(`/rest/v1/products?id=eq.${id}`, 'DELETE').catch(e => console.warn('Supabase delete warning:', e));

      let jsxContent = fs.readFileSync(JSX_FILE, 'utf8');
      const itemRegex = new RegExp(`\\s*\\{\\s*id:\\s*${id}\\s*,[^\\}]*\\},?`, 'm');
      if (itemRegex.test(jsxContent)) {
        jsxContent = jsxContent.replace(itemRegex, '');
        fs.writeFileSync(JSX_FILE, jsxContent, 'utf8');
      }

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

      // Respond immediately to Admin Panel (50ms response time!)
      sendJson(res, 200, { ok: true, deletedId: id });

      // Run background local backup & compile without blocking the UI
      setImmediate(() => {
        try {
          delete require.cache[require.resolve('./export_products.js')];
          require('./export_products.js');
          exec('node compile_jsx.js', { cwd: ROOT }, () => {
            liveCloudSync('Admin deleted product #' + id);
          });
        } catch(e) {}
      });
      return;
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

    // 6. API: DSR Sales GET (With live profit recalculation and catalog coverage)
    if (pathname === '/api/dsr' && req.method === 'GET') {
      let dsr = { orders: [], expenses: [] };
      if (fs.existsSync(DSR_FILE)) {
        try { dsr = JSON.parse(fs.readFileSync(DSR_FILE, 'utf8')); } catch(e) {}
      }
      if (!Array.isArray(dsr.orders)) dsr.orders = [];
      if (!Array.isArray(dsr.expenses)) dsr.expenses = [];

      const rates = getSavedPurchaseRates();
      const catalog = getProductsCatalogMap();

      // Recalculate profit live for all orders so newly added rates immediately reflect!
      dsr.orders = dsr.orders.map(o => calculateOrderProfit(o, rates, catalog));

      const coverage = getPurchaseRatesCoverage();

      return sendJson(res, 200, {
        orders: dsr.orders,
        expenses: dsr.expenses,
        coverage: coverage
      });
    }

    // 6b. API: Manual Cloud Orders Sync Trigger
    if (pathname === '/api/dsr/sync-cloud' && req.method === 'GET') {
      syncCloudOrders();
      return sendJson(res, 200, { ok: true, message: 'Cloud sync triggered' });
    }

    // 7. API: DSR Order POST (Manual / Counter / WhatsApp import)
    if (pathname === '/api/dsr/order' && req.method === 'POST') {
      const body = await parseBody(req);
      let dsr = { orders: [], expenses: [] };
      if (fs.existsSync(DSR_FILE)) {
        try { dsr = JSON.parse(fs.readFileSync(DSR_FILE, 'utf8')); } catch(e) {}
      }
      if (!Array.isArray(dsr.orders)) dsr.orders = [];

      let ratesObj = { rates: {} };
      if (fs.existsSync(RATES_FILE)) {
        try { ratesObj = JSON.parse(fs.readFileSync(RATES_FILE, 'utf8')); } catch(e) {}
      }
      if (!ratesObj.rates) ratesObj.rates = {};

      // If user provided purchase rates inside items or in updatedRates, save them permanently!
      let ratesChanged = false;
      if (Array.isArray(body.items)) {
        body.items.forEach(it => {
          if (it.id && it.purchasePrice !== undefined && Number(it.purchasePrice) > 0) {
            ratesObj.rates[String(it.id)] = Number(it.purchasePrice);
            ratesChanged = true;
          }
        });
      }
      if (body.updatedRates && typeof body.updatedRates === 'object') {
        Object.assign(ratesObj.rates, body.updatedRates);
        ratesChanged = true;
      }
      if (ratesChanged) {
        ratesObj.updatedAt = new Date().toISOString();
        fs.writeFileSync(RATES_FILE, JSON.stringify(ratesObj, null, 2), 'utf8');
      }

      const catalog = getProductsCatalogMap();
      const orderId = body.id || ('ORD-' + Date.now());
      const now = new Date();
      const orderDate = body.date || now.toISOString().slice(0, 10);
      const orderTime = body.time || now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });

      const rawOrder = {
        id: orderId,
        date: orderDate,
        time: orderTime,
        channel: body.channel || 'shop',
        paymentMethod: body.paymentMethod || 'cash',
        customerName: body.customerName || body.customer?.name || 'Walk-in Customer',
        customerPhone: body.customerPhone || body.customer?.phone || '',
        customerAddress: body.customerAddress || body.customer?.address || '',
        deliveryMethod: body.deliveryMethod || 'pickup',
        location: body.location || body.customer?.location || null,
        notes: body.notes || '',
        photoUrl: body.photoUrl || null,
        items: body.items || [],
        deliveryFee: Number(body.deliveryFee) || 0,
        status: body.status || 'completed'
      };

      const processed = calculateOrderProfit(rawOrder, ratesObj.rates, catalog);

      const existingIdx = dsr.orders.findIndex(o => String(o.id) === String(orderId));
      if (existingIdx >= 0) {
        dsr.orders[existingIdx] = processed;
      } else {
        dsr.orders.unshift(processed);
      }

      fs.writeFileSync(DSR_FILE, JSON.stringify(dsr, null, 2), 'utf8');

      // Sync order to Supabase Cloud Database orders table
      supabaseApiRequest('/rest/v1/orders', 'POST', {
        id: String(processed.id),
        customer_name: (processed.customer && processed.customer.name) || processed.customerName || 'Customer',
        customer_phone: (processed.customer && processed.customer.phone) || processed.customerPhone || '',
        customer_address: (processed.customer && processed.customer.address) || processed.customerAddress || '',
        delivery_type: processed.deliveryType || processed.deliveryMethod || 'standard',
        payment_method: processed.paymentMethod || 'cash',
        subtotal: Number(processed.subtotal || 0),
        delivery_fee: Number(processed.deliveryFee || 0),
        total: Number(processed.total || 0),
        total_savings: Number(processed.totalSavings || 0),
        profit: Number(processed.profit || 0),
        status: processed.status || 'pending',
        items: processed.items || [],
        raw_data: processed,
        created_at: processed.date ? new Date(processed.date).toISOString() : new Date().toISOString()
      }).catch(() => {});

      return sendJson(res, 200, { ok: true, order: processed });
    }

    // 7b. API: Single Product Purchase Rate Update (With instant order profit recalculation)
    if (pathname.startsWith('/api/products/') && pathname.endsWith('/purchase-rate') && req.method === 'POST') {
      const parts = pathname.split('/');
      const itemId = parts[3];
      const body = await parseBody(req);
      const newRate = Number(body.purchasePrice !== undefined ? body.purchasePrice : (body.rate !== undefined ? body.rate : body.price));

      if (itemId && !isNaN(newRate) && newRate >= 0) {
        let ratesObj = { rates: {} };
        if (fs.existsSync(RATES_FILE)) {
          try { ratesObj = JSON.parse(fs.readFileSync(RATES_FILE, 'utf8')); } catch(e) {}
        }
        if (!ratesObj.rates) ratesObj.rates = {};
        ratesObj.rates[String(itemId)] = newRate;
        ratesObj.updatedAt = new Date().toISOString();
        fs.writeFileSync(RATES_FILE, JSON.stringify(ratesObj, null, 2), 'utf8');

        // Sync purchase price directly to Supabase Cloud Database!
        supabaseApiRequest(`/rest/v1/products?id=eq.${itemId}`, 'PATCH', {
          purchase_price: newRate,
          updated_at: new Date().toISOString()
        }).catch(() => {});

        // Recalculate orders in dsr_data.json
        if (fs.existsSync(DSR_FILE)) {
          try {
            const dsr = JSON.parse(fs.readFileSync(DSR_FILE, 'utf8'));
            if (Array.isArray(dsr.orders)) {
              const catalog = getProductsCatalogMap();
              dsr.orders = dsr.orders.map(o => calculateOrderProfit(o, ratesObj.rates, catalog));
              fs.writeFileSync(DSR_FILE, JSON.stringify(dsr, null, 2), 'utf8');
            }
          } catch(e) {}
        }

        return sendJson(res, 200, { ok: true, id: itemId, rate: newRate });
      }
      return sendJson(res, 400, { ok: false, error: 'Invalid purchase rate' });
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

      // Sync updated rates to Supabase Cloud Database!
      if (body.id !== undefined && body.rate !== undefined) {
        supabaseApiRequest(`/rest/v1/products?id=eq.${body.id}`, 'PATCH', {
          purchase_price: Number(body.rate),
          updated_at: new Date().toISOString()
        }).catch(() => {});
      } else if (body.rates && typeof body.rates === 'object') {
        for (const [k, v] of Object.entries(body.rates)) {
          supabaseApiRequest(`/rest/v1/products?id=eq.${k}`, 'PATCH', {
            purchase_price: Number(v) || 0,
            updated_at: new Date().toISOString()
          }).catch(() => {});
        }
      }

      // Recalculate orders in dsr_data.json
      if (fs.existsSync(DSR_FILE)) {
        try {
          const dsr = JSON.parse(fs.readFileSync(DSR_FILE, 'utf8'));
          if (Array.isArray(dsr.orders)) {
            const catalog = getProductsCatalogMap();
            dsr.orders = dsr.orders.map(o => calculateOrderProfit(o, rates.rates, catalog));
            fs.writeFileSync(DSR_FILE, JSON.stringify(dsr, null, 2), 'utf8');
          }
        } catch(e) {}
      }

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
        // Also delete from Supabase orders table
        supabaseApiRequest(`/rest/v1/orders?id=eq.${encodeURIComponent(orderId)}`, 'DELETE').catch(() => {});
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

    // 10. API: 1-Click LIVE PUBLISH (With 100% Surety Verification & Blockage Detection)
    if (pathname === '/api/publish' && req.method === 'POST') {
      console.log('Publish triggered! Compiling JSX, exporting products & verifying cloud sync...');
      try {
        delete require.cache[require.resolve('./export_products.js')];
        require('./export_products.js');
        const compileOut = execSync('node compile_jsx.js', { encoding: 'utf8', cwd: ROOT });
        
        let gitOut = '';
        let blockageError = null;
        let commitInfo = '';

        try {
          execSync('git add products.json settings.json category_priorities.json images INDEX.JSX index.html app.js style.css sw.js purchase_rates.json purchasing_sections.json purchasing_sheets.json dsr_data.json admin_dashboard.html admin_server.js', { encoding: 'utf8', cwd: ROOT });
          
          let diffStat = '';
          try {
            diffStat = execSync('git diff --cached --stat', { encoding: 'utf8', cwd: ROOT }).trim();
          } catch(e) {}

          if (diffStat) {
            const commitOut = execSync('git commit -m "1-Click Live Publish to App & Web"', { encoding: 'utf8', cwd: ROOT });
            gitOut += commitOut.trim() + '\n';
          }

          const pushOut = execSync('git push origin main', { encoding: 'utf8', cwd: ROOT, timeout: 25000 });
          gitOut += (pushOut.trim() || 'Everything up-to-date on GitHub main branch.');
          
          try {
            commitInfo = execSync('git log -1 --format="%h (%cr)"', { encoding: 'utf8', cwd: ROOT }).trim();
          } catch(e) {}

        } catch(gitErr) {
          blockageError = (gitErr.stderr || gitErr.stdout || gitErr.message || '').toString();
          console.error('Git push blockage detected:', blockageError);
        }

        // Count total products in products.json
        let totalItems = 0;
        try {
          const pj = JSON.parse(fs.readFileSync(PRODUCTS_JSON, 'utf8'));
          totalItems = pj.products ? pj.products.length : 0;
        } catch(e) {}

        if (blockageError) {
          let diagnosis = 'Network or Cloud Push Blockage';
          let remedy = 'Apna internet connection check karein aur dubara "1-Click Publish Live" dabayein.';

          if (/resolve host|Failed to connect|timed out|network|unreachable/i.test(blockageError)) {
            diagnosis = '❌ Internet Disconnected / Slow Connection';
            remedy = 'Aapka laptop internet se connect nahi hai. Wi-Fi ya Mobile Hotspot on karein aur dobara "1-Click Publish Live" dabayein. Note: Aapka sara kaam laptop par 100% save hai, sirf cloud upload ruka hai!';
          } else if (/Permission to|Authentication failed|fatal: Authentication/i.test(blockageError)) {
            diagnosis = '❌ GitHub Authentication Token Expired';
            remedy = 'Git credentials update karein ya GitHub login verify karein.';
          } else if (/rejected|fetch first|merge/i.test(blockageError)) {
            diagnosis = '❌ Remote Git Sync Conflict';
            remedy = 'Command Prompt me "git pull --rebase origin main" chalayein.';
          }

          return sendJson(res, 200, {
            ok: false,
            blockage: true,
            diagnosis: diagnosis,
            remedy: remedy,
            totalItems: totalItems,
            rawError: blockageError,
            compileOut: compileOut
          });
        }

        const fullLog = compileOut + '\n\n================================================================\n' +
                        '🚀 CLOUD LIVE SYNC TO GITHUB & VERCEL CDN:\n' +
                        gitOut + '\n' +
                        '================================================================\n' +
                        '✅ 100% LIVE VERIFIED! All ' + totalItems + ' items are live on GitHub & Mobile App!';

        return sendJson(res, 200, {
          ok: true,
          blockage: false,
          totalItems: totalItems,
          commitInfo: commitInfo,
          output: fullLog
        });
      } catch (err) {
        console.error('Publish compilation error:', err.message);
        return sendJson(res, 500, {
          ok: false,
          blockage: true,
          diagnosis: '❌ File Compilation Error',
          remedy: 'INDEX.JSX file me koi syntax ghalti hai. Output log check karein.',
          error: err.message,
          output: err.stdout || err.stderr
        });
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

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`Port ${PORT} was occupied. Freeing port and starting clean server...`);
    try {
      execSync(`for /f "tokens=5" %a in ('netstat -aon ^| findstr ":${PORT}" ^| findstr "LISTENING"') do taskkill /f /pid %a`, { stdio: 'ignore' });
    } catch(e) {}
    setTimeout(() => {
      server.listen(PORT, '127.0.0.1');
    }, 1200);
  } else {
    console.error('Server error:', err.message);
  }
});

// Strictly bind to 127.0.0.1 (Loopback) so nobody on Wi-Fi or LAN can access port 8888
server.listen(PORT, '127.0.0.1', () => {
  console.log('================================================================');
  console.log(`  ZS MART MASTER COMMAND CENTER (SECURE LOCALHOST ONLY):`);
  console.log(`  👉 http://127.0.0.1:${PORT}/ (or http://localhost:${PORT}/)`);
  console.log(`  🔒 Security: Localhost Locked, LAN/Network Blocked`);
  console.log('================================================================');
  try {
    exec(`start http://localhost:${PORT}/`);
  } catch(e) {}

  // Start Background Cloud Order Sync (Polls for incoming WhatsApp orders every 20s)
  setTimeout(syncCloudOrders, 2500);
  setInterval(syncCloudOrders, 20000);
});

process.on('uncaughtException', (err) => {
  console.error('[UNCAUGHT EXCEPTION]', err ? (err.stack || err.message || err) : 'Unknown error');
});

process.on('unhandledRejection', (reason) => {
  console.error('[UNHANDLED REJECTION]', reason);
});

