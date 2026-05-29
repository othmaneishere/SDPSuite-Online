# Project Instructions: SDP Suite Online

## Coding Standards

- **Linter**: ESLint is mandatory. Run `npm run lint` before committing.
- **Formatter**: Prettier is used for all files. Run `npm run format` to ensure consistency.
- **Type Safety**: TypeScript must be strictly followed. Avoid `any`. Run `npm run type-check`.
- **Commit Messages**: Use [Conventional Commits](https://www.conventionalcommits.org/).
  - Format: `<type>(<scope>): <subject>`
  - Example: `feat(workspace): add new Porters 5 Forces chart`

## Architecture & Workflows

- **Framework**: React (TypeScript) with Vite.
- **Styling**: TailwindCSS via `@tailwindcss/vite`.
- **Database/Auth**: Supabase (Cloud Database).
- **Worksheets**: State is managed locally and synced to Supabase based on `group_id`.

## Reliability

- Always use `ErrorBoundary` for major UI components.
- Ensure all Supabase calls are wrapped in `try/catch`.
- Validate all user inputs.

For detailed guidelines, see `GUIDELINES.md`.
