import test from 'node:test';
import assert from 'node:assert/strict';
import { 
  DEFAULT_PACKAGES, 
  DEFAULT_PROMOS, 
  DynamicPackage, 
  PromoOffer 
} from './packageStore';

test('DEFAULT_PACKAGES contains valid package tiers with popular flag', () => {
  assert.ok(DEFAULT_PACKAGES.length >= 4);
  const popularPkg = DEFAULT_PACKAGES.find((p) => p.isPopular);
  assert.ok(popularPkg, 'Should have at least one popular package');
  assert.equal(popularPkg.id, 'half-day');
  assert.equal(popularPkg.basePrice, 3999);
});

test('DEFAULT_PROMOS contains FIRSTBROZZ discount', () => {
  const firstBrozz = DEFAULT_PROMOS.find((p) => p.code === 'FIRSTBROZZ');
  assert.ok(firstBrozz);
  assert.equal(firstBrozz.value, 500);
  assert.equal(firstBrozz.active, true);
});
