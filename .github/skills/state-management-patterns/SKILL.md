---
name: state-management-patterns
description: Guide for choosing and implementing state management solutions. Use when deciding how to manage application state.
---

# State Management Patterns

Follow this guide to choose the right state management solution:

## 1. Decision Tree

```
State Complexity Decision:

┌─ Is it SERVER state (API data)?
│  └─ YES → Use React Query / SWR
│
├─ Is it LOCAL to one component?
│  └─ YES → Use useState / useReducer
│
├─ Is it shared by 2-3 nearby components?
│  └─ YES → Lift state up or use Context
│
├─ Is it shared globally (user, theme, cart)?
│  └─ Small/Medium app → Zustand
│  └─ Large app → Redux Toolkit
│
└─ Is it URL state (filters, pagination)?
   └─ YES → Use URL params (useSearchParams)
```

## 2. Server State: React Query

**Use for:** API data, caching, synchronization

```typescript
// hooks/useUsers.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

// Component
function UserList() {
  const { data, isLoading, error } = useUsers();
  const createMutation = useCreateUser();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div>
      {data.map(user => <UserCard key={user.id} user={user} />)}
      <button onClick={() => createMutation.mutate(newUser)}>
        Add User
      </button>
    </div>
  );
}
```

**Benefits:**
- Automatic caching
- Background refetching
- Optimistic updates
- Request deduplication
- No manual loading/error state

## 3. Local State: useState

**Use for:** Component-specific state

```typescript
function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

## 4. Complex Local State: useReducer

**Use for:** Complex state logic with multiple sub-values

```typescript
type State = {
  count: number;
  step: number;
};

type Action =
  | { type: 'increment' }
  | { type: 'decrement' }
  | { type: 'setStep'; payload: number };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'increment':
      return { ...state, count: state.count + state.step };
    case 'decrement':
      return { ...state, count: state.count - state.step };
    case 'setStep':
      return { ...state, step: action.payload };
    default:
      return state;
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 0, step: 1 });

  return (
    <div>
      <p>Count: {state.count}</p>
      <input
        type="number"
        value={state.step}
        onChange={e => dispatch({ type: 'setStep', payload: +e.target.value })}
      />
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
    </div>
  );
}
```

## 5. Shared State (Small Scope): Context

**Use for:** Theme, locale, auth - shared by few components

```typescript
// contexts/ThemeContext.tsx
interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

// Usage
function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return <button onClick={toggleTheme}>{theme}</button>;
}
```

**⚠️ Context Performance Warning:**
- Every context update re-renders ALL consumers
- Solution: Split contexts or use Zustand

## 6. Global State (Medium Apps): Zustand

**Use for:** Cart, notifications, user preferences

```typescript
// stores/cartStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  total: number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => set((state) => {
        const existing = state.items.find(i => i.id === item.id);
        if (existing) {
          return {
            items: state.items.map(i =>
              i.id === item.id
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
          };
        }
        return { items: [...state.items, { ...item, quantity: 1 }] };
      }),

      removeItem: (id) => set((state) => ({
        items: state.items.filter(i => i.id !== id),
      })),

      clearCart: () => set({ items: [] }),

      get total() {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage', // localStorage key
    }
  )
);

// Component
function Cart() {
  const { items, total, removeItem } = useCartStore();

  return (
    <div>
      {items.map(item => (
        <div key={item.id}>
          {item.name} x {item.quantity}
          <button onClick={() => removeItem(item.id)}>Remove</button>
        </div>
      ))}
      <p>Total: ${total}</p>
    </div>
  );
}

// Only subscribes to total (optimized)
function CartTotal() {
  const total = useCartStore(state => state.total);
  return <p>Total: ${total}</p>;
}
```

**Benefits:**
- Simple API
- No wrapper providers needed
- Built-in devtools
- Middleware support (persist, immer)
- Selective subscriptions (no unnecessary re-renders)

## 7. Global State (Large Apps): Redux Toolkit

**Use for:** Complex apps with many related state slices

```typescript
// store/slices/authSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
}

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }) => {
    const response = await loginApi(credentials);
    return response.data;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, token: null, loading: false } as AuthState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.loading = false;
      })
      .addCase(login.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;

// store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

// Component
function LoginButton() {
  const dispatch = useAppDispatch();
  const { user, loading } = useAppSelector(state => state.auth);

  const handleLogin = () => {
    dispatch(login({ email, password }));
  };

  return <button onClick={handleLogin}>Login</button>;
}
```

## 8. URL State: Search Params

**Use for:** Filters, pagination, search queries

```typescript
// hooks/useFilters.ts
import { useSearchParams } from 'react-router-dom';

export function useFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = {
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || 'all',
    page: parseInt(searchParams.get('page') || '1'),
  };

  const setFilters = (newFilters: Partial<typeof filters>) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) {
        params.set(key, String(value));
      } else {
        params.delete(key);
      }
    });
    setSearchParams(params);
  };

  return { filters, setFilters };
}

// Component
function ProductList() {
  const { filters, setFilters } = useFilters();

  return (
    <div>
      <input
        value={filters.search}
        onChange={e => setFilters({ search: e.target.value, page: 1 })}
      />
      {/* Results shareable via URL */}
    </div>
  );
}
```

## 9. Form State: React Hook Form

**Use for:** Forms (don't use global state!)

```typescript
import { useForm } from 'react-hook-form';

function ProfileForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: user.name,
      email: user.email,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name')} />
      <input {...register('email')} />
    </form>
  );
}
```

## 10. Anti-Patterns to Avoid

### ❌ DON'T: Put server data in global state
```typescript
// Bad: Duplicating server state
const [users, setUsers] = useState([]);
useEffect(() => {
  fetchUsers().then(setUsers);
}, []);

// Good: Use React Query
const { data: users } = useQuery({ queryKey: ['users'], queryFn: fetchUsers });
```

### ❌ DON'T: Use Context for frequently changing values
```typescript
// Bad: Causes many re-renders
<MousePositionContext.Provider value={{ x, y }}>
```

### ❌ DON'T: Over-engineer state
```typescript
// Bad: Redux for a simple toggle
const isOpen = useSelector(state => state.modal.isOpen);

// Good: Local state
const [isOpen, setIsOpen] = useState(false);
```

## 11. State Management Checklist

- [ ] Server data → React Query
- [ ] Local component state → useState
- [ ] Complex local state → useReducer
- [ ] Shared (2-3 components) → Lift state or Context
- [ ] Global (medium app) → Zustand
- [ ] Global (large app) → Redux Toolkit
- [ ] URL filters/pagination → useSearchParams
- [ ] Forms → React Hook Form

## 12. Performance Tips

- Use selective subscriptions in Zustand
- Split contexts by update frequency
- Memoize context values
- Don't put server data in global state
- Keep state as local as possible
