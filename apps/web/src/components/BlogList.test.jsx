import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';

vi.mock('../blogs/blogs', () => ({
  default: [
    { slug: 'a', title: 'Post A', date: new Date('2026-03-01'), tldr: 'tldr a', tags: [], readTime: 3, content: '' },
    { slug: 'b', title: 'Post B', date: new Date('2026-02-01'), tldr: 'tldr b', tags: [], readTime: 2, content: '' },
  ],
}));

const { default: BlogList } = await import('./BlogList');

test('first post renders as featured card with LATEST badge', () => {
  render(<MemoryRouter><BlogList /></MemoryRouter>);
  expect(screen.getByText(/LATEST/i)).toBeInTheDocument();
  expect(screen.getByText('Post A')).toBeInTheDocument();
});

test('remaining posts render as list rows without badge', () => {
  render(<MemoryRouter><BlogList /></MemoryRouter>);
  expect(screen.getByText('Post B')).toBeInTheDocument();
  expect(screen.getAllByText(/LATEST/i)).toHaveLength(1);
});

test('shows ALL POSTS section header', () => {
  render(<MemoryRouter><BlogList /></MemoryRouter>);
  expect(screen.getByText(/ALL POSTS/i)).toBeInTheDocument();
});
