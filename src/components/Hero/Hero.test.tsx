import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Hero } from './Hero';

describe('Hero', () => {
  it('renders the main heading', () => {
    render(<Hero />);
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Shaping the Future of Manufacturing',
      }),
    ).toBeInTheDocument();
  });

  it('renders the subtitle', () => {
    render(<Hero />);
    expect(
      screen.getByText(/global technology leader/i),
    ).toBeInTheDocument();
  });

  it('renders a call-to-action link', () => {
    render(<Hero />);
    const cta = screen.getByText('Discover Our Solutions');
    expect(cta).toBeInTheDocument();
    expect(cta).toHaveAttribute('href', '#features');
  });
});
