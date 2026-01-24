# Repository Guidelines

## Project Context

- App: mobile application to collect and 기록 memories with loved ones.
- Stack: React Native + TypeScript, Zustand, React Navigation.
- Key features: memory collection/recording, gallery management, AI photo generation, social login.

## Project Structure & Module Organization

- Mobile app code lives in `app/` (`app.tsx` entry) with feature pages under `app/pages/`, shared UI in `app/components/`, navigation setup in `app/navigation/`, state in `app/stores/`, API logic in `app/services/`, and utilities/types in `app/utils/` and `app/types/`.
- Native projects are in `ios/` and `android/`; generated codegen artifacts and CocoaPods installs run from there.
- Tests sit in `__tests__/` (Jest, React Native preset). Developer docs and conventions are in `docs/`.
- Root configs to know: `babel.config.js`, `metro.config.js`, `tsconfig.json`, `.eslintrc.js`, `.prettierrc.js`, and `commitlint.config.ts`.
- If you add or change folders/pages/components, update `docs/FOLDER_STRUCTURE.md`.

## Build, Test, and Development Commands

- `npm install` — install dependencies (Node 20+ required).
- `npm start` — launch Metro bundler.
- `npm run ios:dev` / `npm run ios:prod` — run iOS schemes `lifepuzzle_dev` or `lifepuzzle_prod`.
- `npm run android:dev` / `npm run android:prod` — run Android with `ENVFILE=.env.develop` or `.env.production`; use `:dev-release` or `:prod-release` for release variants.
- `npm run preios` / `npm run preandroid` — prep native builds (codegen, Pods, Gradle clean/codegen).
- `npm run lint` — ESLint across repo.
- `npm run test` — Jest suite (also runs on pre-push).
- `npm test -- --testNamePattern="specific test name"` — run single test by name.
- `npm test -- path/to/test.test.tsx` — run single test file.
- `npm test -- --watch` — run tests in watch mode.

## Code Style & Import Patterns

- TypeScript + React Native; ESLint extends `@react-native`. Format with Prettier (2-space indent, single quotes, trailing commas, avoid arrow parens).
- Import order: React → React Native → Third-party → Internal modules → Relative imports:
  ```ts
  import React from 'react';
  import { View, Text } from 'react-native';
  import { useNavigation } from '@react-navigation/native';
  import { useUserStore } from '../stores/user-store';
  import { Button } from './Button';
  ```
- Follow hook/variable ordering from `docs/CODE_STYLE.md` (refs → React hooks → stores → navigation hooks → memoized values → derived vars → custom hooks → handlers → effects).
- Reference stability: Use `useMemo`/`useCallback` for arrays/objects passed to custom hooks or useEffect dependencies to prevent infinite loops.

## Naming Conventions

- Components: `PascalCase.tsx` (e.g., `UserProfileCard.tsx`)
- TypeScript files: `kebab-case.category.ts` (e.g., `photo-selector.service.ts`)
- Page folders: `PascalCase` (e.g., `HomePage/`)
- Feature folders: `kebab-case` (e.g., `home-tab/`)
- Variables/functions: `camelCase`
- Constants: `UPPER_SNAKE_CASE`
- Custom hooks: `useSomething`
- Zustand stores: `useSomethingStore`
- Props interfaces: `ComponentNameProps`

## Error Handling & Logging

- Use `logger` instead of `console.log`:
  ```ts
  import logger from '../utils/logger';
  logger.debug('Debug info:', data);
  logger.error('Error:', error);
  ```
- Never log sensitive data (tokens, passwords, personal info).
- Store auth tokens in `SecureStorage` only, never `LocalStorage`.
- Validate deep link parameters with regex patterns.

## Component & State Management

- Keep components small and reusable; colocate feature-specific assets with their page.
- Use existing UI patterns (React Native Paper, styled-components) for visual consistency.
- Follow Zustand patterns from `docs/ZUSTAND_PATTERNS.md`.
- Container hierarchy: `PageContainer` → `ScrollContainer` (as needed) → `ContentContainer`.

## Navigation Conventions

- Use magic strings directly in `navigate`/`reset` calls; rely on global types for safety.
- Use constants only in navigator type definitions or deep linking config.

## Testing Guidelines

- Jest preset `react-native`; place specs in `__tests__/` or alongside modules as `*.test.ts(x)`.
- Pre-push hook runs `npm test`; keep suites deterministic and avoid remote calls.
- Add tests for new logic paths and regressions; snapshot UI only when stable.
- Test file structure: `ComponentName.test.tsx` alongside component or in `__tests__/`.

## Security Best Practices

- WebView security props required: `allowFileAccess={false}`, `mixedContentMode="never"`.
- Environment files (`.env.develop`, `.env.production`) never committed.
- Use `npm audit` regularly for dependency security checks.

## Commit & Pull Request Guidelines

- Branch naming: `<type>/<ticket>-<subject>` (e.g., `feat/LP-15-photo-upload-bug`).
- Commits: imperative subject, first letter uppercase, ≤50 chars, no trailing period.
- PR requires template fields (`작업 배경`, `작업 내용`, `참고 사항`) and screenshots for UI changes.
- PR titles must be ≤50 chars; shorten auto-generated titles if needed.

## Development Workflow

- After dependency or native module changes, rerun `npm run preios` / `npm run preandroid`.
- Use `pretty-quick` for pre-commit formatting; `commitlint` validates commit messages.
- ESLint rule `react-hooks/exhaustive-deps` enforced for custom hooks: `useImageDimensions`, `useSingleImageDimension`, `useCarouselManagement`.

## Environment & Tooling

- Node 20+ required; install deps via `npm install` (not yarn/pnpm).
- Metro: `npm start`; packager config in `metro.config.js`.
- TypeScript config extends `@react-native/typescript-config`; `tsconfig.json` includes jest and styled-components types.
- Jest config in `jest.config.js` (react-native preset; transform ignore allows `react-native` and `@react-native` packages; nitro modules mapped to mock).
- Prettier config in `.prettierrc.js` (singleQuote, trailingComma all, arrowParens avoid).
- ESLint root config in `.eslintrc.js`; extends `@react-native` and adds additionalHooks for custom hooks.

## Folder Structure Cheatsheet

- Entry: `app/app.tsx`.
- Pages: `app/pages/` (folders PascalCase per page feature).
- Components: `app/components/` shared UI; keep small and reusable.
- Navigation: `app/navigation/` (stack/tab configs, route types).
- State: `app/stores/` (Zustand patterns; see `docs/ZUSTAND_PATTERNS.md`).
- Services: `app/services/` (API, storage, platform wrappers; see `docs/SERVICES.md`).
- Utils/Types: `app/utils/`, `app/types/` for helpers and shared types.
- Native: `ios/`, `android/`; run platform-specific scripts after native dependency changes.
- Docs: `docs/` contains CODE_STYLE, NAMING, SECURITY, NAVIGATION, CONTAINER, FOLDER_STRUCTURE.

## Types & Formatting

- Prefer explicit return types on exported functions; allow inference for local handlers.
- Avoid `any`; use `unknown` + type narrowing when needed.
- Prefer `type` aliases unless extending is required (then `interface`).
- Keep JSX props sorted logically: required → optional; handlers prefixed with `on`.
- Avoid default React import when unused; prefer `import React from 'react';` per lint preset.

## Networking & Services

- Use service modules under `app/services/` for API calls; keep side effects localized.
- Centralize endpoints and request types; avoid sprinkling base URLs in components.
- Handle errors at the service layer and bubble typed results; no `console.log` debugging.

## State & Async Data

- Zustand: selectors per store; avoid selecting full objects; memoize derived arrays/objects.
- React Query (tanstack) available; prefer for server data with caching over ad-hoc effects.
- Keep optimistic updates and invalidations in query layer; avoid mixing with Zustand state unless necessary.

## UI & Styling

- Use React Native Paper and styled-components for consistent theming.
- Container hierarchy: `PageContainer` → `ScrollContainer` (optional) → `ContentContainer`.
- Keep layout responsive; respect safe areas and keyboard interactions.
- Prefer composition over deep prop drilling; extract subcomponents when JSX grows.

## Navigation Notes

- React Navigation v7; follow patterns in `docs/NAVIGATION.md`.
- Use magic strings directly in navigation calls; route types provide safety.
- For deep links, validate params before navigation; ensure screens handle missing/invalid params gracefully.

## Assets & Media

- Image/video handling via `@shopify/react-native-skia`, `react-native-video`, `react-native-blob-util` as needed.
- Use `@bam.tech/react-native-image-resizer` and image dimension hooks; memoize input arrays.
- Prefer vector icons from `@react-native-vector-icons/*` sets already installed.

## Testing Details

- Jest: react-native preset; transform ignore allows `react-native` scoped packages and `react-native-mmkv`.
- Mock nitro modules via `__mocks__/react-native-nitro-modules.js` (see jest config mapping).
- Co-locate tests as `*.test.tsx` or use `__tests__/`; prefer deterministic, hermetic tests.
- To run a single test file: `npm test -- path/to/file.test.tsx`.
- To run a single test by name: `npm test -- --testNamePattern="name"`.

## Native Builds & Codegen

- iOS: `npm run ios:dev` or `npm run ios:prod` (schemes `lifepuzzle_dev` / `lifepuzzle_prod`).
- Android: `npm run android:dev` / `npm run android:prod` (ENVFILE set in scripts). Use `:dev-release` or `:prod-release` for release variants.
- Regenerate codegen + native deps: `npm run preios` / `npm run preandroid` after dependency/native changes.

## Git & Review Flow

- Branch naming: `<type>/<ticket>-<subject>`; keep subject short (kebab-case).
- Commit messages: imperative, capitalized, ≤50 chars, no trailing period; avoid WIP commits.
- PR template fields required: `작업 배경`, `작업 내용`, `참고 사항`; include screenshots for UI changes.
- Keep PR titles ≤50 chars; trim auto-generated ones.

## Security Checklist

- Never commit `.env*`; Android scripts rely on `ENVFILE` for config selection.
- WebView must set `allowFileAccess={false}`, `mixedContentMode="never"`, and deny file URL access.
- Validate deep link params against regex/whitelists before use.
- Tokens/PII stored only in `SecureStorage`; never log tokens or secrets.
- Run `npm audit` periodically; upgrade vulnerable packages promptly.

## Logging & Diagnostics

- Use `logger` utility; avoid `console.*` in shipped code.
- Prefer structured messages: `logger.error('upload failed', { id, error })`.
- Strip verbose logs before merging; keep debug logs behind environment checks.

## Performance & Stability

- Memoize arrays/objects passed to `useEffect` or custom hooks (e.g., `useImageDimensions`, `useCarouselManagement`).
- Use `useCallback` for handlers passed deep into children to avoid rerenders.
- Avoid heavy work in render; offload to `useMemo` or background threads when available.
