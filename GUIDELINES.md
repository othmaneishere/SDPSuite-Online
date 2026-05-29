# SDP Suite Online - Coding Standards & Guidelines

## 1. Code Style & Formatting

- **Formatting**: We use [Prettier](https://prettier.io/) for consistent code formatting.
  - Run `npm run format` to format the entire project.
  - Recommended: Enable "Format on Save" in your IDE.
- **Linting**: We use [ESLint](https://eslint.org/) for static analysis.
  - Run `npm run lint` to check for issues.
  - Run `npm run lint:fix` to automatically fix simple issues.

## 2. TypeScript & Type Safety

- **Strict Types**: Always prefer explicit types over `any`.
- **Interfaces vs Types**:
  - Use `interface` for object structures that might be extended.
  - Use `type` for unions, intersections, and simple aliases.
- **Type Checking**: Run `npm run type-check` to verify types across the codebase.

## 3. Git & Commits

- **Conventional Commits**: We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.
  - `feat`: A new feature
  - `fix`: A bug fix
  - `docs`: Documentation only changes
  - `style`: Changes that do not affect the meaning of the code (formatting, missing semi-colons, etc)
  - `refactor`: A code change that neither fixes a bug nor adds a feature
  - `perf`: A code change that improves performance
  - `test`: Adding missing tests or correcting existing tests
  - `build`: Changes that affect the build system or external dependencies
  - `ci`: Changes to our CI configuration files and scripts
  - `chore`: Other changes that don't modify src or test files

## 4. React Best Practices

- **Functional Components**: Use functional components with hooks.
- **Hooks**: Follow the Rules of Hooks. Use custom hooks to encapsulate complex logic.
- **Props**: Use interface/type for prop definitions.
- **Components**: Keep components small and focused. Break down large components into smaller, reusable ones.

## 5. Reliability

- **Error Boundaries**: Use the provided `ErrorBoundary` component for critical UI sections.
- **Safety**: Always handle potential `null` or `undefined` values when fetching data from external APIs (like Supabase).
- **Validation**: Ensure data integrity by validating user inputs before sending them to the database.
