# Hundred Deep: installable web app

These files are the whole game as a home-screen app. Host them on any static web host and send people the link.

## Put it online with GitHub Pages (free)
1. Sign in at github.com and click **New repository**. Name it `hundred-deep`, set it to **Public**, and create it.
2. On the new repository page click **uploading an existing file**, drag in everything from this folder (index.html, manifest.webmanifest, sw.js, .nojekyll and the icons folder), then **Commit changes**.
3. Open **Settings → Pages**. Under *Build and deployment* choose **Deploy from a branch**, branch **main**, folder **/ (root)**, and **Save**.
4. After a minute the page shows your link, like `https://YOURNAME.github.io/hundred-deep/`. That is the link to send players.

## How players install it
- **iPhone/iPad:** open the link in Safari, tap **Share**, then **Add to Home Screen**.
- **Android:** open the link in Chrome and tap **Install app** (or the menu, then **Install app**).

It then opens from its own icon, full screen, works offline, and keeps progress on the phone.

## Moving progress over from the Claude version
In the Claude version open **Stats → Save backup → Copy backup code**. In the app open **Stats → Save backup**, paste the code, and tap **Restore** twice.

## Updates
Replace `index.html` and `sw.js` in the repository with new versions. Players get the update the next time they open the app while online.
