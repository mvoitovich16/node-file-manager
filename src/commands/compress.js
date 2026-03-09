// Команды compress / decompress с Brotli

import fs from 'node:fs';
import path from 'node:path';
import { createBrotliCompress, createBrotliDecompress } from 'node:zlib';

function resolveFrom(currentDir, p) {
  const candidate = path.isAbsolute(p) ? p : path.join(currentDir, p);
  return path.normalize(candidate);
}

export async function compress(currentDir, srcPath, destPath) {
  if (!srcPath || !destPath) throw new Error('bad args');
  const src = resolveFrom(currentDir, srcPath);
  const dest = resolveFrom(currentDir, destPath);

  return new Promise((resolve, reject) => {
    const rs = fs.createReadStream(src);
    const ws = fs.createWriteStream(dest);
    const br = createBrotliCompress();
    rs.on('error', reject);
    ws.on('error', reject);
    ws.on('finish', resolve);
    rs.pipe(br).pipe(ws);
  });
}

export async function decompress(currentDir, srcPath, destPath) {
  if (!srcPath || !destPath) throw new Error('bad args');
  const src = resolveFrom(currentDir, srcPath);
  const dest = resolveFrom(currentDir, destPath);

  return new Promise((resolve, reject) => {
    const rs = fs.createReadStream(src);
    const ws = fs.createWriteStream(dest);
    const br = createBrotliDecompress();
    rs.on('error', reject);
    ws.on('error', reject);
    ws.on('finish', resolve);
    rs.pipe(br).pipe(ws);
  });
}

