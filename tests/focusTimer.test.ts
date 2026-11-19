import test from 'node:test';
import assert from 'node:assert/strict';
import { secondsUntil, formatDuration } from '../src/lib/focusTimer.ts';

test('deadline timing catches up after a delayed background callback', () => {
  const start = 1_000_000;
  const deadline = start + 25 * 60_000;
  assert.equal(secondsUntil(deadline, start), 1500);
  assert.equal(secondsUntil(deadline, start + 123_400), 1377);
  assert.equal(secondsUntil(deadline, deadline - 1), 1);
  assert.equal(secondsUntil(deadline, deadline + 90_000), 0);
});

test('pause and resume preserve remaining time without counting the pause', () => {
  const start = 1_000_000;
  const remaining = secondsUntil(start + 15 * 60_000, start + 30_000);
  const resumeAt = start + 10 * 60_000;
  const resumedDeadline = resumeAt + remaining * 1000;
  assert.equal(secondsUntil(resumedDeadline, resumeAt), 870);
  assert.equal(secondsUntil(resumedDeadline, resumeAt + 60_000), 810);
});

test('timer and media labels handle zero, minutes and unavailable metadata', () => {
  assert.equal(formatDuration(1500), '25:00');
  assert.equal(formatDuration(900), '15:00');
  assert.equal(formatDuration(3000), '50:00');
  assert.equal(formatDuration(61.5), '01:01');
  assert.equal(formatDuration(-1), '00:00');
  assert.equal(formatDuration(Infinity), '00:00');
  assert.equal(formatDuration(NaN), '00:00');
});
