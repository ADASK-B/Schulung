---
name: security-audit
description: Checklist for identifying and fixing common web security vulnerabilities (OWASP Top 10). Use when reviewing code for security issues.
---

# Security Audit

Follow this checklist to identify and fix common security vulnerabilities:

## 1. Cross-Site Scripting (XSS)

✅ **Check:**
- Never use `dangerouslySetInnerHTML` without sanitization
- Sanitize user input before rendering
- Use Content Security Policy (CSP) headers
- Escape output in templates

```typescript
// ❌ Dangerous
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// ✅ Safe - React escapes by default
<div>{userInput}</div>

// ✅ If HTML needed, sanitize first
import DOMPurify from 'dompurify';
<div dangerouslySetInnerHTML={{
  __html: DOMPurify.sanitize(userInput)
}} />
```

## 2. Cross-Site Request Forgery (CSRF)

✅ **Check:**
- Use CSRF tokens for state-changing requests
- Verify Origin/Referer headers
- Use SameSite cookie attribute
- Require authentication for sensitive actions

```typescript
// Backend: CSRF token validation
import csrf from 'csurf';
const csrfProtection = csrf({ cookie: true });

app.post('/api/transfer', csrfProtection, (req, res) => {
  // Process request
});

// Frontend: Include CSRF token
<form>
  <input type="hidden" name="_csrf" value={csrfToken} />
  {/* ... */}
</form>
```

## 3. SQL Injection

✅ **Check:**
- Always use parameterized queries
- Never concatenate SQL strings with user input
- Use ORM with proper escaping (Prisma)
- Validate and sanitize all inputs

```typescript
// ❌ Vulnerable
const query = `SELECT * FROM users WHERE email = '${userEmail}'`;

// ✅ Safe - Prisma parameterized query
const user = await prisma.user.findUnique({
  where: { email: userEmail }
});

// ✅ Safe - Raw query with parameters
const users = await prisma.$queryRaw`
  SELECT * FROM users WHERE email = ${userEmail}
`;
```

## 4. Authentication & Session Management

✅ **Check:**
- Hash passwords with bcrypt (>= 10 rounds)
- Use HTTPS only
- Set secure, HTTP-only cookies
- Implement session timeout
- Require re-authentication for sensitive actions
- Implement account lockout after failed attempts

```typescript
// Cookie configuration
res.cookie('token', refreshToken, {
  httpOnly: true,          // Prevent XSS
  secure: true,            // HTTPS only
  sameSite: 'strict',      // CSRF protection
  maxAge: 7 * 24 * 60 * 60 * 1000,
});
```

## 5. Sensitive Data Exposure

✅ **Check:**
- Never log passwords, tokens, or credit cards
- Don't expose API keys in frontend code
- Use environment variables for secrets
- Encrypt sensitive data at rest
- Use HTTPS for all data transmission
- Remove sensitive data from error messages

```typescript
// ❌ Bad - Secret exposed
const apiKey = "sk_live_abc123";

// ✅ Good - Use environment variables
const apiKey = process.env.API_KEY;

// ❌ Bad - Sensitive data in logs
console.log("User login:", { email, password });

// ✅ Good - No sensitive data
console.log("User login:", { email });
```

## 6. Security Headers

✅ **Check:**
- Content-Security-Policy (CSP)
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- Strict-Transport-Security (HSTS)
- X-XSS-Protection: 1; mode=block

```typescript
// Express.js
import helmet from 'helmet';
app.use(helmet());

// Or manually
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('Content-Security-Policy', "default-src 'self'");
  next();
});
```

## 7. Input Validation

✅ **Check:**
- Validate all user inputs (client AND server)
- Use allowlist, not blocklist
- Validate data types, lengths, formats
- Sanitize before use
- Reject invalid input

```typescript
import { z } from 'zod';

const userSchema = z.object({
  email: z.string().email().max(255),
  age: z.number().int().min(0).max(150),
  role: z.enum(['user', 'admin']), // Allowlist
});

// Validate
try {
  const validData = userSchema.parse(req.body);
} catch (error) {
  return res.status(400).json({ error: 'Invalid input' });
}
```

## 8. Rate Limiting

✅ **Check:**
- Implement rate limiting on all endpoints
- Stricter limits on authentication endpoints
- Rate limit by IP and/or user
- Return 429 Too Many Requests

```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: 'Too many requests, please try again later',
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // Only 5 login attempts
});

app.use('/api/', limiter);
app.use('/api/auth/login', authLimiter);
```

## 9. Dependency Security

✅ **Check:**
- Regular `npm audit` or `pnpm audit`
- Keep dependencies updated
- Use Dependabot or Renovate
- Review dependency licenses
- Minimize dependencies

```bash
# Check for vulnerabilities
pnpm audit

# Fix automatically
pnpm audit --fix

# Update dependencies
pnpm update --latest
```

## 10. Authorization

✅ **Check:**
- Verify user permissions on every request
- Never trust client-side authorization
- Implement least privilege principle
- Check ownership before modifying resources

```typescript
// Middleware: Check if user owns resource
async function requireOwnership(req, res, next) {
  const post = await prisma.post.findUnique({
    where: { id: req.params.id }
  });

  if (!post || post.userId !== req.userId) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  next();
}

app.delete('/api/posts/:id', authenticate, requireOwnership, async (req, res) => {
  // Delete post
});
```

## 11. Error Handling

✅ **Check:**
- Don't expose stack traces to users
- Log errors securely
- Use generic error messages
- Don't reveal system information

```typescript
// ❌ Bad - Exposes internal details
res.status(500).json({
  error: error.stack,
  query: sqlQuery
});

// ✅ Good - Generic message
res.status(500).json({
  error: 'Internal server error'
});

// Log detailed error server-side
logger.error('Database error', {
  error: error.message,
  userId: req.userId
});
```

## 12. File Upload Security

✅ **Check:**
- Validate file types (magic bytes, not just extension)
- Limit file size
- Scan for malware
- Store outside webroot
- Generate random filenames

```typescript
const upload = multer({
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Invalid file type'));
    }
    cb(null, true);
  },
});
```

## 13. Security Checklist

- [ ] All inputs validated and sanitized
- [ ] SQL queries parameterized
- [ ] Passwords hashed with bcrypt
- [ ] HTTPS enforced
- [ ] Security headers configured
- [ ] CSRF protection enabled
- [ ] Rate limiting implemented
- [ ] No secrets in code
- [ ] Dependencies up to date
- [ ] Error messages generic
- [ ] Authentication on protected routes
- [ ] Authorization checked server-side
- [ ] Session timeout configured
- [ ] Audit logs for sensitive actions
- [ ] Content Security Policy configured
