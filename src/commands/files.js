// Операции с файлами (cat, add, rn, cp, mv, rm)

import fs from 'node:fs';
import path from 'node:path';

function resolveFrom(currentDir, p) {
  const candidate = path.isAbsolute(p) ? p : path.join(currentDir, p);
  return path.normalize(candidate);
}

export async function cat(currentDir, filePath) {
  if (!filePath) throw new Error('no path');
  const p = resolveFrom(currentDir, filePath);

  return new Promise((resolve, reject) => {
    const rs = fs.createReadStream(p, { encoding: 'utf-8' });
    rs.on('error', reject);
    rs.on('end', resolve);
    rs.pipe(process.stdout);
  });
}

export async function add(currentDir, name) {
  if (!name) throw new Error('no name');
  const p = path.join(currentDir, name);
  await fs.promises.writeFile(p, '');
}

export async function rn(currentDir, filePath, newName) {
  if (!filePath || !newName) throw new Error('bad args');
  const from = resolveFrom(currentDir, filePath);
  const to = path.join(path.dirname(from), newName);
  await fs.promises.rename(from, to);
}

async function copyFileStream(currentDir, src, destDir) {
  const from = resolveFrom(currentDir, src);
  const toDir = resolveFrom(currentDir, destDir);
  const base = path.basename(from);
  const to = path.join(toDir, base);

  return new Promise((resolve, reject) => {
    const rs = fs.createReadStream(from);
    const ws = fs.createWriteStream(to);
    rs.on('error', reject);
    ws.on('error', reject);
    ws.on('finish', resolve);
    rs.pipe(ws);
  });
}

export async function cp(currentDir, filePath, destDir) {
  if (!filePath || !destDir) throw new Error('bad args');
  await copyFileStream(currentDir, filePath, destDir);
}

export async function mv(currentDir, filePath, destDir) {
  if (!filePath || !destDir) throw new Error('bad args');
  await copyFileStream(currentDir, filePath, destDir);
  const from = resolveFrom(currentDir, filePath);
  await fs.promises.unlink(from);
}

export async function rm(currentDir, filePath) {
  if (!filePath) throw new Error('no path');
  const p = resolveFrom(currentDir, filePath);
  await fs.promises.unlink(p);
}

