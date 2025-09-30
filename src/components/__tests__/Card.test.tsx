import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Card from '../common/Card';

describe('Card Component', () => {
  it('renders with default props', () => {
    render(<Card>Card content</Card>);
    const card = screen.getByText('Card content');
    expect(card).toBeInTheDocument();
    expect(card).toBeInTheDocument();
  });

  it('renders with different variants', () => {
    const { rerender } = render(<Card variant="default">Default</Card>);
    expect(screen.getByText('Default')).toHaveStyle('background: #2a2a2a');

    rerender(<Card variant="glass">Glass</Card>);
    expect(screen.getByText('Glass')).toHaveStyle('background: rgba(42, 42, 42, 0.8)');

    rerender(<Card variant="elevated">Elevated</Card>);
    expect(screen.getByText('Elevated')).toHaveStyle('background: #2a2a2a');

    rerender(<Card variant="outlined">Outlined</Card>);
    expect(screen.getByText('Outlined')).toHaveStyle('background: transparent');
  });

  it('renders with different padding sizes', () => {
    const { rerender } = render(<Card padding="none">No padding</Card>);
    expect(screen.getByText('No padding')).toHaveStyle('padding: 0');

    rerender(<Card padding="small">Small padding</Card>);
    expect(screen.getByText('Small padding')).toHaveStyle('padding: 12px');

    rerender(<Card padding="large">Large padding</Card>);
    expect(screen.getByText('Large padding')).toHaveStyle('padding: 32px');
  });

  it('applies hoverable styles when hoverable is true', () => {
    render(<Card hoverable>Hoverable card</Card>);
    const card = screen.getByText('Hoverable card');
    expect(card).toHaveStyle('cursor: pointer');
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Card onClick={handleClick}>Clickable card</Card>);
    
    const card = screen.getByText('Clickable card');
    expect(card).toHaveStyle('cursor: pointer');
  });

  it('applies custom className', () => {
    render(<Card className="custom-card">Custom card</Card>);
    expect(screen.getByText('Custom card')).toHaveClass('custom-card');
  });

  it('renders children correctly', () => {
    render(
      <Card>
        <h2>Card Title</h2>
        <p>Card content</p>
        <button>Action</button>
      </Card>
    );
    
    expect(screen.getByRole('heading', { name: 'Card Title' })).toBeInTheDocument();
    expect(screen.getByText('Card content')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
  });
});