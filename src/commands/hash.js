// Команда hash path_to_file

import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';

function resolveFrom(currentDir, p) {
  const candidate = path.isAbsolute(p) ? p : path.join(currentDir, p);
  return path.normalize(candidate);
}

export async function hash(currentDir, filePath) {
  if (!filePath) throw new Error('no path');
  const p = resolveFrom(currentDir, filePath);

  return new Promise((resolve, reject) => {
    const hash = createHash('sha256');
    const rs = fs.createReadStream(p);
    rs.on('data', (chunk) => hash.update(chunk));
    rs.on('error', reject);
    rs.on('end', () => {
      console.log(hash.digest('hex'));
      resolve();
    });
  });
}

