---
name: performance-optimization
description: Guide for optimizing web performance and Core Web Vitals. Use when analyzing or improving page performance.
---

# Performance Optimization

Follow this guide to optimize web performance and Core Web Vitals:

## 1. Core Web Vitals Targets

**Largest Contentful Paint (LCP):** < 2.5s
**First Input Delay (FID):** < 100ms
**Cumulative Layout Shift (CLS):** < 0.1

## 2. Code Splitting & Lazy Loading

```typescript
// Lazy load routes
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Settings = lazy(() => import('./pages/Settings'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Suspense>
  );
}

// Lazy load heavy components
const Chart = lazy(() => import('./components/Chart'));
```

## 3. Image Optimization

```html
<!-- Modern formats with fallback -->
<picture>
  <source srcset="image.avif" type="image/avif" />
  <source srcset="image.webp" type="image/webp" />
  <img src="image.jpg" alt="Description" loading="lazy" />
</picture>

<!-- Responsive images -->
<img
  src="small.jpg"
  srcset="small.jpg 400w, medium.jpg 800w, large.jpg 1200w"
  sizes="(max-width: 600px) 400px, (max-width: 1200px) 800px, 1200px"
  alt="Description"
  loading="lazy"
/>
```

### Next.js Image Optimization
```typescript
import Image from 'next/image';

<Image
  src="/hero.jpg"
  alt="Hero image"
  width={1200}
  height={600}
  priority // For LCP image
  placeholder="blur"
/>
```

## 4. Bundle Optimization

```typescript
// Vite: Analyze bundle
import { visualizer } from 'rollup-plugin-visualizer';

export default {
  plugins: [
    visualizer({
      open: true,
      gzipSize: true,
    }),
  ],
};

// Tree shaking: Import only what you need
// ❌ Bad
import _ from 'lodash';

// ✅ Good
import debounce from 'lodash/debounce';
```

## 5. React Performance

### Memoization
```typescript
// Expensive calculation
const sortedData = useMemo(() => {
  return data.sort((a, b) => a.value - b.value);
}, [data]);

// Prevent re-renders
const MemoizedComponent = memo(function ExpensiveComponent({ data }) {
  // Complex rendering
});

// Stable callbacks
const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);
```

### Virtual Lists
```typescript
import { useVirtualizer } from '@tanstack/react-virtual';

function VirtualList({ items }) {
  const parentRef = useRef();

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
  });

  return (
    <div ref={parentRef} style={{ height: '400px', overflow: 'auto' }}>
      <div style={{ height: virtualizer.getTotalSize() }}>
        {virtualizer.getVirtualItems().map(item => (
          <div key={item.key} style={{ transform: `translateY(${item.start}px)` }}>
            {items[item.index]}
          </div>
        ))}
      </div>
    </div>
  );
}
```

## 6. Caching Strategies

### HTTP Caching
```typescript
// Express.js
app.use(express.static('public', {
  maxAge: '1y', // Cache static assets for 1 year
  immutable: true,
}));

// Cache-Control headers
res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
```

### Service Worker (PWA)
```typescript
// workbox-config.js
module.exports = {
  globDirectory: 'dist/',
  globPatterns: ['**/*.{html,js,css,png,jpg,svg}'],
  swDest: 'dist/sw.js',
  runtimeCaching: [{
    urlPattern: /^https:\/\/api\.example\.com/,
    handler: 'NetworkFirst',
    options: {
      cacheName: 'api-cache',
      expiration: {
        maxEntries: 50,
        maxAgeSeconds: 300,
      },
    },
  }],
};
```

## 7. Font Optimization

```html
<!-- Preload critical fonts -->
<link
  rel="preload"
  href="/fonts/Inter-Regular.woff2"
  as="font"
  type="font/woff2"
  crossorigin
/>

<!-- Use font-display: swap -->
<style>
  @font-face {
    font-family: 'Inter';
    src: url('/fonts/Inter-Regular.woff2') format('woff2');
    font-display: swap; /* Prevents invisible text */
    font-weight: 400;
  }
</style>
```

## 8. Resource Hints

```html
<!-- Preconnect to third-party origins -->
<link rel="preconnect" href="https://api.example.com" />
<link rel="dns-prefetch" href="https://analytics.example.com" />

<!-- Prefetch next page -->
<link rel="prefetch" href="/dashboard" />

<!-- Preload critical resources -->
<link rel="preload" href="/critical.css" as="style" />
<link rel="preload" href="/hero.jpg" as="image" />
```

## 9. Debouncing & Throttling

```typescript
// Debounce: Wait for silence
const debouncedSearch = useMemo(
  () => debounce((query: string) => {
    performSearch(query);
  }, 300),
  []
);

// Throttle: Limit frequency
const throttledScroll = useMemo(
  () => throttle(() => {
    handleScroll();
  }, 100),
  []
);
```

## 10. Database Query Optimization

```typescript
// ❌ N+1 Query Problem
const posts = await prisma.post.findMany();
for (const post of posts) {
  const author = await prisma.user.findUnique({
    where: { id: post.authorId }
  });
}

// ✅ Single query with include
const posts = await prisma.post.findMany({
  include: { author: true },
});

// ✅ Add indexes for frequent queries
model Post {
  id        String   @id
  authorId  String
  createdAt DateTime

  @@index([authorId])
  @@index([createdAt])
}
```

## 11. Compression

```typescript
// Enable gzip/brotli compression
import compression from 'compression';

app.use(compression({
  level: 6, // Compression level
  threshold: 1024, // Only compress if > 1KB
}));
```

## 12. Lighthouse Performance Audit

Run Lighthouse and fix issues:
```bash
# Chrome DevTools: Lighthouse tab
# Or CLI:
npx lighthouse https://example.com --view
```

**Common fixes:**
- Remove unused CSS/JS
- Minimize main thread work
- Reduce JavaScript execution time
- Serve images in modern formats
- Enable text compression
- Properly size images
- Eliminate render-blocking resources

## 13. Performance Monitoring

```typescript
// Web Vitals
import { getCLS, getFID, getLCP } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getLCP(console.log);

// Performance API
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.log(entry.name, entry.startTime);
  }
});

observer.observe({ entryTypes: ['navigation', 'resource'] });
```

## 14. Optimization Checklist

- [ ] Lazy load routes and heavy components
- [ ] Optimize images (WebP/AVIF, responsive, lazy load)
- [ ] Enable code splitting
- [ ] Minimize bundle size (tree shaking)
- [ ] Use React.memo for expensive components
- [ ] Implement virtual scrolling for long lists
- [ ] Add HTTP caching headers
- [ ] Preload critical resources
- [ ] Optimize fonts (woff2, font-display: swap)
- [ ] Enable compression (gzip/brotli)
- [ ] Add database indexes
- [ ] Debounce/throttle event handlers
- [ ] Run Lighthouse audit
- [ ] Monitor Core Web Vitals
- [ ] Use CDN for static assets
