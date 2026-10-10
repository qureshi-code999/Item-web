// ==============================================================================
//           ZS MART AUTOMATED SYSTEM & DATA INTEGRITY VALIDATOR
// ==============================================================================
// This script runs automated checks across products, categories, syntax, 
// and images. If ANY error is detected, it halts the build to prevent bugs.
// ==============================================================================

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = __dirname;
let errors = [];
let warnings = [];

console.log('🔍 Running ZS Mart System Health & Data Validation Inspector...\n');

// ── TEST 1: Syntax Validation on Core Files ──
console.log(' [1/5] Checking JavaScript syntax in all core files...');
const filesToCheck = [
  'admin_server.js',
  'export_products.js',
  'compile_jsx.js'
];

filesToCheck.forEach(file => {
  const filePath = path.join(ROOT, file);
  if (fs.existsSync(filePath)) {
    try {
      const code = fs.readFileSync(filePath, 'utf8');
      new vm.Script(code); // Pure syntax check, does not execute code
    } catch (e) {
      errors.push(`❌ Syntax Error in ${file}: ${e.message}`);
    }
  }
});

// Check admin_dashboard.html script tag syntax
const dashboardPath = path.join(ROOT, 'admin_dashboard.html');
if (fs.existsSync(dashboardPath)) {
  const html = fs.readFileSync(dashboardPath, 'utf8');
  const m = html.match(/<script[^>]*>([\s\S]*?)<\/script>/i);
  if (m && m[1]) {
    try {
      new Function(m[1]);
    } catch (e) {
      errors.push(`❌ Syntax Error in admin_dashboard.html <script>: ${e.message}`);
    }
  }
}

// ── TEST 2: Products Catalog Integrity ──
console.log(' [2/5] Validating Products Catalog (products.json)...');
const productsPath = path.join(ROOT, 'products.json');
if (!fs.existsSync(productsPath)) {
  errors.push('❌ products.json does not exist!');
} else {
  try {
    const pData = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
    const products = pData.products || [];
    const categories = pData.categories || [];
    const validCategoryIds = new Set(categories.map(c => c.id));
    const seenIds = new Set();

    // Known beverage brand regex patterns (with word boundary to avoid "LASTING" matching "STING")
    const beveragePatterns = [
      { name: 'PEPSI', regex: /\bPEPSI\b/i },
      { name: '7UP', regex: /\b7UP\b|\b7-UP\b/i },
      { name: 'COCA COLA', regex: /\bCOCA[\s\-]?COLA\b/i },
      { name: 'SPRITE', regex: /\bSPRITE\b/i },
      { name: 'FANTA', regex: /\bFANTA\b/i },
      { name: 'MIRINDA', regex: /\bMIRINDA\b/i },
      { name: 'MOUNTAIN DEW', regex: /\bMOUNTAIN DEW\b|\bMTN DEW\b/i },
      { name: 'STING', regex: /\bSTING\b/i },
      { name: 'PAKOLA', regex: /\bPAKOLA\b/i }
    ];

    products.forEach(p => {
      // Check ID
      if (!p.id || typeof p.id !== 'number') {
        errors.push(`❌ Invalid product ID on item: ${JSON.stringify(p)}`);
      } else if (seenIds.has(p.id)) {
        errors.push(`❌ Duplicate product ID: #${p.id} (${p.name})`);
      } else {
        seenIds.add(p.id);
      }

      // Check Name
      if (!p.name || typeof p.name !== 'string' || p.name.trim().length === 0) {
        errors.push(`❌ Product #${p.id} has empty name!`);
      }

      // Check Price
      if (p.price === undefined || p.price === null || isNaN(p.price) || Number(p.price) < 0) {
        errors.push(`❌ Product #${p.id} (${p.name}) has invalid price: ${p.price}`);
      }

      // Check Category
      if (!p.categoryId) {
        errors.push(`❌ Product #${p.id} (${p.name}) has missing categoryId!`);
      } else if (validCategoryIds.size > 0 && !validCategoryIds.has(p.categoryId)) {
        warnings.push(`⚠️ Product #${p.id} (${p.name}) has unknown categoryId: "${p.categoryId}"`);
      }

      // Logical Cross-Check: Beverage brand placed in non-beverage category
      beveragePatterns.forEach(bp => {
        if (bp.regex.test(p.name)) {
          if (p.categoryId !== 'beverages') {
            errors.push(`❌ MISPLACED BEVERAGE: Item #${p.id} "${p.name}" matches beverage "${bp.name}" but has category "${p.categoryId}"! Must be "beverages".`);
          }
        }
      });
    });

    console.log(`   Checked ${products.length} products across ${categories.length} categories.`);
  } catch (e) {
    errors.push(`❌ products.json corrupted or invalid JSON: ${e.message}`);
  }
}

// ── TEST 3: Images Verification ──
console.log(' [3/5] Checking product images...');
const imagesDir = path.join(ROOT, 'images');
if (fs.existsSync(imagesDir) && fs.existsSync(productsPath)) {
  try {
    const pData = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
    let missingImagesCount = 0;
    (pData.products || []).forEach(p => {
      if (p.hasImage) {
        const webpFile = path.join(imagesDir, `${p.id}.webp`);
        const pngFile = path.join(imagesDir, `${p.id}.png`);
        if (!fs.existsSync(webpFile) && !fs.existsSync(pngFile)) {
          missingImagesCount++;
        }
      }
    });
    if (missingImagesCount > 0) {
      warnings.push(`⚠️ ${missingImagesCount} products have hasImage:true but image file is missing in images/`);
    }
  } catch(e) {}
}

// ── TEST 4: Purchase Rates File ──
console.log(' [4/5] Checking purchase rates...');
const ratesPath = path.join(ROOT, 'purchase_rates.json');
if (fs.existsSync(ratesPath)) {
  try {
    const ratesData = JSON.parse(fs.readFileSync(ratesPath, 'utf8'));
    if (!ratesData || typeof ratesData !== 'object') {
      errors.push('❌ purchase_rates.json is invalid JSON format');
    }
  } catch (e) {
    errors.push(`❌ purchase_rates.json corrupted: ${e.message}`);
  }
}

// ── TEST 5: Asset Synchronization ──
console.log(' [5/5] Checking asset distribution to www and android...');
const wwwProducts = path.join(ROOT, 'www', 'products.json');
const androidProducts = path.join(ROOT, 'android', 'app', 'src', 'main', 'assets', 'public', 'products.json');
if (!fs.existsSync(wwwProducts)) warnings.push('⚠️ www/products.json not generated yet. Run compile_jsx.js.');
if (!fs.existsSync(androidProducts)) warnings.push('⚠️ android assets products.json not generated yet. Run compile_jsx.js.');

// ── SUMMARY & REPORT ──
console.log('\n================================================================');
if (errors.length === 0) {
  console.log('  ✅ ALL TESTS PASSED! ZERO CRITICAL ERRORS DETECTED.');
  if (warnings.length > 0) {
    console.log(`  ℹ️  ${warnings.length} non-critical warnings:`);
    warnings.forEach(w => console.log('    ' + w));
  }
  console.log('  System is 100% HEALTHY and SAFE for APK Build & Live Deploy!');
  console.log('================================================================\n');
  process.exit(0);
} else {
  console.error(`  🚨 VALIDATION FAILED! Found ${errors.length} critical error(s):`);
  errors.forEach(err => console.error('    ' + err));
  console.error('\n  🛑 BUILD STOPPED! Please fix the errors listed above before proceeding.');
  console.error('================================================================\n');
  process.exit(1);
}
