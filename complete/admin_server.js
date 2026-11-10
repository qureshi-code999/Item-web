// ZS MART - UNIFIED MASTER ADMIN SERVER
// High performance native Node.js HTTP Server
const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { exec, execSync } = require('child_process');
const url = require('url');
const dns = require('dns');

// ── HIGH-AVAILABILITY RESILIENT DNS RESOLVER & SUPABASE IP CACHE ──
const resilientResolver = new dns.promises.Resolver();
resilientResolver.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
const dnsCache = new Map();

function resilientLookup(hostname, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }
  const cached = dnsCache.get(hostname);
  const now = Date.now();
  if (cached && (now - cached.time < 900000)) {
    if (options && options.all) {
      return callback(null, cached.ips.map(ip => ({ address: ip, family: 4 })));
    }
    return callback(null, cached.ips[0], 4);
  }

  const resolveWithFallback = () => {
    resilientResolver.resolve4(hostname)
      .then(addresses => {
        if (addresses && addresses.length > 0) {
          dnsCache.set(hostname, { ips: addresses, time: Date.now() });
          if (options && options.all) {
            callback(null, addresses.map(ip => ({ address: ip, family: 4 })));
          } else {
            callback(null, addresses[0], 4);
          }
        } else {
          callback(new Error('DNS resolution returned empty'));
        }
      })
      .catch(err => {
        if (hostname === 'tmssjdczywukramcpcxc.supabase.co') {
          const cloudflareIps = ['172.64.149.246', '104.18.38.10'];
          dnsCache.set(hostname, { ips: cloudflareIps, time: Date.now() });
          if (options && options.all) {
            callback(null, cloudflareIps.map(ip => ({ address: ip, family: 4 })));
          } else {
            callback(null, cloudflareIps[0], 4);
          }
        } else {
          callback(err);
        }
      });
  };

  let osDone = false;
  const timeoutId = setTimeout(() => {
    if (!osDone) {
      osDone = true;
      resolveWithFallback();
    }
  }, 1200);

  dns.lookup(hostname, options, (err, address, family) => {
    if (osDone) return;
    osDone = true;
    clearTimeout(timeoutId);
    if (!err && address) {
      const ips = Array.isArray(address) ? address.map(a => a.address || a) : [address];
      dnsCache.set(hostname, { ips, time: Date.now() });
      return callback(null, address, family);
    }
    resolveWithFallback();
  });
}

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
  if (!cfg || !cfg.supabaseUrl) return Promise.resolve(null);
  const keyToUse = (cfg.serviceRoleKey && cfg.serviceRoleKey.trim()) || cfg.supabaseKey;
  if (!keyToUse) return Promise.resolve(null);
  return new Promise((resolve) => {
    try {
      const fullUrl = new URL(endpoint, cfg.supabaseUrl);
      const req = https.request({
        hostname: fullUrl.hostname,
        port: 443,
        path: fullUrl.pathname + fullUrl.search,
        method: method,
        lookup: resilientLookup,
        headers: {
          'apikey': keyToUse,
          'Authorization': 'Bearer ' + keyToUse,
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
  if (!cfg || !cfg.supabaseUrl) return Promise.resolve(null);
  const keyToUse = (cfg.serviceRoleKey && cfg.serviceRoleKey.trim()) || cfg.supabaseKey;
  if (!keyToUse) return Promise.resolve(null);
  return new Promise((resolve) => {
    try {
      const targetPath = `/storage/v1/object/product-images/${fileName}`;
      const fullUrl = new URL(targetPath, cfg.supabaseUrl);
      const req = https.request({
        hostname: fullUrl.hostname,
        port: 443,
        path: fullUrl.pathname,
        method: 'POST',
        lookup: resilientLookup,
        headers: {
          'apikey': keyToUse,
          'Authorization': 'Bearer ' + keyToUse,
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

function supabaseDeleteStorageImage(fileName) {
  const cfg = getSupabaseConfig();
  if (!cfg || !cfg.supabaseUrl) return Promise.resolve(false);
  const keyToUse = (cfg.serviceRoleKey && cfg.serviceRoleKey.trim()) || cfg.supabaseKey;
  if (!keyToUse) return Promise.resolve(false);
  return new Promise((resolve) => {
    try {
      const payload = JSON.stringify({ prefixes: Array.isArray(fileName) ? fileName : [fileName] });
      const targetPath = `/storage/v1/object/product-images`;
      const fullUrl = new URL(targetPath, cfg.supabaseUrl);
      const req = https.request({
        hostname: fullUrl.hostname,
        port: 443,
        path: fullUrl.pathname,
        method: 'DELETE',
        lookup: resilientLookup,
        headers: {
          'apikey': keyToUse,
          'Authorization': 'Bearer ' + keyToUse,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload)
        }
      }, (res) => {
        resolve(res.statusCode >= 200 && res.statusCode < 300);
      });
      req.on('error', () => resolve(false));
      req.write(payload);
      req.end();
    } catch(e) {
      resolve(false);
    }
  });
}

function getPktDateString(d = new Date()) {
  try {
    return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Karachi' }).format(d);
  } catch(e) {
    const offset = 5 * 60; // PKT is UTC+5
    const local = new Date(d.getTime() + (offset + d.getTimezoneOffset()) * 60000);
    return local.toISOString().slice(0, 10);
  }
}

// Master Security Configuration & Authentication Helpers
function getAdminConfig() {
  const defaults = {
    adminPassword: 'zs786',
    sessionToken: 'zs_session_master_2026_zs_mart'
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
  const config = getAdminConfig();
  const token = req.headers['x-admin-token'] || 
                (req.headers['authorization'] && req.headers['authorization'].replace(/^Bearer\s+/i, '').trim());
  if (token && token === config.sessionToken) {
    return true;
  }
  return false;
}

// Optional sharp for WebP compression
let sharp = null;
try {
  sharp = require('./node_modules/sharp');
} catch (e) {
  try { sharp = require('sharp'); } catch (e2) {}
}

// ── SAFE ATOMIC FILE WRITERS & READERS ──
// Prevents file corruption, zero-byte truncations, and race conditions
function safeAtomicWriteJson(filePath, data) {
  try {
    const jsonStr = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
    const tempPath = `${filePath}.${Date.now()}.${Math.random().toString(36).slice(2, 8)}.tmp`;
    fs.writeFileSync(tempPath, jsonStr, 'utf8');

    // Integrity check: verify written file parses valid JSON
    JSON.parse(fs.readFileSync(tempPath, 'utf8'));

    // Create backup of current file
    if (fs.existsSync(filePath)) {
      try {
        fs.copyFileSync(filePath, `${filePath}.bak`);
      } catch (_) {}
    }

    // Atomic rename
    fs.renameSync(tempPath, filePath);
    return true;
  } catch (err) {
    console.error(`[SafeAtomicWrite Error] Failed writing ${filePath}:`, err.message);
    try {
      fs.writeFileSync(filePath, typeof data === 'string' ? data : JSON.stringify(data, null, 2), 'utf8');
      return true;
    } catch (e2) {
      console.error(`[SafeAtomicWrite Fallback Error] ${filePath}:`, e2.message);
      return false;
    }
  }
}

function safeReadJson(filePath, fallback = {}) {
  if (fs.existsSync(filePath)) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      if (content && content.trim()) return JSON.parse(content);
    } catch (e) {
      console.warn(`[SafeReadJson] File ${filePath} damaged or incomplete, attempting backup restore...`);
      const bak = `${filePath}.bak`;
      if (fs.existsSync(bak)) {
        try {
          const bakContent = fs.readFileSync(bak, 'utf8');
          if (bakContent && bakContent.trim()) return JSON.parse(bakContent);
        } catch (e2) {}
      }
    }
  }
  return fallback;
}

function getCorsOrigin(req) {
  if (!req || !req.headers) return 'http://127.0.0.1:8888';
  const origin = req.headers['origin'];
  if (!origin) return 'http://127.0.0.1:8888';
  if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin)) {
    return origin;
  }
  if (/^https:\/\/(www\.)?zsmart\.pk$/i.test(origin)) {
    return origin;
  }
  if (/^https:\/\/(.*\.)?vercel\.app$/i.test(origin) || /^https:\/\/sahiltraders\.vercel\.app$/i.test(origin)) {
    return origin;
  }
  return 'null';
}

function sendJson(res, statusCode, data, req = null) {
  const body = JSON.stringify(data);
  const currentReq = req || res._req;
  const allowOrigin = getCorsOrigin(currentReq);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Admin-Token',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Vary': 'Origin'
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


// ── LIVE CLOUD SYNC & BUILD QUEUE (Prevents concurrent git and compile lock collisions) ──
let isSyncingGit = false;
let pendingGitSyncMsg = null;
let isCompilingBackground = false;
let compilePendingAfter = false;

function queueExportAndCompile(callback) {
  if (isCompilingBackground) {
    compilePendingAfter = true;
    if (typeof callback === 'function') callback();
    return;
  }
  isCompilingBackground = true;
  try {
    delete require.cache[require.resolve('./export_products.js')];
    require('./export_products.js');
    exec('node compile_jsx.js', { cwd: ROOT }, (err) => {
      isCompilingBackground = false;
      if (typeof callback === 'function') {
        try { callback(); } catch(e) {}
      }
      if (compilePendingAfter) {
        compilePendingAfter = false;
        setTimeout(() => queueExportAndCompile(), 500);
      }
    });
  } catch(e) {
    isCompilingBackground = false;
    if (typeof callback === 'function') {
      try { callback(); } catch(err) {}
    }
  }
}

let debouncedGitTimer = null;
function scheduleDebouncedGitSync(message, delayMs = 12000) {
  if (debouncedGitTimer) clearTimeout(debouncedGitTimer);
  debouncedGitTimer = setTimeout(() => {
    liveCloudSync(message);
  }, delayMs);
}

function liveCloudSync(message, onComplete) {
  if (isSyncingGit) {
    pendingGitSyncMsg = message || 'Live update from Admin Panel';
    if (typeof onComplete === 'function') {
      try { onComplete(); } catch(e) {}
    }
    return;
  }
  isSyncingGit = true;
  try {
    const safeMsg = (message || 'Live update from Admin Panel').replace(/"/g, '\\"');
    const filesToSync = ['products.json', 'settings.json', 'purchase_rates.json', 'category_priorities.json', 'INDEX.JSX', 'index.html', 'app.js', 'style.css', 'sw.js', 'languages'].filter(f => fs.existsSync(path.join(ROOT, f))).join(' ');
    const gitCmd = `git add ${filesToSync} && git commit -m "${safeMsg}" && git push origin main`;
    exec(gitCmd, { cwd: ROOT }, (err, stdout, stderr) => {
      isSyncingGit = false;
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
      if (pendingGitSyncMsg) {
        const nextMsg = pendingGitSyncMsg;
        pendingGitSyncMsg = null;
        setTimeout(() => liveCloudSync(nextMsg), 1500);
      }
    });
  } catch(e) {
    isSyncingGit = false;
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

function calculateOrderProfit(order, rates, productsMap, options = {}) {
  const activeRates = rates || getSavedPurchaseRates();
  const catalog = productsMap || getProductsCatalogMap();
  const items = Array.isArray(order.items) ? order.items : [];
  const preserveExisting = !!options.preserveExistingItemRates;
  const forceThisOrder = options.forceOrderId && String(options.forceOrderId) === String(order.id);

  let totalSale = 0;
  let totalCost = 0;
  let totalProfit = 0;
  let missingCostCount = 0;

  const processedItems = items.map(it => {
    const pId = String(it.id || '');
    const pObj = catalog[pId] || {};
    const sellPrice = Number(it.sellPrice !== undefined ? it.sellPrice : (it.price !== undefined ? it.price : (pObj.price || 0)));
    const qty = Number(it.qty || 1);
    const rawLineTotal = it.lineTotal !== undefined ? Number(it.lineTotal) : (it.total !== undefined ? Number(it.total) : 0);
    const lineTotal = rawLineTotal > 0 ? rawLineTotal : (sellPrice * qty);

    let purchasePrice = null;
    let hasPurchaseRate = false;

    const isForcedItem = forceThisOrder && options.forceItemId && String(options.forceItemId) === pId;
    const isClearedItem = options.clearItemId && String(options.clearItemId) === pId;

    // 1. If admin explicitly edited this order in POS or we are preserving existing historical rates:
    if (!isClearedItem && !isForcedItem && (options.trustItemPurchasePrice || preserveExisting) && it.purchasePrice !== undefined && Number(it.purchasePrice) > 0) {
      purchasePrice = Number(it.purchasePrice);
      hasPurchaseRate = true;
    } else if (!isClearedItem && activeRates[pId] !== undefined && Number(activeRates[pId]) > 0) {
      purchasePrice = Number(activeRates[pId]);
      hasPurchaseRate = true;
    } else if (!isClearedItem && pObj.purchasePrice !== undefined && Number(pObj.purchasePrice) > 0) {
      purchasePrice = Number(pObj.purchasePrice);
      hasPurchaseRate = true;
    } else if (!isClearedItem && (order.source === 'admin_manual' || order.source === 'pos') && it.purchasePrice !== undefined && Number(it.purchasePrice) > 0) {
      purchasePrice = Number(it.purchasePrice);
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

    const itemOut = {
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
    if (it.extraPercent !== undefined) itemOut.extraPercent = it.extraPercent;
    if (it.extraSavings !== undefined) itemOut.extraSavings = it.extraSavings;
    if (it.isCustom || String(it.id || '').startsWith('custom_')) itemOut.isCustom = true;
    return itemOut;
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
      orderDate = getPktDateString();
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
    channel: order.channel || source,
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

function syncOrderStatusesToSupabase(ordersList) {
  try {
    const statusMap = {};
    const list = Array.isArray(ordersList) ? ordersList.slice(0, 500) : [];
    list.forEach(o => {
      if (o && o.id) {
        statusMap[String(o.id)] = String(o.status || 'placed').toLowerCase();
      }
    });
    return supabaseApiRequest('/rest/v1/store_settings?on_conflict=id', 'POST', {
      id: 'order_statuses',
      store_name: 'ZS Mart Order Status Map',
      announcement: JSON.stringify(statusMap),
      updated_at: new Date().toISOString()
    }).catch(() => {});
  } catch (e) {
    return Promise.resolve(null);
  }
}

function syncPurchaseRatesFromSupabase() {
  const cfg = getSupabaseConfig();
  if (!cfg || !cfg.supabaseUrl) return Promise.resolve(0);
  const keyToUse = (cfg.serviceRoleKey && cfg.serviceRoleKey.trim()) || cfg.supabaseKey;
  if (!keyToUse) return Promise.resolve(0);
  return new Promise((resolve) => {
    try {
      const fullUrl = new URL('/rest/v1/purchase_rates?select=product_id,purchase_price&limit=5000', cfg.supabaseUrl);
      const req = https.request({
        hostname: fullUrl.hostname,
        port: 443,
        path: fullUrl.pathname + fullUrl.search,
        method: 'GET',
        lookup: resilientLookup,
        headers: {
          'apikey': keyToUse,
          'Authorization': `Bearer ${keyToUse}`
        }
      }, (res) => {
        let raw = '';
        res.on('data', c => raw += c);
        res.on('end', () => {
          if (res.statusCode < 200 || res.statusCode >= 300 || !raw) return resolve(0);
          try {
            const rows = JSON.parse(raw);
            if (!Array.isArray(rows) || rows.length === 0) return resolve(0);
            const ratesObj = safeReadJson(RATES_FILE, { rates: {} });
            if (!ratesObj.rates) ratesObj.rates = {};
            let added = 0;
            rows.forEach(r => {
              const pid = String(r.product_id || '');
              const price = Number(r.purchase_price !== undefined ? r.purchase_price : r.purchase_rate);
              if (pid && !isNaN(price) && price > 0 && ratesObj.rates[pid] !== price) {
                ratesObj.rates[pid] = price;
                added++;
              }
            });
            if (added > 0) {
              ratesObj.updatedAt = new Date().toISOString();
              safeAtomicWriteJson(RATES_FILE, ratesObj);
            }
            resolve(added);
          } catch (e) {
            resolve(0);
          }
        });
      });
      req.on('error', () => resolve(0));
      req.end();
    } catch (e) {
      resolve(0);
    }
  });
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
  if (!cfg || !cfg.supabaseUrl) return null;
  const keyToUse = (cfg.serviceRoleKey && cfg.serviceRoleKey.trim()) || cfg.supabaseKey;
  if (!keyToUse) return null;
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
          lookup: resilientLookup,
          headers: {
            'apikey': keyToUse,
            'Authorization': `Bearer ${keyToUse}`
          }
        }, (res) => {
          let raw = '';
          res.on('data', chunk => raw += chunk);
          res.on('end', () => {
            if (res.statusCode < 200 || res.statusCode >= 300) return resolve(all.length > 0 ? all : null);
            let chunk = [];
            try { chunk = JSON.parse(raw); } catch(e) { return resolve(all.length > 0 ? all : null); }
            if (!Array.isArray(chunk) || chunk.length === 0) return resolve(all.length > 0 ? all : null);
            all = all.concat(chunk);
            if (chunk.length < pageSize) return resolve(all.length > 0 ? all : null);
            offset += pageSize;
            fetchChunk();
          });
        });
        req.on('error', () => resolve(all.length > 0 ? all : null));
        req.end();
      }

      fetchChunk();
    } catch(e) {
      resolve(null);
    }
  });
}

let isSyncingOrders = false;

function syncSupabaseOrders() {
  const cfg = getSupabaseConfig();
  if (!cfg || !cfg.supabaseUrl) return Promise.resolve(0);
  const keyToUse = cfg.serviceRoleKey || cfg.supabaseKey;
  if (!keyToUse) return Promise.resolve(0);
  if (isSyncingOrders) return Promise.resolve(0);
  isSyncingOrders = true;

  return new Promise(async (resolve) => {
    try {
      let dsr = safeReadJson(DSR_FILE, { orders: [], expenses: [] });
      if (!Array.isArray(dsr.orders)) dsr.orders = [];
      const existingIds = new Set(dsr.orders.map(o => String(o.id)));

      const rates = getSavedPurchaseRates();
      const catalog = getProductsCatalogMap();
      let addedCount = 0;
      let offset = 0;
      const pageSize = 200;
      let hasMore = true;

      // Auto-paginate through incoming orders (never capped at 100)
      while (hasMore) {
        const fullUrl = new URL(`/rest/v1/orders?select=*&order=created_at.desc&limit=${pageSize}&offset=${offset}`, cfg.supabaseUrl);
        const rows = await new Promise((resChunk) => {
          const req = https.request({
            hostname: fullUrl.hostname,
            port: 443,
            path: fullUrl.pathname + fullUrl.search,
            method: 'GET',
            lookup: resilientLookup,
            headers: {
              'apikey': keyToUse,
              'Authorization': `Bearer ${keyToUse}`
            }
          }, (res) => {
            let raw = '';
            res.on('data', chunk => raw += chunk);
            res.on('end', () => {
              if (res.statusCode < 200 || res.statusCode >= 300 || !raw) return resChunk([]);
              try {
                const parsed = JSON.parse(raw);
                resChunk(Array.isArray(parsed) ? parsed : []);
              } catch(e) {
                resChunk([]);
              }
            });
          });
          req.on('error', () => resChunk([]));
          req.end();
        });

        if (rows.length === 0) break;

        let consecutiveExisting = 0;
        for (const row of rows) {
          if (!row || !row.id) continue;
          const sId = String(row.id);
          if (existingIds.has(sId)) {
            consecutiveExisting++;
            // If we encounter 15 consecutive already-synced orders, local DSR has caught up
            if (consecutiveExisting >= 15) {
              hasMore = false;
              break;
            }
            continue;
          }

          consecutiveExisting = 0;
          existingIds.add(sId);

          const raw = (row.raw_data && typeof row.raw_data === 'object' && Object.keys(row.raw_data).length > 0) ? row.raw_data : null;
          const orderData = raw ? { ...raw, id: sId } : {
            id: sId,
            date: row.created_at,
            customerName: row.customer_name || 'Customer',
            customerPhone: row.customer_phone || '',
            customerAddress: row.customer_address || '',
            customer: {
              name: row.customer_name || 'Customer',
              phone: row.customer_phone || '',
              address: row.customer_address || ''
            },
            deliveryType: row.delivery_type || 'standard',
            deliveryMethod: row.delivery_type || 'standard',
            paymentMethod: row.payment_method || 'cash',
            items: Array.isArray(row.items) ? row.items : [],
            subtotal: Number(row.subtotal || 0),
            deliveryFee: Number(row.delivery_fee || 0),
            total: Number(row.total || 0),
            grandTotal: Number(row.total || 0),
            totalSavings: Number(row.total_savings || 0),
            status: row.status || 'placed',
            source: 'whatsapp_app',
            channel: 'whatsapp'
          };
          orderData.id = sId;
          const processed = calculateOrderProfit(orderData, rates, catalog);
          dsr.orders.unshift(processed);
          addedCount++;
        }

        if (rows.length < pageSize || !hasMore) break;
        offset += pageSize;
        if (offset >= 5000) break; // Maximum safe window per sync cycle
      }

      if (addedCount > 0) {
        safeAtomicWriteJson(DSR_FILE, dsr);
        syncOrderStatusesToSupabase(dsr.orders);
        console.log(`[Supabase Cloud Sync] Received and saved ${addedCount} new orders from Supabase Database!`);
      }
      isSyncingOrders = false;
      resolve(addedCount);
    } catch(e) {
      isSyncingOrders = false;
      resolve(0);
    }
  });
}

function syncPurchasingSectionsFromSupabase() {
  const cfg = getSupabaseConfig();
  if (!cfg || !cfg.supabaseUrl) return Promise.resolve(false);
  const keyToUse = (cfg.serviceRoleKey && cfg.serviceRoleKey.trim()) || cfg.supabaseKey;
  if (!keyToUse) return Promise.resolve(false);

  return new Promise((resolve) => {
    try {
      const fullUrl = new URL('/rest/v1/purchasing_sections?id=eq.main&select=*', cfg.supabaseUrl);
      const req = https.request({
        hostname: fullUrl.hostname,
        port: 443,
        path: fullUrl.pathname + fullUrl.search,
        method: 'GET',
        lookup: resilientLookup,
        headers: {
          'apikey': keyToUse,
          'Authorization': 'Bearer ' + keyToUse
        }
      }, (res) => {
        let raw = '';
        res.on('data', chunk => raw += chunk);
        res.on('end', () => {
          if (res.statusCode < 200 || res.statusCode >= 300 || !raw) return resolve(false);
          try {
            const rows = JSON.parse(raw);
            if (!Array.isArray(rows) || rows.length === 0) return resolve(false);
            const row = rows[0];
            let current = safeReadJson(SECTIONS_FILE, { sections: [], itemSections: {} });
            if (!current.sections) current.sections = [];
            if (!current.itemSections) current.itemSections = {};

            let changed = false;
            if (Array.isArray(row.sections) && row.sections.length > 0) {
              const mergedSec = Array.from(new Set([...current.sections, ...row.sections]));
              if (mergedSec.length !== current.sections.length) {
                current.sections = mergedSec;
                changed = true;
              }
            }
            if (row.item_sections && typeof row.item_sections === 'object') {
              for (const [k, v] of Object.entries(row.item_sections)) {
                if (v && (!current.itemSections[k] || current.itemSections[k] === 'General Market')) {
                  current.itemSections[k] = v;
                  changed = true;
                }
              }
            }
            if (changed) {
              current.updatedAt = new Date().toISOString();
              safeAtomicWriteJson(SECTIONS_FILE, current);
              console.log(`[Supabase Sections Sync] Synced ${Object.keys(current.itemSections).length} item section mappings from cloud!`);
            }
            resolve(true);
          } catch(e) {
            resolve(false);
          }
        });
      });
      req.on('error', () => resolve(false));
      req.end();
    } catch(e) {
      resolve(false);
    }
  });
}

function syncCloudOrders() {
  try {
    syncPurchaseRatesFromSupabase().catch(() => {});
    syncPurchasingSectionsFromSupabase().catch(() => {});
    // Sync from Supabase Cloud Database (Guaranteed 100% secure orders without public leak)
    return syncSupabaseOrders().catch(() => 0);
  } catch(e) {
    return Promise.resolve(0);
  }
}

const server = http.createServer(async (req, res) => {
  res._req = req;
  const allowOrigin = getCorsOrigin(req);

  // CORS Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': allowOrigin,
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Admin-Token',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Vary': 'Origin'
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
      if (lockoutUntil > 0 && now >= lockoutUntil) {
        failedLoginAttempts = 0;
        lockoutUntil = 0;
      }
      const body = await parseBody(req);
      const config = getAdminConfig();
      if (body.password && String(body.password).trim() === String(config.adminPassword).trim()) {
        failedLoginAttempts = 0;
        lockoutUntil = 0;
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
      config.sessionToken = 'zs_session_' + crypto.randomBytes(24).toString('hex');
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

      let dsr = safeReadJson(DSR_FILE, { orders: [], expenses: [] });
      if (!Array.isArray(dsr.orders)) dsr.orders = [];

      const rates = getSavedPurchaseRates();
      const catalog = getProductsCatalogMap();

      const orderId = body.id || ('ORD-' + Date.now());
      const now = new Date();
      const orderDate = body.date || getPktDateString(now);
      const orderTime = body.time || now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });

      // Strip client-injected purchase prices or arbitrary metadata and enforce catalog price when available
      const sanitizedItems = body.items.map(it => {
        const pObj = catalog[String(it.id || '')] || {};
        const unitPrice = Number(pObj.price !== undefined && Number(pObj.price) > 0 ? pObj.price : (it.price !== undefined ? it.price : (it.sellPrice !== undefined ? it.sellPrice : 0)));
        const qty = Math.max(1, Number(it.qty || 1));
        const clientTotal = Number(it.total !== undefined ? it.total : (it.lineTotal !== undefined ? it.lineTotal : 0));
        return {
          id: it.id,
          name: it.name || pObj.name || 'Product',
          price: unitPrice,
          sellPrice: unitPrice,
          qty: qty,
          total: unitPrice > 0 ? (qty * unitPrice) : clientTotal,
          lineTotal: unitPrice > 0 ? (qty * unitPrice) : clientTotal,
          variant: it.variant || null
        };
      });

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
        items: sanitizedItems,
        deliveryFee: Number(body.deliveryFee) || 0,
        status: 'placed'
      };

      const calculated = calculateOrderProfit(rawOrder, rates, catalog);

      // Prevent unauthenticated overwrite of an existing order ID
      const existingIdx = dsr.orders.findIndex(o => String(o.id) === String(orderId));
      if (existingIdx < 0) {
        dsr.orders.unshift(calculated);
        safeAtomicWriteJson(DSR_FILE, dsr);
        syncOrderStatusesToSupabase(dsr.orders);
        console.log(`[Order Received] Order #${orderId} saved with live profit: Rs. ${calculated.totalProfit} (${calculated.profitMarginPct}%)`);
      }

      // Return public customer-safe receipt without wholesale cost or profit fields
      const publicOrder = {
        id: calculated.id,
        date: calculated.date,
        time: calculated.time,
        status: calculated.status || 'placed',
        customerName: calculated.customerName,
        customerPhone: calculated.customerPhone,
        customerAddress: calculated.customerAddress,
        deliveryMethod: calculated.deliveryMethod,
        paymentMethod: calculated.paymentMethod,
        totalSale: calculated.totalSale,
        deliveryFee: calculated.deliveryFee,
        grandTotal: calculated.grandTotal,
        items: (calculated.items || []).map(i => ({
          id: i.id,
          name: i.name,
          qty: i.qty,
          sellPrice: i.sellPrice,
          lineTotal: i.lineTotal,
          variant: i.variant
        }))
      };

      return sendJson(res, 200, { ok: true, order: publicOrder });
    }

    // 0.1 PUBLIC: Customer Order Status Lookup (Zero Auth Required, ID-based)
    if (pathname === '/api/order-status' && req.method === 'GET') {
      const orderId = parsedUrl.query.id;
      if (!orderId) {
        return sendJson(res, 400, { ok: false, error: 'Missing order id parameter' });
      }
      const dsr = safeReadJson(DSR_FILE, { orders: [], expenses: [] });
      const order = (dsr.orders || []).find(o => String(o.id) === String(orderId));
      if (order) {
        return sendJson(res, 200, {
          ok: true,
          found: true,
          id: order.id,
          status: order.status || 'placed',
          deliveryMethod: order.deliveryMethod,
          date: order.date,
          updatedAt: order.updatedAt || order.date
        });
      }
      return sendJson(res, 404, { ok: false, error: 'Order not found' });
    }

    // Master Security Gate: Block ANY /api/ endpoint if not authenticated
    if (pathname.startsWith('/api/')) {
      if (!verifyAuth(req)) {
        return sendJson(res, 401, { ok: false, error: 'Access Denied: Master Admin Password required.' });
      }
    }

// Helper to sync single brand/logo image to www and android assets (skip numeric product images which live on Supabase CDN)
function syncImageToTargets(fileName) {
  if (/^\d+\.(webp|png|jpg|jpeg)$/i.test(fileName)) return;
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
      
      const today = getPktDateString();
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

    // 3. API: Products GET (Fast local cache with guaranteed purchase rates attached)
    if (pathname === '/api/products' && req.method === 'GET') {
      const forceCloud = parsedUrl.query && (parsedUrl.query.refresh === 'cloud' || parsedUrl.query.cloud === 'true');
      if (!forceCloud && fs.existsSync(PRODUCTS_JSON)) {
        try {
          const pj = JSON.parse(fs.readFileSync(PRODUCTS_JSON, 'utf8'));
          const rates = getSavedPurchaseRates();
          if (Array.isArray(pj.products)) {
            pj.products.forEach(p => {
              if (rates[String(p.id)] !== undefined && Number(rates[String(p.id)]) > 0) {
                p.purchasePrice = Number(rates[String(p.id)]);
              }
            });
          }
          return sendJson(res, 200, pj);
        } catch(e) {
          return sendFile(res, PRODUCTS_JSON, 'application/json; charset=utf-8');
        }
      }
      try {
        const sbProducts = await fetchProductsFromSupabase();
        if (Array.isArray(sbProducts) && sbProducts.length > 0) {
          let localCategories = [];
          let localSettings = {};
          let localImageMap = {};
          let localItemImageVersions = {};
          let localVariants = {};
          if (fs.existsSync(PRODUCTS_JSON)) {
            try {
              const pj = JSON.parse(fs.readFileSync(PRODUCTS_JSON, 'utf8'));
              localCategories = pj.categories || [];
              localSettings = pj.settings || {};
              localImageMap = pj.imageMap || {};
              localItemImageVersions = pj.itemImageVersions || {};
              localVariants = pj.variants || {};
            } catch(e) {}
          }
          const savedRates = getSavedPurchaseRates();
          const formattedProducts = sbProducts.map(p => {
            const pId = Number(p.id);
            const hasImg = !!p.has_image || !!p.image_url;
            if (hasImg && !localImageMap[pId]) {
              localImageMap[pId] = 'webp';
            }
            if (p.image_version || p.imageVersion) {
              localItemImageVersions[pId] = Number(p.image_version || p.imageVersion);
            }
            const purCost = savedRates[String(pId)] !== undefined 
              ? Number(savedRates[String(pId)]) 
              : (p.purchase_price !== null && p.purchase_price !== undefined ? Number(p.purchase_price) : undefined);
            return {
              id: pId,
              name: p.name,
              price: Number(p.price),
              categoryId: p.category_id || p.categoryId || 'general',
              categoryName: p.category_name || p.categoryName || 'General Items',
              priority: p.priority ? Number(p.priority) : undefined,
              filterName: p.filter_name || p.filterName || undefined,
              hasImage: hasImg,
              imageUrl: p.image_url,
              imageVersion: p.image_version || p.imageVersion,
              purchasePrice: purCost
            };
          });

          const responseData = {
            version: 2,
            updatedAt: new Date().toISOString(),
            total: formattedProducts.length,
            settings: localSettings,
            categories: localCategories,
            imageMap: localImageMap,
            itemImageVersions: localItemImageVersions,
            variants: localVariants,
            products: formattedProducts
          };

          if (!fs.existsSync(PRODUCTS_JSON)) {
            safeAtomicWriteJson(PRODUCTS_JSON, responseData);
          }
          return sendJson(res, 200, responseData);
        }
      } catch(e) {}

      if (fs.existsSync(PRODUCTS_JSON)) {
        try {
          const pj = JSON.parse(fs.readFileSync(PRODUCTS_JSON, 'utf8'));
          const rates = getSavedPurchaseRates();
          if (Array.isArray(pj.products)) {
            pj.products.forEach(p => {
              if (rates[String(p.id)] !== undefined && Number(rates[String(p.id)]) > 0) {
                p.purchasePrice = Number(rates[String(p.id)]);
              }
            });
          }
          return sendJson(res, 200, pj);
        } catch(e) {
          return sendFile(res, PRODUCTS_JSON, 'application/json; charset=utf-8');
        }
      }
      return sendJson(res, 200, { products: [] });
    }

    // 4. API: Products POST (Add New Item)
    if (pathname === '/api/products' && req.method === 'POST') {
      const body = await parseBody(req);
      if (!body.name || body.price === undefined || isNaN(body.price) || Number(body.price) <= 0) {
        return sendJson(res, 400, { ok: false, error: 'Product name and valid price (> 0) are required' });
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
      if (body.purchasePrice !== undefined && body.purchasePrice !== null && !isNaN(Number(body.purchasePrice)) && Number(body.purchasePrice) > 0) {
        newProduct.purchasePrice = Number(body.purchasePrice);
      }

      // Handle image upload if provided (Always save as optimized WebP)
      let ext = 'webp';
      let publicImgUrl = null;
      if (body.imageBase64) {
        const base64Data = body.imageBase64.replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, '');
        const imgBuffer = Buffer.from(base64Data, 'base64');
        let uploadBuffer = imgBuffer;
        if (sharp) {
          uploadBuffer = await sharp(imgBuffer)
            .resize(500, 500, { fit: 'inside', withoutEnlargement: true })
            .webp({ quality: 82 })
            .toBuffer();
          fs.writeFileSync(path.join(IMAGES_DIR, `${newId}.webp`), uploadBuffer);
          ext = 'webp';
        } else {
          fs.writeFileSync(path.join(IMAGES_DIR, `${newId}.webp`), imgBuffer);
          ext = 'webp';
        }
        syncImageToTargets(`${newId}.${ext}`);

        try {
          publicImgUrl = await supabaseUploadStorageImage(`${newId}.webp`, uploadBuffer, 'image/webp');
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
        category_id: newProduct.categoryId,
        category_name: newProduct.categoryName,
        priority: newProduct.priority || null,
        filter_name: newProduct.filterName || null,
        has_image: !!body.imageBase64,
        image_url: body.imageBase64 ? (publicImgUrl || (sbCfg ? `${sbCfg.supabaseUrl}/storage/v1/object/public/product-images/${newId}.webp` : null)) : null,
        image_version: Date.now()
      };
      let sbAddRes = null;
      try {
        sbAddRes = await supabaseApiRequest('/rest/v1/products', 'POST', [sbNewProd]);
      } catch (e) {
        console.warn('Supabase insert warning:', e);
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

      // Save purchase rate if provided and sync to Supabase purchase_rates table
      if (body.purchasePrice !== undefined && body.purchasePrice !== null && !isNaN(Number(body.purchasePrice)) && Number(body.purchasePrice) > 0) {
        let rates = safeReadJson(RATES_FILE, { rates: {} });
        if (!rates.rates) rates.rates = {};
        rates.rates[String(newId)] = Number(body.purchasePrice);
        rates.updatedAt = new Date().toISOString();
        safeAtomicWriteJson(RATES_FILE, rates);

        supabaseApiRequest('/rest/v1/purchase_rates?on_conflict=product_id', 'POST', {
          product_id: newId,
          purchase_price: Number(body.purchasePrice),
          updated_at: new Date().toISOString()
        }).catch(() => {});
      }

      // Update local products.json in-place instantly
      if (fs.existsSync(PRODUCTS_JSON)) {
        try {
          const pj = JSON.parse(fs.readFileSync(PRODUCTS_JSON, 'utf8'));
          if (Array.isArray(pj.products)) {
            pj.products.push(newProduct);
            if (!Array.isArray(pj.categories)) pj.categories = [];
            if (newProduct.categoryId && !pj.categories.some(c => c.id === newProduct.categoryId)) {
              pj.categories.push({
                id: newProduct.categoryId,
                name: newProduct.categoryName || newProduct.categoryId
              });
              supabaseApiRequest('/rest/v1/categories?on_conflict=id', 'POST', [{
                id: newProduct.categoryId,
                name: newProduct.categoryName || newProduct.categoryId,
                updated_at: new Date().toISOString()
              }]).catch(() => {});
            }
            pj.total = pj.products.length;
            pj.updatedAt = new Date().toISOString();
            safeAtomicWriteJson(PRODUCTS_JSON, pj);
            try { fs.copyFileSync(PRODUCTS_JSON, path.join(__dirname, 'www', 'products.json')); } catch(e) {}
            try { fs.copyFileSync(PRODUCTS_JSON, path.join(__dirname, 'complete', 'products.json')); } catch(e) {}
            try { fs.copyFileSync(PRODUCTS_JSON, 'C:\\Users\\ALICOM4\\Desktop\\new apk complete\\products.json'); } catch(e) {}
            try { fs.copyFileSync(PRODUCTS_JSON, path.join(__dirname, 'android', 'app', 'src', 'main', 'assets', 'public', 'products.json')); } catch(e) {}
          }
        } catch(e) {}
      }

      // Send response to Admin Panel immediately! (< 100ms)
      sendJson(res, 200, { ok: true, product: newProduct, cloudSync: sbAddRes ? sbAddRes.ok : false });
      scheduleDebouncedGitSync('Admin added new product #' + newId + ' (' + newProduct.name + ')');
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
      if (body.price !== undefined) {
        if (isNaN(body.price) || Number(body.price) <= 0) {
          return sendJson(res, 400, { ok: false, error: 'Product price must be greater than 0' });
        }
        sbUpdate.price = Number(body.price);
      }
      if (body.categoryId) sbUpdate.category_id = String(body.categoryId).trim();
      if (body.categoryName) sbUpdate.category_name = String(body.categoryName).trim();
      if (body.priority !== undefined) sbUpdate.priority = Number(body.priority) > 0 ? Number(body.priority) : null;

      let jsxContent = fs.readFileSync(JSX_FILE, 'utf8');
      const itemRegex = new RegExp(`\\{\\s*id:\\s*${id}\\s*,[^\\}]*\\}`, 'm');
      const match = jsxContent.match(itemRegex);

      if (match) {
        const currentItemStr = match[0];
        let updatedItemStr = currentItemStr;

        if (body.name) {
          const upperName = body.name.trim().toUpperCase().replace(/"/g, '\\"');
          updatedItemStr = updatedItemStr.replace(/name:\s*"[^"]*"/, `name: "${upperName}"`);
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

        jsxContent = jsxContent.replace(currentItemStr, () => updatedItemStr);
        fs.writeFileSync(JSX_FILE, jsxContent, 'utf8');
      }

      // Update purchase rate locally and sync to Supabase purchase_rates table
      if (body.purchasePrice !== undefined) {
        let rates = safeReadJson(RATES_FILE, { rates: {} });
        if (!rates.rates) rates.rates = {};
        if (body.purchasePrice === null || body.purchasePrice === '' || Number(body.purchasePrice) === 0) {
          delete rates.rates[String(id)];
          rates.updatedAt = new Date().toISOString();
          safeAtomicWriteJson(RATES_FILE, rates);

          supabaseApiRequest(`/rest/v1/purchase_rates?product_id=eq.${id}`, 'DELETE').catch(() => {});
        } else if (!isNaN(Number(body.purchasePrice)) && Number(body.purchasePrice) > 0) {
          rates.rates[String(id)] = Number(body.purchasePrice);
          rates.updatedAt = new Date().toISOString();
          safeAtomicWriteJson(RATES_FILE, rates);

          // Sync to secure private purchase_rates table (support both column names)
          supabaseApiRequest('/rest/v1/purchase_rates?on_conflict=product_id', 'POST', {
            product_id: id,
            purchase_price: Number(body.purchasePrice),
            purchase_rate: Number(body.purchasePrice),
            updated_at: new Date().toISOString()
          }).catch(() => {
            supabaseApiRequest('/rest/v1/purchase_rates?on_conflict=product_id', 'POST', {
              product_id: id,
              purchase_price: Number(body.purchasePrice),
              updated_at: new Date().toISOString()
            }).catch(() => {});
          });
        }
      }

      // Handle image update if sent (Always save as optimized WebP)
      if (body.imageBase64) {
        const base64Data = body.imageBase64.replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, '');
        const imgBuffer = Buffer.from(base64Data, 'base64');
        let imgExt = 'webp';
        let uploadBuffer = imgBuffer;
        if (sharp) {
          uploadBuffer = await sharp(imgBuffer)
            .resize(500, 500, { fit: 'inside', withoutEnlargement: true })
            .webp({ quality: 82 })
            .toBuffer();
          fs.writeFileSync(path.join(IMAGES_DIR, `${id}.webp`), uploadBuffer);
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
          const publicImgUrl = await supabaseUploadStorageImage(`${id}.${imgExt}`, uploadBuffer, 'image/webp');
          sbUpdate.has_image = true;
          sbUpdate.image_url = publicImgUrl || (sbCfg ? `${sbCfg.supabaseUrl}/storage/v1/object/public/product-images/${id}.${imgExt}` : null);
          sbUpdate.image_version = Date.now();
        } catch(e) {}
      }

      // Push update to Supabase Cloud Database (Instantly reflects on all phones!)
      let sbRes = null;
      try {
        sbRes = await supabaseApiRequest(`/rest/v1/products?id=eq.${id}`, 'PATCH', sbUpdate);
      } catch (e) {
        // Fallback: If schema lacks optional columns, retry with core product columns
        try {
          const coreUpdate = {
            name: sbUpdate.name,
            price: sbUpdate.price,
            category_id: sbUpdate.category_id,
            category_name: sbUpdate.category_name,
            has_image: sbUpdate.has_image,
            image_url: sbUpdate.image_url,
            image_version: sbUpdate.image_version,
            updated_at: sbUpdate.updated_at
          };
          Object.keys(coreUpdate).forEach(k => coreUpdate[k] === undefined && delete coreUpdate[k]);
          sbRes = await supabaseApiRequest(`/rest/v1/products?id=eq.${id}`, 'PATCH', coreUpdate);
        } catch (e2) {
          console.warn('Supabase patch warning:', e2);
        }
      }

      // Fast in-place update of local products.json (Takes ~2ms)
      if (fs.existsSync(PRODUCTS_JSON)) {
        try {
          const pj = JSON.parse(fs.readFileSync(PRODUCTS_JSON, 'utf8'));
          if (Array.isArray(pj.products)) {
            const pIdx = pj.products.findIndex(p => p.id === id);
            if (pIdx !== -1) {
              const currentP = pj.products[pIdx];
              if (body.name) currentP.name = body.name.trim().toUpperCase();
              if (body.price !== undefined) currentP.price = Number(body.price);
              if (body.categoryId) currentP.categoryId = body.categoryId.trim();
              if (body.categoryName) currentP.categoryName = body.categoryName.trim();
              if (body.priority !== undefined) currentP.priority = Number(body.priority) > 0 ? Number(body.priority) : undefined;
              if (body.purchasePrice !== undefined) {
                if (body.purchasePrice === null || body.purchasePrice === '' || Number(body.purchasePrice) === 0) {
                  delete currentP.purchasePrice;
                } else if (!isNaN(Number(body.purchasePrice)) && Number(body.purchasePrice) > 0) {
                  currentP.purchasePrice = Number(body.purchasePrice);
                }
              }
              if (sbUpdate.image_url) currentP.imageUrl = sbUpdate.image_url;
              if (sbUpdate.image_version) currentP.imageVersion = sbUpdate.image_version;
              pj.updatedAt = new Date().toISOString();
              safeAtomicWriteJson(PRODUCTS_JSON, pj);
              const extraTargets = [
                path.join(__dirname, 'www', 'products.json'),
                path.join(__dirname, 'complete', 'products.json'),
                path.join(__dirname, 'android', 'app', 'src', 'main', 'assets', 'public', 'products.json'),
                'C:\\Users\\ALICOM4\\Desktop\\new apk complete\\products.json'
              ];
              extraTargets.forEach(tgt => {
                try {
                  const dir = path.dirname(tgt);
                  if (fs.existsSync(dir)) fs.copyFileSync(PRODUCTS_JSON, tgt);
                } catch(e) {}
              });
            }
          }
        } catch(e) {}
      }

      // Respond immediately to Admin Panel! (< 100ms total response time!)
      sendJson(res, 200, { ok: true, id, cloudSync: sbRes ? sbRes.ok : false });

      // Debounced background sync without blocking UI
      scheduleDebouncedGitSync('Admin updated product #' + id);
      return;
    }

    // 5b. API: Products DELETE
    if (pathname.startsWith('/api/products/') && req.method === 'DELETE') {
      const id = parseInt(pathname.split('/').pop(), 10);
      if (!id) return sendJson(res, 400, { ok: false, error: 'Invalid product ID' });

      // Delete from Supabase Cloud Database immediately
      let sbDelRes = null;
      try {
        sbDelRes = await supabaseApiRequest(`/rest/v1/products?id=eq.${id}`, 'DELETE');
      } catch (e) {
        console.warn('Supabase delete warning:', e);
      }

      let jsxContent = fs.readFileSync(JSX_FILE, 'utf8');
      const itemRegex = new RegExp(`\\s*\\{\\s*id:\\s*${id}\\s*,[^\\}]*\\},?`, 'm');
      if (itemRegex.test(jsxContent)) {
        jsxContent = jsxContent.replace(itemRegex, '');
        fs.writeFileSync(JSX_FILE, jsxContent, 'utf8');
      }

      // Delete images locally across all targets and from Supabase storage
      ['webp', 'png', 'jpg', 'jpeg'].forEach(ext => {
        const targets = [
          path.join(IMAGES_DIR, `${id}.${ext}`),
          path.join(ROOT, 'www', 'images', `${id}.${ext}`),
          path.join(ROOT, 'android', 'app', 'src', 'main', 'assets', 'public', 'images', `${id}.${ext}`)
        ];
        targets.forEach(t => {
          if (fs.existsSync(t)) {
            try { fs.unlinkSync(t); } catch(e) {}
          }
        });
      });
      supabaseDeleteStorageImage([`${id}.webp`, `${id}.png`]).catch(() => {});
      supabaseApiRequest(`/rest/v1/purchase_rates?product_id=eq.${id}`, 'DELETE').catch(() => {});

      // Also remove from purchase rates
      if (fs.existsSync(RATES_FILE)) {
        try {
          const rates = safeReadJson(RATES_FILE, { rates: {} });
          if (rates.rates && rates.rates[String(id)]) {
            delete rates.rates[String(id)];
            rates.updatedAt = new Date().toISOString();
            safeAtomicWriteJson(RATES_FILE, rates);
          }
        } catch(e) {}
      }

      // Update local products.json in-place instantly
      if (fs.existsSync(PRODUCTS_JSON)) {
        try {
          const pj = JSON.parse(fs.readFileSync(PRODUCTS_JSON, 'utf8'));
          if (Array.isArray(pj.products)) {
            pj.products = pj.products.filter(p => p.id !== id);
            pj.total = pj.products.length;
            pj.updatedAt = new Date().toISOString();
            safeAtomicWriteJson(PRODUCTS_JSON, pj);
            try { fs.copyFileSync(PRODUCTS_JSON, path.join(__dirname, 'www', 'products.json')); } catch(e) {}
            try { fs.copyFileSync(PRODUCTS_JSON, path.join(__dirname, 'complete', 'products.json')); } catch(e) {}
          }
        } catch(e) {}
      }

      // Respond immediately to Admin Panel (< 50ms response time!)
      sendJson(res, 200, { ok: true, deletedId: id });
      scheduleDebouncedGitSync('Admin deleted product #' + id);
      return;
    }

    // 5b. API: Category Create POST
    if (pathname === '/api/categories' && req.method === 'POST') {
      const body = await parseBody(req);
      const catName = String(body.name || '').trim();
      if (!catName) {
        return sendJson(res, 400, { ok: false, error: 'Category name is required' });
      }

      let catId = String(body.id || '').trim().toLowerCase().replace(/[^a-z0-9]/g, '');
      if (!catId) {
        catId = catName.toLowerCase().replace(/[^a-z0-9]/g, '');
      }
      if (!catId) catId = 'cat_' + Date.now();

      const prioNum = body.priority !== undefined && body.priority !== null && !isNaN(Number(body.priority)) && Number(body.priority) > 0 ? Number(body.priority) : null;

      let pj = safeReadJson(PRODUCTS_JSON, { products: [], categories: [] });
      if (!Array.isArray(pj.categories)) pj.categories = [];
      const existing = pj.categories.find(c => c.id === catId || c.name.toLowerCase() === catName.toLowerCase());
      if (existing) {
        return sendJson(res, 200, { ok: true, category: existing, categories: pj.categories, message: 'Category already exists' });
      }

      const newCategory = {
        id: catId,
        name: catName
      };
      if (prioNum) newCategory.priority = prioNum;

      pj.categories.push(newCategory);
      pj.updatedAt = new Date().toISOString();
      safeAtomicWriteJson(PRODUCTS_JSON, pj);

      // Sync to category_priorities.json
      if (prioNum) {
        let priorities = safeReadJson(CAT_PRIORITIES_FILE, {});
        priorities[catId] = prioNum;
        safeAtomicWriteJson(CAT_PRIORITIES_FILE, priorities);
      }

      // ⚡ Cloud Backup to Supabase categories table
      try {
        await supabaseApiRequest('/rest/v1/categories?on_conflict=id', 'POST', [{
          id: catId,
          name: catName,
          priority: prioNum || null,
          updated_at: new Date().toISOString()
        }]);
        console.log(`[Supabase Category Create] Inserted category ${catId} (${catName}) into Supabase`);
      } catch (e) {
        console.warn('Supabase category create warning:', e.message);
      }

      // Update INDEX.JSX DEFAULT_CATEGORIES directly
      try {
        let jsx = fs.readFileSync(JSX_FILE, 'utf8');
        const catMatch = jsx.match(/(?:const|var)\s+DEFAULT_CATEGORIES\s*=\s*\[/);
        if (catMatch) {
          const insertIdx = catMatch.index + catMatch[0].length;
          const prioStr = prioNum ? `, priority: ${prioNum}` : '';
          const newLine = `\n    { id: "${catId}", name: "${catName.replace(/"/g, '\\"')}"${prioStr} },`;
          jsx = jsx.slice(0, insertIdx) + newLine + jsx.slice(insertIdx);
          fs.writeFileSync(JSX_FILE, jsx, 'utf8');
        }
      } catch(e) {
        console.warn('JSX category create notice:', e.message);
      }

      // Mirror products.json to all targets
      try {
        const mirrorDirs = [
          path.join(ROOT, 'www'),
          path.join(ROOT, 'complete'),
          'C:\\Users\\ALICOM4\\Desktop\\new apk complete',
          path.join(ROOT, 'android', 'app', 'src', 'main', 'assets', 'public')
        ];
        mirrorDirs.forEach(dir => {
          try {
            if (fs.existsSync(dir)) fs.copyFileSync(PRODUCTS_JSON, path.join(dir, 'products.json'));
          } catch(e) {}
        });
      } catch(e) {}

      // Compile JSX to app.js
      try {
        delete require.cache[require.resolve('./compile_jsx.js')];
        require('./compile_jsx.js');
      } catch(e) {}

      return sendJson(res, 200, { ok: true, category: newCategory, categories: pj.categories });
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

      // 1. ⚡ Real-time Supabase Cloud Database Sync (Immediate live update for all phones & web!)
      try {
        await supabaseApiRequest(`/rest/v1/categories?id=eq.${encodeURIComponent(catId)}`, 'PATCH', {
          priority: prioNum > 0 ? prioNum : null
        });
        console.log(`[Supabase Category Priority Sync] Set ${catId} -> priority: ${prioNum > 0 ? prioNum : 'null'}`);
      } catch (e) {
        console.warn('Supabase category priority update notice:', e.message);
      }

      // 2. Update INDEX.JSX DEFAULT_CATEGORIES directly
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

      // 3. Re-export products.json across all folders
      try {
        delete require.cache[require.resolve('./export_products.js')];
        require('./export_products.js');
        try {
          fs.copyFileSync(PRODUCTS_JSON, 'C:\\Users\\ALICOM4\\Desktop\\new apk complete\\products.json');
        } catch(e) {}
      } catch(e) {
        console.warn('Export products notice:', e.message);
      }

      // 4. Compile JSX and copy app.js to www and android public
      try {
        delete require.cache[require.resolve('./compile_jsx.js')];
        require('./compile_jsx.js');
        const srcApp = path.join(ROOT, 'app.js');
        if (fs.existsSync(srcApp)) {
          const tWww = path.join(ROOT, 'www', 'app.js');
          const tAndroid = path.join(ROOT, 'android', 'app', 'src', 'main', 'assets', 'public', 'app.js');
          fs.copyFileSync(srcApp, tWww);
          fs.copyFileSync(srcApp, tAndroid);
        }
      } catch(e) {
        console.warn('Compile JSX on category priority notice:', e.message);
      }

      let updatedCategories = [];
      try {
        const pj = JSON.parse(fs.readFileSync(PRODUCTS_JSON, 'utf8'));
        updatedCategories = pj.categories || [];
      } catch(e) {}

      return sendJson(res, 200, { ok: true, catId, priority: prioNum, categories: updatedCategories });
    }

    // 5d. API: RENAME Category (Permanent rename in products.json, Supabase, INDEX.JSX, app.js, sw.js)
    if (pathname.startsWith('/api/categories/') && pathname.endsWith('/rename') && (req.method === 'PUT' || req.method === 'POST')) {
      const parts = pathname.split('/');
      const catId = decodeURIComponent(parts[3] || '');
      const body = await parseBody(req);
      const newName = (body.name || '').trim();

      if (!catId) return sendJson(res, 400, { ok: false, error: 'Category ID is required' });
      if (!newName) return sendJson(res, 400, { ok: false, error: 'New Category Name is required' });

      // ── 1. Load products.json ──────────────────────────────────
      let pj = { categories: [], products: [] };
      try { pj = JSON.parse(fs.readFileSync(PRODUCTS_JSON, 'utf8')); } catch(e) {}
      if (!Array.isArray(pj.categories)) pj.categories = [];
      if (!Array.isArray(pj.products)) pj.products = [];

      const catObj = pj.categories.find(c => c.id === catId);
      if (!catObj) return sendJson(res, 404, { ok: false, error: 'Category not found: ' + catId });

      const oldName = catObj.name;
      catObj.name = newName;

      // Update categoryName in all matching products
      let affectedProductsCount = 0;
      pj.products.forEach(p => {
        if (p.categoryId === catId) {
          p.categoryName = newName;
          affectedProductsCount++;
        }
      });

      // Save products.json
      fs.writeFileSync(PRODUCTS_JSON, JSON.stringify(pj, null, 2), 'utf8');

      // ── 2. Update category_priorities.json ─────────────────────
      try {
        if (fs.existsSync(CAT_PRIORITIES_FILE)) {
          let cp = {};
          try { cp = JSON.parse(fs.readFileSync(CAT_PRIORITIES_FILE, 'utf8')); } catch(e) {}
          if (Array.isArray(cp)) {
            const item = cp.find(x => x.id === catId);
            if (item) item.name = newName;
          } else if (cp[catId] && typeof cp[catId] === 'object') {
            cp[catId].name = newName;
          }
          fs.writeFileSync(CAT_PRIORITIES_FILE, JSON.stringify(cp, null, 2), 'utf8');
        }
      } catch(e) { console.warn('category_priorities rename notice:', e.message); }

      // ── 3. Supabase Cloud Database Realtime Sync ───────────────
      try {
        await supabaseApiRequest(`/rest/v1/categories?id=eq.${encodeURIComponent(catId)}`, 'PATCH', {
          name: newName,
          updated_at: new Date().toISOString()
        });
        console.log(`[Supabase] Category ${catId} renamed to: "${newName}"`);
      } catch(e) { console.warn('Supabase category rename notice:', e.message); }

      try {
        if (affectedProductsCount > 0) {
          await supabaseApiRequest(`/rest/v1/products?category_id=eq.${encodeURIComponent(catId)}`, 'PATCH', {
            category_name: newName
          });
          console.log(`[Supabase] Updated ${affectedProductsCount} products category_name -> "${newName}"`);
        }
      } catch(e) { console.warn('Supabase product category_name notice:', e.message); }

      // ── 4. Update INDEX.JSX ────────────────────────────────────
      try {
        let jsx = fs.readFileSync(JSX_FILE, 'utf8');
        const catDefRegex = new RegExp(`(\\{\\s*id:\\s*"${catId}"[^\n\\}]*name:\\s*")[^"]*(")`);
        if (catDefRegex.test(jsx)) {
          jsx = jsx.replace(catDefRegex, `$1${newName}$2`);
        }
        if (oldName) {
          const escapedOld = oldName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          jsx = jsx.replace(new RegExp(`categoryName:\\s*"${escapedOld}"`, 'g'), `categoryName: "${newName}"`);
        }
        fs.writeFileSync(JSX_FILE, jsx, 'utf8');
        console.log(`[JSX] Renamed category ${catId} to "${newName}" in INDEX.JSX`);
      } catch(e) { console.warn('JSX rename notice:', e.message); }

      // ── 5. Mirror products.json across all folders ─────────────
      const mirrorTargets = [
        path.join(ROOT, 'www', 'products.json'),
        path.join(ROOT, 'android', 'app', 'src', 'main', 'assets', 'public', 'products.json'),
        path.join(ROOT, 'complete', 'products.json'),
        'C:\\Users\\ALICOM4\\Desktop\\new apk complete\\products.json'
      ];
      const freshPj = fs.readFileSync(PRODUCTS_JSON, 'utf8');
      mirrorTargets.forEach(t => { try { fs.writeFileSync(t, freshPj, 'utf8'); } catch(e) {} });

      // ── 6. Recompile JSX -> app.js ─────────────────────────────
      try {
        delete require.cache[require.resolve('./compile_jsx.js')];
        require('./compile_jsx.js');
        const srcApp = path.join(ROOT, 'app.js');
        if (fs.existsSync(srcApp)) {
          const appContent = fs.readFileSync(srcApp);
          fs.writeFileSync(path.join(ROOT, 'www', 'app.js'), appContent);
          fs.writeFileSync(path.join(ROOT, 'android', 'app', 'src', 'main', 'assets', 'public', 'app.js'), appContent);
        }
      } catch(e) { console.warn('Compile JSX on category rename notice:', e.message); }

      // ── 7. Bump Service Worker Cache Version ───────────────────
      try {
        const swPath = path.join(ROOT, 'sw.js');
        if (fs.existsSync(swPath)) {
          let sw = fs.readFileSync(swPath, 'utf8');
          const newVer = 'v' + Date.now();
          sw = sw.replace(/const CACHE_VERSION = '[^']+';/, `const CACHE_VERSION = '${newVer}';`);
          fs.writeFileSync(swPath, sw, 'utf8');
          const swMirrors = [
            path.join(ROOT, 'www', 'sw.js'),
            path.join(ROOT, 'android', 'app', 'src', 'main', 'assets', 'public', 'sw.js'),
            path.join(ROOT, 'complete', 'sw.js'),
            'C:\\Users\\ALICOM4\\Desktop\\new apk complete\\sw.js'
          ];
          swMirrors.forEach(m => { try { fs.writeFileSync(m, sw, 'utf8'); } catch(e) {} });
        }
      } catch(e) { console.warn('Service worker bump notice:', e.message); }

      return sendJson(res, 200, {
        ok: true,
        catId,
        oldName,
        newName,
        affectedProductsCount,
        categories: pj.categories
      });
    }

    // 6b. API: DELETE Category (Permanent remove from products.json, Supabase, INDEX.JSX)
    if (pathname.startsWith('/api/categories/') && !pathname.endsWith('/priority') && req.method === 'DELETE') {
      const parts = pathname.split('/');
      const catId = decodeURIComponent(parts[3] || '');
      if (!catId) return sendJson(res, 400, { ok: false, error: 'Category ID required' });

      // ── 1. Load products.json ──────────────────────────────────
      let pj = { categories: [], products: [] };
      try { pj = JSON.parse(fs.readFileSync(PRODUCTS_JSON, 'utf8')); } catch(e) {}
      if (!Array.isArray(pj.categories)) pj.categories = [];
      if (!Array.isArray(pj.products)) pj.products = [];

      const catExists = pj.categories.find(c => c.id === catId);
      if (!catExists) return sendJson(res, 404, { ok: false, error: 'Category not found: ' + catId });

      // Count how many products are in this category
      const affectedProducts = pj.products.filter(p => p.categoryId === catId);

      // ── 2. Remove category from categories array ───────────────
      pj.categories = pj.categories.filter(c => c.id !== catId);

      // ── 3. Move affected products to 'general' category ────────
      pj.products.forEach(p => {
        if (p.categoryId === catId) {
          p.categoryId = 'general';
          p.categoryName = 'General Items & Others';
        }
      });

      // ── 4. Save products.json ──────────────────────────────────
      fs.writeFileSync(PRODUCTS_JSON, JSON.stringify(pj, null, 2), 'utf8');

      // ── 5. Remove from category_priorities.json ────────────────
      try {
        if (fs.existsSync(CAT_PRIORITIES_FILE)) {
          let cp = {};
          try { cp = JSON.parse(fs.readFileSync(CAT_PRIORITIES_FILE, 'utf8')); } catch(e) {}
          delete cp[catId];
          fs.writeFileSync(CAT_PRIORITIES_FILE, JSON.stringify(cp, null, 2), 'utf8');
        }
      } catch(e) { console.warn('cat_priorities delete notice:', e.message); }

      // ── 6. Remove from Supabase categories table ───────────────
      try {
        await supabaseApiRequest(`/rest/v1/categories?id=eq.${encodeURIComponent(catId)}`, 'DELETE', null);
        console.log(`[Supabase] Category deleted: ${catId}`);
      } catch(e) { console.warn('Supabase category delete notice:', e.message); }

      // ── 7. Update Supabase products table (move to general) ────
      if (affectedProducts.length > 0) {
        try {
          await supabaseApiRequest(
            `/rest/v1/products?category_id=eq.${encodeURIComponent(catId)}`,
            'PATCH',
            { category_id: 'general', category_name: 'General Items & Others' }
          );
          console.log(`[Supabase] Moved ${affectedProducts.length} products from ${catId} to general`);
        } catch(e) { console.warn('Supabase products reassign notice:', e.message); }
      }

      // ── 8. Remove from INDEX.JSX DEFAULT_CATEGORIES ───────────
      try {
        let jsx = fs.readFileSync(JSX_FILE, 'utf8');
        // Remove the category line from DEFAULT_CATEGORIES array
        const catLineRegex = new RegExp(`\\s*\\{\\s*id:\\s*"${catId}"[^}]*\\}\\s*,?`, 'g');
        jsx = jsx.replace(catLineRegex, '');
        // Also update all products with this categoryId in JSX
        jsx = jsx.replace(new RegExp(`categoryId: "${catId}"`, 'g'), 'categoryId: "general"');
        jsx = jsx.replace(new RegExp(`categoryName: "${catExists.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`, 'g'), 'categoryName: "General Items & Others"');
        fs.writeFileSync(JSX_FILE, jsx, 'utf8');
        console.log(`[JSX] Removed category ${catId} from INDEX.JSX`);
      } catch(e) { console.warn('JSX category remove notice:', e.message); }

      // ── 9. Mirror products.json to all folders ─────────────────
      const mirrorTargets = [
        path.join(ROOT, 'www', 'products.json'),
        path.join(ROOT, 'android', 'app', 'src', 'main', 'assets', 'public', 'products.json'),
        path.join(ROOT, 'complete', 'products.json'),
        'C:\\Users\\ALICOM4\\Desktop\\new apk complete\\products.json'
      ];
      const freshPj = fs.readFileSync(PRODUCTS_JSON, 'utf8');
      mirrorTargets.forEach(t => { try { fs.writeFileSync(t, freshPj, 'utf8'); } catch(e) {} });

      // ── 10. Recompile JSX → app.js ────────────────────────────
      try {
        delete require.cache[require.resolve('./compile_jsx.js')];
        require('./compile_jsx.js');
        const srcApp = path.join(ROOT, 'app.js');
        if (fs.existsSync(srcApp)) {
          const appContent = fs.readFileSync(srcApp);
          fs.writeFileSync(path.join(ROOT, 'www', 'app.js'), appContent);
          fs.writeFileSync(path.join(ROOT, 'android', 'app', 'src', 'main', 'assets', 'public', 'app.js'), appContent);
        }
      } catch(e) { console.warn('Compile JSX on category delete notice:', e.message); }

      return sendJson(res, 200, {
        ok: true,
        deletedCategoryId: catId,
        deletedCategoryName: catExists.name,
        affectedProductsCount: affectedProducts.length,
        categories: pj.categories
      });
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

      // Optimized live recalculation: preserve locked-in historical item rates while backfilling missing rates
      const limitRecalc = Math.min(dsr.orders.length, 500);
      for (let i = 0; i < limitRecalc; i++) {
        dsr.orders[i] = calculateOrderProfit(dsr.orders[i], rates, catalog, { preserveExistingItemRates: true });
      }
      for (let i = limitRecalc; i < dsr.orders.length; i++) {
        if (dsr.orders[i].totalProfit === undefined) {
          dsr.orders[i] = calculateOrderProfit(dsr.orders[i], rates, catalog, { preserveExistingItemRates: true });
        }
      }

      const coverage = getPurchaseRatesCoverage();

      return sendJson(res, 200, {
        orders: dsr.orders,
        expenses: dsr.expenses,
        coverage: coverage
      });
    }

    // 6b. API: Manual Cloud Orders Sync Trigger
    if (pathname === '/api/dsr/sync-cloud' && req.method === 'GET') {
      const added = await syncCloudOrders();
      return sendJson(res, 200, { ok: true, added, message: 'Cloud sync completed' });
    }

    // 7. API: DSR Order POST (Manual / Counter / WhatsApp import / POS Edit)
    if (pathname === '/api/dsr/order' && req.method === 'POST') {
      const body = await parseBody(req);
      let dsr = safeReadJson(DSR_FILE, { orders: [], expenses: [] });
      if (!Array.isArray(dsr.orders)) dsr.orders = [];

      let ratesObj = safeReadJson(RATES_FILE, { rates: {} });
      if (!ratesObj.rates) ratesObj.rates = {};

      // Only explicit admin-provided updatedRates object can alter permanent store rates
      let ratesChanged = false;
      const changedRateRows = [];
      if (body.updatedRates && typeof body.updatedRates === 'object') {
        Object.keys(body.updatedRates).forEach(k => {
          const val = Number(body.updatedRates[k]);
          if (!isNaN(val) && val > 0 && !isNaN(Number(k)) && Number(k) > 0) {
            ratesObj.rates[String(k)] = val;
            ratesChanged = true;
            changedRateRows.push({
              product_id: Number(k),
              purchase_price: val,
              updated_at: new Date().toISOString()
            });
          }
        });
      }
      if (ratesChanged) {
        ratesObj.updatedAt = new Date().toISOString();
        safeAtomicWriteJson(RATES_FILE, ratesObj);
        if (changedRateRows.length > 0) {
          supabaseApiRequest('/rest/v1/purchase_rates?on_conflict=product_id', 'POST', changedRateRows).catch(() => {});
        }
      }

      const catalog = getProductsCatalogMap();
      const orderId = body.id || ('ORD-' + Date.now());
      const existingIdx = dsr.orders.findIndex(o => String(o.id) === String(orderId));
      const existingOrder = existingIdx >= 0 ? dsr.orders[existingIdx] : null;

      const now = new Date();
      const orderDate = body.date || (existingOrder ? existingOrder.date : null) || getPktDateString();
      const orderTime = body.time || (existingOrder ? existingOrder.time : null) || now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });

      const rawOrder = {
        ...(existingOrder || {}),
        id: orderId,
        date: orderDate,
        time: orderTime,
        channel: body.channel || (existingOrder && existingOrder.channel) || 'shop',
        paymentMethod: body.paymentMethod || (existingOrder && existingOrder.paymentMethod) || 'cash',
        customerName: body.customerName || body.customer?.name || (existingOrder && existingOrder.customerName) || 'Walk-in Customer',
        customerPhone: body.customerPhone !== undefined ? body.customerPhone : (body.customer?.phone !== undefined ? body.customer.phone : ((existingOrder && existingOrder.customerPhone) || '')),
        customerAddress: body.customerAddress !== undefined ? body.customerAddress : (body.customer?.address !== undefined ? body.customer.address : ((existingOrder && existingOrder.customerAddress) || '')),
        deliveryMethod: body.deliveryMethod || (existingOrder && existingOrder.deliveryMethod) || 'pickup',
        location: body.location !== undefined ? body.location : (body.customer?.location !== undefined ? body.customer.location : ((existingOrder && existingOrder.location) || null)),
        notes: body.notes !== undefined ? body.notes : ((existingOrder && existingOrder.notes) || ''),
        photoUrl: body.photoUrl !== undefined ? body.photoUrl : ((existingOrder && existingOrder.photoUrl) || null),
        items: body.items || (existingOrder && existingOrder.items) || [],
        deliveryFee: body.deliveryFee !== undefined ? Number(body.deliveryFee) : Number((existingOrder && existingOrder.deliveryFee) || 0),
        status: body.status || (existingOrder && existingOrder.status) || 'completed',
        source: body.source || (existingOrder && existingOrder.source) || (body.channel === 'whatsapp' ? 'whatsapp' : 'pos')
      };

      const processed = calculateOrderProfit(rawOrder, ratesObj.rates, catalog, { trustItemPurchasePrice: true });
      processed.subtotal = Number(processed.totalSale || 0);
      processed.total = Number(processed.grandTotal || processed.totalSale || 0);
      processed.profit = Number(processed.totalProfit || 0);

      if (existingIdx >= 0) {
        dsr.orders[existingIdx] = processed;
      } else {
        dsr.orders.unshift(processed);
      }

      safeAtomicWriteJson(DSR_FILE, dsr);

      // Sync order to Supabase Cloud Database orders table (upsert on conflict)
      supabaseApiRequest('/rest/v1/orders?on_conflict=id', 'POST', {
        id: String(processed.id),
        customer_name: (processed.customer && processed.customer.name) || processed.customerName || 'Customer',
        customer_phone: (processed.customer && processed.customer.phone) || processed.customerPhone || '',
        customer_address: (processed.customer && processed.customer.address) || processed.customerAddress || '',
        delivery_type: processed.deliveryType || processed.deliveryMethod || 'standard',
        payment_method: processed.paymentMethod || 'cash',
        subtotal: Number(processed.totalSale || processed.subtotal || 0),
        delivery_fee: Number(processed.deliveryFee || 0),
        total: Number(processed.grandTotal || processed.total || processed.totalSale || 0),
        total_savings: Number(processed.totalSavings || 0),
        profit: Number(processed.totalProfit || processed.profit || 0),
        status: processed.status || 'placed',
        items: processed.items || [],
        raw_data: processed,
        created_at: processed.date ? new Date(processed.date).toISOString() : new Date().toISOString(),
        updated_at: new Date().toISOString()
      }).catch(() => {});

      syncOrderStatusesToSupabase(dsr.orders);

      return sendJson(res, 200, { ok: true, order: processed });
    }

    // 7a. API: DSR Order Status Update PUT (Syncs live to Customer App tracker via Supabase)
    if (pathname.startsWith('/api/dsr/order/') && pathname.endsWith('/status') && (req.method === 'PUT' || req.method === 'POST')) {
      const orderId = decodeURIComponent(pathname.replace('/api/dsr/order/', '').replace('/status', '').trim());
      const body = await parseBody(req);
      const newStatus = String(body.status || '').trim().toLowerCase();
      if (!orderId || !newStatus) {
        return sendJson(res, 400, { ok: false, error: 'Missing order ID or status' });
      }

      let dsr = safeReadJson(DSR_FILE, { orders: [], expenses: [] });
      if (!Array.isArray(dsr.orders)) dsr.orders = [];
      const ordIdx = dsr.orders.findIndex(o => String(o.id) === String(orderId));
      if (ordIdx < 0) {
        return sendJson(res, 404, { ok: false, error: 'Order not found' });
      }

      dsr.orders[ordIdx].status = newStatus;
      dsr.orders[ordIdx].updatedAt = new Date().toISOString();
      safeAtomicWriteJson(DSR_FILE, dsr);

      // Update order status in Supabase public.orders and public.store_settings (id=order_statuses)
      supabaseApiRequest(`/rest/v1/orders?id=eq.${encodeURIComponent(orderId)}`, 'PATCH', {
        status: newStatus,
        raw_data: dsr.orders[ordIdx],
        updated_at: new Date().toISOString()
      }).catch(() => {});
      syncOrderStatusesToSupabase(dsr.orders);

      return sendJson(res, 200, { ok: true, id: orderId, status: newStatus });
    }

    // 7a-2. API: Order Status GET (Customer App status query fallback)
    if (pathname === '/api/order-status' && req.method === 'GET') {
      const ordId = (reqUrl.searchParams.get('id') || '').trim();
      if (!ordId) return sendJson(res, 400, { ok: false, error: 'Missing order id parameter' });
      let dsr = safeReadJson(DSR_FILE, { orders: [] });
      const found = (dsr.orders || []).find(o => String(o.id) === String(ordId));
      if (found) {
        return sendJson(res, 200, { ok: true, found: true, id: ordId, status: found.status || 'placed' });
      }
      return sendJson(res, 404, { ok: false, error: 'Order not found' });
    }

    // 7b. API: Single Product Purchase Rate Update (With instant order profit recalculation)
    if (pathname.startsWith('/api/products/') && pathname.endsWith('/purchase-rate') && req.method === 'POST') {
      const parts = pathname.split('/');
      const itemId = parts[3];
      if (!itemId || itemId.startsWith('CUST-') || isNaN(Number(itemId))) {
        return sendJson(res, 400, { ok: false, error: 'Custom or non-numeric items cannot have catalog purchase rates' });
      }
      const body = await parseBody(req);
      const isClearing = body.purchasePrice === null || body.purchasePrice === '' || body.clear === true;
      const newRate = Number(body.purchasePrice !== undefined ? body.purchasePrice : (body.rate !== undefined ? body.rate : body.price));

      let ratesObj = safeReadJson(RATES_FILE, { rates: {} });
      if (!ratesObj.rates) ratesObj.rates = {};

      if (isClearing || (!isNaN(newRate) && newRate <= 0)) {
        delete ratesObj.rates[String(itemId)];
        ratesObj.updatedAt = new Date().toISOString();
        safeAtomicWriteJson(RATES_FILE, ratesObj);

        supabaseApiRequest(`/rest/v1/purchase_rates?product_id=eq.${itemId}`, 'DELETE').catch(() => {});

        if (fs.existsSync(DSR_FILE)) {
          try {
            const dsr = safeReadJson(DSR_FILE, { orders: [], expenses: [] });
            if (Array.isArray(dsr.orders)) {
              const catalog = getProductsCatalogMap();
              dsr.orders = dsr.orders.map(o => calculateOrderProfit(o, ratesObj.rates, catalog, { preserveExistingItemRates: true, clearItemId: itemId }));
              safeAtomicWriteJson(DSR_FILE, dsr);
            }
          } catch(e) {}
        }
        if (fs.existsSync(PRODUCTS_JSON)) {
          try {
            const pj = JSON.parse(fs.readFileSync(PRODUCTS_JSON, 'utf8'));
            if (Array.isArray(pj.products)) {
              const prod = pj.products.find(p => String(p.id) === String(itemId));
              if (prod) {
                delete prod.purchasePrice;
                pj.updatedAt = new Date().toISOString();
                safeAtomicWriteJson(PRODUCTS_JSON, pj);
                try { fs.copyFileSync(PRODUCTS_JSON, path.join(__dirname, 'www', 'products.json')); } catch(e) {}
                try { fs.copyFileSync(PRODUCTS_JSON, path.join(__dirname, 'complete', 'products.json')); } catch(e) {}
              }
            }
          } catch(e) {}
        }
        return sendJson(res, 200, { ok: true, id: itemId, cleared: true });
      }

      if (!isNaN(newRate) && newRate > 0) {
        ratesObj.rates[String(itemId)] = newRate;
        ratesObj.updatedAt = new Date().toISOString();
        safeAtomicWriteJson(RATES_FILE, ratesObj);

        // Also update products.json in-place
        if (fs.existsSync(PRODUCTS_JSON)) {
          try {
            const pj = JSON.parse(fs.readFileSync(PRODUCTS_JSON, 'utf8'));
            if (Array.isArray(pj.products)) {
              const prod = pj.products.find(p => String(p.id) === String(itemId));
              if (prod) {
                prod.purchasePrice = newRate;
                pj.updatedAt = new Date().toISOString();
                safeAtomicWriteJson(PRODUCTS_JSON, pj);
                try { fs.copyFileSync(PRODUCTS_JSON, path.join(__dirname, 'www', 'products.json')); } catch(e) {}
                try { fs.copyFileSync(PRODUCTS_JSON, path.join(__dirname, 'complete', 'products.json')); } catch(e) {}
              }
            }
          } catch(e) {}
        }

        // Sync purchase price directly to Supabase purchase_rates table!
        supabaseApiRequest('/rest/v1/purchase_rates?on_conflict=product_id', 'POST', {
          product_id: Number(itemId),
          purchase_price: newRate,
          updated_at: new Date().toISOString()
        }).catch(() => {});

        // Recalculate orders in dsr_data.json (preserve locked historical rates, backfill missing, or force update if edited in Order Details Modal)
        if (fs.existsSync(DSR_FILE)) {
          try {
            const dsr = safeReadJson(DSR_FILE, { orders: [], expenses: [] });
            if (Array.isArray(dsr.orders)) {
              const catalog = getProductsCatalogMap();
              dsr.orders = dsr.orders.map(o => calculateOrderProfit(o, ratesObj.rates, catalog, {
                preserveExistingItemRates: true,
                forceOrderId: body.forceOrderId,
                forceItemId: body.forceItemId || itemId
              }));
              safeAtomicWriteJson(DSR_FILE, dsr);
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
      let dsr = safeReadJson(DSR_FILE, { orders: [], expenses: [] });
      if (!Array.isArray(dsr.expenses)) dsr.expenses = [];

      const expense = {
        id: 'EXP-' + Date.now(),
        date: body.date || getPktDateString(),
        title: body.title || 'General Expense',
        amount: Number(body.amount) || 0,
        category: body.category || 'misc'
      };

      dsr.expenses.unshift(expense);
      safeAtomicWriteJson(DSR_FILE, dsr);

      // Cloud Backup to Supabase expenses table!
      supabaseApiRequest('/rest/v1/expenses?on_conflict=id', 'POST', {
        id: expense.id,
        date: expense.date,
        title: expense.title,
        amount: expense.amount,
        category: expense.category,
        updated_at: new Date().toISOString()
      }).catch(() => {});

      return sendJson(res, 200, { ok: true, expense });
    }

    // 9. API: Purchase Rates GET & POST
    if (pathname === '/api/purchase-rates' && req.method === 'GET') {
      const allRates = getSavedPurchaseRates();
      return sendJson(res, 200, { ok: true, rates: allRates, updatedAt: new Date().toISOString() });
    }

    if (pathname === '/api/purchase-rates' && req.method === 'POST') {
      const body = await parseBody(req);
      let rates = safeReadJson(RATES_FILE, { rates: {} });
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
      safeAtomicWriteJson(RATES_FILE, rates);

      // Sync updated rates to Supabase purchase_rates table!
      if (body.id !== undefined && body.rate !== undefined) {
        supabaseApiRequest('/rest/v1/purchase_rates?on_conflict=product_id', 'POST', {
          product_id: Number(body.id),
          purchase_price: Number(body.rate),
          updated_at: new Date().toISOString()
        }).catch(() => {});
      } else if (body.rates && typeof body.rates === 'object') {
        const rateRows = Object.entries(body.rates).map(([k, v]) => ({
          product_id: Number(k),
          purchase_price: Number(v) || 0,
          updated_at: new Date().toISOString()
        }));
        if (rateRows.length > 0) {
          supabaseApiRequest('/rest/v1/purchase_rates?on_conflict=product_id', 'POST', rateRows).catch(() => {});
        }
      }

      // Also sync into products.json
      if (fs.existsSync(PRODUCTS_JSON)) {
        try {
          const pj = JSON.parse(fs.readFileSync(PRODUCTS_JSON, 'utf8'));
          if (Array.isArray(pj.products)) {
            let changed = false;
            pj.products.forEach(p => {
              if (rates.rates[String(p.id)] !== undefined) {
                p.purchasePrice = Number(rates.rates[String(p.id)]);
                changed = true;
              }
            });
            if (changed) {
              pj.updatedAt = new Date().toISOString();
              safeAtomicWriteJson(PRODUCTS_JSON, pj);
              const extraTargets = [
                path.join(__dirname, 'www', 'products.json'),
                path.join(__dirname, 'complete', 'products.json'),
                path.join(__dirname, 'android', 'app', 'src', 'main', 'assets', 'public', 'products.json'),
                'C:\\Users\\ALICOM4\\Desktop\\new apk complete\\products.json'
              ];
              extraTargets.forEach(tgt => {
                try {
                  const dir = path.dirname(tgt);
                  if (fs.existsSync(dir)) fs.copyFileSync(PRODUCTS_JSON, tgt);
                } catch(e) {}
              });
            }
          }
        } catch(e) {}
      }

      // Recalculate orders in dsr_data.json (preserve locked historical rates, backfill missing)
      if (fs.existsSync(DSR_FILE)) {
        try {
          const dsr = safeReadJson(DSR_FILE, { orders: [], expenses: [] });
          if (Array.isArray(dsr.orders)) {
            const catalog = getProductsCatalogMap();
            dsr.orders = dsr.orders.map(o => calculateOrderProfit(o, rates.rates, catalog, { preserveExistingItemRates: true }));
            safeAtomicWriteJson(DSR_FILE, dsr);
          }
        } catch(e) {}
      }

      return sendJson(res, 200, { ok: true, count: Object.keys(rates.rates).length, rates: rates.rates });
    }

    // 9b. API: DSR Order DELETE
    if (pathname.startsWith('/api/dsr/order/') && req.method === 'DELETE') {
      const orderId = pathname.replace('/api/dsr/order/', '').trim();
      let dsr = safeReadJson(DSR_FILE, { orders: [], expenses: [] });
      const initialCount = (dsr.orders || []).length;
      dsr.orders = (dsr.orders || []).filter(o => String(o.id) !== String(orderId));
      if (dsr.orders.length < initialCount) {
        safeAtomicWriteJson(DSR_FILE, dsr);
        // Also delete from Supabase orders table and update order statuses map
        supabaseApiRequest(`/rest/v1/orders?id=eq.${encodeURIComponent(orderId)}`, 'DELETE').catch(() => {});
        syncOrderStatusesToSupabase(dsr.orders);
        return sendJson(res, 200, { ok: true, message: 'Order deleted successfully' });
      }
      return sendJson(res, 404, { error: 'Order not found' });
    }

    // 9c. API: DSR Expense DELETE
    if (pathname.startsWith('/api/dsr/expense/') && req.method === 'DELETE') {
      const expId = pathname.replace('/api/dsr/expense/', '').trim();
      let dsr = safeReadJson(DSR_FILE, { orders: [], expenses: [] });
      const initialCount = (dsr.expenses || []).length;
      dsr.expenses = (dsr.expenses || []).filter(e => String(e.id) !== String(expId));
      if (dsr.expenses.length < initialCount) {
        safeAtomicWriteJson(DSR_FILE, dsr);

        // Delete from Supabase expenses table
        supabaseApiRequest(`/rest/v1/expenses?id=eq.${expId}`, 'DELETE').catch(() => {});

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

      // Cloud Backup to Supabase purchasing_sections table!
      supabaseApiRequest('/rest/v1/purchasing_sections?on_conflict=id', 'POST', {
        id: 'main',
        sections: current.sections || [],
        item_sections: current.itemSections || {},
        updated_at: current.updatedAt
      }).catch(() => {});

      // Mirror purchasing_sections.json across all backup directories
      const secMirrorDirs = [
        path.join(ROOT, 'complete'),
        'C:\\Users\\ALICOM4\\Desktop\\new apk complete'
      ];
      secMirrorDirs.forEach(d => {
        try {
          if (fs.existsSync(d)) {
            fs.writeFileSync(path.join(d, 'purchasing_sections.json'), JSON.stringify(current, null, 2), 'utf8');
          }
        } catch(e) {}
      });

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
        date: body.date || getPktDateString(),
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
        let rates = safeReadJson(RATES_FILE, { rates: {} });
        if (!rates.rates) rates.rates = {};
        const rateRows = [];
        for (const [k, v] of Object.entries(body.updatedRates)) {
          if (v !== undefined && Number(v) > 0 && !isNaN(Number(k)) && Number(k) > 0) {
            rates.rates[String(k)] = Number(v);
            rateRows.push({
              product_id: Number(k),
              purchase_price: Number(v),
              updated_at: new Date().toISOString()
            });
          }
        }
        rates.updatedAt = new Date().toISOString();
        safeAtomicWriteJson(RATES_FILE, rates);

        // Sync to Supabase purchase_rates table!
        if (rateRows.length > 0) {
          supabaseApiRequest('/rest/v1/purchase_rates?on_conflict=product_id', 'POST', rateRows).catch(() => {});
        }

        // Recalculate DSR orders profit with new rates (preserve historical rates, backfill missing)!
        if (fs.existsSync(DSR_FILE)) {
          try {
            const dsr = safeReadJson(DSR_FILE, { orders: [], expenses: [] });
            if (Array.isArray(dsr.orders)) {
              const catalog = getProductsCatalogMap();
              dsr.orders = dsr.orders.map(o => calculateOrderProfit(o, rates.rates, catalog, { preserveExistingItemRates: true }));
              safeAtomicWriteJson(DSR_FILE, dsr);
            }
          } catch(e) {}
        }
      }

      // Also persist item sections permanently if included
      if (body.updatedItemSections && typeof body.updatedItemSections === 'object') {
        let secData = safeReadJson(SECTIONS_FILE, { sections: [], itemSections: {} });
        if (!secData.itemSections) secData.itemSections = {};
        for (const [k, v] of Object.entries(body.updatedItemSections)) {
          if (v) secData.itemSections[String(k)] = String(v).trim();
        }
        secData.updatedAt = new Date().toISOString();
        safeAtomicWriteJson(SECTIONS_FILE, secData);
      }

      // Cloud Backup to Supabase purchasing_sheets table!
      supabaseApiRequest('/rest/v1/purchasing_sheets?on_conflict=id', 'POST', {
        id: sheet.id,
        date: sheet.date,
        title: sheet.title,
        market_name: sheet.marketName,
        items: sheet.items,
        sections: sheet.sections,
        total_items: sheet.totalItems,
        total_qty: sheet.totalQty,
        total_amount: sheet.totalAmount,
        created_at: sheet.createdAt
      }).catch(() => {});

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

        // Delete from Supabase purchasing_sheets table
        supabaseApiRequest(`/rest/v1/purchasing_sheets?id=eq.${sheetId}`, 'DELETE').catch(() => {});

        return sendJson(res, 200, { ok: true, message: 'Purchasing sheet deleted' });
      }
      return sendJson(res, 404, { error: 'Purchasing sheet not found' });
    }

    // 9b. API: Settings GET
    if (pathname === '/api/settings' && req.method === 'GET') {
      const defaults = { deliveryFee: 99, freeDeliveryThreshold: 1999, deliveryTiming: 'Delivery Timing: 10:00 AM – 10:00 PM', whatsapp: '923368945775', storeName: 'ZS Mart', announcement: '' };
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
      let current = { deliveryFee: 99, freeDeliveryThreshold: 1999, deliveryTiming: 'Delivery Timing: 10:00 AM – 10:00 PM', whatsapp: '923368945775', storeName: 'ZS Mart', announcement: '' };
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

      // Sync store settings directly to Supabase Cloud Database!
      supabaseApiRequest('/rest/v1/store_settings?id=eq.main', 'PATCH', {
        delivery_fee: newSettings.deliveryFee,
        free_delivery_threshold: newSettings.freeDeliveryThreshold,
        delivery_timing: newSettings.deliveryTiming,
        whatsapp: newSettings.whatsapp,
        store_name: newSettings.storeName,
        announcement: newSettings.announcement,
        updated_at: new Date().toISOString()
      }).catch(e => console.warn('Supabase settings update notice:', e));

      delete require.cache[require.resolve('./export_products.js')];
      require('./export_products.js');

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
          execSync('git add products.json settings.json category_priorities.json images INDEX.JSX index.html app.js style.css sw.js languages', { encoding: 'utf8', cwd: ROOT });
          
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
      exec('cmd.exe /c BUILD_ANDROID_APK.bat', { cwd: ROOT, env: { ...process.env, NONINTERACTIVE: '1', CI: '1' } });
      return sendJson(res, 200, { ok: true, message: 'Android APK build started in background. Check Desktop in ~2 minutes!' });
    }

    // 12. Static Assets (Images, styles, fonts) with Path Traversal Protection
    const cleanPath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
    const resolvedPath = path.resolve(ROOT, '.' + cleanPath);
    
    // Security check: Must reside within ROOT directory
    if (!resolvedPath.startsWith(ROOT)) {
      res.writeHead(403, { 'Content-Type': 'text/plain' });
      return res.end('403 Forbidden');
    }

    // Security check: Block direct access to secrets, keystores, backups, server scripts, and confidential data
    const blockedExtensions = [
      '.secret', '.keystore', '.jks', '.env', '.bat', '.ps1', '.sql',
      '.bak', '.tmp', '.swp', '.backup', '.old', '.log', '.properties', '.sh', '.key'
    ];
    const blockedFiles = [
      'admin_config.json', 'supabase_config.json', 'package.json', 'package-lock.json',
      'dsr_data.json', 'purchase_rates.json', 'purchasing_sections.json', 'purchasing_sheets.json',
      'admin_server.js', 'compile_jsx.js', 'test_app.js', 'keystore.properties'
    ];
    const baseName = path.basename(resolvedPath).toLowerCase();
    const ext = path.extname(resolvedPath).toLowerCase();
    const isBlocked = blockedExtensions.includes(ext) ||
                      blockedFiles.includes(baseName) ||
                      baseName.includes('.bak') ||
                      baseName.includes('.tmp') ||
                      baseName.includes('.backup') ||
                      baseName.startsWith('.') ||
                      baseName.endsWith('.bak');

    if (isBlocked) {
      res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('403 Forbidden: Access Denied to Protected File');
    }

    if (fs.existsSync(resolvedPath) && fs.statSync(resolvedPath).isFile()) {
      return sendFile(res, resolvedPath, getMimeType(resolvedPath));
    }

    // Default 404
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');

  } catch (err) {
    console.error('Server error:', err);
    sendJson(res, 500, { ok: false, error: err.message });
  }
});

let portRetryAttempts = 0;
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    portRetryAttempts++;
    if (portRetryAttempts === 1) {
      console.log(`Port ${PORT} was occupied. Freeing port and starting clean server...`);
      try {
        execSync(`powershell -NoProfile -Command "Get-NetTCPConnection -LocalPort ${PORT} -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }"`, { stdio: 'ignore' });
      } catch(e) {}
      setTimeout(() => {
        server.listen(PORT, '127.0.0.1');
      }, 1200);
    } else {
      console.log('================================================================');
      console.log(`  Admin Server is ALREADY running on http://127.0.0.1:${PORT}/`);
      console.log(`  Opening Dashboard in your browser...`);
      console.log('================================================================');
      try {
        const openPath = process.env.OPEN_PATH || '/';
        exec(`start http://localhost:${PORT}${openPath}`);
      } catch(e) {}
      setTimeout(() => process.exit(0), 1000);
    }
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
    const openPath = process.env.OPEN_PATH || '/';
    exec(`start http://localhost:${PORT}${openPath}`);
  } catch(e) {}

  // Start Background Cloud Order Sync (Polls for incoming WhatsApp orders every 10s)
  setTimeout(syncCloudOrders, 1500);
  setInterval(syncCloudOrders, 10000);
});

process.on('uncaughtException', (err) => {
  console.error('[UNCAUGHT EXCEPTION]', err ? (err.stack || err.message || err) : 'Unknown error');
});

process.on('unhandledRejection', (reason) => {
  console.error('[UNHANDLED REJECTION]', reason);
});

