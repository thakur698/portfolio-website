const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const DEFAULT_PORT = process.env.PORT || 3000;
const WEB_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf'
};

const server = http.createServer((req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.statusCode = 405;
    res.end('Method Not Allowed');
    return;
  }

  const reqUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  let pathname = decodeURIComponent(reqUrl.pathname);

  // Clean URL routing
  if (pathname === '/') {
    pathname = '/index.html';
  } else if (pathname === '/projects') {
    pathname = '/projects.html';
  } else if (pathname === '/resume') {
    pathname = '/resume.html';
  }

  // Prevent directory traversal
  const safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
  
  // Resolve file location with automatic smart fallback for organized asset directories
  let filePath = path.join(WEB_DIR, safePath);

  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    const filename = path.basename(safePath);
    
    // Check in public/assets/frames/ (for 240 video frames)
    const frameCandidate = path.join(WEB_DIR, 'public', 'assets', 'frames', filename);
    if (fs.existsSync(frameCandidate)) {
      filePath = frameCandidate;
    }
    // Check in public/assets/images/ (for project visuals, badges, thumbnails)
    else {
      const imageCandidate = path.join(WEB_DIR, 'public', 'assets', 'images', filename);
      if (fs.existsSync(imageCandidate)) {
        filePath = imageCandidate;
      }
      // Check in src/css/
      else {
        const cssCandidate = path.join(WEB_DIR, 'src', 'css', filename);
        if (fs.existsSync(cssCandidate)) {
          filePath = cssCandidate;
        }
        // Check in src/js/
        else {
          const jsCandidate = path.join(WEB_DIR, 'src', 'js', filename);
          if (fs.existsSync(jsCandidate)) {
            filePath = jsCandidate;
          }
        }
      }
    }
  }

  // Security check: ensure path is within WEB_DIR or subdirectories
  if (!filePath.startsWith(WEB_DIR)) {
    res.statusCode = 403;
    res.end('Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.end('404 Not Found: ' + safePath);
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    const headers = {
      'Content-Type': contentType,
      'Content-Length': stats.size,
      'Access-Control-Allow-Origin': '*'
    };

    // Cache static image assets for 60fps smooth playback scrubbing
    if (['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext)) {
      headers['Cache-Control'] = 'public, max-age=31536000, immutable';
    } else {
      headers['Cache-Control'] = 'no-cache';
    }

    res.writeHead(200, headers);

    if (req.method === 'HEAD') {
      res.end();
      return;
    }

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

function startServer(port) {
  server.listen(port, '0.0.0.0', () => {
    console.log(`Portfolio Web App (Monorepo) running at:`);
    console.log(`  > Local:   http://localhost:${port}/`);
    console.log(`  > Network: http://127.0.0.1:${port}/`);
    console.log(`  > Static Root: ${WEB_DIR}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} in use, trying port ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error('Server error:', err);
    }
  });
}

startServer(DEFAULT_PORT);
