import test from 'node:test';
import assert from 'node:assert/strict';
import { DEFAULT_SITE_CONFIG, getWhatsAppUrl } from './siteConfigStore';

test('DEFAULT_SITE_CONFIG has correct WhatsApp number 6305729387 and Instagram', () => {
  assert.equal(DEFAULT_SITE_CONFIG.rawWhatsAppNumber, '916305729387');
  assert.ok(DEFAULT_SITE_CONFIG.displayPhone.includes('63057 29387'));
  assert.ok(DEFAULT_SITE_CONFIG.instagramUrl.includes('instagram.com/reelbrozz'));
  assert.equal(DEFAULT_SITE_CONFIG.banner.enabled, true);
});

test('getWhatsAppUrl formats phone and message properly', () => {
  const url = getWhatsAppUrl('916305729387', 'Hello shoot booking');
  assert.equal(url, 'https://wa.me/916305729387?text=Hello%20shoot%20booking');
});
