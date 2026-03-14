import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import DarkHeader from './DarkHeader';

const renderHeader = () =>
  render(
    <MemoryRouter>
      <DarkHeader />
    </MemoryRouter>
  );

test('cursor span has aria-hidden and cursor class', () => {
  renderHeader();
  const cursor = document.querySelector('.cursor');
  expect(cursor).toBeInTheDocument();
  expect(cursor).toHaveAttribute('aria-hidden', 'true');
});

test('gt prompt has aria-hidden', () => {
  renderHeader();
  // Both aria-hidden spans: ">" and "_"
  const hidden = document.querySelectorAll('[aria-hidden="true"]');
  expect(hidden.length).toBeGreaterThanOrEqual(2);
});

test('Resume link opens in new tab', () => {
  renderHeader();
  const resume = screen.getByRole('link', { name: /resume/i });
  expect(resume).toHaveAttribute('target', '_blank');
  expect(resume).toHaveAttribute('rel', 'noopener noreferrer');
});

test('Archive link points to /archived', () => {
  renderHeader();
  const archive = screen.getByRole('link', { name: /archive/i });
  expect(archive).toHaveAttribute('href', '/archived');
});
