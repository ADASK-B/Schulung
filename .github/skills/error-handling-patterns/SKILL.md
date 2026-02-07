---
name: error-handling-patterns
description: Guide for consistent error handling across frontend and backend. Use when implementing error handling logic.
---

# Error Handling Patterns

Follow this guide for consistent and robust error handling:

## 1. Backend: Custom Error Classes

```typescript
// errors/ApiError.ts
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public isOperational = true
  ) {
    super(message);
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export class ValidationError extends ApiError {
  constructor(message: string) {
    super(400, message);
  }
}

export class NotFoundError extends ApiError {
  constructor(resource: string) {
    super(404, `${resource} not found`);
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message = 'Unauthorized') {
    super(401, message);
  }
}
```

## 2. Backend: Global Error Handler

```typescript
// middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../errors/ApiError';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Log error
  console.error('Error:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    path: req.path,
    method: req.method,
  });

  // Handle known errors
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      error: err.message,
    });
  }

  // Handle validation errors (Zod, etc.)
  if (err.name === 'ZodError') {
    return res.status(400).json({
      error: 'Validation failed',
      details: err.issues,
    });
  }

  // Handle unexpected errors
  res.status(500).json({
    error: 'Internal server error',
  });
}

// Register in app
app.use(errorHandler);
```

## 3. Backend: Async Error Wrapper

```typescript
// utils/asyncHandler.ts
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// Usage
app.get('/api/users/:id', asyncHandler(async (req, res) => {
  const user = await getUserById(req.params.id);

  if (!user) {
    throw new NotFoundError('User');
  }

  res.json({ data: user });
}));
```

## 4. Backend: Try-Catch Pattern

```typescript
// Route handler
router.post('/api/users', async (req, res) => {
  try {
    // Validate input
    const validatedData = userSchema.parse(req.body);

    // Business logic
    const user = await createUser(validatedData);

    // Success response
    res.status(201).json({ data: user });
  } catch (error) {
    // Let error handler deal with it
    throw error;
  }
});
```

## 5. Frontend: Error Boundary

```typescript
// components/ErrorBoundary.tsx
import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Send to error tracking service (Sentry, etc.)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div role="alert">
          <h2>Something went wrong</h2>
          <button onClick={() => this.setState({ hasError: false })}>
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Usage
<ErrorBoundary fallback={<ErrorFallback />}>
  <App />
</ErrorBoundary>
```

## 6. Frontend: API Error Handling

```typescript
// services/apiClient.ts
class ApiClient {
  private baseUrl = import.meta.env.VITE_API_URL;

  async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });

      // Handle HTTP errors
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new ApiError(response.status, error.message || 'Request failed');
      }

      return response.json();
    } catch (error) {
      // Network errors
      if (error instanceof TypeError) {
        throw new ApiError(0, 'Network error. Please check your connection.');
      }

      throw error;
    }
  }
}

export const apiClient = new ApiClient();
```

## 7. Frontend: React Query Error Handling

```typescript
// hooks/useUser.ts
import { useQuery } from '@tanstack/react-query';
import { getUserById } from '@/services/userService';

export function useUser(id: string) {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => getUserById(id),
    retry: (failureCount, error) => {
      // Don't retry on 404
      if (error instanceof ApiError && error.statusCode === 404) {
        return false;
      }
      return failureCount < 3;
    },
    onError: (error) => {
      // Show toast notification
      toast.error(error.message);
    },
  });
}

// Component
function UserProfile({ userId }: { userId: string }) {
  const { data, isLoading, error } = useUser(userId);

  if (isLoading) return <LoadingSpinner />;

  if (error) {
    return <ErrorMessage error={error} retry={() => refetch()} />;
  }

  return <div>{data.name}</div>;
}
```

## 8. Frontend: Form Error Handling

```typescript
// Component with form
function LoginForm() {
  const [serverError, setServerError] = useState<string>();
  const { register, handleSubmit, setError, formState: { errors } } = useForm();

  const onSubmit = async (data: FormData) => {
    try {
      setServerError(undefined);
      await loginUser(data);
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.statusCode === 400) {
          // Field-specific error
          setError('email', { message: 'Invalid email or password' });
        } else {
          // General error
          setServerError(error.message);
        }
      } else {
        setServerError('An unexpected error occurred');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {serverError && (
        <div role="alert" className="error-banner">
          {serverError}
        </div>
      )}

      <input {...register('email')} />
      {errors.email && <span role="alert">{errors.email.message}</span>}

      <button type="submit">Login</button>
    </form>
  );
}
```

## 9. User-Friendly Error Messages

```typescript
// utils/errorMessages.ts
export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    switch (error.statusCode) {
      case 400:
        return 'Please check your input and try again.';
      case 401:
        return 'Please log in to continue.';
      case 403:
        return 'You don\'t have permission to do that.';
      case 404:
        return 'The requested resource was not found.';
      case 429:
        return 'Too many requests. Please try again later.';
      case 500:
        return 'Something went wrong. Please try again.';
      default:
        return error.message;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred.';
}
```

## 10. Toast Notifications

```typescript
// utils/toast.ts
import { toast as sonnerToast } from 'sonner';

export const toast = {
  success: (message: string) => {
    sonnerToast.success(message);
  },

  error: (error: unknown) => {
    const message = getErrorMessage(error);
    sonnerToast.error(message);
  },

  promise: async <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error?: string;
    }
  ) => {
    return sonnerToast.promise(promise, messages);
  },
};

// Usage
try {
  await updateUser(data);
  toast.success('Profile updated successfully');
} catch (error) {
  toast.error(error);
}
```

## 11. Retry Logic

```typescript
// utils/retry.ts
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  delayMs = 1000
): Promise<T> {
  let lastError: Error;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      // Don't retry on client errors (400-499)
      if (error instanceof ApiError && error.statusCode >= 400 && error.statusCode < 500) {
        throw error;
      }

      if (i < maxRetries - 1) {
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, delayMs * Math.pow(2, i)));
      }
    }
  }

  throw lastError!;
}

// Usage
const data = await retryWithBackoff(() => fetchUserData(id));
```

## 12. Error Logging

```typescript
// utils/logger.ts
export const logger = {
  error: (message: string, context?: Record<string, any>) => {
    console.error(message, context);

    // Send to error tracking (e.g., Sentry)
    if (import.meta.env.PROD) {
      // Sentry.captureException(new Error(message), { extra: context });
    }
  },
};

// Usage
catch (error) {
  logger.error('Failed to fetch user', {
    userId,
    error: error.message,
    timestamp: new Date().toISOString(),
  });
}
```

## 13. Error Handling Checklist

### Backend
- [ ] Custom error classes for different error types
- [ ] Global error handler middleware
- [ ] Async error wrapper for routes
- [ ] Proper HTTP status codes
- [ ] Don't expose internal errors to clients
- [ ] Log errors with context
- [ ] Validate inputs before processing

### Frontend
- [ ] Error boundaries for React components
- [ ] API error handling with proper types
- [ ] User-friendly error messages
- [ ] Toast notifications for errors
- [ ] Retry logic for transient failures
- [ ] Loading and error states in UI
- [ ] Form validation errors displayed clearly
- [ ] Error logging to monitoring service

## 14. Don'ts

❌ Swallow errors silently: `catch (e) {}`
❌ Expose stack traces to users
❌ Use generic "Error occurred" without context
❌ Retry on 4xx errors (client errors)
❌ Log sensitive data (passwords, tokens)
❌ Let errors crash the app
❌ Use alert() for errors
