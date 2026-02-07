---
name: accessibility-audit
description: Checklist for auditing and fixing accessibility issues (WCAG 2.1 AA compliance). Use when reviewing components or pages for accessibility.
---

# Accessibility Audit

Follow this checklist to ensure WCAG 2.1 Level AA compliance:

## 1. Semantic HTML

✅ **Check:**
- Use `<header>`, `<nav>`, `<main>`, `<article>`, `<aside>`, `<footer>`
- Use `<button>` for interactive elements (not `<div>` with onClick)
- Use `<a>` for navigation (not `<button>`)
- Proper heading hierarchy (h1 → h2 → h3, no skipping)

```html
<!-- ❌ Bad -->
<div onClick={handleClick}>Click me</div>

<!-- ✅ Good -->
<button onClick={handleClick}>Click me</button>
```

## 2. Keyboard Navigation

✅ **Check:**
- All interactive elements are keyboard accessible
- Logical tab order (left-to-right, top-to-bottom)
- Skip-to-content link at the top
- Focus visible on all interactive elements
- No keyboard traps

**Test:** Navigate entire page using only Tab, Shift+Tab, Enter, Space, Arrow keys

```css
/* Ensure visible focus indicator */
:focus-visible {
  outline: 2px solid #0066cc;
  outline-offset: 2px;
}
```

## 3. Color and Contrast

✅ **Check:**
- Text contrast ratio ≥ 4.5:1 (normal text)
- Text contrast ratio ≥ 3:1 (large text 18pt+)
- UI component contrast ≥ 3:1
- Don't rely on color alone to convey information

**Tool:** Use browser DevTools or WebAIM Contrast Checker

```css
/* ❌ Bad - insufficient contrast */
color: #999999;
background: #ffffff; /* 2.85:1 */

/* ✅ Good */
color: #666666;
background: #ffffff; /* 5.74:1 */
```

## 4. Images and Alternative Text

✅ **Check:**
- All `<img>` have alt attribute
- Decorative images: `alt=""`
- Informative images: descriptive alt text
- Complex images: detailed description nearby or in longdesc

```html
<!-- Decorative -->
<img src="decorative-line.svg" alt="" />

<!-- Informative -->
<img src="chart.png" alt="Sales increased by 35% in Q4 2025" />
```

## 5. Forms and Labels

✅ **Check:**
- All inputs have associated `<label>`
- Use `htmlFor` to connect label to input
- Group related inputs with `<fieldset>` and `<legend>`
- Provide clear error messages
- Use `aria-invalid` and `aria-describedby` for errors

```html
<label htmlFor="email">Email Address</label>
<input
  id="email"
  type="email"
  aria-invalid={hasError}
  aria-describedby={hasError ? "email-error" : undefined}
/>
{hasError && (
  <span id="email-error" role="alert">
    Please enter a valid email address
  </span>
)}
```

## 6. ARIA Attributes

✅ **Check:**
- Use ARIA only when semantic HTML isn't enough
- Common patterns:
  - `role="button"` for clickable non-buttons
  - `aria-label` for icon-only buttons
  - `aria-expanded` for collapsible sections
  - `aria-live` for dynamic content updates
  - `aria-hidden="true"` for decorative elements

```html
<!-- Icon button needs label -->
<button aria-label="Close dialog">
  <IconX />
</button>

<!-- Expandable section -->
<button aria-expanded={isOpen} aria-controls="content-1">
  Toggle Section
</button>
<div id="content-1" hidden={!isOpen}>
  Content here
</div>
```

## 7. Screen Reader Testing

✅ **Test with:**
- NVDA (Windows) - Free
- JAWS (Windows) - Paid
- VoiceOver (macOS/iOS) - Built-in

**Key checks:**
- All content is announced
- Navigation makes sense
- Form labels are read correctly
- Dynamic updates are announced
- Focus management works

## 8. Responsive and Zoom

✅ **Check:**
- Page works at 200% zoom
- No horizontal scrolling at 320px width
- Touch targets ≥ 44x44px on mobile
- Text can be resized without breakage

```css
/* Minimum touch target size */
.button {
  min-height: 44px;
  min-width: 44px;
  padding: 0.75rem 1rem;
}
```

## 9. Motion and Animation

✅ **Check:**
- Respect `prefers-reduced-motion`
- No auto-playing videos with sound
- Provide pause/stop controls
- Avoid flashing content (< 3 flashes per second)

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## 10. Common Fixes

### Missing link text
```html
<!-- ❌ Bad -->
<a href="/about">Click here</a>

<!-- ✅ Good -->
<a href="/about">Learn more about our company</a>
```

### Icon-only buttons
```html
<!-- ❌ Bad -->
<button><IconTrash /></button>

<!-- ✅ Good -->
<button aria-label="Delete item"><IconTrash aria-hidden="true" /></button>
```

### Modal dialogs
```typescript
// ✅ Trap focus inside modal
// ✅ Return focus to trigger element on close
// ✅ Close on Escape key
// ✅ Use role="dialog" and aria-modal="true"
```

## 11. Automated Testing

Add to your test suite:
```typescript
import { axe } from 'vitest-axe';

it('has no accessibility violations', async () => {
  const { container } = render(<MyComponent />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

## 12. Manual Testing Checklist

- [ ] Navigate with keyboard only
- [ ] Test with screen reader
- [ ] Zoom to 200%
- [ ] Test on mobile device
- [ ] Check color contrast
- [ ] Validate HTML
- [ ] Run Lighthouse audit
- [ ] Run axe DevTools
