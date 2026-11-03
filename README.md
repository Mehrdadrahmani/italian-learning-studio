# Italian Learning Studio

An Italian course for Persian speakers (A1 to C1), built as an iPhone web app from `italian_learning_studio_claude_prompt.md`.

## Two builds, one codebase

| | `dist/pwa/` (installed app) | `dist/artifact.html` (claude.ai) |
|---|---|---|
| Works offline | Yes | No |
| Live microphone recording | Yes, on HTTPS | No, use an audio file |
| AI tutor and corrections | No, a client app must not hold an API key | Yes |
| Progress saved | This device | Claude account and this browser |

## Commands

```sh
npm install
npm run build             # writes dist/
npm run typecheck
npm run serve             # serves dist/pwa on your Wi-Fi over plain HTTP
node tests/content.test.mjs
node tests/e2e.test.mjs
node tests/delivery.test.mjs
```

## Install on an iPhone

Offline use and the microphone both need HTTPS, so host `dist/pwa/` on any static HTTPS host (GitHub Pages, Netlify, Cloudflare Pages). Then:

1. Open the URL in Safari.
2. Tap Share, then Add to Home Screen.
3. For better audio, add an Italian voice in Settings > Accessibility > Spoken Content > Voices.

`npm run serve` is enough to preview the app on a phone on the same Wi-Fi, but offline use and the microphone stay off without HTTPS.

## Build the native iOS app

`ios/` is a Capacitor project that runs the app from inside a native iPhone app. It needs Xcode, which is free from the Mac App Store.

```sh
sudo xcode-select -s /Applications/Xcode.app
npm run ios        # rebuild the app and copy it into ios/
npm run ios:open   # open the project in Xcode
```

In Xcode, select the App target, choose your Apple ID under Signing & Capabilities, pick your iPhone and press Run. If the bundle ID `com.mehrdadrahmani.italianstudio` is refused, change it to something unique. A free Apple ID installs on your own phone for 7 days at a time. TestFlight and the App Store need the paid Apple Developer Program.

## Dictionary and translation

| Service | Key | Where it works |
|---|---|---|
| Wiktionary (Italian to English definitions, CC BY-SA) | None | Web and iOS |
| MyMemory (Italian to Persian and English) | None; free daily limit | Web and iOS |
| Google Translate button (opens Google) | None | Everywhere |
| Google Cloud Translation inside the app | Your own, in Settings | Web and iOS; not yet tested with a real key |

Any word looked up there can be saved to **My words** with its Persian and English meanings, which are filled in by machine translation and can be edited. Saved words appear in the Vocabulary Lab and join Leitner and Smart Revision. The course itself still has 183 hand-written words with examples.

Artifact pages cannot call outside services, so that version offers the links plus translation by Claude. The Google key stays on the device and is left out of backups and sync.

## Languages

`src/i18n/strings.txt.ts` holds Persian, English and Italian interface text, keyed by the Persian string. Screens stay plain JSX because the JSX factory translates visible strings. Lesson bodies have no entries yet, so they stay in Persian.

## Layout

- `src/data/`: course content, kept separate from the UI
- `src/lib/`: SM-2 scheduling, storage, speech, capability detection, test generation
- `src/ui/`: React screens and shared components
- `public/`: manifest, service worker, icons

## Adding content

A lesson listed under `planned` in `src/data/course.ts` appears as "not written yet". Move it to `lessons` when its content exists. New vocabulary is one pipe-separated line in `src/data/vocab.ts`. Run `tests/content.test.mjs` afterwards to check references.

All content is labelled AI-GENERATED because no human teacher has reviewed it yet. Change a label only after real review.
