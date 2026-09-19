// ZS MART - AUTOMATED SYSTEM INTEGRITY TEST SUITE
const fs = require('fs');
const path = require('path');

let passed = 0;
let failed = 0;

function assert(condition, testName) {
  if (condition) {
    console.log('  [PASS] ' + testName);
    passed++;
  } else {
    console.error('  [FAIL] ' + testName);
    failed++;
  }
}

console.log('================================================================');
console.log('         ZS MART - AUTOMATED SYSTEM TEST SUITE');
console.log('================================================================\n');

// TEST 1: Product Count in products.json
try {
  const pJson = JSON.parse(fs.readFileSync('products.json', 'utf8'));
  assert(pJson.products && pJson.products.length === 1049, 'products.json has exactly 1,049 products (Found: ' + (pJson.products ? pJson.products.length : 0) + ')');
  assert(pJson.total === 1049, 'products.json total field is 1,049');
} catch (e) {
  assert(false, 'products.json read & parse: ' + e.message);
}

// TEST 2: Product Count in index.html
try {
  const html = fs.readFileSync('index.html', 'utf8');
  const m = html.match(/(?:const|var)\s+PRODUCTS\s*=\s*(\[[\s\S]*?\n\s*\]);/);
  if (m) {
    const clean = m[1].replace(/SWATCH_GRADIENTS\[\d+\]/g, 'null');
    const arr = eval('(' + clean + ')');
    assert(arr.length === 1049, 'index.html contains exactly 1,049 products (Found: ' + arr.length + ')');
  } else {
    assert(false, 'index.html has PRODUCTS array');
  }
} catch (e) {
  assert(false, 'index.html test: ' + e.message);
}

// TEST 3: Product Count in INDEX.JSX
try {
  const jsx = fs.readFileSync('INDEX.JSX', 'utf8');
  const mJsx = jsx.match(/(?:const|var)\s+PRODUCTS\s*=\s*(\[[\s\S]*?\n\s*\]);/);
  if (mJsx) {
    const cleanJsx = mJsx[1].replace(/SWATCH_GRADIENTS\[\d+\]/g, 'null');
    const arrJsx = eval('(' + cleanJsx + ')');
    assert(arrJsx.length === 1049, 'INDEX.JSX contains exactly 1,049 products (Found: ' + arrJsx.length + ')');
  } else {
    assert(false, 'INDEX.JSX has PRODUCTS array');
  }
} catch (e) {
  assert(false, 'INDEX.JSX test: ' + e.message);
}

// TEST 4: Zero .bak or stray files in www and android assets
try {
  function findBak(dir) {
    let list = [];
    if (!fs.existsSync(dir)) return list;
    fs.readdirSync(dir, { withFileTypes: true }).forEach(ent => {
      const full = path.join(dir, ent.name);
      if (ent.isDirectory()) list = list.concat(findBak(full));
      else if (ent.name.endsWith('.bak') || ent.name.endsWith('.tmp') || ent.name.endsWith('~')) list.push(full);
    });
    return list;
  }
  const strayWww = findBak('www');
  const strayAssets = findBak('android/app/src/main/assets/public');
  assert(strayWww.length === 0, 'No .bak or .tmp files in www/ (Found: ' + strayWww.length + ')');
  assert(strayAssets.length === 0, 'No .bak or .tmp files in android assets (Found: ' + strayAssets.length + ')');
} catch (e) {
  assert(false, 'Stray files check: ' + e.message);
}

// TEST 5: Brand identity check (No Sahil Traders / ZS Groceries in active client files)
try {
  const html = fs.readFileSync('index.html', 'utf8');
  const hasOldInHtml = html.includes('Sahil Traders App ServiceWorker') || html.includes('zs groceries, grocery');
  assert(!hasOldInHtml, 'index.html clean of old branding');

  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  assert(pkg.name === 'zs-mart-app', 'package.json name is zs-mart-app (Found: ' + pkg.name + ')');
} catch (e) {
  assert(false, 'Brand identity check: ' + e.message);
}

// TEST 6: Critical icons and logo exist
try {
  assert(fs.existsSync('images/zs-mart-logo.png'), 'images/zs-mart-logo.png exists');
  assert(fs.existsSync('icon-192.png'), 'icon-192.png exists');
  assert(fs.existsSync('icon-512.png'), 'icon-512.png exists');
  assert(fs.existsSync('privacy-policy.html'), 'privacy-policy.html exists');
} catch (e) {
  assert(false, 'Critical assets check: ' + e.message);
}

// TEST 7: Gitignore security check
try {
  const gi = fs.readFileSync('.gitignore', 'utf8');
  assert(gi.includes('*.secret'), '.gitignore protects *.secret');
  assert(gi.includes('*.keystore'), '.gitignore protects *.keystore');
  assert(gi.includes('*.bak'), '.gitignore ignores *.bak');
} catch (e) {
  assert(false, '.gitignore security check: ' + e.message);
}

console.log('\n================================================================');
console.log('RESULTS: ' + passed + ' Passed, ' + failed + ' Failed');
console.log('================================================================\n');

process.exit(failed === 0 ? 0 : 1);
