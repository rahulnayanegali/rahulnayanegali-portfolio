import blogs from './blogs';

test('each blog has tags array', () => {
  blogs.forEach(b => expect(Array.isArray(b.tags)).toBe(true));
});

test('each blog has readTime >= 1', () => {
  blogs.forEach(b => expect(b.readTime).toBeGreaterThanOrEqual(1));
});
