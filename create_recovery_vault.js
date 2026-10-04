const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = __dirname;
const desktopDir = path.join(process.env.USERPROFILE || 'C:\\Users\\ALICOM4', 'Desktop');
const tempVaultDir = path.join(rootDir, 'Recovery_Vault_Temp');
const zipPath = path.join(desktopDir, 'ZS_MART_EMERGENCY_RECOVERY_VAULT.zip');

console.log('================================================================');
console.log('     ZS MART - EMERGENCY DISASTER RECOVERY VAULT CREATOR');
console.log('================================================================\n');

try {
  if (fs.existsSync(tempVaultDir)) {
    fs.rmSync(tempVaultDir, { recursive: true, force: true });
  }
  fs.mkdirSync(tempVaultDir, { recursive: true });
  fs.mkdirSync(path.join(tempVaultDir, 'android_app'), { recursive: true });

  console.log('[1/3] Packing critical security and database files...');

  // 1. Android Release Keystore
  const keystoreSrc = path.join(rootDir, 'android', 'app', 'release-key.keystore');
  if (fs.existsSync(keystoreSrc)) {
    fs.copyFileSync(keystoreSrc, path.join(tempVaultDir, 'android_app', 'release-key.keystore'));
    console.log('  [OK] Google Play Store Keystore: release-key.keystore');
  } else {
    console.warn('  [WARN] release-key.keystore not found!');
  }

  // 2. Security Config & Secret
  const configSrc = path.join(rootDir, 'admin_config.json');
  if (fs.existsSync(configSrc)) {
    fs.copyFileSync(configSrc, path.join(tempVaultDir, 'admin_config.json'));
    console.log('  [OK] Master Admin Password Config: admin_config.json');
  }

  // 3. Database files
  const dataFiles = [
    'products.json',
    'settings.json',
    'purchase_rates.json',
    'purchasing_sections.json',
    'purchasing_sheets.json',
    'dsr_data.json',
    'category_priorities.json'
  ];

  dataFiles.forEach(f => {
    const src = path.join(rootDir, f);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, path.join(tempVaultDir, f));
      console.log(`  [OK] Data: ${f}`);
    }
  });

  // 4. Instructions
  const instructions = `=======================================================================
          ZS MART - NEW LAPTOP RESTORATION INSTRUCTIONS
=======================================================================

AGAR AAPKA PURANA LAPTOP KHARAB HO JAYE TO NAYE LAPTOP PE YE KAREIN:

STEP 1: Naye laptop me Git aur Node.js install karein (Free 2-minute install).

STEP 2: Command Prompt (cmd) khol kar ye command chalayein:
        git clone https://github.com/qureshi-code999/Item-web.git "Desktop\\ITEMS WEB"

STEP 3: Is Recovery Vault ZIP se:
        - "android_app\\release-key.keystore" file ko naye laptop ke folder:
          "Desktop\\ITEMS WEB\\android\\app\\" me paste karein.
        - "admin_config.json" ko "Desktop\\ITEMS WEB\\" me paste karein.

STEP 4: "Desktop\\ITEMS WEB\\ADMIN PORTAL.bat" ko double-click karein!

BAS ITNA HI! Aapka pura Master Admin Panel, 1000+ items, photos, rates, 
daily sales, aur Google Play Store bundle build system 100% wapis chal pare ga!
=======================================================================`;

  fs.writeFileSync(path.join(tempVaultDir, 'HOW_TO_RESTORE_ON_NEW_LAPTOP.txt'), instructions, 'utf8');
  console.log('  [OK] Instructions: HOW_TO_RESTORE_ON_NEW_LAPTOP.txt');

  console.log('\n[2/3] Compressing into Emergency Vault ZIP on Desktop...');
  if (fs.existsSync(zipPath)) {
    fs.unlinkSync(zipPath);
  }

  execSync(`powershell -NoProfile -Command "Compress-Archive -Path '${tempVaultDir}\\*' -DestinationPath '${zipPath}' -CompressionLevel Optimal"`);

  fs.rmSync(tempVaultDir, { recursive: true, force: true });

  console.log('\n================================================================');
  console.log('   SUCCESS! EMERGENCY RECOVERY VAULT CREATED ON YOUR DESKTOP!');
  console.log('================================================================');
  console.log(`   File: ${zipPath}`);
  console.log('================================================================\n');
  console.log('[CRITICAL INSTRUCTION]:');
  console.log('Is ZIP file ko foran apne Google Drive pe upload kar lein ya');
  console.log('apni personal Gmail id pe email kar dein ya USB me save kar lein.');
  console.log('Agar aapka laptop bilkul toot ya dead bhi ho jaye, is 1 ZIP file');
  console.log('aur GitHub se aapka pura software naye laptop par 5 minute me 100%');
  console.log('chal pare ga!\n');

} catch(err) {
  console.error('Error creating recovery vault:', err.message);
}
