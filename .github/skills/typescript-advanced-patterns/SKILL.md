# TypeScript Advanced Patterns

Fortgeschrittene TypeScript-Patterns und Best-Practices für Type-Safety, Generics, Utility-Types und Design-Patterns.

## Verwendung

Diese Patterns nutzen wenn:
- **Type-Safety** maximiert werden soll
- **Complex Data-Structures** typisiert werden müssen
- **Generic Components/Functions** erstellt werden
- **API-Responses** korrekt getypt werden sollen
- **Runtime-Validation** mit Type-Guards nötig ist

---

## 1. Utility Types

### Eingebaute Utility-Types

#### `Partial<T>` - Alle Properties optional
```typescript
interface User {
  id: string;
  name: string;
  email: string;
}

// Für Updates nur Teile des Users
function updateUser(id: string, updates: Partial<User>) {
  // updates kann: {}, {name: "..."}, {name: "...", email: "..."}, etc. sein
}

updateUser('123', { name: 'John' }); // ✅ OK
```

#### `Required<T>` - Alle Properties required
```typescript
interface Config {
  apiUrl?: string;
  timeout?: number;
}

function validateConfig(config: Required<Config>) {
  // config.apiUrl und config.timeout sind garantiert vorhanden
}
```

#### `Readonly<T>` - Alle Properties immutable
```typescript
interface Settings {
  theme: string;
  language: string;
}

const settings: Readonly<Settings> = {
  theme: 'dark',
  language: 'de'
};

settings.theme = 'light'; // ❌ Error: Cannot assign to 'theme'
```

#### `Pick<T, K>` - Nur bestimmte Properties
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

// Nur Public-Info ohne Password
type PublicUser = Pick<User, 'id' | 'name' | 'email'>;

const user: PublicUser = {
  id: '123',
  name: 'John',
  email: 'john@example.com'
  // password wird nicht exposed ✅
};
```

#### `Omit<T, K>` - Alle außer bestimmte Properties
```typescript
// Selbes wie oben, andere Syntax
type PublicUser = Omit<User, 'password'>;
```

#### `Record<K, T>` - Object mit bestimmten Keys
```typescript
type Status = 'pending' | 'success' | 'error';

// Jeder Status muss einen String-Wert haben
const statusMessages: Record<Status, string> = {
  pending: 'Wird geladen...',
  success: 'Erfolgreich!',
  error: 'Fehler aufgetreten'
};

// ❌ Error, wenn ein Status fehlt oder extra Keys vorhanden
```

#### `Exclude<T, U>` - Union ohne bestimmte Types
```typescript
type AllStatuses = 'idle' | 'loading' | 'success' | 'error';
type ActiveStatuses = Exclude<AllStatuses, 'idle'>; // 'loading' | 'success' | 'error'
```

#### `Extract<T, U>` - Nur bestimmte Types aus Union
```typescript
type AllTypes = string | number | boolean | null;
type PrimitiveTypes = Extract<AllTypes, string | number>; // string | number
```

#### `NonNullable<T>` - Entfernt null und undefined
```typescript
type NullableString = string | null | undefined;
type DefiniteString = NonNullable<NullableString>; // string
```

#### `ReturnType<T>` - Return-Type einer Function
```typescript
function getUser() {
  return { id: '123', name: 'John' };
}

type User = ReturnType<typeof getUser>; // { id: string; name: string; }
```

#### `Parameters<T>` - Parameter-Types einer Function
```typescript
function createUser(name: string, age: number) { }

type CreateUserParams = Parameters<typeof createUser>; // [string, number]
```

---

## 2. Generics

### Basic Generics

```typescript
// Generic Function
function identity<T>(value: T): T {
  return value;
}

const num = identity(42); // Type: number
const str = identity('hello'); // Type: string
```

### Generic Constraints

```typescript
// T muss bestimmte Properties haben
interface HasId {
  id: string;
}

function findById<T extends HasId>(items: T[], id: string): T | undefined {
  return items.find(item => item.id === id);
}

// ✅ OK - User hat id
interface User extends HasId {
  name: string;
}

const users: User[] = [{ id: '1', name: 'John' }];
findById(users, '1');

// ❌ Error - Product hat kein id
interface Product {
  sku: string;
  name: string;
}
const products: Product[] = [];
findById(products, '1'); // Error!
```

### Multiple Generic Parameters

```typescript
function merge<T, U>(obj1: T, obj2: U): T & U {
  return { ...obj1, ...obj2 };
}

const result = merge(
  { name: 'John' },
  { age: 30 }
); // Type: { name: string } & { age: number }
```

### Generic React Components

```typescript
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  keyExtractor: (item: T) => string;
}

export function List<T>({ items, renderItem, keyExtractor }: ListProps<T>) {
  return (
    <ul>
      {items.map(item => (
        <li key={keyExtractor(item)}>
          {renderItem(item)}
        </li>
      ))}
    </ul>
  );
}

// Usage
<List
  items={users}
  renderItem={user => <span>{user.name}</span>}
  keyExtractor={user => user.id}
/>
```

### Generic Custom Hooks

```typescript
function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(url)
      .then(res => res.json())
      .then((data: T) => setData(data))
      .catch(setError)
      .finally(() => setLoading(false));
  }, [url]);

  return { data, error, loading };
}

// Usage
interface User {
  id: string;
  name: string;
}

const { data, error, loading } = useFetch<User>('/api/user');
// data ist jetzt vom Type User | null ✅
```

---

## 3. Discriminated Unions

### Pattern für Type-Safe State-Management

```typescript
// State mit mehreren möglichen Zuständen
type FetchState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };

// Type-Safe Switch
function renderState<T>(state: FetchState<T>) {
  switch (state.status) {
    case 'idle':
      return <div>Start fetching...</div>;

    case 'loading':
      return <div>Loading...</div>;

    case 'success':
      // TypeScript weiß: state.data existiert hier! ✅
      return <div>Data: {JSON.stringify(state.data)}</div>;

    case 'error':
      // TypeScript weiß: state.error existiert hier! ✅
      return <div>Error: {state.error.message}</div>;
  }
}
```

### API-Response-Types

```typescript
type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string; code: number };

async function fetchUser(id: string): Promise<ApiResponse<User>> {
  try {
    const response = await fetch(`/api/users/${id}`);
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      code: 500
    };
  }
}

// Usage
const result = await fetchUser('123');

if (result.success) {
  console.log(result.data.name); // ✅ data ist verfügbar
} else {
  console.error(result.error); // ✅ error ist verfügbar
}
```

---

## 4. Type Guards

### typeof Type-Guards

```typescript
function printValue(value: string | number) {
  if (typeof value === 'string') {
    console.log(value.toUpperCase()); // TS weiß: value ist string
  } else {
    console.log(value.toFixed(2)); // TS weiß: value ist number
  }
}
```

### instanceof Type-Guards

```typescript
class NetworkError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
  }
}

function handleError(error: Error) {
  if (error instanceof NetworkError) {
    console.log('Status:', error.statusCode); // ✅ statusCode verfügbar
  } else {
    console.log('Generic error:', error.message);
  }
}
```

### Custom Type-Guards (Predicates)

```typescript
interface User {
  type: 'user';
  name: string;
}

interface Admin {
  type: 'admin';
  name: string;
  permissions: string[];
}

type Person = User | Admin;

// Custom Type-Guard
function isAdmin(person: Person): person is Admin {
  return person.type === 'admin';
}

function greet(person: Person) {
  console.log(`Hello, ${person.name}`);

  if (isAdmin(person)) {
    // TS weiß: person ist Admin! ✅
    console.log('Permissions:', person.permissions);
  }
}
```

### Array Type-Guards

```typescript
function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(item => typeof item === 'string');
}

const data: unknown = ['a', 'b', 'c'];

if (isStringArray(data)) {
  data.forEach(str => console.log(str.toUpperCase())); // ✅ Type-Safe
}
```

---

## 5. Mapped Types

### Eigene Utility-Types erstellen

```typescript
// Macht alle Properties nullable
type Nullable<T> = {
  [K in keyof T]: T[K] | null;
};

interface User {
  id: string;
  name: string;
  age: number;
}

type NullableUser = Nullable<User>;
// { id: string | null; name: string | null; age: number | null; }
```

### Optional & Readonly kombinieren

```typescript
type OptionalReadonly<T> = {
  readonly [K in keyof T]?: T[K];
};

const config: OptionalReadonly<User> = {
  name: 'John'
};

config.name = 'Jane'; // ❌ Error: readonly
```

### Conditional Mapped Types

```typescript
// Nur String-Properties
type StringProperties<T> = {
  [K in keyof T as T[K] extends string ? K : never]: T[K];
};

interface Mixed {
  id: string;
  name: string;
  age: number;
  active: boolean;
}

type OnlyStrings = StringProperties<Mixed>; // { id: string; name: string; }
```

---

## 6. Template Literal Types

### String-Patterns typisieren

```typescript
type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
type Endpoint = '/users' | '/products' | '/orders';

type APIRoute = `${HTTPMethod} ${Endpoint}`;
// 'GET /users' | 'GET /products' | 'GET /orders' |
// 'POST /users' | ... (alle Kombinationen)

function apiCall(route: APIRoute) {
  // route kann nur gültige HTTP-Method + Endpoint Kombinationen sein ✅
}

apiCall('GET /users'); // ✅ OK
apiCall('GET /invalid'); // ❌ Error
```

### Event-Handler-Types

```typescript
type EventName = 'click' | 'focus' | 'blur';
type EventHandler = `on${Capitalize<EventName>}`;
// 'onClick' | 'onFocus' | 'onBlur'

type EventHandlers = {
  [K in EventHandler]: () => void;
};

const handlers: EventHandlers = {
  onClick: () => console.log('clicked'),
  onFocus: () => console.log('focused'),
  onBlur: () => console.log('blurred')
};
```

---

## 7. Branded Types (Type-Safety für Primitives)

### Problem: String-IDs nicht unterscheidbar

```typescript
// ❌ Problem
function getUser(userId: string) { }
function getProduct(productId: string) { }

const userId = '123';
const productId = '456';

getUser(productId); // ❌ Compiles, aber falsch!
```

### Lösung: Branded Types

```typescript
// Branded Types
type UserId = string & { readonly __brand: 'UserId' };
type ProductId = string & { readonly __brand: 'ProductId' };

// Helper-Functions
function createUserId(id: string): UserId {
  return id as UserId;
}

function createProductId(id: string): ProductId {
  return id as ProductId;
}

// Type-Safe Functions
function getUser(userId: UserId) { }
function getProduct(productId: ProductId) { }

const userId = createUserId('123');
const productId = createProductId('456');

getUser(userId); // ✅ OK
getUser(productId); // ❌ Error: Type mismatch!
```

---

## 8. Conditional Types

### Type basierend auf Condition

```typescript
type IsString<T> = T extends string ? 'yes' : 'no';

type A = IsString<string>; // 'yes'
type B = IsString<number>; // 'no'
```

### Praktisches Beispiel: Array-Unwrapping

```typescript
type Unwrap<T> = T extends Array<infer U> ? U : T;

type A = Unwrap<string[]>; // string
type B = Unwrap<number>; // number
```

### Nested Conditional Types

```typescript
type DeepReadonly<T> = T extends object
  ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
  : T;

interface Nested {
  user: {
    profile: {
      name: string;
    };
  };
}

const data: DeepReadonly<Nested> = {
  user: {
    profile: {
      name: 'John'
    }
  }
};

data.user.profile.name = 'Jane'; // ❌ Error: readonly at all levels!
```

---

## 9. infer Keyword

### Type aus Generic extrahieren

```typescript
// Extrahiere Return-Type
type GetReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

function getUser() {
  return { id: '123', name: 'John' };
}

type User = GetReturnType<typeof getUser>; // { id: string; name: string }
```

### Promise-Unwrapping

```typescript
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

type A = UnwrapPromise<Promise<string>>; // string
type B = UnwrapPromise<number>; // number
```

---

## 10. Best Practices

### ✅ DO: Prefer Interfaces over Types (für Objects)

```typescript
// ✅ Prefer
interface User {
  id: string;
  name: string;
}

// ❌ Avoid (außer für Unions/Intersections)
type User = {
  id: string;
  name: string;
};
```

**Warum?** Interfaces sind erweiterbar und besser für Object-Shapes.

### ✅ DO: Use Types for Unions/Intersections

```typescript
// ✅ Correct usage
type Status = 'idle' | 'loading' | 'success' | 'error';
type Composite = UserProps & ThemeProps;
```

### ✅ DO: Avoid `any`, use `unknown`

```typescript
// ❌ Bad
function process(data: any) {
  return data.value; // No type-safety!
}

// ✅ Good
function process(data: unknown) {
  if (typeof data === 'object' && data !== null && 'value' in data) {
    return (data as { value: unknown }).value;
  }
  throw new Error('Invalid data');
}
```

### ✅ DO: Use Const Assertions

```typescript
// ❌ Type: string[]
const colors1 = ['red', 'green', 'blue'];

// ✅ Type: readonly ['red', 'green', 'blue']
const colors2 = ['red', 'green', 'blue'] as const;

// Jetzt kann man exact types haben
type Color = typeof colors2[number]; // 'red' | 'green' | 'blue'
```

### ✅ DO: Use Discriminated Unions for Complex State

```typescript
// ✅ Type-Safe
type State =
  | { status: 'loading' }
  | { status: 'success'; data: string }
  | { status: 'error'; error: Error };

// ❌ Not Type-Safe
type State = {
  status: 'loading' | 'success' | 'error';
  data?: string;
  error?: Error;
};
```

### ✅ DO: Use satisfies Operator (TS 4.9+)

```typescript
type Route = {
  path: string;
  component: React.ComponentType;
};

// ✅ Type-check without losing literal types
const routes = {
  home: { path: '/', component: HomePage },
  about: { path: '/about', component: AboutPage }
} satisfies Record<string, Route>;

// routes.home.path ist still '/', nicht string! ✅
```

---

## 11. Performance-Tipps

### ❌ Avoid: Deep Nested Generics

```typescript
// ❌ Slow compilation
type DeepNested<T> = T extends object
  ? { [K in keyof T]: DeepNested<T[K]> }
  : T;
```

### ✅ Use: Simpler Types wo möglich

```typescript
// ✅ Faster
type SimpleObject = {
  [key: string]: unknown;
};
```

---

## 12. Real-World Patterns

### API-Client mit Type-Safety

```typescript
interface ApiEndpoints {
  '/users': {
    GET: { response: User[] };
    POST: { body: CreateUserDto; response: User };
  };
  '/users/:id': {
    GET: { response: User };
    PUT: { body: UpdateUserDto; response: User };
    DELETE: { response: void };
  };
}

async function apiRequest<
  Path extends keyof ApiEndpoints,
  Method extends keyof ApiEndpoints[Path]
>(
  path: Path,
  method: Method,
  ...args: 'body' extends keyof ApiEndpoints[Path][Method]
    ? [ApiEndpoints[Path][Method]['body']]
    : []
): Promise<ApiEndpoints[Path][Method]['response']> {
  // Implementation...
  return {} as any;
}

// Usage - Fully Type-Safe! ✅
const users = await apiRequest('/users', 'GET');
// users ist User[]

const newUser = await apiRequest('/users', 'POST', {
  name: 'John',
  email: 'john@example.com'
});
// newUser ist User
```

---

**Remember**: TypeScript ist ein Tool für bessere Developer-Experience. Nicht over-engineer, aber nutze die Power für **echte Type-Safety**! 🚀
