const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const jsxFile = path.join(rootDir, 'INDEX.JSX');
const htmlFile = path.join(rootDir, 'index.html');

// Read files
const jsx = fs.readFileSync(jsxFile, 'utf8');
const html = fs.readFileSync(htmlFile, 'utf8');

// 1. Extract PRODUCTS from INDEX.JSX
const prodMatch = jsx.match(/(?:const|var)\s+PRODUCTS\s*=\s*(\[[\s\S]*?\n\s*\]);/);
let jsxProducts = [];
if (prodMatch) {
  try {
    let cleaned = prodMatch[1].replace(/SWATCH_GRADIENTS\[\d+\]/g, 'null');
    jsxProducts = eval('(' + cleaned + ')');
  } catch (e) {}
}

// Also extract from index.html
let htmlProducts = [];
const htmlProdMatch = html.match(/(?:const|var)\s+PRODUCTS\s*=\s*(\[[\s\S]*?\n\s*\]);/);
if (htmlProdMatch) {
  try {
    let cleanedHtml = htmlProdMatch[1].replace(/SWATCH_GRADIENTS\[\d+\]/g, 'null');
    htmlProducts = eval('(' + cleanedHtml + ')');
  } catch (e) {}
}

// Merge products: union of both files by ID, with INDEX.JSX taking precedence
const prodMap = new Map();
htmlProducts.forEach(p => prodMap.set(p.id, p));
jsxProducts.forEach(p => {
  const existing = prodMap.get(p.id) || {};
  prodMap.set(p.id, { ...existing, ...p });
});

const products = Array.from(prodMap.values()).sort((a, b) => a.id - b.id);

// If index.html had new items not in INDEX.JSX, sync them back to INDEX.JSX
const jsxIds = new Set(jsxProducts.map(p => p.id));
const missingInJsx = products.filter(p => !jsxIds.has(p.id));
if (missingInJsx.length > 0 && prodMatch) {
  let updatedJsx = jsx;
  const idx = updatedJsx.indexOf('];', prodMatch.index);
  if (idx > -1) {
    const linesToAdd = missingInJsx.map(p => {
      const escName = (p.name || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"');
      const escCat = (p.categoryName || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"');
      const escCatId = (p.categoryId || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"');
      const prioStr = p.priority ? `, priority: ${p.priority}` : '';
      const filterStr = p.filterName ? `, filterName: "${(p.filterName || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"` : '';
      return `      { id: ${p.id}, name: "${escName}", price: ${p.price}, categoryId: "${escCatId}", categoryName: "${escCat}"${prioStr}${filterStr} },`;
    }).join('\n');
    updatedJsx = updatedJsx.substring(0, idx) + '\n' + linesToAdd + '\n    ];' + updatedJsx.substring(idx + 2);
    fs.writeFileSync(jsxFile, updatedJsx, 'utf8');
    console.log(`Synced ${missingInJsx.length} missing items back to INDEX.JSX`);
  }
}

// Keep index.html synchronized with full products list
const latestProdMatch = jsx.match(/(?:const|var)\s+PRODUCTS\s*=\s*(\[[\s\S]*?\n\s*\]);/);
const currentHtml = fs.readFileSync(htmlFile, 'utf8');
const latestHtmlProdMatch = currentHtml.match(/(?:const|var)\s+PRODUCTS\s*=\s*(\[[\s\S]*?\n\s*\]);/);
if (latestProdMatch && latestHtmlProdMatch && latestHtmlProdMatch[1] !== latestProdMatch[1]) {
  const updatedHtml = currentHtml.replace(latestHtmlProdMatch[0], 'const PRODUCTS = ' + latestProdMatch[1] + ';');
  fs.writeFileSync(htmlFile, updatedHtml, 'utf8');
  console.log(`Synchronized full ${products.length} products to index.html!`);
}

// 2. Extract PRODUCT_IMAGE_MAP from index.html (or scan images folder)
const imgMapMatch = html.match(/window\.PRODUCT_IMAGE_MAP\s*=\s*(\{[\s\S]*?\});/);
let imageMap = {};
if (imgMapMatch) {
  try {
    imageMap = eval('(' + imgMapMatch[1] + ')');
  } catch (e) {}
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
}

// 3. Extract PRODUCT_VARIANTS from index.html
const varMatch = html.match(/window\.PRODUCT_VARIANTS\s*=\s*(\{[\s\S]*?\n\s*\});/);
let variants = {};
if (varMatch) {
  try {
    variants = eval('(' + varMatch[1] + ')');
  } catch (e) {}
}

// 4. Extract CATEGORIES list (order & names) from INDEX.JSX / index.html
let categories = [];
const catMatch = jsx.match(/(?:const|var)\s+DEFAULT_CATEGORIES\s*=\s*(\[[\s\S]*?\n\s*\]);/)
  || jsx.match(/(?:const|var)\s+CATEGORIES\s*=\s*(\[[\s\S]*?\n\s*\]);/)
  || html.match(/(?:const|var)\s+CATEGORIES\s*=\s*(\[[\s\S]*?\n\s*\]);/);
if (catMatch) {
  try {
    categories = eval('(' + catMatch[1] + ')');
  } catch (e) {}
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

const payload = {
  version: 2,
  updatedAt: new Date().toISOString(),
  total: products.length,
  settings: storeSettings,
  imageMap: imageMap,
  variants: variants,
  categories: categories,
  products: products
};

const jsonStr = JSON.stringify(payload, null, 2);

// Targets
const targets = [
  path.join(rootDir, 'products.json'),
  path.join(rootDir, 'www', 'products.json'),
  path.join(rootDir, 'android', 'app', 'src', 'main', 'assets', 'public', 'products.json')
];

targets.forEach(t => {
  const dir = path.dirname(t);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(t, jsonStr, 'utf8');
  console.log(`Saved products.json (${(Buffer.byteLength(jsonStr) / 1024).toFixed(1)} KB) -> ${t}`);
});

console.log(`Successfully exported ${products.length} products to products.json!`);
