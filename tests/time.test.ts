import test from 'node:test';
import assert from 'node:assert/strict';
import { formatDuration } from '../src/lib/time.ts';

test('media labels handle zero, minutes and unavailable metadata', () => {
  assert.equal(formatDuration(0), '00:00');
  assert.equal(formatDuration(1500), '25:00');
  assert.equal(formatDuration(61.5), '01:01');
  assert.equal(formatDuration(-1), '00:00');
  assert.equal(formatDuration(Infinity), '00:00');
  assert.equal(formatDuration(NaN), '00:00');
});
