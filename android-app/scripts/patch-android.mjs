// Runs after `npx cap add android`: AdMob app ID, portrait lock, Play target SDK, version and signing.
import fs from 'node:fs';

const TEST_APP_ID = 'ca-app-pub-3940256099942544~3347511713'; // Google's official test AdMob app ID
const appId = process.env.ADMOB_APP_ID || TEST_APP_ID;
const vcode = parseInt(process.env.VERSION_CODE || '1', 10);
const vname = process.env.VERSION_NAME || `1.0.${vcode}`;
const TARGET_SDK = 36; // Google Play requires Android 16 (API 36) for new apps and updates from Aug 31, 2026

const edit = (f, fn) => { const a = fs.readFileSync(f, 'utf8'), b = fn(a); if (a !== b) fs.writeFileSync(f, b); console.log('patched ' + f); };

// 1. AndroidManifest: AdMob app id + portrait
edit('android/app/src/main/AndroidManifest.xml', s => {
  s = s.replace(/\s*<meta-data android:name="com\.google\.android\.gms\.ads\.APPLICATION_ID"[^>]*\/>/, '');
  s = s.replace(/<application([^>]*)>/, `<application$1>\n        <meta-data android:name="com.google.android.gms.ads.APPLICATION_ID" android:value="${appId}"/>`);
  if (!/screenOrientation/.test(s)) s = s.replace(/<activity\b/, '<activity\n            android:screenOrientation="portrait"');
  return s;
});

// 2. SDK levels
edit('android/variables.gradle', s => s
  .replace(/compileSdkVersion\s*=\s*(\d+)/, (m, n) => `compileSdkVersion = ${Math.max(+n, TARGET_SDK)}`)
  .replace(/targetSdkVersion\s*=\s*(\d+)/, (m, n) => `targetSdkVersion = ${Math.max(+n, TARGET_SDK)}`));

// 3. Version + release signing (the keystore comes from GitHub secrets, never from the repo)
edit('android/app/build.gradle', s => {
  s = s.replace(/versionCode\s+\d+/, `versionCode ${vcode}`).replace(/versionName\s+"[^"]*"/, `versionName "${vname}"`);
  if (process.env.KEYSTORE_FILE && !s.includes('signingConfigs')) {
    s = s.replace(/android\s*\{/, `android {
    signingConfigs {
        release {
            storeFile file(System.getenv("KEYSTORE_FILE"))
            storePassword System.getenv("KEYSTORE_PASSWORD")
            keyAlias System.getenv("KEY_ALIAS") ?: "upload"
            keyPassword System.getenv("KEYSTORE_PASSWORD")
        }
    }`);
    s = s.replace(/buildTypes\s*\{\s*release\s*\{/, m => m + '\n            signingConfig signingConfigs.release');
  }
  return s;
});
console.log(`AdMob app id: ${appId === TEST_APP_ID ? 'TEST (set the ADMOB_APP_ID variable for real ads)' : appId}; version ${vname} (${vcode})`);
