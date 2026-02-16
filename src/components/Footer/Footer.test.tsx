import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Footer } from './Footer';

describe('Footer', () => {
  it('renders the TRUMPF brand name', () => {
    render(<Footer />);
    expect(screen.getByText('TRUMPF')).toBeInTheDocument();
  });

  it('renders the company address', () => {
    render(<Footer />);
    expect(
      screen.getByText('TRUMPF GmbH + Co. KG'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('71254 Ditzingen, Germany'),
    ).toBeInTheDocument();
  });

  it('renders copyright with current year', () => {
    render(<Footer />);
    const year = new Date().getFullYear();
    expect(
      screen.getByText(`© ${year} TRUMPF. All rights reserved.`),
    ).toBeInTheDocument();
  });

  it('renders the tagline', () => {
    render(<Footer />);
    expect(
      screen.getByText('Technology with a passion for perfection.'),
    ).toBeInTheDocument();
  });
});
