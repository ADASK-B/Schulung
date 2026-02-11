import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Header } from './Header';

describe('Header', () => {
  it('renders the TRUMPF logo link', () => {
    render(<Header />);
    const logoLink = screen.getByLabelText('TRUMPF Home');
    expect(logoLink).toBeInTheDocument();
    expect(logoLink).toHaveAttribute('href', '/');
  });

  it('renders navigation links', () => {
    render(<Header />);
    expect(screen.getByText('Solutions')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });

  it('has an accessible navigation landmark', () => {
    render(<Header />);
    expect(
      screen.getByRole('navigation', { name: 'Main navigation' }),
    ).toBeInTheDocument();
  });
});
