import { createClient } from '@sanity/client';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN || '',
  useCdn: false,
});

interface TopicSeed {
  _type: 'topic';
  name: string;
  slug: { _type: 'slug'; current: string };
  icon: string;
  description: string;
  color: string;
}

interface CodeSnippetSeed {
  _key: string;
  _type: 'codeSnippet';
  title: string;
  language: string;
  code: string;
  explanation: string;
}

interface TutorialSeed {
  _type: 'tutorial';
  title: string;
  slug: { _type: 'slug'; current: string };
  topic: { _type: 'reference'; _ref: string };
  difficulty: string;
  content: string;
  codeExamples: CodeSnippetSeed[];
  tags: string[];
  lastVerified: string;
}

const topics: (TopicSeed & { _id: string })[] = [
  {
    _id: 'topic-react',
    _type: 'topic',
    name: 'React',
    slug: { _type: 'slug', current: 'react' },
    icon: '⚛️',
    description: 'A JavaScript library for building user interfaces',
    color: '#61DAFB',
  },
  {
    _id: 'topic-nextjs',
    _type: 'topic',
    name: 'Next.js',
    slug: { _type: 'slug', current: 'nextjs' },
    icon: '▲',
    description: 'The React Framework for Production',
    color: '#000000',
  },
  {
    _id: 'topic-typescript',
    _type: 'topic',
    name: 'TypeScript',
    slug: { _type: 'slug', current: 'typescript' },
    icon: '🔷',
    description: 'Typed superset of JavaScript',
    color: '#3178C6',
  },
  {
    _id: 'topic-nodejs',
    _type: 'topic',
    name: 'Node.js',
    slug: { _type: 'slug', current: 'nodejs' },
    icon: '🟢',
    description: 'JavaScript runtime built on Chrome V8 engine',
    color: '#339933',
  },
  {
    _id: 'topic-css',
    _type: 'topic',
    name: 'CSS',
    slug: { _type: 'slug', current: 'css' },
    icon: '🎨',
    description: 'Cascading Style Sheets for styling web pages',
    color: '#1572B6',
  },
  {
    _id: 'topic-git',
    _type: 'topic',
    name: 'Git',
    slug: { _type: 'slug', current: 'git' },
    icon: '🔀',
    description: 'Distributed version control system',
    color: '#F05032',
  },
  {
    _id: 'topic-javascript',
    _type: 'topic',
    name: 'JavaScript',
    slug: { _type: 'slug', current: 'javascript' },
    icon: '🟨',
    description: 'High-level, dynamic programming language for the web',
    color: '#F7DF1E',
  },
];

const tutorials: (TutorialSeed & { _id: string })[] = [
  // ===== REACT TUTORIALS =====
  {
    _id: 'tutorial-react-useeffect',
    _type: 'tutorial',
    title: 'Understanding React useEffect Hook',
    slug: { _type: 'slug', current: 'react-useeffect' },
    topic: { _type: 'reference', _ref: 'topic-react' },
    difficulty: 'beginner',
    content: `The useEffect hook lets you perform side effects in functional components. It serves the same purpose as componentDidMount, componentDidUpdate, and componentWillUnmount in React class components, but unified into a single API.

## When to use useEffect
- Fetching data from an API
- Setting up subscriptions or event listeners
- Manually changing the DOM
- Setting up timers (setTimeout, setInterval)
- Logging

## How it works
useEffect accepts two arguments: a callback function (the effect) and an optional dependency array.

The effect runs after every render by default. You can control when it runs by providing a dependency array:
- No dependency array: runs after every render
- Empty array []: runs only once after initial render (mount)
- Array with values [a, b]: runs when any dependency changes

## Cleanup
If your effect creates a subscription or timer, you should clean it up by returning a cleanup function from the effect. The cleanup function runs before the component unmounts and before the effect runs again (if dependencies changed).

## Common mistakes
1. Missing dependencies in the dependency array
2. Not cleaning up subscriptions/timers
3. Creating infinite loops by updating state that's in the dependency array
4. Using objects/arrays as dependencies without memoization`,
    codeExamples: [
      {
        _key: 'ce1',
        _type: 'codeSnippet',
        title: 'Basic useEffect',
        language: 'typescript',
        code: `import { useEffect, useState } from 'react';

function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // This runs when userId changes
    fetch(\`/api/users/\${userId}\`)
      .then(res => res.json())
      .then(data => setUser(data));
  }, [userId]); // Only re-run when userId changes

  return <div>{user ? user.name : 'Loading...'}</div>;
}`,
        explanation: 'This example fetches user data whenever the userId prop changes. The dependency array [userId] ensures the effect only re-runs when userId changes.',
      },
      {
        _key: 'ce2',
        _type: 'codeSnippet',
        title: 'useEffect with Cleanup',
        language: 'typescript',
        code: `import { useEffect, useState } from 'react';

function Timer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);

    // Cleanup function - runs on unmount
    return () => clearInterval(interval);
  }, []); // Empty array = run once on mount

  return <p>Seconds: {seconds}</p>;
}`,
        explanation: 'The cleanup function (return () => clearInterval(interval)) prevents memory leaks by clearing the interval when the component unmounts.',
      },
    ],
    tags: ['react', 'hooks', 'useEffect', 'side-effects', 'lifecycle'],
    lastVerified: '2024-12-01T00:00:00Z',
  },
  {
    _id: 'tutorial-react-usestate',
    _type: 'tutorial',
    title: 'React useState Hook — Complete Guide',
    slug: { _type: 'slug', current: 'react-usestate' },
    topic: { _type: 'reference', _ref: 'topic-react' },
    difficulty: 'beginner',
    content: `useState is the most fundamental React hook. It lets you add state to functional components.

## Syntax
const [state, setState] = useState(initialValue);

- state: the current state value
- setState: function to update the state
- initialValue: the initial state (can be any type)

## Key Rules
1. Always call useState at the top level of your component
2. Never call it inside loops, conditions, or nested functions
3. State updates are asynchronous and batched
4. Setting state triggers a re-render

## Updating State
- For simple values: setState(newValue)
- For updates based on previous state: setState(prev => prev + 1)
- For objects: setState(prev => ({ ...prev, key: newValue }))
- For arrays: setState(prev => [...prev, newItem])

## Lazy Initialization
If the initial state is expensive to compute, pass a function: useState(() => computeExpensiveValue())

## Common Patterns
- Toggle boolean: setState(prev => !prev)
- Counter: setState(prev => prev + 1)
- Form inputs: setState(e.target.value)
- Array operations: filter, map, spread to create new arrays`,
    codeExamples: [
      {
        _key: 'ce1',
        _type: 'codeSnippet',
        title: 'Counter with useState',
        language: 'typescript',
        code: `import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(prev => prev + 1)}>
        Increment
      </button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}`,
        explanation: 'Using the functional update form (prev => prev + 1) ensures we always increment from the latest state value, which is important for batched updates.',
      },
    ],
    tags: ['react', 'hooks', 'useState', 'state-management'],
    lastVerified: '2024-12-01T00:00:00Z',
  },
  {
    _id: 'tutorial-react-components',
    _type: 'tutorial',
    title: 'React Components and Props',
    slug: { _type: 'slug', current: 'react-components-props' },
    topic: { _type: 'reference', _ref: 'topic-react' },
    difficulty: 'beginner',
    content: `Components are the building blocks of any React application. They let you split the UI into independent, reusable pieces.

## Function Components
The recommended way to write React components is as functions that return JSX.

## Props
Props (short for properties) are how you pass data from parent to child components.
- Props are read-only — a component must never modify its own props
- Props can be any JavaScript value: strings, numbers, objects, arrays, functions, even other components

## Children
The special children prop contains whatever you put between the opening and closing tags of a component.

## Default Props
You can set default values for props using JavaScript default parameters.

## Prop Destructuring
Always destructure props in the function parameters for cleaner code.

## Component Composition
Build complex UIs by composing smaller components together. Think of components as LEGO blocks.`,
    codeExamples: [
      {
        _key: 'ce1',
        _type: 'codeSnippet',
        title: 'Component with Props',
        language: 'typescript',
        code: `interface CardProps {
  title: string;
  description: string;
  variant?: 'default' | 'highlighted';
  children?: React.ReactNode;
}

function Card({ title, description, variant = 'default', children }: CardProps) {
  return (
    <div className={variant === 'highlighted' ? 'card-highlight' : 'card'}>
      <h2>{title}</h2>
      <p>{description}</p>
      {children}
    </div>
  );
}

// Usage
<Card title="Hello" description="World" variant="highlighted">
  <button>Click me</button>
</Card>`,
        explanation: 'TypeScript interface defines the shape of props. Optional props use ? and can have default values via destructuring defaults.',
      },
    ],
    tags: ['react', 'components', 'props', 'composition', 'jsx'],
    lastVerified: '2024-12-01T00:00:00Z',
  },
  // ===== NEXT.JS TUTORIALS =====
  {
    _id: 'tutorial-nextjs-app-router',
    _type: 'tutorial',
    title: 'Next.js App Router — Complete Guide',
    slug: { _type: 'slug', current: 'nextjs-app-router' },
    topic: { _type: 'reference', _ref: 'topic-nextjs' },
    difficulty: 'intermediate',
    content: `The App Router is the modern routing system in Next.js (introduced in v13). It uses file-system based routing inside the app/ directory.

## Key Concepts
- Folders define routes (app/about/page.tsx → /about)
- page.tsx makes a route publicly accessible
- layout.tsx wraps pages with shared UI
- loading.tsx shows loading state
- error.tsx handles errors
- not-found.tsx handles 404s

## Server Components (Default)
In the App Router, all components are Server Components by default. They run on the server and can:
- Directly access databases
- Use async/await at the component level
- Reduce client-side JavaScript bundle

## Client Components
Add 'use client' at the top of a file to make it a Client Component. Use these when you need:
- useState, useEffect, or other hooks
- Event handlers (onClick, onChange)
- Browser-only APIs

## Route Groups
Use (folderName) to organize routes without affecting the URL structure.

## Dynamic Routes
Use [paramName] for dynamic segments: app/blog/[slug]/page.tsx

## API Routes
Create API endpoints in app/api/route.ts files using Route Handlers.`,
    codeExamples: [
      {
        _key: 'ce1',
        _type: 'codeSnippet',
        title: 'Page with Layout',
        language: 'typescript',
        code: `// app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <nav>My App</nav>
        {children}
      </body>
    </html>
  );
}

// app/page.tsx
export default function Home() {
  return <h1>Welcome to my app!</h1>;
}

// app/about/page.tsx
export default function About() {
  return <h1>About Us</h1>;
}`,
        explanation: 'The layout wraps all pages. The nav element appears on every page. Each page.tsx defines the unique content for that route.',
      },
    ],
    tags: ['nextjs', 'app-router', 'routing', 'server-components', 'layouts'],
    lastVerified: '2024-12-01T00:00:00Z',
  },
  {
    _id: 'tutorial-nextjs-api-routes',
    _type: 'tutorial',
    title: 'Next.js API Routes (Route Handlers)',
    slug: { _type: 'slug', current: 'nextjs-api-routes' },
    topic: { _type: 'reference', _ref: 'topic-nextjs' },
    difficulty: 'intermediate',
    content: `Route Handlers allow you to create API endpoints using the Web Request and Response APIs. They are defined in route.ts files inside the app/ directory.

## Creating a Route Handler
Create a file at app/api/your-endpoint/route.ts and export HTTP method functions (GET, POST, PUT, DELETE, PATCH).

## Request Object
The NextRequest object extends the Web Request API with additional convenience methods like nextUrl for easy URL parsing and cookies().

## Response
Use NextResponse to return JSON, set headers, cookies, and status codes.

## Dynamic Route Handlers
Use [param] folders: app/api/users/[id]/route.ts

## Best Practices
- Validate input data before processing
- Use proper HTTP status codes
- Handle errors gracefully with try/catch
- Don't use Route Handlers to fetch data in Server Components (call the function directly instead)`,
    codeExamples: [
      {
        _key: 'ce1',
        _type: 'codeSnippet',
        title: 'REST API Route Handler',
        language: 'typescript',
        code: `import { NextRequest, NextResponse } from 'next/server';

// GET /api/users
export async function GET() {
  const users = await db.user.findMany();
  return NextResponse.json(users);
}

// POST /api/users
export async function POST(request: NextRequest) {
  const body = await request.json();

  if (!body.name || !body.email) {
    return NextResponse.json(
      { error: 'Name and email are required' },
      { status: 400 }
    );
  }

  const user = await db.user.create({ data: body });
  return NextResponse.json(user, { status: 201 });
}`,
        explanation: 'Each exported function handles a specific HTTP method. NextRequest provides the request body, and NextResponse.json() returns JSON with proper headers.',
      },
    ],
    tags: ['nextjs', 'api', 'route-handlers', 'rest', 'backend'],
    lastVerified: '2024-12-01T00:00:00Z',
  },
  // ===== TYPESCRIPT TUTORIALS =====
  {
    _id: 'tutorial-ts-generics',
    _type: 'tutorial',
    title: 'TypeScript Generics Explained',
    slug: { _type: 'slug', current: 'typescript-generics' },
    topic: { _type: 'reference', _ref: 'topic-typescript' },
    difficulty: 'intermediate',
    content: `Generics allow you to write reusable code that works with different types while maintaining type safety. They are like type parameters for your functions, classes, and interfaces.

## Why Generics?
Without generics, you'd have to either:
1. Use 'any' (loses type safety)
2. Write duplicate code for each type

Generics solve this by letting you write code that works with ANY type while preserving type information.

## Basic Syntax
Use angle brackets <T> to declare a type parameter. T is a convention but you can use any name.

## Generic Constraints
Use 'extends' to limit what types can be used: <T extends string | number>

## Common Patterns
- Generic functions: function identity<T>(arg: T): T
- Generic interfaces: interface Box<T> { value: T }
- Generic classes: class Container<T> { ... }
- Multiple type parameters: function pair<A, B>(a: A, b: B): [A, B]

## Built-in Generics
- Array<T> or T[]
- Promise<T>
- Record<K, V>
- Map<K, V>
- Set<T>

## Utility Types (Generic)
- Partial<T> — makes all properties optional
- Required<T> — makes all properties required
- Pick<T, K> — selects specific properties
- Omit<T, K> — removes specific properties
- Readonly<T> — makes all properties readonly`,
    codeExamples: [
      {
        _key: 'ce1',
        _type: 'codeSnippet',
        title: 'Generic Function',
        language: 'typescript',
        code: `// Generic function that works with any type
function firstElement<T>(arr: T[]): T | undefined {
  return arr[0];
}

const num = firstElement([1, 2, 3]);      // type: number
const str = firstElement(['a', 'b']);       // type: string

// Generic with constraint
function getLength<T extends { length: number }>(item: T): number {
  return item.length;
}

getLength("hello");     // ✅ string has length
getLength([1, 2, 3]);   // ✅ array has length
// getLength(42);       // ❌ number doesn't have length

// Generic interface
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

const userResponse: ApiResponse<{ name: string; email: string }> = {
  data: { name: 'John', email: 'john@example.com' },
  status: 200,
  message: 'Success',
};`,
        explanation: 'The type parameter T is inferred from the argument. Constraints (extends) limit T to types with specific properties. Generic interfaces let you define reusable type shapes.',
      },
    ],
    tags: ['typescript', 'generics', 'types', 'type-safety', 'reusability'],
    lastVerified: '2024-12-01T00:00:00Z',
  },
  {
    _id: 'tutorial-ts-interfaces-types',
    _type: 'tutorial',
    title: 'TypeScript Interfaces vs Type Aliases',
    slug: { _type: 'slug', current: 'typescript-interfaces-vs-types' },
    topic: { _type: 'reference', _ref: 'topic-typescript' },
    difficulty: 'beginner',
    content: `Both interfaces and type aliases define the shape of objects in TypeScript, but they have key differences.

## Interface
- Use 'interface' keyword
- Can be extended with 'extends'
- Can be merged (declaration merging)
- Best for defining object shapes and class contracts
- Can only describe object types

## Type Alias
- Use 'type' keyword
- Can represent ANY type (primitives, unions, tuples, etc.)
- Cannot be merged
- More flexible than interfaces
- Use '&' for intersection (combining types)

## When to Use What
- Use interfaces for: object shapes, class contracts, public APIs
- Use types for: unions, intersections, mapped types, utility types, primitives

## Best Practice
Pick one and be consistent. Many teams prefer interfaces for objects and types for everything else.`,
    codeExamples: [
      {
        _key: 'ce1',
        _type: 'codeSnippet',
        title: 'Interface vs Type',
        language: 'typescript',
        code: `// Interface - for object shapes
interface User {
  name: string;
  email: string;
}

interface Admin extends User {
  role: 'admin';
  permissions: string[];
}

// Type - for unions and complex types
type Status = 'active' | 'inactive' | 'pending';
type ID = string | number;

type UserWithStatus = User & {
  status: Status;
};

// Both work for objects
interface Point2D { x: number; y: number; }
type Point3D = Point2D & { z: number };`,
        explanation: 'Interfaces use extends for inheritance, types use & for intersection. Types can represent unions (|) which interfaces cannot.',
      },
    ],
    tags: ['typescript', 'interfaces', 'types', 'type-aliases'],
    lastVerified: '2024-12-01T00:00:00Z',
  },
  // ===== NODE.JS TUTORIALS =====
  {
    _id: 'tutorial-nodejs-rest-api',
    _type: 'tutorial',
    title: 'Building a REST API with Node.js',
    slug: { _type: 'slug', current: 'nodejs-rest-api' },
    topic: { _type: 'reference', _ref: 'topic-nodejs' },
    difficulty: 'intermediate',
    content: `Building a REST API is one of the most common tasks in Node.js development. This tutorial covers creating a basic REST API using the built-in http module and then with Express.js.

## REST Principles
- Use HTTP methods: GET (read), POST (create), PUT (update), DELETE (remove)
- Use proper status codes: 200 OK, 201 Created, 400 Bad Request, 404 Not Found, 500 Server Error
- Use JSON for data exchange
- Resources are represented by URLs: /api/users, /api/users/:id

## Express.js Setup
Express is the most popular Node.js web framework. Install with: npm install express

## Middleware
Middleware functions process requests before they reach route handlers. Common middleware:
- express.json() — parses JSON request bodies
- cors() — enables Cross-Origin Resource Sharing
- morgan() — HTTP request logging

## Error Handling
Always use try/catch and send appropriate error responses. Create a global error handler middleware.

## Best Practices
- Validate input data
- Use environment variables for configuration
- Separate routes, controllers, and models
- Use async/await for asynchronous operations
- Add proper error handling at every level`,
    codeExamples: [
      {
        _key: 'ce1',
        _type: 'codeSnippet',
        title: 'Express REST API',
        language: 'typescript',
        code: `import express from 'express';

const app = express();
app.use(express.json());

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

let todos: Todo[] = [];
let nextId = 1;

// GET all todos
app.get('/api/todos', (req, res) => {
  res.json(todos);
});

// POST create todo
app.post('/api/todos', (req, res) => {
  const { title } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }
  const todo: Todo = { id: nextId++, title, completed: false };
  todos.push(todo);
  res.status(201).json(todo);
});

// PUT update todo
app.put('/api/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todos.find(t => t.id === id);
  if (!todo) return res.status(404).json({ error: 'Not found' });
  Object.assign(todo, req.body);
  res.json(todo);
});

// DELETE todo
app.delete('/api/todos/:id', (req, res) => {
  todos = todos.filter(t => t.id !== parseInt(req.params.id));
  res.status(204).send();
});

app.listen(3000, () => console.log('Server running on port 3000'));`,
        explanation: 'A complete CRUD REST API using Express.js with proper HTTP methods, status codes, and input validation.',
      },
    ],
    tags: ['nodejs', 'express', 'rest-api', 'backend', 'crud'],
    lastVerified: '2024-12-01T00:00:00Z',
  },
  // ===== CSS TUTORIALS =====
  {
    _id: 'tutorial-css-grid',
    _type: 'tutorial',
    title: 'CSS Grid Layout — Complete Guide',
    slug: { _type: 'slug', current: 'css-grid-layout' },
    topic: { _type: 'reference', _ref: 'topic-css' },
    difficulty: 'beginner',
    content: `CSS Grid is a two-dimensional layout system that lets you create complex layouts with rows and columns.

## Grid Container
Apply display: grid to a container element. Its direct children become grid items.

## Key Properties (Container)
- grid-template-columns: defines column sizes
- grid-template-rows: defines row sizes
- gap (or grid-gap): space between items
- grid-template-areas: named grid areas
- justify-items: horizontal alignment of items
- align-items: vertical alignment of items

## Key Properties (Items)
- grid-column: which columns the item spans
- grid-row: which rows the item spans
- grid-area: name for area-based placement

## Sizing Units
- fr: fractional unit (1fr = 1 fraction of available space)
- px, rem, %: fixed/relative units
- auto: sized to content
- minmax(min, max): responsive sizing
- repeat(count, size): shorthand for repeated tracks

## Common Patterns
- Holy Grail Layout: header, sidebar, main, sidebar, footer
- Card Grid: responsive grid of cards with auto-fill/auto-fit
- Dashboard: complex multi-area layout with named areas

## Grid vs Flexbox
- Grid: 2D layouts (rows AND columns)
- Flexbox: 1D layouts (row OR column)
- Use both together for best results`,
    codeExamples: [
      {
        _key: 'ce1',
        _type: 'codeSnippet',
        title: 'Responsive Card Grid',
        language: 'css',
        code: `.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  padding: 1.5rem;
}

/* Dashboard layout with named areas */
.dashboard {
  display: grid;
  grid-template-columns: 250px 1fr;
  grid-template-rows: 60px 1fr 40px;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
  min-height: 100vh;
}

.header  { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main    { grid-area: main; }
.footer  { grid-area: footer; }`,
        explanation: 'auto-fill with minmax creates a responsive grid that adapts to screen width. Named grid areas make complex layouts readable and maintainable.',
      },
    ],
    tags: ['css', 'grid', 'layout', 'responsive', 'flexbox'],
    lastVerified: '2024-12-01T00:00:00Z',
  },
  {
    _id: 'tutorial-css-flexbox',
    _type: 'tutorial',
    title: 'CSS Flexbox — Complete Guide',
    slug: { _type: 'slug', current: 'css-flexbox' },
    topic: { _type: 'reference', _ref: 'topic-css' },
    difficulty: 'beginner',
    content: `Flexbox is a one-dimensional layout model for distributing space and aligning items within a container.

## Flex Container
Apply display: flex to make a container a flex container. Direct children become flex items.

## Main Axis vs Cross Axis
- flex-direction: row → main axis is horizontal, cross axis is vertical
- flex-direction: column → main axis is vertical, cross axis is horizontal

## Container Properties
- flex-direction: row | column | row-reverse | column-reverse
- justify-content: alignment along main axis (flex-start, center, space-between, space-around, space-evenly)
- align-items: alignment along cross axis (flex-start, center, stretch, baseline)
- flex-wrap: wrap | nowrap
- gap: space between items

## Item Properties
- flex-grow: how much the item should grow (0 = don't grow)
- flex-shrink: how much the item should shrink (1 = can shrink)
- flex-basis: initial size before growing/shrinking
- flex: shorthand (grow shrink basis), e.g., flex: 1 = flex: 1 1 0%
- align-self: override align-items for this item
- order: visual order of the item

## Common Patterns
- Centering: justify-content: center + align-items: center
- Navbar: justify-content: space-between
- Sticky footer: flex: 1 on main content
- Equal columns: flex: 1 on each column`,
    codeExamples: [
      {
        _key: 'ce1',
        _type: 'codeSnippet',
        title: 'Flexbox Centering and Navbar',
        language: 'css',
        code: `/* Perfect centering */
.center-content {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

/* Navbar with logo left, links right */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
}

/* Equal width columns */
.columns {
  display: flex;
  gap: 1rem;
}
.columns > * {
  flex: 1;
}

/* Sticky footer layout */
.page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.page main {
  flex: 1; /* Takes all available space */
}`,
        explanation: 'Flexbox makes common layout patterns simple. justify-content handles the main axis, align-items handles the cross axis. flex: 1 makes items grow equally.',
      },
    ],
    tags: ['css', 'flexbox', 'layout', 'alignment', 'responsive'],
    lastVerified: '2024-12-01T00:00:00Z',
  },
  // ===== GIT TUTORIALS =====
  {
    _id: 'tutorial-git-merge-conflicts',
    _type: 'tutorial',
    title: 'How to Resolve Git Merge Conflicts',
    slug: { _type: 'slug', current: 'git-merge-conflicts' },
    topic: { _type: 'reference', _ref: 'topic-git' },
    difficulty: 'intermediate',
    content: `Merge conflicts occur when Git cannot automatically resolve differences between two commits. This happens when the same lines of a file were changed in both branches being merged.

## When Conflicts Happen
- Merging branches: git merge feature-branch
- Rebasing: git rebase main
- Pulling: git pull (if remote has conflicting changes)
- Cherry-picking: git cherry-pick <commit>

## Conflict Markers
Git marks conflicts in files with special markers:
<<<<<<< HEAD (your changes)
=======
>>>>>>> branch-name (their changes)

## Resolution Steps
1. Run git status to see which files have conflicts
2. Open each conflicted file
3. Look for <<<<<<< markers
4. Decide which changes to keep (yours, theirs, or both)
5. Remove the conflict markers
6. git add the resolved files
7. git commit (or git rebase --continue)

## Prevention Tips
- Pull/rebase frequently to stay up-to-date
- Keep branches small and focused
- Communicate with your team about which files you're changing
- Use git diff before merging to preview changes

## Useful Commands
- git merge --abort: cancel a merge
- git diff: see what changed
- git log --merge: show commits that cause conflicts
- git checkout --theirs file.txt: accept all their changes
- git checkout --ours file.txt: accept all our changes`,
    codeExamples: [
      {
        _key: 'ce1',
        _type: 'codeSnippet',
        title: 'Resolving a Merge Conflict',
        language: 'bash',
        code: `# Start a merge
git merge feature-branch
# CONFLICT (content): Merge conflict in src/app.ts

# Check which files have conflicts
git status

# Open the conflicted file and you'll see:
# <<<<<<< HEAD
# const greeting = "Hello World";
# =======
# const greeting = "Hi there!";
# >>>>>>> feature-branch

# Edit the file to resolve (keep what you want):
# const greeting = "Hello World!";

# Stage the resolved file
git add src/app.ts

# Complete the merge
git commit -m "Merge feature-branch, resolved greeting conflict"`,
        explanation: 'The process is: identify conflicts (git status) → edit files to remove markers and choose the right code → stage (git add) → commit. Always test after resolving!',
      },
    ],
    tags: ['git', 'merge', 'conflicts', 'branching', 'version-control'],
    lastVerified: '2024-12-01T00:00:00Z',
  },
  {
    _id: 'tutorial-git-basics',
    _type: 'tutorial',
    title: 'Git Basics — Essential Commands',
    slug: { _type: 'slug', current: 'git-basics' },
    topic: { _type: 'reference', _ref: 'topic-git' },
    difficulty: 'beginner',
    content: `Git is a distributed version control system. Here are the essential commands every developer needs to know.

## Setup
- git init: initialize a new repository
- git clone <url>: clone a remote repository
- git config: set your name and email

## Daily Workflow
- git status: check what's changed
- git add <file>: stage changes (or git add . for all)
- git commit -m "message": save staged changes
- git push: upload commits to remote
- git pull: download and merge remote changes

## Branching
- git branch: list branches
- git branch <name>: create a new branch
- git checkout <branch> or git switch <branch>: switch branches
- git checkout -b <name>: create and switch in one step
- git merge <branch>: merge a branch into current branch
- git branch -d <name>: delete a branch

## History
- git log: view commit history
- git log --oneline: compact history
- git diff: see unstaged changes
- git diff --staged: see staged changes

## Undoing
- git restore <file>: discard unstaged changes
- git restore --staged <file>: unstage a file
- git reset HEAD~1: undo last commit (keep changes)
- git revert <commit>: create a new commit that undoes changes`,
    codeExamples: [
      {
        _key: 'ce1',
        _type: 'codeSnippet',
        title: 'Common Git Workflow',
        language: 'bash',
        code: `# Start a new feature
git checkout -b feature/add-login

# Make changes, then stage and commit
git add .
git commit -m "Add login form component"

# Push to remote
git push -u origin feature/add-login

# After review, merge to main
git checkout main
git pull origin main
git merge feature/add-login
git push origin main

# Clean up
git branch -d feature/add-login`,
        explanation: 'This is the standard feature branch workflow: create a branch, make changes, push, merge to main, and clean up the branch.',
      },
    ],
    tags: ['git', 'basics', 'commands', 'version-control', 'workflow'],
    lastVerified: '2024-12-01T00:00:00Z',
  },
  // ===== JAVASCRIPT TUTORIALS =====
  {
    _id: 'tutorial-js-async-await',
    _type: 'tutorial',
    title: 'JavaScript Async/Await Explained',
    slug: { _type: 'slug', current: 'javascript-async-await' },
    topic: { _type: 'reference', _ref: 'topic-javascript' },
    difficulty: 'intermediate',
    content: `Async/await is syntactic sugar over Promises that makes asynchronous code look and behave like synchronous code.

## async Functions
- Add 'async' before a function declaration
- An async function always returns a Promise
- Inside an async function, you can use 'await'

## await Keyword
- Can only be used inside async functions (or top-level in modules)
- Pauses execution until the Promise resolves
- Returns the resolved value
- If the Promise rejects, it throws an error

## Error Handling
Use try/catch blocks to handle errors in async functions. This is the recommended pattern over .catch().

## Common Patterns
- Sequential: await one after another
- Parallel: Promise.all([...]) for independent operations
- Race: Promise.race([...]) for first to complete

## Pitfalls
1. Forgetting to await (returns a Promise instead of the value)
2. Using await in a loop (runs sequentially, use Promise.all for parallel)
3. Not handling errors (unhandled promise rejection)
4. Using async when not needed (unnecessary overhead)`,
    codeExamples: [
      {
        _key: 'ce1',
        _type: 'codeSnippet',
        title: 'Async/Await Patterns',
        language: 'typescript',
        code: `// Basic async/await
async function fetchUser(id: string) {
  try {
    const response = await fetch(\`/api/users/\${id}\`);
    if (!response.ok) throw new Error('User not found');
    const user = await response.json();
    return user;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw error;
  }
}

// Parallel execution with Promise.all
async function fetchDashboard(userId: string) {
  const [user, posts, notifications] = await Promise.all([
    fetchUser(userId),
    fetchPosts(userId),
    fetchNotifications(userId),
  ]);
  return { user, posts, notifications };
}

// Sequential (when order matters)
async function processItems(items: string[]) {
  const results = [];
  for (const item of items) {
    const result = await processItem(item); // One at a time
    results.push(result);
  }
  return results;
}`,
        explanation: 'Use try/catch for error handling. Promise.all runs multiple async operations in parallel (faster). Sequential await is needed when each step depends on the previous one.',
      },
    ],
    tags: ['javascript', 'async', 'await', 'promises', 'asynchronous'],
    lastVerified: '2024-12-01T00:00:00Z',
  },
  {
    _id: 'tutorial-js-array-methods',
    _type: 'tutorial',
    title: 'JavaScript Array Methods Cheatsheet',
    slug: { _type: 'slug', current: 'javascript-array-methods' },
    topic: { _type: 'reference', _ref: 'topic-javascript' },
    difficulty: 'beginner',
    content: `JavaScript arrays come with powerful built-in methods for transforming, filtering, and working with data.

## Transforming
- map(fn): create a new array by transforming each element
- flatMap(fn): map + flatten one level
- Array.from(): create an array from iterable

## Filtering
- filter(fn): keep elements that pass a test
- find(fn): get first element that passes a test
- findIndex(fn): get index of first match

## Testing
- some(fn): does any element pass the test?
- every(fn): do all elements pass the test?
- includes(value): does the array contain this value?

## Reducing
- reduce(fn, initial): reduce array to a single value
- reduceRight(fn, initial): reduce from right to left

## Adding/Removing
- push(...items): add to end (mutates)
- pop(): remove from end (mutates)
- unshift(...items): add to start (mutates)
- shift(): remove from start (mutates)
- splice(start, count, ...items): add/remove at index (mutates)

## Non-Mutating Alternatives
- concat(): combine arrays
- slice(start, end): extract a portion
- spread: [...arr, newItem]
- toSorted(), toReversed(), toSpliced(): new non-mutating versions

## Ordering
- sort(fn): sort in place (mutates!)
- reverse(): reverse in place (mutates!)
- toSorted(fn): sort without mutating (ES2023)`,
    codeExamples: [
      {
        _key: 'ce1',
        _type: 'codeSnippet',
        title: 'Common Array Operations',
        language: 'typescript',
        code: `const users = [
  { name: 'Alice', age: 28, active: true },
  { name: 'Bob', age: 35, active: false },
  { name: 'Charlie', age: 22, active: true },
];

// Filter active users
const active = users.filter(u => u.active);
// [{ name: 'Alice', ... }, { name: 'Charlie', ... }]

// Get names only
const names = users.map(u => u.name);
// ['Alice', 'Bob', 'Charlie']

// Find specific user
const bob = users.find(u => u.name === 'Bob');

// Check conditions
const allActive = users.every(u => u.active); // false
const someActive = users.some(u => u.active); // true

// Reduce to total age
const totalAge = users.reduce((sum, u) => sum + u.age, 0); // 85

// Chain methods
const activeNames = users
  .filter(u => u.active)
  .map(u => u.name)
  .sort();
// ['Alice', 'Charlie']`,
        explanation: 'Array methods can be chained together for powerful data transformations. filter → map → sort is a very common pattern. Remember: map, filter, reduce return new arrays and don\'t mutate the original.',
      },
    ],
    tags: ['javascript', 'arrays', 'methods', 'map', 'filter', 'reduce'],
    lastVerified: '2024-12-01T00:00:00Z',
  },
];

async function seed() {
  console.log('🌱 Seeding DevGuru Knowledge Base...\n');

  // Seed topics
  console.log('📚 Creating topics...');
  for (const topic of topics) {
    try {
      await client.createOrReplace(topic);
      console.log(`  ✅ ${topic.icon} ${topic.name}`);
    } catch (err) {
      console.error(`  ❌ Failed to create topic: ${topic.name}`, err);
    }
  }

  console.log('\n📖 Creating tutorials...');
  for (const tutorial of tutorials) {
    try {
      await client.createOrReplace(tutorial);
      console.log(`  ✅ ${tutorial.title}`);
    } catch (err) {
      console.error(`  ❌ Failed to create tutorial: ${tutorial.title}`, err);
    }
  }

  console.log('\n✨ Seeding complete!');
  console.log(`   ${topics.length} topics created`);
  console.log(`   ${tutorials.length} tutorials created`);
}

seed().catch(console.error);
