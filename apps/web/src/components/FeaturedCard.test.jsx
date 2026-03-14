import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import FeaturedCard from './FeaturedCard';

const blog = {
  slug: 'plan',
  title: 'Portfolio Redesign',
  date: new Date('2026-03-13'),
  tldr: 'A rethink.',
  tags: ['React', 'Architecture'],
  readTime: 5,
  content: '',
};

test('renders LATEST badge', () => {
  render(<MemoryRouter><FeaturedCard blog={blog} /></MemoryRouter>);
  expect(screen.getByText(/LATEST/i)).toBeInTheDocument();
});

test('renders all tags as chips', () => {
  render(<MemoryRouter><FeaturedCard blog={blog} /></MemoryRouter>);
  expect(screen.getByText('React')).toBeInTheDocument();
  expect(screen.getByText('Architecture')).toBeInTheDocument();
});

test('renders read time', () => {
  render(<MemoryRouter><FeaturedCard blog={blog} /></MemoryRouter>);
  expect(screen.getByText(/5 min/)).toBeInTheDocument();
});

test('card link points to /blog/slug', () => {
  render(<MemoryRouter><FeaturedCard blog={blog} /></MemoryRouter>);
  expect(screen.getByRole('link')).toHaveAttribute('href', '/blog/plan');
});
