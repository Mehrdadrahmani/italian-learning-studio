// Serves dist/pwa on the local network so an iPhone on the same Wi-Fi can open it.
// Plain HTTP: service worker and microphone stay off until the app is on HTTPS.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { networkInterfaces } from 'node:os';
import { extname, join, normalize } from 'node:path';

const ROOT = 'dist/pwa', PORT = Number(process.env.PORT ?? 4173);
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.png': 'image/png', '.webmanifest': 'application/manifest+json' };
createServer(async (req, res) => {
  const p = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname)).replace(/^(\.\.[/\\])+/, '');
  try {
    const body = await readFile(join(ROOT, p === '/' ? 'index.html' : p));
    res.writeHead(200, { 'content-type': TYPES[extname(p)] ?? TYPES['.html'] }); res.end(body);
  } catch { res.writeHead(404); res.end('Not found'); }
}).listen(PORT, '0.0.0.0', () => {
  const ips = Object.values(networkInterfaces()).flat().filter(i => i.family === 'IPv4' && !i.internal).map(i => i.address);
  console.log(`http://localhost:${PORT}`); ips.forEach(ip => console.log(`http://${ip}:${PORT}  (iPhone on same Wi-Fi)`));
});
