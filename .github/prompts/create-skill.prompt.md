---
description: Template for creating a new reusable skill module. Use this when adding procedural knowledge that multiple agents can reference.
---

# Create New Skill Prompt

Use this template when creating a new skill for the AI agent orchestration framework.

## Skill Template

Create `.github/skills/<skill-name>/SKILL.md`:

```markdown
---
name: <skill-name>
description: <When to use this skill - guidance for agents>
---

# <Skill Title>

<Brief introduction explaining what this skill teaches>

## Prerequisites

- <Required knowledge or context>
- <Dependencies or setup needed>
- <Related skills to review first>

## Step 1: <First Major Step>

<Detailed explanation of the step>

### Example
```<language>
// Concrete code example
<example code>
```

### Best Practices
- ✅ <Do this>
- ✅ <Do this>
- ❌ <Don't do this>

## Step 2: <Second Major Step>

<Detailed explanation>

### Example
```<language>
// Another example
<example code>
```

### Common Pitfalls
- ⚠️ <Watch out for this>
- ⚠️ <Be careful with this>

## Step 3: <Third Major Step>

<Detailed explanation>

## Verification Checklist

After completing this skill's steps, verify:
- [ ] <Verification point>
- [ ] <Verification point>
- [ ] <Verification point>

## Additional Resources

- <Related skill>: `.github/skills/<related-skill>/SKILL.md`
- <External resource>: <URL>
- <Documentation>: <URL>
```

## Checklist for New Skill

Before creating the skill, verify:

- [ ] **Agent-agnostic**: Multiple agents can use it
- [ ] **Procedural**: Step-by-step instructions, not generic advice
- [ ] **Concrete**: Includes actual code examples from stack
- [ ] **Focused**: Covers one specific skill/workflow
- [ ] **Naming**: kebab-case folder name matching frontmatter

After creating the skill:

- [ ] **Update copilot-instructions.md**: Add to "Available Skills" list
- [ ] **Reference from agents**: Update relevant agent files to reference skill
- [ ] **Test usability**: Ensure instructions are clear and actionable
- [ ] **Add examples**: Include at least 2-3 code examples

## Example: Creating a "API Error Handling" Skill

Create `.github/skills/api-error-handling/SKILL.md`:

```markdown
---
name: api-error-handling
description: Guide for implementing consistent error handling in API endpoints. Use when creating backend routes or API services.
---

# API Error Handling

Consistent error handling across all API endpoints with proper status codes, error messages, and logging.

## Prerequisites

- Express.js or Next.js API Routes set up
- TypeScript configured
- Error logging service available (e.g., Sentry, Winston)

## Step 1: Define Error Types

Create a centralized error class hierarchy:

### Example
```typescript
// src/errors/ApiError.ts
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational: boolean = true
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
  constructor(message: string = 'Unauthorized') {
    super(401, message);
  }
}
```

### Best Practices
- ✅ Extend base ApiError class for all custom errors
- ✅ Set appropriate HTTP status codes
- ✅ Mark errors as operational (expected) vs programming errors
- ❌ Don't expose stack traces to clients in production

## Step 2: Create Error Handler Middleware

Implement centralized error handling:

### Example
```typescript
// src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../errors/ApiError';
import logger from '../utils/logger';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Log error
  logger.error({
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  // Handle operational errors
  if (err instanceof ApiError && err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        message: err.message,
        code: err.statusCode,
      },
    });
  }

  // Handle programming/unknown errors
  return res.status(500).json({
    success: false,
    error: {
      message: 'Internal server error',
      code: 500,
    },
  });
}
```

### Common Pitfalls
- ⚠️ Never expose error.stack in production
- ⚠️ Always log errors before sending response
- ⚠️ Distinguish operational errors from bugs

## Step 3: Use in API Routes

Apply error handling in your endpoints:

### Example
```typescript
// src/routes/users.ts
import { Router } from 'express';
import { NotFoundError, ValidationError } from '../errors/ApiError';

const router = Router();

router.get('/users/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      throw new ValidationError('Invalid user ID');
    }

    const user = await userService.findById(id);

    if (!user) {
      throw new NotFoundError('User');
    }

    res.json({ success: true, data: user });
  } catch (error) {
    next(error); // Pass to error handler middleware
  }
});

export default router;
```

## Step 4: Register Middleware

Add error handler to your app:

### Example
```typescript
// src/app.ts
import express from 'express';
import { errorHandler } from './middleware/errorHandler';
import userRoutes from './routes/users';

const app = express();

// Routes
app.use('/api', userRoutes);

// Error handler (MUST be last)
app.use(errorHandler);

export default app;
```

## Verification Checklist

After implementing API error handling:
- [ ] Custom error classes created (ValidationError, NotFoundError, etc.)
- [ ] Error handler middleware registered as last middleware
- [ ] All async routes wrapped in try-catch with next(error)
- [ ] Errors logged with context (path, method, user ID)
- [ ] Production environment doesn't expose stack traces
- [ ] HTTP status codes are correct (400, 401, 404, 500)
- [ ] Response format is consistent across all errors

## Additional Resources

- Related: `.github/skills/api-endpoint-creation/SKILL.md`
- Express Error Handling: https://expressjs.com/en/guide/error-handling.html
- HTTP Status Codes: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
```

## Integration Checklist

After adding the skill:

1. **Reference from agents**:
   - Update `api-developer.agent.md` to reference this skill
   - Update any other relevant agents

2. **Update documentation**:
   - Add to copilot-instructions.md skills list
   - Add description of when to use

3. **Test clarity**:
   - Have another agent use the skill
   - Verify steps are clear and actionable
   - Check examples are complete and runnable

4. **Verify examples**:
   - Code examples use correct stack (React, TypeScript, etc.)
   - Examples are idiomatic and follow best practices
   - No placeholders or incomplete code
