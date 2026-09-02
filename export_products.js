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

// Merge products: union of both files by ID
const prodMap = new Map();
jsxProducts.forEach(p => prodMap.set(p.id, p));
htmlProducts.forEach(p => {
  if (!prodMap.has(p.id)) {
    prodMap.set(p.id, p);
  } else {
    // Keep updated fields like price or name from index.html if modified
    const cur = prodMap.get(p.id);
    prodMap.set(p.id, { ...cur, ...p });
  }
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
      return `      { id: ${p.id}, name: "${escName}", price: ${p.price}, categoryId: "${escCatId}", categoryName: "${escCat}" },`;
    }).join('\n');
    updatedJsx = updatedJsx.substring(0, idx) + '\n' + linesToAdd + '\n    ];' + updatedJsx.substring(idx + 2);
    fs.writeFileSync(jsxFile, updatedJsx, 'utf8');
    console.log(`Synced ${missingInJsx.length} missing items back to INDEX.JSX`);
  }
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
      imageMap[id] = ext;
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

const payload = {
  version: 2,
  updatedAt: new Date().toISOString(),
  total: products.length,
  imageMap: imageMap,
  variants: variants,
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
