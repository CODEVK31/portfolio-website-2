/* Minimal static server for the built site in dist/.
   Usage: node serve.mjs [port]   (default 8088)
   Serves the production build exactly as Vercel would: static files by path,
   index.html at "/", and an index.html fallback for unknown routes. */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, dirname, resolve, extname, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, 'dist');
const port = Number(process.argv[2] || process.env.PORT || 8088);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'text/javascript; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg':  'image/svg+xml',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico':  'image/x-icon',
  '.pdf':  'application/pdf',
  '.woff': 'font/woff',
  '.woff2':'font/woff2',
};

async function resolveFile(urlPath) {
  // Decode, strip query/hash, prevent path traversal outside dist.
  let p = decodeURIComponent(urlPath.split('?')[0].split('#')[0]);
  if (p === '/' || p === '') p = '/index.html';
  const full = normalize(join(root, p));
  if (!full.startsWith(root)) return null;
  try {
    const s = await stat(full);
    if (s.isDirectory()) return await resolveFile(p.replace(/\/?$/, '/index.html'));
    return full;
  } catch {
    return null;
  }
}

const server = createServer(async (req, res) => {
  let file = await resolveFile(req.url || '/');
  // SPA fallback — unknown route serves index.html (hash-based deep links).
  if (!file) file = join(root, 'index.html');
  try {
    const body = await readFile(file);
    res.writeHead(200, { 'Content-Type': TYPES[extname(file)] || 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 — build dist/ first: npm run build:no-og');
  }
});

server.listen(port, () => {
  console.log(`Serving ${root}`);
  console.log(`→ http://localhost:${port}`);
});
