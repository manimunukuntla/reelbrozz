import test from 'node:test';
import assert from 'node:assert/strict';
import { addReel, updateReel, deleteReel, INITIAL_REELS, ReelItem } from './workStore';

test('addReel prepends a new reel with valid id and timestamp', () => {
  const customReel = {
    category: 'food',
    title: 'Sizzling Garlic Butter Prawns',
    client: 'Fisherman Wharf',
    city: 'Goa',
    device: 'iPhone 16 Pro 4K 60fps',
    turnaroundMinutes: 8,
    views: '240K',
    reachMultiplier: '+190% Orders',
    audio: 'Trending Goa Vibe Beat',
    gradient: 'from-amber-950 via-zinc-950 to-black',
    tags: ['#GoaFood', '#Seafood'],
  };

  const initialList = [...INITIAL_REELS];
  const updated = addReel(customReel, initialList);

  assert.equal(updated.length, initialList.length + 1);
  assert.equal(updated[0].title, 'Sizzling Garlic Butter Prawns');
  assert.ok(updated[0].id.startsWith('r_'));
  assert.ok(updated[0].createdAt > 0);
});

test('updateReel modifies existing reel fields in place', () => {
  const initialList = [...INITIAL_REELS];
  const targetId = initialList[0].id;
  const updated = updateReel(targetId, { title: 'Updated Molten Lava Cake 4K' }, initialList);

  const found = updated.find((r) => r.id === targetId);
  assert.ok(found);
  assert.equal(found?.title, 'Updated Molten Lava Cake 4K');
});

test('deleteReel removes targeted reel correctly', () => {
  const initialList = [...INITIAL_REELS];
  const targetId = initialList[1].id;
  const updated = deleteReel(targetId, initialList);

  assert.equal(updated.length, initialList.length - 1);
  assert.equal(updated.some((r) => r.id === targetId), false);
});
