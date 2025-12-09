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

### PR 제목 작성 규칙

- **50자 제한 엄수**: Chris Beams 규칙에 따라 제목은 50자를 초과하면 안됨
- **create-pr 사용 시 주의**: 자동 생성된 제목이 50자를 초과하면 수동으로 줄여야 함
- **핵심 내용 우선**: 긴 제목은 핵심 동작만 남기고 세부사항 제거
- **마침표 규칙**: 마지막에 마침표(.) 금지, 중간에는 허용 (예: "Bump version to 1.2.2 for app store release")
- **예시 단축법**:
  - "Add AI video API integration to MediaCarousel and fix AiPhotoMakerPage hook error" (79자) → "Add AI video API integration to MediaCarousel" (47자)
  - "Fix invalid hook call error in AiPhotoMakerPage component" (55자) → "Fix invalid hook call error in AiPhotoMakerPage" (46자)

### 파일 구조

- **페이지 컴포넌트**: `app/pages/[Domain]/[PageName]/`
- **단일 페이지 전용 컴포넌트**: `app/pages/[Page]/components/`
- **공통 컴포넌트**: `app/components/` (2개 이상 페이지에서 사용)
- **서비스 계층**: `app/services/[domain]/` (도메인별 분리)
- **파일명**: TSX는 PascalCase, TS는 kebab-case.category.ts

**폴더 구조 변경 시 문서 업데이트 필수:**

- 새 페이지/컴포넌트/서비스 추가 시 → `docs/FOLDER_STRUCTURE.md` 업데이트
- 기존 구조 변경 시 → 해당 섹션 수정
- 새로운 폴더 패턴 도입 시 → 가이드라인 추가

### 코딩 스타일

- Hook 순서: Refs → React hooks → Recoil → Navigation → Memoized → Custom hooks → Handlers → useEffect
- 변수: camelCase, 상수: UPPER_SNAKE_CASE
- 함수: 동사로 시작 (handle*, validate*, fetch\*)

### Navigation

**매직 스트링 사용 (권장)**

- `navigate`, `reset` 등 실제 네비게이션 호출 시 매직 스트링 사용
- TypeScript가 전역 타입 체크로 안전성 보장
- 코드 간결성 유지

```typescript
// ✅ 권장: 매직 스트링 사용
navigation.navigate('App', {
  screen: 'StoryViewNavigator',
  params: {
    screen: 'Story',
  },
});

// ❌ 비권장: 상수 사용 (불필요한 import, 코드 복잡도 증가)
import { APP_SCREENS, STORY_VIEW_SCREENS } from '...';
navigation.navigate(ROOT_SCREENS.APP, {
  screen: APP_SCREENS.STORY_VIEW_NAVIGATOR,
  params: {
    screen: STORY_VIEW_SCREENS.STORY,
  },
});
```

**상수 사용 예외**

- Navigator 타입 정의 시에만 상수 사용 (오타 방지)
- Deep linking 설정에서 상수 사용

```typescript
// ✅ Navigator 정의: 상수 사용
export type AppParamList = {
  [APP_SCREENS.HOME]: undefined;
};
```

자세한 내용: [Navigation Guidelines](./docs/NAVIGATION.md)

### Services

**객체 네임스페이스 사용 (권장)**

- React/React Native에서는 클래스 대신 함수형 패턴 권장
- 순수 함수 모음은 객체 리터럴로 구현
- Tree-shaking 및 번들 크기 최적화

```typescript
// ✅ 권장: 객체 네임스페이스
export const MyService = {
  method1(param: string): string {
    return param.toUpperCase();
  },
  method2(value: number): number {
    return value * 2;
  },
} as const;

// ❌ 비권장: static 클래스
export class MyService {
  static method1(param: string): string {
    return param.toUpperCase();
  }
  static method2(value: number): number {
    return value * 2;
  }
}
```

**클래스 사용 예외**

- 내부 상태를 가진 Storage 계층 (`LocalStorage`, `SecureStorage`)
- 인스턴스 생성이 필요한 경우

```typescript
// ✅ 내부 상태를 가진 경우: 클래스 사용
export class LocalStorage {
  private static storage = new MMKV();

  static get(key: string) {
    return this.storage.getString(key);
  }
}
```

자세한 내용: [Service Layer Guidelines](./docs/SERVICES.md)

## 보안 가이드라인

### 필수 준수사항

- **인증 토큰**: `SecureStorage` 사용 필수 (LocalStorage 절대 금지)
- **로깅**: `console.log` 대신 `logger` 사용 필수
- **WebView**: 보안 속성 적용 필수 (`allowFileAccess={false}`, `mixedContentMode="never"`)
- **Deep Link**: 파라미터 검증 필수

### 저장소 구분

| 저장소          | 용도                  | 암호화 |
| --------------- | --------------------- | ------ |
| `SecureStorage` | 인증 토큰, 민감 정보  | O      |
| `LocalStorage`  | userNo, onboarding 등 | X      |

### Logger 사용

```typescript
import logger from '../utils/logger';
logger.debug('...'); // 개발만
logger.error('...'); // 항상
```

자세한 내용: [Security Guidelines](./docs/SECURITY.md)

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

## 문서 참조

- [Code Style](./docs/CODE_STYLE.md): Hook 순서, 컴포넌트 구조
- [Naming](./docs/NAMING.md): 파일명, 변수명, 타입 네이밍
- [Folder Structure](./docs/FOLDER_STRUCTURE.md): 페이지 그룹핑, 컴포넌트 배치
- [Navigation](./docs/NAVIGATION.md): 네비게이션 사용 가이드, 매직 스트링 vs 상수
- [Services](./docs/SERVICES.md): 서비스 레이어 가이드, 객체 네임스페이스 vs 클래스
- [Git Workflow](./docs/GIT_WORKFLOW.md): 브랜치 전략, 상세 커밋 가이드
- [Security](./docs/SECURITY.md): 보안 가이드라인, 민감 데이터 처리
