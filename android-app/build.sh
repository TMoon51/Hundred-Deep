#!/usr/bin/env bash
# Builds the Hundred Deep Android app from the game in the repo root.
# Run by .github/workflows/android.yml. Output lands in android-app/out/.
set -euo pipefail
cd "$(dirname "$0")"
rm -rf www out && mkdir -p www out

# 1. The game itself: the same index.html that GitHub Pages serves
cp ../index.html www/index.html
cp -r ../icons www/icons
if [ -n "${ADMOB_REWARDED_ID:-}" ]; then
  sed -i "s#ca-app-pub-3940256099942544/5224354917#${ADMOB_REWARDED_ID}#" www/index.html
  echo "Using your AdMob rewarded unit"
else
  echo "Using Google's TEST rewarded ad unit (set the ADMOB_REWARDED_ID variable for real ads)"
fi

# 2. Capacitor + plugins, then the native Android project
node scripts/install-deps.mjs
[ -d android ] || npx cap add android
npx cap sync android
npx --yes @capacitor/assets generate --android --assetPath assets \
  --iconBackgroundColor '#0b0908' --iconBackgroundColorDark '#0b0908' \
  --splashBackgroundColor '#0b0908' --splashBackgroundColorDark '#0b0908' \
  || echo "WARNING: icon/splash generation failed, using Capacitor defaults"

# 3. Release signing key from GitHub secrets (optional: without it you only get a test APK)
if [ -n "${KEYSTORE_B64:-}" ]; then
  echo "$KEYSTORE_B64" | base64 -d > "$PWD/upload.jks"
  export KEYSTORE_FILE="$PWD/upload.jks"
fi
node scripts/patch-android.mjs

# 4. Build
cd android
chmod +x gradlew
./gradlew --no-daemon assembleDebug
cp app/build/outputs/apk/debug/app-debug.apk ../out/hundred-deep-test.apk
if [ -n "${KEYSTORE_FILE:-}" ]; then
  ./gradlew --no-daemon bundleRelease
  cp app/build/outputs/bundle/release/app-release.aab ../out/hundred-deep.aab
  echo "Built hundred-deep.aab (upload this to Google Play) and hundred-deep-test.apk"
else
  echo "No KEYSTORE_B64 secret set: built hundred-deep-test.apk only (install it on your phone to try the app)"
fi
