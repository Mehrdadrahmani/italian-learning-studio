// Builds two outputs from one codebase:
//   dist/pwa/      installable iPhone web app (React bundled, works offline)
//   dist/artifact.html   claude.ai Artifact page (React from cdnjs, no <html> skeleton)
import { build } from 'esbuild';
import { createHash } from 'node:crypto';
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';

const FONTS = 'https://fonts.googleapis.com/css2?family=Bodoni+Moda:wght@500;700&family=Source+Serif+4:ital,wght@0,400;0,600;1,400&family=Vazirmatn:wght@400;500;600;700&display=swap';
const css = readFileSync('src/styles.css', 'utf8');
const options = { entryPoints: ['src/main.tsx'], bundle: true, minify: true, write: false, format: 'iife', target: 'safari15', jsx: 'transform', jsxFactory: '__h', jsxFragment: 'React.Fragment', inject: ['src/i18n/h.ts'], loader: { '.css': 'empty' } };
const safe = s => s.replace(/<\/script/gi, '<\\/script');

rmSync('dist', { recursive: true, force: true });
mkdirSync('dist/pwa', { recursive: true });

// PWA: everything bundled so the app opens with no network
const pwa = (await build({ ...options, define: { __PWA__: 'true', 'process.env.NODE_ENV': '"production"' } })).outputFiles[0].text;
const version = createHash('sha256').update(pwa + css).digest('hex').slice(0, 10);
writeFileSync('dist/pwa/index.html', `<!doctype html>
<html lang="fa" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>Italian Learning Studio</title>
<meta name="description" content="مسیر یادگیری ایتالیایی از A1 تا C1 برای فارسی‌زبانان">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="Italiano">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<meta name="theme-color" content="#faf6ec" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#111a2b" media="(prefers-color-scheme: dark)">
<link rel="manifest" href="manifest.webmanifest">
<link rel="apple-touch-icon" href="icon-180.png">
<link rel="stylesheet" href="${FONTS}">
<style>${css}</style>
<style>:root{padding-top:env(safe-area-inset-top,0px)}html,body{height:100%}</style>
</head>
<body><div id="root"></div><script>${safe(pwa)}</script></body>
</html>`);
writeFileSync('dist/pwa/sw.js', readFileSync('public/sw.js', 'utf8').replace('__VERSION__', version));
for (const f of ['manifest.webmanifest', 'icon-180.png', 'icon-192.png', 'icon-512.png']) cpSync('public/' + f, 'dist/pwa/' + f);

// iOS: same bundle without a service worker; Capacitor serves it from the app itself
mkdirSync('dist/ios', { recursive: true });
const ios = (await build({ ...options, define: { __PWA__: 'false', 'process.env.NODE_ENV': '"production"' } })).outputFiles[0].text;
writeFileSync('dist/ios/index.html', `<!doctype html>
<html lang="fa" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>Italian Learning Studio</title>
<link rel="stylesheet" href="${FONTS}">
<style>${css}</style>
<style>:root{padding-top:env(safe-area-inset-top,0px)}html,body{height:100%}body{-webkit-touch-callout:none}</style>
</head>
<body><div id="root"></div><script>${safe(ios)}</script></body>
</html>`);

// Artifact: page content only; the platform adds the document skeleton
const external = { name: 'cdn-react', setup(b) {
  b.onResolve({ filter: /^react(-dom\/client)?$/ }, a => ({ path: a.path, namespace: 'cdn' }));
  b.onLoad({ filter: /.*/, namespace: 'cdn' }, a => ({ contents: a.path === 'react' ? 'module.exports=window.React' : 'module.exports=window.ReactDOM', loader: 'js' }));
} };
const art = (await build({ ...options, plugins: [external], define: { __PWA__: 'false', 'process.env.NODE_ENV': '"production"' } })).outputFiles[0].text;
writeFileSync('dist/artifact.html', `<title>Italian Learning Studio</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="stylesheet" href="${FONTS}">
<style>${css}</style>
<div id="root"></div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/react/18.3.1/umd/react.production.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.3.1/umd/react-dom.production.min.js"></script>
<script>${safe(art)}</script>
`);
console.log(`pwa ${(pwa.length / 1024).toFixed(0)} KB, artifact ${(art.length / 1024).toFixed(0)} KB, version ${version}`);
