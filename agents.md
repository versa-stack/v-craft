# Agent Instructions for @versa-stack/v-craft

## Project Overview

@versa-stack/v-craft is a Vue 3 drag-and-drop page editor kit that provides a powerful interface for building websites with little programming knowledge. It uses Pinia for state management and integrates with any Vue 3 component.

## Development Environment

- **Node.js version**: v22.9.0 (see `.nvmrc`)
- **Package manager**: npm
- **Project type**: ES Module (`"type": "module"` in package.json)

## Key Technologies

- **Vue 3** - Component framework
- **Pinia** - State management
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Vitest** - Testing framework
- **VitePress** - Documentation
- **Tailwind CSS v4** - Styling
- **FormKit** - Form components
- **semantic-release** - Automated versioning

## Project Structure

- `src/` - Main source code
  - `components/` - Vue components
  - `lib/` - Core library logic
  - `assets/` - SCSS assets
- `docs/` - VitePress documentation
- `tests/` - Test files

## Common Commands

### Development
```bash
npm run build              # Build the library
npm run watch:build        # Watch mode for development
npm run docs:dev           # Start VitePress dev server
npm run docs:build         # Build docs (includes library build)
npm run docs:serve         # Serve built docs
npm run docs:preview       # Preview built docs
```

### Testing
```bash
npm test                  # Run tests
npm run test:coverage     # Run tests with coverage report
```

## Build Process

The build process involves:
1. Building the library with Vite (`npm run build`)
2. Copying the generated CSS to docs theme
3. Building VitePress docs
4. Running post-build CSS injection script (`docs/.vitepress/inject-tailwind-css.js`)

**Important**: The post-build script is critical for ensuring Tailwind CSS is properly injected into the documentation HTML files.

## Documentation

Documentation is built with VitePress and deployed to GitHub Pages. The docs include:
- Installation instructions
- Component usage examples
- Configuration options
- Advanced usage patterns

## Testing

- Uses Vitest for unit testing
- Tests are located in `tests/` directory
- Coverage reports generated with @vitest/coverage-v8
- Uses happy-dom for DOM testing

## Release Process

Uses semantic-release for automated versioning. This package:
- Analyzes commits using conventional commits
- Generates changelog
- Creates GitHub releases
- Publishes to npm

## Core Data Model

### CraftNode vs Blueprint — Critical Distinction

These are two different types and must NOT be confused:

**Blueprint** — template definition for the editor UI palette
```typescript
{
  label: string;
  componentName: string;
  props: Record<string, any>;
  children: Blueprint[];   // <-- Blueprint uses children
}
```

**CraftNode** — runtime instance in the editor state
```typescript
{
  uuid: string;
  componentName: string;
  props: Record<string, any>;
  slots: Record<string, CraftNode[]>;  // <-- CraftNode uses slots
  parentUuid?: string | null;
  visible?: boolean;
  rules?: CraftNodeRules;
  events?: Record<string, string>;
}
```

**Rule**: In all documentation and code examples, CraftNodes always use `slots`, never `children`. Blueprints always use `children`.

### Multi-Slot Support

Components can have multiple named slots. The editor supports this natively:

- `CraftNode.slots` is `Record<string, CraftNode[]>` — keys are slot names (e.g. `"header"`, `"body"`, `"default"`)
- `CraftNodeDatasource.slotName` controls which slot data binding applies to
- Drop behavior targets the first existing slot name, falling back to `"default"`
- `CraftContainerExample.vue` is the reference example for a 2-slot component (`header` + `body`)

### Key Source Files

- `src/lib/craftNode.ts` — `CraftNode` type, `buildCraftNodeTree`, drag/drop rules
- `src/lib/CraftNodeResolver.ts` — resolver type and base class
- `src/store/editor.ts` — Pinia store; `appendNodeTo`/`prependNodeTo` accept optional `slotName`
- `src/lib/dragCraftNode/drop.ts` — drop logic; determines slot from target node's existing slots
- `src/components/CraftNodeEditor.vue` — renders node tree with slot-aware data binding
- `src/components/CraftContainerExample.vue` — reference multi-slot component
- `src/blueprints/default.ts` — default blueprint library

## Important Notes

1. **CSS Injection**: The `docs/.vitepress/inject-tailwind-css.js` script is specific to the VitePress documentation build process. It ensures Tailwind CSS is properly linked in the documentation HTML files. When using v-craft in your own application, iframe CSS injection is an application responsibility (via the `inheritStyles` prop or manual style injection).

2. **TypeScript**: The project uses strict TypeScript. Ensure types are properly defined when making changes.

3. **Vue 3 Compatibility**: All components must be Vue 3 compatible using the Composition API.

4. **Pinia State**: The editor state is managed through Pinia. Understand the store structure before modifying state-related code.

5. **Tailwind CSS v4**: The project uses Tailwind CSS v4 syntax (`@import "tailwindcss"`), not v3.

## Code Style

- Follow existing code patterns
- Use TypeScript for type safety
- Prefer Composition API over Options API
- Keep components focused and reusable
- Add tests for new functionality

## When Working on This Project

1. Always run tests before committing: `npm test`
2. Check the build works: `npm run build`
3. If modifying docs, verify the docs build: `npm run docs:build`
4. Follow conventional commit format for semantic-release to work correctly
5. Ensure TypeScript compilation succeeds with `vue-tsc`
