---
name: performance-optimization
description: Guide for optimizing web performance and Core Web Vitals. Use when analyzing or improving page performance.
---

# Performance Optimization

Follow this guide to optimize web performance and Core Web Vitals:

## 1. Core Web Vitals Targets

> ⚠️ **Important Update (March 2024):** FID has been replaced with INP as a Core Web Vital.

**Largest Contentful Paint (LCP):** < 2.5s
- Good: < 2.5s
- Needs Improvement: 2.5-4.0s
- Poor: > 4.0s

**Interaction to Next Paint (INP):** < 200ms
- Good: < 200ms
- Needs Improvement: 200-500ms
- Poor: > 500ms

**Cumulative Layout Shift (CLS):** < 0.1
- Good: < 0.1
- Needs Improvement: 0.1-0.25
- Poor: > 0.25

**What is INP?**
INP measures the responsiveness of ALL user interactions throughout the entire page lifetime (clicks, taps, keyboard input). Unlike FID which only measured the first interaction, INP captures the full latency including processing and rendering time.

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

### React 18+ Concurrent Features

React 18 introduced powerful concurrent features for better perceived performance:

#### useTransition - Non-Blocking Updates
```typescript
import { useState, useTransition } from 'react';

function SearchComponent() {
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Non-urgent update won't block typing
    startTransition(() => {
      setQuery(value);
      setResults(expensiveFilter(value));
    });
  };
  
  return (
    <>
      <input onChange={handleChange} placeholder="Search..." />
      {isPending && <Spinner />}
      <Results data={results} />
    </>
  );
}
```

**Benefits:**
- Input stays responsive even during expensive updates
- Better user experience than debouncing
- Shows loading state automatically

#### useDeferredValue - Debounce Expensive Renders
```typescript
import { useDeferredValue, useMemo } from 'react';

function ProductList({ searchQuery }: { searchQuery: string }) {
  // Defer expensive computation
  const deferredQuery = useDeferredValue(searchQuery);
  
  const filteredProducts = useMemo(() => 
    products.filter(p => p.name.includes(deferredQuery)),
    [deferredQuery]
  );
  
  return (
    <div>
      {filteredProducts.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

**Benefits:**
- React automatically deprioritizes the update
- UI stays responsive to user input
- No manual debouncing needed

#### Streaming SSR with Suspense
```typescript
// app/page.tsx (Next.js 13+)
import { Suspense } from 'react';

export default function Page() {
  return (
    <>
      <Header />
      <Suspense fallback={<Skeleton />}>
        <SlowDataComponent />
      </Suspense>
      <Suspense fallback={<Skeleton />}>
        <AnotherSlowComponent />
      </Suspense>
      <Footer />
    </>
  );
}

// Component with async data
async function SlowDataComponent() {
  const data = await fetchData(); // Can be slow
  return <div>{data}</div>;
}
```

**Benefits:**
- Page loads progressively (header/footer show immediately)
- No blocking on slow data fetching
- Better LCP and FCP metrics

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

## 8. Resource Hints & Priority

### Priority Hints (fetchpriority)

Control resource loading priority for better LCP:

```html
<!-- High priority: LCP image loads first -->
<img 
  src="/hero.jpg" 
  alt="Hero" 
  fetchpriority="high"
  width="1200"
  height="600"
/>

<!-- High priority: Critical font -->
<link 
  rel="preload" 
  href="/fonts/Inter-Bold.woff2" 
  as="font" 
  type="font/woff2"
  fetchpriority="high"
  crossorigin
/>

<!-- Low priority: Non-critical resources -->
<script src="/analytics.js" fetchpriority="low" async></script>
<img src="/footer-logo.png" alt="Logo" fetchpriority="low" />

<!-- Auto priority (default) -->
<link rel="stylesheet" href="/styles.css" fetchpriority="auto" />
```

**Browser Support:** Chrome 101+, Edge 101+, Safari 17.2+

**Impact:** Can improve LCP by 5-20% by prioritizing critical resources

### Traditional Resource Hints

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

### Speculation Rules API (Next-Gen Prefetching)

Modern, privacy-aware prefetching that's more powerful than `<link rel="prefetch">`:

```html
<!-- Prefetch product pages when hovering over links -->
<script type="speculationrules">
{
  "prefetch": [{
    "source": "document",
    "where": {
      "selector_matches": "a[href^='/products/']"
    },
    "eagerness": "moderate"
  }]
}
</script>

<!-- Prerender dashboard for instant navigation -->
<script type="speculationrules">
{
  "prerender": [{
    "source": "list",
    "urls": ["/dashboard"]
  }]
}
</script>

<!-- Prefetch on hover with custom rules -->
<script type="speculationrules">
{
  "prefetch": [{
    "source": "document",
    "where": {
      "and": [
        { "href_matches": "/blog/*" },
        { "not": { "href_matches": "/blog/admin/*" } }
      ]
    },
    "eagerness": "conservative"
  }]
}
</script>
```

**Eagerness levels:**
- `immediate` - Prefetch right away
- `eager` - Prefetch when link appears in viewport
- `moderate` - Prefetch on 200ms hover (default)
- `conservative` - Prefetch on pointer down

**Benefits:**
- **0-100ms navigation** with prerender
- Privacy-aware (respects user settings)
- Smart resource management
- Better than `<link rel="prefetch">`

**Browser Support:** Chrome 109+, Edge 109+


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

### Web Vitals (Updated 2024)
```typescript
// Monitor Core Web Vitals
import { onCLS, onINP, onLCP } from 'web-vitals';

onCLS(console.log);
onINP(console.log); // ✅ Updated: was getFID
onLCP(console.log);

// Send to analytics
onINP((metric) => {
  const body = JSON.stringify(metric);
  navigator.sendBeacon('/analytics', body);
});
```

### Long Animation Frames (LoAF) API - Debug Poor INP

Essential for identifying what causes slow interactions:

```typescript
// Monitor long animation frames (> 50ms)
const loafObserver = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (entry.duration > 50) {
      console.warn('Long animation frame detected:', {
        duration: entry.duration,
        blockingDuration: entry.blockingDuration,
        renderStart: entry.renderStart,
        scripts: entry.scripts?.map(script => ({
          url: script.sourceURL,
          duration: script.duration,
          invoker: script.invoker
        }))
      });
    }
  }
});

loafObserver.observe({ type: 'long-animation-frame', buffered: true });
```

**Use LoAF to:**
- Identify which scripts cause slow interactions
- Find render-blocking code
- Debug poor INP scores
- Optimize event handlers

### Performance API
```typescript
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.log(entry.name, entry.startTime);
  }
});

observer.observe({ entryTypes: ['navigation', 'resource'] });
```

## 14. Optimization Checklist

### 🎯 Core Web Vitals (Updated 2024)
- [ ] LCP < 2.5s (Largest Contentful Paint)
- [ ] INP < 200ms (Interaction to Next Paint) ✅ Updated from FID
- [ ] CLS < 0.1 (Cumulative Layout Shift)
- [ ] Monitor with `web-vitals` library (`onLCP`, `onINP`, `onCLS`)
- [ ] Use LoAF API to debug poor INP scores ✅ New

### 📦 Assets & Resources
- [ ] Optimize images (WebP/AVIF, responsive, lazy load)
- [ ] Use Priority Hints (`fetchpriority="high"` for LCP image) ✅ New
- [ ] Optimize fonts (woff2, `font-display: swap` or `optional`) ✅ Enhanced
- [ ] Enable Brotli compression (better than gzip)
- [ ] Use CDN for static assets
- [ ] Preload critical resources
- [ ] Implement Speculation Rules API for instant navigation ✅ New

### ⚛️ React & Code
- [ ] Lazy load routes and heavy components
- [ ] Enable code splitting
- [ ] Minimize bundle size (tree shaking)
- [ ] Use React.memo for expensive components
- [ ] Implement `useTransition` for non-blocking updates ✅ New
- [ ] Implement `useDeferredValue` for expensive renders ✅ New
- [ ] Use Streaming SSR with Suspense ✅ New
- [ ] Implement virtual scrolling for long lists

### 🌐 Network & Caching
- [ ] Add HTTP caching headers
- [ ] Implement Service Worker (PWA)
- [ ] Preconnect to third-party origins
- [ ] Use resource hints (preload, prefetch, dns-prefetch)

### 🗄️ Database & Backend
- [ ] Add database indexes for frequent queries
- [ ] Prevent N+1 query problem
- [ ] Implement connection pooling
- [ ] Optimize API response times

### ⚡ Events & Interactions
- [ ] Debounce inputs (300ms)
- [ ] Throttle scroll/resize handlers (100ms)
- [ ] Use passive event listeners
- [ ] Optimize event handlers (avoid layout thrashing)

### 📊 Monitoring & Audits
- [ ] Run Lighthouse audit (target score > 90)
- [ ] Monitor Core Web Vitals in production
- [ ] Set up performance budgets ✅ New
- [ ] Use LoAF API for INP debugging ✅ New
- [ ] Implement Real User Monitoring (RUM) ✅ New

### 🚀 Modern APIs
- [ ] Priority Hints for critical resources ✅ New
- [ ] Speculation Rules for prefetching/prerendering ✅ New
- [ ] View Transitions API (optional) ✅ New
