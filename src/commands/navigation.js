// Навигация по директориям (up, cd, ls)
// Тут специально всё просто, без умных абстракций.

import fs from 'node:fs';
import path from 'node:path';

export function up(currentDir) {
  const parent = path.dirname(currentDir);
  if (parent === currentDir) return currentDir; // уже корень
  return parent;
}

export async function cd(currentDir, dirPath) {
  if (!dirPath) throw new Error('no path');
  const p = path.isAbsolute(dirPath) ? dirPath : path.join(currentDir, dirPath);
  const norm = path.normalize(p);

  try {
    const stat = await fs.promises.stat(norm);
    if (!stat.isDirectory()) throw new Error('not dir');
    const root = path.parse(norm).root;
    if (!root) throw new Error('no root');
    return norm;
  } catch {
    throw new Error('failed');
  }
}

export async function ls(currentDir) {
  const entries = await fs.promises.readdir(currentDir, { withFileTypes: true });
  const dirs = [];
  const files = [];
  for (const e of entries) {
    if (e.isDirectory()) dirs.push({ Name: e.name, Type: 'directory' });
    else files.push({ Name: e.name, Type: 'file' });
  }
  dirs.sort((a, b) => a.Name.localeCompare(b.Name));
  files.sort((a, b) => a.Name.localeCompare(b.Name));
  console.table([...dirs, ...files]);
}

