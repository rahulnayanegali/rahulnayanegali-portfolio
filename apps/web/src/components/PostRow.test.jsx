import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PostRow from './PostRow';

const blog = { slug: 'test', title: 'Test Post', date: new Date('2026-02-01'), tags: [], readTime: 3, tldr: '', content: '' };

test('renders title', () => {
  render(<MemoryRouter><PostRow blog={blog} index={0} /></MemoryRouter>);
  expect(screen.getByText('Test Post')).toBeInTheDocument();
});

test('renders date as Mon YYYY', () => {
  render(<MemoryRouter><PostRow blog={blog} index={0} /></MemoryRouter>);
  expect(screen.getByText(/Feb 2026/)).toBeInTheDocument();
});

test('href points to /blog/slug', () => {
  render(<MemoryRouter><PostRow blog={blog} index={0} /></MemoryRouter>);
  expect(screen.getByRole('link')).toHaveAttribute('href', '/blog/test');
});
