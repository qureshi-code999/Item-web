const fs = require('fs');
const path = require('path');
const vm = require('vm');

const rootDir = __dirname;
const jsxFile = path.join(rootDir, 'INDEX.JSX');
const htmlFile = path.join(rootDir, 'index.html');

// Safe parsing of JavaScript object/array literals without bare eval()
function safeParseJsLiteral(codeStr, fallback = null) {
  if (!codeStr || typeof codeStr !== 'string') return fallback;
  try {
    const sandbox = Object.create(null);
    return vm.runInNewContext('(' + codeStr + ')', sandbox, { timeout: 30000 });
  } catch (e) {
    return fallback;
  }
}

// Read files
const jsx = fs.readFileSync(jsxFile, 'utf8');
const html = fs.readFileSync(htmlFile, 'utf8');

// 1. Extract PRODUCTS from INDEX.JSX
const prodMatch = jsx.match(/(?:const|var)\s+PRODUCTS\s*=\s*(\[[\s\S]*?\n\s*\]);/);
let jsxProducts = [];
if (prodMatch) {
  let cleaned = prodMatch[1].replace(/SWATCH_GRADIENTS\[\d+\]/g, 'null');
  jsxProducts = safeParseJsLiteral(cleaned, []) || [];
}

// Fallback to existing products.json if parse returned 0 products to prevent catalog wipeout
if (!jsxProducts || jsxProducts.length === 0) {
  const existingPath = path.join(rootDir, 'products.json');
  if (fs.existsSync(existingPath)) {
    try {
      const existing = JSON.parse(fs.readFileSync(existingPath, 'utf8'));
      if (Array.isArray(existing.products) && existing.products.length > 0) {
        console.warn('⚠️ INDEX.JSX parse returned 0 products; using existing products.json fallback to prevent catalog wipeout!');
        jsxProducts = existing.products;
      }
    } catch(e) {}
  }
}

if (!jsxProducts || jsxProducts.length === 0) {
  throw new Error('CRITICAL SAFETY STOP: Failed to parse PRODUCTS from INDEX.JSX! products.json will NOT be overwritten to prevent catalog wipeout.');
}

// Authoritative Source of Truth: INDEX.JSX defines the active product catalog
const seenIds = new Set();
const dedupedProducts = [];
for (const p of jsxProducts) {
  if (p && p.id != null && !seenIds.has(p.id)) {
    seenIds.add(p.id);
    dedupedProducts.push(p);
  }
}
const products = dedupedProducts.sort((a, b) => a.id - b.id);

// 2. Extract PRODUCT_IMAGE_MAP from index.html (or scan images folder)
const imgMapMatch = html.match(/window\.PRODUCT_IMAGE_MAP\s*=\s*(\{[\s\S]*?\});/);
let imageMap = {};
if (imgMapMatch) {
  imageMap = safeParseJsLiteral(imgMapMatch[1], {}) || {};
}

// Scan images directory to ensure any newly added images are also in imageMap
const imgDir = path.join(rootDir, 'images');
if (fs.existsSync(imgDir)) {
  const files = fs.readdirSync(imgDir);
  files.forEach(f => {
    const m = f.match(/^(\d+)\.(png|jpg|jpeg|webp)$/i);
    if (m) {
      const id = parseInt(m[1], 10);
      const ext = m[2].toLowerCase();
      if (!imageMap[id] || ext === 'webp') {
        imageMap[id] = ext;
      }
    }
  });

  // Sync updated PRODUCT_IMAGE_MAP back into index.html if changed
  const latestHtml = fs.readFileSync(htmlFile, 'utf8');
  const freshImgMapMatch = latestHtml.match(/window\.PRODUCT_IMAGE_MAP\s*=\s*(\{[\s\S]*?\});/);
  if (freshImgMapMatch) {
    const serialized = JSON.stringify(imageMap);
    const newMapSnippet = `window.PRODUCT_IMAGE_MAP = ${serialized};`;
    if (freshImgMapMatch[0] !== newMapSnippet) {
      const updatedHtml = latestHtml.replace(freshImgMapMatch[0], newMapSnippet);
      fs.writeFileSync(htmlFile, updatedHtml, 'utf8');
      console.log('Synchronized updated PRODUCT_IMAGE_MAP to index.html!');
    }
  }
}

// 3. Extract PRODUCT_VARIANTS from index.html
const varMatch = html.match(/window\.PRODUCT_VARIANTS\s*=\s*(\{[\s\S]*?\n\s*\});/);
let variants = {};
if (varMatch) {
  variants = safeParseJsLiteral(varMatch[1], {}) || {};
}

// 4. Extract CATEGORIES list (order & names) from INDEX.JSX / index.html
let categories = [];
const catMatch = jsx.match(/(?:const|var)\s+DEFAULT_CATEGORIES\s*=\s*(\[[\s\S]*?\n\s*\]);/)
  || jsx.match(/(?:const|var)\s+CATEGORIES\s*=\s*(\[[\s\S]*?\n\s*\]);/)
  || html.match(/(?:const|var)\s+CATEGORIES\s*=\s*(\[[\s\S]*?\n\s*\]);/);
if (catMatch) {
  categories = safeParseJsLiteral(catMatch[1], []) || [];
}

// Auto-discover: Ensure any category assigned to products is included in categories list
products.forEach(p => {
  if (p.categoryId && !categories.some(c => c.id === p.categoryId)) {
    categories.push({
      id: p.categoryId,
      name: p.categoryName || p.categoryId
    });
  }
});

// Merge category priorities from category_priorities.json if present
const catPrioFile = path.join(rootDir, 'category_priorities.json');
let categoryPriorities = {};
if (fs.existsSync(catPrioFile)) {
  try {
    categoryPriorities = JSON.parse(fs.readFileSync(catPrioFile, 'utf8'));
  } catch (e) {}
}

categories.forEach(c => {
  if (categoryPriorities && categoryPriorities[c.id]) {
    c.priority = Number(categoryPriorities[c.id]);
  } else if (!c.priority) {
    delete c.priority;
  }
});

// Sort categories: priority 1, 2, 3... first, then unprioritized preserving original order
categories.sort((a, b) => {
  const pa = (typeof a.priority === 'number' && a.priority > 0) ? a.priority : 999999;
  const pb = (typeof b.priority === 'number' && b.priority > 0) ? b.priority : 999999;
  if (pa !== pb) return pa - pb;
  return 0;
});

// 5. Extract SETTINGS from settings.json
let storeSettings = {
  deliveryFee: 150,
  freeDeliveryThreshold: 2000,
  minOrderAmount: 0,
  deliveryTiming: "Delivery Timing: 10:00 AM – 10:00 PM",
  whatsapp: "923368945775"
};
const settingsFile = path.join(rootDir, 'settings.json');
if (fs.existsSync(settingsFile)) {
  try {
    storeSettings = { ...storeSettings, ...JSON.parse(fs.readFileSync(settingsFile, 'utf8')) };
  } catch (e) {}
}

// Scan images directory timestamps to generate itemImageVersions
const itemImageVersions = {};
if (fs.existsSync(imgDir)) {
  const allImgFiles = fs.readdirSync(imgDir);
  allImgFiles.forEach(f => {
    const m = f.match(/^(\d+)\.(png|jpg|jpeg|webp)$/i);
    if (m) {
      const id = m[1];
      try {
        const stat = fs.statSync(path.join(imgDir, f));
        itemImageVersions[id] = Math.floor(stat.mtimeMs);
      } catch(e) {}
    }
  });
}
// Assign imageVersion to each product so React.memo detects image updates
products.forEach(p => {
  if (itemImageVersions[p.id]) {
    p.imageVersion = itemImageVersions[p.id];
  }
});

// Preserve & attach purchase rates from purchase_rates.json and existing products.json
const ratesFile = path.join(rootDir, 'purchase_rates.json');
let savedRates = {};
if (fs.existsSync(ratesFile)) {
  try {
    const rfData = JSON.parse(fs.readFileSync(ratesFile, 'utf8'));
    if (rfData.rates) savedRates = { ...rfData.rates };
  } catch(e) {}
}
const existingProductsJson = path.join(rootDir, 'products.json');
if (fs.existsSync(existingProductsJson)) {
  try {
    const epData = JSON.parse(fs.readFileSync(existingProductsJson, 'utf8'));
    if (Array.isArray(epData.products)) {
      epData.products.forEach(p => {
        if (p.purchasePrice !== undefined && p.purchasePrice !== null && savedRates[String(p.id)] === undefined) {
          savedRates[String(p.id)] = Number(p.purchasePrice);
        }
      });
    }
  } catch(e) {}
}

products.forEach(p => {
  if (savedRates[String(p.id)] !== undefined && Number(savedRates[String(p.id)]) > 0) {
    p.purchasePrice = Number(savedRates[String(p.id)]);
  }
});

const payload = {
  version: 2,
  updatedAt: new Date().toISOString(),
  total: products.length,
  settings: storeSettings,
  imageMap: imageMap,
  itemImageVersions: itemImageVersions,
  variants: variants,
  categories: categories,
  products: products
};

const jsonStr = JSON.stringify(payload, null, 2);

// Targets
const targets = [
  path.join(rootDir, 'products.json'),
  path.join(rootDir, 'www', 'products.json'),
  path.join(rootDir, 'complete', 'products.json'),
  path.join(rootDir, 'android', 'app', 'src', 'main', 'assets', 'public', 'products.json'),
  'C:\\Users\\ALICOM4\\Desktop\\new apk complete\\products.json'
];

targets.forEach(t => {
  const dir = path.dirname(t);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const tempPath = `${t}.${Date.now()}.${Math.random().toString(36).slice(2, 8)}.tmp`;
  try {
    fs.writeFileSync(tempPath, jsonStr, 'utf8');
    // Ensure written file is non-empty before replacing target
    if (fs.existsSync(tempPath) && fs.statSync(tempPath).size > 1000) {
      try {
        fs.renameSync(tempPath, t);
      } catch(renameErr) {
        fs.copyFileSync(tempPath, t);
        try { fs.unlinkSync(tempPath); } catch(e) {}
      }
    }
  } catch(writeErr) {
    fs.writeFileSync(t, jsonStr, 'utf8');
  } finally {
    if (fs.existsSync(tempPath)) {
      try { fs.unlinkSync(tempPath); } catch(e) {}
    }
  }
  console.log(`Saved products.json (${(Buffer.byteLength(jsonStr) / 1024).toFixed(1)} KB) -> ${t}`);
});

console.log(`Successfully exported ${products.length} products to products.json!`);
