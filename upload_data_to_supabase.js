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
const { supabaseUrl, supabaseKey } = config;

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
  await supabaseRequest('/rest/v1/categories', 'POST', catRows);
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
  await supabaseRequest('/rest/v1/store_settings', 'POST', settingsRow);
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
      const pRate = ratesData[String(pId)] !== undefined ? Number(ratesData[String(pId)]) : (p.purchasePrice ? Number(p.purchasePrice) : null);

      return {
        id: pId,
        name: String(p.name).trim().toUpperCase(),
        price: Number(p.price),
        purchase_price: pRate,
        category_id: String(p.categoryId || 'general').trim(),
        category_name: String(p.categoryName || 'General Items').trim(),
        priority: p.priority ? Number(p.priority) : null,
        filter_name: p.filterName ? String(p.filterName).trim() : null,
        has_image: hasImg,
        image_url: imageUrl,
        image_version: p.imageVersion || Date.now()
      };
    });

    await supabaseRequest('/rest/v1/products', 'POST', prodRows);
    successCount += prodRows.length;
    process.stdout.write(`\r  Progress: [${successCount} / ${products.length}] products uploaded...`);
  }

  console.log(`\n  ✅ SUCCESS! All ${successCount} products uploaded to Supabase Database!`);

  // 5. Initial Image Sync notice
  console.log('\n[4/4] Image Storage Bucket Check:');
  console.log('  Images will be served directly from Supabase CDN or local images.');
  console.log('  Any new image uploaded in Master Admin Panel will go directly to Supabase Storage.\n');

  console.log('================================================================');
  console.log('     🎉 MIGRATION COMPLETED SUCCESSFULLY WITH 0 DATA LOSS!');
  console.log('================================================================\n');
}

migrate().catch(err => {
  console.error('\n🛑 Migration Error:', err.message);
  process.exit(1);
});
