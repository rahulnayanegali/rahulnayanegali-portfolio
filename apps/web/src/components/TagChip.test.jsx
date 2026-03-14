import { render, screen } from '@testing-library/react';
import TagChip from './TagChip';

test('renders label text', () => {
  render(<TagChip label="React" />);
  expect(screen.getByText('React')).toBeInTheDocument();
});

test('uses Space Mono font class', () => {
  const { container } = render(<TagChip label="React" />);
  expect(container.firstChild.className).toMatch(/font-mono/);
});
