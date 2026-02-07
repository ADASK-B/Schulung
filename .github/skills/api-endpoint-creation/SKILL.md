---
name: api-endpoint-creation
description: Guide for creating RESTful API endpoints with validation and error handling. Use when implementing backend API routes.
---

# API Endpoint Creation

Follow this process to create robust API endpoints:

## 1. Endpoint Structure

```typescript
// Example: Express.js endpoint
import { Router } from 'express';
import { z } from 'zod';

const router = Router();

router.post('/api/users', async (req, res) => {
  try {
    // 1. Validate input
    // 2. Business logic
    // 3. Database operation
    // 4. Return response
  } catch (error) {
    // 5. Error handling
  }
});
```

## 2. Input Validation

Use Zod for schema validation:
```typescript
const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(100),
  age: z.number().int().positive().optional(),
});

// In route handler
const validatedData = createUserSchema.parse(req.body);
```

## 3. HTTP Status Codes

Use appropriate status codes:
- `200 OK` - Successful GET, PUT, PATCH
- `201 Created` - Successful POST
- `204 No Content` - Successful DELETE
- `400 Bad Request` - Validation error
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - No permission
- `404 Not Found` - Resource not found
- `409 Conflict` - Resource conflict
- `500 Internal Server Error` - Server error

## 4. Response Format

Consistent JSON response structure:
```typescript
// Success
res.status(201).json({
  data: user,
  message: 'User created successfully',
});

// Error
res.status(400).json({
  error: 'Validation failed',
  details: validationErrors,
});
```

## 5. Error Handling

Centralized error handler:
```typescript
class ApiError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
  }
}

// In route
if (!user) {
  throw new ApiError(404, 'User not found');
}

// Error middleware
app.use((err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({ error: err.message });
  }
  res.status(500).json({ error: 'Internal server error' });
});
```

## 6. RESTful Route Patterns

```
GET    /api/users          - List all users
POST   /api/users          - Create new user
GET    /api/users/:id      - Get single user
PUT    /api/users/:id      - Update user (full)
PATCH  /api/users/:id      - Update user (partial)
DELETE /api/users/:id      - Delete user
```

## 7. Security Best Practices

- ✅ Validate all inputs
- ✅ Sanitize user data
- ✅ Use rate limiting
- ✅ Implement authentication/authorization
- ✅ Log errors (but not sensitive data)
- ✅ Use HTTPS
- ✅ Set security headers (CORS, CSP)
- ❌ Never expose internal errors to clients
- ❌ Never log passwords or tokens

## 8. Pagination

For list endpoints:
```typescript
router.get('/api/users', async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const offset = (page - 1) * limit;

  const [users, total] = await Promise.all([
    db.user.findMany({ skip: offset, take: limit }),
    db.user.count(),
  ]);

  res.json({
    data: users,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
});
```
