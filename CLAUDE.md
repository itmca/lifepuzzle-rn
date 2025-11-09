# CLAUDE.md

LifePuzzle React Native 프로젝트 작업 가이드

## 프로젝트 컨텍스트

**앱**: 소중한 사람들과의 추억을 모으고 기록하는 모바일 애플리케이션
**핵심 기술**: React Native + TypeScript, Recoil, React Navigation
**주요 기능**: 추억 수집 및 기록, 갤러리 관리, AI 사진 생성, 소셜 로그인

## 개발 컨벤션

### Git & 커밋

- Chris Beams 스타일: 명령형, 50자 이내, 첫 글자 대문자
- 브랜치: `<type>/<ticket-no>-<subject>` (예: `feat/LP-1-user-auth`)
- 각 커밋은 단일 목적, 성격별 분리 필수

### 파일 구조

- **페이지 컴포넌트**: `app/pages/[Domain]/[PageName]/`
- **단일 페이지 전용 컴포넌트**: `app/pages/[Page]/components/`
- **공통 컴포넌트**: `app/components/` (2개 이상 페이지에서 사용)
- **파일명**: TSX는 PascalCase, TS는 kebab-case.category.ts

### 코딩 스타일

- Hook 순서: Refs → React hooks → Recoil → Navigation → Memoized → Custom hooks → Handlers → useEffect
- 변수: camelCase, 상수: UPPER_SNAKE_CASE
- 함수: 동사로 시작 (handle*, validate*, fetch\*)

## 작업 효율성 가이드

### 컴포넌트 작업 시

1. 기존 유사 컴포넌트 먼저 확인 (`app/components/`, `app/pages/*/components/`)
2. 재사용성 고려하여 위치 결정 (단일 vs 공통)
3. 기존 스타일링 패턴 따르기 (React Native Paper, styled-components)

### 상태 관리

- Recoil 사용: `*State`, `*Atom` 네이밍
- 페이지별 상태는 해당 페이지 폴더 내 관리 고려

### 작업 우선순위

1. 기존 코드 패턴 분석 및 활용
2. 타입 안전성 확보 (TypeScript strict)
3. 성능 고려 (useMemo, useCallback 적절히 활용)
4. 접근성 및 UX 일관성

## 커스텀 명령어

**`claude pr`**: PR 템플릿 기반 자동 생성

- 작업 배경, 내용, 참고사항 구조화
- 커밋 히스토리 분석하여 의미있는 제목/본문 작성

**`claude sync`**: main 브랜치 동기화

- main 브랜치로 체크아웃
- 최신 변경사항 pull

**`claude new <브랜치명>`**: 새로운 작업 브랜치 생성

- main에서 최신 상태로 pull
- 지정한 이름으로 새 브랜치 생성
- 예시: `claude new feat/LP-123-user-profile`

## 문서 참조

- [Code Style](./docs/CODE_STYLE.md): Hook 순서, 컴포넌트 구조
- [Naming](./docs/NAMING.md): 파일명, 변수명, 타입 네이밍
- [Folder Structure](./docs/FOLDER_STRUCTURE.md): 페이지 그룹핑, 컴포넌트 배치
- [Git Workflow](./docs/GIT_WORKFLOW.md): 브랜치 전략, 상세 커밋 가이드
