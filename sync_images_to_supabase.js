// ==============================================================================
//        ZS MART - BATCH UPLOAD LOCAL PRODUCT IMAGES TO SUPABASE STORAGE
// ==============================================================================
const fs = require('fs');
const path = require('path');
const https = require('https');

const ROOT = __dirname;
const CONFIG_FILE = path.join(ROOT, 'supabase_config.json');
const IMAGES_DIR = path.join(ROOT, 'images');

const config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
const { supabaseUrl, supabaseKey } = config;

function uploadSingleImage(fileName) {
  return new Promise((resolve) => {
    const fullPath = path.join(IMAGES_DIR, fileName);
    if (!fs.existsSync(fullPath)) return resolve({ fileName, status: 'missing' });

    const fileBuf = fs.readFileSync(fullPath);
    const targetPath = `/storage/v1/object/product-images/${fileName}`;
    const fullUrl = new URL(targetPath, supabaseUrl);

    const req = https.request({
      hostname: fullUrl.hostname,
      port: 443,
      path: fullUrl.pathname,
      method: 'POST',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'image/webp',
        'x-upsert': 'true'
      }
    }, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({ fileName, status: 'ok' });
        } else {
          resolve({ fileName, status: 'error', code: res.statusCode });
        }
      });
    });

    req.on('error', (e) => resolve({ fileName, status: 'error', error: e.message }));
    req.write(fileBuf);
    req.end();
  });
}

async function runBatchUpload() {
  console.log('Scanning images folder...');
  const files = fs.readdirSync(IMAGES_DIR).filter(f => /^\d+\.webp$/i.test(f));
  console.log(`Found ${files.length} WebP images to sync to Supabase Storage.`);

  const CONCURRENCY = 15;
  let completed = 0;
  let errors = 0;

  for (let i = 0; i < files.length; i += CONCURRENCY) {
    const chunk = files.slice(i, i + CONCURRENCY);
    const results = await Promise.all(chunk.map(uploadSingleImage));
    completed += results.filter(r => r.status === 'ok').length;
    errors += results.filter(r => r.status !== 'ok').length;
    process.stdout.write(`\rProgress: [${completed + errors} / ${files.length}] images uploaded (${completed} OK, ${errors} Err)...`);
  }

  console.log(`\n\n🎉 Image sync complete! ${completed} images safely stored in Supabase Storage.`);
}

runBatchUpload().catch(console.error);
