# Code-Review Checklist

Eine strukturierte Checkliste für professionelle Code-Reviews, die Code-Quality, Best Practices und häufige Fehlerquellen abdeckt.

## Verwendung

Diese Checkliste sollte bei **jedem Code-Review** durchgegangen werden, entweder:
- Vor dem **Pull-Request** (Self-Review)
- Während des **Peer-Reviews**
- Bei **Pre-Merge Quality Gates**

---

## 📋 Review-Checkliste

### 1. Code-Quality & Struktur

#### A. Lesbarkeit ✅
- [ ] Variable-/Function-Names sind aussagekräftig und konsistent
- [ ] Code ist selbsterklärend (braucht keine Comments um ihn zu verstehen)
- [ ] Keine Magic-Numbers (alle Konstanten benannt)
- [ ] Einrückung und Formatierung konsistent (Prettier/ESLint)
- [ ] Max 50 Zeilen pro Function (sonst splitten)
- [ ] Max Nesting-Level: 3 (sonst Early-Return nutzen)

#### B. DRY-Principle ✅
- [ ] Keine Code-Duplikation (> 5 identische Zeilen)
- [ ] Wiederholte Logic in Functions extrahiert
- [ ] Gemeinsame Patterns in Utility-Functions/Hooks
- [ ] Constants in separate Datei ausgelagert

#### C. SOLID-Principles ✅
- [ ] **Single Responsibility**: Jede Function macht nur eine Sache
- [ ] **Open/Closed**: Erweiterbar ohne Modification
- [ ] **Liskov Substitution**: Interfaces korrekt implementiert
- [ ] **Interface Segregation**: Keine überladenen Interfaces
- [ ] **Dependency Inversion**: Abhängigkeiten von Abstraktionen, nicht Konkretem

---

### 2. TypeScript-Specific

#### A. Type-Safety ✅
- [ ] Kein `any` (außer explizit begründet mit Comment)
- [ ] Alle Functions haben explizite Return-Types
- [ ] Props/State haben Interface/Type-Definition
- [ ] Generics wo sinnvoll genutzt
- [ ] Union-Types statt Enums (bessere Type-Safety)
- [ ] Type-Guards bei Runtime-Type-Checks
- [ ] Kein `as` Type-Assertion ohne Validation

#### B. Strict-Mode Compliance ✅
- [ ] `tsconfig.json` hat `"strict": true`
- [ ] Keine `@ts-ignore` ohne Begründung
- [ ] Keine Non-Null-Assertions (`!`) ohne vorherigen Check
- [ ] Optional-Chaining (`?.`) statt Null-Checks wo möglich
- [ ] Nullish-Coalescing (`??`) statt `||` bei Defaults

**Beispiel - Bad:**
```typescript
function process(data: any) {
  return data.value! + 10; // any + Non-Null-Assertion!
}
```

**Beispiel - Good:**
```typescript
interface Data {
  value: number | undefined;
}

function process(data: Data): number {
  if (data.value === undefined) {
    throw new Error('Value is required');
  }
  return data.value + 10;
}
```

---

### 3. React-Specific

#### A. Component-Design ✅
- [ ] Nur funktionale Components (keine Class-Components)
- [ ] Named Exports statt Default Exports
- [ ] Props haben TypeScript-Interface
- [ ] Component max 200 Zeilen (sonst splitten)
- [ ] Props-Drilling max 2 Levels (sonst Context)
- [ ] Component-Composition statt Props-Overload
- [ ] Conditional Rendering klar strukturiert

#### B. Hooks-Rules ✅
- [ ] Hooks nur im Top-Level (nicht in Conditions/Loops)
- [ ] `useEffect` Dependencies vollständig und korrekt
- [ ] `useCallback` nur wo wirklich nötig (nicht premature optimization)
- [ ] `useMemo` nur bei Heavy-Computations
- [ ] Custom-Hooks haben `use`-Prefix
- [ ] Cleanup-Functions in `useEffect` wo nötig
- [ ] Refs korrekt genutzt (nicht für State)

**Beispiel - Bad:**
```typescript
useEffect(() => {
  fetchData(filter); // 'filter' nicht in Dependencies!
}, []); // ❌ Stale-Closure!
```

**Beispiel - Good:**
```typescript
useEffect(() => {
  fetchData(filter);
}, [filter]); // ✅ Alle Dependencies
```

#### C. Performance ⚡
- [ ] Keine Inline-Functions in JSX (neue Referenz bei jedem Render)
- [ ] Keys bei Listen korrekt (stabile IDs, kein Array-Index)
- [ ] `React.memo()` nur bei nachgewiesenen Performance-Problemen
- [ ] Large Lists mit Virtualisierung (> 100 Items)
- [ ] Images mit Lazy-Loading
- [ ] Code-Splitting mit `React.lazy()` für große Components

**Beispiel - Bad:**
```jsx
{items.map((item, index) => (
  <Item
    key={index} // ❌ Index als Key!
    onClick={() => handleClick(item.id)} // ❌ Inline-Function!
  />
))}
```

**Beispiel - Good:**
```jsx
const handleItemClick = useCallback((id: string) => {
  handleClick(id);
}, [handleClick]);

{items.map(item => (
  <Item
    key={item.id} // ✅ Stabile ID
    onItemClick={handleItemClick} // ✅ useCallback
  />
))}
```

---

### 4. Performance & Optimization

#### A. Bundle-Size ⚡
- [ ] Keine unnötigen Dependencies
- [ ] Tree-Shaking möglich (keine Barrel-Imports von großen Libs)
- [ ] Dynamic Imports für große Libraries
- [ ] Code-Splitting auf Route-Level implementiert
- [ ] Bundle-Size geprüft (mit `vite-bundle-visualizer`)

#### B. Runtime-Performance ⚡
- [ ] Heavy-Computations in `useMemo` oder Web-Worker
- [ ] Debouncing/Throttling bei Event-Handlers (Input, Scroll, Resize)
- [ ] API-Calls mit Caching-Strategy
- [ ] Images optimiert (WebP, Lazy-Loading, responsive)
- [ ] Keine synchrone Blocking-Operations im Main-Thread

**Beispiel - Bad:**
```typescript
<input onChange={(e) => {
  searchAPI(e.target.value); // ❌ API-Call bei jedem Keystroke!
}} />
```

**Beispiel - Good:**
```typescript
const debouncedSearch = useMemo(
  () => debounce((value: string) => searchAPI(value), 300),
  []
);

<input onChange={(e) => debouncedSearch(e.target.value)} />
```

---

### 5. Security

#### A. Input-Validation ✅
- [ ] Alle User-Inputs validiert (Frontend + Backend)
- [ ] Zod/Yup Schemas für Form-Validation
- [ ] Sanitization vor DB-Speicherung
- [ ] SQL-Injection Prevention (Prepared Statements/ORM)
- [ ] Type-Validation bei API-Responses

#### B. XSS-Prevention ✅
- [ ] Kein `dangerouslySetInnerHTML` ohne Sanitization (z.B. DOMPurify)
- [ ] User-Content escaped vor Rendering
- [ ] CSP-Headers korrekt konfiguriert
- [ ] Keine `eval()` oder `Function()` Constructor

#### C. Authentication & Authorization ✅
- [ ] Auth-Checks auf allen protected Routes
- [ ] JWT-Tokens sicher gespeichert (HttpOnly-Cookies, nicht localStorage)
- [ ] CSRF-Protection bei Forms
- [ ] Password-Hashing mit bcrypt/argon2
- [ ] Rate-Limiting bei Login/Sensitive-Endpoints
- [ ] Keine Credentials im Code (nur ENV-Variables)

#### D. Data-Exposure ✅
- [ ] Keine sensiblen Daten in Console-Logs
- [ ] API-Errors zeigen keine Stack-Traces an User
- [ ] PII (Personal Identifiable Info) nur wo nötig
- [ ] Keine Secrets in Frontend-Code

**Beispiel - Bad:**
```typescript
localStorage.setItem('token', jwtToken); // ❌ XSS-anfällig!
console.log('User password:', password); // ❌ Password in Logs!
```

**Beispiel - Good:**
```typescript
// Backend: Set HttpOnly-Cookie
res.cookie('token', jwtToken, {
  httpOnly: true,
  secure: true,
  sameSite: 'strict'
});

// Frontend: Kein Password-Logging
console.log('User logged in:', userId); // ✅ Nur ID, nicht PW
```

---

### 6. Testing

#### A. Test-Coverage ✅
- [ ] Kritische Pfade zu 80%+ getestet
- [ ] Neue Features haben entsprechende Tests
- [ ] Edge-Cases abgedeckt (Error-Cases, Boundary-Values)
- [ ] Happy-Path UND Sad-Path getestet
- [ ] Async-Operations korrekt getestet (mit `waitFor`)

#### B. Test-Quality ✅
- [ ] Tests testen **Behavior**, nicht Implementation
- [ ] AAA-Pattern (Arrange, Act, Assert) eingehalten
- [ ] Test-Descriptions sind klar und aussagekräftig
- [ ] Keine Copy-Paste-Tests (DRY auch in Tests)
- [ ] External Dependencies gemockt
- [ ] Tests sind unabhängig voneinander (keine Shared State)

**Beispiel - Bad:**
```typescript
test('button', () => {
  const wrapper = mount(<Button />); // ❌ Was testen wir?
  expect(wrapper.find('.btn')).toHaveLength(1); // ❌ Implementation-Detail!
});
```

**Beispiel - Good:**
```typescript
test('calls onClick handler when clicked', () => {
  const handleClick = vi.fn();
  render(<Button onClick={handleClick}>Click me</Button>);

  const button = screen.getByRole('button', { name: /click me/i });
  fireEvent.click(button);

  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

---

### 7. Error-Handling

#### A. Robustheit ✅
- [ ] Try-Catch bei allen async Operations
- [ ] Error-Boundaries für React-Components
- [ ] Graceful-Degradation bei API-Failures
- [ ] Loading-States und Error-States vorhanden
- [ ] Retry-Logic bei network-failures
- [ ] User-Friendly Error-Messages (keine Stack-Traces)

#### B. Logging ✅
- [ ] Errors werden geloggt (mit Context: User-ID, Timestamp, Action)
- [ ] Keine `console.log` in Production (nur `console.error`)
- [ ] Structured-Logging (JSON-Format für Parsing)
- [ ] Monitoring-Integration (Sentry, LogRocket)

**Beispiel - Bad:**
```typescript
const data = await fetchAPI(); // ❌ Kein Error-Handling!
```

**Beispiel - Good:**
```typescript
try {
  const data = await fetchAPI();
  return data;
} catch (error) {
  console.error('API-Fetch failed:', {
    error: error.message,
    userId: currentUser.id,
    timestamp: new Date().toISOString()
  });

  // Show user-friendly message
  showToast('Daten konnten nicht geladen werden. Bitte versuche es erneut.');

  // Return fallback
  return getCachedData();
}
```

---

### 8. Accessibility (A11y)

#### A. Semantic HTML ✅
- [ ] Korrekte HTML-Elemente (`<button>` statt `<div onClick>`)
- [ ] Heading-Hierarchie korrekt (h1 → h2 → h3)
- [ ] Landmarks (`<header>`, `<nav>`, `<main>`, `<footer>`)
- [ ] Listen mit `<ul>`/`<ol>` und `<li>`
- [ ] Forms mit `<label>` für alle Inputs

#### B. Keyboard-Navigation ✅
- [ ] Alle interaktiven Elemente mit Tab erreichbar
- [ ] Logische Tab-Reihenfolge
- [ ] Enter/Space triggert Buttons
- [ ] Escape schließt Modals/Dropdowns
- [ ] Keine Keyboard-Traps
- [ ] Skip-Links für schnelle Navigation

#### C. ARIA-Attribute ✅
- [ ] `aria-label` für Icon-Buttons (ohne Text)
- [ ] `aria-expanded` bei Toggles (Accordion, Dropdown)
- [ ] `aria-controls` bei Tab-Panels
- [ ] `aria-live` für dynamische Updates
- [ ] `aria-describedby` für Form-Errors
- [ ] `role` nur wo Semantic-HTML nicht ausreicht

#### D. Visual ✅
- [ ] Farbkontrast min 4.5:1 (WCAG AA)
- [ ] Focus-Indicators sichtbar (min 3:1 Kontrast)
- [ ] Alle Bilder haben Alt-Text
- [ ] Info nicht nur über Farbe vermittelt
- [ ] Touch-Targets min 44x44px (Mobile)

**Beispiel - Bad:**
```jsx
<div onClick={handleClick}>Click me</div> // ❌ Nicht keyboard-accessible!
```

**Beispiel - Good:**
```jsx
<button onClick={handleClick} aria-label="Submit form">
  Click me
</button>
```

---

### 9. Documentation

#### A. Code-Comments ✅
- [ ] Complex Logic hat JSDoc-Comment
- [ ] Public APIs haben vollständige JSDoc
- [ ] Comments erklären "Warum", nicht "Was"
- [ ] Keine auskommentierten Code-Blöcke (nutze Git)
- [ ] TODOs haben Issue-Link oder Deadline

#### B. External Documentation ✅
- [ ] README.md aktualisiert (bei neuen Features)
- [ ] API-Docs aktualisiert
- [ ] CHANGELOG.md erweitert
- [ ] Migration-Guide bei Breaking-Changes

---

### 10. Git & Version-Control

#### A. Commits ✅
- [ ] Conventional Commits Format (`feat:`, `fix:`, etc.)
- [ ] Atomic Commits (eine logische Änderung pro Commit)
- [ ] Commit-Messages aussagekräftig (nicht "fix stuff")
- [ ] Keine Merge-Commits in Feature-Branch (Rebase)

#### B. Pull-Request ✅
- [ ] PR-Description erklärt **Was** und **Warum**
- [ ] Links zu Related-Issues
- [ ] Screenshots bei UI-Changes
- [ ] Breaking-Changes klar markiert
- [ ] Reviewers assigned

---

## 🎯 Review-Priorisierung

### 🔴 Kritisch (MUSS behoben werden):
- Security-Vulnerabilities
- Bugs die zu Data-Loss führen
- Performance-Killer (> 3s Load-Time)
- Breaking-Changes ohne Migration-Path

### 🟡 Wichtig (SOLLTE behoben werden):
- Code-Quality Issues (DRY, SOLID)
- Missing Tests für kritische Pfade
- Accessibility-Probleme (A11y)
- Type-Safety Violations

### 🟢 Optional (KANN verbessert werden):
- Code-Style Preferences
- Minor Performance-Optimierungen
- Additional Documentation
- Refactoring-Opportunities

---

## 📊 Review-Metriken

Nach dem Review:
- **Lines Changed**: ______
- **Time Spent**: ______ Minuten
- **Critical Issues Found**: ______
- **Important Issues Found**: ______
- **Test Coverage**: ______%
- **Overall Score**: ⭐⭐⭐⭐⭐ (1-5)

---

## 💡 Review-Best-Practices

### Als Reviewer:
- ✅ Sei konstruktiv, nicht kritisch
- ✅ Gib konkrete Lösungen, nicht nur Probleme
- ✅ Lobe gute Patterns
- ✅ Frage nach, wenn unklar (nicht assumieren)
- ✅ Review in max 400 LOC Chunks (sonst aufteilen)

### Als Author:
- ✅ Self-Review vor PR-Erstellung
- ✅ Beschreibe Context im PR-Description
- ✅ Sei offen für Feedback
- ✅ Frage nach Clarification bei Unverständnis
- ✅ Halte PRs klein (< 400 LOC ideal)

---

**Remember**: Code-Reviews sind zum **Lernen** und **Verbessern**, nicht zur Kritik! 🚀
