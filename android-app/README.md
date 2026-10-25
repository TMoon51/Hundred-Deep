# Hundred Deep for Google Play

This folder turns the game in the repo root (`index.html`) into an Android app with:
- **Rewarded ads** (Google AdMob): watch an ad to double a run's gold, or to rise again once per run.
- **One-time purchases** (Google Play Billing): `speed_2x` Swift Hand ($5.99), `gold_2x` Golden Claw ($9.99), `no_ads` Ad-Free ($9.99).

You never build anything yourself. GitHub builds the app in the cloud (`.github/workflows/android.yml`), so everything below works from a phone browser.

## Build the app
1. Open the repo on github.com → **Actions** → **Build Android app** → **Run workflow**.
2. Wait about 10 minutes, open the finished run, and download **hundred-deep-android** at the bottom.
3. Inside the zip:
   - `hundred-deep.aab` is the file you upload to Google Play.
   - `hundred-deep-test.apk` can be installed straight onto your own phone to try the app. Ads work in it, but purchases don't. Purchases only work in a copy installed from Google Play, for example through internal testing.

Every build gets a higher version number automatically.

## Settings (repo → Settings → Secrets and variables → Actions)
| Name | Type | What it is |
|---|---|---|
| `KEYSTORE_B64` | Secret | Your upload key (base64). Without it only the test APK is built. |
| `KEYSTORE_PASSWORD` | Secret | Password for the upload key. |
| `ADMOB_APP_ID` | Variable | From AdMob → Apps → App settings, looks like `ca-app-pub-123…~456…`. Until set, Google's test ads are used. |
| `ADMOB_REWARDED_ID` | Variable | From AdMob → your app → Ad units → the rewarded unit, looks like `ca-app-pub-123…/789…`. |

**Keep the upload key file and its password safe**, outside this repo. If you lose them, Google Play support can reset the upload key, but it takes days.

## Google Play Console checklist
1. Create a developer account (one-time $25) at play.google.com/console.
2. **Create app**: name *Hundred Deep*, Game, Free.
3. **Monetize → Products → One-time products**: create `speed_2x` ($5.99), `gold_2x` ($9.99) and `no_ads` ($9.99), then activate them. This needs a build uploaded first. The prices shown in the game come from Google Play.
4. **Policy → App content**:
   - Privacy policy: `https://tmoon51.github.io/hundred-deep/privacy.html`
   - Ads: **Yes**.
   - Target audience: 13+ (keeps the app out of the stricter Families rules).
   - Data safety: the app collects the device advertising ID and approximate device info, shared with Google AdMob for advertising. Data is encrypted in transit. Users can't request deletion because nothing is stored by you.
   - Content rating: fill in the questionnaire (fantasy violence).
5. **Testing → Closed testing**: new personal accounts must run a closed test with at least 12 testers for 14 days before going public.
6. **Production**: once the closed test is done, apply for production access and roll out.

## AdMob checklist
1. Sign up at admob.google.com and add an Android app called Hundred Deep.
2. Create one **Rewarded** ad unit.
3. Put the App ID and ad unit ID into the two variables above and run the build again.
4. After the app is on Google Play, link it in AdMob (App settings → Add app store details).

## Changing things
- **Product IDs** are in `index.html`: `CFG.prod`. Real prices live in Play Console; `LIST` in the game is only a fallback label.
- **App ID** (`com.hundreddeep.game`) is in `capacitor.config.json`. It can never change after the first upload to Google Play.
