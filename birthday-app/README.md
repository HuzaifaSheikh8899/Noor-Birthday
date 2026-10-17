# Birthday Wish App (Android APK)

A personal, offline **10-screen birthday journey** for your best friend — built with HTML5, CSS3, vanilla JavaScript, and **Capacitor** for a real installable Android app.

## Personalize

Edit the top of `script.js`:

```javascript
const birthdayPerson = {
    name: "BESTIE",
    photos: [ "photos/photo1.jpg", ... ],
    captions: [ "Your caption here ❤️", ... ]
};
```

Replace files in `photos/` with your real JPG/PNG photos (keep names or update paths in `birthdayPerson.photos`).

Replace `birthday-music.mp3` in the project root with your birthday song (MP3). Run `npm run build` again before syncing to Android.

## Project structure

```text
birthday-app/
├── index.html
├── style.css
├── script.js
├── package.json
├── capacitor.config.json
├── photos/
├── birthday-music.mp3
├── scripts/
│   ├── generate-assets.js
│   └── copy-www.js
└── www/          (generated — used by Capacitor)
```

## Requirements

- **Node.js** LTS (18 or 20+) — [https://nodejs.org](https://nodejs.org)
- **Android Studio** (latest stable) — [https://developer.android.com/studio](https://developer.android.com/studio)
- **JDK 17** (usually bundled with Android Studio)

## 1. Install Node.js

Download and install Node.js LTS. Verify:

```bash
node -v
npm -v
```

## 2. Install dependencies

Open a terminal in the `birthday-app` folder:

```bash
cd birthday-app
npm install
```

This installs Capacitor and creates placeholder photos/music if yours are not added yet.

## 3. Build web assets for Capacitor

```bash
npm run build
```

This copies HTML/CSS/JS, photos, and music into `www/`.

## 4. Add Android platform (first time only)

```bash
npx cap add android
```

If `android/` already exists, skip this step.

## 5. Sync project to Android

After any change to HTML, CSS, JS, photos, or music:

```bash
npm run cap:sync
```

## 6. Open in Android Studio

```bash
npm run cap:open
```

Or: **File → Open** → select the `birthday-app/android` folder.

Wait for Gradle sync to finish (first time may take several minutes).

## 7. Build a release APK

### Option A — Android Studio (recommended)

1. **Build → Generate Signed Bundle / APK**
2. Choose **APK**
3. Create or select a keystore (for a gift app, a new debug-style keystore is fine)
4. Select **release**
5. Finish

### Option B — Command line (after SDK is configured)

```bash
cd android
./gradlew assembleRelease
```

On Windows:

```powershell
cd android
.\gradlew.bat assembleRelease
```

## 8. Find the APK

Release APK (unsigned or signed, depending on your steps):

```text
android/app/build/outputs/apk/release/app-release.apk
```

Debug APK (quick testing):

```text
android/app/build/outputs/apk/debug/app-debug.apk
```

## 9. Install on a phone

1. Copy `app-release.apk` to the phone (USB, Google Drive, etc.)
2. On the phone, allow **Install unknown apps** for your file manager or browser
3. Tap the APK and install

Or connect USB debugging and run from Android Studio: **Run ▶** on a device.

## Offline behavior

Everything is bundled in the APK: UI, animations, photos, and music. No internet, login, or backend.

Fonts use system stacks (no Google Fonts CDN).

## Quick test in browser (optional)

Open `index.html` locally or use:

```bash
npx serve .
```

Music autoplay rules apply in browsers; on Android the first **Open Your Surprise** tap starts music.

## Troubleshooting

| Issue | Fix |
|--------|-----|
| Blank WebView | Run `npm run cap:sync` after edits |
| Music silent | Replace `birthday-music.mp3`; tap 🔇 after first screen button |
| Gradle fails | Open Android Studio → SDK Manager → install Android SDK Platform 34+ |
| Photos missing | Add files under `photos/` and run `npm run build` |

## App ID

`com.birthday.wishapp` — change in `capacitor.config.json` (`appId`) before publishing to Play Store.

Happy birthday to your bestie! 🎂❤️
