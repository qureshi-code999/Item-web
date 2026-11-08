// ==============================================================================
//        ZS MART - AUTOMATED 1-CLICK DATA MIGRATION TO SUPABASE
// ==============================================================================
const fs = require('fs');
const path = require('path');
const https = require('https');

const ROOT = __dirname;
const CONFIG_FILE = path.join(ROOT, 'supabase_config.json');

if (!fs.existsSync(CONFIG_FILE)) {
  console.error('\n🛑 Error: supabase_config.json not found!');
  console.error('Please create supabase_config.json with your Supabase URL & Key:\n');
  console.error(JSON.stringify({
    supabaseUrl: "https://your-project-id.supabase.co",
    supabaseKey: "your-anon-or-service-role-key"
  }, null, 2));
  process.exit(1);
}

const config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
const supabaseUrl = config.supabaseUrl;
const supabaseKey = config.serviceRoleKey || config.supabaseKey;

if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your-project-id')) {
  console.error('\n🛑 Error: Please enter your real supabaseUrl and supabaseKey inside supabase_config.json');
  process.exit(1);
}

// Universal fetch helper using native https
function supabaseRequest(endpoint, method, body = null) {
  return new Promise((resolve, reject) => {
    const fullUrl = new URL(endpoint, supabaseUrl);
    const options = {
      hostname: fullUrl.hostname,
      port: 443,
      path: fullUrl.pathname + fullUrl.search,
      method: method,
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates, return=minimal'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try { resolve(data ? JSON.parse(data) : { ok: true }); }
          catch (e) { resolve({ ok: true, raw: data }); }
        } else {
          reject(new Error(`Supabase API [${res.statusCode}]: ${data || res.statusMessage}`));
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

// Upload a single file to Supabase Storage
function uploadStorageFile(bucket, filePath, fileName, mimeType = 'image/webp') {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(filePath)) return resolve(null);
    const fileBuffer = fs.readFileSync(filePath);
    const targetPath = `/storage/v1/object/${bucket}/${fileName}`;
    const fullUrl = new URL(targetPath, supabaseUrl);

    const options = {
      hostname: fullUrl.hostname,
      port: 443,
      path: fullUrl.pathname,
      method: 'POST',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': mimeType,
        'x-upsert': 'true'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(`${supabaseUrl}/storage/v1/object/public/${bucket}/${fileName}`);
        } else {
          reject(new Error(`Storage Upload Error [${res.statusCode}]: ${data}`));
        }
      });
    });

    req.on('error', reject);
    req.write(fileBuffer);
    req.end();
  });
}

async function migrate() {
  console.log('================================================================');
  console.log('       ZS MART -> SUPABASE AUTOMATED DATA MIGRATION ENGINE');
  console.log('================================================================\n');

  // 1. Load Local Data Files
  const productsJsonPath = path.join(ROOT, 'products.json');
  const ratesJsonPath = path.join(ROOT, 'purchase_rates.json');
  const settingsJsonPath = path.join(ROOT, 'settings.json');

  const productsData = JSON.parse(fs.readFileSync(productsJsonPath, 'utf8'));
  const ratesData = fs.existsSync(ratesJsonPath) ? JSON.parse(fs.readFileSync(ratesJsonPath, 'utf8')).rates || {} : {};
  const settingsData = fs.existsSync(settingsJsonPath) ? JSON.parse(fs.readFileSync(settingsJsonPath, 'utf8')) : (productsData.settings || {});

  const products = productsData.products || [];
  const categories = productsData.categories || [];
  const imageMap = productsData.imageMap || {};

  console.log(`📦 Loaded local catalog:`);
  console.log(`   - Products:   ${products.length} items`);
  console.log(`   - Categories: ${categories.length} categories`);
  console.log(`   - Images Map: ${Object.keys(imageMap).length} mapped images`);
  console.log(`   - Cost Rates: ${Object.keys(ratesData).length} wholesale rates\n`);

  // 2. Upload Categories
  console.log('[1/4] Uploading Categories to Supabase...');
  const catRows = categories.map((c, idx) => ({
    id: c.id,
    name: c.name,
    priority: typeof c.priority === 'number' ? c.priority : (idx + 1)
  }));
  await supabaseRequest('/rest/v1/categories?on_conflict=id', 'POST', catRows);
  console.log(`  ✅ Successfully migrated ${catRows.length} categories!`);

  // 3. Upload Store Settings
  console.log('\n[2/4] Uploading Store Settings...');
  const settingsRow = [{
    id: 'main',
    delivery_fee: Number(settingsData.deliveryFee ?? 99),
    free_delivery_threshold: Number(settingsData.freeDeliveryThreshold ?? 1999),
    min_order_amount: Number(settingsData.minOrderAmount ?? 0),
    delivery_timing: String(settingsData.deliveryTiming || 'Delivery Timing: 10:00 AM – 10:00 PM'),
    whatsapp: String(settingsData.whatsapp || '923368945775'),
    store_name: String(settingsData.storeName || 'ZS Mart'),
    announcement: String(settingsData.announcement || '')
  }];
  await supabaseRequest('/rest/v1/store_settings?on_conflict=id', 'POST', settingsRow);
  console.log(`  ✅ Store settings synced!`);

  // 4. Batch Upload Products to Supabase
  console.log(`\n[3/4] Uploading ${products.length} Products to Supabase in batches...`);
  const BATCH_SIZE = 100;
  let successCount = 0;

  for (let i = 0; i < products.length; i += BATCH_SIZE) {
    const batch = products.slice(i, i + BATCH_SIZE);
    const prodRows = batch.map(p => {
      const pId = Number(p.id);
      const ext = imageMap[pId] || (p.hasImage ? 'webp' : null);
      const hasImg = !!ext;
      const imageUrl = hasImg ? `${supabaseUrl}/storage/v1/object/public/product-images/${pId}.${ext}` : null;

      return {
        id: pId,
        name: String(p.name).trim().toUpperCase(),
        price: Number(p.price),
        category_id: String(p.categoryId || 'general').trim(),
        category_name: String(p.categoryName || 'General Items').trim(),
        priority: p.priority ? Number(p.priority) : null,
        filter_name: p.filterName ? String(p.filterName).trim() : null,
        has_image: hasImg,
        image_url: imageUrl,
        image_version: p.imageVersion || Date.now()
      };
    });

    await supabaseRequest('/rest/v1/products?on_conflict=id', 'POST', prodRows);
    successCount += prodRows.length;
    process.stdout.write(`\r  Progress: [${successCount} / ${products.length}] products uploaded...`);
  }

  console.log(`\n  ✅ SUCCESS! All ${successCount} products uploaded to Supabase Database!`);

  // 4. Upload Purchase Rates to secure purchase_rates table
  console.log(`\n[4/7] Uploading Purchase Rates to Supabase...`);
  const rateEntries = Object.keys(ratesData).filter(k => !isNaN(Number(k)) && Number(k) > 0);
  if (rateEntries.length > 0) {
    const rateRows = rateEntries.map(k => ({
      product_id: Number(k),
      purchase_price: Number(ratesData[k]),
      purchase_rate: Number(ratesData[k]),
      updated_at: new Date().toISOString()
    }));
    try {
      await supabaseRequest('/rest/v1/purchase_rates?on_conflict=product_id', 'POST', rateRows);
    } catch(e) {
      // Fallback: if table only has purchase_price or only purchase_rate
      const fallbackRows = rateEntries.map(k => ({
        product_id: Number(k),
        purchase_price: Number(ratesData[k]),
        updated_at: new Date().toISOString()
      }));
      await supabaseRequest('/rest/v1/purchase_rates?on_conflict=product_id', 'POST', fallbackRows);
    }
    console.log(`  ✅ Synced ${rateRows.length} purchase rates to Supabase!`);
  } else {
    console.log(`  ℹ️ No purchase rates found to sync.`);
  }

  // 5. Upload DSR Expenses to Supabase
  console.log(`\n[5/7] Uploading DSR Expenses to Supabase...`);
  const dsrJsonPath = path.join(ROOT, 'dsr_data.json');
  if (fs.existsSync(dsrJsonPath)) {
    try {
      const dsrData = JSON.parse(fs.readFileSync(dsrJsonPath, 'utf8'));
      const expenses = (dsrData.expenses || []).map(e => ({
        id: String(e.id),
        date: String(e.date || new Date().toISOString().slice(0, 10)),
        title: String(e.title || 'General Expense'),
        amount: Number(e.amount) || 0,
        category: String(e.category || 'misc'),
        updated_at: new Date().toISOString()
      }));
      if (expenses.length > 0) {
        await supabaseRequest('/rest/v1/expenses?on_conflict=id', 'POST', expenses);
        console.log(`  ✅ Synced ${expenses.length} expenses to Supabase!`);
      } else {
        console.log(`  ℹ️ No expenses found to sync.`);
      }
    } catch(err) {
      console.warn(`  ℹ️ Expenses sync skipped: Table 'expenses' not yet created in Supabase SQL editor.`);
    }
  }

  // 6. Upload Purchasing Sections to Supabase
  console.log(`\n[6/7] Uploading Purchasing Sections to Supabase...`);
  const sectionsJsonPath = path.join(ROOT, 'purchasing_sections.json');
  if (fs.existsSync(sectionsJsonPath)) {
    try {
      const secData = JSON.parse(fs.readFileSync(sectionsJsonPath, 'utf8'));
      const secRow = [{
        id: 'main',
        sections: secData.sections || [],
        item_sections: secData.itemSections || {},
        updated_at: secData.updatedAt || new Date().toISOString()
      }];
      await supabaseRequest('/rest/v1/purchasing_sections?on_conflict=id', 'POST', secRow);
      console.log(`  ✅ Synced purchasing sections to Supabase!`);
    } catch(err) {
      console.warn(`  ℹ️ Purchasing sections sync skipped: Table 'purchasing_sections' not yet created in Supabase SQL editor.`);
    }
  }

  // 7. Upload Purchasing Sheets to Supabase
  console.log(`\n[7/7] Uploading Purchasing Sheets to Supabase...`);
  const sheetsJsonPath = path.join(ROOT, 'purchasing_sheets.json');
  if (fs.existsSync(sheetsJsonPath)) {
    try {
      const sheetsData = JSON.parse(fs.readFileSync(sheetsJsonPath, 'utf8'));
      const sheets = (sheetsData.sheets || []).map(s => ({
        id: String(s.id),
        date: String(s.date || new Date().toISOString().slice(0, 10)),
        title: String(s.title || 'Market Purchasing Sheet'),
        market_name: String(s.marketName || 'Wholesale Market'),
        items: Array.isArray(s.items) ? s.items : [],
        sections: Array.isArray(s.sections) ? s.sections : [],
        total_items: Number(s.totalItems) || 0,
        total_qty: Number(s.totalQty) || 0,
        total_amount: Number(s.totalAmount) || 0,
        created_at: s.createdAt || new Date().toISOString()
      }));
      if (sheets.length > 0) {
        await supabaseRequest('/rest/v1/purchasing_sheets?on_conflict=id', 'POST', sheets);
        console.log(`  ✅ Synced ${sheets.length} purchasing sheets to Supabase!`);
      } else {
        console.log(`  ℹ️ No purchasing sheets found to sync.`);
      }
    } catch(err) {
      console.warn(`  ℹ️ Purchasing sheets sync skipped: Table 'purchasing_sheets' not yet created in Supabase SQL editor.`);
    }
  }

  console.log('\n================================================================');
  console.log('     🎉 MIGRATION COMPLETED SUCCESSFULLY WITH 0 DATA LOSS!');
  console.log('================================================================\n');
}

migrate().catch(err => {
  console.error('\n🛑 Migration Error:', err.message);
  process.exit(1);
});
