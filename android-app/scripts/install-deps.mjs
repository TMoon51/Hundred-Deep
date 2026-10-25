// Installs Capacitor at the major version the AdMob plugin supports, plus the billing plugin.
// Doing this at build time keeps the versions compatible without anyone pinning them by hand.
import { execSync } from 'node:child_process';
const run = c => { console.log('> ' + c); execSync(c, { stdio: 'inherit' }); };
const read = c => execSync(c).toString().trim();

const admob = JSON.parse(read('npm view @capacitor-community/admob@latest --json'));
const range = (admob.peerDependencies || {})['@capacitor/core'] || '';
const major = (range.match(/(\d+)/) || [])[1];
if (!major) throw new Error('Could not read the Capacitor version the AdMob plugin needs: ' + range);
console.log(`AdMob plugin ${admob.version} needs @capacitor/core ${range} -> using Capacitor ${major}`);

run(`npm install --no-audit --no-fund --save ` +
  `@capacitor/core@^${major} @capacitor/android@^${major} @capacitor/cli@^${major} ` +
  `@capacitor-community/admob@${admob.version} cordova-plugin-purchase@latest`);
