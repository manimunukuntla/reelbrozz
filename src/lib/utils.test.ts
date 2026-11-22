import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cn } from './utils.js';

test('cn merges class names properly with conditional logic', () => {
  const result = cn('px-4 py-2', true && 'bg-red-500', false && 'hidden', 'text-white');
  assert.equal(result, 'px-4 py-2 bg-red-500 text-white');
});

test('cn resolves tailwind class conflicts correctly', () => {
  const result = cn('p-4', 'p-8', 'text-red-500', 'text-blue-500');
  assert.equal(result, 'p-8 text-blue-500');
});
