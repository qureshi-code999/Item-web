const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function generatePlayStoreAssets() {
  const rootDir = __dirname;
  const targetDir = path.join(process.env.USERPROFILE || 'C:\\Users\\ALICOM4', 'Desktop', 'new apk complete');

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  // 1. Copy 512x512 High-Res App Icon for Play Console
  const iconSrc = path.join(rootDir, 'icon-512.png');
  const iconDest = path.join(targetDir, 'playstore_icon_512x512.png');
  if (fs.existsSync(iconSrc)) {
    fs.copyFileSync(iconSrc, iconDest);
    console.log(`[1/2] Copied 512x512 icon -> ${iconDest}`);
  }

  // 2. Generate 1024x500 Feature Graphic required by Google Play Store
  const width = 1024;
  const height = 500;

  const logoBuf = await sharp(iconSrc)
    .resize(280, 280, { fit: 'contain' })
    .toBuffer();

  const svgOverlay = Buffer.from(`
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#030712" />
          <stop offset="50%" stop-color="#0f172a" />
          <stop offset="100%" stop-color="#022c22" />
        </linearGradient>
        <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#fbbf24" />
          <stop offset="100%" stop-color="#f59e0b" />
        </linearGradient>
        <linearGradient id="emerald" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#10b981" />
          <stop offset="100%" stop-color="#059669" />
        </linearGradient>
      </defs>

      <!-- Background Gradient -->
      <rect width="${width}" height="${height}" fill="url(#bg)" />

      <!-- Glowing circles -->
      <circle cx="210" cy="250" r="170" fill="#2563eb" opacity="0.25" />
      <circle cx="850" cy="200" r="220" fill="#059669" opacity="0.2" />

      <!-- Rounded glass frame for logo -->
      <rect x="70" y="100" width="300" height="300" rx="36" fill="#ffffff" opacity="0.06" stroke="rgba(255,255,255,0.2)" stroke-width="2" />

      <!-- App Title -->
      <text x="420" y="180" font-family="'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="62" font-weight="900" fill="url(#gold)" letter-spacing="1.5">ZS MART</text>
      
      <!-- Subheading -->
      <text x="420" y="230" font-family="'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="26" font-weight="700" fill="#f8fafc">Online Wholesale &amp; Retail Groceries</text>

      <text x="420" y="275" font-family="'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="18" font-weight="400" fill="#94a3b8">1,000+ Verified Products &#8226; Real-time Stock &#8226; Karachi Express Delivery</text>

      <!-- Badges -->
      <g transform="translate(420, 320)">
        <rect x="0" y="0" width="165" height="42" rx="21" fill="url(#emerald)" />
        <text x="82" y="26" font-family="'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="800" fill="#ffffff" text-anchor="middle" letter-spacing="0.5">1-CLICK ORDER</text>

        <rect x="180" y="0" width="185" height="42" rx="21" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.25)" stroke-width="1.2" />
        <text x="272" y="26" font-family="'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="700" fill="#f1f5f9" text-anchor="middle" letter-spacing="0.5">WHATSAPP ORDERS</text>

        <rect x="380" y="0" width="160" height="42" rx="21" fill="rgba(245, 158, 11, 0.15)" stroke="#f59e0b" stroke-width="1.2" />
        <text x="460" y="26" font-family="'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="700" fill="#fbbf24" text-anchor="middle" letter-spacing="0.5">LIVE CLOUD</text>
      </g>
    </svg>
  `);

  const featureGraphicDest = path.join(targetDir, 'playstore_feature_graphic_1024x500.png');
  await sharp(svgOverlay)
    .composite([
      { input: logoBuf, top: 110, left: 80 }
    ])
    .png()
    .toFile(featureGraphicDest);

  console.log(`[2/2] Generated 1024x500 Feature Graphic -> ${featureGraphicDest}`);
  console.log('\n✅ All Play Store Assets successfully generated and ready in "new apk complete" folder!');
}

generatePlayStoreAssets().catch(console.error);
