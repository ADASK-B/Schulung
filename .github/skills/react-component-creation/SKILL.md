---
name: react-component-creation
description: Guide for creating React components with TypeScript. Use when asked to create new React components or refactor existing ones.
---

# React Component Creation

Follow this process to create well-structured React components:

## 1. Component Structure

Create components in their own folder with this structure:
```
ComponentName/
├── ComponentName.tsx
├── ComponentName.test.tsx
└── ComponentName.module.css (or styles)
```

## 2. TypeScript Interface

Always define Props interface first:
```typescript
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}
```

## 3. Component Implementation

Use functional components with Named Exports:
```typescript
export function Button({ label, onClick, variant = 'primary', disabled = false }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={styles[variant]}
    >
      {label}
    </button>
  );
}
```

## 4. Best Practices

- Use Named Exports (no default exports)
- Destructure props in function signature
- Provide default values for optional props
- Use TypeScript strict mode
- Add proper accessibility attributes (aria-labels, role, etc.)
- Implement error boundaries for complex components
- Use semantic HTML elements

## 5. Hooks Guidelines

- useState for local state
- useEffect for side effects (cleanup function when needed)
- useMemo/useCallback only when performance issues arise
- Custom hooks start with "use" prefix

## 6. Conditional Rendering

Prefer early returns over nested ternaries:
```typescript
if (loading) return <Spinner />;
if (error) return <ErrorMessage error={error} />;
return <Content data={data} />;
```
