---
name: css-responsive-design
description: Guide for creating responsive layouts with CSS. Use when implementing responsive design or fixing layout issues.
---

# CSS Responsive Design

Follow this mobile-first approach to create responsive layouts:

## 1. Mobile-First Breakpoints

Define breakpoints from small to large:
```css
/* Mobile (default) */
.container {
  padding: 1rem;
  width: 100%;
}

/* Tablet (768px and up) */
@media (min-width: 768px) {
  .container {
    padding: 2rem;
    max-width: 768px;
    margin: 0 auto;
  }
}

/* Desktop (1024px and up) */
@media (min-width: 1024px) {
  .container {
    max-width: 1200px;
  }
}
```

## 2. Responsive Layout Techniques

### Flexbox
```css
.flex-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

@media (min-width: 768px) {
  .flex-container {
    flex-direction: row;
  }
}
```

### CSS Grid
```css
.grid-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

@media (min-width: 768px) {
  .grid-container {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .grid-container {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

## 3. Responsive Typography

Use clamp for fluid typography:
```css
h1 {
  font-size: clamp(1.5rem, 4vw, 3rem);
  line-height: 1.2;
}

p {
  font-size: clamp(1rem, 2vw, 1.125rem);
  line-height: 1.6;
}
```

## 4. Responsive Images

```css
img {
  max-width: 100%;
  height: auto;
  display: block;
}

/* Modern responsive images */
.responsive-img {
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
}
```

## 5. Container Queries (Modern)

```css
.card-container {
  container-type: inline-size;
}

.card {
  padding: 1rem;
}

@container (min-width: 400px) {
  .card {
    padding: 2rem;
    display: grid;
    grid-template-columns: 1fr 2fr;
  }
}
```

## 6. Common Patterns

### Navigation
- Mobile: Hamburger menu
- Desktop: Horizontal navigation

### Cards
- Mobile: Stacked (1 column)
- Tablet: 2 columns
- Desktop: 3-4 columns

### Forms
- Mobile: Single column
- Desktop: Multi-column layout

## 7. Testing Checklist

- [ ] Test on actual devices, not just browser resize
- [ ] Check portrait and landscape orientations
- [ ] Test touch targets (min 44x44px)
- [ ] Verify text readability at all sizes
- [ ] Check spacing and alignment
- [ ] Test with browser zoom (up to 200%)
