# Copilot Instructions für Web-Entwicklung

## Tech Stack

### Frontend
- **Framework**: React 18+ mit TypeScript
- **Styling**: TailwindCSS / CSS Modules
- **State Management**: Zustand oder React Context
- **Routing**: React Router v6
- **Forms**: React Hook Form + Zod Validation
- **HTTP Client**: Fetch API oder Axios
- **Build Tool**: Vite

### Backend (falls vorhanden)
- **Runtime**: Node.js mit Express oder Next.js API Routes
- **Database**: PostgreSQL mit Prisma ORM
- **Authentication**: JWT oder Session-based
- **API Style**: RESTful oder GraphQL

### Testing
- **Unit Tests**: Vitest
- **Component Tests**: React Testing Library
- **E2E Tests**: Playwright
- **Coverage**: Minimum 80% für kritische Pfade

## Coding Standards

### TypeScript
- Verwende **strict mode** (`"strict": true` in tsconfig.json)
- Definiere explizite Types für alle Function Parameters und Return Values
- Vermeide `any` - nutze `unknown`, `never` oder spezifische Types
- Verwende Interfaces für Object Shapes, Types für Unions/Intersections
- Nutze Generics für wiederverwendbare Komponenten

### React Best Practices
- **Nur funktionale Komponenten** mit Hooks (keine Class Components)
- Verwende **Named Exports** statt Default Exports
- Implementiere **PropTypes** via TypeScript Interfaces
- Nutze `React.memo()` nur bei Performance-Problemen
- Verwende `useCallback` und `useMemo` sparsam und gezielt
- Implementiere **Error Boundaries** für robuste Fehlerbehandlung
- Vermeide direkte DOM-Manipulation - nutze Refs nur wenn nötig

### Code Organization
```
src/
├── components/       # Wiederverwendbare UI-Komponenten
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.test.tsx
│   │   └── Button.module.css
│   └── ...
├── pages/           # Page-Level Komponenten
├── features/        # Feature-based modules
├── hooks/           # Custom React Hooks
├── services/        # API calls und externe Services
├── utils/           # Helper functions
├── types/           # Shared TypeScript types
├── constants/       # App-weite Konstanten
└── assets/          # Statische Assets (Bilder, Icons)
```

### Naming Conventions
- **Komponenten**: PascalCase (`Button.tsx`, `UserProfile.tsx`)
- **Hooks**: camelCase mit "use" prefix (`useAuth.ts`, `useFetch.ts`)
- **Utils**: camelCase (`formatDate.ts`, `validateEmail.ts`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`, `MAX_FILE_SIZE`)
- **Types/Interfaces**: PascalCase mit "I" prefix für Interfaces optional (`User`, `IUserProps`)
- **CSS Modules**: camelCase (`styles.container`, `styles.primaryButton`)

### Code Style
- **Einrückung**: 2 Spaces (kein Tab)
- **Quotes**: Single Quotes für Strings, Double Quotes für JSX
- **Semicolons**: Ja, immer verwenden
- **Line Length**: Maximum 100 Zeichen
- **Trailing Commas**: Ja, bei Multi-Line Arrays/Objects
- **Arrow Functions**: Bevorzugt für alle Functions

## Accessibility (A11y)

- Verwende **semantisches HTML** (header, nav, main, article, section, footer)
- Füge **alt-Text** für alle Bilder hinzu
- Stelle **Keyboard-Navigation** sicher (Tab, Enter, Esc)
- Implementiere **ARIA-Labels** nur wo nötig (semantic HTML first)
- Teste mit **Screen Reader** (mindestens VoiceOver/NVDA)
- Achte auf **Farbkontrast** (WCAG AA: 4.5:1 für Text)
- Verwende **focus indicators** die sichtbar sind

## Performance

- Implementiere **Code Splitting** mit `React.lazy()` und `Suspense`
- Nutze **Image Optimization** (WebP, responsive images, lazy loading)
- Minimiere **Bundle Size** - prüfe mit `vite-bundle-visualizer`
- Implementiere **Virtualization** für lange Listen (react-virtual)
- Verwende **Debouncing/Throttling** für Event Handlers
- Optimiere **Core Web Vitals**: LCP < 2.5s, FID < 100ms, CLS < 0.1

## Security

- **Validiere alle Inputs** (Frontend + Backend)
- **Sanitize User Content** vor dem Rendering (XSS-Prevention)
- Verwende **HTTPS** für alle API Calls
- Implementiere **CORS** sicher
- Nutze **HttpOnly Cookies** für Tokens
- Keine **Secrets im Frontend** - nur Environment Variables
- Implementiere **Rate Limiting** für sensible Endpoints
- Verwende **Content Security Policy** (CSP) Headers

## Git Workflow

### Commit Messages
Folge Conventional Commits:
```
feat: add user authentication
fix: resolve button alignment issue
docs: update README with setup instructions
style: format code with prettier
refactor: extract API logic into service layer
test: add tests for user registration
chore: update dependencies
```

### Branch Naming
- `feature/user-authentication`
- `bugfix/header-overflow`
- `hotfix/security-vulnerability`
- `refactor/api-service-layer`

## Error Handling

- Implementiere **try-catch** für async Operations
- Zeige **User-Friendly Error Messages** (keine Stack Traces)
- Logge Errors mit **Context Information** (User ID, Timestamp, Action)
- Implementiere **Error Boundaries** für React Components
- Nutze **Toast Notifications** für User Feedback
- Implementiere **Retry Logic** für failed API Calls

## API Integration

- Verwende **Environment Variables** für API URLs
- Implementiere **Loading States** für alle async Operations
- Zeige **Error States** mit Retry-Option
- Nutze **Request/Response Interceptors** für Auth Headers
- Implementiere **Request Caching** wo sinnvoll
- Verwende **Optimistic Updates** für bessere UX
- Implementiere **Pagination** für große Datenmengen

## Documentation

- Schreibe **JSDoc Comments** für komplexe Functions
- Dokumentiere **Props** bei komplexen Komponenten
- Erstelle **README** für jedes Feature-Module
- Dokumentiere **API Endpoints** mit OpenAPI/Swagger
- Halte **Changelog** aktuell
- Schreibe **Setup Instructions** im Projekt-README

## Testing Philosophy

- Teste **User Behavior**, nicht Implementation Details
- Schreibe Tests **before oder during** Development (TDD encouraged)
- **Mock externe Dependencies** (APIs, Browser APIs)
- Teste **Error Cases und Edge Cases**
- Verwende **Test-IDs** statt CSS Selectors für stabile Tests
- Schreibe **aussagekräftige Test Descriptions**

## Don'ts (Vermeide diese Anti-Patterns)

- ❌ Keine `any` Types ohne guten Grund
- ❌ Keine `console.log` im Production Code
- ❌ Keine Inline Styles (außer für dynamische Werte)
- ❌ Keine langen Functions (max 50 Zeilen)
- ❌ Keine tief verschachtelten Ternary Operators
- ❌ Keine Mutation von Props oder State
- ❌ Keine unnötigen Re-Renders (`useEffect` dependencies beachten)
- ❌ Keine Commits ohne vorherige Tests
- ❌ Keine hardcoded URLs oder Credentials

## Config Files (Projekt-Root)

### .env.example
Template für Environment-Variables (niemals echte Secrets committen!):
```env
# App
VITE_API_URL=http://localhost:3000/api
VITE_APP_ENV=development

# Backend (falls vorhanden)
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
JWT_SECRET=your-jwt-secret-change-in-production
REDIS_URL=redis://localhost:6379

# External Services
STRIPE_PUBLIC_KEY=pk_test_...
SENTRY_DSN=https://...
```

### .editorconfig
Konsistente Editor-Settings für das gesamte Team:
```ini
root = true

[*]
indent_style = space
indent_size = 2
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true

[*.md]
trim_trailing_whitespace = false

[*.{json,yml,yaml}]
indent_size = 2
```

### .nvmrc
Node-Version festlegen für Team-Konsistenz:
```
18.18.0
```

Usage: `nvm use` (oder automatisch mit nvm-Auto-Switch)

## Git Hooks (mit Husky)

### Setup Husky + lint-staged

```bash
# Installation
pnpm add -D husky lint-staged

# Init Husky
npx husky init

# Pre-Commit Hook erstellen
echo "npx lint-staged" > .husky/pre-commit
```

### package.json - lint-staged Config

```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md,html,css}": [
      "prettier --write"
    ]
  }
}
```

### Pre-Commit Hook (.husky/pre-commit)
```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Lint & Format nur geänderte Dateien
npx lint-staged

# Type-Check
pnpm type-check
```

### Commit-Msg Hook (.husky/commit-msg)
Prüft Conventional-Commits-Format:
```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx --no -- commitlint --edit $1
```

### commitlint.config.js
```javascript
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',     // Neue Feature
        'fix',      // Bug-Fix
        'docs',     // Dokumentation
        'style',    // Formatierung
        'refactor', // Code-Refactoring
        'test',     // Tests hinzufügen/ändern
        'chore',    // Build-Process, Dependencies
        'perf',     // Performance-Verbesserung
        'ci',       // CI/CD-Änderungen
        'revert'    // Commit zurücknehmen
      ]
    ]
  }
};
```

### Pre-Push Hook (.husky/pre-push)
Tests vor Push ausführen:
```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Tests müssen erfolgreich sein
pnpm test

# Build muss erfolgreich sein
pnpm build
```

## Monorepo-Setup (Optional)

Falls Monorepo mit mehreren Packages (z.B. Frontend + Backend + Shared):

### Turborepo (Empfohlen)

```bash
# Installation
pnpm add -D turbo

# turbo.json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**"]
    },
    "test": {
      "dependsOn": ["build"],
      "cache": false
    },
    "lint": {
      "cache": false
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

### pnpm-workspace.yaml
```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

### Struktur
```
project/
├── apps/
│   ├── frontend/       # React-App
│   └── backend/        # Node.js-API
├── packages/
│   ├── ui/            # Shared UI-Components
│   ├── utils/         # Shared Utilities
│   └── types/         # Shared TypeScript-Types
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

## Quick Commands

```bash
# Development
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm preview          # Preview production build

# Testing
pnpm test             # Run unit tests
pnpm test:watch       # Run tests in watch mode
pnpm test:coverage    # Generate coverage report
pnpm test:e2e         # Run E2E tests

# Code Quality
pnpm lint             # Run ESLint
pnpm lint:fix         # Fix ESLint issues
pnpm format           # Format with Prettier
pnpm type-check       # TypeScript type checking

# Git Hooks
pnpm prepare          # Setup Husky hooks (after npm install)

# Monorepo (mit Turborepo)
turbo run build       # Build all packages
turbo run test --parallel  # Tests parallel
turbo run lint --filter=frontend  # Nur Frontend linten
```

## Zusätzliche Ressourcen

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Web.dev Performance](https://web.dev/performance/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)

---

**Wichtig**: Diese Guidelines dienen als Baseline. Custom Agents in `.github/agents/` können für spezifische Tasks zusätzliche spezialisierte Anweisungen haben.
