---
name: project-architecture
description: Guide for project structure and architectural decisions. Use when setting up new projects or organizing code structure.
---

# Project Architecture

Follow this guide for consistent project structure and architectural decisions:

## 1. Folder Structure

```
src/
├── components/          # Reusable UI components
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.test.tsx
│   │   └── Button.module.css
│   └── Card/
│       └── ...
├── features/            # Feature-based modules
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── types.ts
│   └── dashboard/
│       └── ...
├── pages/               # Page-level components (routes)
│   ├── HomePage.tsx
│   ├── DashboardPage.tsx
│   └── ...
├── layouts/             # Layout components
│   ├── MainLayout.tsx
│   └── AuthLayout.tsx
├── hooks/               # Shared custom hooks
│   ├── useAuth.ts
│   └── useFetch.ts
├── services/            # API calls and external services
│   ├── api.ts
│   └── authService.ts
├── utils/               # Helper functions
│   ├── formatDate.ts
│   └── validation.ts
├── types/               # Shared TypeScript types
│   ├── user.ts
│   └── api.ts
├── constants/           # App-wide constants
│   └── config.ts
├── styles/              # Global styles
│   ├── globals.css
│   └── variables.css
└── assets/              # Static assets
    ├── images/
    └── icons/
```

## 2. Component Organization

### ✅ DO: Component folder with co-located files
```
Button/
├── Button.tsx           # Component logic
├── Button.test.tsx      # Tests
├── Button.module.css    # Styles
├── Button.stories.tsx   # Storybook (optional)
└── index.ts             # Re-export
```

### ❌ DON'T: Flat structure
```
components/
├── Button.tsx
├── ButtonStyles.css
├── ButtonTest.tsx       # Inconsistent naming
└── Card.tsx
```

## 3. Style Organization

### ❌ NEVER: Inline Styles (Security Risk)
```typescript
// CSP Violation! Allows XSS attacks
<div style={{ color: userInput }}>Content</div>
```

### ✅ OPTION 1: CSS Modules (Recommended)
```typescript
// Button.module.css
import styles from './Button.module.css';

<button className={styles.primary}>Click</button>
```

**Why CSS Modules:**
- Scoped styles (no conflicts)
- CSP-compliant
- Type-safe with TypeScript
- No runtime overhead

### ✅ OPTION 2: Tailwind CSS
```typescript
<button className="px-4 py-2 bg-blue-500 text-white rounded">
  Click
</button>
```

**Why Tailwind:**
- Utility-first approach
- CSP-compliant
- Small bundle size (tree-shaking)
- Consistent design system

### ✅ OPTION 3: Styled-Components (with CSP nonce)
```typescript
import styled from 'styled-components';

const Button = styled.button`
  padding: 0.5rem 1rem;
  background: blue;
`;
```

**Only if:** You configure CSP nonce correctly!

### ⚠️ Inline Styles: Only for Dynamic Values
```typescript
// OK: Truly dynamic value that can't be in CSS
<div style={{ width: `${percent}%` }}>Progress</div>

// Better: Use CSS variables
<div
  className={styles.progress}
  style={{ '--progress': `${percent}%` } as React.CSSProperties}
/>
```

## 4. Feature-Based Structure

Group by feature, not by file type:

### ✅ DO: Feature-based
```
features/
└── user-profile/
    ├── components/
    │   ├── ProfileCard.tsx
    │   └── EditProfileForm.tsx
    ├── hooks/
    │   └── useUserProfile.ts
    ├── services/
    │   └── profileApi.ts
    └── types.ts
```

### ❌ DON'T: Type-based (for large apps)
```
src/
├── components/         # 100+ files mixed together
├── hooks/              # Hard to find related code
└── services/
```

## 5. Import Organization

```typescript
// 1. External dependencies
import React, { useState } from 'react';
import { useRouter } from 'next/router';

// 2. Internal absolute imports
import { Button } from '@/components/Button';
import { useAuth } from '@/hooks/useAuth';

// 3. Relative imports (same feature)
import { ProfileCard } from './ProfileCard';
import type { UserProfile } from './types';

// 4. Styles (last)
import styles from './Profile.module.css';
```

## 6. API Service Layer

**❌ DON'T: API calls in components**
```typescript
function UserProfile() {
  const [user, setUser] = useState();

  useEffect(() => {
    fetch('/api/users/123').then(/* ... */);  // ❌ Bad
  }, []);
}
```

**✅ DO: Separate service layer**
```typescript
// services/userService.ts
export async function getUserProfile(id: string): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  if (!response.ok) throw new Error('Failed to fetch user');
  return response.json();
}

// Component
function UserProfile() {
  const { data, isLoading } = useQuery({
    queryKey: ['user', id],
    queryFn: () => getUserProfile(id),
  });
}
```

## 7. Environment Configuration

```typescript
// config/env.ts
export const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
} as const;

// ❌ DON'T: Hardcode URLs everywhere
// ✅ DO: Single source of truth
```

## 8. Type Organization

```typescript
// types/user.ts - Domain types
export interface User {
  id: string;
  email: string;
}

// types/api.ts - API types
export interface ApiResponse<T> {
  data: T;
  error?: string;
}

// Component-specific types: Co-located
// Button/Button.tsx
interface ButtonProps { /* ... */ }
```

## 9. State Management

### Small Apps: React Context
```
contexts/
├── AuthContext.tsx
└── ThemeContext.tsx
```

### Medium Apps: Zustand
```
stores/
├── authStore.ts
└── cartStore.ts
```

### Large Apps: Redux Toolkit
```
store/
├── slices/
│   ├── authSlice.ts
│   └── userSlice.ts
└── store.ts
```

## 10. Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `UserProfile.tsx` |
| Hooks | camelCase + "use" | `useAuth.ts` |
| Utils | camelCase | `formatDate.ts` |
| Constants | UPPER_SNAKE_CASE | `API_BASE_URL` |
| Types | PascalCase | `User`, `ApiResponse` |
| CSS Modules | camelCase | `styles.primaryButton` |
| Files | kebab-case or PascalCase | `user-profile.tsx` |

## 11. Barrel Exports (index.ts)

```typescript
// components/Button/index.ts
export { Button } from './Button';
export type { ButtonProps } from './Button';

// Now import like:
import { Button } from '@/components/Button';
```

## 12. Security-Critical Decisions

### ✅ DO:
- Use CSS Modules or Tailwind (not inline styles)
- Configure CSP headers
- Store secrets in env variables only
- Validate ALL inputs
- Use HTTPS only

### ❌ DON'T:
- Inline styles (CSP violation)
- Store secrets in code
- Trust client-side validation alone
- Commit .env files

## 13. Architecture Principles

1. **Separation of Concerns** - Component logic ≠ Business logic
2. **DRY** (Don't Repeat Yourself) - Extract reusable code
3. **Single Responsibility** - One component, one purpose
4. **Co-location** - Keep related files together
5. **Type Safety** - Use TypeScript strictly
6. **Testability** - Write testable code
7. **Security First** - Consider security in architecture

## 14. Decision Checklist

When adding new code, ask:
- [ ] Is it in the right folder? (feature vs shared)
- [ ] Are styles in CSS Modules/Tailwind? (not inline)
- [ ] Are API calls in service layer?
- [ ] Are types properly defined?
- [ ] Is it co-located with related code?
- [ ] Is it easily testable?
- [ ] Does it follow naming conventions?
- [ ] Is it secure? (no secrets, proper validation)
