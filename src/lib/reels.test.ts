import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import {
  getReels,
  saveReels,
  appendReel,
  updateReelById,
  deleteReelById,
  Reel,
} from './reels';

const storage = new Map<string, string>();
const mockLocalStorage = {
  getItem: (key: string) => storage.get(key) ?? null,
  setItem: (key: string, val: string) => storage.set(key, val),
  removeItem: (key: string) => storage.delete(key),
  clear: () => storage.clear(),
};

(globalThis as any).window = {
  localStorage: mockLocalStorage,
};
(globalThis as any).localStorage = mockLocalStorage;

beforeEach(() => {
  storage.clear();
});

test('getReels returns default reels when storage is empty', () => {
  const reels = getReels();
  assert.ok(Array.isArray(reels));
  assert.ok(reels.length > 0);
  assert.equal(typeof reels[0].id, 'string');
  assert.equal(typeof reels[0].title, 'string');
  assert.equal(typeof reels[0].thumbnail, 'string');
});

test('saveReels persists items and getReels retrieves them', () => {
  const customReels: Reel[] = [
    {
      id: 'test-1',
      title: 'Coffee Sizzle',
      thumbnail: 'https://example.com/coffee.jpg',
      views: '100K',
      order: 1,
      isActive: true,
    },
    {
      id: 'test-2',
      title: 'Hidden Sangeet',
      thumbnail: 'https://example.com/sangeet.jpg',
      order: 2,
      isActive: false,
    },
  ];

  const result = saveReels(customReels);
  assert.equal(result.ok, true);
  const loaded = getReels();

  assert.equal(loaded.length, 2);
  assert.equal(loaded[0].title, 'Coffee Sizzle');
  assert.equal(loaded[1].isActive, false);
});

test('appendReel strictly appends new Google Drive / YouTube reels without overwriting existing rows', () => {
  const baseCount = getReels().length;

  const first = appendReel({
    title: 'Drive Wedding Highlight',
    thumbnail: '',
    videoUrl: 'https://drive.google.com/file/d/1aBcDeFgHiJkLmNoPqRsTuVwXyZ123456/view?usp=sharing',
    views: '420K views',
    location: 'Jaipur',
  });

  assert.equal(first.saveResult.ok, true);
  assert.equal(first.updatedList.length, baseCount + 1);
  assert.ok(first.reel.thumbnail.includes('drive.google.com/thumbnail?id=1aBcDeFgHiJkLmNoPqRsTuVwXyZ123456'));

  const second = appendReel({
    title: 'YouTube Cafe Sizzle',
    thumbnail: '',
    videoUrl: 'https://www.youtube.com/shorts/dQw4w9WgXcQ',
    views: '210K views',
    location: 'Mumbai',
  });

  assert.equal(second.updatedList.length, baseCount + 2);
  assert.equal(second.reel.thumbnail, 'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg');

  const persisted = getReels();
  assert.equal(persisted.length, baseCount + 2);
  assert.ok(persisted.some((r) => r.title === 'Drive Wedding Highlight'));
  assert.ok(persisted.some((r) => r.title === 'YouTube Cafe Sizzle'));
});

test('updateReelById updates ONLY the matching reel row and leaves all other rows intact', () => {
  const initial = getReels();
  const target = initial[0];
  const other = initial[1];

  const { reel, updatedList } = updateReelById(target.id, {
    title: 'Updated Lava Sizzle 4K',
    videoUrl: 'https://youtu.be/dQw4w9WgXcQ',
  });

  assert.ok(reel);
  assert.equal(updatedList.length, initial.length);
  assert.equal(updatedList[0].title, 'Updated Lava Sizzle 4K');
  assert.equal(updatedList[0].videoUrl, 'https://youtu.be/dQw4w9WgXcQ');
  assert.deepEqual(updatedList[1], other);
});

test('deleteReelById removes only the matching row and re-indexes remaining orders', () => {
  const initial = getReels();
  const removedId = initial[1].id;
  const { updatedList } = deleteReelById(removedId);

  assert.equal(updatedList.length, initial.length - 1);
  assert.equal(updatedList.some((r) => r.id === removedId), false);
  assert.equal(updatedList[0].order, 1);
  assert.equal(updatedList[1].order, 2);
});
