# Visara — Visa Toolkit (iOS + Android)

A modern, animated mobile app with five visa tools, built with **Expo (React Native) + Expo Router + Reanimated**.
One codebase ships to the App Store and Google Play.

| Tool | What it does |
| --- | --- |
| **Visa Check** | Passport + destination → visa-free / eTA / e-visa / visa required, stay length and next steps. Also ranks every destination for your passport. |
| **Transit Visa** | Airside vs. entering the country, layover length, stop-over programmes (e.g. China 240 h). |
| **Documents** | Tailored checklist by destination and purpose (tourism / business / study); progress saved on-device. |
| **Fees & Timing** | Compare cost and processing time across destinations for your passport; sortable, animated bars. |
| **Stay Calculator** | Schengen 90/180-day rolling-window tracker with a "plan a trip" estimator. |

Animations: branded launch sequence, drifting gradient background, staggered spring entrances, press-scale + haptics on every control, animated bottom-sheet pickers, animated verdict cards, progress bars and checkboxes, animated list re-ordering.

## Run it

```bash
npm install
npx expo start          # scan the QR code with Expo Go, or press i / a for a simulator
npm run typecheck
npm run web             # quick browser preview
```

## Project layout

```
src/app/            screens (Expo Router): index, visa-check, transit, documents, fees, stay, about
src/components/     PressableScale, SelectField (bottom-sheet picker), VerdictCard, Intro, AppBackground …
src/data/           countries, visaRules, transit, fees, documents  ← the only place rules live
src/lib/            pure logic (visa lookup, transit verdicts, fee rows, 90/180 maths) + storage
```

All rules live in `src/data/*`. To go live with real data, replace those modules with calls to an API (or a bundled JSON refreshed
by OTA updates) — no screen code needs to change.

> **Data accuracy:** the bundled rules and fees are *indicative* and many policies change often. Entries flagged `verify: true` show a
> "double-check" warning in the UI. Review and own the dataset (and keep a "last reviewed" date) before you publish; the in-app
> disclaimers tell users to confirm with official sources.

## Publish to the stores (EAS)

You need an [Expo account](https://expo.dev), an **Apple Developer** account ($99/yr) and a **Google Play Console** account ($25 once).

1. Change the identifiers in `app.json`: `ios.bundleIdentifier` and `android.package` (currently `com.visara.app`) to ones you own.
2. `npm i -g eas-cli && eas login && eas init` (links the project and writes the `projectId` into `app.json`).
3. Build:
   ```bash
   npm run build:android   # .aab for Google Play
   npm run build:ios       # .ipa for App Store (EAS manages certificates for you)
   ```
4. Submit: `npm run submit:ios` / `npm run submit:android` (Android needs a Play service-account key for the first upload; the very first
   release must be uploaded to the Play Console manually or via the key).
5. Over-the-air fixes for JS-only changes: `eas update`.

### Store checklist
- **Icons / splash:** `assets/` (1024×1024 icon, adaptive Android icons, splash) — replace with final brand art if desired.
- **Screenshots:** 6.7" and 6.5" iPhone, 12.9" iPad (supportsTablet is on), and phone/7"/10" Android.
- **Privacy:** the app collects no data and has no accounts/ads/analytics; passport choice, checklist and trips stay on-device.
  Answer the App Store "Data Not Collected" nutrition label and the Play Data safety form accordingly (re-check if you add analytics).
- **Category:** Travel. **Age rating:** 4+ / Everyone.
- **Listing copy (draft):** *"Visara — check visa requirements, transit rules, documents, fees and your 90/180-day Schengen allowance in one beautifully simple app."*
- Add a support URL and a privacy-policy URL (both stores require them).
