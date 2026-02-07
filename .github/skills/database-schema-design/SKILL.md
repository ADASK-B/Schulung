---
name: database-schema-design
description: Guide for designing database schemas with Prisma ORM. Use when creating or modifying database models.
---

# Database Schema Design

Follow this process to design robust database schemas:

## 1. Prisma Schema Structure

```prisma
// schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  posts     Post[]
  profile   Profile?
}
```

## 2. Common Field Patterns

### ID Fields
```prisma
id String @id @default(cuid())  // Preferred: Collision-resistant IDs
// OR
id Int @id @default(autoincrement())  // For simple cases
```

### Timestamps
```prisma
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt
deletedAt DateTime?  // For soft deletes
```

### Enums
```prisma
enum UserRole {
  USER
  ADMIN
  MODERATOR
}

model User {
  role UserRole @default(USER)
}
```

## 3. Relationships

### One-to-Many
```prisma
model User {
  id    String @id @default(cuid())
  posts Post[]
}

model Post {
  id       String @id @default(cuid())
  userId   String
  user     User   @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}
```

### One-to-One
```prisma
model User {
  id      String   @id @default(cuid())
  profile Profile?
}

model Profile {
  id     String @id @default(cuid())
  userId String @unique
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

### Many-to-Many
```prisma
model Post {
  id   String @id @default(cuid())
  tags Tag[]
}

model Tag {
  id    String @id @default(cuid())
  posts Post[]
}
```

## 4. Indexes and Performance

```prisma
model Post {
  id        String   @id @default(cuid())
  title     String
  slug      String   @unique
  authorId  String
  status    String
  createdAt DateTime @default(now())

  // Composite index for common queries
  @@index([authorId, status])
  @@index([createdAt])
}
```

## 5. Constraints and Validation

```prisma
model User {
  email    String  @unique
  username String  @unique
  age      Int     @default(0)

  @@unique([email, username])  // Composite unique
}
```

## 6. Cascade Behavior

```prisma
model User {
  id    String @id @default(cuid())
  posts Post[]
}

model Post {
  id     String @id @default(cuid())
  userId String
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  // Options: Cascade, SetNull, Restrict, NoAction
}
```

## 7. Migrations Workflow

```bash
# Create migration
pnpm prisma migrate dev --name add_user_table

# Apply to production
pnpm prisma migrate deploy

# Generate client
pnpm prisma generate

# Reset database (dev only)
pnpm prisma migrate reset
```

## 8. Design Principles

- ✅ Use UUIDs/CUIDs for distributed systems
- ✅ Always add createdAt/updatedAt timestamps
- ✅ Add indexes for frequently queried fields
- ✅ Use CASCADE for dependent data
- ✅ Normalize to 3NF (avoid data duplication)
- ✅ Use enums for fixed value sets
- ❌ Avoid circular dependencies
- ❌ Don't over-index (impacts write performance)
- ❌ Avoid storing computed values (calculate on read)
