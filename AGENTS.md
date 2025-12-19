# Repository Guidelines

## Project Context

- App: mobile application to collect and 기록 memories with loved ones.
- Stack: React Native + TypeScript, Recoil, React Navigation.
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
- `npm run lint` — ESLint across repo. `npm run test` — Jest suite (also runs on pre-push).

## Coding Style & Naming Conventions

- TypeScript + React Native; ESLint extends `@react-native`. Format with Prettier (2-space indent, single quotes, trailing commas, avoid arrow parens).
- Follow hook/variable ordering from `docs/CODE_STYLE.md` (refs → React hooks → stores → navigation hooks → memoized values → derived vars → custom hooks → handlers → effects).
- Naming from `docs/NAMING.md`: components `PascalCase.tsx`, supporting TS files `kebab-case.category.ts` (e.g., `photo-selector.service.ts`), folders for pages in PascalCase, others kebab-case. Variables/functions in camelCase, constants UPPER_SNAKE_CASE, hooks `useSomething`.
- Keep components small and reusable; colocate feature-specific assets with their page where reasonable.
- Use existing UI patterns (React Native Paper, styled-components) and keep visual consistency.

## Navigation Conventions

- Use magic strings directly in `navigate`/`reset` calls; rely on global types for safety.
- Use constants only in navigator type definitions or deep linking config.

## Service Layer Conventions

- Prefer object namespaces for stateless utilities; avoid static classes.
- Allow classes only when internal state or instancing is required (e.g., storage wrappers).

## Security & Logging

- Store auth tokens and sensitive data in `SecureStorage` only; never in `LocalStorage`.
- Use `logger` (not `console.log`) for logging.
- WebView must include security props like `allowFileAccess={false}` and `mixedContentMode="never"`.
- Validate deep link parameters.

## Containers & Layout

- Follow the container hierarchy from `docs/CONTAINER.md`: `PageContainer` → `ScrollContainer` (as needed) → `ContentContainer`.

## State Management

- Follow existing patterns for Recoil/Zustand in `app/stores/` and reference `docs/ZUSTAND_PATTERNS.md` when applicable.

## Testing Guidelines

- Jest preset `react-native`; place specs in `__tests__/` or alongside modules as `*.test.ts(x)`.
- Pre-push hook runs `npm test`; keep suites deterministic and avoid remote calls.
- Add tests for new logic paths and regressions; snapshot UI only when stable to reduce churn.

## Commit & Pull Request Guidelines

- Branch naming: `<type>/<ticket>-<subject>` (e.g., `feat/LP-15-photo-upload-bug`). Trunk-Based flow merges to `main`.
- Commits follow Chris Beams/commitlint rules: imperative subject, first letter uppercase, ≤50 chars, no trailing period, blank line before body. `pretty-quick` formats staged files on pre-commit; commitlint runs on commit-msg.
- PR template fields (`작업 배경`, `작업 내용`, `참고 사항`) are required. Summarize scope, link issues/tickets, and add screenshots/recordings for UI changes. Apply P1–P5 review labels per template guidance.
- PR titles must be ≤50 chars; if auto-generated titles exceed the limit, shorten to the core change without trailing period.

## Security & Configuration Tips

- Environment files: `.env.develop` and `.env.production` are read via `react-native-config` (Android scripts set `ENVFILE` explicitly). Do not commit secrets; prefer local `.env`.
- After dependency or native module changes, rerun `npm run preios` / `npm run preandroid` to regenerate codegen and reinstall Pods/Gradle outputs.
