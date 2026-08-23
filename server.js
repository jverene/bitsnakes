// Zero-dependency static file server for local development.
// Usage: npm run dev  (or: node server.js [port])
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('.', import.meta.url));
const port = Number(process.argv[2]) || 8000;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

const server = createServer(async (req, res) => {
  try {
    let path = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    if (path.endsWith('/')) path += 'index.html';
    const file = normalize(join(root, path));
    if (!file.startsWith(root)) { res.writeHead(403); res.end(); return; }
    const body = await readFile(file);
    res.writeHead(200, { 'Content-Type': MIME[extname(file)] || 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404); res.end('Not found');
  }
});

// If the port is taken, try the next one (up to +20) instead of crashing.
// Note: the listen callback of a failed attempt stays registered as a
// 'listening' listener and would fire on the retry's success — the
// `announced` flag guards against that stale callback printing.
let announced = false;
function listen(p, attempts = 0) {
  server.once('error', (err) => {
    if (err.code === 'EADDRINUSE' && attempts < 20) {
      listen(p + 1, attempts + 1);
    } else {
      console.error(err.message);
      process.exit(1);
    }
  });
  server.listen(p, () => {
    if (announced) return;
    announced = true;
    console.log(`Snake Protocol dev server → http://localhost:${server.address().port}`);
  });
}
listen(port);
