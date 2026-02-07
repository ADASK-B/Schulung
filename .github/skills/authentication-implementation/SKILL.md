---
name: authentication-implementation
description: Guide for implementing secure authentication with JWT and session management. Use when adding authentication to an application.
---

# Authentication Implementation

Follow this process to implement secure authentication:

## 1. Password Hashing

Use bcrypt for password hashing:
```typescript
import bcrypt from 'bcrypt';

// Register
const hashedPassword = await bcrypt.hash(password, 10);
await db.user.create({
  data: { email, password: hashedPassword },
});

// Login
const user = await db.user.findUnique({ where: { email } });
const isValid = await bcrypt.compare(password, user.password);
```

## 2. JWT Token Generation

```typescript
import jwt from 'jsonwebtoken';

function generateTokens(userId: string) {
  const accessToken = jwt.sign(
    { userId },
    process.env.JWT_SECRET!,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
}
```

## 3. Authentication Middleware

```typescript
import { Request, Response, NextFunction } from 'express';

interface AuthRequest extends Request {
  userId?: string;
}

export async function authenticate(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    req.userId = payload.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}
```

## 4. Login Endpoint

```typescript
router.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  // 1. Find user
  const user = await db.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // 2. Verify password
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // 3. Generate tokens
  const { accessToken, refreshToken } = generateTokens(user.id);

  // 4. Set HTTP-only cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  // 5. Return access token
  res.json({ accessToken, user: { id: user.id, email: user.email } });
});
```

## 5. Logout Endpoint

```typescript
router.post('/api/auth/logout', (req, res) => {
  res.clearCookie('refreshToken');
  res.json({ message: 'Logged out successfully' });
});
```

## 6. Token Refresh

```typescript
router.post('/api/auth/refresh', async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ error: 'Refresh token required' });
  }

  try {
    const payload = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET!
    ) as { userId: string };

    const { accessToken } = generateTokens(payload.userId);
    res.json({ accessToken });
  } catch (error) {
    res.status(401).json({ error: 'Invalid refresh token' });
  }
});
```

## 7. Frontend Integration (React)

```typescript
// Auth context
const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    setToken(data.accessToken);
    setUser(data.user);
  };

  return (
    <AuthContext.Provider value={{ user, token, login }}>
      {children}
    </AuthContext.Provider>
  );
}
```

## 8. Security Checklist

- ✅ Hash passwords with bcrypt (salt rounds >= 10)
- ✅ Use HTTPS in production
- ✅ Set HTTP-only cookies for refresh tokens
- ✅ Short expiry for access tokens (15min)
- ✅ Implement rate limiting on auth endpoints
- ✅ Validate and sanitize all inputs
- ✅ Use CSRF protection
- ✅ Implement account lockout after failed attempts
- ❌ Never log passwords or tokens
- ❌ Never store tokens in localStorage (XSS risk)
- ❌ Don't expose user existence in error messages
