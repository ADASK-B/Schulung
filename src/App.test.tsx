import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { App } from './App';

describe('App', () => {
  it('renders the header with TRUMPF branding', () => {
    render(<App />);
    expect(screen.getByLabelText('TRUMPF Home')).toBeInTheDocument();
  });

  it('renders the hero section', () => {
    render(<App />);
    expect(
      screen.getByText('Shaping the Future of Manufacturing'),
    ).toBeInTheDocument();
  });

  it('renders the features section', () => {
    render(<App />);
    expect(screen.getByText('Laser Technology')).toBeInTheDocument();
    expect(screen.getByText('Machine Tools')).toBeInTheDocument();
    expect(screen.getByText('Smart Factory')).toBeInTheDocument();
  });

  it('renders the footer with copyright', () => {
    render(<App />);
    const year = new Date().getFullYear();
    expect(
      screen.getByText(`© ${year} TRUMPF. All rights reserved.`),
    ).toBeInTheDocument();
  });

  it('uses semantic HTML with main element', () => {
    render(<App />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('has accessible navigation', () => {
    render(<App />);
    expect(
      screen.getByRole('navigation', { name: 'Main navigation' }),
    ).toBeInTheDocument();
  });
});
