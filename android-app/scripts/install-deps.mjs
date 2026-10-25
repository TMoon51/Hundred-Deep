// Installs Capacitor at the major version the AdMob plugin supports, plus the billing plugin.
// Doing this at build time keeps the versions compatible without anyone pinning them by hand.
import { execSync } from 'node:child_process';
const run = c => { console.log('> ' + c); execSync(c, { stdio: 'inherit' }); };
const read = c => execSync(c).toString().trim();

const admob = JSON.parse(read('npm view @capacitor-community/admob@latest --json'));
const pick = o => (o || {})['@capacitor/core'] || (o || {})['@capacitor/android'] || '';
let range = pick(admob.peerDependencies) || pick(admob.devDependencies) || pick(admob.dependencies);
let major = (range.match(/(\d+)/) || [])[1];
if (!major) {
  console.log('AdMob plugin lists no Capacitor version:', JSON.stringify({ peer: admob.peerDependencies, dev: admob.devDependencies }));
  range = read('npm view @capacitor/core@latest version');
  major = range.split('.')[0];
}
console.log(`AdMob plugin ${admob.version} needs @capacitor/core ${range} -> using Capacitor ${major}`);

run(`npm install --no-audit --no-fund --save ` +
  `@capacitor/core@^${major} @capacitor/android@^${major} @capacitor/cli@^${major} ` +
  `@capacitor-community/admob@${admob.version} cordova-plugin-purchase@latest`);
