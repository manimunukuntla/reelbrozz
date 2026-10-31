import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateBookingPrice, calculateCreatorEarnings, PACKAGES } from './pricing';

test('calculates base package price correctly with 18% GST', () => {
  const result = calculateBookingPrice('quick-reel');
  assert.equal(result.basePrice, 1500);
  assert.equal(result.addonsTotal, 0);
  assert.equal(result.subtotal, 1500);
  // GST: 1500 * 0.18 = 270
  assert.equal(result.taxAmount, 270);
  assert.equal(result.totalPrice, 1770);
});

test('calculates package with drone add-on and promo code', () => {
  const result = calculateBookingPrice('half-day', { drone4K: true }, 'FIRSTBROZZ');
  // Half day = 3999, drone = 1999 -> subtotal = 5998
  assert.equal(result.subtotal, 5998);
  // Discount = 300 -> 5698
  assert.equal(result.discountAmount, 300);
  assert.equal(result.discountCodeApplied, 'FIRSTBROZZ');
  // Tax = round(5698 * 0.18) = 1026
  assert.equal(result.taxAmount, 1026);
  assert.equal(result.totalPrice, 6724);
});

test('calculates creator earnings scaling with weekly volume and tier', () => {
  const beginner = calculateCreatorEarnings(5, 'beginner');
  assert.equal(beginner.creatorSharePercent, 75);
  assert.ok(beginner.monthlyIncome > 0);

  const pro = calculateCreatorEarnings(10, 'pro');
  assert.equal(pro.creatorSharePercent, 80);
  assert.ok(pro.monthlyIncome > beginner.monthlyIncome);
  assert.equal(pro.bonusAmount, 4000); // 10 reels/wk = 40 monthly >= 20
});
