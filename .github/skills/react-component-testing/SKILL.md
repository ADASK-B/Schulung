---
name: react-component-testing
description: Guide for testing React components with Vitest and React Testing Library. Use when asked to write tests for React components.
---

# React Component Testing

Follow this process to write comprehensive React component tests:

## 1. Test File Setup

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Button } from './Button';
```

## 2. Test Structure

Use describe blocks for grouping:
```typescript
describe('Button', () => {
  it('renders with the correct label', () => {
    render(<Button label="Click me" onClick={() => {}} />);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });
});
```

## 3. Test User Interactions

```typescript
it('calls onClick when clicked', async () => {
  const handleClick = vi.fn();
  const user = userEvent.setup();

  render(<Button label="Click" onClick={handleClick} />);
  await user.click(screen.getByRole('button'));

  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

## 4. Testing Guidelines

- **Test behavior, not implementation** - avoid testing state directly
- **Use accessible queries** - prefer getByRole over getByTestId
- **Test user flows** - test how users interact with the component
- **Mock external dependencies** - APIs, contexts, external libraries
- **Test error states** - not just happy paths
- **Use data-testid sparingly** - only when role/label queries don't work

## 5. Query Priority

1. `getByRole` - most accessible
2. `getByLabelText` - for forms
3. `getByPlaceholderText` - for inputs
4. `getByText` - for non-interactive elements
5. `getByTestId` - last resort

## 6. Async Testing

```typescript
it('displays data after loading', async () => {
  render(<UserProfile userId="123" />);

  expect(screen.getByText(/loading/i)).toBeInTheDocument();

  const username = await screen.findByText(/john doe/i);
  expect(username).toBeInTheDocument();
});
```

## 7. Coverage Goals

- All user interactions
- Loading states
- Error states
- Edge cases (empty data, null values)
- Accessibility (keyboard navigation, screen reader support)
