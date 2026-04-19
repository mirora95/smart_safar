import assert from 'node:assert/strict';
import { normalizeBasename } from '../src/routerBasename.js';

function stripBasename(pathname, basename) {
  if (basename === '/') return pathname;
  if (!pathname.toLowerCase().startsWith(basename.toLowerCase())) return null;

  const startIndex = basename.endsWith('/') ? basename.length - 1 : basename.length;
  const nextChar = pathname.charAt(startIndex);

  if (nextChar && nextChar !== '/') return null;

  return pathname.slice(startIndex) || '/';
}

const normalizedBase = normalizeBasename('/smart_safar/');

assert.equal(normalizedBase, '/smart_safar');
assert.equal(stripBasename('/smart_safar', normalizedBase), '/');
assert.equal(stripBasename('/smart_safar/', normalizedBase), '/');
assert.equal(normalizeBasename('/'), '/');

console.log('router basename checks passed');
