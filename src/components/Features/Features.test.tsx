import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Features } from './Features';

describe('Features', () => {
  it('renders the section heading', () => {
    render(<Features />);
    expect(
      screen.getByRole('heading', { level: 2, name: 'Our Solutions' }),
    ).toBeInTheDocument();
  });

  it('renders all three feature cards', () => {
    render(<Features />);
    const articles = screen.getAllByRole('article');
    expect(articles).toHaveLength(3);
  });

  it('renders feature titles', () => {
    render(<Features />);
    expect(screen.getByText('Laser Technology')).toBeInTheDocument();
    expect(screen.getByText('Machine Tools')).toBeInTheDocument();
    expect(screen.getByText('Smart Factory')).toBeInTheDocument();
  });

  it('has an accessible section label', () => {
    render(<Features />);
    expect(
      screen.getByLabelText('Our solutions'),
    ).toBeInTheDocument();
  });
});
