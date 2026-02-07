---
name: form-validation
description: Guide for implementing form handling with React Hook Form and Zod validation. Use when creating forms with validation.
---

# Form Validation

Follow this process to implement robust form validation:

## 1. Setup

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const formSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  age: z.number().int().positive().optional(),
});

type FormData = z.infer<typeof formSchema>;
```

## 2. Form Component

```typescript
export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await loginUser(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Form fields */}
    </form>
  );
}
```

## 3. Input Fields

```typescript
<div>
  <label htmlFor="email">Email</label>
  <input
    id="email"
    type="email"
    {...register('email')}
    aria-invalid={errors.email ? 'true' : 'false'}
  />
  {errors.email && (
    <span role="alert" className="error">
      {errors.email.message}
    </span>
  )}
</div>
```

## 4. Advanced Validation

### Custom Validation
```typescript
const schema = z.object({
  password: z.string().min(8),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});
```

### Async Validation
```typescript
const schema = z.object({
  username: z.string().refine(
    async (username) => {
      const exists = await checkUsernameAvailability(username);
      return !exists;
    },
    { message: 'Username already taken' }
  ),
});
```

## 5. Common Validation Patterns

```typescript
// Email
email: z.string().email()

// Password (strong)
password: z.string()
  .min(8)
  .regex(/[A-Z]/, 'Must contain uppercase')
  .regex(/[a-z]/, 'Must contain lowercase')
  .regex(/[0-9]/, 'Must contain number')

// URL
url: z.string().url()

// Phone
phone: z.string().regex(/^\+?[1-9]\d{1,14}$/)

// Date
birthdate: z.string().refine((val) => !isNaN(Date.parse(val)))

// File upload
file: z.instanceof(File)
  .refine((file) => file.size <= 5000000, 'Max 5MB')
  .refine(
    (file) => ['image/jpeg', 'image/png'].includes(file.type),
    'Only .jpg and .png files'
  )
```

## 6. Select and Checkbox

```typescript
// Select
<select {...register('country')}>
  <option value="">Select country</option>
  <option value="us">United States</option>
  <option value="uk">United Kingdom</option>
</select>

// Checkbox
<input
  type="checkbox"
  {...register('terms')}
/>

// Schema
const schema = z.object({
  country: z.string().min(1, 'Please select a country'),
  terms: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms',
  }),
});
```

## 7. Submit Button State

```typescript
<button
  type="submit"
  disabled={isSubmitting}
>
  {isSubmitting ? 'Submitting...' : 'Submit'}
</button>
```

## 8. Error Handling

```typescript
const onSubmit = async (data: FormData) => {
  try {
    await submitForm(data);
    toast.success('Form submitted successfully');
  } catch (error) {
    if (error instanceof ApiError) {
      toast.error(error.message);
    } else {
      toast.error('An unexpected error occurred');
    }
  }
};
```

## 9. Accessibility Checklist

- ✅ Use proper label elements with htmlFor
- ✅ Add aria-invalid for error states
- ✅ Use role="alert" for error messages
- ✅ Provide clear error messages
- ✅ Ensure keyboard navigation works
- ✅ Show loading state during submission
- ✅ Disable submit button while submitting
- ✅ Focus first error field on validation failure

## 10. UX Best Practices

- Show validation on blur or submit (not on every keystroke)
- Provide inline validation feedback
- Use clear, actionable error messages
- Show success feedback after submission
- Don't clear form on error
- Auto-focus first field on mount
