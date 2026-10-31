import test from 'node:test';
import assert from 'node:assert/strict';
import { verifyAdminPassword } from './auth';

test('verifyAdminPassword accepts correct password mani@7', () => {
  assert.equal(verifyAdminPassword('mani@7'), true);
  assert.equal(verifyAdminPassword('  mani@7  '), true);
});

test('verifyAdminPassword rejects incorrect passwords', () => {
  assert.equal(verifyAdminPassword('wrongpass'), false);
  assert.equal(verifyAdminPassword('admin'), false);
  assert.equal(verifyAdminPassword(''), false);
  assert.equal(verifyAdminPassword('MANI@7'), false);
});
